'use client';

import Image from 'next/image';
import { Card } from 'antd';
import type { Product } from '@/types/shared/product';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const formattedPrice = `฿${product.price.toLocaleString('th-TH')}`;

  return (
    <Card
      hoverable
      onClick={() => onClick?.(product)}
      className="w-full overflow-hidden rounded-xl"
      cover={
        <div className="relative aspect-square w-full">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt ?? product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      }
      styles={{ body: { padding: '12px 16px' } }}
    >
      <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
      <p className="mt-1 text-base font-semibold text-red-600">{formattedPrice}</p>
    </Card>
  );
}
