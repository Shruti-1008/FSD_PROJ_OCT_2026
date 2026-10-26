/**
 * Types and Interfaces for Prescription Healthcare Management
 * Simple and easy to understand for college project evaluation.
 */

// User role can either be a Doctor or a Patient
export type UserRole = 'doctor' | 'patient';

// User profile representation
export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  specialty?: string; // For Doctor (e.g., "General Medicine, MBBS")
  regNumber?: string; // Doctor registration number
  age?: number;       // For Patient
  gender?: string;    // For Patient
}

// Single medicine item prescribed
export interface MedicineItem {
  id: string;
  medicineName: string;
  dosage: string;       // e.g., "500mg", "10ml", "1 tablet"
  frequency: string;    // e.g., "Twice daily (Morning & Night)", "Once daily"
  duration: string;     // e.g., "5 Days", "10 Days", "2 Weeks"
  instructions: string; // e.g., "Take after meals with warm water"
}

// Full prescription record
export interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorRegNo: string;
  clinicName: string;
  clinicAddress: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientId: string;
  diagnosis: string;
  consultationNumber: number; // e.g., 1st consultation, 2nd consultation
  medicines: MedicineItem[];
  instructions: string;       // General diet/lifestyle advice
  
  // Progress tracking after consultation
  progressStatus: 'Initial Consultation' | 'Improving' | 'Stable' | 'Nearly Recovered' | 'Fully Recovered';
  progressPercentage: number; // 0 to 100%
  progressNotes: string;      // Doctor's observation of patient recovery
  nextFollowUp?: string;      // Suggested follow-up date
}
