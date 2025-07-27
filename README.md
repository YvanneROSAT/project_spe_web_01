# Application E-commerce avec Système CSP
**Projet de spécialisation développement web - Semaine 01**

Application e-commerce complète avec authentification, gestion de produits, panier et système de sécurité CSP avancé.

## Équipe
- **Lucien** - Développement Backend & Sécurité
- **Dorian** - Développement Frontend & UX
- **Yvanne** - Architecture & Base de données

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│   Base MySQL    │
│   (Vite + TS)   │     │  (Express + TS) │     │   + Redis       │
│   localhost:5173│     │  localhost:5000 │     │   localhost:3306│
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- **Frontend** : SPA Vanilla TypeScript + Vite + Bootstrap
- **Backend** : Express.js + TypeScript + Drizzle ORM
- **Base de données** : MySQL + Redis (cache)
- **Sécurité** : CSP, CORS, CSRF, JWT, Bcrypt

---

## 🔧 Prérequis

- **Node.js** ≥ 18
- **pnpm** ≥ 8
- **Docker** + **Docker Compose**
- **Git**

```bash
# Vérifier les versions
node --version
pnpm --version
docker --version
```

---

## ⚡ Installation Rapide

### 1. Cloner et installer les dépendances

```bash
git clone <votre-repo>
cd project_spe_web_01

# Installer toutes les dépendances
pnpm install
```

### 2. Configuration de l'environnement

Créer le fichier `backend/.env` :

```bash
cd backend
cat > .env << EOF
# Environnement
NODE_ENV=dev
LOG_LEVEL=debug
PORT=5000
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Authentification (générer des clés sécurisées)
ACCESS_TOKEN_SECRET=your-super-secret-access-key-256-bits
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-256-bits

# Base de données MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mysecretpassword
DB_NAME=project_spe_web

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=myredispassword
EOF
```

Crée aussi un `frontend/.env`

```bash
BACKEND_URL=http://localhost:5000
```

### 3. Démarrer les services

```bash
# Lancer Redis et mysql docker
docker compose up

# Terminal 1 - Base de données (depuis /backend)
cd backend
pnpm run db:start

# Terminal 2 - Backend (depuis /backend)
pnpm run dev

# Terminal 3 - Frontend (depuis /frontend)
cd ../frontend
pnpm run dev
```

### 4. Initialiser la base de données

```bash
# Depuis /backend
# Appliquer le schéma
pnpm run db:push

# Injecter des données de test
pnpm run seed
```

---

## 🌐 URLs d'accès

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Interface utilisateur |
| **Backend API** | http://localhost:5000 | API REST |
| **Stats publiques** | http://localhost:5000/products/stats | Statistiques JSON (accessible à tous) |
| **Admin CSP** | http://localhost:5000/admin/csp-reports | Rapports de sécurité (auth requise) |
| **Base de données** | http://localhost:5000/admin/db-studio | Interface Drizzle Studio |

---

## 🎯 Fonctionnalités

### 👤 En tant que visiteur
- ✅ **Inscription** (`/register`)
- ✅ **Connexion** (`/login`)
- ✅ **Catalogue produits** (`/products`)
- ✅ **Détail produit** (`/product?id=...`)
- ✅ **Recherche** (barre de recherche)
- ✅ **Panier** (`/cart`) - LocalStorage
- ✅ **Statistiques publiques** (JSON accessible)

### 🔐 En tant qu'utilisateur connecté
- ✅ **Dashboard** (`/` après connexion)
- ✅ **Déconnexion**
- ✅ **Ajouter produit** (`/add-product`)
- ✅ **Modifier produit** (`/edit-product`)
- ✅ **Supprimer produit** (API disponible)

### 🛡️ Administration CSP
- ✅ **Rapports violations** (`/admin/csp-reports`)
- ✅ **Statistiques CSP** (`/admin/csp-stats`)
- ✅ **Page de test** (`/csp-test`)

