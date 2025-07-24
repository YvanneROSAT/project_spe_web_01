import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import crypto from "crypto";

// Génération de nonce pour les scripts inline
export function generateCSPNonce(req: Request, res: Response, next: NextFunction) {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
}

// Configuration CSP stricte
export function cspMiddleware() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          process.env.FRONTEND_URL,
          (req, res) => `'nonce-${res.locals.nonce}'`
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // Pour Bootstrap
          process.env.FRONTEND_URL,
          "https://cdn.jsdelivr.net", // CDN Bootstrap
          "https://fonts.googleapis.com"
        ],
        imgSrc: [
          "'self'",
          "data:",
          process.env.FRONTEND_URL,
          `http://localhost:${process.env.PORT}`
        ],
        connectSrc: [
          "'self'",
          `http://localhost:${process.env.PORT}`
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://fonts.googleapis.com"
        ],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        childSrc: ["'none'"],
        workerSrc: ["'none'"],
        manifestSrc: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
      reportOnly: false,
      reportUri: '/csp-report',
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  });
}

// Middleware spécial pour l'URL de statistiques (accessible à toutes les IP)
export function cspForPublicStats() {
  return helmet({
    contentSecurityPolicy: false, // Désactiver CSP pour les stats publiques
    crossOriginEmbedderPolicy: false,
  });
} 