export interface ScrapeJobResponse {
  id: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  totalCategories: number;
  scrapedCount: number;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface ScrapedProductResponse {
  id: number;
  categoryName: string;
  rank: number;
  productName: string;
  price: string | null;
  imageUrl: string | null;
  productUrl: string | null;
  sourceSite: string | null;
  scrapedAt: string;
}

export interface ScrapeResultResponse {
  job: ScrapeJobResponse | null;
  productsByCategory: Record<string, ScrapedProductResponse[]>;
}
