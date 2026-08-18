export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_activity_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string | null
          created_at: string
          detail: Json | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          detail?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          detail?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          career_id: string
          cover_letter: string
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string
          resume_url: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          career_id: string
          cover_letter: string
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone: string
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          career_id?: string
          cover_letter?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_name: string
          category_id: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string
          id: string
          is_featured: boolean
          is_published: boolean
          meta_desc: string | null
          meta_keywords: string | null
          meta_title: string | null
          published_at: string | null
          reading_time: number | null
          slug: string
          tags: Json
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          author_name?: string
          category_id?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          meta_desc?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          tags?: Json
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          author_name?: string
          category_id?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          meta_desc?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          tags?: Json
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      careers: {
        Row: {
          benefits: Json
          created_at: string
          deadline: string | null
          department: string
          description: string
          experience: string
          id: string
          is_published: boolean
          location: string
          requirements: Json
          salary: string | null
          slug: string
          title: string
          type: Database["public"]["Enums"]["employment_type"]
          updated_at: string
        }
        Insert: {
          benefits?: Json
          created_at?: string
          deadline?: string | null
          department: string
          description?: string
          experience?: string
          id?: string
          is_published?: boolean
          location: string
          requirements?: Json
          salary?: string | null
          slug: string
          title: string
          type?: Database["public"]["Enums"]["employment_type"]
          updated_at?: string
        }
        Update: {
          benefits?: Json
          created_at?: string
          deadline?: string | null
          department?: string
          description?: string
          experience?: string
          id?: string
          is_published?: boolean
          location?: string
          requirements?: Json
          salary?: string | null
          slug?: string
          title?: string
          type?: Database["public"]["Enums"]["employment_type"]
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          budget: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          notes: string | null
          phone: string | null
          replied_at: string | null
          service: string | null
          status: Database["public"]["Enums"]["message_status"]
          updated_at: string
        }
        Insert: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          notes?: string | null
          phone?: string | null
          replied_at?: string | null
          service?: string | null
          status?: Database["public"]["Enums"]["message_status"]
          updated_at?: string
        }
        Update: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          notes?: string | null
          phone?: string | null
          replied_at?: string | null
          service?: string | null
          status?: Database["public"]["Enums"]["message_status"]
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_published: boolean
          product_id: string | null
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          product_id?: string | null
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          product_id?: string | null
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faqs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      media_files: {
        Row: {
          alt_text: string | null
          created_at: string
          folder: string | null
          format: string
          height: number | null
          id: string
          name: string
          size: number
          storage_path: string
          updated_at: string
          uploaded_by: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          folder?: string | null
          format?: string
          height?: number | null
          id?: string
          name: string
          size?: number
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          folder?: string | null
          format?: string
          height?: number | null
          id?: string
          name?: string
          size?: number
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_verified: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_verified?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_verified?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_requests: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: string
          message: string | null
          name: string
          notes: string | null
          phone: string
          product_id: string
          source: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          phone: string
          product_id: string
          source?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string
          product_id?: string
          source?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          benefits: Json
          category_id: string | null
          created_at: string
          description: string
          display_name: string
          features: Json
          gallery_images: Json
          hardware_specs: Json
          icon_name: string
          id: string
          image_url: string | null
          is_featured: boolean
          is_published: boolean
          kind: Database["public"]["Enums"]["product_kind"]
          meta_desc: string | null
          meta_title: string | null
          name: string
          price_note: string | null
          product_url: string | null
          show_request_button: boolean
          slug: string
          sort_order: number
          tagline: string
          updated_at: string
        }
        Insert: {
          benefits?: Json
          category_id?: string | null
          created_at?: string
          description?: string
          display_name: string
          features?: Json
          gallery_images?: Json
          hardware_specs?: Json
          icon_name?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          kind?: Database["public"]["Enums"]["product_kind"]
          meta_desc?: string | null
          meta_title?: string | null
          name: string
          price_note?: string | null
          product_url?: string | null
          show_request_button?: boolean
          slug: string
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Update: {
          benefits?: Json
          category_id?: string | null
          created_at?: string
          description?: string
          display_name?: string
          features?: Json
          gallery_images?: Json
          hardware_specs?: Json
          icon_name?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          kind?: Database["public"]["Enums"]["product_kind"]
          meta_desc?: string | null
          meta_title?: string | null
          name?: string
          price_note?: string | null
          product_url?: string | null
          show_request_button?: boolean
          slug?: string
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          client_name: string | null
          completed_at: string | null
          cover_image_url: string | null
          created_at: string
          features: Json
          github_url: string | null
          id: string
          images: Json
          is_featured: boolean
          is_published: boolean
          long_desc: string
          meta_desc: string | null
          meta_title: string | null
          project_url: string | null
          short_desc: string
          slug: string
          tech_stack: Json
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          client_name?: string | null
          completed_at?: string | null
          cover_image_url?: string | null
          created_at?: string
          features?: Json
          github_url?: string | null
          id?: string
          images?: Json
          is_featured?: boolean
          is_published?: boolean
          long_desc?: string
          meta_desc?: string | null
          meta_title?: string | null
          project_url?: string | null
          short_desc: string
          slug: string
          tech_stack?: Json
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          client_name?: string | null
          completed_at?: string | null
          cover_image_url?: string | null
          created_at?: string
          features?: Json
          github_url?: string | null
          id?: string
          images?: Json
          is_featured?: boolean
          is_published?: boolean
          long_desc?: string
          meta_desc?: string | null
          meta_title?: string | null
          project_url?: string | null
          short_desc?: string
          slug?: string
          tech_stack?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          benefits: Json
          created_at: string
          faqs: Json
          features: Json
          icon_name: string
          id: string
          image_url: string | null
          is_published: boolean
          long_desc: string
          meta_desc: string | null
          meta_title: string | null
          pricing_overview: string | null
          short_desc: string
          slug: string
          sort_order: number
          tech_stack: Json
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: Json
          created_at?: string
          faqs?: Json
          features?: Json
          icon_name?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          long_desc?: string
          meta_desc?: string | null
          meta_title?: string | null
          pricing_overview?: string | null
          short_desc: string
          slug: string
          sort_order?: number
          tech_stack?: Json
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: Json
          created_at?: string
          faqs?: Json
          features?: Json
          icon_name?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          long_desc?: string
          meta_desc?: string | null
          meta_title?: string | null
          pricing_overview?: string | null
          short_desc?: string
          slug?: string
          sort_order?: number
          tech_stack?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string
          address: string
          background_color: string
          body_font: string
          border_color: string
          business_hours: string
          city: string
          country: string
          created_at: string
          custom_css: string | null
          display_font: string
          email: string
          email_sales: string
          email_support: string
          facebook: string | null
          favicon_url: string | null
          founded_year: string
          github: string | null
          google_analytics_id: string | null
          google_maps_embed_url: string | null
          gradient_end: string
          gradient_start: string
          hero_cta_primary_text: string
          hero_cta_primary_url: string
          hero_cta_secondary_text: string
          hero_cta_secondary_url: string
          hero_eyebrow: string
          hero_headline: string
          hero_image_url: string | null
          hero_subheadline: string
          id: string
          instagram: string | null
          latitude: string | null
          linkedin: string | null
          logo_text: string
          logo_url: string | null
          longitude: string | null
          maintenance_message: string
          maintenance_mode: boolean
          meta_description: string
          meta_keywords: string
          meta_title: string
          og_image_url: string | null
          phone: string
          postal_code: string
          primary_color: string
          site_name: string
          stats: Json
          surface_color: string
          tagline: string
          text_color: string
          text_muted_color: string
          trusted_by_logos: Json
          twitter: string | null
          updated_at: string
          whatsapp: string
          youtube: string | null
        }
        Insert: {
          accent_color?: string
          address?: string
          background_color?: string
          body_font?: string
          border_color?: string
          business_hours?: string
          city?: string
          country?: string
          created_at?: string
          custom_css?: string | null
          display_font?: string
          email?: string
          email_sales?: string
          email_support?: string
          facebook?: string | null
          favicon_url?: string | null
          founded_year?: string
          github?: string | null
          google_analytics_id?: string | null
          google_maps_embed_url?: string | null
          gradient_end?: string
          gradient_start?: string
          hero_cta_primary_text?: string
          hero_cta_primary_url?: string
          hero_cta_secondary_text?: string
          hero_cta_secondary_url?: string
          hero_eyebrow?: string
          hero_headline?: string
          hero_image_url?: string | null
          hero_subheadline?: string
          id?: string
          instagram?: string | null
          latitude?: string | null
          linkedin?: string | null
          logo_text?: string
          logo_url?: string | null
          longitude?: string | null
          maintenance_message?: string
          maintenance_mode?: boolean
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          og_image_url?: string | null
          phone?: string
          postal_code?: string
          primary_color?: string
          site_name?: string
          stats?: Json
          surface_color?: string
          tagline?: string
          text_color?: string
          text_muted_color?: string
          trusted_by_logos?: Json
          twitter?: string | null
          updated_at?: string
          whatsapp?: string
          youtube?: string | null
        }
        Update: {
          accent_color?: string
          address?: string
          background_color?: string
          body_font?: string
          border_color?: string
          business_hours?: string
          city?: string
          country?: string
          created_at?: string
          custom_css?: string | null
          display_font?: string
          email?: string
          email_sales?: string
          email_support?: string
          facebook?: string | null
          favicon_url?: string | null
          founded_year?: string
          github?: string | null
          google_analytics_id?: string | null
          google_maps_embed_url?: string | null
          gradient_end?: string
          gradient_start?: string
          hero_cta_primary_text?: string
          hero_cta_primary_url?: string
          hero_cta_secondary_text?: string
          hero_cta_secondary_url?: string
          hero_eyebrow?: string
          hero_headline?: string
          hero_image_url?: string | null
          hero_subheadline?: string
          id?: string
          instagram?: string | null
          latitude?: string | null
          linkedin?: string | null
          logo_text?: string
          logo_url?: string | null
          longitude?: string | null
          maintenance_message?: string
          maintenance_mode?: boolean
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          og_image_url?: string | null
          phone?: string
          postal_code?: string
          primary_color?: string
          site_name?: string
          stats?: Json
          surface_color?: string
          tagline?: string
          text_color?: string
          text_muted_color?: string
          trusted_by_logos?: Json
          twitter?: string | null
          updated_at?: string
          whatsapp?: string
          youtube?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          department: string | null
          designation: string
          email: string | null
          github: string | null
          id: string
          image_url: string | null
          is_leadership: boolean
          is_published: boolean
          linkedin: string | null
          name: string
          sort_order: number
          twitter: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          department?: string | null
          designation: string
          email?: string | null
          github?: string | null
          id?: string
          image_url?: string | null
          is_leadership?: boolean
          is_published?: boolean
          linkedin?: string | null
          name: string
          sort_order?: number
          twitter?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          department?: string | null
          designation?: string
          email?: string | null
          github?: string | null
          id?: string
          image_url?: string | null
          is_leadership?: boolean
          is_published?: boolean
          linkedin?: string | null
          name?: string
          sort_order?: number
          twitter?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string
          created_at: string
          designation: string
          id: string
          is_featured: boolean
          is_published: boolean
          name: string
          rating: number
          review: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company: string
          created_at?: string
          designation: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          name: string
          rating?: number
          review: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string
          created_at?: string
          designation?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          name?: string
          rating?: number
          review?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_min_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "manager" | "staff"
      application_status:
        | "PENDING"
        | "REVIEWING"
        | "SHORTLISTED"
        | "REJECTED"
        | "HIRED"
      employment_type:
        | "FULL_TIME"
        | "PART_TIME"
        | "CONTRACT"
        | "INTERNSHIP"
        | "REMOTE"
      message_status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED"
      product_kind: "SOFTWARE" | "HARDWARE" | "MOBILE_APP" | "WEB_APP"
      request_status: "NEW" | "CONTACTED" | "INTERESTED" | "CONVERTED" | "LOST"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "manager", "staff"],
      application_status: [
        "PENDING",
        "REVIEWING",
        "SHORTLISTED",
        "REJECTED",
        "HIRED",
      ],
      employment_type: [
        "FULL_TIME",
        "PART_TIME",
        "CONTRACT",
        "INTERNSHIP",
        "REMOTE",
      ],
      message_status: ["UNREAD", "READ", "REPLIED", "ARCHIVED"],
      product_kind: ["SOFTWARE", "HARDWARE", "MOBILE_APP", "WEB_APP"],
      request_status: ["NEW", "CONTACTED", "INTERESTED", "CONVERTED", "LOST"],
    },
  },
} as const
