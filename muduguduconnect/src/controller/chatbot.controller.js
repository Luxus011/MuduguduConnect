const { Op }   = require('sequelize');
const { Worker, User } = require('../database/index');

const JOB_MAP = {
  // English
  'clean': 'Cleaner', 'cleaner': 'Cleaner', 'cleaning': 'Cleaner',
  'baby': 'Babysitter', 'babysitter': 'Babysitter', 'child': 'Babysitter', 'enfant': 'Babysitter',
  'guard': 'Guard', 'security': 'Guard', 'sécurité': 'Guard', 'gardien': 'Guard',
  'cook': 'Cook', 'chef': 'Cook', 'cuisinier': 'Cook', 'cuisine': 'Cook',
  'garden': 'Gardener', 'gardener': 'Gardener', 'jardin': 'Gardener', 'jardinier': 'Gardener',
  'driver': 'Driver', 'chauffeur': 'Driver', 'voiture': 'Driver',
  'nurse': 'Nurse', 'infirmier': 'Nurse', 'soignant': 'Nurse',
  'night': 'Night guard', 'nuit': 'Night guard',
  // Kinyarwanda
  'gukaraba': 'Cleaner', 'umukozi': 'Cleaner', 'umunara': 'Guard',
};

const LOCATION_LIST = [
  'Kimihurura','Kacyiru','Gikondo','Nyamirambo','Remera',
  'Gisozi','Kinyinya','Kibagabaga','Masaka','Muhima','Rwampara','Niboye',
];

function extractIntent(text) {
  const t = text.toLowerCase();
  let job = null, location = null, available = false;

  // Extract job
  for (const [kw, val] of Object.entries(JOB_MAP)) {
    if (t.includes(kw)) { job = val; break; }
  }

  // Extract location
  for (const loc of LOCATION_LIST) {
    if (t.includes(loc.toLowerCase())) { location = loc; break; }
  }

  // Extract availability
  if (t.includes('now') || t.includes('maintenant') || t.includes('vite') ||
      t.includes('urgent') || t.includes('disponible')) available = true;

  return { job, location, available };
}

// POST /api/chatbot
exports.query = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });

    const { job, location, available } = extractIntent(message);
    const where = {};
    if (job)       where.job      = job;
    if (location)  where.location = { [Op.like]: `%${location}%` };
    if (available) where.availability = 'Available Now';

    const workers = await Worker.findAll({
      where,
      include: [{ model: User, attributes: ['name', 'verified'] }],
      order: [['rating', 'DESC']],
      limit: 6,
    });

    const reply = workers.length
      ? `I found ${workers.length} worker(s)${job ? ` for "${job}"` : ''}${location ? ` in ${location}` : ''}${available ? ' available now' : ''}.`
      : `Sorry, no workers found matching your request. Try different keywords.`;

    res.json({ reply, intent: { job, location, available }, workers });
  } catch (err) { next(err); }
};
