'use client';

import { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProductImage from '@/components/ui/ProductImage';
import { formatPrice } from '@/lib/utils';
import { Star, ShoppingCart, Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
  className?: string;
}

export default function ProductCard({ 
  product, 
  showCategory = true, 
  className = '' 
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Handle null values gracefully
  const displayPrice = product.price ? 
    formatPrice(typeof product.price === 'string' ? parseFloat(product.price) : product.price, product.currency) 
    : 'Price not available';

  const displayAuthor = product.author || 'Unknown Author';
  const displayTitle = product.title || 'Untitled';
  const displayCategory = product.category?.title || 'Uncategorized';

  // Get rating from detail if available
  const rating = product.detail?.ratingsAvg ? parseFloat(product.detail.ratingsAvg) : null;
  const reviewCount = product.detail?.reviewsCount || 0;

  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 ${className}`}>
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
            <ProductImage
              src={product.imageUrl}
              alt={displayTitle}
              title={displayTitle}
              author={displayAuthor}
              isbn={product.detail?.isbn}
              sourceId={product.sourceId}
              sourceUrl={product.sourceUrl}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              fallbackClassName="w-full h-full flex items-center justify-center bg-gray-100"
            />
          </div>
        </Link>
        
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {!product.inStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            Out of Stock
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
          <Link 
            href={`/products/${product.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {displayTitle}
          </Link>
        </CardTitle>
        <CardDescription className="text-xs text-gray-600">
          by {displayAuthor}
        </CardDescription>
        
        {showCategory && product.category && (
          <div className="text-xs">
            <Link 
              href={`/products?category=${product.category.slug}`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {displayCategory}
            </Link>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {rating && (
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {rating.toFixed(1)} ({reviewCount})
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-green-600">
              {displayPrice}
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              product.inStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>

          <div className="flex space-x-2">
            <Link href={`/products/${product.id}`} className="flex-1">
              <Button size="sm" className="w-full">
                View Details
              </Button>
            </Link>
            
            {product.sourceUrl && (
              <a
                href={product.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0"
                title="View on original site"
              >
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}