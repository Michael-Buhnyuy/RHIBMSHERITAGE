export interface AdmissionFormData {
  // Student
  s_fname: string;
  s_lname: string;
  s_mname?: string;
  s_sex: 'Male' | 'Female';
  s_dob?: string;
  s_phone: string;
  s_email: string;
  s_address: string;
  
  // Parent
  p_fname: string;
  p_lname: string;
  p_mname?: string;
  p_relationship: string;
  p_occupation?: string;
  p_phone: string;
  p_email: string;
  p_address: string;
  
  // Education
  selected_school: string;
  selected_level: string;
  selected_programs: string[];
  
  // Subjects
  subjects: Array<{ subject: string; grade: string }>;
  
  // Files
  cert_paths: string[];
  passport_path: string | null;
  
  // Additional
  cert_obtained_from: string;
  cert_name: string;
  is_patient: boolean;
  sickness_info?: string;
}

export type AdmissionStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface DatabaseAdmission {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  s_fname: string;
  s_lname: string;
  s_mname?: string | null;
  s_sex?: string | null;
  s_dob?: string | null;
  s_phone: string;
  s_email: string;
  s_address: string;
  p_fname: string;
  p_lname: string;
  p_mname?: string | null;
  p_relationship: string;
  p_occupation?: string | null;
  p_phone: string;
  p_email: string;
  p_address: string;
  selected_school: string;
  selected_level: string;
  selected_programs: string[];
  subjects: any[]; // jsonb
  cert_paths: string[];
  passport_path?: string | null;
  cert_obtained_from: string;
  cert_name: string;
  is_patient: boolean;
  sickness_info?: string | null;
  status: AdmissionStatus;
}

