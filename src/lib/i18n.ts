import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const savedLocale = window.localStorage.getItem('locale');
  return savedLocale === 'ar' ? 'ar' : 'en';
};

const en = {
  common: {
    whatsapp: 'WhatsApp',
  },
  nav: { home: 'Home', transfer: 'Transfer Workers', about: 'About Us', contact: 'Contact' },
  hero: {
    headline: "Saudi Arabia's Premier\nDomestic Workforce Agency",
    headline_ar: "Saudi Arabia's Premier Domestic Workforce Agency",
    subheadline: 'Browse verified, pre-screened domestic workers.\nInstant CV access. Direct WhatsApp booking.',
    cta_home: 'Browse Home Workers',
    cta_transfer: 'Browse Transfer Workers',
    cta_whatsapp: 'Chat on WhatsApp',
    badge: '500+ Verified CVs',
  },
  country_selector: {
    title_home: 'Select a Country — Home Workers',
    title_transfer: 'Select a Country — Transfer Workers',
    subtitle_home: 'Choose your preferred country to browse available candidates.',
    subtitle_transfer: 'Select a country for transfer worker listings.',
    badge_suffix: 'CVs',
    coming_soon: 'Coming Soon',
    no_countries: 'No countries available at this time.',
  },
  category_selector: { title: 'Select a Category', back: 'Change Country' },
  filters: {
    search_placeholder: 'Search by name...',
    country: 'Country',
    category: 'Category',
    religion: 'Religion',
    experience: 'Experience',
    age: 'Age',
    status: 'Status',
    status_all: 'All',
    status_available: 'Available',
    status_reserved: 'Reserved',
    priority_only: 'Priority Only',
    clear_all: 'Clear Filters',
    filters_active: '{{count}} active filters',
    filter: 'Filter',
    religions: {
      muslim: 'Muslim',
      christian: 'Christian',
      hindu: 'Hindu',
      buddhist: 'Buddhist',
    },
  },
  candidate_card: {
    download: 'Download CV',
    book_whatsapp: 'Book via WhatsApp',
    reserved_label: 'Reserved',
    priority_label: 'Priority',
    reserved_tooltip: 'This worker is currently reserved and unavailable for booking.',
    experience_label: 'Experience',
    age_label: 'Age',
  },
  whatsapp: {
    message: 'I want this worker as my employee: {{url}}',
    generic: 'Hello, I would like to inquire about your domestic recruitment services.',
  },
  empty_state: {
    no_results: 'No candidates match your current filters.',
    reset_cta: 'Reset Filters',
    loading: 'Finding the best candidates for you...',
  },
  counters: {
    years_experience: 'Years of Experience',
    assigned_workers: 'Workers Assigned',
    available_candidates: 'Available Candidates',
  },
  testimonials: {
    title: 'What Our Clients Say',
    subtitle: 'Trusted by hundreds of Saudi families and businesses',
  },
  contact: {
    cta_title: 'Ready to Find Your Perfect Worker?',
    cta_sub: 'Our team responds within hours via WhatsApp.',
    cta_button: 'Chat on WhatsApp',
  },
  why_us: {
    title: 'Why Choose Us',
    points: [
      'Verified & Pre-screened Candidates',
      'Instant CV Download',
      'Direct WhatsApp Booking',
      'Candidate Screening & Shortlisting',
      'Fast Placement Process',
      'Trusted by Saudi Families',
    ],
  },
  transfer_hero: {
    badge: 'Transfer',
    headline: 'Transfer Worker CVs',
    subheadline: 'Browse verified domestic workers available for transfer within Saudi Arabia.',
  },
  footer: {
    rights: 'All rights reserved.',
    tagline: 'Your trusted partner in domestic workforce recruitment.',
  },
  not_found: {
    title: 'Page not found',
    description: 'Oops! The page you are looking for does not exist.',
    back_home: 'Return to Home',
  },
  locations: {
    riyadh: 'Riyadh',
    jeddah: 'Jeddah',
    dammam: 'Dammam',
  },
};

