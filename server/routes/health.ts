import { Express } from 'express';

export function registerHealthRoutes(app: Express) {
  // Health check endpoint for Cloud Run
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      service: 'esferazap-mvp',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      project_id: process.env.PROJECT_ID || 'silent-text-458716-c9',
      uptime: process.uptime()
    });
  });

  // Ready check for Kubernetes/Cloud Run
  app.get('/ready', (req, res) => {
    // Check if all services are ready
    const isReady = true; // Add your readiness checks here

    if (isReady) {
      res.status(200).json({ ready: true });
    } else {
      res.status(503).json({ ready: false });
    }
  });

  // Liveness probe
  app.get('/alive', (req, res) => {
    res.status(200).send('OK');
  });

  // Version endpoint
  app.get('/version', (req, res) => {
    res.json({
      version: process.env.npm_package_version || '1.0.0',
      commit: process.env.GITHUB_SHA || 'local',
      build_date: new Date().toISOString()
    });
  });
}