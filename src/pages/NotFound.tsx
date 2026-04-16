import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t('not_found.title')}</p>
        <p className="mb-6 text-sm text-muted-foreground">{t('not_found.description')}</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          {t('not_found.back_home')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
