import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBootstrap } from '@/hooks/useBootstrap';
import { useLocale } from '@/hooks/useLocale';
import { buildWhatsAppUrl } from '@/lib/contact';

export default function WhatsAppFAB() {
  const { t } = useTranslation();
  const { data } = useBootstrap();
  const { locale } = useLocale();

  const url = buildWhatsAppUrl(data?.whatsapp_number, t('whatsapp.generic'));

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 md:hidden ${
        locale === 'ar' ? 'left-6' : 'right-6'
      }`}
      aria-label={t('common.whatsapp')}
    >
      <MessageCircle size={24} />
    </a>
  );
}
