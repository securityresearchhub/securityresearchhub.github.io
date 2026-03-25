import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'te' | 'es' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isTranslating: boolean;
  setIsTranslating: (val: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('selected-language');
    return (saved as Language) || 'en';
  });
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    localStorage.setItem('selected-language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isTranslating, setIsTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
