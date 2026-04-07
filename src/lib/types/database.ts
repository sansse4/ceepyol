export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          brand: string;
          category: string;
          price: number;
          original_price: number | null;
          monthly_price: number | null;
          images: Json;
          colors: Json;
          storage: Json | null;
          specs: Json;
          description: string;
          badges: string[];
          condition: string;
          in_stock: boolean;
          rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          brand: string;
          category: string;
          price: number;
          original_price?: number | null;
          monthly_price?: number | null;
          images?: Json;
          colors?: Json;
          storage?: Json | null;
          specs?: Json;
          description?: string;
          badges?: string[];
          condition?: string;
          in_stock?: boolean;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          brand?: string;
          category?: string;
          price?: number;
          original_price?: number | null;
          monthly_price?: number | null;
          images?: Json;
          colors?: Json;
          storage?: Json | null;
          specs?: Json;
          description?: string;
          badges?: string[];
          condition?: string;
          in_stock?: boolean;
          rating?: number;
          review_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          avatar: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          phone?: string | null;
          avatar?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          email?: string;
          phone?: string | null;
          avatar?: string | null;
          role?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          total: number;
          status: string;
          payment_method: string;
          payment_status: string;
          shipping_address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total: number;
          status?: string;
          payment_method?: string;
          payment_status?: string;
          shipping_address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          total?: number;
          status?: string;
          payment_method?: string;
          payment_status?: string;
          shipping_address?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          selected_color: string | null;
          selected_storage: string | null;
          unit_price: number;
          product_name: string;
          product_image: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity?: number;
          selected_color?: string | null;
          selected_storage?: string | null;
          unit_price: number;
          product_name: string;
          product_image: string;
          created_at?: string;
        };
        Update: {
          quantity?: number;
          selected_color?: string | null;
          selected_storage?: string | null;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          selected_color: string | null;
          selected_storage: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity?: number;
          selected_color?: string | null;
          selected_storage?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          quantity?: number;
          selected_color?: string | null;
          selected_storage?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {};
        Relationships: [];
      };
      announcements: {
        Row: {
          id: string;
          text: string;
          type: string;
          bg_color: string;
          text_color: string;
          link: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          text: string;
          type: string;
          bg_color?: string;
          text_color?: string;
          link?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          text?: string;
          type?: string;
          bg_color?: string;
          text_color?: string;
          link?: string | null;
          active?: boolean;
        };
        Relationships: [];
      };
      discount_codes: {
        Row: {
          id: string;
          code: string;
          type: string;
          value: number;
          min_order: number;
          max_uses: number;
          used_count: number;
          active: boolean;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: string;
          value: number;
          min_order?: number;
          max_uses?: number;
          used_count?: number;
          active?: boolean;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          code?: string;
          type?: string;
          value?: number;
          min_order?: number;
          max_uses?: number;
          used_count?: number;
          active?: boolean;
          expires_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
          bg_color: string;
          bg_gradient: string;
          bg_image: string;
          bg_mode: string;
          primary_color: string;
          accent_color: string;
          promo_text: string;
          site_name: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          bg_color?: string;
          bg_gradient?: string;
          bg_image?: string;
          bg_mode?: string;
          primary_color?: string;
          accent_color?: string;
          promo_text?: string;
          site_name?: string;
          updated_at?: string;
        };
        Update: {
          bg_color?: string;
          bg_gradient?: string;
          bg_image?: string;
          bg_mode?: string;
          primary_color?: string;
          accent_color?: string;
          promo_text?: string;
          site_name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
