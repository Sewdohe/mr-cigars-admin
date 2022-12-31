import { Timestamp } from "@angular/fire/firestore";

export interface FirebaseCartLine {
  itemName: string,
  itemPrice: number,
  quantity: number,
  modifier: number,
  variation: string[] | undefined
  id: string
}

export interface User {
  cart: FirebaseCart,
  email: string,
  userName: string,
  storeName: string
}

export interface FirebaseOrder {
  customer: string | null;
  customerUID: string;
  orderDate: Timestamp;
  cart: FirebaseCart;
  total: number;
  id: string;
  status: "Pending Review" | "Reviewed" | "Complete";
}

export interface CustomerDocument {
  email: string,
  fedTaxId: number,
  stateTaxId: number,
  storeAddress: string,
  storeCity: string,
  storeName: string,
  storeZip: string,
  userName: string,
  orders: FirebaseOrder[],
  cart: FirebaseCart
  uid: string;
}

export interface Product {
  description: string;
  wordpress_id: number;
  attributes: [
    {
      name?: string;
      options?: string[];
      variation?: boolean;
    }
  ]
  name: string;
  price: number;
  id: string;
  sku: number;
  slug: string;
  categories?: [
    {
      name: string;
      slug: string;
      id: string;
    }
  ]
  images: [{ src: string }];
  product_variations: [
    {
      attributes: [
        {
          name: string;
          option: string;
          id: string;
        }
      ]
    }
  ] | null
}

export interface FirebaseCart extends Array<FirebaseCartLine>{}

export interface CartLine {
  product: Product,
  qty: number,
  variation: string[] | undefined
}
