export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryName: string;
  brandName: string;
}

export interface AuthResponse {
  token: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'ROLE_USER' | 'ROLE_ADMIN';
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  brandId: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}