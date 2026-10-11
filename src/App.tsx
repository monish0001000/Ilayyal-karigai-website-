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
} from 'lucide-react';

const unsplash = (id: string, params = 'auto=format&fit=crop&w=1200&q=85') =>
  `https://images.unsplash.com/${id}?${params}`;

interface Product {
  name: string;
  tamil: string;
  category: string;
  price: string;
  image: string;
  color: string;
  stock: string;
}

const products: Product[] = [
  {
    name: 'நீலமணி',
    tamil: 'நீலமணி',
    category: 'சேலை / Saree',
    price: '₹4,800',
    image: '/product-ananya.png',
    color: 'Indigo handloom cotton',
    stock: 'Only 2 left',
  },
  {
    name: 'பூந்தளிர்',
    tamil: 'பூந்தளிர்',
    category: 'சல்வார் / Salwar set',
    price: '₹5,600',
    image: '/product-meera.png',
    color: 'Maroon silk cotton',
    stock: 'In stock',
  },
  {
    name: 'வெண்மதி',
    tamil: 'வெண்மதி',
    category: 'குர்த்தி / Kurti',
    price: '₹4,950',
    image: '/product-nila.png',
    color: 'Ivory handwoven cotton',
    stock: 'Limited',
  },
  {
    name: 'செந்தாமரை',
    tamil: 'செந்தாமரை',
    category: 'அனார்கலி / Anarkali',
    price: '₹6,400',
    image: '/product-kavya.png',
    color: 'Terracotta silk cotton',
    stock: 'Only 3 left',
  },
  {
    name: 'மயிலிறகு',
    tamil: 'மயிலிறகு',
    category: 'லெஹங்கா / Lehenga',
    price: '₹7,800',
    image: '/product-vaanathi.png',
    color: 'Plum tissue silk',
    stock: 'Limited edition',
  },
  {
    name: 'சந்தனக்காற்று',
    tamil: 'சந்தனக்காற்று',
    category: 'துப்பட்டா / Dupatta set',
    price: '₹5,900',
    image: '/product-yazhini.png',
    color: 'Sandal cotton blend',
    stock: 'In stock',
  },
  {
    name: 'செம்பொன் சேலை',
    tamil: 'செம்பொன் சேலை',
    category: 'காஞ்சிபுரம் / Kanchipuram silk',
    price: '₹12,800',
    image: '/product-sempon-selai.png',
    color: 'Ruby silk with antique zari',
    stock: 'Limited edition',
  },
  {
    name: 'நீலமுகில்',
    tamil: 'நீலமுகில்',
    category: 'கைத்தறி / Handloom',
    price: '₹6,200',
    image: '/product-neelam.png',
    color: 'Indigo checked cotton',
    stock: 'In stock',
  },
  {
    name: 'மல்லிகைத்துளி',
    tamil: 'மல்லிகைத்துளி',
    category: 'சல்வார் / Salwar set',
    price: '₹5,450',
    image: '/product-poonthalir.png',
    color: 'Sage cotton with embroidery',
    stock: 'Only 4 left',
  },
  {
    name: 'குறிஞ்சிப்பூ',
    tamil: 'குறிஞ்சிப்பூ',
    category: 'குர்த்தி / Kurti',
    price: '₹3,850',
    image: '/product-kurinji.png',
    color: 'Mustard linen with block print',
    stock: 'In stock',
  },
  {
    name: 'பொன்மயில்',
    tamil: 'பொன்மயில்',
    category: 'லெஹங்கா / Lehenga',
    price: '₹9,600',
    image: '/product-ponmayil.png',
    color: 'Peacock silk with gold detail',
    stock: 'Limited',
  },
  {
    name: 'தாமரைநிழல்',
    tamil: 'தாமரைநிழல்',
    category: 'விழா உடை / Festive dress',
    price: '₹8,200',
    image: '/product-senthamarai.png',
    color: 'Coral silk with lotus embroidery',
    stock: 'Only 2 left',
  },
];

const collections = [
  {
    name: 'சேலைகள்',
    english: 'Sarees',
    image: unsplash('photo-1539109136881-3be0616acf4b'),
    note: 'The original form',
  },
  {
    name: 'சல்வார்',
    english: 'Salwar sets',
    image: '/product-poonthalir.png',
    note: 'Ease, elevated',
  },
  {
    name: 'குர்த்திகள்',
    english: 'Kurtis',
    image: '/product-kurinji.png',
    note: 'For every day',
  },
  {
    name: 'அலங்காரம்',
    english: 'Lehengas',
    image: '/product-ponmayil.png',
    note: 'The art of adornment',
  },
  {
    name: 'விழா உடைகள்',
    english: 'Festive edits',
    image: '/product-senthamarai.png',
    note: 'A new language',
  },
  {
    name: 'கைத்தறி',
    english: 'Handloom',
    image: '/product-neelam.png',
    note: 'Woven with care',
  },
  {
    name: 'மாலைத் தொகுப்பு',
    english: 'After dusk',
    image: '/product-vaanathi.png',
    note: 'For the gathering',
  },
  {
    name: 'மணமகள்',
    english: 'Bridal edit',
    image: '/product-sempon-selai.png',
    note: 'Made for the moment',
  },
];

