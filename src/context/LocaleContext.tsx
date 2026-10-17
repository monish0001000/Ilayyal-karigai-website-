import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';

export type Locale = 'en' | 'ta';

export interface Translations {
  nav: {
    catalogue: string;
    archive: string;
    new_arrivals: string;
    bestsellers: string;
    story: string;
    contact: string;
    admin: string;
    whatsapp: string;
    back_to_atelier: string;
    all_pieces: string;
  };
  cards: {
    quick_view: string;
    add_to_bag: string;
    enquire: string;
    bestseller: string;
    new_arrival: string;
    only_left: string;
    in_stock: string;
    order_on_wa: string;
    sizes: string;
  };
  collections: {
    all: string;
    everyday_cotton: string;
    traditional_wear: string;
    festive: string;
    contemporary: string;
    new_arrivals: string;
    sarees: string;
    kurtis: string;
    salwars: string;
    lehengas: string;
  };
  hero: {
    eyebrow: string;
    headline_line_1: string;
    headline_with: string;
    headline_intent: string;
    copy: string;
    explore: string;
    our_story: string;
    slide_title: string;
    slide_sub: string;
    atelier_badge: string;
  };
  sections: {
    collections_eyebrow: string;
    collections_title_find: string;
    collections_title_everyday: string;
    collections_note: string;
    statement_eyebrow: string;
    statement_h2_main: string;
    statement_h2_em: string;
    statement_desc: string;
    statement_sig1: string;
    statement_sig2: string;
    statement_sig3: string;
    statement_more: string;
    catalogue_eyebrow: string;
    catalogue_title_pieces: string;
    catalogue_title_close: string;
    view_catalogue: string;
    filter_all: string;
    filter_everyday: string;
    filter_traditional: string;
    filter_festive: string;
    filter_contemporary: string;
    filter_new: string;
    filter_bestsellers: string;
  };
  archive: {
    editorial_badge: string;
    headline: string;
    subtext: string;
    pieces_available: string;
    search_placeholder: string;
    sort_by: string;
    sort_featured: string;
    sort_price_asc: string;
    sort_price_desc: string;
    sort_bestsellers: string;
    sort_newest: string;
    filters_btn: string;
    reset_filters: string;
    no_results: string;
    filter_drawer_title: string;
    in_stock_only: string;
    fabric_heading: string;
  };
  concierge: {
    title: string;
    online_status: string;
    welcome: string;
    placeholder: string;
    send: string;
    chip_stock: string;
    chip_bridal: string;
    chip_custom: string;
    powered_by: string;
  };
}

