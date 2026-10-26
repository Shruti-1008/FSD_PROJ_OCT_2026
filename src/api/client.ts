import { Prescription, User } from '../types';
import { loadSavedPrescriptions, savePrescriptionsToStorage, DEMO_USERS } from '../sampleData';

export interface HealthStatus {
  status: string;
  timestamp: string;
  stack: string;
  components: {
    database: {
      type: string;
      odm: string;
      connected: boolean;
      mode: 'mongodb' | 'memory-fallback';
      databaseName: string;
      uri: string;
    };
    backend: {
      server: string;
      framework: string;
      port: number;
    };
    frontend: {
      framework: string;
      bundler: string;
      styling: string;
    };
    ai: {
      provider: string;
      sdk: string;
    };
  };
}

export const api = {
  /**
   * Fetch all prescriptions from backend Express + MongoDB API
   */
  async getPrescriptions(): Promise<{ data: Prescription[]; source: string }> {
    try {
      const res = await fetch('/api/prescriptions');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          // Cache in localStorage for offline resilience
          savePrescriptionsToStorage(json.data);
          return { data: json.data, source: json.source || 'mongodb' };
        }
      }
    } catch (err) {
      console.warn('Backend API unavailable, loading from local cache:', err);
    }
    // Fallback to local storage
    return { data: loadSavedPrescriptions(), source: 'local-storage' };
  },

  /**
   * Create a new prescription in MongoDB via Express POST route
   */
  async createPrescription(prescription: Prescription): Promise<{ data: Prescription; source: string }> {
    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescription)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return { data: json.data, source: json.source || 'mongodb' };
        }
      }
    } catch (err) {
      console.warn('Failed to POST to /api/prescriptions:', err);
    }
    // Fallback save
    return { data: prescription, source: 'local-storage' };
  },

  /**
   * Delete prescription via Express DELETE route
   */
  async deletePrescription(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/prescriptions/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const json = await res.json();
        return json.success;
      }
    } catch (err) {
      console.warn('Failed to DELETE prescription:', err);
    }
    return true;
  },

  /**
   * Get server & database health info (MERN stack diagnostics)
   */
  async getHealth(): Promise<HealthStatus | null> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline / client-only mode
    }
    return null;
  },

  /**
   * Send query to Gemini AI Chatbot backend route
   */
  async sendChatMessage(
    message: string, 
    role: 'doctor' | 'patient',
    history: Array<{ sender: string; text: string }>
  ): Promise<{ reply: string; source: string }> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, role, history })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.reply) {
          return { reply: json.reply, source: json.source || 'gemini' };
        }
      }
    } catch (err) {
      console.warn('AI Chat API failed:', err);
    }
    return {
      reply: 'Hello! I am your AI Medical Assistant. Please ensure your backend server is running to chat with the Gemini engine.',
      source: 'offline'
    };
  }
};
