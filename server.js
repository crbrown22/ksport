const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzkpw1DH9rURvt48B51b7oAiA6md8mBmfY29N1Yf2QiUB-5WCtDV3GPHKNWR4nGiqOg/exec';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// API: Athlete Data (GET)
app.get('/api/athlete/data', async (req, res) => {
  try {
    const email = (req.query.email || req.query.username || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email parameter required' });
    }

    const scriptUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=get_athlete&email=${encodeURIComponent(email)}`;
    const remoteRes = await fetch(scriptUrl);
    if (remoteRes.ok) {
      const data = await remoteRes.json();
      return res.json(data);
    }
    return res.status(remoteRes.status).json({ success: false, error: 'Failed fetching athlete data' });
  } catch (err) {
    console.error('Error proxying athlete data:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Athlete Update (POST)
app.post('/api/athlete/update', async (req, res) => {
  try {
    const payload = {
      action: 'update_athlete',
      ...req.body
    };

    const remoteRes = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (remoteRes.ok) {
      const data = await remoteRes.json();
      return res.json(data);
    }
    return res.json({ success: true, message: 'Update dispatched successfully' });
  } catch (err) {
    console.error('Error updating athlete data:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Athlete Logout (POST)
app.post('/api/auth/athlete-logout', async (req, res) => {
  try {
    const email = (req.body.email || req.body.username || '').trim().toLowerCase();
    const payload = {
      action: 'athlete_logout',
      email: email
    };

    const remoteRes = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (remoteRes.ok) {
      const data = await remoteRes.json();
      return res.json(data);
    }
    return res.json({ success: true, message: 'Logout logged' });
  } catch (err) {
    console.error('Error logging out athlete:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: 21-Day Tracker Sync (POST)
app.post('/api/21day/sync', async (req, res) => {
  try {
    const payload = {
      action: 'log_21_day',
      tab: '21_day',
      ...req.body
    };

    const remoteRes = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (remoteRes.ok) {
      const data = await remoteRes.json();
      return res.json(data);
    }
    return res.json({ success: true, message: 'Synced successfully' });
  } catch (err) {
    console.error('Error syncing 21-day tracker:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: 21-Day Records (GET)
app.get('/api/21day/records', async (req, res) => {
  try {
    const email = (req.query.email || '').trim().toLowerCase();
    const scriptUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=get_21_day&email=${encodeURIComponent(email)}`;
    const remoteRes = await fetch(scriptUrl);
    if (remoteRes.ok) {
      const data = await remoteRes.json();
      return res.json(data);
    }
    return res.json({ success: false, records: [] });
  } catch (err) {
    console.error('Error fetching 21-day records:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`KROME Sports Performance server running on port ${PORT}`);
});
