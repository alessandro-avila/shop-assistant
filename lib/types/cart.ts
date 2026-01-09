export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  addedAt: string;
}

export interface CartState {
  items: CartItem[];
  lastModified: string;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };
