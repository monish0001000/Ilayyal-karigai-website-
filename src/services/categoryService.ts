import { useState, useEffect } from 'react';
import { CategoryItem } from '../types';

const STORAGE_KEY = 'ilayal_categories_v1';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-everyday-cotton',
    name: 'Everyday Cotton',
    tamilName: 'தினசரி பருத்தி',
    slug: 'everyday-cotton',
    description: 'Breathable organic handlooms, chettinad slubs, and relaxed silhouettes tailored for humid tropical comfort.',
    signatureFabrics: ['Organic Pitloom Cotton', 'Chettinad Slub', 'Linen Cotton'],
    isVisible: true,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'cat-traditional-wear',
    name: 'Traditional Wear',
    tamilName: 'பாரம்பரிய உடைகள்',
    slug: 'traditional-wear',
    description: 'Certified heirloom Kanchipuram silks, korvai temple borders, and authentic fermented indigo handlooms.',
    signatureFabrics: ['Mulberry Silk', 'Pure Zari Korvai', 'Natural Indigo Weave'],
    isVisible: true,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'cat-festive-collection',
    name: 'Festive Collection',
    tamilName: 'விழா கால சேகரிப்பு',
    slug: 'festive-collection',
    description: 'Lustrous chanderi silks, hand-embroidered anarkalis, banarasi lehengas, and celebration attire.',
    signatureFabrics: ['Chanderi Silk', 'Raw Silk', 'Banarasi Brocade', 'Organza'],
    isVisible: true,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'cat-contemporary-designs',
    name: 'Contemporary Designs',
    tamilName: 'நவீன வடிவமைப்பு',
    slug: 'contemporary-designs',
    description: 'Micro-pleated liquid tissue sarees, structured pitloom co-ord sets, and modern celebratory tiered dresses.',
    signatureFabrics: ['Liquid Tissue Silk', 'Micro-pleated Blends', 'Cotton Voile'],
    isVisible: true,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'cat-new-arrivals',
    name: 'New Arrivals',
    tamilName: 'புதிய வரவுகள்',
    slug: 'new-arrivals',
    description: 'The fresh 2026 limited batch handcrafted in small artisan quantities.',
    signatureFabrics: ['Handloom Cottons', 'Festival Silks', 'Artisan Coordinates'],
    isVisible: true,
    createdAt: '2026-01-15T00:00:00Z',
  },
];

class CategoryService {
  private listeners: Array<() => void> = [];

  constructor() {
    this.ensureSeed();
  }

  private ensureSeed() {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    }
  }

  public getCategories(includeHidden: boolean = false): CategoryItem[] {
    if (typeof window === 'undefined') return INITIAL_CATEGORIES;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return INITIAL_CATEGORIES;
      const list: CategoryItem[] = JSON.parse(raw);
      if (includeHidden) return list;
      return list.filter((cat) => cat.isVisible !== false);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  public getCategoryById(id: string): CategoryItem | undefined {
    return this.getCategories(true).find((cat) => cat.id === id);
  }

  public async addCategory(item: Omit<CategoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<CategoryItem> {
    const categories = this.getCategories(true);
    const slug = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check for duplicate name
    if (categories.some((c) => c.name.toLowerCase() === item.name.trim().toLowerCase())) {
      throw new Error(`A category with the name "${item.name}" already exists.`);
    }

    const newCategory: CategoryItem = {
      ...item,
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: item.name.trim(),
      slug,
      isVisible: item.isVisible !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...categories, newCategory];
    this.save(updated);
    return newCategory;
  }

  public async updateCategory(id: string, updates: Partial<CategoryItem>): Promise<CategoryItem> {
    const categories = this.getCategories(true);
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Category with ID ${id} not found.`);
    }

    if (updates.name && updates.name.trim()) {
      const duplicate = categories.find((c) => c.id !== id && c.name.toLowerCase() === updates.name!.trim().toLowerCase());
      if (duplicate) {
        throw new Error(`A category named "${updates.name}" already exists.`);
      }
    }

    const existing = categories[index];
    const updatedCategory: CategoryItem = {
      ...existing,
      ...updates,
      id: existing.id, // Immutable ID
      name: updates.name ? updates.name.trim() : existing.name,
      updatedAt: new Date().toISOString(),
    };

    categories[index] = updatedCategory;
    this.save(categories);
    return updatedCategory;
  }

  public async deleteCategory(id: string): Promise<boolean> {
    const categories = this.getCategories(true);
    const exists = categories.some((c) => c.id === id);
    if (!exists) {
      throw new Error(`Category with ID ${id} not found.`);
    }

    const updated = categories.filter((c) => c.id !== id);
    this.save(updated);
    return true;
  }

  public resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    this.notify();
  }

  private save(list: CategoryItem[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      this.notify();
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('Error notifying category listener:', err);
      }
    });
  }
}

export const categoryService = new CategoryService();

export function useCategories(includeHidden: boolean = false): CategoryItem[] {
  const [categories, setCategories] = useState<CategoryItem[]>(() =>
    categoryService.getCategories(includeHidden)
  );

  useEffect(() => {
    const update = () => setCategories(categoryService.getCategories(includeHidden));
    update();
    const unsubscribe = categoryService.subscribe(update);
    return unsubscribe;
  }, [includeHidden]);

  return categories;
}
