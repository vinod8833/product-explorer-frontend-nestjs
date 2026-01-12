import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    
    if (isNaN(idNum)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      // Get product with category details
      const result = await client.query(`
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
          c.slug as "categorySlug",
          n.title as "navigationTitle"
        FROM product p
        LEFT JOIN category c ON p.category_id = c.id
        LEFT JOIN navigation n ON c.navigation_id = n.id
        WHERE p.id = $1
      `, [idNum]);

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        timestamp: new Date().toISOString()
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Product Detail API Error:', error);
    
    // Return mock data if database fails
    const { id } = await params;
    const mockProduct = {
      id: parseInt(id),
      sourceId: `wob-${id}`,
      categoryId: 1,
      title: 'Sample Book Title',
      author: 'Sample Author',
      price: 12.99,
      currency: 'GBP',
      imageUrl: 'https://dummyimage.com/300x400/cccccc/666666.png?text=Book+Cover',
      sourceUrl: `https://worldofbooks.com/product/${id}`,
      inStock: true,
      lastScrapedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      categoryTitle: 'Fiction',
      categorySlug: 'fiction',
      navigationTitle: 'Books'
    };

    return NextResponse.json({
      success: true,
      data: mockProduct,
      timestamp: new Date().toISOString(),
      note: 'Using mock data - database connection failed'
    });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    const body = await request.json();
    
    if (isNaN(idNum)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const { title, author, price, currency, imageUrl, sourceUrl, inStock, categoryId } = body;

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `UPDATE product 
         SET title = COALESCE($1, title),
             author = COALESCE($2, author),
             price = COALESCE($3, price),
             currency = COALESCE($4, currency),
             image_url = COALESCE($5, image_url),
             source_url = COALESCE($6, source_url),
             in_stock = COALESCE($7, in_stock),
             category_id = COALESCE($8, category_id),
             updated_at = NOW()
         WHERE id = $9
         RETURNING *`,
        [title, author, price, currency, imageUrl, sourceUrl, inStock, categoryId, idNum]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Product updated successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Update Product Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    
    if (isNaN(idNum)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query('DELETE FROM product WHERE id = $1 RETURNING id', [idNum]);

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Delete Product Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}