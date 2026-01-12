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
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('q');
    const author = searchParams.get('author');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    const offset = (page - 1) * limit;

    const client = await pool.connect();
    
    try {
      let query = `
        SELECT 
          p.id,
          p.source_id as "sourceId",
          p.category_id as "categoryId",
          p.title,
          p.author,
          p.price,
          p.currency,
          p.image_url as "imageUrl",
          p.source_url as "sourceUrl",
          p.in_stock as "inStock",
          p.last_scraped_at as "lastScrapedAt",
          p.created_at as "createdAt",
          p.updated_at as "updatedAt",
          c.title as "categoryTitle",
          c.slug as "categorySlug"
        FROM product p
        LEFT JOIN category c ON p.category_id = c.id
        WHERE 1=1
      `;
      
      const queryParams = [];
      let paramCount = 1;

      if (categoryId) {
        query += ` AND p.category_id = $${paramCount++}`;
        queryParams.push(parseInt(categoryId));
      }

      if (search) {
        query += ` AND (p.title ILIKE $${paramCount++} OR p.author ILIKE $${paramCount++})`;
        queryParams.push(`%${search}%`, `%${search}%`);
        paramCount++;
      }

      if (author) {
        query += ` AND p.author ILIKE $${paramCount++}`;
        queryParams.push(`%${author}%`);
      }

      if (minPrice) {
        query += ` AND p.price >= $${paramCount++}`;
        queryParams.push(parseFloat(minPrice));
      }

      if (maxPrice) {
        query += ` AND p.price <= $${paramCount++}`;
        queryParams.push(parseFloat(maxPrice));
      }

      query += ` ORDER BY p.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
      queryParams.push(limit, offset);

      const result = await client.query(query, queryParams);

      // Get total count with same filters
      let countQuery = 'SELECT COUNT(*) FROM product p WHERE 1=1';
      const countParams = [];
      let countParamCount = 1;

      if (categoryId) {
        countQuery += ` AND p.category_id = $${countParamCount++}`;
        countParams.push(parseInt(categoryId));
      }

      if (search) {
        countQuery += ` AND (p.title ILIKE $${countParamCount++} OR p.author ILIKE $${countParamCount++})`;
        countParams.push(`%${search}%`, `%${search}%`);
        countParamCount++;
      }

      if (author) {
        countQuery += ` AND p.author ILIKE $${countParamCount++}`;
        countParams.push(`%${author}%`);
      }

      if (minPrice) {
        countQuery += ` AND p.price >= $${countParamCount++}`;
        countParams.push(parseFloat(minPrice));
      }

      if (maxPrice) {
        countQuery += ` AND p.price <= $${countParamCount++}`;
        countParams.push(parseFloat(maxPrice));
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
        filters: {
          categoryId,
          search,
          author,
          minPrice,
          maxPrice
        },
        timestamp: new Date().toISOString()
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Products API Error:', error);
    
    // Return mock data if database fails
    const mockProducts = [
      {
        id: 1,
        sourceId: 'wob-001',
        categoryId: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: 12.99,
        currency: 'GBP',
        imageUrl: 'https://dummyimage.com/300x400/cccccc/666666.png?text=Book+Cover',
        sourceUrl: 'https://worldofbooks.com/product/1',
        inStock: true,
        lastScrapedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categoryTitle: 'Fiction',
        categorySlug: 'fiction'
      },
      {
        id: 2,
        sourceId: 'wob-002',
        categoryId: 1,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        price: 10.99,
        currency: 'GBP',
        imageUrl: 'https://dummyimage.com/300x400/cccccc/666666.png?text=Book+Cover',
        sourceUrl: 'https://worldofbooks.com/product/2',
        inStock: true,
        lastScrapedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categoryTitle: 'Fiction',
        categorySlug: 'fiction'
      },
      {
        id: 3,
        sourceId: 'wob-003',
        categoryId: 2,
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        price: 15.99,
        currency: 'GBP',
        imageUrl: 'https://dummyimage.com/300x400/cccccc/666666.png?text=Book+Cover',
        sourceUrl: 'https://worldofbooks.com/product/3',
        inStock: true,
        lastScrapedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categoryTitle: 'Non-Fiction',
        categorySlug: 'non-fiction'
      }
    ];

    const page = parseInt(new URL(request.url).searchParams.get('page') || '1');
    const limit = parseInt(new URL(request.url).searchParams.get('limit') || '20');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = mockProducts.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: mockProducts.length,
        totalPages: Math.ceil(mockProducts.length / limit),
        hasNext: page < Math.ceil(mockProducts.length / limit),
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
    const { sourceId, categoryId, title, author, price, currency, imageUrl, sourceUrl, inStock } = body;

    if (!sourceId || !title || !sourceUrl) {
      return NextResponse.json(
        { success: false, error: 'Source ID, title, and source URL are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `INSERT INTO product (source_id, category_id, title, author, price, currency, image_url, source_url, in_stock, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) 
         RETURNING *`,
        [sourceId, categoryId, title, author, price, currency || 'GBP', imageUrl, sourceUrl, inStock !== false]
      );

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Product created successfully'
      }, { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create Product Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}