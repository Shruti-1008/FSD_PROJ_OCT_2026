// @ts-nocheck
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Demo Initial Data
const DEMO_USERS = [
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

const INITIAL_PRESCRIPTIONS = [
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
        medicineName: 'Levosalbutamol & Ambroxol Syrup',
        dosage: '5 ml',
        frequency: 'Twice daily (Morning & Evening)',
        duration: '5 Days',
        instructions: 'Take after food for lingering post-viral cough'
      }
    ],
    instructions: 'Continue warm saline gargles. Light cardio permitted after 3 days.',
    progressStatus: 'Nearly Recovered',
    progressPercentage: 85,
    progressNotes: 'Fever completely subsided. Chest sounds clear upon auscultation. Lingering mild dry throat remains.',
    nextFollowUp: '2026-09-28'
  },
  {
    id: 'RX-2026-112',
    date: '2026-09-22',
    doctorName: 'Dr. Ramesh Sharma',
    doctorSpecialty: 'Senior Consultant Physician (MBBS, MD)',
    doctorRegNo: 'MCI-54892',
    clinicName: 'City Care Health Clinic & Wellness Centre',
    clinicAddress: '124 Hospital Road, Metro Health Complex, City',
    patientName: 'Pooja Patel',
    patientAge: 34,
    patientGender: 'Female',
    patientId: 'PT-9045',
    diagnosis: 'Acute Gastroesophageal Reflux Disease (GERD) with Gastritis',
    consultationNumber: 1,
    medicines: [
      {
        id: 'med_6',
        medicineName: 'Pantoprazole + Domperidone (Pan-D)',
        dosage: '40 mg / 30 mg',
        frequency: 'Once daily (30 min Before Breakfast)',
        duration: '14 Days',
        instructions: 'Must take on an empty stomach with a full glass of water'
      },
      {
        id: 'med_7',
        medicineName: 'Sucralfate + Oxetacaine Oral Suspension',
        dosage: '10 ml',
        frequency: '3 times daily (1 hour Before Meals & Bedtime)',
        duration: '7 Days',
        instructions: 'Do not eat or drink for 30 minutes after taking'
      }
    ],
    instructions: 'Eat smaller, frequent meals. Avoid spicy, citrus, and caffeinated beverages. Do not lie down within 2 hours of eating.',
    progressStatus: 'Initial Consultation',
    progressPercentage: 20,
    progressNotes: 'Severe retrosternal burning and postprandial discomfort for 1 week. Started proton pump inhibitor therapy.',
    nextFollowUp: '2026-10-06'
  }
];

// In-Memory Storage Fallback
const inMemoryStore = {
  prescriptions: JSON.parse(JSON.stringify(INITIAL_PRESCRIPTIONS)),
  users: JSON.parse(JSON.stringify(DEMO_USERS))
};

// Database state
const dbState = {
  isConnected: false,
  uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prescription_db',
  databaseName: 'prescription_db',
  mode: 'memory-fallback'
};

// Mongoose Schemas & Models
const MedicineItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  instructions: { type: String, default: '' }
}, { _id: false });

const PrescriptionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  date: { type: String, required: true },
  doctorName: { type: String, required: true },
  doctorSpecialty: { type: String, default: 'General Physician' },
  doctorRegNo: { type: String, default: 'MCI-REG-01' },
  clinicName: { type: String, default: 'City Care Health Clinic' },
  clinicAddress: { type: String, default: '124 Hospital Road, Health Complex' },
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { type: String, required: true },
  patientId: { type: String, required: true, index: true },
  diagnosis: { type: String, required: true },
  consultationNumber: { type: Number, default: 1 },
  medicines: { type: [MedicineItemSchema], default: [] },
  instructions: { type: String, default: '' },
  progressStatus: { type: String, default: 'Initial Consultation' },
  progressPercentage: { type: Number, default: 25 },
  progressNotes: { type: String, default: '' },
  nextFollowUp: { type: String }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['doctor', 'patient'] },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: '123456' },
  specialty: { type: String },
  regNumber: { type: String },
  age: { type: Number },
  gender: { type: String }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

const PrescriptionModel = mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema);
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

