import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Heart,
  Menu,
  ShoppingBag,
  X,
  Sparkles,
  PhoneCall,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  Sliders,
  Layers,
  Flame,
  Eye,
  Maximize2,
  MessageCircle,
  Tag,
  Phone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from './components/WhatsAppIcon';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { CollectionsPage } from './pages/CollectionsPage';
import { CategoryFilterBar, CategoryFilterItem } from './components/CategoryFilterBar';
import { ProductCard3D } from './components/ProductCard3D';
import { WhatsAppInquiryModal } from './components/WhatsAppInquiryModal';
import { useLocale } from './context/LocaleContext';
import { useProducts, productService } from './services/productService';
import { authService } from './services/authService';
import { AdminUser, Product, CollectionCategory, StockStatus } from './types';

export const WHATSAPP_PHONE = '+91 98401 82019';
export const WHATSAPP_RAW_NUMBER = '919840182019';

export const getWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_RAW_NUMBER}?text=${encodeURIComponent(message)}`;

const unsplash = (id: string, params = 'auto=format&fit=crop&w=1200&q=85') =>
  `https://images.unsplash.com/${id}?${params}`;

export type { CollectionCategory, Product, StockStatus } from './types';

export const products: Product[] = [
  {
    id: 'yazhini',
    name: 'Yazhini',
    tamil: 'யாழினி',
    subtitle: 'Handloom-Inspired Cotton Kurti',
    category: 'குர்த்தி / Kurti',
    collectionCategory: 'Everyday Cotton',
    price: '₹899',
    priceNumber: 899,
    originalPrice: '₹1,299',
    image: '/product-yazhini.png',
    color: 'Natural cream handloom cotton',
    stock: 'In stock',
    stockStatus: 'in-stock',
    sizes: ['S', 'M', 'L', 'XL'],
    isBestSeller: true,
    salesCount: 540,
    description: 'Woven from breathable handloom-inspired organic cotton, this relaxed kurti features fine neckline detailing and comfortable side slits, tailored for effortless everyday wear.',
    fabric: '100% Breathable Organic Handloom Cotton',
  },
  {
    id: 'sempon-selai',
    name: 'Sempon Selai',
    tamil: 'செம்பொன் சேலை',
    subtitle: 'Pure Kanchipuram Heritage Silk',
    category: 'காஞ்சிபுரம் / Kanchipuram Silk',
    collectionCategory: 'Traditional Wear',
    price: '₹12,800',
    priceNumber: 12800,
    image: '/product-sempon-selai.png',
    color: 'Ruby red silk with antique gold zari',
    stock: 'Only 2 left',
    stockStatus: 'low-stock',
    sizes: ['Free Size (6.3m)'],
    isBestSeller: true,
    salesCount: 185,
    description: 'Heirloom Kanchipuram silk woven with certified electroplated brass-gold zari borders, carrying a traditional temple korvai selvedge.',
    fabric: 'Pure Mulberry Silk with Antique Zari',
  },
  {
    id: 'neelamani',
    name: 'Neelamani',
    tamil: 'நீலமணி',
    subtitle: 'Indigo Handloom Cotton Saree',
    category: 'சேலை / Saree',
    collectionCategory: 'Traditional Wear',
    price: '₹4,800',
    priceNumber: 4800,
    image: '/product-ananya.png',
    color: 'Indigo handloom cotton with gold border',
    stock: 'Only 3 left',
    stockStatus: 'low-stock',
    sizes: ['Free Size (5.5m)'],
    isNewArrival: true,
    description: 'Authentic fermented natural indigo dye and subtle selvedge weaving on crisp chettinad handloom cotton.',
    fabric: '100% Handloom Cotton',
  },
  {
    id: 'kurinji',
    name: 'Kurinji',
    tamil: 'குறிஞ்சிப்பூ',
    subtitle: 'Mustard Linen Daily Kurti',
    category: 'குர்த்தி / Kurti',
    collectionCategory: 'Everyday Cotton',
    price: '₹1,150',
    priceNumber: 1150,
    image: '/product-kurinji.png',
    color: 'Earthy mustard linen with block accents',
    stock: 'In stock',
    stockStatus: 'in-stock',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    isBestSeller: true,
    salesCount: 310,
    description: 'Breathable linen-cotton blend with wooden button placket and discrete side pockets for everyday utility.',
    fabric: 'Linen Cotton Blend',
  },
  {
    id: 'senthamarai',
    name: 'Senthamarai',
    tamil: 'செந்தாமரை',
    subtitle: 'Embroidered Silk Cotton Anarkali',
    category: 'அனார்கலி / Anarkali',
    collectionCategory: 'Festive Collection',
    price: '₹6,400',
    priceNumber: 6400,
    image: '/product-kavya.png',
    color: 'Terracotta silk-cotton with lotus threadwork',
    stock: 'In stock',
    stockStatus: 'in-stock',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isBestSeller: true,
    salesCount: 220,
    description: 'Floor-skimming silhouette with hand-embroidered lotus motifs on the yoke and kalidar flared ghera.',
    fabric: 'Chanderi Silk Cotton with Mulmul Lining',
  },
  {
    id: 'poonthalir',
    name: 'Poonthalir',
    tamil: 'பூந்தளிர்',
    subtitle: 'Sage Handcrafted Salwar Set',
    category: 'சல்வார் / Salwar set',
    collectionCategory: 'Everyday Cotton',
    price: '₹3,450',
    priceNumber: 3450,
    image: '/product-poonthalir.png',
    color: 'Sage green with tonal thread embroidery',
    stock: 'In stock',
    stockStatus: 'in-stock',
    sizes: ['S', 'M', 'L', 'XL'],
    isNewArrival: true,
    description: '3-piece salwar kameez set paired with a featherlight kota doria dupatta and tailored straight-leg trousers.',
    fabric: 'Pure Cambric Cotton & Kota Doria',
  },
  {
    id: 'meera',
    name: 'Meera',
    tamil: 'மீரா',
    subtitle: 'Deep Maroon Silk Salwar Set',
    category: 'சல்வார் / Salwar set',
    collectionCategory: 'Festive Collection',
    price: '₹5,600',
    priceNumber: 5600,
    image: '/product-meera.png',
    color: 'Rich wine maroon with gota patti trim',
    stock: 'Only 4 left',
    stockStatus: 'low-stock',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Lustrous raw silk texture complemented by hand-tucked gota borders and scalloped organza dupatta.',
    fabric: 'Raw Silk Blend & Pure Organza',
  },
  {
    id: 'venmathi',
    name: 'Venmathi',
    tamil: 'வெண்மதி',
    subtitle: 'Ivory Handwoven A-Line Kurti',
    category: 'குர்த்தி / Kurti',
    collectionCategory: 'Everyday Cotton',
    price: '₹1,390',
    priceNumber: 1390,
    image: '/product-nila.png',
    color: 'Off-white handloom cotton',
    stock: 'In stock',
    stockStatus: 'in-stock',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isBestSeller: true,
    salesCount: 295,
    description: 'Minimalist A-line silhouette featuring subtle self-weave slub texture and antique brass neck buttons.',
    fabric: '100% Organic Handwoven Slub Cotton',
  },
  {
    id: 'ponmayil',
    name: 'Ponmayil',
    tamil: 'பொன்மயில்',
    subtitle: 'Peacock Jewel Tone Lehenga Ensemble',
    category: 'லெஹங்கா / Lehenga',
    collectionCategory: 'Festive Collection',
    price: '₹9,600',
    priceNumber: 9600,
    image: '/product-ponmayil.png',
    color: 'Deep peacock teal with gold foil detailing',
    stock: 'Limited edition',
    stockStatus: 'low-stock',
    sizes: ['S', 'M', 'L', 'XL'],
    isNewArrival: true,
    description: 'Voluminous 16-kali skirt paired with a fitted bustier choli and lightweight tissue dupatta with tassel trims.',
    fabric: 'Banarasi Brocade & Silk Tissue',
  },
  {
    id: 'vaanathi',
    name: 'Vaanathi',
    tamil: 'வானதி',
    subtitle: 'Plum Contemporary Draped Saree',
    category: 'சேலை / Saree',
    collectionCategory: 'Contemporary Designs',
    price: '₹7,800',
    priceNumber: 7800,
    image: '/product-vaanathi.png',
    color: 'Plum tissue silk with molten shine',
    stock: 'Only 2 left',
    stockStatus: 'low-stock',
    sizes: ['Free Size (5.5m)'],
    isNewArrival: true,
    description: 'A modern take on the traditional drape featuring micro-pleated tissue silk that catches the light with liquid grace.',
    fabric: 'Liquid Tissue Silk',
  },
  {
    id: 'neelamukil',
    name: 'Neelamukil',
    tamil: 'நீலமுகில்',
    subtitle: 'Contemporary Handloom Co-Ord Set',
    category: 'இணைப்பு / Co-ord Set',
    collectionCategory: 'Contemporary Designs',
    price: '₹3,200',
    priceNumber: 3200,
    image: '/product-neelam.png',
    color: 'Indigo geometric woven check',
    stock: 'In stock',
    stockStatus: 'in-stock',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    isNewArrival: true,
    description: 'A modern matching button-down tunic and cropped wide-leg trouser cut from breathable pitloom cotton.',
    fabric: 'Handloom Pitloom Cotton',
  },
  {
    id: 'thamarai-nizhal',
    name: 'Thamarai Nizhal',
    tamil: 'தாமரைநிழல்',
    subtitle: 'Coral Silk Festive Tiered Dress',
    category: 'விழா உடை / Festive Dress',
    collectionCategory: 'Contemporary Designs',
    price: '₹4,950',
    priceNumber: 4950,
    image: '/product-senthamarai.png',
    color: 'Warm coral silk with gold borders',
    stock: 'Only 3 left',
    stockStatus: 'low-stock',
    sizes: ['S', 'M', 'L', 'XL'],
    isNewArrival: true,
    description: 'Contemporary tiered maxi silhouette designed for celebration gatherings, accented with dainty gold cord piping.',
    fabric: 'Chanderi Silk with Cotton Voile Lining',
  },
];

