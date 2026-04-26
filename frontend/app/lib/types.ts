export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  image: string | null;
  slug: string;
  category: Category;
  created_at: string;
};

export type WishlistItem = {
  id: number;
  product: Product;
};

export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
};

export type Address = {
  id: number;
  full_name: string;
  phone?: string;
  city: string;
  street: string;
};

export type UserProfile = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
};

export type OrderItem = {
  product: Product;
  quantity: number;
  price: string | number;
};

export type Order = {
  id: number;
  total_price: string | number;
  status: string;
  payment_method?: string;
  created_at: string;
  items: OrderItem[];
};

export type Review = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
