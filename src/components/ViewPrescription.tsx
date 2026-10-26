import React from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Activity, 
  Stethoscope, 
  Calendar, 
  User, 
  Pill,
  TrendingUp,
  CheckCircle2,
  Phone,
  MapPin
} from 'lucide-react';
import { Prescription } from '../types';

interface ViewPrescriptionProps {
  prescription: Prescription;
  onBack: () => void;
}

export const ViewPrescription: React.FC<ViewPrescriptionProps> = ({
  prescription,
  onBack,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex items-center justify-between gap-4 mb-6 no-print">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-lg shadow-xs hover:bg-slate-50 transition-colors"
          id="view-rx-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
          id="print-prescription-btn"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
      </div>

      {/* Formal Physical Medical Prescription Sheet Container */}
      <div 
        className="bg-white border border-slate-300 rounded-xl shadow-sm p-6 sm:p-10 relative print-shadow-none print:border-none print:p-2"
        id="printable-prescription-slip"
      >
        
        {/* Clinic & Doctor Header */}
        <div className="border-b-2 border-teal-700 pb-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            
            {/* Clinic Details */}
            <div>
              <div className="flex items-center gap-2 text-teal-800">
                <Activity className="w-7 h-7 text-teal-700" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {prescription.clinicName}
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {prescription.clinicAddress}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Helpline: +91 (011) 2490-8800 &bull; Emergency: 108
              </p>
            </div>

            {/* Doctor Credentials */}
            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {prescription.doctorName}
              </h2>
              <p className="text-xs font-medium text-teal-700">
                {prescription.doctorSpecialty}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Reg. No: <span className="font-mono font-semibold">{prescription.doctorRegNo}</span>
              </p>
            </div>

          </div>
        </div>

        {/* Prescription Metadata Bar: Rx ID, Date & Consultation Number */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Prescription ID: </span>
            <span className="font-mono font-bold text-slate-900">{prescription.id}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Consultation Date: </span>
            <span className="font-semibold text-slate-900">{prescription.date}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Visit: </span>
            <span className="font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
              Consultation #{prescription.consultationNumber}
            </span>
          </div>
        </div>

        {/* Patient Profile Information Box */}
        <div className="border border-slate-200 rounded-lg p-4 mb-6 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-teal-600" />
            Patient Information
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-slate-500">Patient Name</p>
              <p className="font-bold text-slate-900 text-sm">{prescription.patientName}</p>
            </div>
            <div>
              <p className="text-slate-500">Patient ID</p>
              <p className="font-mono font-medium text-slate-800">{prescription.patientId}</p>
            </div>
            <div>
              <p className="text-slate-500">Age / Gender</p>
              <p className="font-medium text-slate-800">
                {prescription.patientAge} Years / {prescription.patientGender}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Next Follow-up</p>
              <p className="font-medium text-slate-800">
                {prescription.nextFollowUp || 'As needed'}
              </p>
            </div>
          </div>
        </div>

        {/* Medical Diagnosis */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Clinical Diagnosis
          </h3>
          <div className="p-3 bg-teal-50/60 border-l-4 border-teal-600 rounded-r-lg text-sm font-semibold text-slate-900">
            {prescription.diagnosis}
          </div>
        </div>

        {/* Traditional Rx Prescription Symbol & Medicines Table */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl font-serif font-black text-teal-800 tracking-tight">
              &#8478;
            </span>
            <span className="text-xs text-slate-500 font-medium">
              (Take the following prescribed medications as directed)
            </span>
          </div>

          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">Medicine Name</th>
                  <th className="py-2.5 px-3">Dosage</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {prescription.medicines.map((med, index) => (
                  <tr key={med.id || index} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 text-center text-slate-400 font-mono">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {med.medicineName}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
                      {med.dosage || '-'}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {med.frequency || '-'}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
                      {med.duration || '-'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-xs">
                      {med.instructions || 'As advised'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* General Advice / Diet Instructions */}
        {prescription.instructions && (
          <div className="mb-6 p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs">
            <h4 className="font-bold text-amber-900 uppercase tracking-wider mb-1">
              Dietary & Lifestyle Advice:
            </h4>
            <p className="text-amber-800 leading-relaxed">
              {prescription.instructions}
            </p>
          </div>
        )}

        {/* Consultation Progress Summary */}
        <div className="mb-12 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              Doctor's Progress Evaluation for this Consultation
            </h4>
            <span className="font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
              {prescription.progressStatus} ({prescription.progressPercentage}% recovery)
            </span>
          </div>
          <p className="text-slate-700 italic">
            "{prescription.progressNotes}"
          </p>
        </div>

        {/* Footer & Doctor Signature Section */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-end justify-between gap-6">
          <div className="text-[11px] text-slate-400 space-y-0.5 max-w-sm">
            <p>Computer generated medical prescription document.</p>
            <p>Not valid for medico-legal purposes. Store safely for follow-ups.</p>
          </div>

          <div className="text-right">
            {/* Signature Placeholder line */}
            <div className="w-48 border-b-2 border-slate-400 mb-1 inline-block" />
            <p className="text-xs font-bold text-slate-900">
              {prescription.doctorName}
            </p>
            <p className="text-[11px] text-slate-500">
              Authorized Medical Practitioner
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Reg: {prescription.doctorRegNo}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
