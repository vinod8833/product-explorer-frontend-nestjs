import { NextRequest, NextResponse } from 'next/server';

// Mock data for navigation
const mockNavigation = [
  {
    id: 1,
    name: "Books",
    slug: "books",
    description: "All book categories",
    order: 1,
    isActive: true
  },
  {
    id: 2,
    name: "Featured",
    slug: "featured",
    description: "Featured and recommended books",
    order: 2,
    isActive: true
  },
  {
    id: 3,
    name: "New Releases",
    slug: "new-releases",
    description: "Latest book releases",
    order: 3,
    isActive: true
  },
  {
    id: 4,
    name: "Best Sellers",
    slug: "best-sellers",
    description: "Top selling books",
    order: 4,
    isActive: true
  }
];

export async function GET(request: NextRequest) {
  try {
    const response = {
      data: mockNavigation.filter(nav => nav.isActive)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Navigation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}