export const collections = [
  {
    key: 'Everyday Cotton',
    name: 'Everyday Cotton',
    tamil: 'தினசரி பருத்தி',
    image: '/product-yazhini.png',
    note: 'Handloom-Inspired Kurtis & Casual Ensembles',
    subtitle: 'Woven for gentle ease from dawn till dusk',
    startingPrice: 'From ₹899',
  },
  {
    key: 'Traditional Wear',
    name: 'Traditional Wear',
    tamil: 'பாரம்பரிய உடைகள்',
    image: '/product-sempon-selai.png',
    note: 'Pure Kanchipuram & Handloom Silk Sarees',
    subtitle: 'Authentic antique zari and sacred selvedges',
    startingPrice: 'From ₹4,800',
  },
  {
    key: 'Festive Collection',
    name: 'Festive Collection',
    tamil: 'விழாத் தொகுப்பு',
    image: '/product-kavya.png',
    note: 'Lotus Embroidered Anarkalis & Lehengas',
    subtitle: 'Lustrous fabrics sculpted for celebrations',
    startingPrice: 'From ₹5,600',
  },
  {
    key: 'Contemporary Designs',
    name: 'Contemporary Designs',
    tamil: 'நவீன வடிவமைப்பு',
    image: '/product-vaanathi.png',
    note: 'Modern Co-Ords, Draped Sets & Tiered Fits',
    subtitle: 'Tamil craft language re-imagined for today',
    startingPrice: 'From ₹3,200',
  },
  {
    key: 'New Arrivals',
    name: 'New Arrivals',
    tamil: 'புதிய வரவுகள்',
    image: '/product-poonthalir.png',
    note: 'Fresh 2026 Season Handcrafted Releases',
    subtitle: 'Limited artisan batches just arrived',
    startingPrice: 'From ₹1,150',
  },
];


