// Simple Express + Mongoose API for Pulse
// Deploy anywhere (Railway, Render, Fly, etc.). Set MONGODB_URI env variable.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
let PDFDocument; try { PDFDocument = require('pdfkit'); } catch {}

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Very simple in-memory rate limiter for weather endpoint
const rateWindowMs = 60 * 1000; // 1 minute
const maxRequestsPerIp = 30; // allow 30 req/min per IP
const ipToTimestamps = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const arr = ipToTimestamps.get(ip) || [];
  const recent = arr.filter((t) => now - t < rateWindowMs);
  recent.push(now);
  ipToTimestamps.set(ip, recent);
  return recent.length > maxRequestsPerIp;
}

// WeatherAPI proxy (current conditions)
// Usage: GET /weather/current?q=City%20Name[&format=json|xml]
// Accepts either a city name or "lat,lon" for q. Defaults to JSON.
app.get('/weather/current', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    if (isRateLimited(ip)) return res.status(429).json({ error: 'rate_limited' });
    const { q, format } = req.query || {};
    if (!q) return res.status(400).json({ error: 'q (city or "lat,lon") is required' });

    const output = String(format).toLowerCase() === 'xml' ? 'xml' : 'json';
    const BASE_URL = 'http://api.weatherapi.com/v1';
    const API_KEY = process.env.WEATHERAPI_KEY || 'e91594f87b884433860113718252808';
    const endpoint = `${BASE_URL}/current.${output}?key=${API_KEY}&q=${encodeURIComponent(q)}&aqi=no`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(endpoint, { signal: controller.signal });
    const contentType = response.headers.get('content-type') || '';
    const status = response.status;

    if (!response.ok) {
      const errorPayload = contentType.includes('application/json') ? await response.json() : await response.text();
      return res.status(status).json({ error: 'upstream_error', details: errorPayload });
    }

    if (output === 'xml') {
      const text = await response.text();
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      clearTimeout(timeout);
      return res.status(200).send(text);
    }

    const data = await response.json();
    clearTimeout(timeout);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

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
  res.json({ ok: true, service: 'Pulse API' });
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

// PDF export for a run summary (server-side)
app.get('/export/run/:id.pdf', async (req, res) => {
  try {
    if (!PDFDocument) return res.status(501).json({ error: 'pdfkit not installed on server' });
    const { id } = req.params;
    const run = await Run.findById(id).lean();
    if (!run) return res.status(404).json({ error: 'not found' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=run_${id}.pdf`);
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    doc.pipe(res);
    doc.fontSize(18).text('Pulse - Resumo da Corrida', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Início: ${new Date(run.startedAt).toLocaleString()}`);
    doc.text(`Duração: ${(run.durationSec/60|0)} min`);
    doc.text(`Distância: ${run.distanceKm.toFixed(2)} km`);
    doc.text(`Pace médio: ${run.avgPace}`);
    doc.text(`Calorias: ${Math.round(run.calories)}`);
    doc.moveDown();
    if (Array.isArray(run.splits) && run.splits.length) {
      doc.fontSize(14).text('Splits');
      doc.fontSize(12);
      run.splits.forEach((s) => doc.text(`${s.km} km: ${s.paceSec}s ${s.avgHr ? `• ${s.avgHr} bpm` : ''}`));
    }
    doc.end();
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

app.post('/iap/validate', async (req, res) => {
	try {
		const { userId, receipt, productId } = req.body || {};
		if (!userId || !receipt) return res.status(400).json({ error: 'userId and receipt required' });
		// TODO: validate with RevenueCat/StoreKit/Billing backend. For now, accept mock.
		return res.json({ ok: true, isPremium: true, productId });
	} catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/referral/apply', async (req, res) => {
	try {
		const { userId, code } = req.body || {};
		if (!userId || !code) return res.status(400).json({ error: 'userId and code required' });
		// TODO: lookup code in DB, mark redemption. For now accept one-off.
		return res.json({ ok: true, applied: true });
	} catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/webhooks/revenuecat', async (req, res) => {
	try {
		const secret = process.env.REV_CAT_WEBHOOK_SECRET || 'dev';
		const sig = req.headers['x-signature'] || '';
		// TODO: verify HMAC using request raw body; here we just compare placeholder
		if (!sig || sig !== secret) return res.status(401).json({ error: 'unauthorized' });
		const event = req.body || {};
		console.log('[revenuecat webhook]', event?.type);
		// Update user premium status in DB based on event
		return res.json({ ok: true });
	} catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/config', async (req, res) => {
	try {
		const { userId = '', group = '' } = req.query || {};
		// Simple hash to bucket users deterministically (0-99)
		const hash = (str) => {
			let h = 0;
			for (let i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) % 10000;
			return h % 100;
		};
		const bucket = group ? (hash(group)) : hash(userId);
		// Flags rollout examples
		const flags = {
			feature_planner: bucket < 50, // 50% rollout
			feature_tbt: bucket < 30, // 30% rollout
		};
		// AB test variants for paywall copy (A/B)
		const paywallVariant = bucket < 50 ? 'A' : 'B';
		res.json({ flags, variants: { paywallCopy: paywallVariant } });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

const PORT = process.env.PORT || 3000;

async function main() {
  if (process.env.SKIP_DB === 'true') {
    app.listen(PORT, () => console.log(`API listening on ${PORT} (DB skipped)`));
    return;
  }
  const mongo = process.env.MONGODB_URI || 'mongodb://localhost:27017/pulse';
  await mongoose.connect(mongo);
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`API listening on ${PORT}`));
}

main().catch((e) => { console.error(e); process.exit(1); });