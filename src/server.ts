const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ─────────────────────────────────────────────────────────
// Skills — Push 1 starter pack
// These are the 3 curated skills that ship with ZERO AGENT
// ─────────────────────────────────────────────────────────
const STARTER_SKILLS = [
  {
    id: 'find-skills',
    name: 'find-skills',
    description: 'Discover and install skills from across the internet in plain English.',
    category: 'Core',
    icon: '🔍',
    tier: 'free',
    executionMode: 'on-demand',
    origin: 'skills.sh',
    originTag: '🟣 skills.sh',
    preInstalled: true,
    version: '1.0.0',
  },
  {
    id: 'btc-price',
    name: 'btc-price',
    description: 'Get the current Bitcoin price in USD. Live data, no API key required.',
    category: 'Crypto',
    icon: '₿',
    tier: 'free',
    executionMode: 'on-demand',
    origin: 'skills.sh',
    originTag: '🟣 skills.sh',
    preInstalled: false,
    version: '1.0.0',
  },
  {
    id: 'weather',
    name: 'weather',
    description: 'Get current weather for any city in the world. No API key required.',
    category: 'Utilities',
    icon: '🌤',
    tier: 'free',
    executionMode: 'on-demand',
    origin: 'skills.sh',
    originTag: '🟣 skills.sh',
    preInstalled: false,
    version: '1.0.0',
  },
];

// GET /api/skills — return available skills
app.get('/api/skills', async (req, res) => {
  try {
    res.json({ success: true, skills: STARTER_SKILLS });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch skills' });
  }
});

// ─────────────────────────────────────────────────────────
// Skill install / uninstall
// ─────────────────────────────────────────────────────────
app.post('/api/skills/:id/install', async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    const skill = STARTER_SKILLS.find(s => s.id === id);
    if (!skill) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    res.json({ success: true, message: `${id} installed`, skill });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to install skill' });
  }
});

// ─────────────────────────────────────────────────────────
// Agent execution
// ─────────────────────────────────────────────────────────
app.post('/api/agents/:agentId/execute', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { skillId, inputs } = req.body;

    const executionId = uuidv4();

    const result = {
      id: executionId,
      agentId,
      skillId,
      status: 'success',
      input: inputs,
      output: { result: 'Execution successful' },
      createdAt: new Date().toISOString(),
    };

    res.json({ success: true, execution: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Execution failed' });
  }
});

// ─────────────────────────────────────────────────────────
// Execution history
// ─────────────────────────────────────────────────────────
app.get('/api/agents/:agentId/executions', async (req, res) => {
  try {
    const { agentId } = req.params;
    // Push 2: pull real execution history from Supabase
    res.json({ success: true, executions: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

// ─────────────────────────────────────────────────────────
// Agent metrics
// ─────────────────────────────────────────────────────────
app.get('/api/agents/:id/metrics', async (req, res) => {
  try {
    const { id } = req.params;
    // Push 2: calculate real metrics from Supabase skill_executions table
    const metrics = {
      totalExecutions: 0,
      successRate: 100,
      errorRate: 0,
      lastExecution: null,
    };

    res.json({ success: true, metrics });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch metrics' });
  }
});

// ─────────────────────────────────────────────────────────
// 404 handler
// ─────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// ─────────────────────────────────────────────────────────
// Start server
// ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 ZERO AGENT backend running on http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
  console.log(`📦 Skills: http://localhost:${PORT}/api/skills`);
});
