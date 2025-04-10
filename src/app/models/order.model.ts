export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }
  
  export interface Order {
    status: string;
    deliveryStatus: string;
    items: OrderItem[];
  }
  