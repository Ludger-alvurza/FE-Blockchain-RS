interface Data {
  message: string;
  title: string;
  people: string[];
}

// Patient data interface
interface Patient {
  patient_id: string;
  wallet_did: string;
  full_name: string;
  birth_date: string | null;
  gender: string;
  blood_type: string | null;
  contact_phone: string | null;
  address: string | null;
  emergency_contact: string | null;
  insurance: string | null;
  allergies: string | null;
  chronic_conditions: string | null;
  created_at: string;
  updated_at: string;
}

// Props interface
interface PatientDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Page props interfaces
interface PageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

// Re-export semua dari access-control
export * from "./access-control";

export type { Data, Patient, PatientDetailPageProps, PageProps };
