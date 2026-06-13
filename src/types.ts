export interface Color {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  sizes: string[];
  colors: Color[];
  gender: 'Unisex' | 'Men' | 'Women';
  status: 'Active' | 'Draft' | 'Out of Stock' | 'Archived';
  features: string[];
  specifications: Record<string, string>;
  stock: number;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  id: string; // unique item id = product_id + size + color
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  size: string;
  color: Color;
  quantity: number;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
  expiresAt?: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  role: string;
  message: string;
  isVerified: boolean;
  avatar: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    region: string;
  };
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  paymentReference?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'sub-admin' | 'admin' | 'super-admin';
  createdAt: string;
  shippingAddress?: {
    phone: string;
    city: string;
    line1: string;
  };
}
