'use client';

import { useNavigation, useCategories } from '@/lib/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { BookOpen, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { CategoryCardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function CategoriesPage() {
  const { navigation, isLoading: navLoading, isError: navError } = useNavigation();
  const { categories, isLoading: catLoading, isError: catError } = useCategories();

  if (navError || catError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to load categories
          </h2>
          <p className="text-gray-600 mb-8">
            There was an error loading the categories. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Get featured categories (first 6 categories)
  const featuredCategories = categories?.data?.slice(0, 6) || [];
  const remainingCategories = categories?.data?.slice(6) || [];

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

      {/* Featured Categories Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <Star className="mr-2 h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Categories
          </h2>
        </div>
        
        {catLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                    {category.title}
                  </CardTitle>
                  <CardDescription>
                    {category.productCount} products available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/products?category=${category.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No featured categories available
            </h3>
            <p className="text-gray-600 mb-6">
              Featured categories will appear here once data is loaded.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        )}
      </section>

      {/* Recommendations Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <TrendingUp className="mr-2 h-6 w-6 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900">
            Recommended for You
          </h2>
        </div>
        
        {catLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : categories?.data && categories.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Show popular categories based on product count */}
            {categories.data
              .sort((a, b) => b.productCount - a.productCount)
              .slice(0, 4)
              .map((category) => (
              <Card key={`rec-${category.id}`} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {category.productCount} books
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href={`/products?category=${category.slug}`}>
                    <Button variant="ghost" size="sm" className="w-full text-sm">
                      Browse
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="mx-auto h-8 w-8 text-gray-400 mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              No recommendations available
            </h3>
            <p className="text-gray-600 text-sm">
              Recommendations will appear here once we have more data.
            </p>
          </div>
        )}
      </section>

      {/* All Categories Section */}
      {remainingCategories.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingCategories.map((category) => (
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
            ))}
          </div>
        </section>
      )}

      {/* Show all categories if we have less than 6 total */}
      {categories?.data && categories.data.length <= 6 && categories.data.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.data.map((category) => (
              <Card key={`all-${category.id}`} className="hover:shadow-lg transition-shadow">
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
            ))}
          </div>
        </section>
      )}
    </div>
  );
}