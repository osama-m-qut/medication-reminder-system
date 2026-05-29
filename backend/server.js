
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/medications', require('./routes/medicationRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/doselogs', require('./routes/doseLogRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// API health check (used by CI smoke tests and the EC2 load check).
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Medication Reminder System API' }));

// In production the same Express process also serves the built React app, so the
// public URL (http://<ec2-ip>:5001) shows the UI directly. The build folder is
// produced by `npm run build` in the frontend during deployment.
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../frontend/build');
    app.use(express.static(buildPath));
    app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

// Export the app object for testing
if (require.main === module) {
    connectDB();
    // If the file is run directly, start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }


module.exports = app
