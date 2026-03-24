import { useLocale, Locale } from '../../../context/LocaleContext';
import { Button } from '../../ui/button';

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
      className="text-xs font-medium"
    >
      {locale === 'en' ? 'ES' : 'EN'}
    </Button>
  );
}
