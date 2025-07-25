# 1️⃣ Test statistiques publiques (sans CSP)

```sh
# Test 
curl http://localhost:5000/products/stats

# je vérifie les en-têtes et (doit PAS avoir Content-Security-Policy)
curl -I http://localhost:5000/products/stats
```

## 2️⃣ Test en-têtes CSP stricts

```sh
# je vérifie la présence CSP sur routes protégées
curl -I http://localhost:5000/auth/login

# Autre route protégée
curl -I http://localhost:5000/admin/csp-reports
```

## 3️⃣ Test collecte rapports CSP

```sh
# Envoi rapport CSP valide
curl -X POST http://localhost:5000/csp-report \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 Test Browser" \
  -d '{
    "csp-report": {
      "violated-directive": "script-src-elem",
      "blocked-uri": "https://malicious-site.com/evil.js",
      "document-uri": "http://localhost:3000/test",
      "source-file": "http://localhost:3000/test",
      "line-number": 42
    }
  }'

# Envoi autre violation
curl -X POST http://localhost:5000/csp-report \
  -H "Content-Type: application/json" \
  -H "User-Agent: Chrome/90.0 Test" \
  -d '{
    "csp-report": {
      "violated-directive": "img-src",
      "blocked-uri": "https://evil-images.com/malware.jpg",
      "document-uri": "http://localhost:3000/products",
      "line-number": 15
    }
  }'

# Test données invalides
curl -X POST http://localhost:5000/csp-report \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'
```

## 4️⃣ Vérification base de données

```sh
mysql -h localhost -u root -pmysecretpassword

USE project_spe_web;
SELECT * FROM csp_reports ORDER BY created_at DESC LIMIT 5;
SELECT COUNT(*) as total FROM csp_reports;
```

## 5️⃣ Test interface admin (sans auth)

```sh
# retourne Unauthorized
curl http://localhost:5000/admin/csp-reports

curl http://localhost:5000/admin/csp-stats
```

## 6️⃣ Création compte admin

```sh
# Inscription
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "CSP",
    "email": "admin@test.com",
    "password": "SecurePass123!"
  }'

# Connexion
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "SecurePass123!"
  }'
```

## 7️⃣ Test interface admin (avec auth)

```sh
curl -H "Cookie: token=YOUR_TOKEN; csrf_token=YOUR_CSRF" \
  http://localhost:5000/admin/csp-reports

curl -H "Cookie: token=YOUR_TOKEN; csrf_token=YOUR_CSRF" \
  http://localhost:5000/admin/csp-stats
```

## 8️⃣ Test CORS

```sh
# Depuis localhost:3000 (doit marcher)
curl -H "Origin: http://localhost:3000" \
  http://localhost:5000/products/stats

# Depuis autre domaine (doit échouer)
curl -H "Origin: https://malicious-site.com" \
  http://localhost:5000/auth/login
```

## 9️⃣ Test page HTML violations

```sh
# Servir la page de test
# Ouvrir http://localhost:5000/test-csp.html
# console développeur -> violation BDD
```

## 🔟 Script automatisé

```sh
chmod +x test-csp.sh
./test-csp.sh
```

## 1️⃣1️⃣ Validation externe

```sh
# Aller sur : https://csp-evaluator.withgoogle.com/
# Tester URL : http://localhost:5000
# Note attendue : A ou A-
```

## 1️⃣2️⃣ Tests de stress

```sh
# Envoyer plusieurs rapports rapidement
for i in {1..5}; do
  curl -X POST http://localhost:5000/csp-report \
    -H "Content-Type: application/json" \
    -d "{\"csp-report\":{\"violated-directive\":\"test-$i\",\"document-uri\":\"test\"}}"
done

# Vérifier tous stockés
mysql -h localhost -u root -p -e "USE project_spe_web; SELECT COUNT(*) FROM csp_reports;"
```

## 1️⃣3️⃣ Test nettoyage

```sh
# Vider les rapports de test
mysql -h localhost -u root -p -e "USE project_spe_web; DELETE FROM csp_reports WHERE JSON_EXTRACT(report_data, '$.\"csp-report\".\"violated-directive\"') LIKE 'test-%';"
```

---

**💡 Tip : Lancer chaque section dans l'ordre et noter les résultats !**