const ar = {
  common: {
    whatsapp: 'واتساب',
  },
  nav: { home: 'الرئيسية', transfer: 'عمالة النقل', about: 'من نحن', contact: 'تواصل معنا' },
  hero: {
    headline: 'الوكالة الأولى للتوظيف\nالمنزلي في المملكة العربية السعودية',
    headline_ar: "Saudi Arabia's Premier Domestic Workforce Agency",
    subheadline: 'تصفح العمالة المنزلية الموثقة والمفحوصة مسبقاً.\nوصول فوري للسيرة الذاتية. حجز مباشر عبر واتساب.',
    cta_home: 'تصفح العمالة المنزلية',
    cta_transfer: 'تصفح عمالة النقل',
    cta_whatsapp: 'تواصل عبر واتساب',
    badge: 'أكثر من ٥٠٠ سيرة ذاتية موثقة',
  },
  country_selector: {
    title_home: 'اختر الدولة — العمالة المنزلية',
    title_transfer: 'اختر الدولة — عمالة النقل',
    subtitle_home: 'اختر الدولة المناسبة لتصفح المرشحين المتاحين.',
    subtitle_transfer: 'اختر دولة لعرض العمالة المتاحة للنقل.',
    badge_suffix: 'سيرة ذاتية',
    coming_soon: 'قريباً',
    no_countries: 'لا توجد دول متاحة حالياً.',
  },
  category_selector: { title: 'اختر الفئة', back: 'تغيير الدولة' },
  filters: {
    search_placeholder: 'البحث بالاسم...',
    country: 'الدولة',
    category: 'الفئة',
    religion: 'الديانة',
    experience: 'الخبرة',
    age: 'العمر',
    status: 'الحالة',
    status_all: 'الكل',
    status_available: 'متاح',
    status_reserved: 'محجوز',
    priority_only: 'الأولوية فقط',
    clear_all: 'مسح الفلاتر',
    filters_active: '{{count}} فلاتر نشطة',
    filter: 'فلتر',
    religions: {
      muslim: 'مسلم',
      christian: 'مسيحي',
      hindu: 'هندوسي',
      buddhist: 'بوذي',
    },
  },
  candidate_card: {
    download: 'تحميل السيرة الذاتية',
    book_whatsapp: 'حجز عبر واتساب',
    reserved_label: 'محجوز',
    priority_label: 'أولوية',
    reserved_tooltip: 'هذا العامل محجوز حالياً وغير متاح للحجز.',
    experience_label: 'الخبرة',
    age_label: 'العمر',
  },
  whatsapp: {
    message: 'أرغب في توظيف هذا العامل: {{url}}',
    generic: 'مرحباً، أود الاستفسار عن خدمات التوظيف المنزلي.',
  },
  empty_state: {
    no_results: 'لا يوجد مرشحون يطابقون الفلاتر الحالية.',
    reset_cta: 'إعادة ضبط الفلاتر',
    loading: 'جاري البحث عن أفضل المرشحين لك...',
  },
  counters: {
    years_experience: 'سنوات الخبرة',
    assigned_workers: 'عمال تم تعيينهم',
    available_candidates: 'مرشحون متاحون',
  },
  testimonials: {
    title: 'ماذا يقول عملاؤنا',
    subtitle: 'موثوق من قبل مئات العائلات والشركات السعودية',
  },
  contact: {
    cta_title: 'هل أنت مستعد للعثور على العامل المثالي؟',
    cta_sub: 'فريقنا يرد خلال ساعات عبر واتساب.',
    cta_button: 'تواصل عبر واتساب',
  },
  why_us: {
    title: 'لماذا تختارنا',
    points: [
      'مرشحون موثقون ومفحوصون مسبقاً',
      'تحميل فوري للسيرة الذاتية',
      'حجز مباشر عبر واتساب',
      'فحص المرشحين واختيار الأنسب',
      'عملية توظيف سريعة',
      'موثوق من العائلات السعودية',
    ],
  },
  transfer_hero: {
    badge: 'النقل',
    headline: 'سير ذاتية للنقل',
    subheadline: 'تصفح العمالة المنزلية الموثقة المتاحة للنقل داخل المملكة العربية السعودية.',
  },
  footer: {
    rights: 'جميع الحقوق محفوظة.',
    tagline: 'شريكك الموثوق في التوظيف المنزلي.',
  },
  not_found: {
    title: 'الصفحة غير موجودة',
    description: 'عذراً، الصفحة التي تبحث عنها غير موجودة.',
    back_home: 'العودة إلى الرئيسية',
  },
  locations: {
    riyadh: 'الرياض',
    jeddah: 'جدة',
    dammam: 'الدمام',
  },
};

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  supportedLngs: ['en', 'ar'],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  returnNull: false,
});

export default i18n;
