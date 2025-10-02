'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: {
    amount: number;
    currency: string;
  };
  originalPrice?: {
    amount: number;
    currency: string;
  };
  image?: {
    url: string;
    alt: string;
  };
  rating?: number;
  reviewCount?: number;
  isInStock?: boolean;
  isOnSale?: boolean;
  discount?: number;
  className?: string;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  image,
  rating = 0,
  reviewCount = 0,
  isInStock = true,
  isOnSale = false,
  discount = 0,
  className,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(id);
  };

  const handleAddToCart = () => {
    onAddToCart?.(id);
  };

  const handleQuickView = () => {
    onQuickView?.(id);
  };

  const formatPrice = (price: { amount: number; currency: string }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency,
    }).format(price.amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'h-4 w-4',
          i < Math.floor(rating)
            ? 'fill-warning-400 text-warning-400'
            : 'text-neutral-300'
        )}
      />
    ));
  };

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:shadow-lg',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        {image && (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOnSale && (
            <Badge variant="destructive" className="text-xs">
              -{discount}%
            </Badge>
          )}
          {!isInStock && (
            <Badge variant="secondary" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className={cn(
            'absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          )}
        >
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 shadow-md"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
                isWishlisted ? 'fill-accent-500 text-accent-500' : 'text-neutral-600'
              )}
            />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 shadow-md"
            onClick={handleQuickView}
          >
            <Eye className="h-4 w-4 text-neutral-600" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Product Name */}
          <Link href={`/products/${slug}`} className="block">
            <h3 className="font-medium text-neutral-900 line-clamp-2 hover:text-primary-600 transition-colors">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">{renderStars(rating)}</div>
              <span className="text-sm text-neutral-500">
                ({reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-neutral-900">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-sm text-neutral-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={!isInStock}
            variant={isInStock ? 'default' : 'secondary'}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}