import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useBootstrap } from '@/hooks/useBootstrap';
import { useLocale } from '@/hooks/useLocale';
import { useTheme } from '@/hooks/useTheme';
import { buildWhatsAppUrl } from '@/lib/contact';
import { formatNumber } from '@/lib/localization';

const extraFooterEmail = 'infoayman47@gmail.com';

export default function Footer() {
  const { t } = useTranslation();
  const { data } = useBootstrap();
  const { locale } = useLocale();
  const { theme } = useTheme();

  const companyName = locale === 'ar' ? data?.company.company_name_ar : data?.company.company_name;
  const brandName = companyName || 'Dynamix HR Management';
  const whatsappUrl = buildWhatsAppUrl(data?.whatsapp_number);
  const currentYear = formatNumber(new Date().getFullYear(), locale);

  return (
    <footer className={`border-t border-border ${theme === 'dark' ? 'bg-card' : 'bg-gradient-to-b from-card to-secondary/30'}`}>
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          <div>
            <h3 className="mb-2 font-display text-lg font-bold text-foreground">{brandName}</h3>
            <p className="text-sm text-muted-foreground">{t('footer.tagline')}</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">{t('nav.home')}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('nav.home')}
              </Link>
              <Link to="/transfer" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('nav.transfer')}
              </Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">{t('nav.contact')}</h4>
            <div className="flex flex-col gap-2">
              {data?.company.contact_number && (
                <a
                  href={`tel:${data.company.contact_number}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone size={14} /> {data.company.contact_number}
                </a>
              )}
              {data?.company.email && (
                <a
                  href={`mailto:${data.company.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail size={14} /> {data.company.email}
                </a>
              )}
              <a
                href={`mailto:${extraFooterEmail}`}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail size={14} /> {extraFooterEmail}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <MessageCircle size={14} /> {t('common.whatsapp')}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {brandName}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
