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
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(`
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
        WHERE c.id = $1
      `, [idNum]);

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
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
    console.error('Category Detail API Error:', error);
    
    // Return mock data if database fails
    const mockCategory = {
      id: parseInt(id),
      navigationId: 1,
      parentId: null,
      title: 'Sample Category',
      slug: 'sample-category',
      sourceUrl: null,
      productCount: 50,
      lastScrapedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      navigationTitle: 'Books',
      parentTitle: null
    };

    return NextResponse.json({
      success: true,
      data: mockCategory,
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
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const { title, slug, sourceUrl, parentId, navigationId } = body;

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `UPDATE category 
         SET title = COALESCE($1, title),
             slug = COALESCE($2, slug),
             source_url = COALESCE($3, source_url),
             parent_id = COALESCE($4, parent_id),
             navigation_id = COALESCE($5, navigation_id),
             updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [title, slug, sourceUrl, parentId, navigationId, idNum]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Category updated successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Update Category Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update category',
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
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query('DELETE FROM category WHERE id = $1 RETURNING id', [idNum]);

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Delete Category Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete category',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}