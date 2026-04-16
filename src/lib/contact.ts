export const DEFAULT_WHATSAPP_NUMBER = '966504687739';

export function normalizePhoneNumber(phoneNumber?: string | null) {
  return (phoneNumber || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, '');
}

export function buildWhatsAppUrl(phoneNumber?: string | null, message?: string) {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${normalizedPhoneNumber}${query}`;
}
