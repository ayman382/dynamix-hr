import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, MessageCircle } from 'lucide-react';
import { useBootstrap } from '@/hooks/useBootstrap';
import { useLocale } from '@/hooks/useLocale';
import { useTheme } from '@/hooks/useTheme';
import { buildWhatsAppUrl } from '@/lib/contact';
import BlobCTAButton from '@/components/ui/BlobCTAButton';

export default function Navbar() {
  const { t } = useTranslation();
  const { data } = useBootstrap();
  const { locale, setLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const companyName = locale === 'ar' ? data?.company.company_name_ar : data?.company.company_name;
  const whatsappUrl = buildWhatsAppUrl(data?.whatsapp_number);

  useEffect(() => {
    let frameId = 0;

    const onScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        frameId = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = useMemo(
    () => [
      { to: '/', label: t('nav.home') },
      { to: '/transfer', label: t('nav.transfer') },
    ],
    [t],
  );

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Link to="/" className="font-display text-xl font-bold text-foreground">
              {companyName || 'Dynamix HR Management'}
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextLocale = locale === 'en' ? 'ar' : 'en';
                  setLocale(nextLocale);
                }}
                className="rounded-micro bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-muted"
              >
                {locale === 'en' ? 'عربي' : 'EN'}
              </button>
              <button
                onClick={toggleTheme}
                className="rounded-micro p-2 text-muted-foreground transition-colors hover:bg-secondary"
                aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <BlobCTAButton
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="header"
                className="hidden md:inline-flex"
                icon={<MessageCircle size={16} />}
              >
                {t('common.whatsapp')}
              </BlobCTAButton>
              <button onClick={() => setMobileOpen(true)} className="p-2 text-foreground md:hidden" aria-label="Open menu">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-background"
          >
            <div className="flex h-16 items-center justify-between px-4">
              <span className="font-display text-xl font-bold text-foreground">{companyName || 'Dynamix HR Management'}</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-foreground" aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={link.to} className="text-2xl font-display font-bold text-foreground">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <BlobCTAButton
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="header"
                  icon={<MessageCircle size={18} />}
                >
                  {t('common.whatsapp')}
                </BlobCTAButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
