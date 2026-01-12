import { NextRequest, NextResponse } from 'next/server';

// Mock data for detailed products
const mockProductDetails = [
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
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream. The story follows Nick Carraway as he observes the tragic story of Jay Gatsby and his obsessive pursuit of Daisy Buchanan.",
    category: "Fiction",
    categoryId: 1,
    inStock: true,
    stockCount: 25,
    publisher: "Scribner",
    publishedDate: "1925-04-10",
    pages: 180,
    language: "English",
    format: "Paperback",
    dimensions: "5.2 x 0.4 x 8.0 inches",
    weight: "0.4 pounds",
    tags: ["Classic", "American Literature", "Jazz Age", "Romance", "Drama"],
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: "A timeless masterpiece that captures the essence of the American Dream.",
        author: "BookLover123",
        date: "2024-01-15"
      },
      {
        id: 2,
        rating: 4,
        comment: "Beautiful prose and compelling characters. A must-read classic.",
        author: "LiteraryFan",
        date: "2024-01-10"
      }
    ]
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
    description: "A gripping tale of racial injustice and childhood innocence in the American South. Through the eyes of Scout Finch, we witness her father Atticus defend a black man falsely accused of rape in 1930s Alabama.",
    category: "Fiction",
    categoryId: 1,
    inStock: true,
    stockCount: 18,
    publisher: "Harper Perennial",
    publishedDate: "1960-07-11",
    pages: 376,
    language: "English",
    format: "Paperback",
    dimensions: "5.2 x 0.8 x 8.0 inches",
    weight: "0.8 pounds",
    tags: ["Classic", "Social Justice", "Coming of Age", "American South", "Legal Drama"],
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: "Powerful and moving. A book that stays with you long after reading.",
        author: "ClassicReader",
        date: "2024-01-12"
      }
    ]
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
    description: "A dystopian social science fiction novel about totalitarian control and surveillance. Winston Smith works for the Ministry of Truth in Oceania, but begins to question the Party's absolute power and Big Brother's watchful eye.",
    category: "Science Fiction",
    categoryId: 2,
    inStock: true,
    stockCount: 32,
    publisher: "Signet Classics",
    publishedDate: "1949-06-08",
    pages: 328,
    language: "English",
    format: "Paperback",
    dimensions: "4.2 x 0.9 x 6.9 inches",
    weight: "0.6 pounds",
    tags: ["Dystopian", "Political Fiction", "Surveillance", "Totalitarianism", "Classic"],
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: "Chillingly relevant even today. Orwell's vision is both terrifying and brilliant.",
        author: "SciFiEnthusiast",
        date: "2024-01-08"
      }
    ]
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const product = mockProductDetails.find(p => p.id === id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product detail API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}