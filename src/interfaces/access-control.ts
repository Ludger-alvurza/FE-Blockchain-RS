// Scope interfaces
export interface ScopeData {
  read: boolean;
  write: boolean;
  delete: boolean;
  fields: string[];
}

// Access Control interfaces
export interface AccessControl {
  ac_id: string;
  patient_id: string;
  granted_to: string;
  granted_by: string;
  scope: ScopeData;
  valid_from: string;
  valid_to: string;
  on_chain_tx: string;
  created_at: string;
}

export interface Props {
  accessControls: AccessControl[];
}

// Form data interface (sama dengan AccessControl)
export interface AccessControlFormData extends AccessControl {}

// Props interfaces
export interface EditAccessControlFormProps {
  initialData: AccessControl;
  acId: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
