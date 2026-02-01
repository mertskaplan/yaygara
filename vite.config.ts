import { defineConfig, loadEnv } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { exec } from "node:child_process";
import pino from "pino";


const logger = pino();

const stripAnsi = (str: string) =>
  str.replace(
    // eslint-disable-next-line no-control-regex -- Allow ANSI escape stripping
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );

const LOG_MESSAGE_BOUNDARY = /\n(?=\[[A-Z][^\]]*\])/g;

const emitLog = (level: "info" | "warn" | "error", rawMessage: string) => {
  const cleaned = stripAnsi(rawMessage).replace(/\r\n/g, "\n");
  const parts = cleaned
    .split(LOG_MESSAGE_BOUNDARY)
    .map((part) => part.trimEnd())
    .filter((part) => part.trim().length > 0);

  if (parts.length === 0) {
    logger[level](cleaned.trimEnd());
    return;
  }

  for (const part of parts) {
    logger[level](part);
  }
};

// 3. Create the custom logger for Vite
const customLogger = {
  warnOnce: (msg: string) => emitLog("warn", msg),

  // Use Pino's methods, passing the cleaned message
  info: (msg: string) => emitLog("info", msg),
  warn: (msg: string) => emitLog("warn", msg),
  error: (msg: string) => emitLog("error", msg),
  hasErrorLogged: () => false,

  // Keep these as-is
  clearScreen: () => { },
  hasWarned: false,
};

function watchDependenciesPlugin() {
  return {
    // Plugin to clear caches when dependencies change
    name: "watch-dependencies",
    configureServer(server: any) {
      const filesToWatch = [
        path.resolve("package.json"),
        path.resolve("bun.lock"),
      ];

      server.watcher.add(filesToWatch);

      server.watcher.on("change", (filePath: string) => {
        if (filesToWatch.includes(filePath)) {
          console.log(
            `\n📦 Dependency file changed: ${path.basename(
              filePath
            )}. Clearing caches...`
          );

          // Run the cache-clearing command
          exec(
            "rm -f .eslintcache tsconfig.tsbuildinfo",
            (err, stdout, stderr) => {
              if (err) {
                console.error("Failed to clear caches:", stderr);
                return;
              }
              console.log("✅ Caches cleared successfully.\n");
            }
          );
        }
      });
    },
  };
}

import fs from 'node:fs';
function localizeHTMLPlugin() {
  const languages = ['en', 'tr'] as const;
  const baseUrl = 'https://yaygara.mertskaplan.com';

  const getLocalizedHtml = (baseHtml: string, lang: string) => {
    const localePath = path.resolve(__dirname, `public/locales/${lang}.json`);
    if (!fs.existsSync(localePath)) return baseHtml;

    const localeData = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
    const seo = localeData.seo || {};

    let html = baseHtml;
    // Replace lang
    html = html.replace('<html lang="en">', `<html lang="${lang}">`);

    // Replace Meta tags
    html = html.replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${seo.description || ''}">`
    );
    html = html.replace(
      /<meta property="og:title" content="[^"]*">/,
      `<meta property="og:title" content="${seo.ogTitle || ''}">`
    );
    html = html.replace(
      /<meta property="og:description" content="[^"]*">/,
      `<meta property="og:description" content="${seo.description || ''}">`
    );

    html = html.replace(
      /"description": "Fun party game based on narration and guessing, played by passing a single device among players."/,
      `"description": "${seo.schemaDescription || ''}"`
    );

    // Remove existing Canonical and Hreflang tags to prevent duplicates
    html = html.replace(/^\s*<link rel="(canonical|alternate)"[^>]*>\r?\n?/gm, '');

    // Add Canonical and Hreflang
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex !== -1) {
      const seoTags = [
        `  <link rel="canonical" href="${baseUrl}/${lang}/">`,
        ...languages.map(l => `  <link rel="alternate" hreflang="${l}" href="${baseUrl}/${l}/">`),
        `  <link rel="alternate" hreflang="x-default" href="${baseUrl}/en/">`
      ].join('\n');

      html = html.slice(0, headEndIndex) + seoTags + '\n' + html.slice(headEndIndex);
    }
    return html;
  };

  return {
    name: 'localize-html-ssg',
    // Handle Dev Server
    transformIndexHtml(html: string, ctx: any) {
      console.log('--- transformIndexHtml called ---');
      const url = ctx.originalUrl || ctx.url || '';
      console.log(`[localizeHTMLPlugin] URL: ${url}`);

      const langMatch = url.match(/\/(en|tr)(\/|$)/);
      const lang = langMatch ? langMatch[1] : 'en';

      console.log(`[localizeHTMLPlugin] Lang: ${lang}`);
      const localizedHtml = getLocalizedHtml(html, lang);
      console.log('[localizeHTMLPlugin] Transformation complete');
      return localizedHtml;
    },
    // Handle Build
    async closeBundle() {
      const distPath = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distPath, 'index.html');

      if (!fs.existsSync(indexPath)) return;

      const baseHtml = fs.readFileSync(indexPath, 'utf-8');

      for (const lang of languages) {
        const html = getLocalizedHtml(baseHtml, lang);

        // Create directory and write file
        const langDir = path.join(distPath, lang);
        if (!fs.existsSync(langDir)) {
          fs.mkdirSync(langDir, { recursive: true });
        }
        fs.writeFileSync(path.join(langDir, 'index.html'), html);
        console.log(`✅ Generated localized HTML for: ${lang}`);
      }
    }
  };
}

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [react(), watchDependenciesPlugin(), localizeHTMLPlugin()],
    build: {
      minify: true,
      sourcemap: "inline", // Use inline source maps for better error reporting
      rollupOptions: {
        output: {
          sourcemapExcludeSources: false, // Include original source in source maps
        },
      },
    },
    customLogger: env.VITE_LOGGER_TYPE === 'json' ? customLogger : undefined,
    // Enable source maps in development too
    css: {
      devSourcemap: true,
    },
    server: {
      allowedHosts: true,
      port: 3000,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
    optimizeDeps: {
      // This is still crucial for reducing the time from when `bun run dev`
      // is executed to when the server is actually ready.
      include: ["react", "react-dom", "react-router-dom"],
      exclude: ["agents"], // Exclude agents package from pre-bundling due to Node.js dependencies
      force: true,
    },
    define: {
      // Define Node.js globals for the agents package
      global: "globalThis",
    },
    // Clear cache more aggressively
    cacheDir: "node_modules/.vite",
  });
};
