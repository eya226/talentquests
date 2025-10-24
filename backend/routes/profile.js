const express = require('express');
const auth = require('../middleware/auth');
const db = require('../db/db');

const router = express.Router();

// --- Get User Profile ---
router.get('/', auth, async (req, res) => {
  try {
    const profile = await db.query('SELECT id, email, xp, level, skills, traits, vision, achievements, onboarding_complete, role FROM profiles WHERE id = $1', [req.user.id]);
    res.json(profile.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Update User Profile ---
router.put('/', auth, async (req, res) => {
    const { skills, traits, vision, onboarding_complete } = req.body;

    try {
        const updatedProfile = await db.query(
            'UPDATE profiles SET skills = $1, traits = $2, vision = $3, onboarding_complete = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [skills, traits, vision, onboarding_complete, req.user.id]
        );
        res.json(updatedProfile.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
