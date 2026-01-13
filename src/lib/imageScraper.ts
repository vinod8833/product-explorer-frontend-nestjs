export interface ScrapedImageResult {
  url: string;
  source: 'google-books' | 'openlibrary' | 'worldofbooks' | 'amazon' | 'goodreads';
  confidence: number;
  width?: number;
  height?: number;
}

export interface ImageScrapingOptions {
  title?: string;
  author?: string;
  isbn?: string;
  sourceId?: string;
  sourceUrl?: string;
  maxResults?: number;
  minConfidence?: number;
}

/**
 * Scrapes images from various book sources when not available in database
 */
export class ImageScraper {
  private static readonly SCRAPING_ENDPOINTS = {
    googleBooks: 'https://www.googleapis.com/books/v1/volumes',
    openLibrary: 'https://openlibrary.org/api/books',
    worldOfBooks: 'https://www.worldofbooks.com',
  };

  /**
   * Attempts to find book cover images from multiple sources
   */
  static async scrapeBookCover(options: ImageScrapingOptions): Promise<ScrapedImageResult[]> {
    const results: ScrapedImageResult[] = [];
    const { title, author, isbn, sourceUrl, maxResults = 5 } = options;

    try {
      // Try Google Books API first (most reliable)
      if (isbn || (title && author)) {
        const googleResults = await this.scrapeFromGoogleBooks({ title, author, isbn });
        results.push(...googleResults);
      }

      // Try Open Library
      if (isbn || title) {
        const openLibraryResults = await this.scrapeFromOpenLibrary({ title, isbn });
        results.push(...openLibraryResults);
      }

      // Try extracting from source URL if available
      if (sourceUrl && sourceUrl.includes('worldofbooks.com')) {
        const worldOfBooksResults = await this.scrapeFromWorldOfBooks(sourceUrl);
        results.push(...worldOfBooksResults);
      }

      // Sort by confidence and return top results
      return results
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, maxResults);

    } catch (error) {
      console.error('Image scraping failed:', error);
      return [];
    }
  }

  /**
   * Scrape from Google Books API
   */
  private static async scrapeFromGoogleBooks(options: {
    title?: string;
    author?: string;
    isbn?: string;
  }): Promise<ScrapedImageResult[]> {
    const { title, author, isbn } = options;
    const results: ScrapedImageResult[] = [];

    try {
      let query = '';
      if (isbn) {
        query = `isbn:${isbn}`;
      } else if (title && author) {
        query = `intitle:"${title}" inauthor:"${author}"`;
      } else if (title) {
        query = `intitle:"${title}"`;
      }

      if (!query) return results;

      const response = await fetch(
        `${this.SCRAPING_ENDPOINTS.googleBooks}?q=${encodeURIComponent(query)}&maxResults=3`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) return results;

      const data = await response.json();
      
      if (data.items) {
        for (const item of data.items) {
          const imageLinks = item.volumeInfo?.imageLinks;
          if (imageLinks) {
            // Prefer larger images
            const imageUrl = imageLinks.extraLarge || 
                           imageLinks.large || 
                           imageLinks.medium || 
                           imageLinks.small || 
                           imageLinks.thumbnail;

            if (imageUrl) {
              // Convert to HTTPS
              const httpsUrl = imageUrl.replace('http://', 'https://');
              
              results.push({
                url: httpsUrl,
                source: 'google-books',
                confidence: isbn ? 0.9 : 0.7, // Higher confidence for ISBN matches
                width: this.getImageDimension(imageLinks, 'width'),
                height: this.getImageDimension(imageLinks, 'height'),
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Google Books scraping failed:', error);
    }

    return results;
  }

  /**
   * Scrape from Open Library
   */
  private static async scrapeFromOpenLibrary(options: {
    title?: string;
    isbn?: string;
  }): Promise<ScrapedImageResult[]> {
    const { title, isbn } = options;
    const results: ScrapedImageResult[] = [];

    try {
      if (isbn) {
        // Try direct ISBN lookup
        const cleanIsbn = isbn.replace(/[-\s]/g, '');
        const sizes = ['L', 'M', 'S'];
        
        for (const size of sizes) {
          const url = `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-${size}.jpg`;
          
          // Test if image exists
          const isValid = await this.testImageExists(url);
          if (isValid) {
            results.push({
              url,
              source: 'openlibrary',
              confidence: 0.8,
              width: size === 'L' ? 300 : size === 'M' ? 180 : 120,
              height: size === 'L' ? 400 : size === 'M' ? 240 : 160,
            });
          }
        }
      }

      if (title && results.length === 0) {
        // Try title-based lookup
        const cleanTitle = title.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '_')
          .slice(0, 50);
        
        const url = `https://covers.openlibrary.org/b/title/${cleanTitle}-L.jpg`;
        const isValid = await this.testImageExists(url);
        
        if (isValid) {
          results.push({
            url,
            source: 'openlibrary',
            confidence: 0.6,
            width: 300,
            height: 400,
          });
        }
      }
    } catch (error) {
      console.error('Open Library scraping failed:', error);
    }

    return results;
  }

  /**
   * Scrape from World of Books source page
   */
  private static async scrapeFromWorldOfBooks(sourceUrl: string): Promise<ScrapedImageResult[]> {
    const results: ScrapedImageResult[] = [];

    try {
      // For World of Books, we'll try to construct image URLs based on patterns
      // This is a simplified approach - in a real implementation, you might use a proxy service
      
      // Extract product ID from URL if possible
      const urlMatch = sourceUrl.match(/\/([^\/]+)\/(\d+)$/);
      if (urlMatch) {
        const productId = urlMatch[2];
        
        // Common World of Books image URL patterns
        const possibleUrls = [
          `https://images.worldofbooks.com/product/${productId}/large.jpg`,
          `https://images.worldofbooks.com/product/${productId}/medium.jpg`,
          `https://cdn.worldofbooks.com/images/${productId}_large.jpg`,
          `https://static.worldofbooks.com/covers/${productId}.jpg`,
        ];

        for (const url of possibleUrls) {
          const isValid = await this.testImageExists(url);
          if (isValid) {
            results.push({
              url,
              source: 'worldofbooks',
              confidence: 0.7,
            });
            break; // Take the first valid one
          }
        }
      }
    } catch (error) {
      console.error('World of Books scraping failed:', error);
    }

    return results;
  }

  /**
   * Test if an image URL returns a valid image
   */
  private static async testImageExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
      });
      return response.ok;
    } catch (error) {
      // For CORS-blocked requests, try a different approach
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        
        // Timeout after 3 seconds
        setTimeout(() => resolve(false), 3000);
      });
    }
  }

  /**
   * Get image dimensions from Google Books imageLinks
   */
  private static getImageDimension(imageLinks: any, dimension: 'width' | 'height'): number | undefined {
    // Google Books doesn't provide dimensions, so we estimate based on size
    if (imageLinks.extraLarge) return dimension === 'width' ? 400 : 600;
    if (imageLinks.large) return dimension === 'width' ? 300 : 450;
    if (imageLinks.medium) return dimension === 'width' ? 200 : 300;
    if (imageLinks.small) return dimension === 'width' ? 150 : 225;
    if (imageLinks.thumbnail) return dimension === 'width' ? 100 : 150;
    return undefined;
  }

  /**
   * Cache scraped images to avoid repeated requests
   */
  private static imageCache = new Map<string, ScrapedImageResult[]>();

  static async getScrapedImageWithCache(options: ImageScrapingOptions): Promise<ScrapedImageResult[]> {
    const cacheKey = JSON.stringify(options);
    
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey)!;
    }

    const results = await this.scrapeBookCover(options);
    this.imageCache.set(cacheKey, results);
    
    // Clear cache after 1 hour
    setTimeout(() => {
      this.imageCache.delete(cacheKey);
    }, 60 * 60 * 1000);

    return results;
  }
}

/**
 * Enhanced image utilities with scraping capabilities
 */
export async function getEnhancedImageUrl(options: {
  primaryUrl?: string;
  title?: string;
  author?: string;
  isbn?: string;
  sourceId?: string;
  sourceUrl?: string;
}): Promise<string | undefined> {
  const { primaryUrl, title, author, isbn, sourceId, sourceUrl } = options;

  // First, try the primary URL if available
  if (primaryUrl) {
    const isValid = await ImageScraper['testImageExists'](primaryUrl);
    if (isValid) {
      return primaryUrl;
    }
  }

  // If primary URL fails, try scraping
  if (title || isbn) {
    const scrapedResults = await ImageScraper.getScrapedImageWithCache({
      title,
      author,
      isbn,
      sourceId,
      sourceUrl,
      maxResults: 1,
      minConfidence: 0.5,
    });

    if (scrapedResults.length > 0) {
      return scrapedResults[0].url;
    }
  }

  // Fallback to placeholder
  return '/book-cover-placeholder.svg';
}