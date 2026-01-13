import { NextRequest, NextResponse } from 'next/server';
import { ImageScraper } from '@/lib/imageScraper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, isbn, sourceId, sourceUrl } = body;

    if (!title && !isbn) {
      return NextResponse.json(
        { error: 'Title or ISBN is required' },
        { status: 400 }
      );
    }

    const results = await ImageScraper.scrapeBookCover({
      title,
      author,
      isbn,
      sourceId,
      sourceUrl,
      maxResults: 5,
      minConfidence: 0.5,
    });

    return NextResponse.json({
      success: true,
      results,
      count: results.length,
    });

  } catch (error) {
    console.error('Image scraping API error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape images' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title');
  const author = searchParams.get('author');
  const isbn = searchParams.get('isbn');
  const sourceId = searchParams.get('sourceId');
  const sourceUrl = searchParams.get('sourceUrl');

  if (!title && !isbn) {
    return NextResponse.json(
      { error: 'Title or ISBN is required' },
      { status: 400 }
    );
  }

  try {
    const results = await ImageScraper.scrapeBookCover({
      title: title || undefined,
      author: author || undefined,
      isbn: isbn || undefined,
      sourceId: sourceId || undefined,
      sourceUrl: sourceUrl || undefined,
      maxResults: 5,
      minConfidence: 0.5,
    });

    return NextResponse.json({
      success: true,
      results,
      count: results.length,
    });

  } catch (error) {
    console.error('Image scraping API error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape images' },
      { status: 500 }
    );
  }
}