const catalogCategories = [
  {
    key: 'sarees',
    tamil: 'சேலைகள்',
    english: 'Sarees',
    note: 'Handloom, silk and the art of the drape',
    names: [
      'செம்பொன் சேலை',
      'நீலமுகில்',
      'மருதநிலம்',
      'மல்லிகைநூல்',
      'பொன்னோவியம்',
      'செந்தூரச்சாயல்',
      'வெண்மதி நெசவு',
      'காவிரி அலை',
      'மயிலிறகு பட்டாடை',
      'தாமரைச்சரம்',
      'சந்தனவேல்',
      'குறிஞ்சி வண்ணம்',
      'அரும்பொன்',
      'வைகைநதி',
      'நிலாத்துளி',
      'பூங்காற்று',
      'அன்னப்பறவை',
      'செங்கதிர்',
    ],
  },
  {
    key: 'salwars',
    tamil: 'சல்வார் தொகுப்பு',
    english: 'Salwar sets',
    note: 'Soft structure for unhurried days',
    names: [
      'பூந்தளிர்',
      'முல்லைமணம்',
      'நறுமுகை',
      'தென்றலாடை',
      'மருதாணிச்சாயல்',
      'வானவில் நூல்',
      'கனல்விழி',
      'பனித்துளி',
      'மலர்வனம்',
      'இளவேனில்',
      'மணல்வாசம்',
      'வெண்ணிலவு',
      'கோங்குமலர்',
      'நதியோசை',
      'செவ்வந்தி',
      'காற்றோவியம்',
      'நெய்தல்நிலம்',
      'பொன்மாலை',
    ],
  },
  {
    key: 'kurtis',
    tamil: 'குர்த்திகள்',
    english: 'Kurtis',
    note: 'Everyday ease, quietly considered',
    names: [
      'குறிஞ்சிப்பூ',
      'வெண்பட்டு',
      'இளம்பச்சை',
      'கொன்றைமலர்',
      'துளசிவனம்',
      'நீலக்கல்',
      'வாகைநிழல்',
      'பவளநிறம்',
      'கார்மேகம்',
      'தும்பைப்பூ',
      'சிறகோசை',
      'மாங்கனி',
      'அலர்மணம்',
      'மாலைநேரம்',
      'முத்துச்சரம்',
      'சோலைவனம்',
      'செம்பருத்தி',
      'மணிக்கொடி',
    ],
  },
  {
    key: 'lehengas',
    tamil: 'லெஹங்காக்கள்',
    english: 'Lehengas',
    note: 'Festive volume, made to move',
    names: [
      'பொன்மயில்',
      'அரண்மனைவண்ணம்',
      'நிலாமலர்',
      'வானமல்லி',
      'கோலம்பூ',
      'ரத்தினச்சாயல்',
      'மயில்வண்ணம்',
      'மணிமேகலை',
      'தங்கத்தாமரை',
      'கதிரொளி',
      'முகிலாடை',
      'கோயில்மணி',
      'செவ்வானம்',
      'பட்டாம்பூச்சி',
      'பூம்புகார்',
      'அழகுநதி',
      'விழாக்கோலம்',
      'முத்துப்பனி',
    ],
  },
  {
    key: 'festive',
    tamil: 'விழா உடைகள்',
    english: 'Festive edits',
    note: 'For the moments that gather us',
    names: [
      'செந்தாமரை',
      'தீபஒளி',
      'மங்களநூல்',
      'ஆடிப்பிறை',
      'திருவிழாச்சாயல்',
      'பொற்கதிர்',
      'மணிமாலை',
      'கோயில்வாசம்',
      'நாதஸ்வரநிறம்',
      'குத்துவிளக்கு',
      'தங்கப்பூ',
      'அன்னம்',
      'பூஜைநேரம்',
      'செம்பருத்தி விழா',
      'வெற்றிலைப்பச்சை',
      'பட்டொளி',
      'மஞ்சள் நிலா',
      'மங்கலமலர்',
    ],
  },
  {
    key: 'shirts',
    tamil: 'அச்சு சட்டைகள்',
    english: 'Printed shirts',
    note: 'A new rhythm for the everyday wardrobe',
    names: [
      'மரபுக்கோடு',
      'கோலச்சித்திரம்',
      'காவிரி அச்சு',
      'மயில்கண்',
      'மல்லிகை அச்சு',
      'குறிஞ்சி வரி',
      'பூங்கொடி',
      'நெல் மணம்',
      'சோழர் கோலம்',
      'தாமரை அச்சு',
      'நிலவுக்கோடு',
      'கோவில் வாசல்',
      'வண்ணத்துப்பூச்சி',
      'மருதாணி அச்சு',
      'பனைமரம்',
      'சித்திரைநிறம்',
      'அலைவடிவம்',
      'பொன்மண்',
    ],
  },
];

// 5. Dynamic Motion Craft Stages
const craftStages = [
  {
    id: '01',
    title: 'Natural Fibres',
    subtitle: '100% Certified Organic Cotton & Mulberry Silk',
    desc: 'Each thread is ethically sourced from local grower cooperatives, spun on traditional charkhas for natural breathing room and exceptional longevity.',
    progress: '96%',
    metric: 'Hand-Spun Grade A',
    image: unsplash('photo-1610030469983-98e550d6193c'),
    tag: 'Fibre Quality',
  },
  {
    id: '02',
    title: 'Anatomy Drape',
    subtitle: 'Sculpted Patterns & Ergonomic Flow',
    desc: 'Calculated drape geometry allows effortless movement from dawn pujas to evening gatherings without losing form, crease integrity, or silhouette tension.',
    progress: '88%',
    metric: 'Bespoke Contour Fit',
    image: unsplash('photo-1594633312681-425c7b97ccd1'),
    tag: 'Pattern Physics',
  },
  {
    id: '03',
    title: 'Antique Zari Finishing',
    subtitle: 'Tested Real Gilt & Selvedge Hand-Stitch',
    desc: 'Borders are woven with pure electroplated brass-gilt threads, sealed by heritage artisans with double-lock edge selvedge that will never fray.',
    progress: '100%',
    metric: 'Heritage Mastercraft',
    image: unsplash('photo-1617627143750-d86bc21e42bb'),
    tag: 'Artisan Zari',
  },
];

// 6. Artistic Visual Diary Editorial Collage
const visualDiaryCollage = [
  {
    image: unsplash('photo-1583391733956-3750e0ff4e8b'),
    title: 'Crimson Loom Symphony',
    tag: 'The Weaver Series',
    year: 'Edit 2026',
  },
  {
    image: unsplash('photo-1539109136881-3be0616acf4b'),
    title: 'The Organic Sand Drape',
    tag: 'Natural Palette',
    year: 'Series 02',
  },
  {
    image: unsplash('photo-1605763240000-7e93b172d754'),
    title: 'Temple Selvedge & Zari',
    tag: 'Tactile Macro',
    year: 'Archive 03',
  },
  {
    image: unsplash('photo-1515886657613-9f3515b0c78f'),
    title: 'Contemporary Silhouette',
    tag: 'Editorial Study',
    year: 'Limited Run',
  },
];

type AppPage = 'home' | 'collections' | 'admin-login' | 'admin';

function getInitialPage(): AppPage {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname;
  if (path.startsWith('/admin')) {
    return 'admin';
  }
  if (path === '/collections') {
    return 'collections';
  }
  return 'home';
}

