const fs = require('fs');
const path = require('path');

const files = {
  'package.json': `{
  "name": "zero-agent-backend",
  "version": "1.0.0",
  "description": "ZERO AGENT Backend API",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "@supabase/supabase-js": "^2.38.4",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "@types/express": "^4.17.21",
    "@types/node": "^20.9.0",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.1"
  }
}
`,
  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
`,
  '.env.local': `SUPABASE_URL=https://rlswifuaebtkjjsjcxro.supabase.co
SUPABASE_ANON_KEY=paste-your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=paste-your-service-role-key-here
PORT=3000
NODE_ENV=development
`,
  'src/server.ts': `import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Get all skills
app.get('/api/skills', async (req: Request, res: Response) => {
  try {
    const skills = [
      { id: '1', name: 'Calculator', category: 'Math', price: 0, icon: '🧮', description: 'Basic math operations' },
      { id: '2', name: 'Email Sender', category: 'Communication', price: 0, icon: '📧', description: 'Send emails' },
      { id: '3', name: 'Slack Bot', category: 'Communication', price: 5, icon: '💬', description: 'Post to Slack' },
      { id: '4', name: 'Calendar Manager', category: 'Productivity', price: 0, icon: '📅', description: 'Manage calendar' },
      { id: '5', name: 'Data Analyzer', category: 'Analytics', price: 9, icon: '📊', description: 'Analyze data' },
      { id: '6', name: 'PDF Generator', category: 'Documents', price: 10, icon: '📄', description: 'Generate PDFs' },
    ];
    res.json({ success: true, skills });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch skills' });
  }
});

// Install skill
app.post('/api/skills/:id/install', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;
    res.json({ success: true, message: \`Skill \${id} installed\` });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to install skill' });
  }
});

// Execute skill
app.post('/api/agents/:agentId/execute', async (req: Request, res: Response) => {
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

// Get execution history
app.get('/api/agents/:agentId/executions', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const executions = [
      {
        id: '1',
        agentId,
        skillId: '1',
        status: 'success',
        createdAt: new Date().toISOString(),
      },
    ];
    res.json({ success: true, executions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

// Get agent metrics
app.get('/api/agents/:id/metrics', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const metrics = {
      totalExecutions: 42,
      successRate: 95,
      errorRate: 5,
      lastExecution: new Date().toISOString(),
    };
    res.json({ success: true, metrics });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch metrics' });
  }
});

// Download agent
app.post('/api/agents/:id/download', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ success: true, message: 'Agent downloaded', downloadUrl: \`/agents/\${id}/agent.zip\` });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Download failed' });
  }
});

// Error handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
  console.log(\`✅ Health check: http://localhost:\${PORT}/health\`);
  console.log(\`📚 API: http://localhost:\${PORT}/api/skills\`);
});
`,
  'README.md': `# ZERO AGENT Backend

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\

## Test

Open browser: http://localhost:3000/health

## Environment

Update .env.local with your Supabase keys:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
`
};

// Create all files
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✅ Created: ${filePath}`);
});

console.log('\n🎉 Backend created successfully!');
console.log('\nNext steps:');
console.log('1. npm install');
console.log('2. Update .env.local with your Supabase keys');
console.log('3. npm run dev');
