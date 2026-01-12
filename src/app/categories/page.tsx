'use client';

import { useNavigation, useCategories } from '@/lib/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { BookOpen, ArrowRight, AlertCircle, Database } from 'lucide-react';
import { CategoryCardSkeleton } from '@/components/ui/LoadingSkeleton';

// Mock categories for fallback when API is not fully available
const mockMainCategories = [
  { id: 1, name: 'Fiction', slug: 'fiction', description: 'Novels, short stories, and literary fiction' },
  { id: 2, name: 'Non-Fiction', slug: 'non-fiction', description: 'Biographies, history, science, and more' },
  { id: 3, name: 'Children\'s Books', slug: 'childrens', description: 'Books for young readers of all ages' },
  { id: 4, name: 'Academic', slug: 'academic', description: 'Textbooks and educational materials' },
  { id: 5, name: 'Art & Design', slug: 'art-design', description: 'Visual arts, photography, and design' },
  { id: 6, name: 'Science & Technology', slug: 'science-tech', description: 'Computing, engineering, and sciences' },
];

const mockSubCategories = [
  { id: 1, title: 'Mystery & Thriller', slug: 'mystery-thriller', productCount: 0 },
  { id: 2, title: 'Romance', slug: 'romance', productCount: 0 },
  { id: 3, title: 'Science Fiction', slug: 'sci-fi', productCount: 0 },
  { id: 4, title: 'Biography', slug: 'biography', productCount: 0 },
  { id: 5, title: 'History', slug: 'history', productCount: 0 },
  { id: 6, title: 'Self Help', slug: 'self-help', productCount: 0 },
  { id: 7, title: 'Cooking', slug: 'cooking', productCount: 0 },
  { id: 8, title: 'Travel', slug: 'travel', productCount: 0 },
  { id: 9, title: 'Health & Fitness', slug: 'health-fitness', productCount: 0 },
];

export default function CategoriesPage() {
  const { navigation, isLoading: navLoading, isError: navError } = useNavigation();
  const { categories, isLoading: catLoading, isError: catError } = useCategories();

  // Check if we should use fallback data
  const useNavFallback = navError || (!navLoading && (!navigation || navigation.length === 0));
  const useCatFallback = catError || (!catLoading && (!categories || categories.data.length === 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Browse Categories
        </h1>
        <p className="text-gray-600">
          Explore our extensive collection of books organized by categories from World of Books.
        </p>
      </div>

      {/* API Status Notice */}
      {(useNavFallback || useCatFallback) && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-amber-800 mb-1">
                Limited Data Available
              </h3>
              <p className="text-sm text-amber-700">
                The backend database is currently disconnected. Showing sample categories below. 
                Visit the <Link href="/products" className="underline font-medium">products page</Link> to 
                explore available functionality or check the API status.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Main Categories
        </h2>
        
        {navLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useNavFallback ? (
              // Show mock categories when API data is not available
              mockMainCategories.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow border-dashed border-2 border-gray-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                      {item.name}
                    </CardTitle>
                    <CardDescription>
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Link href={`/products?category=${item.slug}`}>
                        <Button variant="outline" size="sm">
                          View Collection
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : navigation && navigation.length > 0 ? (
              // Show real API data when available
              navigation
                .filter((item) => item.title !== 'Books')
                .map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                      {item.title}
                    </CardTitle>
                    <CardDescription>
                      Explore {item.title.toLowerCase()} collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Link href={`/products?navigation=${item.slug}`}>
                        <Button variant="outline" size="sm">
                          View Collection
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No categories available
                </h3>
                <p className="text-gray-600 mb-6">
                  Categories will appear here once the backend is fully connected.
                </p>
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Popular Categories
        </h2>
        
        {catLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCatFallback ? (
              // Show mock subcategories when API data is not available
              mockSubCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow border-dashed border-2 border-gray-300">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {category.title}
                    </CardTitle>
                    <CardDescription>
                      Sample category - data pending
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/products?category=${category.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : categories && categories.data.length > 0 ? (
              // Show real API data when available
              categories.data.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {category.title}
                    </CardTitle>
                    <CardDescription>
                      {category.productCount} products available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/products?category=${category.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No subcategories available
                </h3>
                <p className="text-gray-600 mb-6">
                  Subcategories will appear here once data is loaded from the backend.
                </p>
                <div className="space-x-4">
                  <Button onClick={() => window.location.reload()}>
                    Refresh Page
                  </Button>
                  <Link href="/products">
                    <Button variant="outline">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Recommendations Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recommended for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Bestsellers', description: 'Most popular books', icon: '🏆' },
            { title: 'New Arrivals', description: 'Latest additions', icon: '✨' },
            { title: 'Staff Picks', description: 'Curated selections', icon: '👥' },
            { title: 'On Sale', description: 'Special offers', icon: '💰' },
          ].map((rec, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="text-3xl mb-2">{rec.icon}</div>
                <CardTitle className="text-lg">{rec.title}</CardTitle>
                <CardDescription>{rec.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/products">
                  <Button variant="outline" size="sm" className="w-full">
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}