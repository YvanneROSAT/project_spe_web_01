# Backend - Projet Spécialisation Web

Système backend avec **CSP (Content Security Policy)** intégré pour la sécurité web conforme OWASP.

## 🚀 Installation rapide

### 1. Dépendances et environnement

```sh
cd backend
pnpm install

# Créer .env
cat > .env << EOF
NODE_ENV=dev
LOG_LEVEL=debug
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_CHANGE_IN_PRODUCTION
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=project_spe_web
EOF
```

### 2. Base de données

```sh
# Lancer MySQL
pnpm run db:start

# Créer le schéma
mysql -h localhost -u root -p < ../database/database.sql

# Injecter les données de test
pnpm run seed
```

### 3. Démarrage

```sh
pnpm run dev
```

**✅ Serveur prêt :** `http://localhost:5000`

## 🔒 Système CSP

### Architecture de sécurité

| Endpoint          | CSP       | CORS         | Auth     | Description            |
| ----------------- | --------- | ------------ | -------- | ---------------------- |
| `/products/stats` | ❌        | ✅ Ouvert    | ❌       | Statistiques publiques |
| `/csp-report`     | ❌        | ✅ Restreint | ❌       | Collecte violations    |
| `/auth/*`         | ✅ Strict | ✅ Restreint | Variable | Authentification       |
| `/admin/csp-*`    | ✅ Strict | ✅ Restreint | ✅ JWT   | Interface admin        |

### Politique CSP appliquée

```javascript
// CSP strict (toutes routes sauf /products/stats)
{
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "http://localhost:3000", "'nonce-RANDOM'"],
  styleSrc: ["'self'", "'unsafe-inline'", "http://localhost:3000"],
  imgSrc: ["'self'", "data:", "http://localhost:3000"],
  connectSrc: ["'self'", "http://localhost:5000"],
  objectSrc: ["'none'"], frameSrc: ["'none'"],
  reportTo: '/csp-report'
}
```

## 🧪 Tests automatisés

### Script de test complet

```sh
# Rendre exécutable
chmod +x test-csp.sh

# Lancer tous les tests
./test-csp.sh
```

Le script `test-csp.sh` vérifie automatiquement :

- ✅ Statistiques publiques (sans CSP)
- ✅ Collecte des violations CSP
- ✅ Protection admin par authentification
- ✅ En-têtes de sécurité présents

### Test des violations en conditions réelles

```sh
# Servir la page de test
python -m http.server 8080
# ou
npx serve -l 8080 .

# Ouvrir http://localhost:8080/test-csp.html
# -> Consulter la console développeur
# -> Les violations sont auto-envoyées à /csp-report
```

Le fichier `test-csp.html` génère intentionnellement :

- Scripts inline sans nonce
- Images/iframes externes non autorisés
- Event handlers inline
- Chargement de scripts malveillants

## 📊 Vérification des résultats

### Violations collectées

```sql
USE project_spe_web;

-- Voir les rapports stockés
SELECT * FROM csp_reports ORDER BY created_at DESC LIMIT 5;

-- Statistiques par directive
SELECT
  JSON_EXTRACT(report_data, '$."csp-report"."violated-directive"') as directive,
  COUNT(*) as count
FROM csp_reports GROUP BY directive;
```

### Interface d'administration

```sh
# 1. Créer un admin
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Admin","lastName":"CSP","email":"admin@example.com","password":"SECURE_PASSWORD"}'

# 2. Se connecter
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"SECURE_PASSWORD"}'

# 3. Accéder aux rapports (nécessite cookies JWT+CSRF)
curl -H "Cookie: token=YOUR_TOKEN; csrf_token=YOUR_CSRF" \
  http://localhost:5000/admin/csp-reports
```

## 🔍 Validation externe

### CSP Evaluator (Google)

1. Aller sur [csp-evaluator.withgoogle.com](https://csp-evaluator.withgoogle.com/)
2. Tester : `http://localhost:5000`
3. **Note attendue :** A ou A-

### CORS depuis le frontend

```javascript
// ✅ Doit fonctionner (stats publiques)
fetch('http://localhost:5000/products/stats')

// ✅ Doit fonctionner (auth depuis localhost:3000)
fetch('http://localhost:5000/auth/login', {method: 'POST', ...})

// ❌ Doit échouer (autre domaine)
// Tester depuis https://example.com via console
```

## 🔧 Développement

### Commandes disponibles

```sh
pnpm run dev      # Mode développement avec watch
pnpm run build    # Compilation TypeScript
pnpm run start    # Mode production
pnpm run seed     # Générer données de test
pnpm run db:start # Lancer MySQL via Docker
```

### Structure CSP

```
src/
├── middlewares/csp.ts        # Configuration CSP + nonces
├── modules/admin/            # Interface admin CSP
│   ├── admin.router.ts       # Routes /csp-report, /admin/*
│   ├── admin.service.ts      # Logique BDD
│   └── schemas.ts           # Validation Zod
└── modules/products/         # Stats publiques
    └── products.router.ts    # Route /stats (sans CSP)
```

### Variables d'environnement requises

| Variable       | Description        | Exemple                 |
| -------------- | ------------------ | ----------------------- |
| `JWT_SECRET`   | Clé secrète JWT    | `your-256-bit-secret`   |
| `FRONTEND_URL` | URL du frontend    | `http://localhost:3000` |
| `DB_PASSWORD`  | Mot de passe MySQL | `mysecretpassword`      |

## 🛠️ Dépannage

| Problème                  | Solution                    |
| ------------------------- | --------------------------- |
| `Unauthorized` admin      | Vérifier JWT + CSRF cookies |
| `{"product": null}` stats | Lancer `pnpm run seed`      |
| En-têtes CSP absents      | Vérifier ordre middlewares  |
| Violations non stockées   | Vérifier connexion MySQL    |

### Logs de débogage

```sh
export LOG_LEVEL=debug
pnpm run dev
# ou
tail -f app.log | grep "CSP"
```

## 📋 Checklist de validation

- [ ] `./test-csp.sh` : tous les tests passent
- [ ] `test-csp.html` : violations générées et stockées
- [ ] CSP Evaluator : note A/A-
- [ ] Admin protégé par auth
- [ ] Stats publiques accessibles
- [ ] CORS restreint fonctionnel

## 📡 URLs importantes

- **Statistiques** : http://localhost:5000/products/stats
- **Admin CSP** : http://localhost:5000/admin/csp-reports
- **Validation** : https://csp-evaluator.withgoogle.com

---

**🛡️ Conforme OWASP | Cahier des charges respecté**
