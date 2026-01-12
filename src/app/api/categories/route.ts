import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const navigationId = searchParams.get('navigationId');
    
    const offset = (page - 1) * limit;

    const client = await pool.connect();
    
    try {
      let query = `
        SELECT 
          c.id,
          c.navigation_id as "navigationId",
          c.parent_id as "parentId",
          c.title,
          c.slug,
          c.source_url as "sourceUrl",
          c.product_count as "productCount",
          c.last_scraped_at as "lastScrapedAt",
          c.created_at as "createdAt",
          c.updated_at as "updatedAt",
          n.title as "navigationTitle",
          p.title as "parentTitle"
        FROM category c
        LEFT JOIN navigation n ON c.navigation_id = n.id
        LEFT JOIN category p ON c.parent_id = p.id
      `;
      
      const queryParams = [];
      let paramCount = 1;

      if (navigationId) {
        query += ` WHERE c.navigation_id = $${paramCount++}`;
        queryParams.push(parseInt(navigationId));
      }

      query += ` ORDER BY c.title LIMIT $${paramCount++} OFFSET $${paramCount++}`;
      queryParams.push(limit, offset);

      const result = await client.query(query, queryParams);

      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM category c';
      const countParams = [];
      
      if (navigationId) {
        countQuery += ' WHERE c.navigation_id = $1';
        countParams.push(parseInt(navigationId));
      }

      const countResult = await client.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(total / limit);

      return NextResponse.json({
        success: true,
        data: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        timestamp: new Date().toISOString()
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Categories API Error:', error);
    
    // Return mock data if database fails
    const mockCategories = [
      { id: 1, navigationId: 1, parentId: null, title: 'Fiction', slug: 'fiction', sourceUrl: null, productCount: 150, lastScrapedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), navigationTitle: 'Books', parentTitle: null },
      { id: 2, navigationId: 1, parentId: null, title: 'Non-Fiction', slug: 'non-fiction', sourceUrl: null, productCount: 89, lastScrapedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), navigationTitle: 'Books', parentTitle: null },
      { id: 3, navigationId: 1, parentId: null, title: 'Children\'s Books', slug: 'childrens-books', sourceUrl: null, productCount: 67, lastScrapedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), navigationTitle: 'Books', parentTitle: null },
      { id: 4, navigationId: 2, parentId: null, title: 'Science Fiction', slug: 'science-fiction', sourceUrl: null, productCount: 45, lastScrapedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), navigationTitle: 'Categories', parentTitle: null },
      { id: 5, navigationId: 2, parentId: null, title: 'Romance', slug: 'romance', sourceUrl: null, productCount: 78, lastScrapedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), navigationTitle: 'Categories', parentTitle: null },
      { id: 6, navigationId: 2, parentId: null, title: 'Mystery', slug: 'mystery', sourceUrl: null, productCount: 56, lastScrapedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), navigationTitle: 'Categories', parentTitle: null }
    ];

    const page = parseInt(new URL(request.url).searchParams.get('page') || '1');
    const limit = parseInt(new URL(request.url).searchParams.get('limit') || '20');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = mockCategories.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: mockCategories.length,
        totalPages: Math.ceil(mockCategories.length / limit),
        hasNext: page < Math.ceil(mockCategories.length / limit),
        hasPrev: page > 1
      },
      timestamp: new Date().toISOString(),
      note: 'Using mock data - database connection failed'
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { navigationId, parentId, title, slug, sourceUrl } = body;

    if (!navigationId || !title || !slug) {
      return NextResponse.json(
        { success: false, error: 'Navigation ID, title, and slug are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `INSERT INTO category (navigation_id, parent_id, title, slug, source_url, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
         RETURNING *`,
        [navigationId, parentId, title, slug, sourceUrl]
      );

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Category created successfully'
      }, { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create Category Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create category',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}