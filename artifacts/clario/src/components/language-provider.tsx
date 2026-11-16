import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  translateText,
  type ClarioLanguage,
} from '@/lib/localization';

type LanguageContextValue = {
  language: ClarioLanguage;
  direction: 'rtl' | 'ltr';
  setLanguage: (language: ClarioLanguage) => void;
  toggleLanguage: () => void;
  t: (text: string) => string;
};

const preferenceKey = 'clario-language';
const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): ClarioLanguage {
  try {
    return localStorage.getItem(preferenceKey) === 'en' ? 'en' : 'ar';
  } catch {
    return 'ar';
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<ClarioLanguage>(getInitialLanguage);
  const setLanguage = useCallback((nextLanguage: ClarioLanguage) => {
    setLanguageState(nextLanguage);
    try {
      localStorage.setItem(preferenceKey, nextLanguage);
    } catch {
      // The page can still switch languages when browser storage is unavailable.
    }
  }, []);
  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  }, [language, setLanguage]);
  const t = useCallback(
    (text: string) => translateText(text, language),
    [language],
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction: language === 'ar' ? 'rtl' : 'ltr',
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider.');
  }
  return context;
}

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();
  const nextLanguageLabel =
    language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية';

  return (
    <button
      type="button"
      className={`clario-language-switcher ${className}`.trim()}
      onClick={toggleLanguage}
      aria-label={nextLanguageLabel}
      title={nextLanguageLabel}
      data-testid="button-language-switch"
    >
      {language === 'ar' ? 'EN' : 'عربي'}
    </button>
  );
}
