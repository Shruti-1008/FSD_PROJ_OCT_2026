import React from 'react';
import { 
  FileText, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  Pill, 
  Clock, 
  Stethoscope,
  Info,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { Prescription, User } from '../types';

interface PatientDashboardProps {
  patient: User;
  prescriptions: Prescription[];
  onViewPrescription: (prescription: Prescription) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patient,
  prescriptions,
  onViewPrescription,
}) => {
  // Filter prescriptions belonging to this patient
  // If no match found by name, show all sample patient records or fallback to current patient's name
  const patientPrescriptions = prescriptions
    .filter((rx) => rx.patientName.toLowerCase() === patient.name.toLowerCase())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Use the patient's records, or fallback to the sample records if testing with custom name
  const displayPrescriptions = patientPrescriptions.length > 0 
    ? patientPrescriptions 
    : prescriptions;

  // Latest prescription represents the active treatment
  const latestPrescription = displayPrescriptions[0];

  // Oldest to newest for the consultation progress timeline
  const timelinePrescriptions = [...displayPrescriptions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Patient Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {patient.name}
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                  Patient
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Age: {latestPrescription?.patientAge || patient.age || 28} yrs &bull; Gender: {latestPrescription?.patientGender || patient.gender || 'Male'} &bull; ID: {latestPrescription?.patientId || 'PT-9021'}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 sm:text-right">
            <p className="text-[11px] font-medium text-blue-700 uppercase tracking-wider">
              Total Consultations
            </p>
            <p className="text-lg font-bold text-blue-900">
              {displayPrescriptions.length} Completed
            </p>
          </div>
        </div>
      </div>

      {/* Health Progress Section ("see their progress after each consultation") */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Health Recovery & Consultation Progress
            </h3>
            <p className="text-xs text-slate-500">
              Review your health improvement recorded by your doctor after each medical visit
            </p>
          </div>

          {latestPrescription && (
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 px-3 py-1.5 rounded-lg border border-teal-100 text-xs font-semibold">
              <span>Current Status:</span>
              <span className="bg-teal-600 text-white px-2 py-0.5 rounded text-[11px]">
                {latestPrescription.progressStatus} ({latestPrescription.progressPercentage}%)
              </span>
            </div>
          )}
        </div>

        {/* Progress Timeline across consultations */}
        <div className="space-y-6 mt-4">
          {timelinePrescriptions.map((rx, index) => (
            <div key={rx.id} className="relative pl-6 sm:pl-8 border-l-2 border-teal-200 last:border-l-0 pb-6 last:pb-0">
              
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-xs flex items-center justify-center text-white" />

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider mr-2">
                      Consultation #{rx.consultationNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      Date: {rx.date}
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`self-start sm:self-auto text-xs font-semibold px-2.5 py-0.5 rounded ${
                    rx.progressPercentage >= 80 
                      ? 'bg-emerald-100 text-emerald-800'
                      : rx.progressPercentage >= 50
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rx.progressStatus} &bull; {rx.progressPercentage}% Recovery
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2.5">
                  <div 
                    className="bg-teal-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${rx.progressPercentage}%` }}
                  />
                </div>

                {/* Diagnosis & Notes */}
                <div className="text-xs space-y-1 mt-2">
                  <p className="text-slate-800 font-medium">
                    <span className="text-slate-500">Diagnosis:</span> {rx.diagnosis}
                  </p>
                  <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200/60 mt-1">
                    <span className="font-semibold text-slate-900 block mb-0.5">Doctor's Consultation Observation:</span>
                    {rx.progressNotes}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/50">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    {rx.doctorName}
                  </span>

                  <button
                    onClick={() => onViewPrescription(rx)}
                    className="text-xs font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline"
                    id={`view-rx-timeline-${rx.id}`}
                  >
                    View this consultation slip
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Active Medications (From Latest Consultation) */}
      {latestPrescription && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                Current Active Medicines
              </h3>
              <p className="text-xs text-slate-500">
                Prescribed by {latestPrescription.doctorName} on {latestPrescription.date}
              </p>
            </div>
            <button
              onClick={() => onViewPrescription(latestPrescription)}
              className="text-xs font-medium bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 py-1.5 rounded-md transition-colors inline-flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              View Full Prescription
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestPrescription.medicines.map((med, idx) => (
              <div key={med.id || idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {med.medicineName}
                  </h4>
                  <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-0.5 rounded">
                    {med.dosage}
                  </span>
                </div>
                
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong className="text-slate-700">Frequency:</strong> {med.frequency}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong className="text-slate-700">Duration:</strong> {med.duration}</span>
                  </div>
                  {med.instructions && (
                    <div className="flex items-start gap-1.5 pt-1 text-slate-700 bg-white p-2 rounded border border-slate-100">
                      <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{med.instructions}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* General instructions note */}
          {latestPrescription.instructions && (
            <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Doctor's Advice & Lifestyle Instructions:</strong>
                {latestPrescription.instructions}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prescription History Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Prescription History
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          All formal medical prescriptions issued during your consultations
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Prescription ID</th>
                <th className="py-2.5 px-3">Consultation</th>
                <th className="py-2.5 px-3">Diagnosis</th>
                <th className="py-2.5 px-3">Doctor</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {displayPrescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 whitespace-nowrap text-slate-900 font-medium">
                    {rx.date}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {rx.id}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    Visit #{rx.consultationNumber}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900">
                    {rx.diagnosis}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                    {rx.doctorName}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onViewPrescription(rx)}
                      className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1"
                      id={`patient-view-rx-${rx.id}`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
