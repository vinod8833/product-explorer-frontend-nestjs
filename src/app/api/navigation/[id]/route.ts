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
        { success: false, error: 'Invalid navigation ID' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT 
          n.id,
          n.title,
          n.slug,
          n.source_url as "sourceUrl",
          n.last_scraped_at as "lastScrapedAt",
          n.created_at as "createdAt",
          n.updated_at as "updatedAt",
          json_agg(
            json_build_object(
              'id', c.id,
              'title', c.title,
              'slug', c.slug,
              'productCount', c.product_count,
              'parentId', c.parent_id
            ) ORDER BY c.title
          ) FILTER (WHERE c.id IS NOT NULL) as categories
        FROM navigation n
        LEFT JOIN category c ON n.id = c.navigation_id
        WHERE n.id = $1
        GROUP BY n.id, n.title, n.slug, n.source_url, n.last_scraped_at, n.created_at, n.updated_at`,
        [idNum]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Navigation item not found' },
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
    console.error('Get Navigation Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch navigation item',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
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
        { success: false, error: 'Invalid navigation ID' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const updateFields = [];
      const values = [];
      let paramCount = 1;

      if (body.title) {
        updateFields.push(`title = $${paramCount++}`);
        values.push(body.title);
      }
      if (body.slug) {
        updateFields.push(`slug = $${paramCount++}`);
        values.push(body.slug);
      }
      if (body.sourceUrl !== undefined) {
        updateFields.push(`source_url = $${paramCount++}`);
        values.push(body.sourceUrl);
      }

      if (updateFields.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No fields to update' },
          { status: 400 }
        );
      }

      updateFields.push(`updated_at = NOW()`);
      values.push(idNum);

      const result = await client.query(
        `UPDATE navigation SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Navigation item not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Navigation item updated successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Update Navigation Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update navigation item',
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
        { success: false, error: 'Invalid navigation ID' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'DELETE FROM navigation WHERE id = $1 RETURNING *',
        [idNum]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Navigation item not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Navigation item deleted successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Delete Navigation Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete navigation item',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}