import enMessages from '../messages/en.json';
import esMessages from '../messages/es.json';

const messageMap: Record<string, typeof enMessages> = {
  en: enMessages,
  es: esMessages,
};

export async function getI18nProps(locale: string = 'en') {
  const messages = messageMap[locale] ?? enMessages;
  return { messages, locale };
}