const catalogImages: Record<string, string[]> = {
  sarees: ['/product-sempon-selai.png', '/product-neelam.png', '/product-ananya.png'],
  salwars: ['/product-poonthalir.png', '/product-meera.png', '/product-yazhini.png'],
  kurtis: ['/product-kurinji.png', '/product-nila.png', '/product-meera.png'],
  lehengas: ['/product-ponmayil.png', '/product-vaanathi.png', '/product-kavya.png'],
  festive: ['/product-senthamarai.png', '/product-kavya.png', '/product-sempon-selai.png'],
  shirts: ['/product-neelam.png', '/product-kurinji.png', '/product-yazhini.png'],
};

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

function CatalogPage({ onNavigateHome }: { onNavigateHome: () => void }) {
  const [activeKey, setActiveKey] = useState('sarees');
  const [savedItems, setSavedItems] = useState<string[]>([]);

  const activeCategory = useMemo(
    () => catalogCategories.find((cat) => cat.key === activeKey) ?? catalogCategories[0],
    [activeKey]
  );

  const items = activeCategory.names.map((name, idx) => ({
    name,
    image: catalogImages[activeCategory.key][idx % catalogImages[activeCategory.key].length],
    price: `₹${(3850 + ((517 * idx) % 6200)).toLocaleString('en-IN')}`,
  }));

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigateHome();
  };

  return (
    <main className="catalog-page">
      <header className="catalog-header">
        <a href="/" className="catalog-back" onClick={handleBack}>
          <ArrowLeft /> Back to Ilayyal
        </a>
        <a className="catalog-wordmark" href="/" onClick={handleBack}>
          ILAYYAL <span>KARIGAI</span>
        </a>
        <span className="catalog-count">{items.length} pieces</span>
      </header>

      <section className="catalog-intro">
        <p className="eyebrow">The complete edit / 2026</p>
        <h1>
          Wear the
          <br />
          <em>meaning.</em>
        </h1>
        <p>
          Six distinct collections, each shaped by Tamil colour, craft and memory. Find the pieces
          that feel like your own.
        </p>
      </section>

      <nav className="catalog-tabs" aria-label="Collections">
        {catalogCategories.map((cat) => (
          <button
            key={cat.key}
            className={cat.key === activeKey ? 'is-active' : ''}
            onClick={() => setActiveKey(cat.key)}
          >
            <span>{cat.tamil}</span>
            <small>{cat.english}</small>
          </button>
        ))}
      </nav>

      <section className="catalog-collection">
        <div className="catalog-collection-head">
          <div>
            <p className="eyebrow">
              {activeCategory.tamil} / {activeCategory.english}
            </p>
            <h2>{activeCategory.note}</h2>
          </div>
          <span>01 — 18</span>
        </div>

        <div className="catalog-grid">
          {items.map((item, idx) => (
            <article className="catalog-product" key={`${item.name}-${idx}`}>
              <div className="catalog-product-image">
                <img src={item.image} alt={`${item.name}, ${activeCategory.english}`} />
                <button
                  className={savedItems.includes(item.name) ? 'saved' : ''}
                  aria-label={`Save ${item.name}`}
                  onClick={() =>
                    setSavedItems((prev) =>
                      prev.includes(item.name)
                        ? prev.filter((n) => n !== item.name)
                        : [...prev, item.name]
                    )
                  }
                >
                  <Heart />
                </button>
                <span>0{(idx % 9) + 1}</span>
              </div>
              <div className="catalog-product-meta">
                <h3>{item.name}</h3>
                <p>
                  {activeCategory.english} · {item.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="catalog-footer">
        <p>
          Crafted with intent.
          <br />
          Designed for today.
        </p>
        <a href="/" onClick={handleBack}>
          Return home <ArrowRight />
        </a>
      </footer>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState<'home' | 'collections'>(() =>
    window.location.pathname === '/collections' ? 'collections' : 'home'
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [bagCount, setBagCount] = useState(0);
  const [savedProducts, setSavedProducts] = useState<string[]>([]);

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
    const onPopState = () => {
      setPage(window.location.pathname === '/collections' ? 'collections' : 'home');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = (target: 'home' | 'collections') => {
    const path = target === 'collections' ? '/collections' : '/';
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

  if (page === 'collections') {
    return <CatalogPage onNavigateHome={() => navigateTo('home')} />;
  }

  return (
    <main className="site-shell">
      {/* Navigation Header */}
      <header className="site-header">
        <button
          className="menu-toggle"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu />
        </button>
        <a className="wordmark" href="#top">
          Ilayyal Karigai
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#shop">Shop</a>
          <a href="#collections">Collections</a>
          <a href="#story">Our story</a>
          <a href="#diary">Visual Diary</a>
          <a href="#contact">Contact</a>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button
            className="close-button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
          <p className="eyebrow light">Navigate</p>
          <nav>
            <a href="#shop" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </a>
            <a href="#collections" onClick={() => setMobileMenuOpen(false)}>
              Collections
            </a>
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>
              Our story
            </a>
            <a href="#diary" onClick={() => setMobileMenuOpen(false)}>
              Visual Diary
            </a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </a>
          </nav>
          <p className="menu-footer">
            Crafted with intent.
            <br />
            Designed for today.
          </p>
        </div>
      )}

      {/* ============================================================
          1. HERO SECTION: Premium Editorial Indian Luxury Fashion
          ============================================================ */}
      <section className="hero" id="top">
        <picture className="hero-picture">
          <source
            media="(max-width: 767px)"
            srcSet="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MOBILE_HERO_IMAGE-juOsrQvhnz6q1V5azTnnKuu9uQjWuc.png"
          />
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DESKTOP_HERO_IMAGE-38Mcagh0542i9qSnCjMUiZ9DInXUWw.png"
            alt="Woman wearing a deep purple silk saree with antique gold detailing"
            fetchPriority="high"
          />
        </picture>

        {/* Cinematic Deep Burgundy & Warm Directional Atmosphere */}
        <div className="hero-vignette" />

        {/* Delicate low-height pure-white seam transition */}
        <div className="hero-blend-fade-smooth" />

        <div className="hero-content">
          <div className="hero-eyebrow-wrapper">
            <span className="hero-eyebrow-accent-line" aria-hidden="true" />
            <p className="eyebrow light">A NEW INDIAN CLOTHING LABEL</p>
          </div>

          <h1 className="hero-headline">
            <span className="headline-line-1">Crafted</span>
            <span className="headline-line-2">with intent.</span>
          </h1>

          <p className="hero-copy">
            Thoughtfully designed silhouettes, natural fabrics and limited collections made
            exclusively for the Ilayyal Karigai woman.
          </p>

          <div className="hero-actions">
            <a className="hero-primary-btn" href="#shop">
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="btn-arrow" />
            </a>
            <a className="hero-story-link" href="#story">
              <span>OUR STORY</span>
              <ArrowRight className="story-arrow" />
            </a>
          </div>
        </div>

        {/* Editorial Collection & Slide Track Indicators */}
        <div className="hero-metadata-row">
          <div className="hero-index-group">
            <span className="slide-num">01 / 04</span>
            <div className="slide-progress-track">
              <div className="slide-progress-bar" />
            </div>
          </div>
          <div className="hero-caption-group">
            <p className="caption-title">THE INDIRA EDIT</p>
            <p className="caption-sub">HANDLOOM COTTON · 01 / 04</p>
          </div>
        </div>
      </section>

      {/* Intro Strip in Pure Clean Background */}
      <section className="intro-strip">
        <p className="eyebrow">ILAYYAL KARIGAI / 2026</p>
        <p className="intro-copy">
          A considered wardrobe for days that matter
          <br className="desktop-only" /> and all the ones in between.
        </p>
        <ArrowDownRight className="intro-arrow" />
      </section>

      {/* Collections Section */}
      <section className="collections-section section-pad" id="collections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 — Collections</p>
            <h2>
              Find your
              <br />
              <em>everyday.</em>
            </h2>
          </div>
          <p className="heading-note">
            Five ways to wear
            <br />a point of view.
          </p>
        </div>
        <div className="collection-viewport" aria-label="Everyday collections carousel">
          <div className="collection-track">
            {[...collections, ...collections].map((col, idx) => {
              const isDuplicate = idx >= collections.length;
              return (
                <a
                  className={`collection-card card-${idx % collections.length}`}
                  href="#shop"
                  aria-hidden={isDuplicate}
                  key={`${col.name}-${idx}`}
                >
                  <img src={col.image} alt={isDuplicate ? '' : `${col.name} collection`} />
                  <div className="card-overlay" />
                  <div className="collection-info">
                    <p>{col.note}</p>
                    <h3>{col.name}</h3>
                    <span>{col.english}</span>
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
            Traditional Heritage Edit · 01 / 03
          </div>
        </div>
        <div className="statement-copy">
          <p className="eyebrow">02 — The point of view</p>
          <h2>
            Not just clothing.
            <br />
            <em>A signature of our own.</em>
          </h2>
          <p>
            From fabric selection to silhouette, pattern and finishing, every piece is thoughtfully
            developed under the Ilayyal Karigai identity.
          </p>
          <div className="signature-list">
            <span>Designed by us.</span>
            <span>Crafted for you.</span>
            <span>Available only from Ilayyal Karigai.</span>
          </div>
          <a className="text-link dark" href="#story">
            More about the label <ArrowRight />
          </a>
        </div>
      </section>

      {/* ============================================================
          3. PRODUCT GRID: 3-Column Responsive Grid Layout
          ============================================================ */}
      <section className="shop-section section-pad" id="shop">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 — The first edit</p>
            <h2>
              Pieces to
              <br />
              <em>keep close.</em>
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
            View all pieces <ArrowRight />
          </a>
        </div>

        {/* Responsive 3-Column Grid */}
        <div className="product-grid-3col">
          {products.map((product) => (
            <article className="product-card-3col" key={product.name}>
              <button
                className="product-image-frame"
                onClick={() => {
                  setSelectedProduct(product);
                  setSelectedSize('M');
                }}
              >
                <img src={product.image} alt={`${product.name} ${product.category} garment`} />
                <span className="product-badge-pill">{product.stock}</span>
                <span className="product-hover-action">
                  Quick View <ArrowRight />
                </span>
              </button>
              <div className="product-meta-3col">
                <div>
                  <h3>
                    {product.name} <small>{product.tamil}</small>
                  </h3>
                  <p>
                    {product.category} · {product.color}
                  </p>
                </div>
                <div className="product-side-actions">
                  <button
                    className={`heart-button-compact ${
                      savedProducts.includes(product.name) ? 'active' : ''
                    }`}
                    onClick={(e) => toggleSaveProduct(product.name, e)}
                    aria-label={`Save ${product.name}`}
                  >
                    <Heart fill={savedProducts.includes(product.name) ? 'currentColor' : 'none'} />
                  </button>
                  <strong>{product.price}</strong>
                </div>
              </div>
            </article>
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
                <PhoneCall />
              </div>
              <div className="perk-text">
                <h5>Instant WhatsApp Concierge</h5>
                <p>Real-time help with fabric queries, matching dupattas, and global dispatch.</p>
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
            <a href="https://wa.me/?text=Hello" target="_blank" rel="noreferrer">WhatsApp</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Ilayyal Karigai</span>
          <span>Made with care in India</span>
        </div>
      </footer>

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
            <p className="eyebrow">{selectedProduct.category} / The first edit</p>
            <h2>{selectedProduct.name}</h2>
            <p className="modal-description">
              A quietly confident silhouette in {selectedProduct.color.toLowerCase()}, designed for
              movement and made to be lived in.
            </p>
            <strong className="modal-price">{selectedProduct.price}</strong>
            <div className="size-picker">
              <span>Select size</span>
              <div>
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
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
              href={`https://wa.me/?text=${encodeURIComponent(
                `Hello, I would like to order ${selectedProduct.name} (${selectedProduct.tamil}) in size ${selectedSize}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', textAlign: 'center' }}
            >
              Order via WhatsApp
            </a>
            <div className="details-list">
              <p>
                Fabric &amp; care <ChevronDown />
              </p>
              <p>
                Delivery &amp; returns <ChevronDown />
              </p>
              <p>
                Size guide <ChevronDown />
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
                  <img src={products[0].image} alt="Ananya" />
                  <div>
                    <h3>{products[0].tamil}</h3>
                    <p>{products[0].color} · {selectedSize}</p>
                    <p>₹4,800</p>
                  </div>
                  <button onClick={() => setBagCount(0)} aria-label="Remove item">
                    <X />
                  </button>
                </div>
                <div className="subtotal">
                  <span>Subtotal</span>
                  <strong>₹4,800</strong>
                </div>
                <button className="button button-dark full-button">
                  Proceed to checkout <ArrowRight />
                </button>
                <a
                  className="whatsapp-button"
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Hello, I would like to checkout my order for ${products[0].name} in size ${selectedSize}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'block', textAlign: 'center' }}
                >
                  Checkout via WhatsApp
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
    </main>
  );
}
