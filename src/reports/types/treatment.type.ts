export interface RawTreatmentResult {
  id: string;
  description: string;
  duration: string;
  instructions: string;
  frequencyValue: number | null;
  frequencyUnit: 'daily' | 'weekly' | 'monthly' | null;
  organizationId: string;
  consultation_id: string | null;
  consultationDate: Date | null;
  motivo: string | null;
  patient_name: string | null;
}

// Define the expected output type
export interface FormattedTreatment {
  id: string;
  description: string;
  duration: string;
  instructions: string;
  frequencyValue: number | null;
  frequencyUnit: 'daily' | 'weekly' | 'monthly' | null;
  organizationId: string;
  consultations: {
    consultation: {
      id: string;
      consultationDate: Date;
      motivo: string;
      patient: { name: string };
    };
  }[];
}