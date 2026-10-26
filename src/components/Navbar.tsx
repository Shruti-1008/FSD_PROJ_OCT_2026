import React from 'react';
import { Activity, LogOut, User as UserIcon, Stethoscope, Sparkles } from 'lucide-react';
import { User, UserRole } from '../types';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: any) => void;
  onLogout: () => void;
  onSwitchRole?: (role: UserRole) => void;
  onOpenAIChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onLogout,
  onSwitchRole,
  onOpenAIChat,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => {
            if (currentUser) {
              onNavigate(currentUser.role === 'doctor' ? 'doctor_dashboard' : 'patient_dashboard');
            }
          }}
          id="nav-brand-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight">
              Prescription Care
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Healthcare Management System
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* AI Clinical/Health Assistant Trigger Button */}
          {onOpenAIChat && (
            <button
              onClick={onOpenAIChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-lg shadow-xs transition-all"
              title="Open Gemini AI Medical Assistant"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </button>
          )}

          {/* User Status and Navigation */}
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3 ml-1">
              
              {/* Navigation links based on role */}
              <div className="hidden lg:flex items-center gap-2">
                {currentUser.role === 'doctor' ? (
                  <>
                    <button
                      onClick={() => onNavigate('doctor_dashboard')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        currentView === 'doctor_dashboard'
                          ? 'bg-teal-50 text-teal-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                      id="nav-doctor-dashboard-btn"
                    >
                      Prescriptions List
                    </button>
                    <button
                      onClick={() => onNavigate('create_prescription')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                        currentView === 'create_prescription'
                          ? 'bg-teal-600 text-white'
                          : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                      }`}
                      id="nav-new-prescription-btn"
                    >
                      + New Prescription
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onNavigate('patient_dashboard')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      currentView === 'patient_dashboard'
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    id="nav-patient-dashboard-btn"
                  >
                    My Health & Prescriptions
                  </button>
                )}
              </div>

              {/* Role indicator pill */}
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/80">
                {currentUser.role === 'doctor' ? (
                  <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-blue-700" />
                )}
                <span className="text-xs font-medium text-slate-800 hidden sm:inline">
                  {currentUser.name}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  currentUser.role === 'doctor' 
                    ? 'bg-teal-100 text-teal-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {currentUser.role}
                </span>
              </div>

              {/* Quick Role Switcher for viva examiners testing */}
              {onSwitchRole && (
                <button
                  onClick={() => onSwitchRole(currentUser.role === 'doctor' ? 'patient' : 'doctor')}
                  className="hidden md:inline-flex text-xs text-slate-500 hover:text-teal-700 underline px-1 py-1"
                  title="Quickly switch to test other user view"
                  id="nav-quick-switch-role"
                >
                  Switch
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Log out"
                id="nav-logout-btn"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-medium">
              Demo Mode
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
