import React, { useState } from 'react';
import { Activity, Stethoscope, User as UserIcon, Lock, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../sampleData';
import medicalClinicBg from '../assets/images/medical_clinic_bg_1790599952327.jpg';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [name, setName] = useState('Dr. Ramesh Sharma');
  const [password, setPassword] = useState('123456');

  // Handle custom login form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }

    const newUser: User = {
      id: selectedRole === 'doctor' ? 'doc_custom' : 'pat_custom',
      name: name.trim(),
      role: selectedRole,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@healthcare.org`,
      specialty: selectedRole === 'doctor' ? 'General Physician (MBBS, MD)' : undefined,
      regNumber: selectedRole === 'doctor' ? 'MCI-10293' : undefined,
      age: selectedRole === 'patient' ? 28 : undefined,
      gender: selectedRole === 'patient' ? 'Male' : undefined,
    };

    onLogin(newUser);
  };

  const handleQuickLogin = (demoUser: User) => {
    onLogin(demoUser);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-white overflow-hidden py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      
      {/* Aesthetic Background Image with Cinematic Depth & Soft Lighting */}
      <div className="absolute inset-0 z-0">
        <img
          src={medicalClinicBg}
          alt="Aesthetic Medical Clinic Interior"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter blur-[1.5px] brightness-[0.65] contrast-[1.05]"
        />
        {/* Soft elegant gradient overlays for depth, mood and high card contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/75 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-teal-950/50" />
      </div>

      {/* Aesthetic glowing ambient lights */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-md w-full mx-auto">
        {/* Centered Sign-In Card with refined border and soft shadow */}
        <div className="bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl shadow-2xl shadow-slate-950/50 border border-white/60 p-6 sm:p-8">
          
          {/* Header icon & title */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm mb-3">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">Select your access role to continue</p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('doctor');
                  setName('Dr. Ramesh Sharma');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  selectedRole === 'doctor'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                Doctor
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('patient');
                  setName('Rahul Verma');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  selectedRole === 'patient'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                Patient
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {selectedRole === 'doctor' ? 'Doctor Name' : 'Patient Name'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={selectedRole === 'doctor' ? 'e.g. Dr. Ramesh Sharma' : 'e.g. Rahul Verma'}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (default: 123456)"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Demo credentials pre-filled for quick access
              </p>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm ${
                selectedRole === 'doctor'
                  ? 'bg-teal-600 hover:bg-teal-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <span>Enter {selectedRole === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
              Quick Sign-In Profiles
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(DEMO_USERS[0])}
                className="flex items-center gap-2.5 p-2.5 border border-teal-200 bg-teal-50/60 hover:bg-teal-50 rounded-xl text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  DR
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Dr. Ramesh Sharma</div>
                  <div className="text-[10px] text-slate-500 truncate">Consultant Doctor</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(DEMO_USERS[1])}
                className="flex items-center gap-2.5 p-2.5 border border-blue-200 bg-blue-50/60 hover:bg-blue-50 rounded-xl text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  PT
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Rahul Verma</div>
                  <div className="text-[10px] text-slate-500 truncate">Active Patient</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Encrypted & HIPAA-compliant Digital Health Records</span>
          </div>

        </div>
      </div>
    </div>
  );
};
