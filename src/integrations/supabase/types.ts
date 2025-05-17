export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          capacity: number | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          location: string
          time: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          location: string
          time: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          location?: string
          time?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          activity_id: string
          id: string
          notes: string | null
          recorded_at: string | null
          scout_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          activity_id: string
          id?: string
          notes?: string | null
          recorded_at?: string | null
          scout_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          activity_id?: string
          id?: string
          notes?: string | null
          recorded_at?: string | null
          scout_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_scout_id_fkey"
            columns: ["scout_id"]
            isOneToOne: false
            referencedRelation: "scouts"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          dateadded: number
          id: string
          lastchecked: number | null
          notes: string | null
          url: string
          used: boolean
        }
        Insert: {
          dateadded: number
          id: string
          lastchecked?: number | null
          notes?: string | null
          url: string
          used?: boolean
        }
        Update: {
          dateadded?: number
          id?: string
          lastchecked?: number | null
          notes?: string | null
          url?: string
          used?: boolean
        }
        Relationships: []
      }
      financial_statements: {
        Row: {
          balance_sheet: Json | null
          classifications: Json | null
          created_at: string
          file_name: string
          id: string
          income_statement: Json | null
          reporting_month: string
          status: string
          updated_at: string
          upload_date: string
          uploaded_by: string
        }
        Insert: {
          balance_sheet?: Json | null
          classifications?: Json | null
          created_at?: string
          file_name: string
          id?: string
          income_statement?: Json | null
          reporting_month: string
          status: string
          updated_at?: string
          upload_date?: string
          uploaded_by: string
        }
        Update: {
          balance_sheet?: Json | null
          classifications?: Json | null
          created_at?: string
          file_name?: string
          id?: string
          income_statement?: Json | null
          reporting_month?: string
          status?: string
          updated_at?: string
          upload_date?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_statements_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      line_items: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string
          id: string
          is_recurring: boolean
          notes: string | null
          statement_id: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description: string
          id?: string
          is_recurring?: boolean
          notes?: string | null
          statement_id: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_recurring?: boolean
          notes?: string | null
          statement_id?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "line_items_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "financial_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      liquid_capital_results: {
        Row: {
          additions: Json
          calculated_by: string
          change_percentage: number | null
          created_at: string
          deductions: Json
          id: string
          liquid_capital: number
          net_assets: number
          net_liabilities: number
          previous_month_liquid_capital: number | null
          reporting_month: string
          updated_at: string
        }
        Insert: {
          additions?: Json
          calculated_by: string
          change_percentage?: number | null
          created_at?: string
          deductions?: Json
          id?: string
          liquid_capital: number
          net_assets: number
          net_liabilities: number
          previous_month_liquid_capital?: number | null
          reporting_month: string
          updated_at?: string
        }
        Update: {
          additions?: Json
          calculated_by?: string
          change_percentage?: number | null
          created_at?: string
          deductions?: Json
          id?: string
          liquid_capital?: number
          net_assets?: number
          net_liabilities?: number
          previous_month_liquid_capital?: number | null
          reporting_month?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "liquid_capital_results_calculated_by_fkey"
            columns: ["calculated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      rsvp: {
        Row: {
          activity_id: string
          created_at: string | null
          id: string
          notes: string | null
          scout_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          activity_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          scout_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          activity_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          scout_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsvp_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvp_scout_id_fkey"
            columns: ["scout_id"]
            isOneToOne: false
            referencedRelation: "scouts"
            referencedColumns: ["id"]
          },
        ]
      }
      runway_estimates: {
        Row: {
          average_burn_rate: number
          buffer_factor: number
          burn_rate_months: Json
          calculated_by: string
          created_at: string
          estimated_runway: number
          id: string
          liquid_capital: number
          reporting_month: string
          risk_level: string
          updated_at: string
        }
        Insert: {
          average_burn_rate: number
          buffer_factor?: number
          burn_rate_months?: Json
          calculated_by: string
          created_at?: string
          estimated_runway: number
          id?: string
          liquid_capital: number
          reporting_month: string
          risk_level: string
          updated_at?: string
        }
        Update: {
          average_burn_rate?: number
          buffer_factor?: number
          burn_rate_months?: Json
          calculated_by?: string
          created_at?: string
          estimated_runway?: number
          id?: string
          liquid_capital?: number
          reporting_month?: string
          risk_level?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "runway_estimates_calculated_by_fkey"
            columns: ["calculated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scouts: {
        Row: {
          age: number
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          group_name: string
          id: string
          join_date: string | null
          name: string
          parent_guardian_name: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          age: number
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          group_name: string
          id?: string
          join_date?: string | null
          name: string
          parent_guardian_name?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          age?: number
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          group_name?: string
          id?: string
          join_date?: string | null
          name?: string
          parent_guardian_name?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
