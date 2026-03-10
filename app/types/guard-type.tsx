
export interface GuardType {
  id: number;
  name: string | null;
  description: string | null;
  
  is_active: boolean;
  created_at?: string;
}

export interface GuardTypeParams {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
  
  sort_by?: 'id' | 'title' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface GuardTypeState {
  guardTypes: GuardType[];
  currentGuardType: GuardType | null;
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  isLoading: boolean;
  error: string | null;
}

export interface ToggleGuardTypeStatusRequest {
  is_active: boolean;
}