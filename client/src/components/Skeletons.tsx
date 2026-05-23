import React from 'react';

// ─── Product Card Skeleton ──────────────────────────────────────────────────
export const ProductSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
  </div>
);

// ─── Product Grid Skeleton ─────────────────────────────────────────────────
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

// ─── Product Detail Skeleton ───────────────────────────────────────────────
export const ProductDetailSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-4">
        <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="flex gap-3">
          {[1, 2, 3].map(i => <div key={i} className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />)}
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);

// ─── Order Card Skeleton ───────────────────────────────────────────────────
export const OrderSkeleton: React.FC = () => (
  <div className="animate-pulse border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <div className="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex justify-between">
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
      </div>
    </div>
    <div className="px-6 py-4 flex items-center gap-4">
      <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  </div>
);

// ─── Dashboard Stat Skeleton ───────────────────────────────────────────────
export const StatSkeleton: React.FC = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
  </div>
);
