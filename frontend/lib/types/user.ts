export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses: Address[];
  wishlist: string[];
}

export interface Address {
  id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}
