import { NextRequest, NextResponse } from 'next/server';

// Mock data for products
const mockProducts = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 12.99,
    originalPrice: 15.99,
    discount: 19,
    rating: 4.5,
    reviewCount: 1234,
    imageUrl: "https://picsum.photos/300/400?text=Great+Gatsby",
    isbn: "9780743273565",
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    category: "Fiction",
    categoryId: 1,
    inStock: true,
    stockCount: 25,
    publisher: "Scribner",
    publishedDate: "1925-04-10",
    pages: 180,
    language: "English",
    format: "Paperback"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 14.99,
    originalPrice: 18.99,
    discount: 21,
    rating: 4.8,
    reviewCount: 2156,
    imageUrl: "https://picsum.photos/300/400?text=To+Kill+Mockingbird",
    isbn: "9780061120084",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    category: "Fiction",
    categoryId: 1,
    inStock: true,
    stockCount: 18,
    publisher: "Harper Perennial",
    publishedDate: "1960-07-11",
    pages: 376,
    language: "English",
    format: "Paperback"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    price: 13.99,
    originalPrice: 16.99,
    discount: 18,
    rating: 4.7,
    reviewCount: 3421,
    imageUrl: "https://picsum.photos/300/400?text=1984+Orwell",
    isbn: "9780451524935",
    description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
    category: "Science Fiction",
    categoryId: 2,
    inStock: true,
    stockCount: 32,
    publisher: "Signet Classics",
    publishedDate: "1949-06-08",
    pages: 328,
    language: "English",
    format: "Paperback"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categoryId = searchParams.get('categoryId');

    let filteredProducts = mockProducts;

    // Filter by category if provided
    if (categoryId) {
      const categoryIdNum = parseInt(categoryId);
      filteredProducts = mockProducts.filter(product => product.categoryId === categoryIdNum);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const response = {
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
        hasNext: endIndex < filteredProducts.length,
        hasPrev: page > 1
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}