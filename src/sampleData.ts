import { Prescription, User } from './types';

// Pre-configured demo users for quick college demonstration
export const DEMO_USERS: User[] = [
  {
    id: 'doc_1',
    name: 'Dr. Ramesh Sharma',
    role: 'doctor',
    email: 'dr.sharma@citycare.org',
    specialty: 'Senior Consultant Physician (MBBS, MD)',
    regNumber: 'MCI-54892'
  },
  {
    id: 'pat_1',
    name: 'Rahul Verma',
    role: 'patient',
    email: 'rahul.verma@example.com',
    age: 28,
    gender: 'Male'
  },
  {
    id: 'pat_2',
    name: 'Pooja Patel',
    role: 'patient',
    email: 'pooja.patel@example.com',
    age: 34,
    gender: 'Female'
  }
];

// Initial realistic prescriptions showing consultation progress
export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX-2026-101',
    date: '2026-09-15',
    doctorName: 'Dr. Ramesh Sharma',
    doctorSpecialty: 'Senior Consultant Physician (MBBS, MD)',
    doctorRegNo: 'MCI-54892',
    clinicName: 'City Care Health Clinic & Wellness Centre',
    clinicAddress: '124 Hospital Road, Metro Health Complex, City',
    patientName: 'Rahul Verma',
    patientAge: 28,
    patientGender: 'Male',
    patientId: 'PT-9021',
    diagnosis: 'Acute Viral Upper Respiratory Infection with Mild Bronchitis',
    consultationNumber: 1,
    medicines: [
      {
        id: 'med_1',
        medicineName: 'Amoxicillin & Clavulanate (Augmentin)',
        dosage: '625 mg',
        frequency: 'Twice daily (After Breakfast & Dinner)',
        duration: '5 Days',
        instructions: 'Complete full antibiotic course without skipping'
      },
      {
        id: 'med_2',
        medicineName: 'Paracetamol',
        dosage: '650 mg',
        frequency: 'SOS / 3 times a day (if fever > 100°F)',
        duration: '3 Days',
        instructions: 'Take with plenty of warm water'
      },
      {
        id: 'med_3',
        medicineName: 'Levocetirizine + Montelukast',
        dosage: '10 mg',
        frequency: 'Once daily (At bedtime)',
        duration: '7 Days',
        instructions: 'May cause mild drowsiness; avoid driving at night'
      }
    ],
    instructions: 'Steam inhalation twice daily. Strictly drink warm water and avoid cold beverages and oily foods.',
    progressStatus: 'Initial Consultation',
    progressPercentage: 25,
    progressNotes: 'Patient presented with high fever (101.4°F), dry throat, and persistent chest cough for 3 days. Commenced broad-spectrum antibiotic and antipyretic protocol.',
    nextFollowUp: '2026-09-20'
  },
  {
    id: 'RX-2026-105',
    date: '2026-09-20',
    doctorName: 'Dr. Ramesh Sharma',
    doctorSpecialty: 'Senior Consultant Physician (MBBS, MD)',
    doctorRegNo: 'MCI-54892',
    clinicName: 'City Care Health Clinic & Wellness Centre',
    clinicAddress: '124 Hospital Road, Metro Health Complex, City',
    patientName: 'Rahul Verma',
    patientAge: 28,
    patientGender: 'Male',
    patientId: 'PT-9021',
    diagnosis: 'Follow-up on Viral Infection (Significant Improvement)',
    consultationNumber: 2,
    medicines: [
      {
        id: 'med_4',
        medicineName: 'Vitamin C + Zinc Chewable Tablets',
        dosage: '500 mg',
        frequency: 'Once daily (Mid-morning)',
        duration: '10 Days',
        instructions: 'Chew thoroughly after meal for immunity support'
      },
      {
        id: 'med_5',
        medicineName: 'Honey & Ivy Herbal Cough Syrup',
        dosage: '10 ml',
        frequency: 'Twice daily',
        duration: '4 Days',
        instructions: 'Do not drink water for 15 minutes after taking syrup'
      }
    ],
    instructions: 'Resume regular light physical activity. Continue drinking warm water. Antibiotic phase successfully concluded.',
    progressStatus: 'Nearly Recovered',
    progressPercentage: 85,
    progressNotes: 'Fever has completely subsided for 72 hours. Cough frequency dropped by 80%. Lungs clear on auscultation. Vitals normal (BP: 120/80 mmHg, SpO2: 99%).',
    nextFollowUp: 'Only as needed'
  },
  {
    id: 'RX-2026-098',
    date: '2026-09-18',
    doctorName: 'Dr. Ramesh Sharma',
    doctorSpecialty: 'Senior Consultant Physician (MBBS, MD)',
    doctorRegNo: 'MCI-54892',
    clinicName: 'City Care Health Clinic & Wellness Centre',
    clinicAddress: '124 Hospital Road, Metro Health Complex, City',
    patientName: 'Pooja Patel',
    patientAge: 34,
    patientGender: 'Female',
    patientId: 'PT-8842',
    diagnosis: 'Acute Acid Reflux & Dyspepsia (GERD)',
    consultationNumber: 1,
    medicines: [
      {
        id: 'med_6',
        medicineName: 'Pantoprazole + Domperidone (Pan-D)',
        dosage: '40 mg / 30 mg',
        frequency: 'Once daily (Morning - 30 mins before breakfast)',
        duration: '14 Days',
        instructions: 'Must be swallowed whole with water on an empty stomach'
      },
      {
        id: 'med_7',
        medicineName: 'Magaldrate + Simethicone Antacid Gel',
        dosage: '15 ml',
        frequency: 'After meals and before bedtime',
        duration: '7 Days',
        instructions: 'Shake well before use'
      }
    ],
    instructions: 'Eat small frequent meals. Avoid spicy food, caffeinated drinks, and citrus fruits. Maintain 2 hours gap between dinner and sleep.',
    progressStatus: 'Improving',
    progressPercentage: 55,
    progressNotes: 'Initial severe epigastric burning pain reported. Responding well to proton pump inhibitor therapy.',
    nextFollowUp: '2026-10-02'
  }
];

// Helper to load prescriptions from localStorage or fallback to initial data
export function loadSavedPrescriptions(): Prescription[] {
  try {
    const saved = localStorage.getItem('college_health_prescriptions');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
  }
  return INITIAL_PRESCRIPTIONS;
}

// Helper to save prescriptions into localStorage
export function savePrescriptionsToStorage(prescriptions: Prescription[]): void {
  try {
    localStorage.setItem('college_health_prescriptions', JSON.stringify(prescriptions));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}
