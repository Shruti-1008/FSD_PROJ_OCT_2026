import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Stethoscope, 
  Pill, 
  User, 
  Calendar,
  AlertCircle,
  Activity
} from 'lucide-react';
import { Prescription, MedicineItem, User as UserType } from '../types';

interface CreatePrescriptionProps {
  doctor: UserType;
  onSave: (prescription: Prescription) => void;
  onCancel: () => void;
}

export const CreatePrescription: React.FC<CreatePrescriptionProps> = ({
  doctor,
  onSave,
  onCancel,
}) => {
  // Current Date default
  const today = new Date().toISOString().split('T')[0];

  // Form State for Patient & Consultation Details
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>(28);
  const [patientGender, setPatientGender] = useState('Male');
  const [diagnosis, setDiagnosis] = useState('');
  const [consultationNumber, setConsultationNumber] = useState<number>(1);
  const [date, setDate] = useState(today);
  const [generalInstructions, setGeneralInstructions] = useState('');

  // Consultation Health Progress tracking state
  const [progressStatus, setProgressStatus] = useState<
    'Initial Consultation' | 'Improving' | 'Stable' | 'Nearly Recovered' | 'Fully Recovered'
  >('Initial Consultation');
  const [progressPercentage, setProgressPercentage] = useState<number>(30);
  const [progressNotes, setProgressNotes] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');

  // Medicines List State (starts with 1 empty row, doctor can add more)
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    {
      id: 'med_' + Date.now(),
      medicineName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    },
  ]);

  // Handler to update a field in a specific medicine row
  const handleMedicineChange = (
    index: number,
    field: keyof Omit<MedicineItem, 'id'>,
    value: string
  ) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  // Handler to add a new medicine row
  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      {
        id: 'med_' + Date.now() + Math.random(),
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ]);
  };

  // Handler to delete a medicine row
  const removeMedicineRow = (index: number) => {
    if (medicines.length <= 1) {
      alert('Prescription must contain at least one medicine entry.');
      return;
    }
    const updated = medicines.filter((_, idx) => idx !== index);
    setMedicines(updated);
  };

  // Quick preset loader to help during college viva demonstration
  const handleLoadSamplePatient = (type: 'fever' | 'gastritis') => {
    if (type === 'fever') {
      setPatientName('Rahul Verma');
      setPatientAge(28);
      setPatientGender('Male');
      setDiagnosis('Acute Viral Fever & Sore Throat');
      setConsultationNumber(1);
      setGeneralInstructions('Drink warm fluids, steam inhalation 2x daily, adequate rest.');
      setProgressStatus('Initial Consultation');
      setProgressPercentage(30);
      setProgressNotes('Patient reported persistent fever 101°F and body aches. Starting antipyretic & antibiotic therapy.');
      setNextFollowUp('2026-09-27');
      setMedicines([
        {
          id: 'm1',
          medicineName: 'Amoxicillin + Clavulanic Acid (Augmentin)',
          dosage: '625 mg',
          frequency: 'Twice daily after food',
          duration: '5 Days',
          instructions: 'Complete the entire course without stopping',
        },
        {
          id: 'm2',
          medicineName: 'Paracetamol',
          dosage: '650 mg',
          frequency: '3 times daily (SOS for fever)',
          duration: '3 Days',
          instructions: 'Take after food with plenty of water',
        },
      ]);
    } else {
      setPatientName('Pooja Patel');
      setPatientAge(34);
      setPatientGender('Female');
      setDiagnosis('Gastroesophageal Reflux Disease (GERD) & Acidity');
      setConsultationNumber(2);
      setGeneralInstructions('Avoid oily, fried foods. Keep 2 hour gap between meal and sleep.');
      setProgressStatus('Improving');
      setProgressPercentage(75);
      setProgressNotes('Epigastric burn significantly reduced. Appetite has returned to normal.');
      setNextFollowUp('2026-10-05');
      setMedicines([
        {
          id: 'm3',
          medicineName: 'Pantoprazole + Domperidone (Pan-D)',
          dosage: '40 mg / 30 mg',
          frequency: 'Once daily (Morning 30 mins before breakfast)',
          duration: '10 Days',
          instructions: 'Swallow whole on empty stomach',
        },
      ]);
    }
  };

  // Form submission validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      alert('Please enter Patient Name.');
      return;
    }
    if (!diagnosis.trim()) {
      alert('Please enter Diagnosis.');
      return;
    }

    // Check that at least one medicine has a name
    const validMedicines = medicines.filter((m) => m.medicineName.trim() !== '');
    if (validMedicines.length === 0) {
      alert('Please provide at least one medicine name with dosage and instructions.');
      return;
    }

    // Generate clean Prescription ID (e.g. RX-2026-784)
    const randomNum = Math.floor(100 + Math.random() * 900);
    const generatedId = `RX-2026-${randomNum}`;

    const newPrescription: Prescription = {
      id: generatedId,
      date,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty || 'General Practitioner',
      doctorRegNo: doctor.regNumber || 'MCI-54892',
      clinicName: 'City Care Health Clinic & Wellness Centre',
      clinicAddress: '124 Hospital Road, Metro Health Complex, City',
      patientName: patientName.trim(),
      patientAge: Number(patientAge) || 30,
      patientGender,
      patientId: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      diagnosis: diagnosis.trim(),
      consultationNumber: Number(consultationNumber) || 1,
      medicines: validMedicines,
      instructions: generalInstructions.trim() || 'Take all medications strictly as directed.',
      progressStatus,
      progressPercentage: Number(progressPercentage),
      progressNotes: progressNotes.trim() || 'Prescription issued upon physical examination.',
      nextFollowUp: nextFollowUp.trim() || undefined,
    };

    onSave(newPrescription);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs hover:bg-slate-50 transition-colors"
          id="back-to-dashboard-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Demo Fast Fill Buttons for College viva presentation */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Fill Example:</span>
          <button
            type="button"
            onClick={() => handleLoadSamplePatient('fever')}
            className="text-xs bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded"
          >
            Viral Fever Demo
          </button>
          <button
            type="button"
            onClick={() => handleLoadSamplePatient('gastritis')}
            className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded"
          >
            GERD / Acidity Demo
          </button>
        </div>
      </div>

      {/* Main Prescription Creation Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        
        {/* Clinic & Doctor Banner */}
        <div className="bg-teal-700 text-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold">
                Create Medical Prescription
              </h2>
              <p className="text-xs text-teal-100 mt-0.5">
                City Care Health Clinic &bull; Prescribing Physician: {doctor.name} ({doctor.regNumber || 'MCI-54892'})
              </p>
            </div>
            <div className="text-xs bg-teal-800/80 px-3 py-1.5 rounded border border-teal-600/60 self-start sm:self-auto font-mono">
              Date: {date}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {/* Section 1: Patient & Consultation Details */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-teal-600" />
              1. Patient & Consultation Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Patient Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  id="input-patient-name"
                />
              </div>

              {/* Consultation Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Consultation Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  id="input-date"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 28"
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  id="input-patient-age"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  id="input-patient-gender"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Consultation Visit Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Consultation Visit #
                </label>
                <select
                  value={consultationNumber}
                  onChange={(e) => setConsultationNumber(Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  id="input-consultation-num"
                >
                  <option value={1}>1st Consultation (Initial Visit)</option>
                  <option value={2}>2nd Consultation (Follow-up)</option>
                  <option value={3}>3rd Consultation</option>
                  <option value={4}>4th Consultation</option>
                  <option value={5}>5th Consultation</option>
                </select>
              </div>

              {/* Diagnosis */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Medical Diagnosis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Viral Infection with Bronchitis / Hypertension / Diabetes Type 2"
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  id="input-diagnosis"
                />
              </div>

            </div>
          </div>

          {/* Section 2: Medicines (Rx) */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-600" />
                2. Prescribed Medications (Rx)
              </h3>
              <button
                type="button"
                onClick={addMedicineRow}
                className="text-xs font-medium bg-teal-50 text-teal-700 hover:bg-teal-100 px-2.5 py-1 rounded inline-flex items-center gap-1 transition-colors"
                id="add-medicine-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                + Add Another Medicine
              </button>
            </div>

            <div className="space-y-4">
              {medicines.map((med, index) => (
                <div 
                  key={med.id || index}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Medicine #{index + 1}
                    </span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicineRow(index)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded"
                        title="Remove medicine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Medicine Name */}
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Medicine Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={med.medicineName}
                        onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                        placeholder="e.g. Paracetamol 650"
                        className="w-full text-xs sm:text-sm px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>

                    {/* Dosage */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        placeholder="e.g. 500 mg / 1 tab"
                        className="w-full text-xs sm:text-sm px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>

                    {/* Frequency */}
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Frequency
                      </label>
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        placeholder="e.g. Twice daily (1-0-1)"
                        className="w-full text-xs sm:text-sm px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>

                    {/* Duration */}
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        placeholder="e.g. 5 Days / 1 Week"
                        className="w-full text-xs sm:text-sm px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>

                    {/* Medicine Specific Instructions */}
                    <div className="sm:col-span-12">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Special Instructions for this Medicine
                      </label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                        placeholder="e.g. Take immediately after meals with warm water"
                        className="w-full text-xs sm:text-sm px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* General Instructions & Advice */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                General Diet & Lifestyle Instructions
              </label>
              <textarea
                rows={2}
                value={generalInstructions}
                onChange={(e) => setGeneralInstructions(e.target.value)}
                placeholder="e.g. Drink warm fluids, avoid oily food, complete the antibiotic course..."
                className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                id="input-general-instructions"
              />
            </div>
          </div>

          {/* Section 3: Consultation Progress Record */}
          <div className="bg-teal-50/50 p-5 rounded-xl border border-teal-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-teal-200/60 flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-teal-600" />
              3. Patient Progress Evaluation for this Consultation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Recovery Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Health Recovery Status
                </label>
                <select
                  value={progressStatus}
                  onChange={(e) => setProgressStatus(e.target.value as any)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  id="input-progress-status"
                >
                  <option value="Initial Consultation">Initial Consultation (Starting Treatment)</option>
                  <option value="Improving">Improving (Symptoms reducing)</option>
                  <option value="Stable">Stable (Condition under control)</option>
                  <option value="Nearly Recovered">Nearly Recovered (Minor symptoms)</option>
                  <option value="Fully Recovered">Fully Recovered (Normal vitals)</option>
                </select>
              </div>

              {/* Progress Percentage */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Estimated Recovery Level: <span className="text-teal-700 font-bold">{progressPercentage}%</span>
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressPercentage}
                  onChange={(e) => setProgressPercentage(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  id="input-progress-slider"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0% (Onset)</span>
                  <span>50% (Halfway)</span>
                  <span>100% (Full Recovery)</span>
                </div>
              </div>

              {/* Doctor Clinical Notes on Progress */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Doctor's Consultation Observation & Progress Note
                </label>
                <textarea
                  rows={2}
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder="e.g. Fever has subsided; throat redness reduced by 70%. Patient is responding well."
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  id="input-progress-notes"
                />
              </div>

              {/* Next Follow-up Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Next Follow-up Date (Optional)
                </label>
                <input
                  type="date"
                  value={nextFollowUp}
                  onChange={(e) => setNextFollowUp(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  id="input-followup-date"
                />
              </div>

            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2 text-xs sm:text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
              id="submit-prescription-btn"
            >
              <Save className="w-4 h-4" />
              Save Prescription
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
