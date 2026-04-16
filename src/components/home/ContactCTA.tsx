import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useBootstrap } from '@/hooks/useBootstrap';
import { useTheme } from '@/hooks/useTheme';
import { buildWhatsAppUrl } from '@/lib/contact';
import BlobCTAButton from '@/components/ui/BlobCTAButton';

export default function ContactCTA() {
  const { t } = useTranslation();
  const { data } = useBootstrap();
  const { theme } = useTheme();

  const url = buildWhatsAppUrl(data?.whatsapp_number, t('whatsapp.generic'));

  return (
    <section className="relative overflow-hidden py-section-y-mobile lg:py-section-y">
      <div
        className={`absolute inset-0 ${
          theme === 'dark' ? 'bg-gradient-to-br from-primary/10 via-background to-accent/10' : 'bg-gradient-to-br from-primary/5 via-card to-accent/5'
        }`}
      />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[100px]" />

      <div className="relative container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-display font-bold text-foreground sm:text-3xl lg:text-4xl"
        >
          {t('contact.cta_title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-md text-muted-foreground"
        >
          {t('contact.cta_sub')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <BlobCTAButton
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            size="section"
            className="gold-glow"
            icon={<MessageCircle size={22} />}
          >
            {t('contact.cta_button')}
          </BlobCTAButton>
        </motion.div>
      </div>
    </section>
  );
}