---

## 🔒 Sécurité (Conforme OWASP)

### Content Security Policy (CSP)
```bash
# Tester le CSP
cd backend
chmod +x src/__tests__/test-csp.sh
./src/__tests__/test-csp.sh
```

### Fonctionnalités sécurisées
- **CORS** : Limité au frontend (sauf stats publiques)
- **CSRF** : Protection des formulaires admin
- **JWT** : Authentification avec refresh tokens
- **Bcrypt** : Hashage sécurisé des mots de passe
- **Validation** : Zod pour toutes les entrées
- **Rate limiting** : Protection contre le spam
- **Helmet** : Headers de sécurité HTTP

---

## 🧪 Tests

```bash
# Lancer les tests backend
cd backend
pnpm run test

# Tests de sécurité CSP
pnpm run test:csp

# Linter et formatage
pnpm run lint
pnpm run format:fix
```

---

## 📊 Commandes utiles

### Backend
```bash
cd backend

# Développement
pnpm run dev              # Serveur avec hot-reload
pnpm run build            # Compilation TypeScript
pnpm run start            # Mode production

# Base de données
pnpm run db:start         # Docker MySQL + Redis
pnpm run db:push          # Appliquer schéma Drizzle
pnpm run seed             # Données de test
pnpm run db:studio        # Interface admin BDD

# Qualité code
pnpm run test             # Tests Vitest
pnpm run lint             # ESLint + TypeScript
pnpm run format:fix       # Prettier
```

### Frontend
```bash
cd frontend

# Développement
pnpm run dev              # Vite dev server
pnpm run build            # Build production
pnpm run preview          # Prévisualiser build
```

---

## 🗂️ Structure du projet

```
project_spe_web_01/
├── frontend/                 # Application SPA
│   ├── src/
│   │   ├── pages/           # Pages de l'application
│   │   ├── api/             # Clients API
│   │   ├── auth.ts          # Gestion authentification
│   │   └── main.ts          # Point d'entrée + router
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # API REST
│   ├── src/
│   │   ├── modules/         # Modules métier
│   │   │   ├── auth/        # Authentification
│   │   │   ├── products/    # Gestion produits
│   │   │   ├── admin/       # Interface admin + CSP
│   │   │   └── categories/  # Catégories
│   │   ├── middlewares/     # Middlewares Express
│   │   ├── db/              # Schéma Drizzle
│   │   └── index.ts         # Serveur Express
│   ├── docker-compose.yml   # MySQL + Redis
│   ├── package.json
│   └── vitest.config.ts
│
├── database/                 # Scripts SQL
│   └── database.sql         # Schéma initial
│
└── README.md                # Ce fichier
```

---

## 🚨 Dépannage

### Problèmes courants

**Port déjà utilisé** :
```bash
# Vérifier les ports
netstat -ano | findstr :5000
netstat -ano | findstr :5173
netstat -ano | findstr :3306
```

**Base de données** :
```bash
# Réinitialiser MySQL
docker compose down -v
docker compose up
pnpm run db:push
pnpm run seed
```

**Erreurs CSP** :
```bash
# Voir les logs détaillés
tail -f backend/app.log | grep CSP
```

**Cache frontend** :
```bash
# Vider le cache Vite
rm -rf frontend/node_modules/.vite
```

---

## 📝 Notes techniques

### Base de données
- **MySQL 8.0** avec InnoDB
- **Relations** : Products ↔ Categories ↔ Pictures
- **IDs** : CUID2 pour sécurité
- **Cache** : Redis pour sessions

### API Design
- **REST** : Endpoints standardisés
- **Validation** : Zod schemas
- **Pagination** : Limite 20 items/page
- **Format** : JSON exclusivement

### Frontend Architecture
- **SPA** : Router vanilla sans framework
- **State** : LocalStorage + API calls
- **Styling** : Bootstrap 5 + SCSS
- **Build** : Vite avec optimisations
