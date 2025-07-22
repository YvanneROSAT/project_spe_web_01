# Backend - Projet Spécialisation Web

Ce guide vous explique comment nous avons configuré et comment faire fonctionner le backend de notre projet de spécialisation web.

## Prérequis

- Node.js (version 18 ou plus récente)
- pnpm
- Docker et Docker Compose
- MySQL client (pour se connecter à la base de données)

## Installation

### 1. Installer les dépendances

```sh
pnpm i
```

### 2. Configuration de l'environnement

Créez un fichier `.env` dans le dossier `backend/` avec le contenu suivant :

```env
JWT_SECRET=your-secret-key-here
PORT=5000
DATABASE_URL=mysql://root:mysecretpassword@localhost:3306/project_spe_web
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mysecretpassword
DB_NAME=project_spe_web
```

### 3. Lancer la base de données MySQL

```sh
pnpm run db:start
```

Cette commande lance un container Docker avec MySQL. Attendez quelques secondes que le container démarre complètement.

### 4. Créer le schéma de base de données

Connectez-vous à MySQL :

```sh
mysql -h localhost -u root -p
```

Mot de passe : `mysecretpassword`

Une fois connecté, exécutez le contenu du fichier `../database/database.sql` :

```sql
-- Copier-coller tout le contenu du fichier database/database.sql
DROP DATABASE IF EXISTS project_spe_web;
CREATE DATABASE project_spe_web;
USE project_spe_web;

-- Puis toutes les instructions CREATE TABLE...
```

Ou bien chargez directement le fichier :

```sh
mysql -h localhost -u root -p < ../database/database.sql
```

### 5. Remplir la base de données avec des données factices

Nous utilisons Faker.js pour générer des données de test :

```sh
# Générer 50 produits (par défaut)
pnpm run seed

# Ou spécifier un nombre personnalisé
pnpm run seed 100
```

Le script génère automatiquement :
- 3 catégories : Alimentation, Ameublement, Sport
- Le nombre de produits demandé (répartis aléatoirement dans les catégories)
- 1 à 3 images par produit avec des chemins réalistes

### 6. Vérifier les données

Reconnectez-vous à MySQL et vérifiez le contenu :

```sh
mysql -h localhost -u root -p
```

```sql
USE project_spe_web;

-- Voir toutes les tables
SHOW TABLES;

-- Voir les catégories
SELECT * FROM categories;