// Connect to MongoDB if URI is provided with fast timeout
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[Healthcare Backend] No MONGODB_URI provided. Running in high-performance In-Memory Mode.');
    return;
  }

  try {
    console.log(`[Healthcare Backend] Connecting to MongoDB: ${uri}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    dbState.isConnected = true;
    dbState.mode = 'mongodb';
    dbState.uri = uri;
    console.log('[Healthcare Backend] Successfully connected to MongoDB database!');

    // Seed database if empty
    const count = await PrescriptionModel.countDocuments();
    if (count === 0) {
      await PrescriptionModel.insertMany(INITIAL_PRESCRIPTIONS);
      await UserModel.insertMany(DEMO_USERS);
      console.log('[Healthcare Backend] Database seeded with initial demo clinical records.');
    }
  } catch (err) {
    dbState.isConnected = false;
    dbState.mode = 'memory-fallback';
    console.warn('[Healthcare Backend] MongoDB connection not available. Seamlessly using In-Memory Fallback Store.');
  }
}

connectDB();

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      connected: dbState.isConnected,
      mode: dbState.mode,
      type: 'MongoDB'
    },
    server: {
      port: PORT,
      environment: isProduction ? 'production' : 'development'
    }
  });
});

// GET /api/prescriptions
app.get('/api/prescriptions', async (req, res) => {
  const { patientId, doctorName, search } = req.query;

  try {
    if (dbState.isConnected) {
      const query = {};
      if (patientId) query.patientId = String(patientId);
      if (doctorName) query.doctorName = new RegExp(String(doctorName), 'i');
      if (search) {
        query.$or = [
          { patientName: new RegExp(String(search), 'i') },
          { diagnosis: new RegExp(String(search), 'i') },
          { id: new RegExp(String(search), 'i') }
        ];
      }
      const list = await PrescriptionModel.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, source: 'mongodb', count: list.length, data: list });
    }

    let results = [...inMemoryStore.prescriptions];
    if (patientId) {
      results = results.filter(p => p.patientId === patientId);
    }
    if (doctorName) {
      results = results.filter(p => p.doctorName.toLowerCase().includes(String(doctorName).toLowerCase()));
    }
    if (search) {
      const s = String(search).toLowerCase();
      results = results.filter(p =>
        p.patientName.toLowerCase().includes(s) ||
        p.diagnosis.toLowerCase().includes(s) ||
        p.id.toLowerCase().includes(s)
      );
    }

    return res.json({ success: true, source: 'in-memory-fallback', count: results.length, data: results });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/prescriptions/:id
app.get('/api/prescriptions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (dbState.isConnected) {
      const item = await PrescriptionModel.findOne({ id });
      if (!item) return res.status(404).json({ success: false, message: 'Prescription not found' });
      return res.json({ success: true, data: item });
    }

    const item = inMemoryStore.prescriptions.find(p => p.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Prescription not found' });
    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/prescriptions
app.post('/api/prescriptions', async (req, res) => {
  try {
    const rxData = req.body;
    if (!rxData.id) {
      rxData.id = `RX-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    }
    if (!rxData.date) {
      rxData.date = new Date().toISOString().split('T')[0];
    }

    if (dbState.isConnected) {
      const created = await PrescriptionModel.create(rxData);
      return res.status(201).json({ success: true, source: 'mongodb', data: created });
    }

    inMemoryStore.prescriptions.unshift(rxData);
    return res.status(201).json({ success: true, source: 'in-memory-fallback', data: rxData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/prescriptions/:id
app.put('/api/prescriptions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (dbState.isConnected) {
      const updated = await PrescriptionModel.findOneAndUpdate({ id }, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Prescription not found' });
      return res.json({ success: true, data: updated });
    }

    const idx = inMemoryStore.prescriptions.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Prescription not found' });
    inMemoryStore.prescriptions[idx] = { ...inMemoryStore.prescriptions[idx], ...req.body };
    return res.json({ success: true, data: inMemoryStore.prescriptions[idx] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/prescriptions/:id
app.delete('/api/prescriptions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (dbState.isConnected) {
      await PrescriptionModel.findOneAndDelete({ id });
      return res.json({ success: true, message: 'Prescription deleted' });
    }

    inMemoryStore.prescriptions = inMemoryStore.prescriptions.filter(p => p.id !== id);
    return res.json({ success: true, message: 'Prescription deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/users
app.get('/api/users', async (_req, res) => {
  try {
    if (dbState.isConnected) {
      const users = await UserModel.find({});
      return res.json({ success: true, data: users });
    }
    return res.json({ success: true, data: inMemoryStore.users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/users/demo
app.get('/api/users/demo', (_req, res) => {
  return res.json({ success: true, data: DEMO_USERS });
});

// POST /api/users/login
app.post('/api/users/login', async (req, res) => {
  const { name, role, email, password } = req.body;
  try {
    if (dbState.isConnected) {
      let query = {};
      if (email) query.email = email.toLowerCase().trim();
      else if (name) query.name = new RegExp(`^${name.trim()}$`, 'i');

      let user = await UserModel.findOne(query);
      if (!user) {
        user = await UserModel.create({
          id: role === 'doctor' ? `doc_${Date.now()}` : `pat_${Date.now()}`,
          name: name || 'Demo User',
          role: role || 'doctor',
          email: email || `${(name || 'user').toLowerCase().replace(/\s+/g, '')}@healthcare.org`,
          password: password || '123456'
        });
      }
      return res.json({ success: true, data: user });
    }

    let user = inMemoryStore.users.find(u =>
      (email && u.email.toLowerCase() === email.toLowerCase()) ||
      (name && u.name.toLowerCase() === name.toLowerCase())
    );
    if (!user) {
      user = {
        id: role === 'doctor' ? `doc_${Date.now()}` : `pat_${Date.now()}`,
        name: name || 'Demo User',
        role: role || 'doctor',
        email: email || `${(name || 'user').toLowerCase().replace(/\s+/g, '')}@healthcare.org`
      };
      inMemoryStore.users.push(user);
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/chat (Gemini AI Clinical Support)
app.post('/api/chat', async (req, res) => {
  const { message, role, history } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  const userRole = role === 'doctor' ? 'doctor' : 'patient';
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  const systemInstruction = userRole === 'doctor'
    ? 'You are an AI Clinical Assistant assisting physicians with dosage calculations, standard clinical guidelines, and clear patient instructions.'
    : 'You are an AI Patient Health Guide helping patients understand medication timings, diet tips, and recovery recommendations in warm, clear language.';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents = [];
      if (Array.isArray(history)) {
        history.slice(-6).forEach(h => {
          contents.push({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        });
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: { systemInstruction, temperature: 0.6, maxOutputTokens: 600 }
      });

      return res.json({
        success: true,
        reply: response.text || 'I am ready to assist with your medical queries.',
        source: 'gemini-2.5-flash'
      });
    } catch (err) {
      console.warn('[AI Assistant] API call failed, using clinical fallback engine:', err.message);
    }
  }

  // Clinical Rule-Based Fallback
  const q = message.toLowerCase();
  let reply = '';
  if (q.includes('fever') || q.includes('paracetamol')) {
    reply = 'For fever, Paracetamol (650mg) is typically prescribed SOS (as needed) up to 3 times daily with at least 6 hours between doses. Stay well-hydrated and rest.';
  } else if (q.includes('antibiotic') || q.includes('amoxicillin')) {
    reply = 'Always complete the full prescribed course of antibiotics even if feeling better, to avoid antibiotic resistance. Take after food with water.';
  } else if (q.includes('miss') || q.includes('forgot')) {
    reply = 'If you miss a dose, take it as soon as you remember, unless it is close to your next scheduled dose. Never take a double dose to compensate.';
  } else {
    reply = `I have received your question regarding "${message}". Follow all doctor instructions and take medications exactly as prescribed.`;
  }

  return res.json({
    success: true,
    reply,
    source: 'clinical-fallback-engine'
  });
});

// Setup Vite middleware in Development or Static Server in Production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('[Healthcare Server] Vite middleware mounted for development.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log(`[Healthcare Server] Serving production build from: ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [Healthcare Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export default app;
