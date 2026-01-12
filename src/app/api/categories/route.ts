import { NextRequest, NextResponse } from 'next/server';

// Mock data for categories
const mockCategories = [
  {
    id: 1,
    name: "Fiction",
    description: "Novels, short stories, and fictional works",
    productCount: 150,
    imageUrl: "https://picsum.photos/200/200?text=Fiction",
    slug: "fiction"
  },
  {
    id: 2,
    name: "Science Fiction",
    description: "Futuristic and speculative fiction",
    productCount: 85,
    imageUrl: "https://picsum.photos/200/200?text=SciFi",
    slug: "science-fiction"
  },
  {
    id: 3,
    name: "Mystery",
    description: "Crime, detective, and mystery novels",
    productCount: 120,
    imageUrl: "https://picsum.photos/200/200?text=Mystery",
    slug: "mystery"
  },
  {
    id: 4,
    name: "Romance",
    description: "Love stories and romantic fiction",
    productCount: 95,
    imageUrl: "https://picsum.photos/200/200?text=Romance",
    slug: "romance"
  },
  {
    id: 5,
    name: "Non-Fiction",
    description: "Biographies, history, and factual books",
    productCount: 200,
    imageUrl: "https://picsum.photos/200/200?text=NonFiction",
    slug: "non-fiction"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const navigationId = searchParams.get('navigationId');

    let filteredCategories = mockCategories;

    // Filter by navigation if provided (for future use)
    if (navigationId) {
      // For now, return all categories regardless of navigationId
      // In a real app, you'd filter based on navigation hierarchy
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

    const response = {
      data: paginatedCategories,
      pagination: {
        page,
        limit,
        total: filteredCategories.length,
        totalPages: Math.ceil(filteredCategories.length / limit),
        hasNext: endIndex < filteredCategories.length,
        hasPrev: page > 1
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}