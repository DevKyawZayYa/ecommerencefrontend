export interface ProductResponse {
  items: Product[];
  totalItems: number;
  page: number;
  pageSize: number;
}

export interface Product {
  id: { value: string };
  name: string;
  description: string;
  color: string;
  price: { amount: number };
  sku: { value: string };
  primaryImageUrl?: string | null;
  createdDate: string;

  originalPrice?: number;
  colors?: string[];
  imageUrls?: {
    id: string;
    productId: { value: string };
    imageUrl: string;
    isPrimary: boolean;
    sortOrder: number;
  }[];
}
