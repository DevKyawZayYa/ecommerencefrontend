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
    price: { amount: number };
    sku: { value: string };
    createdDate: string;
  }
  