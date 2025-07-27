import { sendCSPReport } from "@/api/csp";
import { showSuccessToast, showErrorToast } from "@/toast";
import type { Page } from "@/types";

export default {
  html: `
    <div class="container mt-4">
      <h2>Tests CSP</h2>
      <p class="lead">Cette page génère intentionnellement des violations CSP pour tester le système de reporting.</p>
      
      <div class="alert alert-warning">
        <strong>Attention :</strong> Cette page va déclencher des violations CSP. 
        Ouvrez la console développeur pour voir les erreurs.
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h4>Tests Automatiques</h4>
            </div>
            <div class="card-body">
              <p>Ces éléments vont automatiquement violer la CSP :</p>
              <ul>
                <li>Script inline sans nonce</li>
                <li>Image externe non autorisée</li>
                <li>Style inline dangereux</li>
                <li>Iframe externe</li>
              </ul>
              
              <!-- VIOLATIONS AUTOMATIQUES -->
              <div id="violations-container">
                <!-- Image externe (VIOLATION) -->
                <img src="https://example.com/test.jpg" alt="Test" style="display: none;" />
                
                <!-- Style inline avec URL externe (VIOLATION) -->
                <div style="background: url('https://malicious-site.com/bg.jpg'); display: none;">Test</div>
                
                <!-- Iframe externe (VIOLATION) -->
                <iframe src="https://example.com" style="display: none;"></iframe>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h4>Tests Manuels</h4>
            </div>
            <div class="card-body">
              <button id="test-inline-script" class="btn btn-danger mb-2 w-100">
                Exécuter Script Inline
              </button>
              
              <button id="test-external-script" class="btn btn-danger mb-2 w-100">
                Charger Script Externe
              </button>
              
              <button id="test-send-report" class="btn btn-warning mb-2 w-100">
                Envoyer Rapport Test
              </button>
              
              <button id="test-eval" class="btn btn-danger mb-2 w-100">
                Tester eval() (dangereux)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card mt-4">
        <div class="card-header">
          <h4>Résultats des Tests</h4>
        </div>
        <div class="card-body">
          <div id="test-results">
            <p class="text-muted">Cliquez sur les boutons ci-dessus pour tester...</p>
          </div>
        </div>
      </div>

      <div class="d-flex gap-2 mt-4">
        <button type="button" class="btn btn-secondary" onclick="history.back()">Retour</button>
        <a href="/csp-stats" class="btn btn-primary">Voir Stats</a>
      </div>
    </div>
  `,
  onLoad: async function () {
    setupTestButtons();
    runAutomaticTests();
  },
} satisfies Page;

function addTestResult(message: string, type: 'success' | 'danger' | 'warning' = 'warning') {
  const container = document.getElementById("test-results");
  if (!container) return;
  
  const timestamp = new Date().toLocaleTimeString();
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
    <small class="text-muted">${timestamp}</small><br>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  container.appendChild(alertDiv);
}

function setupTestButtons() {
  // Test script inline
  document.getElementById("test-inline-script")?.addEventListener("click", () => {
    try {
      // Ceci va violer CSP car script inline sans nonce
      const script = document.createElement("script");
      script.textContent = "console.log('Script inline exécuté - VIOLATION CSP');";
      document.head.appendChild(script);
      addTestResult("Script inline ajouté (devrait être bloqué par CSP)", "warning");
    } catch (e) {
      addTestResult(`Erreur script inline: ${e}`, "danger");
    }
  });

  // Test script externe
  document.getElementById("test-external-script")?.addEventListener("click", () => {
    try {
      const script = document.createElement("script");
      script.src = "https://malicious-site.com/evil.js";
      script.onerror = () => addTestResult("Script externe bloqué par CSP", "success");
      script.onload = () => addTestResult("Script externe chargé (CSP défaillante)", "danger");
      document.head.appendChild(script);
      addTestResult("Tentative de chargement script externe...", "warning");
    } catch (e) {
      addTestResult(`Erreur script externe: ${e}`, "danger");
    }
  });

  // Test envoi rapport manuel
  document.getElementById("test-send-report")?.addEventListener("click", async () => {
    try {
      const success = await sendCSPReport({
        "csp-report": {
          "violated-directive": "script-src-elem",
          "blocked-uri": "https://test-frontend.com/manual-test.js",
          "document-uri": window.location.href,
          "source-file": window.location.href,
          "line-number": 42
        }
      });
      
      if (success) {
        addTestResult("Rapport CSP envoyé avec succès", "success");
        showSuccessToast("Rapport CSP envoyé");
      } else {
        addTestResult("Échec envoi rapport CSP", "danger");
        showErrorToast("Erreur envoi rapport");
      }
    } catch (e) {
      addTestResult(`Erreur envoi rapport: ${e}`, "danger");
    }
  });

  // Test eval (très dangereux)
  document.getElementById("test-eval")?.addEventListener("click", () => {
    try {
      // eval() est bloqué par CSP strict
      eval("console.log('eval() exécuté - VIOLATION CSP MAJEURE');");
      addTestResult("eval() exécuté (CSP défaillante !)", "danger");
    } catch (e) {
      addTestResult("eval() bloqué par CSP", "success");
    }
  });
}

function runAutomaticTests() {
  addTestResult("Tests automatiques lancés...", "warning");
  
  // Test de chargement d'éléments externes
  setTimeout(() => {
    addTestResult("Image externe tentée (voir console)", "warning");
    addTestResult("Iframe externe tentée (voir console)", "warning");
    addTestResult("Style avec URL externe tenté (voir console)", "warning");
  }, 1000);
} 