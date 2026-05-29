// Seeds demo data: one admin, one patient, sample medications, reminders and dose logs.
// Run on the EC2 instance (or locally) with: node seed.js
// Demo credentials are documented in the project README.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Medication = require('./models/Medication');
const Reminder = require('./models/Reminder');
const DoseLog = require('./models/DoseLog');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medication-reminder';

const run = async () => {
    await mongoose.connect(MONGO_URI);
    console.log('Connected. Clearing existing demo data…');
    await Promise.all([
        User.deleteMany({ email: { $in: ['admin@mediremind.com', 'patient@mediremind.com'] } }),
    ]);

    // Passwords are hashed by the User model's pre-save hook.
    const admin = await User.create({
        name: 'System Admin', email: 'admin@mediremind.com', password: 'Admin@123', role: 'admin',
    });
    const patient = await User.create({
        name: 'Jane Patient', email: 'patient@mediremind.com', password: 'Patient@123', role: 'user',
    });

    // Clear this patient's prior domain data so re-seeding is idempotent.
    await Promise.all([
        Medication.deleteMany({ user: patient._id }),
        Reminder.deleteMany({ user: patient._id }),
        DoseLog.deleteMany({ user: patient._id }),
    ]);

    const metformin = await Medication.create({
        user: patient._id, name: 'Metformin', dosage: '500 mg', form: 'tablet',
        instructions: 'Take with food', prescriber: 'Dr. Smith', quantity: 60,
    });
    const lisinopril = await Medication.create({
        user: patient._id, name: 'Lisinopril', dosage: '10 mg', form: 'tablet',
        instructions: 'Take in the morning', prescriber: 'Dr. Smith', quantity: 30,
    });

    const reminder = await Reminder.create({
        user: patient._id, medication: metformin._id, times: ['08:00', '20:00'],
        frequency: 'daily', startDate: new Date(),
    });
    await Reminder.create({
        user: patient._id, medication: lisinopril._id, times: ['08:00'],
        frequency: 'daily', startDate: new Date(),
    });

    // A few dose logs so the adherence dashboard shows real numbers.
    await DoseLog.create([
        { user: patient._id, medication: metformin._id, reminder: reminder._id, scheduledTime: new Date(Date.now() - 86400000), status: 'taken', takenAt: new Date(Date.now() - 86400000) },
        { user: patient._id, medication: metformin._id, reminder: reminder._id, scheduledTime: new Date(Date.now() - 43200000), status: 'taken', takenAt: new Date(Date.now() - 43200000) },
        { user: patient._id, medication: lisinopril._id, scheduledTime: new Date(Date.now() - 3600000), status: 'skipped' },
    ]);

    console.log('Seed complete.');
    console.log('  Admin   -> admin@mediremind.com / Admin@123');
    console.log('  Patient -> patient@mediremind.com / Patient@123');
    await mongoose.disconnect();
};

run().catch((err) => { console.error(err); process.exit(1); });
