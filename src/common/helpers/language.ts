import i18next from "i18next";
import { Locale } from 'date-fns';
import { enUS, es }  from 'date-fns/locale';

/**https://github.com/hypeserver/react-date-range/blob/next/src/locale/index.js */
export const dateRangeResourceLanguage = (): Locale => {
    if (i18next.language.includes('en')) return enUS;
    if (i18next.language.includes('es')) return es;

    return es;
};

export const localesLaraigo = (): any => {
    return { enUS, es }
}