export default function App() {
  const { locale, setLocale, t, getProductName, getProductSubtitle, getCategoryName } = useLocale();
  const products = useProducts();
  const [page, setPage] = useState<AppPage>(getInitialPage);
  const [sessionUser, setSessionUser] = useState<AdminUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [bagCount, setBagCount] = useState(0);
  const [savedProducts, setSavedProducts] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);

  const homeFilterCategories = useMemo<CategoryFilterItem[]>(
    () => [
      { key: 'all', english: 'All Pieces', tamil: 'அனைத்தும்', count: products.length },
      {
        key: 'Everyday Cotton',
        english: 'Everyday Cotton',
        tamil: 'தினசரி பருத்தி',
        count: products.filter((p) => p.collectionCategory === 'Everyday Cotton').length,
      },
      {
        key: 'Traditional Wear',
        english: 'Traditional Wear',
        tamil: 'பாரம்பரியம்',
        count: products.filter((p) => p.collectionCategory === 'Traditional Wear').length,
      },
      {
        key: 'Festive Collection',
        english: 'Festive Wear',
        tamil: 'விழாத் தொகுப்பு',
        count: products.filter((p) => p.collectionCategory === 'Festive Collection').length,
      },
      {
        key: 'Contemporary Designs',
        english: 'Contemporary',
        tamil: 'நவீன வடிவம்',
        count: products.filter((p) => p.collectionCategory === 'Contemporary Designs').length,
      },
      {
        key: 'New Arrivals',
        english: 'New Arrivals',
        tamil: 'புதிய வரவுகள்',
        count: products.filter((p) => p.isNewArrival).length,
      },
      {
        key: 'Best Sellers',
        english: 'Best Sellers',
        tamil: 'சிறந்த தேர்வு',
        count: products.filter((p) => p.isBestSeller).length,
      },
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    if (selectedCategory === 'Best Sellers') {
      return products.filter((p) => p.isBestSeller);
    }
    if (selectedCategory === 'New Arrivals') {
      return products.filter((p) => p.isNewArrival);
    }
    return products.filter((p) => p.collectionCategory === selectedCategory);
  }, [products, selectedCategory]);

  const categoryFilters = useMemo(
    () => [
      { key: 'all', label: 'All Pieces', count: products.length },
      {
        key: 'Everyday Cotton',
        label: 'Everyday Cotton',
        count: products.filter((p) => p.collectionCategory === 'Everyday Cotton').length,
      },
      {
        key: 'Traditional Wear',
        label: 'Traditional Wear',
        count: products.filter((p) => p.collectionCategory === 'Traditional Wear').length,
      },
      {
        key: 'Festive Collection',
        label: 'Festive Collection',
        count: products.filter((p) => p.collectionCategory === 'Festive Collection').length,
      },
      {
        key: 'Contemporary Designs',
        label: 'Contemporary Designs',
        count: products.filter((p) => p.collectionCategory === 'Contemporary Designs').length,
      },
      {
        key: 'New Arrivals',
        label: 'New Arrivals',
        count: products.filter((p) => p.isNewArrival).length,
      },
      {
        key: 'Best Sellers',
        label: '★ Best Sellers (Verified Orders)',
        count: products.filter((p) => p.isBestSeller).length,
      },
    ],
    [products]
  );

  // 5. Making Section Motion Interactive State
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const activeCraft = craftStages[activeStageIdx];

  // 7. Concierge Form State
  const [contactType, setContactType] = useState('Bespoke Styling');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    authService.getSession().then((session) => {
      if (session) {
        setSessionUser(session.user);
      } else {
        setSessionUser(null);
      }
      setAuthChecked(true);
    });

    const onPopState = () => {
      const p = window.location.pathname;
      if (p.startsWith('/admin')) {
        setPage('admin');
      } else if (p === '/collections') {
        setPage('collections');
      } else {
        setPage('home');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = (target: AppPage) => {
    let path = '/';
    if (target === 'collections') path = '/collections';
    else if (target === 'admin') path = '/admin';
    else if (target === 'admin-login') path = '/admin/login';
    window.history.pushState({}, '', path);
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSaveProduct = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedProducts((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  const bagText = useMemo(
    () => (bagCount ? `${bagCount} item${bagCount > 1 ? 's' : ''}` : 'Your bag is empty'),
    [bagCount]
  );

  return (
    <>
      <AnimatePresence mode="wait">
        {page === 'admin' || page === 'admin-login' ? (
          <motion.div
            key={sessionUser ? 'admin-dashboard' : 'admin-login'}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {sessionUser ? (
              <AdminLayout
                user={sessionUser}
                onLogout={() => {
                  setSessionUser(null);
                  navigateTo('admin-login');
                }}
                onNavigateHome={() => navigateTo('home')}
              />
            ) : (
              <AdminLogin
                onLoginSuccess={() => {
                  authService.getSession().then((session) => {
                    if (session) setSessionUser(session.user);
                    navigateTo('admin');
                  });
                }}
                onNavigateHome={() => navigateTo('home')}
              />
            )}
          </motion.div>
        ) : page === 'collections' ? (
          <motion.div
            key="collections"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <CollectionsPage
              onNavigateHome={() => navigateTo('home')}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setSelectedSize(p.sizes[0] || 'M');
              }}
              onAddToCart={(p, size) => {
                setSelectedProduct(p);
                setSelectedSize(size);
                setBagCount((c) => c + 1);
                setCartOpen(true);
              }}
              savedProducts={savedProducts}
              onToggleSaveProduct={toggleSaveProduct}
              initialCategory={selectedCategory}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <main className="site-shell">
      {/* Navigation Header */}
      <header className="site-header">
        <button
          className="menu-toggle flex md:hidden items-center justify-center"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu />
        </button>
        <a className="wordmark" href="#top">
          Ilayal Karigai
        </a>
        <nav className="desktop-nav hidden md:flex items-center space-x-8" aria-label="Main navigation">
          <a href="#shop" onClick={() => setSelectedCategory('all')}>{t.nav.catalogue}</a>
          <a
            href="/collections"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('collections');
            }}
          >
            {t.nav.archive}
          </a>
          <a href="#shop" onClick={() => setSelectedCategory('New Arrivals')}>{t.nav.new_arrivals}</a>
          <a href="#shop" onClick={() => setSelectedCategory('Best Sellers')}>{t.nav.bestsellers}</a>
          <a href="#story">{t.nav.story}</a>
          <a href="#contact">{t.nav.contact}</a>
          <button
            onClick={() => navigateTo('admin')}
            className="nav-admin-link"
            title="Atelier Admin Portal"
          >
            {t.nav.admin}
          </button>

          {/* Minimal Pill Toggle in Header (EN | தமிழ்) with subtle active gold glow */}
          <div
            className="flex items-center bg-[#f2ede4] border border-[#D4AF37]/40 rounded-full p-0.5 text-[11px] font-medium tracking-wide shadow-2xs"
            role="radiogroup"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`px-2.5 py-0.5 rounded-full transition-all duration-200 cursor-pointer ${
                locale === 'en'
                  ? 'bg-white text-[#800020] font-semibold shadow-[0_0_10px_rgba(212,175,55,0.45)] border border-[#D4AF37]/40'
                  : 'text-[#1A1A1A]/70 hover:text-[#800020]'
              }`}
              aria-checked={locale === 'en'}
              role="radio"
            >
              EN
            </button>
            <span className="text-[#D4AF37]/60 text-[10px] px-0.5 select-none font-light">|</span>
            <button
              type="button"
              onClick={() => setLocale('ta')}
              className={`px-2.5 py-0.5 rounded-full transition-all duration-200 cursor-pointer ${
                locale === 'ta'
                  ? 'bg-white text-[#800020] font-semibold shadow-[0_0_10px_rgba(212,175,55,0.45)] border border-[#D4AF37]/40'
                  : 'text-[#1A1A1A]/70 hover:text-[#800020]'
              }`}
              aria-checked={locale === 'ta'}
              role="radio"
            >
              தமிழ்
            </button>
          </div>
        </nav>
        <button
          className="bag-button"
          aria-label="Open shopping bag"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingBag />
          <sup>{bagCount}</sup>
        </button>
      </header>

      {/* Animated Mobile Sheet using Framer Motion (x: '100%' to x: 0) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              className="relative w-[340px] max-w-[85vw] h-full bg-[#FAF7F2]/95 backdrop-blur-xl border-l border-[#D4AF37]/30 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-sm tracking-widest text-[#800020] uppercase font-semibold">
                    Ilayal Karigai
                  </span>
                  <button
                    className="p-1.5 rounded-full text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-colors cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Language Switcher: Segmented control placed at the top of the mobile navigation drawer */}
                <div
                  className="grid grid-cols-2 p-1 bg-[#f2ede4] border border-[#D4AF37]/40 rounded-xl text-xs font-medium mb-6 shadow-2xs"
                  role="radiogroup"
                  aria-label="Mobile language selection"
                >
                  <button
                    type="button"
                    onClick={() => setLocale('en')}
                    className={`py-2 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                      locale === 'en'
                        ? 'bg-[#800020] text-[#FAF7F2] font-semibold shadow-sm'
                        : 'text-[#1A1A1A]/70 hover:text-[#800020]'
                    }`}
                    aria-checked={locale === 'en'}
                    role="radio"
                  >
                    English (EN)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale('ta')}
                    className={`py-2 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                      locale === 'ta'
                        ? 'bg-[#800020] text-[#FAF7F2] font-semibold shadow-sm'
                        : 'text-[#1A1A1A]/70 hover:text-[#800020]'
                    }`}
                    aria-checked={locale === 'ta'}
                    role="radio"
                  >
                    தமிழ் (TA)
                  </button>
                </div>

                <p className="eyebrow light mb-3 text-[11px] tracking-widest text-[#800020]/80 uppercase">
                  {locale === 'ta' ? 'வழிகாட்டல்' : 'Navigation'}
                </p>

                <nav className="flex flex-col space-y-3 font-medium text-sm">
                  <a
                    href="#shop"
                    onClick={() => { setSelectedCategory('all'); setMobileMenuOpen(false); }}
                    className="text-[#1A1A1A] hover:text-[#800020] transition-colors py-1"
                  >
                    {t.nav.catalogue}
                  </a>
                  <a
                    href="/collections"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('collections');
                      setMobileMenuOpen(false);
                    }}
                    className="text-[#1A1A1A] hover:text-[#800020] transition-colors py-1"
                  >
                    {t.nav.archive}
                  </a>
                  <a
                    href="#shop"
                    onClick={() => { setSelectedCategory('New Arrivals'); setMobileMenuOpen(false); }}
                    className="text-[#1A1A1A] hover:text-[#800020] transition-colors py-1"
                  >
                    {t.nav.new_arrivals}
                  </a>
                  <a
                    href="#shop"
                    onClick={() => { setSelectedCategory('Best Sellers'); setMobileMenuOpen(false); }}
                    className="text-[#1A1A1A] hover:text-[#800020] transition-colors py-1"
                  >
                    {t.nav.bestsellers}
                  </a>
                  <a
                    href="#story"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#1A1A1A] hover:text-[#800020] transition-colors py-1"
                  >
                    {t.nav.story}
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#1A1A1A] hover:text-[#800020] transition-colors py-1"
                  >
                    {t.nav.contact}
                  </a>
                </nav>

                {/* Dedicated Categories List */}
                <div className="mt-6 pt-5 border-t border-[#D4AF37]/25">
                  <p className="eyebrow light mb-3 text-[11px] tracking-widest text-[#800020]/80 uppercase">
                    {locale === 'ta' ? 'ஆடைத் தொகுப்புகள்' : 'Dedicated Categories'}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'Everyday Cotton', labelEn: 'Everyday Cotton', labelTa: 'தினசரி பருத்தி' },
                      { key: 'Traditional Wear', labelEn: 'Traditional Wear', labelTa: 'பாரம்பரிய உடைகள்' },
                      { key: 'Festive Collection', labelEn: 'Festive Collection', labelTa: 'விழாத் தொகுப்பு' },
                      { key: 'Contemporary Designs', labelEn: 'Contemporary Designs', labelTa: 'நவீன வடிவமைப்பு' },
                    ].map((catItem) => (
                      <button
                        key={catItem.key}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(catItem.key);
                          setMobileMenuOpen(false);
                          document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-left text-xs text-[#1A1A1A]/85 hover:text-[#800020] py-1.5 px-2.5 rounded-lg hover:bg-white/80 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span>{locale === 'ta' ? catItem.labelTa : catItem.labelEn}</span>
                        <span className="text-[#D4AF37] text-xs">→</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#D4AF37]/25 space-y-2">
                  <a
                    href={getWhatsAppUrl('Hello Ilayal Karigai (+91 98401 82019), I would like to enquire.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#25D366] font-semibold text-xs py-1"
                  >
                    <WhatsAppIcon size={16} />
                    <span>WhatsApp: +91 98401 82019</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => { navigateTo('admin'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-1.5 text-[#800020] text-xs font-semibold py-1 tracking-wider uppercase cursor-pointer"
                  >
                    <span>{t.nav.admin} Portal →</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-[#1A1A1A]/50 mt-6 pt-4 border-t border-[#D4AF37]/20 font-serif italic text-center">
                Crafted with intent. Designed for today.
              </p>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          1. HERO SECTION: Continuous Full-Width Luxury Fashion Campaign
          ============================================================ */}
      <section className="hero" id="top" aria-label="Ilayal Karigai Campaign">
        {/* Continuous Full-Width Background Fashion Image Layer */}
        <div className="hero-bg-layer" aria-hidden="true">
          <picture className="hero-picture">
            <source
              media="(min-width: 768px)"
              srcSet="/Elegant%20Ivory%20Saree%20Editorial.png"
            />
            <source
              media="(max-width: 767px)"
              srcSet="/mobile-hero-editorial.png"
            />
            <img
              src="/Elegant%20Ivory%20Saree%20Editorial.png"
              alt="Ilayal Karigai woman wearing handcrafted saree with antique gold border in rich maroon editorial setting"
              fetchPriority="high"
              className="hero-bg-img"
            />
          </picture>
        </div>

        {/* Seamless Feathered Gradient Overlay: Soft left-weighted contrast without hard vertical boundaries */}
        <div className="hero-gradient-overlay" aria-hidden="true" />

        {/* Hero Content Container: Left-aligned over continuous background */}
        <div className="hero-container">
          <div className="hero-editorial-content">
            <div className="hero-eyebrow-wrapper">
              <span className="hero-eyebrow-accent-line" aria-hidden="true" />
              <p className="hero-eyebrow-text">{t.hero.eyebrow}</p>
            </div>

            <h1 className="hero-headline">
              <span className="headline-line-1">{t.hero.headline_line_1}</span>
              <span className="headline-line-2">
                {t.hero.headline_with} <span className="headline-intent">{t.hero.headline_intent}</span>
              </span>
            </h1>

            <p className="hero-copy">{t.hero.copy}</p>

            <div className="hero-actions">
              <a className="hero-primary-btn" href="#shop" onClick={() => setSelectedCategory('all')}>
                <span>{t.hero.explore}</span>
                <ArrowRight className="btn-arrow" size={16} />
              </a>
              <a className="hero-story-link" href="#story">
                <span>{t.hero.our_story}</span>
                <ArrowRight className="story-arrow" size={14} />
              </a>
            </div>

            {/* Editorial Slide / Collection Metadata Track */}
            <div className="hero-metadata-row">
              <div className="hero-index-group">
                <span className="slide-num">01 / 04</span>
                <div className="slide-progress-track" aria-hidden="true">
                  <div className="slide-progress-bar" />
                </div>
              </div>
              <div className="hero-caption-group">
                <p className="caption-title">{t.hero.slide_title}</p>
                <p className="caption-sub">{t.hero.slide_sub}</p>
              </div>
            </div>
          </div>

          {/* Restrained Editorial Atelier Badge */}
          <div className="hero-editorial-badge" aria-hidden="true">
            <span className="badge-vert-text">{t.hero.atelier_badge}</span>
            <span className="badge-gold-line" />
          </div>
        </div>

        {/* Smooth low-height seam connecting seamlessly to the intro strip */}
        <div className="hero-bottom-seam" aria-hidden="true" />
      </section>

      {/* Intro Strip in Pure Clean Background */}
      <section className="intro-strip">
        <p className="eyebrow">{locale === 'ta' ? 'இளையள் காரிகை / 2026' : 'ILAYYAL KARIGAI / 2026'}</p>
        <p className="intro-copy">
          {locale === 'ta' ? (
            <>
              முக்கியமான நாட்களுக்கான அழகிய ஆடை
              <br className="desktop-only" /> மற்றும் அவற்றுக்கு இடைப்பட்ட அனைத்து நாட்களுக்கும்.
            </>
          ) : (
            <>
              A considered wardrobe for days that matter
              <br className="desktop-only" /> and all the ones in between.
            </>
          )}
        </p>
        <ArrowDownRight className="intro-arrow" />
      </section>

      {/* Collections Section */}
      <section className="collections-section section-pad" id="collections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.sections.collections_eyebrow}</p>
            <h2>
              {t.sections.collections_title_find}
              <br />
              <em>{t.sections.collections_title_everyday}</em>
            </h2>
          </div>
          <p className="heading-note" style={{ whiteSpace: 'pre-line' }}>
            {t.sections.collections_note}
          </p>
        </div>
        <div className="collection-viewport" aria-label="Everyday collections carousel">
          <div className="collection-track">
            {[...collections, ...collections].map((col, idx) => {
              const isDuplicate = idx >= collections.length;
              const colTitle = locale === 'ta' ? col.tamil : col.name;
              const colNote = locale === 'ta'
                ? (col.key === 'Everyday Cotton' ? 'கைத்தறி குர்த்திகள் & எளிய ஆடைகள்'
                  : col.key === 'Traditional Wear' ? 'தூய காஞ்சிபுரம் & கைத்தறி பட்டுச் சேலைகள்'
                  : col.key === 'Festive Collection' ? 'தாமரை எம்பிராய்டரி அனார்கலி & லெஹங்கா'
                  : col.key === 'Contemporary Designs' ? 'நவீன கோ-ஆர்ட்ஸ் & அடுக்கு ஆடைகள்'
                  : 'புதிய 2026 கைவினை ஆடைகள்')
                : col.note;
              const colPrice = locale === 'ta'
                ? col.startingPrice.replace('From', '').trim() + ' முதல்'
                : col.startingPrice;

              return (
                <a
                  className={`collection-card card-${idx % collections.length}`}
                  href="#shop"
                  aria-hidden={isDuplicate}
                  key={`${col.name}-${idx}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory(col.name);
                    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <img src={col.image} alt={isDuplicate ? '' : `${colTitle} collection`} />
                  <div className="card-overlay" />
                  <div className="collection-info">
                    <p>{colNote}</p>
                    <h3>{colTitle}</h3>
                    <span>{colPrice}</span>
                  </div>
                  <ArrowRight />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          2. CONCEPT SECTION: Traditional Dress seamlessly matched to palette
          ============================================================ */}
      <section className="statement-section">
        <div className="statement-fusion-stage">
          {/* Authentic traditional Indian attire editorial portrait */}
          <img
            src="/product-sempon-selai.png"
            alt="Woman gracefully adorned in traditional pure handloom silk saree with authentic antique zari"
          />
          <div className="statement-fusion-blend" />
          <div className="statement-fusion-tag">
            <span />
            {locale === 'ta' ? 'பாரம்பரிய கைவினைத் தொகுப்பு · 01 / 03' : 'Traditional Heritage Edit · 01 / 03'}
          </div>
        </div>
        <div className="statement-copy">
          <p className="eyebrow">{t.sections.statement_eyebrow}</p>
          <h2>
            {t.sections.statement_h2_main}
            <br />
            <em>{t.sections.statement_h2_em}</em>
          </h2>
          <p>{t.sections.statement_desc}</p>
          <div className="signature-list">
            <span>{t.sections.statement_sig1}</span>
            <span>{t.sections.statement_sig2}</span>
            <span>{t.sections.statement_sig3}</span>
          </div>
          <a className="text-link dark" href="#story">
            {t.sections.statement_more} <ArrowRight />
          </a>
        </div>
      </section>

      {/* ============================================================
          3. PRODUCT GRID: 3-Column Responsive Grid Layout
          ============================================================ */}
      <section className="shop-section section-pad" id="shop">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.sections.catalogue_eyebrow}</p>
            <h2>
              {t.sections.catalogue_title_pieces}
              <br />
              <em>{t.sections.catalogue_title_close}</em>
            </h2>
          </div>
          <a
            className="pieces-cta text-link dark"
            href="/collections"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('collections');
            }}
          >
            {t.sections.view_catalogue} <ArrowRight />
          </a>
        </div>
        {/* Interactive Category Buttons & Filter Bar */}
        <div style={{ marginBottom: '32px' }}>
          <CategoryFilterBar
            categories={homeFilterCategories}
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            ariaLabel="Handcrafted collection categories"
          />
        </div>

        {/* Responsive 3D Product Cards Grid */}
        <div className="product-grid-3col">
          {filteredProducts.map((product, idx) => (
            <ProductCard3D
              key={product.id}
              product={product}
              index={idx}
              isSaved={savedProducts.includes(product.name)}
              onToggleSave={(name, e) => toggleSaveProduct(name, e)}
              onQuickView={(p) => {
                setSelectedProduct(p);
                setSelectedSize(p.sizes[0] || 'M');
              }}
              onAddToCart={(p, size, e) => {
                setSelectedProduct(p);
                setSelectedSize(size);
                setBagCount((c) => c + 1);
                setCartOpen(true);
              }}
              onOpenWhatsAppInquiry={(p) => setInquiryProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* ============================================================
          4. EXCLUSIVE SECTION: Gradient Background Composition
          ============================================================ */}
      <section className="limited-section-balanced">
        {/* Luxury artful gradient background canvas */}
        <div className="limited-gradient-backdrop" />

        {/* Subject silhouette gracefully anchored on right */}
        <div className="limited-hero-bg">
          <img
            src="/ilayyal-limited-edition.png"
            alt="Woman draped in plum silk poised gracefully on the right side"
          />
        </div>

        {/* Soft atmospheric gradient layer for balanced depth */}
        <div className="limited-backdrop-gradient" />

        {/* Compact bottom pure-white blend */}
        <div className="limited-bottom-blend" />

        <div className="limited-content-left">
          <p className="eyebrow light">The Ilayyal Karigai promise</p>
          <h2>
            Made in
            <br />
            <em>limited numbers.</em>
          </h2>
          <p>
            Thoughtfully crafted in small collections, with details worth keeping. Our artisans
            produce only numbered editions to maintain exceptional needlework and thread fidelity.
          </p>
          <div className="limited-stats">
            <span>
              <b>01</b> Limited edition
            </span>
            <span>
              <b>02</b> Exclusive designs
            </span>
            <span>
              <b>03</b> Small-batch production
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. MAKING SECTION: Dynamic Motion-Graphics Interactive UI/UX
          ============================================================ */}
      <section className="story-section" id="story">
        <div className="section-heading">
          <div>
            <p className="eyebrow">04 — The making</p>
            <h2>
              From fabric
              <br />
              <em>to signature.</em>
            </h2>
          </div>
          <p className="heading-note">
            Motion &amp; materiality:
            <br />
            How we weave intent.
          </p>
        </div>

        <div className="story-grid-dynamic">
          <div className="story-text">
            <p className="making-statement-lead">
              Every garment begins with mathematical drape study, organic fiber harvesting, and
              time-honored hand-finish techniques.
            </p>

            {/* Interactive Craft Selection Tabs */}
            <div className="craft-tabs" role="tablist">
              {craftStages.map((stage, idx) => (
                <button
                  key={stage.id}
                  className={`craft-tab-btn ${activeStageIdx === idx ? 'active' : ''}`}
                  onClick={() => setActiveStageIdx(idx)}
                  role="tab"
                  aria-selected={activeStageIdx === idx}
                >
                  <div className="craft-tab-header">
                    <span>{stage.id} — {stage.title}</span>
                    <span>{stage.metric}</span>
                  </div>
                  <p className="craft-tab-desc">{stage.desc}</p>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '32px' }}>
              <a className="button button-dark" href="#contact">
                Explore The Atelier <ArrowRight />
              </a>
            </div>
          </div>

          {/* Dynamic Motion UI Card Showcase */}
          <div className="motion-card-viewport">
            <div className="motion-card-image">
              <img src={activeCraft.image} alt={activeCraft.title} />
            </div>
            <div className="motion-radar-overlay" />

            {/* Floating High-Tech Spec Badge */}
            <div className="hud-glass-badge">
              <div className="hud-pulse-dot" />
              Live Atelier Spec / {activeCraft.tag}
            </div>

            {/* Interactive HUD Bottom Metrics */}
            <div className="hud-metrics-card">
              <div className="hud-metrics-title">
                <h4>{activeCraft.title}</h4>
                <span>{activeCraft.subtitle}</span>
              </div>
              <div className="hud-progress-track">
                <div
                  className="hud-progress-fill"
                  style={{ width: activeCraft.progress }}
                />
              </div>
              <div className="hud-meta-row">
                <span>Purity Standard: {activeCraft.progress}</span>
                <span>Craft ID #IK-2026-{activeCraft.id}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. VISUAL DIARY: Artistic Fashion Collage & Motion Showcase
          ============================================================ */}
      <section className="visual-diary-showcase" id="diary">
        <div className="diary-header">
          <div>
            <p className="eyebrow">05 — Visual Diary</p>
            <h2>
              Artistry in
              <br />
              <em>every drape.</em>
            </h2>
          </div>
          <p>
            Follow our studio journey
            <br />
            <a href="#contact">@ilayyalkarigai</a>
          </p>
        </div>

        {/* Artistic Editorial Collage */}
        <div className="artistic-collage-grid" aria-label="Ilayyal Karigai Visual Diary Collage">
          {visualDiaryCollage.map((item, idx) => (
            <div className="collage-art-card" key={idx}>
              <img src={item.image} alt={item.title} />
              <div className="collage-glass-overlay">
                <span className="collage-meta-tag">
                  <Sparkles style={{ width: '11px', height: '11px' }} />
                  {item.tag} · {item.year}
                </span>
                <h4 className="collage-title">{item.title}</h4>
                <span className="collage-expand-btn">
                  Explore Still <ArrowRight style={{ width: '11px', height: '11px' }} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          7. CONTACT SECTION: Redesigned High-End Concierge UI/UX
          ============================================================ */}
      <section className="contact-section-redesigned" id="contact">
        <div className="contact-brand-column">
          <p className="eyebrow">06 — Private Concierge</p>
          <h2>
            Begin a
            <br />
            <em>conversation.</em>
          </h2>
          <p>
            For private draping appointments, bridal trousseau consultations, or bespoke styling,
            our personal atelier team is delighted to welcome you.
          </p>

          <div className="atelier-perks-list">
            <div className="perk-row">
              <div className="perk-circle">
                <Calendar />
              </div>
              <div className="perk-text">
                <h5>Private Studio Appointments</h5>
                <p>One-on-one drape appointments in Chennai &amp; worldwide virtual fittings.</p>
              </div>
            </div>

            <div className="perk-row">
              <div className="perk-circle">
                <MessageCircle />
              </div>
              <div className="perk-text">
                <h5>Instant WhatsApp Concierge</h5>
                <p>Real-time styling advice, sizing queries, and orders at <strong>+91 98401 82019</strong>.</p>
                <a
                  href={getWhatsAppUrl('Hello Ilayyal Karigai (+91 98401 82019), I would like to chat with a personal stylist.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#128C7E',
                    fontSize: '11px',
                    fontWeight: 600,
                    marginTop: '4px',
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle style={{ width: '13px', height: '13px' }} />
                  Chat on WhatsApp (+91 98401 82019)
                </a>
              </div>
            </div>

            <div className="perk-row">
              <div className="perk-circle">
                <Clock />
              </div>
              <div className="perk-text">
                <h5>Swift Response Guarantee</h5>
                <p>All personal atelier enquiries acknowledged within 2 business hours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Redesigned Luxury Form Card */}
        <div className="concierge-form-surface">
          {contactSubmitted ? (
            <div className="concierge-success-box">
              <div className="success-icon-badge">
                <CheckCircle2 style={{ width: '30px', height: '30px' }} />
              </div>
              <h3>Vanakkam, {formName || 'Friend'}.</h3>
              <p>
                Your request has been delivered to our master stylists. We look forward to curating
                a bespoke edit for your wardrobe.
              </p>
              <button
                className="button button-dark"
                style={{ marginTop: '24px' }}
                onClick={() => setContactSubmitted(false)}
              >
                Send Another Request
              </button>
            </div>
          ) : (
            <>
              <h3>Atelier Reservation</h3>
              <p>Please share your styling preference to begin a dedicated conversation.</p>

              <form className="atelier-form-grid" onSubmit={handleContactSubmit}>
                <div className="input-field-wrap full-width">
                  <label>Service Type</label>
                  <div className="chip-selector-group">
                    {['Bespoke Styling', 'Bridal Edit', 'Custom Drape Size', 'General Enquiry'].map(
                      (type) => (
                        <button
                          type="button"
                          key={type}
                          className={`interactive-chip ${contactType === type ? 'selected' : ''}`}
                          onClick={() => setContactType(type)}
                        >
                          {type}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="input-field-wrap">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    className="input-refined"
                    placeholder="E.g. Ananya Meenakshi"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="input-field-wrap">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    className="input-refined"
                    placeholder="ananya@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>

                <div className="input-field-wrap full-width">
                  <label>WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="input-refined"
                    placeholder="+91 98400 12345"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                </div>

                <div className="input-field-wrap full-width">
                  <label>How Can We Help You?</label>
                  <textarea
                    required
                    className="textarea-refined"
                    placeholder="Tell us about your upcoming occasion, preferred palette, or silhouette..."
                    rows={3}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                  />
                </div>

                <div className="form-action-bar">
                  <div className="trust-badge">
                    <ShieldCheck /> Private &amp; encrypted
                  </div>
                  <button className="button button-dark" type="submit">
                    Send Enquiry <Send style={{ width: '12px', height: '12px', marginLeft: '6px' }} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-brand">
          <a className="wordmark" href="#top">
            ILAYYAL <span>KARIGAI</span>
          </a>
          <p>
            Crafted with intent.
            <br />
            Designed for today.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <p className="eyebrow">Explore</p>
            <a href="#shop">Collections</a>
            <a href="#story">Our story</a>
            <a href="#diary">Visual Diary</a>
            <a href="#contact">Size guide</a>
          </div>
          <div>
            <p className="eyebrow">Connect</p>
            <a href="#contact">Instagram</a>
            <a
              href={getWhatsAppUrl('Hello Ilayal Karigai (+91 98401 82019), I would like to enquire about your collections.')}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp (+91 98401 82019)
            </a>
            <a href="#contact">Boutique Concierge</a>
          </div>
          <div>
            <p className="eyebrow">Administration</p>
            <button
              onClick={() => navigateTo('admin')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                padding: '6px 0',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                opacity: 0.85,
                letterSpacing: '0.04em',
              }}
            >
              Admin Portal →
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Ilayyal Karigai</span>
          <span>WhatsApp Enquiries: +91 98401 82019 · Made with care in India</span>
        </div>
      </footer>
    </main>
  </motion.div>
)}
</AnimatePresence>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="product-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProduct.name} details`}
        >
          <button
            className="modal-close"
            onClick={() => setSelectedProduct(null)}
            aria-label="Close product details"
          >
            <X />
          </button>
          <div className="modal-image">
            <img src={selectedProduct.image} alt={`${selectedProduct.name} detail`} />
          </div>
          <div className="modal-info">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <p className="eyebrow" style={{ margin: 0 }}>
                {selectedProduct.collectionCategory} · {selectedProduct.category}
              </p>
              <span className={`availability-indicator ${selectedProduct.stockStatus}`}>
                <span className="availability-dot" />
                {selectedProduct.stock}
              </span>
            </div>
            <h2 style={{ marginBottom: '4px' }}>
              {selectedProduct.name} <small style={{ fontSize: '16px', color: 'var(--brass-dark)' }}>{selectedProduct.tamil}</small>
            </h2>
            <p style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: '14px', margin: '0 0 12px' }}>
              {selectedProduct.subtitle}
            </p>
            <p className="modal-description">
              {selectedProduct.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '14px 0' }}>
              <strong className="modal-price" style={{ margin: 0 }}>{selectedProduct.price}</strong>
              {selectedProduct.originalPrice && (
                <span style={{ textDecoration: 'line-through', color: 'var(--muted)', fontSize: '13px' }}>
                  {selectedProduct.originalPrice}
                </span>
              )}
              {selectedProduct.isBestSeller && selectedProduct.salesCount && (
                <span className="verified-sales-badge">
                  ★ Verified Best Seller ({selectedProduct.salesCount}+ orders)
                </span>
              )}
            </div>

            <div className="size-picker">
              <span>Select Size (Available: {selectedProduct.sizes.join(', ')})</span>
              <div>
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    className={selectedSize === size ? 'active' : ''}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              <button
                className="button button-dark full-button"
                onClick={() => {
                  setBagCount((c) => c + 1);
                  setCartOpen(true);
                }}
              >
                Add to bag ({selectedSize}) <ArrowRight />
              </button>

              <a
                className="whatsapp-button"
                href={getWhatsAppUrl(
                  `Hello Ilayyal Karigai (+91 98401 82019), I would like to order ${selectedProduct.name} — ${selectedProduct.subtitle} in Size ${selectedSize} (${selectedProduct.price}). Availability: ${selectedProduct.stock}. Please let me know the ordering process.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#128C7E',
                  color: '#ffffff',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                <MessageCircle style={{ width: '16px', height: '16px' }} />
                Order via WhatsApp (+91 98401 82019)
              </a>
            </div>

            <div className="details-list" style={{ marginTop: '20px' }}>
              <p>
                Fabric: {selectedProduct.fabric} <ChevronDown />
              </p>
              <p>
                Delivery &amp; returns (Free express shipping across India) <ChevronDown />
              </p>
              <p>
                Direct WhatsApp Helpline: +91 98401 82019 <ChevronDown />
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Bag Drawer */}
      {cartOpen && (
        <div className="cart-drawer">
          <div className="drawer-head">
            <p className="eyebrow">Your bag</p>
            <button onClick={() => setCartOpen(false)} aria-label="Close shopping bag">
              <X />
            </button>
          </div>
          <div className="drawer-content">
            {bagCount ? (
              <>
                <div className="cart-line">
                  <img src={products[0].image} alt={products[0].name} />
                  <div>
                    <h3>{products[0].name} · {products[0].tamil}</h3>
                    <p>{products[0].color} · Size: {selectedSize}</p>
                    <p>{products[0].price}</p>
                  </div>
                  <button onClick={() => setBagCount(0)} aria-label="Remove item">
                    <X />
                  </button>
                </div>
                <div className="subtotal">
                  <span>Subtotal</span>
                  <strong>{products[0].price}</strong>
                </div>
                <button className="button button-dark full-button">
                  Proceed to checkout <ArrowRight />
                </button>
                <a
                  className="whatsapp-button"
                  href={getWhatsAppUrl(
                    `Hello Ilayyal Karigai (+91 98401 82019), I would like to checkout my order for ${products[0].name} in size ${selectedSize} (${products[0].price}).`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: '#128C7E',
                    color: '#ffffff',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    marginTop: '8px',
                  }}
                >
                  <MessageCircle style={{ width: '16px', height: '16px' }} />
                  Checkout via WhatsApp (+91 98401 82019)
                </a>
              </>
            ) : (
              <div className="empty-bag">
                <ShoppingBag />
                <p>{bagText}</p>
                <a className="text-link dark" href="#shop" onClick={() => setCartOpen(false)}>
                  Explore the collection <ArrowRight />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Direct WhatsApp Concierge Inquiry Modal */}
      <WhatsAppInquiryModal
        product={inquiryProduct}
        isOpen={!!inquiryProduct}
        onClose={() => setInquiryProduct(null)}
      />

      {/* Floating WhatsApp Concierge Widget */}
      <WhatsAppWidget
        phoneNumber={WHATSAPP_PHONE}
        rawPhoneNumber={WHATSAPP_RAW_NUMBER}
        prefilledMessage="Hello Ilayal Karigai, I would like to enquire about your collection."
      />
    </>
  );
}
