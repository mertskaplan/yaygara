import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslations } from '@/hooks/useTranslations';
import { Copy } from 'lucide-react';

interface AIDeckConstructorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AIDeckConstructorModal: React.FC<AIDeckConstructorModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslations();
    const [prompt, setPrompt] = useState('');

    React.useEffect(() => {
        if (isOpen) {
            setPrompt(t('aiModal.defaultPrompt'));
        }
    }, [isOpen, t]);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
    };

    const openLLM = (baseUrl: string, suffix: string = '') => {
        const fullUrl = baseUrl + encodeURIComponent(prompt) + suffix;
        window.open(fullUrl, '_blank');
    };

    const copyAndOpen = (url: string) => {
        handleCopy();
        window.open(url, '_blank');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent hideClose className="sm:max-w-md w-full h-[95vh] sm:h-auto sm:max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 flex flex-col overflow-hidden border-0 dark:border-0 shadow-2xl">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-display text-center">
                        {t('aiModal.title')}
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 w-full">
                    <DialogDescription className="text-center text-slate-600 dark:text-slate-400 text-base">
                        {t('aiModal.description')}
                    </DialogDescription>
                    <div className="space-y-4 p-1 mt-3">
                        <textarea
                            className="w-full min-h-64 p-4 text-sm font-sans bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none resize-none transition-all text-slate-700 dark:text-slate-300"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />

                        <div className="flex flex-wrap gap-2 pt-2 pb-4">
                            <Button
                                onClick={() => copyAndOpen('https://gemini.google.com/app')}
                                className="bg-[#f04e23] hover:bg-[#f04e23]/90 text-white font-bold rounded-lg px-4 py-2 h-10 transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                                {t('aiModal.llms.gemini')}
                            </Button>
                            <Button
                                onClick={() => openLLM('https://chatgpt.com/?prompt=')}
                                className="bg-[#00a57d] hover:bg-[#00a57d]/90 text-white font-bold rounded-lg px-4 py-2 h-10 transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                                {t('aiModal.llms.chatgpt')}
                            </Button>
                            <Button
                                onClick={() => openLLM('https://claude.ai/new?q=')}
                                className="bg-[#d77655] hover:bg-[#d77655]/90 text-white font-bold rounded-lg px-4 py-2 h-10 transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                                {t('aiModal.llms.claude')}
                            </Button>
                            <Button
                                onClick={() => openLLM('https://grok.com/?q=')}
                                className="bg-[#000000] hover:bg-[#000000]/90 text-white font-bold rounded-lg px-4 py-2 h-10 transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                                {t('aiModal.llms.grok')}
                            </Button>
                            <Button
                                onClick={() => openLLM('https://perplexity.ai/search/new?q=')}
                                className="bg-[#2d555d] hover:bg-[#2d555d]/90 text-white font-bold rounded-lg px-4 py-2 h-10 transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                                {t('aiModal.llms.perplexity')}
                            </Button>
                            <Button
                                onClick={() => copyAndOpen('https://copilot.microsoft.com/')}
                                className="bg-[#0279e1] hover:bg-[#0279e1]/90 text-white font-bold rounded-lg px-4 py-2 h-10 transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                                {t('aiModal.llms.copilot')}
                            </Button>
                            <Button
                                onClick={() => openLLM('https://chat.mistral.ai/chat?q=')}
                                className="bg-[#f9500f] hover:bg-[#f9500f]/90 text-white font-bold rounded-lg px-4 py-2 h-10 transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                                {t('aiModal.llms.mistral')}
                            </Button>
                            <Button
                                onClick={() => copyAndOpen('https://chat.deepseek.com')}
                                className="bg-[#4e6cff] hover:bg-[#4e6cff]/90 text-white font-bold rounded-lg px-4 py-2 h-10 transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                                {t('aiModal.llms.deepseek')}
                            </Button>
                            <Button
                                onClick={handleCopy}
                                className="bg-[#6c757d] hover:bg-[#6c757d]/90 text-white font-bold rounded-lg px-4 py-2 h-10 flex gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                                <Copy className="w-4 h-4" /> {t('aiModal.copyPrompt')}
                            </Button>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="flex-shrink-0 pt-4">
                    <Button
                        onClick={onClose}
                        className="w-full text-lg font-bold h-14 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
                    >
                        {t('aiModal.back')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