export const dictionaries: Record<Locale, Translations> = {
  en: {
    nav: {
      catalogue: 'Catalogue',
      archive: 'Collections Archive',
      new_arrivals: 'New Arrivals',
      bestsellers: 'Best Sellers',
      story: 'Our Story',
      contact: 'Contact',
      admin: 'Admin',
      whatsapp: 'WhatsApp',
      back_to_atelier: 'Back to Atelier',
      all_pieces: 'All Pieces',
    },
    cards: {
      quick_view: 'Quick View',
      add_to_bag: 'Add to Bag',
      enquire: 'Enquire',
      bestseller: 'Bestseller',
      new_arrival: 'New Arrival',
      only_left: 'Only {count} left',
      in_stock: 'In Stock',
      order_on_wa: 'Order via WhatsApp',
      sizes: 'Sizes',
    },
    collections: {
      all: 'All Collections',
      everyday_cotton: 'Everyday Cotton',
      traditional_wear: 'Traditional Wear',
      festive: 'Festive Collection',
      contemporary: 'Contemporary Designs',
      new_arrivals: 'New Arrivals',
      sarees: 'Sarees',
      kurtis: 'Kurtis',
      salwars: 'Salwar Sets',
      lehengas: 'Lehengas',
    },
    hero: {
      eyebrow: 'A NEW INDIAN CLOTHING LABEL',
      headline_line_1: 'Crafted',
      headline_with: 'with',
      headline_intent: 'intent.',
      copy: 'Thoughtfully designed silhouettes, natural fabrics and limited collections made exclusively for the ELAIYAL KARIGAI woman.',
      explore: 'EXPLORE COLLECTION',
      our_story: 'OUR STORY',
      slide_title: 'THE INDIRA EDIT',
      slide_sub: 'HANDLOOM COTTON · LIMITED RELEASE',
      atelier_badge: 'ATELIER · 2026',
    },
    sections: {
      collections_eyebrow: '01 — Collections',
      collections_title_find: 'Find your',
      collections_title_everyday: 'everyday.',
      collections_note: 'Five ways to wear\na point of view.',
      statement_eyebrow: '02 — The point of view',
      statement_h2_main: 'Not just clothing.',
      statement_h2_em: 'A signature of our own.',
      statement_desc: 'From fabric selection to silhouette, pattern and finishing, every piece is thoughtfully developed under the ELAIYAL KARIGAI identity.',
      statement_sig1: 'Designed by us.',
      statement_sig2: 'Crafted for you.',
      statement_sig3: 'Available only from ELAIYAL KARIGAI.',
      statement_more: 'More about the label',
      catalogue_eyebrow: '03 — Handcrafted Catalogue',
      catalogue_title_pieces: 'Pieces to',
      catalogue_title_close: 'keep close.',
      view_catalogue: 'View full catalogue',
      filter_all: 'All Pieces',
      filter_everyday: 'Everyday Cotton',
      filter_traditional: 'Traditional Wear',
      filter_festive: 'Festive Wear',
      filter_contemporary: 'Contemporary',
      filter_new: 'New Arrivals',
      filter_bestsellers: 'Best Sellers',
    },
    archive: {
      editorial_badge: 'THE EDITORIAL ARCHIVE',
      headline: 'Wear the meaning.',
      subtext:
        'Each drape, warp, and motif carries ancestral Tamil design sensibility — cut with contemporary poise in small artisanal releases.',
      pieces_available: '{count} Handcrafted Pieces Available',
      search_placeholder: 'Search by weave, motif, or silhouette...',
      sort_by: 'SORT BY:',
      sort_featured: 'Atelier Curation',
      sort_price_asc: 'Price: Low to High',
      sort_price_desc: 'Price: High to Low',
      sort_bestsellers: 'Bestsellers',
      sort_newest: 'New Arrivals',
      filters_btn: 'Filters',
      reset_filters: 'Reset all filters',
      no_results: 'No handcrafted pieces match your exact criteria.',
      filter_drawer_title: 'Filter Collection',
      in_stock_only: 'In-stock pieces only',
      fabric_heading: 'Craft Fabric',
    },
    concierge: {
      title: 'ELAIYAL KARIGAI Concierge',
      online_status: 'Typically replies instantly',
      welcome: 'Hello! How can our atelier assist your styling today?',
      placeholder: 'Type your message...',
      send: 'Send',
      chip_stock: 'Check stock for Yazhini Kurti',
      chip_bridal: 'Book a bridal appointment',
      chip_custom: 'Custom blouse stitching query',
      powered_by: 'Official Atelier WhatsApp Support',
    },
  },
  ta: {
    nav: {
      catalogue: 'தொகுப்பு',
      archive: 'காப்பகம்',
      new_arrivals: 'புதிய வரவுகள்',
      bestsellers: 'சிறந்த தேர்வு',
      story: 'எங்கள் கதை',
      contact: 'தொடர்புக்கு',
      admin: 'நிர்வாகம்',
      whatsapp: 'வாட்ஸ்அப்',
      back_to_atelier: 'முகப்புக்கு திரும்புக',
      all_pieces: 'அனைத்து ஆடைகளும்',
    },
    cards: {
      quick_view: 'விரைவு பார்வை',
      add_to_bag: 'பையில் சேர்க்க',
      enquire: 'விசாரிக்க',
      bestseller: 'சிறந்த தேர்வு',
      new_arrival: 'புதிய வரவு',
      only_left: '{count} மட்டுமே உள்ளது',
      in_stock: 'இருப்பில் உள்ளது',
      order_on_wa: 'வாட்ஸ்அப் மூலம் ஆர்டர்',
      sizes: 'அளவுகள்',
    },
    collections: {
      all: 'அனைத்து ஆடைகளும்',
      everyday_cotton: 'தினசரி பருத்தி',
      traditional_wear: 'பாரம்பரிய உடைகள்',
      festive: 'விழாத் தொகுப்பு',
      contemporary: 'நவீன வடிவமைப்பு',
      new_arrivals: 'புதிய வரவுகள்',
      sarees: 'சேலைகள்',
      kurtis: 'குர்திகள்',
      salwars: 'சல்வார் தொகுப்பு',
      lehengas: 'லெஹங்காக்கள்',
    },
    hero: {
      eyebrow: 'புதிய இந்திய ஆடை அடையாளம்',
      headline_line_1: 'நோக்கத்துடன்',
      headline_with: 'நெய்யப்பட்ட',
      headline_intent: 'கைவினை.',
      copy: 'சிந்தனையுடன் வடிவமைக்கப்பட்ட தோற்றங்கள், இயற்கையான இழைகள் மற்றும் இளையள் காரிகை பெண்மணிக்கான பிரத்யேக படைப்புகள்.',
      explore: 'தொகுப்பை ஆராய்க',
      our_story: 'எங்கள் கதை',
      slide_title: 'இந்திரா தொகுப்பு',
      slide_sub: 'கைத்தறி பருத்தி · குறைந்த வெளியீடு',
      atelier_badge: 'அரங்கம் · 2026',
    },
    sections: {
      collections_eyebrow: '01 — தொகுப்புகள்',
      collections_title_find: 'கண்டறியுங்கள் உங்கள்',
      collections_title_everyday: 'தினசரியை.',
      collections_note: 'அழகியலை அணிய\nஐந்து வழிகள்.',
      statement_eyebrow: '02 — எங்கள் பார்வை',
      statement_h2_main: 'ஆடை மட்டுமல்ல.',
      statement_h2_em: 'எங்கள் பிரத்யேக அடையாளம்.',
      statement_desc: 'துணித் தேர்வு முதல் தையல் வரை ஒவ்வொன்றும் சிந்தனையுடன் இளையள் காரிகை அடையாளத்துடன் உருவாக்கப்படுகிறது.',
      statement_sig1: 'எங்களால் வடிவமைக்கப்பட்டது.',
      statement_sig2: 'உங்களுக்காக உருவாக்கப்பட்டது.',
      statement_sig3: 'இளையள் காரிகையில் மட்டுமே கிடைக்கும்.',
      statement_more: 'ஆடை முத்திரை பற்றி அறிய',
      catalogue_eyebrow: '03 — கைவினை ஆடைப் பட்டியல்',
      catalogue_title_pieces: 'அன்புடன் காக்கப்பட',
      catalogue_title_close: 'வேண்டிய ஆடைகள்.',
      view_catalogue: 'முழு பட்டியலைக் காண்க',
      filter_all: 'அனைத்தும்',
      filter_everyday: 'தினசரி பருத்தி',
      filter_traditional: 'பாரம்பரியம்',
      filter_festive: 'விழாத் தொகுப்பு',
      filter_contemporary: 'நவீன வடிவம்',
      filter_new: 'புதிய வரவுகள்',
      filter_bestsellers: 'சிறந்த தேர்வு',
    },
    archive: {
      editorial_badge: 'சிறப்புத் தொகுப்பு காப்பகம்',
      headline: 'பொருளறிந்து அணிவோம்.',
      subtext:
        'ஒவ்வொரு நெசவும் பாரம்பரிய தமிழ் கைவினை அழகியலையும் நவீன நயத்தையும் சுமந்து சிறிய தொகுப்புகளாக உருவாக்கப்படுகிறது.',
      pieces_available: '{count} கைவினைப் படைப்புகள் உள்ளன',
      search_placeholder: 'நெசவு, உருவம் அல்லது ஆடை வகை தேட...',
      sort_by: 'வரிசைப்படுத்துக:',
      sort_featured: 'சிறப்புத் தேர்வு',
      sort_price_asc: 'விலை: குறைவு முதல் அதிகம்',
      sort_price_desc: 'விலை: அதிகம் முதல் குறைவு',
      sort_bestsellers: 'அதிக விற்பனை',
      sort_newest: 'புதிய வரவுகள்',
      filters_btn: 'வடிகட்டிகள்',
      reset_filters: 'அனைத்து வடிகட்டிகளையும் மீட்டமைக்க',
      no_results: 'உங்கள் விருப்பத்திற்குரிய ஆடைகள் எதுவும் கண்டறியப்படவில்லை.',
      filter_drawer_title: 'ஆடைகளை வடிகட்டுக',
      in_stock_only: 'இருப்பில் உள்ளவை மட்டுமே',
      fabric_heading: 'துணி வகை',
    },
    concierge: {
      title: 'இளையள் காரிகை உதவி',
      online_status: 'உடனடி பதில் கிடைக்கும்',
      welcome: 'வணக்கம்! எங்கள் கைவினை ஆடைகள் குறித்து உங்களுக்கு எவ்வாறு உதவலாம்?',
      placeholder: 'உங்கள் செய்தியைத் தட்டச்சு செய்க...',
      send: 'அனுப்புக',
      chip_stock: 'யாழினி குர்த்தி இருப்பு விவரம்',
      chip_bridal: 'மணப்பெண் ஆடை சந்திப்பு முன்பதிவு',
      chip_custom: 'பிரத்யேக பிளவுஸ் தைக்கும் விவரம்',
      powered_by: 'அங்கீகரிக்கப்பட்ட வாட்ஸ்அப் உதவி',
    },
  },
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Translations;
  getProductName: (product: Product) => string;
  getProductSubtitle: (product: Product) => string;
  getProductCategory: (product: Product) => string;
  getProductFabric: (product: Product) => string;
  getCategoryName: (categoryKeyOrName: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const tamilSubtitleMap: Record<string, string> = {
  'yazhini': 'கைத்தறி தூய பருத்தி குர்த்தி',
  'sempon-selai': 'தூய காஞ்சிபுரம் பாரம்பரிய பட்டு',
  'neelamani': 'இயற்கை கருநீல பருத்திச் சேலை',
  'kurinji': 'கடுகு வண்ண லினன் தினசரி குர்த்தி',
  'senthamarai': 'தாமரை வேலைப்பாடு பட்டு அனார்கலி',
  'poonthalir': 'மென்மையான கைவினை சல்வார் தொகுப்பு',
  'meera': 'அடர்ந்த மெரூன் பட்டு சல்வார் ஆடை',
  'venmathi': 'வெண்மை கைத்தறி ஏ-லைன் குர்த்தி',
  'ponmayil': 'மயில் வண்ண ஜரிகை லெஹங்கா',
  'vaanathi': 'நவீன பிளம் வண்ண டிஷ்யூ சேலை',
  'neelamukil': 'நவீன கைத்தறி கோ-ஆர்ட் தொகுப்பு',
  'thamarai-nizhal': 'பவள வண்ண பட்டு விழா ஆடை',
};

const tamilCategoryMap: Record<string, string> = {
  'Everyday Cotton': 'தினசரி பருத்தி',
  'Traditional Wear': 'பாரம்பரிய உடைகள்',
  'Festive Collection': 'விழாத் தொகுப்பு',
  'Contemporary Designs': 'நவீன வடிவமைப்பு',
  'New Arrivals': 'புதிய வரவுகள்',
  'Best Sellers': 'சிறந்த தேர்வு',
  'all': 'அனைத்தும்',
  'All Pieces': 'அனைத்தும்',
};

const getInitialLocale = (): Locale => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ik_lang');
    if (saved === 'ta' || saved === 'en') return saved;
    const navLang = navigator.language || (navigator as any).userLanguage || '';
    if (navLang.toLowerCase().startsWith('ta')) return 'ta';
  }
  return 'en';
};

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ik_lang', newLocale);
      document.documentElement.lang = newLocale;
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ta' : 'en');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  // Strict language separation: returns purely English or purely Tamil string
  const getProductName = (product: Product): string => {
    if (locale === 'ta') {
      return product.tamil || product.name;
    }
    return product.name;
  };

  const getProductSubtitle = (product: Product): string => {
    if (locale === 'ta') {
      if (product.id && tamilSubtitleMap[product.id]) {
        return tamilSubtitleMap[product.id];
      }
      if (product.collectionCategory === 'Everyday Cotton') return 'கைத்தறி தூய பருத்தி குர்த்தி';
      if (product.collectionCategory === 'Traditional Wear') return 'பாரம்பரிய பட்டுச் சேலை & ஜரிகை';
      if (product.collectionCategory === 'Festive Collection') return 'விழா கால அனார்கலி & லெஹங்கா';
      if (product.collectionCategory === 'Contemporary Designs') return 'நவீன வடிவமைப்பு கோ-ஆர்ட் ஆடை';
      return product.tamil || product.subtitle;
    }
    return product.subtitle;
  };

  const getProductCategory = (product: Product): string => {
    if (locale === 'ta') {
      return tamilCategoryMap[product.collectionCategory] || product.collectionCategory;
    }
    return product.collectionCategory;
  };

  const getProductFabric = (product: Product): string => {
    if (locale === 'ta') {
      const f = (product.fabric || '').toLowerCase();
      if (f.includes('silk') && f.includes('cotton')) return 'பட்டுப் பருத்தி';
      if (f.includes('silk')) return 'தூய பட்டு';
      if (f.includes('cotton')) return 'இயற்கை பருத்தி';
      if (f.includes('linen')) return 'லினன்';
      return 'கைத்தறி';
    }
    return (product.fabric || '').split(' ')[0] || 'Handloom';
  };

  const getCategoryName = (keyOrName: string): string => {
    if (locale === 'ta') {
      if (tamilCategoryMap[keyOrName]) return tamilCategoryMap[keyOrName];
      if (keyOrName.includes('Saree') || keyOrName.includes('சேலை')) return 'சேலைகள்';
      if (keyOrName.includes('Kurti') || keyOrName.includes('குர்த்தி')) return 'குர்திகள்';
      if (keyOrName.includes('Salwar') || keyOrName.includes('சல்வார்')) return 'சல்வார் தொகுப்பு';
      if (keyOrName.includes('Lehenga') || keyOrName.includes('லெஹங்கா')) return 'லெஹங்காக்கள்';
    }
    if (keyOrName === 'all' || keyOrName === 'அனைத்தும்') return 'All Pieces';
    return keyOrName;
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t: dictionaries[locale],
        getProductName,
        getProductSubtitle,
        getProductCategory,
        getProductFabric,
        getCategoryName,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
