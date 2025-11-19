interface Data {
  message: string;
  title: string;
  people: string[];
}
//Patient data interface
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
//props interface
interface PatientDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export type { Data, Patient, PatientDetailPageProps };
