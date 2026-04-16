import type { PublicBootstrapPayload, Candidate, CandidatesResponse, CandidateFilters } from '@/types';

export const mockBootstrap: PublicBootstrapPayload = {
  company: {
    company_name: "Dynamix HR Management",
    company_name_ar: "دايناميكس لإدارة الموارد البشرية",
    logo: "",
    company_address: "King Fahd Road, Riyadh 12345, Saudi Arabia",
    company_address_ar: "طريق الملك فهد، الرياض ١٢٣٤٥، المملكة العربية السعودية",
    contact_number: "+966504687739",
    email: "infolank@gmail.com",
    timezone: "Asia/Riyadh"
  },
  countries: [
    { en: "Philippines", ar: "الفلبين", slug: "philippines", count_home: 48, count_transfer: 12, logo_or_flag: "🇵🇭" },
    { en: "Indonesia", ar: "إندونيسيا", slug: "indonesia", count_home: 35, count_transfer: 8, logo_or_flag: "🇮🇩" },
    { en: "Ethiopia", ar: "إثيوبيا", slug: "ethiopia", count_home: 22, count_transfer: 5, logo_or_flag: "🇪🇹" },
    { en: "Bangladesh", ar: "بنغلاديش", slug: "bangladesh", count_home: 18, count_transfer: 6, logo_or_flag: "🇧🇩" },
    { en: "Sri Lanka", ar: "سريلانكا", slug: "sri-lanka", count_home: 15, count_transfer: 3, logo_or_flag: "🇱🇰" },
    { en: "Kenya", ar: "كينيا", slug: "kenya", count_home: 12, count_transfer: 4, logo_or_flag: "🇰🇪" },
    { en: "Uganda", ar: "أوغندا", slug: "uganda", count_home: 8, count_transfer: 2, logo_or_flag: "🇺🇬" },
    { en: "India", ar: "الهند", slug: "india", count_home: 0, count_transfer: 0, logo_or_flag: "🇮🇳" },
  ],
  categories: [
    { value: "housemaid", en: "House Maid", ar: "عاملة منزلية" },
    { value: "driver", en: "Private Driver", ar: "سائق خاص" },
    { value: "cook", en: "Cook / Chef", ar: "طباخ" },
    { value: "nanny", en: "Nanny / Babysitter", ar: "مربية أطفال" },
    { value: "gardener", en: "Gardener", ar: "بستاني" },
    { value: "nurse", en: "Home Nurse", ar: "ممرض منزلي" },
  ],
  whatsapp_number: "966504687739",
  reservation_durations: ["1 Month", "3 Months", "6 Months"],
  settings: { default_country: "philippines", default_agent: "main" },
  testimonials: [
    { name: "Ahmad Al-Rashid", name_ar: "أحمد الراشد", text: "Exceptional service! Found the perfect housemaid within days. Professional team and verified candidates.", text_ar: "خدمة استثنائية! وجدنا العاملة المثالية خلال أيام. فريق محترف ومرشحون موثوقون.", rating: 5, location: "Riyadh" },
    { name: "Fatima Al-Harbi", name_ar: "فاطمة الحربي", text: "The WhatsApp booking made everything so easy. Our new nanny is wonderful and exactly what we needed.", text_ar: "الحجز عبر واتساب جعل كل شيء سهلاً. المربية الجديدة رائعة وما كنا نبحث عنه بالضبط.", rating: 5, location: "Jeddah" },
    { name: "Mohammed Al-Qahtani", name_ar: "محمد القحطاني", text: "Trusted agency with transparent process. I've recommended them to all my friends and family.", text_ar: "وكالة موثوقة بعملية شفافة. لقد أوصيت بهم لجميع أصدقائي وعائلتي.", rating: 5, location: "Dammam" },
  ],
  counters: {
    available_candidates: 158,
    assigned_workers: 5800,
    years_experience: 15
  }
};

const names = [
  "Maria Santos", "Dewi Lestari", "Amina Haile", "Fatima Rahman", "Priya Kumari",
  "Grace Wanjiku", "Sarah Nambi", "Lina Cruz", "Siti Nurhaliza", "Meron Tadesse",
  "Rina Patel", "Joy Mendoza", "Aisha Bello", "Hanna Girma", "Nadia Hassan",
  "Rose Okafor", "Suma Thapa", "Angela Reyes", "Yeshi Bekele", "Carmen Lopez"
];
const religions = ["Muslim", "Christian", "Hindu", "Buddhist"];
const works = ["housemaid", "driver", "cook", "nanny", "gardener", "nurse"];
const countries = ["Philippines", "Indonesia", "Ethiopia", "Bangladesh", "Sri Lanka", "Kenya"];

function generateCandidates(mode: 'Home' | 'Transfer', count: number): Candidate[] {
  return Array.from({ length: count }, (_, i) => {
    const reserved = i % 7 === 0 ? 1 as const : 0 as const;
    const prioritized = i % 5 === 0 ? 1 as const : 0 as const;
    return {
      id: i + 1 + (mode === 'Transfer' ? 1000 : 0),
      name: names[i % names.length],
      image: `https://i.pravatar.cc/400?img=${(i % 70) + 1}`,
      cv_file: `https://example.com/cv/candidate-${i + 1}.pdf`,
      religion: religions[i % religions.length],
      age: 22 + (i % 18),
      experience: `${1 + (i % 8)} years`,
      work: works[i % works.length],
      country: countries[i % countries.length],
      passport: null,
      agent: null,
      reserved,
      reserved_by: reserved ? "Admin" : null,
      reserved_for: reserved ? "Client" : null,
      reservation_duration: reserved ? "3 Months" : null,
      reservation_expiry: reserved ? "2025-06-01" : null,
      reservation_date: reserved ? "2025-03-01" : null,
      prioritized,
      display_mode: mode,
      updated_at: "2025-01-15T10:30:00Z"
    };
  });
}

const homeCandidates = generateCandidates('Home', 80);
const transferCandidates = generateCandidates('Transfer', 40);

export function fetchMockCandidates(filters: CandidateFilters): CandidatesResponse {
  let pool = filters.display_mode === 'Home' ? [...homeCandidates] : [...transferCandidates];

  if (filters.country) pool = pool.filter(c => c.country.toLowerCase().replace(/\s+/g, '-') === filters.country);
  if (filters.work) pool = pool.filter(c => c.work === filters.work);
  if (filters.religion) pool = pool.filter(c => c.religion.toLowerCase() === filters.religion?.toLowerCase());
  if (filters.search) pool = pool.filter(c => c.name.toLowerCase().includes(filters.search!.toLowerCase()));
  if (filters.reserved === '1') pool = pool.filter(c => c.reserved === 1);
  if (filters.reserved === '0') pool = pool.filter(c => c.reserved === 0);
  if (filters.prioritized === '1') pool = pool.filter(c => c.prioritized === 1);

  pool.sort((a, b) => b.prioritized - a.prioritized || a.id - b.id);

  const page = filters.page || 1;
  const pageSize = filters.page_size || 20;
  const start = (page - 1) * pageSize;

  return {
    data: pool.slice(start, start + pageSize),
    total: pool.length,
    page,
    page_size: pageSize,
    total_pages: Math.ceil(pool.length / pageSize),
  };
}
