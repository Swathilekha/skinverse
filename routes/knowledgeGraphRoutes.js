const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const KG_PATH = path.join(__dirname, '../knowledge_graph.json');

// Helper: read knowledge graph
function readKG() {
  if (!fs.existsSync(KG_PATH)) return [];
  return JSON.parse(fs.readFileSync(KG_PATH));
}

// Helper: save knowledge graph
function saveKG(kg) {
  fs.writeFileSync(KG_PATH, JSON.stringify(kg, null, 2));
}

// ------------------- Add or update chemical -------------------
router.post('/add_chemical', (req, res) => {
  const { chemical, alternatives } = req.body;
  if (!chemical || !alternatives) return res.status(400).json({ message: 'Chemical and alternatives are required.' });

  let kg = readKG();
  const exists = kg.find(k => k.chemical.toLowerCase() === chemical.toLowerCase());
  if (!exists) {
    kg.push({ chemical, alternatives });
    saveKG(kg);
  } else {
    // Optional: update existing alternatives
    exists.alternatives = alternatives;
    saveKG(kg);
  }

  res.json({ message: 'Saved successfully.', chemical, alternatives });
});

// ------------------- Fetch all chemicals -------------------
router.get('/knowledge_graph', (req, res) => {
  const kg = readKG();
  res.json(kg);
});

module.exports = router;
