#!/bin/bash

echo "🧪 Test des endpoints CSP"
echo "=========================="

# Variables
BASE_URL="http://localhost:5000"
ADMIN_TOKEN=""

echo ""
echo "1️⃣ Test des statistiques publiques (accessible à toutes les IP)"
echo "GET $BASE_URL/products/stats"
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/products/stats" | jq '.' || echo "Response reçue"

echo ""
echo "2️⃣ Test d'envoi d'un rapport CSP"
echo "POST $BASE_URL/csp-report"
curl -s -w "\nStatus: %{http_code}\n" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "csp-report": {
      "violated-directive": "script-src-elem",
      "blocked-uri": "https://malicious-site.com/evil.js",
      "document-uri": "http://localhost:3000/test",
      "source-file": "http://localhost:3000/test",
      "line-number": 42
    }
  }' \
  "$BASE_URL/csp-report"

echo ""
echo "3️⃣ Test de l'interface admin CSP (nécessite authentification)"
echo "GET $BASE_URL/admin/csp-reports"
if [ -z "$ADMIN_TOKEN" ]; then
  echo "⚠️ Token admin non fourni - test avec token vide"
  curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/admin/csp-reports"
else
  curl -s -w "\nStatus: %{http_code}\n" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    "$BASE_URL/admin/csp-reports" | jq '.' || echo "Response reçue"
fi

echo ""
echo "4️⃣ Test des statistiques CSP admin"
echo "GET $BASE_URL/admin/csp-stats"
if [ -z "$ADMIN_TOKEN" ]; then
  echo "⚠️ Token admin non fourni - test avec token vide"
  curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/admin/csp-stats"
else
  curl -s -w "\nStatus: %{http_code}\n" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    "$BASE_URL/admin/csp-stats" | jq '.' || echo "Response reçue"
fi

echo ""
echo "5️⃣ Test de validation CSP avec csp-evaluator"
echo "Rendez-vous sur: https://csp-evaluator.withgoogle.com/"
echo "Testez l'URL: $BASE_URL"

echo ""
echo "6️⃣ Test des en-têtes CSP"
echo "Vérification des en-têtes de sécurité:"
curl -I -s "$BASE_URL/auth/login" | grep -i "content-security-policy\|strict-transport-security"

echo ""
echo "✅ Tests terminés !"
echo ""
echo "📝 Étapes suivantes :"
echo "1. Vérifiez que les rapports CSP sont stockés en base"
echo "2. Testez avec la page test-csp.html pour générer des violations"
echo "3. Validez sur csp-evaluator.withgoogle.com"
echo "4. Connectez-vous pour voir les rapports admin" 