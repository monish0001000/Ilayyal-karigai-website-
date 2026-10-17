import { useEffect, useState } from 'react';
import { Product, CollectionCategory } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
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
    isActive: true,
    description: 'Woven from breathable handloom-inspired organic cotton, this relaxed kurti features fine neckline detailing and comfortable side slits, tailored for effortless everyday wear.',
    fabric: '100% Breathable Organic Handloom Cotton',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z',
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
    isActive: true,
    description: 'Heirloom Kanchipuram silk woven with certified electroplated brass-gold zari borders, carrying a traditional temple korvai selvedge.',
    fabric: 'Pure Mulberry Silk with Antique Zari',
    createdAt: '2026-01-12T10:00:00.000Z',
    updatedAt: '2026-01-12T10:00:00.000Z',
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
    isActive: true,
    description: 'Authentic fermented natural indigo dye and subtle selvedge weaving on crisp chettinad handloom cotton.',
    fabric: '100% Handloom Cotton',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
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
    isActive: true,
    description: 'Breathable linen-cotton blend with wooden button placket and discrete side pockets for everyday utility.',
    fabric: 'Linen Cotton Blend',
    createdAt: '2026-01-18T10:00:00.000Z',
    updatedAt: '2026-01-18T10:00:00.000Z',
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
    isActive: true,
    description: 'Floor-skimming silhouette with hand-embroidered lotus motifs on the yoke and kalidar flared ghera.',
    fabric: 'Chanderi Silk Cotton with Mulmul Lining',
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-01-20T10:00:00.000Z',
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
    isActive: true,
    description: '3-piece salwar kameez set paired with a featherlight kota doria dupatta and tailored straight-leg trousers.',
    fabric: 'Pure Cambric Cotton & Kota Doria',
    createdAt: '2026-01-22T10:00:00.000Z',
    updatedAt: '2026-01-22T10:00:00.000Z',
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
    isActive: true,
    description: 'Lustrous raw silk texture complemented by hand-tucked gota borders and scalloped organza dupatta.',
    fabric: 'Raw Silk Blend & Pure Organza',
    createdAt: '2026-01-25T10:00:00.000Z',
    updatedAt: '2026-01-25T10:00:00.000Z',
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
    isActive: true,
    description: 'Minimalist A-line silhouette featuring subtle self-weave slub texture and antique brass neck buttons.',
    fabric: '100% Organic Handwoven Slub Cotton',
    createdAt: '2026-01-28T10:00:00.000Z',
    updatedAt: '2026-01-28T10:00:00.000Z',
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
    isActive: true,
    description: 'Voluminous 16-kali skirt paired with a fitted bustier choli and lightweight tissue dupatta with tassel trims.',
    fabric: 'Banarasi Brocade & Silk Tissue',
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z',
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
    isActive: true,
    description: 'A modern take on the traditional drape featuring micro-pleated tissue silk that catches the light with liquid grace.',
    fabric: 'Liquid Tissue Silk',
    createdAt: '2026-02-05T10:00:00.000Z',
    updatedAt: '2026-02-05T10:00:00.000Z',
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
    isActive: true,
    description: 'A modern matching button-down tunic and cropped wide-leg trouser cut from breathable pitloom cotton.',
    fabric: 'Handloom Pitloom Cotton',
    createdAt: '2026-02-08T10:00:00.000Z',
    updatedAt: '2026-02-08T10:00:00.000Z',
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
    isActive: true,
    description: 'Contemporary tiered maxi silhouette designed for celebration gatherings, accented with dainty gold cord piping.',
    fabric: 'Chanderi Silk with Cotton Voile Lining',
    createdAt: '2026-02-12T10:00:00.000Z',
    updatedAt: '2026-02-12T10:00:00.000Z',
  },
];

const STORAGE_KEY = 'elaiyal_karigai_products';
const LEGACY_STORAGE_KEY = 'ilayal_karigai_products';
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error in product subscriber:', e);
    }
  });
}

class ProductService {
  private cache: Product[] | null = null;

  private load(): Product[] {
    if (this.cache) return this.cache;
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;

    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.cache = parsed;
          return this.cache;
        }
      }
    } catch (err) {
      console.warn('Failed to read products from localStorage, falling back to initial data:', err);
    }

    this.cache = [...INITIAL_PRODUCTS];
    this.persist(this.cache);
    return this.cache;
  }

  private persist(items: Product[]) {
    this.cache = items;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (err) {
        console.error('Failed to write products to localStorage:', err);
      }
    }
    notify();
  }

  public getProducts(includeInactive = false): Product[] {
    const list = this.load();
    if (includeInactive) return list;
    return list.filter((p) => p.isActive !== false);
  }

  public getProductById(id: string): Product | undefined {
    return this.load().find((p) => p.id === id);
  }

  public createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Product {
    const now = new Date().toISOString();
    const id = data.id || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
    
    // Ensure unique ID
    let finalId = id;
    let counter = 1;
    while (this.getProductById(finalId)) {
      finalId = `${id}-${counter++}`;
    }

    const priceNum = typeof data.priceNumber === 'number' && !isNaN(data.priceNumber)
      ? data.priceNumber
      : parseInt(String(data.price).replace(/[^0-9]/g, ''), 10) || 0;

    const formattedPrice = data.price && data.price.startsWith('₹') ? data.price : `₹${priceNum.toLocaleString('en-IN')}`;

    const newProduct: Product = {
      ...data,
      id: finalId,
      price: formattedPrice,
      priceNumber: priceNum,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: now,
      updatedAt: now,
    };

    const current = this.load();
    const updated = [newProduct, ...current];
    this.persist(updated);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product {
    const current = this.load();
    const index = current.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID "${id}" not found.`);
    }

    let priceNumber = updates.priceNumber ?? current[index].priceNumber;
    let price = updates.price ?? current[index].price;
    if (updates.priceNumber !== undefined && updates.price === undefined) {
      price = `₹${updates.priceNumber.toLocaleString('en-IN')}`;
    } else if (updates.price !== undefined && updates.priceNumber === undefined) {
      priceNumber = parseInt(String(updates.price).replace(/[^0-9]/g, ''), 10) || 0;
    }

    const updatedItem: Product = {
      ...current[index],
      ...updates,
      price,
      priceNumber,
      updatedAt: new Date().toISOString(),
    };

    const nextList = [...current];
    nextList[index] = updatedItem;
    this.persist(nextList);
    return updatedItem;
  }

  public deleteProduct(id: string): boolean {
    const current = this.load();
    const filtered = current.filter((p) => p.id !== id);
    if (filtered.length === current.length) return false;
    this.persist(filtered);
    return true;
  }

  public toggleActive(id: string): Product | undefined {
    const item = this.getProductById(id);
    if (!item) return undefined;
    return this.updateProduct(id, { isActive: item.isActive === false ? true : false });
  }

  public toggleFeatured(id: string): Product | undefined {
    const item = this.getProductById(id);
    if (!item) return undefined;
    return this.updateProduct(id, { isBestSeller: !item.isBestSeller });
  }

  public resetToDefaults(): void {
    this.persist([...INITIAL_PRODUCTS]);
  }

  public subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
}

export const productService = new ProductService();

/**
 * Custom React hook that automatically re-renders when products are updated in the store
 */
export function useProducts(includeInactive = false): Product[] {
  const [items, setItems] = useState<Product[]>(() => productService.getProducts(includeInactive));

  useEffect(() => {
    const unsubscribe = productService.subscribe(() => {
      setItems(productService.getProducts(includeInactive));
    });
    return unsubscribe;
  }, [includeInactive]);

  return items;
}
