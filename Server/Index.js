// Simple Express + Mongoose API for RunMaster
// Deploy anywhere (Railway, Render, Fly, etc.). Set MONGODB_URI env variable.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const RunSchema = new mongoose.Schema({
  userId: { type: String, index: true, required: true },
  startedAt: { type: Number, required: true },
  durationSec: { type: Number, required: true },
  distanceKm: { type: Number, required: true },
  calories: { type: Number, required: true },
  avgPace: { type: String, required: true },
  path: [{ latitude: Number, longitude: Number, timestamp: Number }],
  splits: [{ km: Number, paceSec: Number, avgHr: Number }],
}, { timestamps: true });

const Run = mongoose.model('Run', RunSchema);

// Optional: routes and leaderboard (simple collections/mocks)
const RouteSchema = new mongoose.Schema({
  userId: { type: String, index: true, required: true },
  name: String,
  distanceKm: Number,
  notes: String,
  points: [{ latitude: Number, longitude: Number }],
  elevation: [Number],
}, { timestamps: true });
const SavedRoute = mongoose.model('Route', RouteSchema);

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'RunMaster API' });
});

app.get('/runs', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const runs = await Run.find({ userId }).sort({ startedAt: -1 }).lean();
    res.json(runs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/runs', async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.userId) return res.status(400).json({ error: 'userId required' });
    const r = await Run.create(body);
    res.json(r.toObject());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/runs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const patch = req.body || {};
    const r = await Run.findByIdAndUpdate(id, patch, { new: true });
    if (!r) return res.status(404).json({ error: 'not found' });
    res.json(r.toObject());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/runs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Run.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/routes', async (req, res) => {
  try {
    const { userId } = req.query; if (!userId) return res.status(400).json({ error: 'userId required' });
    const routes = await SavedRoute.find({ userId }).sort({ createdAt: -1 }).lean();
    res.json(routes);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/routes', async (req, res) => {
  try {
    const r = await SavedRoute.create(req.body || {});
    res.json(r.toObject());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/routes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const patch = req.body || {};
    const r = await SavedRoute.findByIdAndUpdate(id, patch, { new: true });
    if (!r) return res.status(404).json({ error: 'not found' });
    res.json(r.toObject());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/routes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await SavedRoute.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/leaderboard/city', async (req, res) => {
  try {
    const { city = 'Sua cidade' } = req.query;
    // Mocked aggregation: top 4 users with distances
    res.json([
      { user: 'Você', distanceKm: 42.2, city },
      { user: 'Ana', distanceKm: 38.5, city },
      { user: 'Carlos', distanceKm: 30.1, city },
      { user: 'Mia', distanceKm: 26.7, city },
    ]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/leaderboard/route', async (req, res) => {
  try {
    const { routeId } = req.query;
    res.json([
      { user: 'Você', distanceKm: 5.2, routeId },
      { user: 'Ana', distanceKm: 5.2, routeId },
    ]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/leaderboard/neighborhood', async (req, res) => {
  try {
    const { neighborhood = 'Seu bairro' } = req.query;
    res.json([
      { user: 'Você', distanceKm: 20.4, city: neighborhood },
      { user: 'Leo', distanceKm: 18.2, city: neighborhood },
    ]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Challenges (minimal)
const ChallengeSchema = new mongoose.Schema({
  title: String,
  scope: String,
  startAt: Number,
  endAt: Number,
  participants: [String],
}, { timestamps: true });
const Challenge = mongoose.model('Challenge', ChallengeSchema);

app.get('/challenges', async (req, res) => {
  try {
    const { scope } = req.query;
    const q = scope ? { scope } : {};
    const list = await Challenge.find(q).sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/challenges', async (req, res) => {
  try {
    const ch = await Challenge.create(req.body || {});
    res.json(ch.toObject());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/challenges/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const ch = await Challenge.findById(id);
    if (!ch) return res.status(404).json({ error: 'not found' });
    if (!ch.participants.includes(userId)) ch.participants.push(userId);
    await ch.save();
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;

async function main() {
  const mongo = process.env.MONGODB_URI || 'mongodb://localhost:27017/runmaster';
  await mongoose.connect(mongo);
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`API listening on ${PORT}`));
}

main().catch((e) => { console.error(e); process.exit(1); });