import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  FileText, 
  User, 
  Calendar, 
  Stethoscope, 
  TrendingUp, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Prescription, User as UserType } from '../types';

interface DoctorDashboardProps {
  doctor: UserType;
  prescriptions: Prescription[];
  onNavigateCreate: () => void;
  onViewPrescription: (prescription: Prescription) => void;
  onDeletePrescription: (id: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctor,
  prescriptions,
  onNavigateCreate,
  onViewPrescription,
  onDeletePrescription,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter prescriptions by patient name or diagnosis
  const filteredPrescriptions = prescriptions.filter((rx) => {
    const term = searchTerm.toLowerCase();
    return (
      rx.patientName.toLowerCase().includes(term) ||
      rx.diagnosis.toLowerCase().includes(term) ||
      rx.id.toLowerCase().includes(term)
    );
  });

  // Calculate quick metrics for the doctor
  const totalCount = prescriptions.length;
  const uniquePatients = new Set(prescriptions.map((rx) => rx.patientName.toLowerCase())).size;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Banner / Welcome Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {doctor.name}
                </h2>
                <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-0.5 rounded">
                  Doctor Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {doctor.specialty || 'General Practitioner'} &bull; Reg: {doctor.regNumber || 'MCI-54892'}
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors shrink-0"
            id="doctor-create-prescription-btn"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Prescription
          </button>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Total Prescriptions</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Total Patients Treated</p>
            <p className="text-2xl font-bold text-teal-700 mt-1">{uniquePatients}</p>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Clinic Facility</p>
            <p className="text-sm font-semibold text-slate-800 mt-1 truncate">
              City Care Health Clinic
            </p>
          </div>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Issued Prescriptions Records
          </h3>
          <p className="text-xs text-slate-500">
            Manage, review, and print prescriptions generated for all consultations
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient or diagnosis..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            id="doctor-search-input"
          />
        </div>
      </div>

      {/* Prescriptions Table / List */}
      {filteredPrescriptions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700">No prescriptions found</p>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm ? 'Try changing your search keywords' : 'Click "+ Create New Prescription" to write your first prescription.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Rx ID & Date</th>
                  <th className="py-3 px-4">Patient Details</th>
                  <th className="py-3 px-4">Diagnosis</th>
                  <th className="py-3 px-4">Consultation & Progress</th>
                  <th className="py-3 px-4">Medicines</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPrescriptions.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Prescription ID & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{rx.id}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {rx.date}
                      </div>
                    </td>

                    {/* Patient Name & Details */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-teal-600" />
                        {rx.patientName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {rx.patientAge} yrs &bull; {rx.patientGender}
                      </div>
                    </td>

                    {/* Diagnosis */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-slate-800 font-medium line-clamp-2">
                        {rx.diagnosis}
                      </div>
                    </td>

                    {/* Consultation & Progress */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-xs font-medium text-slate-600">
                        Visit #{rx.consultationNumber}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          rx.progressPercentage >= 80 
                            ? 'bg-emerald-100 text-emerald-800'
                            : rx.progressPercentage >= 50
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {rx.progressStatus} ({rx.progressPercentage}%)
                        </span>
                      </div>
                    </td>

                    {/* Medicines Count */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                        {rx.medicines.length} {rx.medicines.length === 1 ? 'medicine' : 'medicines'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewPrescription(rx)}
                          className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                          id={`view-rx-btn-${rx.id}`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Slip
                        </button>
                        
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove prescription ${rx.id}?`)) {
                              onDeletePrescription(rx.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete prescription"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
