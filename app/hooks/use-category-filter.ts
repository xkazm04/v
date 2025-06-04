'use client';

import { useCallback, useMemo, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function useCategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedCategories = useMemo(() => {
    const categories = searchParams.get('categories');
    return categories ? categories.split(',') : [];
  }, [searchParams]);

  const updateCategories = useCallback((newCategories: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }

    // Preserve other query parameters
    const newUrl = `${pathname}?${params.toString()}`;
    
    startTransition(() => {
      router.push(newUrl, { scroll: false });
    });
  }, [router, pathname, searchParams]);

  const addCategory = useCallback((categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      updateCategories([...selectedCategories, categoryId]);
    }
  }, [selectedCategories, updateCategories]);

  const removeCategory = useCallback((categoryId: string) => {
    updateCategories(selectedCategories.filter(id => id !== categoryId));
  }, [selectedCategories, updateCategories]);

  const toggleCategory = useCallback((categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      removeCategory(categoryId);
    } else {
      addCategory(categoryId);
    }
  }, [selectedCategories, addCategory, removeCategory]);

  const clearAll = useCallback(() => {
    updateCategories([]);
  }, [updateCategories]);

  return {
    selectedCategories,
    isPending,
    addCategory,
    removeCategory,
    toggleCategory,
    clearAll,
    updateCategories
  };
}