/**
 * Prescription for Healthcare Management
 * College Project Implementation - Full Stack MERN Architecture
 * 
 * Stack:
 * - M: MongoDB (Mongoose ODM schemas & document persistence)
 * - E: Express.js (RESTful API routes on /api/*)
 * - R: React 19 (Component-based UI with Tailwind CSS)
 * - N: Node.js (Asynchronous backend runtime)
 * + Gemini 2.5 Flash AI clinical assistant
 */

import React, { useState, useEffect } from 'react';
import { User, Prescription, UserRole } from './types';
import { DEMO_USERS, loadSavedPrescriptions } from './sampleData';
import { api } from './api/client';

import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientDashboard } from './components/PatientDashboard';
import { CreatePrescription } from './components/CreatePrescription';
import { ViewPrescription } from './components/ViewPrescription';
import { AIChatModal } from './components/AIChatModal';
import { Sparkles, CheckCircle2 } from 'lucide-react';

type ViewType = 
  | 'login' 
  | 'doctor_dashboard' 
  | 'patient_dashboard' 
  | 'create_prescription' 
  | 'view_prescription';

export default function App() {
  // State: Currently logged-in user (null shows login screen)
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USERS[0]); // Default to Doctor for instant demonstration

  // State: Current active screen
  const [currentView, setCurrentView] = useState<ViewType>('doctor_dashboard');

  // State: All prescriptions (loads from backend API or local cache)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(loadSavedPrescriptions);

  // State: Selected prescription for the "View Prescription Slip" page
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  // State: Modal visibility
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // State: Database source indicator
  const [dataSource, setDataSource] = useState<string>('connecting...');

  // Fetch prescriptions from MERN Backend API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const result = await api.getPrescriptions();
        if (isMounted) {
          setPrescriptions(result.data);
          setDataSource(result.source === 'mongodb' ? 'MongoDB Active' : 'MERN Backend Active');
        }
      } catch (err) {
        console.warn('API fetch error:', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Handle User Login
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'doctor') {
      setCurrentView('doctor_dashboard');
    } else {
      setCurrentView('patient_dashboard');
    }
  };

  // Handle User Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedPrescription(null);
    setCurrentView('login');
  };

  // Switch Role quickly (convenient for college viva testing)
  const handleSwitchRole = (newRole: UserRole) => {
    if (newRole === 'doctor') {
      const doc = DEMO_USERS.find(u => u.role === 'doctor') || DEMO_USERS[0];
      setCurrentUser(doc);
      setCurrentView('doctor_dashboard');
    } else {
      const pat = DEMO_USERS.find(u => u.role === 'patient') || DEMO_USERS[1];
      setCurrentUser(pat);
      setCurrentView('patient_dashboard');
    }
  };

  // Handle saving a newly created prescription (calls Express POST /api/prescriptions)
  const handleSavePrescription = async (newRx: Prescription) => {
    // Optimistic UI update
    setPrescriptions(prev => [newRx, ...prev]);
    setSelectedPrescription(newRx);
    setCurrentView('view_prescription');

    // Persist to backend MERN API
    try {
      const res = await api.createPrescription(newRx);
      if (res.source === 'mongodb') {
        setDataSource('MongoDB Active');
      }
    } catch (err) {
      console.error('Failed to persist prescription to MERN server:', err);
    }
  };

  // Handle deleting a prescription (calls Express DELETE /api/prescriptions/:id)
  const handleDeletePrescription = async (id: string) => {
    setPrescriptions(prev => prev.filter(rx => rx.id !== id));
    try {
      await api.deletePrescription(id);
    } catch (err) {
      console.error('Failed to delete prescription from MERN server:', err);
    }
  };

  // Handle viewing a specific prescription slip
  const handleViewPrescription = (rx: Prescription) => {
    setSelectedPrescription(rx);
    setCurrentView('view_prescription');
  };

  // Return to previous dashboard from the view screen
  const handleBackFromView = () => {
    if (currentUser?.role === 'doctor') {
      setCurrentView('doctor_dashboard');
    } else {
      setCurrentView('patient_dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(view: ViewType) => setCurrentView(view)}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onOpenAIChat={() => setIsAIChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Screen 1: Login Page with Classy Photography */}
        {currentView === 'login' && (
          <LoginPage 
            onLogin={handleLogin}
          />
        )}

        {/* Screen 2: Doctor Dashboard */}
        {currentView === 'doctor_dashboard' && currentUser && currentUser.role === 'doctor' && (
          <DoctorDashboard
            doctor={currentUser}
            prescriptions={prescriptions}
            onNavigateCreate={() => setCurrentView('create_prescription')}
            onViewPrescription={handleViewPrescription}
            onDeletePrescription={handleDeletePrescription}
          />
        )}

        {/* Screen 3: Patient Dashboard */}
        {currentView === 'patient_dashboard' && currentUser && (
          <PatientDashboard
            patient={currentUser}
            prescriptions={prescriptions}
            onViewPrescription={handleViewPrescription}
          />
        )}

        {/* Screen 4: Create Prescription Page */}
        {currentView === 'create_prescription' && currentUser && (
          <CreatePrescription
            doctor={currentUser}
            onSave={handleSavePrescription}
            onCancel={() => setCurrentView('doctor_dashboard')}
          />
        )}

        {/* Screen 5: View Prescription Page */}
        {currentView === 'view_prescription' && selectedPrescription && (
          <ViewPrescription
            prescription={selectedPrescription}
            onBack={handleBackFromView}
          />
        )}

      </main>

      {/* Floating Action Button for Gemini AI Chatbot */}
      <div className="fixed bottom-5 right-5 z-40 no-print flex flex-col items-end gap-2">
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-full shadow-lg shadow-teal-700/20 font-medium text-xs sm:text-sm transition-all hover:scale-105 active:scale-95"
          title="Open AI Medical Assistant"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span className="font-semibold">AI Medical Assistant</span>
        </button>
      </div>

      {/* Clean Footer */}
      <footer className="py-3 px-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500 no-print flex flex-col sm:flex-row items-center justify-between gap-2 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700">Prescription Care</span>
          <span className="text-slate-300">&bull;</span>
          <span>Healthcare Management System</span>
        </div>

        <div className="inline-flex items-center gap-1.5 text-slate-500 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          <span>Clinical Portal Active</span>
        </div>
      </footer>

      {/* Modal 1: Gemini AI Chat Assistant */}
      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        userRole={currentUser?.role || 'doctor'}
        userName={currentUser?.name || 'User'}
      />

    </div>
  );
}
