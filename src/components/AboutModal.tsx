import React from 'react';
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
import { Info, Heart, Code2, Mail, ShieldCheck, Github } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { cn } from '@/lib/utils';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InfoSection = ({ icon: Icon, title, description, children, centered }: { icon?: React.ElementType, title?: string, description?: string, children?: React.ReactNode, centered?: boolean }) => (
    <div className={cn("flex items-start gap-4", centered && "flex-col items-center text-center")}>
        {Icon && (
            <div className="flex-shrink-0 p-3 bg-sky-100 dark:bg-sky-900/40 rounded-full">
                <Icon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            </div>
        )}
        <div className="flex-1">
            {title && <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h4>}
            {description && <p className={cn("text-slate-600 dark:text-slate-400 text-sm leading-relaxed", centered && "text-balance")} dangerouslySetInnerHTML={{ __html: description }} />}
            {children}
        </div>
    </div>
);

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    const { t, translations } = useTranslations();
    const version = "1.2.4"; // Matching service-worker.js
    const licensePoints = (translations?.about?.licensePoints as string[]) || [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent hideClose className="sm:max-w-md w-full h-[95vh] sm:h-auto sm:max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 flex flex-col overflow-hidden border-0 dark:border-0 shadow-2xl">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-display text-center flex items-baseline justify-center gap-2">
                        {t('about.title')}
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {t('about.version', { version })}
                        </span>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        {t('about.intro')}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 w-full pr-4 overflow-y-auto">
                    <div className="space-y-8 py-4">
                        <InfoSection description={t('about.intro')} centered />

                        <InfoSection description={t('about.purpose')} centered />

                        <InfoSection
                            icon={Mail}
                            description={t('about.contact')}
                        />

                        <InfoSection
                            icon={ShieldCheck}
                        >
                            <div className="mt-2 space-y-2">
                                <p className="text-slate-600 dark:text-slate-400 text-sm" dangerouslySetInnerHTML={{ __html: t('about.licenseSummary') }} />
                                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 text-sm space-y-1 ml-2">
                                    {licensePoints.map((point, i) => (
                                        <li key={i} dangerouslySetInnerHTML={{ __html: point }} />
                                    ))}
                                </ul>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{t('about.licenseSuffix')}</p>
                            </div>
                        </InfoSection>

                        <InfoSection
                            icon={Github}
                        >
                            <div className="space-y-3">
                                <p className="text-slate-600 dark:text-slate-400 text-sm" dangerouslySetInnerHTML={{ __html: t('about.sourceCode') }} />
                            </div>
                        </InfoSection>

                        <InfoSection
                            icon={Code2}
                            description={t('about.toolsDescription')}
                        />

                        <InfoSection
                            icon={Heart}
                            description={t('about.outro')}
                        />
                    </div>
                </ScrollArea>

                <DialogFooter className="flex-shrink-0 pt-4">
                    <Button
                        onClick={onClose}
                        className="w-full text-lg font-bold h-14 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
                    >
                        {t('about.closeButton')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
