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
      /<title>[^<]*<\/title>/,
      `<title>${seo.title || 'Yaygara'}</title>`
    );
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

function generateDecksManifestPlugin() {
  const decksDir = path.resolve(__dirname, 'public/decks');
  const manifestPath = path.resolve(__dirname, 'public/decks-manifest.json');

  const generateManifest = () => {
    if (!fs.existsSync(decksDir)) return;

    let existingManifest: any[] = [];
    if (fs.existsSync(manifestPath)) {
      try {
        const content = fs.readFileSync(manifestPath, 'utf-8');
        const parsed = JSON.parse(content);
        // Handle both old object format and new string array format
        existingManifest = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Failed to parse existing manifest:', e);
      }
    }

    const filesOnDisk = fs.readdirSync(decksDir).filter(f => f.endsWith('.json'));

    // 1. Process existing items from manifest (preserving order)
    const updatedManifest = existingManifest.map(item => {
      // item might be a string (new format) or an object (old format)
      const filename = typeof item === 'string' ? item : item.filename;

      if (filesOnDisk.includes(filename)) {
        // Remove from filesOnDisk list so we know what's left
        const index = filesOnDisk.indexOf(filename);
        if (index > -1) filesOnDisk.splice(index, 1);
        return filename;
      }
      return null; // File no longer exists
    }).filter(Boolean);

    // 2. Add new files found on disk
    const finalManifest = [...updatedManifest, ...filesOnDisk];
    fs.writeFileSync(manifestPath, JSON.stringify(finalManifest, null, 2));
    console.log('✅ Updated simplified decks-manifest.json (preserved order)');
  };

  return {
    name: 'generate-decks-manifest',
    buildStart() {
      generateManifest();
    },
    handleHotUpdate({ file, server }: { file: string; server: any }) {
      if (file.includes('/public/decks/') && file.endsWith('.json')) {
        generateManifest();
        // Notify clients to reload if needed, or just let the manifest change trigger updates
        server.ws.send({ type: 'full-reload' });
      }
    }
  };
}

function generateAssetsManifestPlugin() {
  return {
    name: 'generate-assets-manifest',
    async closeBundle() {
      const distPath = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distPath)) return;

      const getFilesRecursively = (dir: string): string[] => {
        const files: string[] = [];
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
          const res = path.resolve(dir, item.name);
          if (item.isDirectory()) {
            files.push(...getFilesRecursively(res));
          } else {
            files.push(res);
          }
        }
        return files;
      };

      const allFiles = getFilesRecursively(distPath);
      const relativeFiles = allFiles
        .map(file => path.relative(distPath, file))
        .filter(file => {
          // Filter out files we don't want to cache or that are already in CORE_ASSETS
          const excluded = [
            'service-worker.js',
            'assets-manifest.json',
            'decks-manifest.json',
            'index.html'
          ];
          return !excluded.includes(file) && !file.endsWith('.map');
        })
        .map(file => `/${file.replace(/\\/g, '/')}`);

      fs.writeFileSync(
        path.join(distPath, 'assets-manifest.json'),
        JSON.stringify(relativeFiles, null, 2)
      );
      console.log('✅ Generated assets-manifest.json');
    }
  };
}

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [react(), watchDependenciesPlugin(), localizeHTMLPlugin(), generateDecksManifestPlugin(), generateAssetsManifestPlugin()],
    build: {
      minify: true,
      sourcemap: "inline", // Use inline source maps for better error reporting
      rollupOptions: {
        output: {
          sourcemapExcludeSources: false, // Include original source in source maps
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-framer': ['framer-motion'],
            'vendor-radix': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-slider',
              '@radix-ui/react-slot',
              '@radix-ui/react-tooltip'
            ],
            'vendor-utils': ['zustand', 'lucide-react', 'clsx', 'tailwind-merge']
          }
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
