import { getCSPReports, getCSPStats, getPublicStats } from "@/api/csp";
import type { Page } from "@/types";

export default {
  html: `
    <div class="container mt-4">
      <h2>Statistiques CSP</h2>
      
      <!-- Stats publiques -->
      <div class="card mb-4">
        <div class="card-header">
          <h4>Statistiques Publiques (Produits par Catégorie)</h4>
        </div>
        <div class="card-body">
          <div id="publicStatsContainer">
            <p>Chargement...</p>
          </div>
        </div>
      </div>

      <!-- Stats CSP Admin -->
      <div class="card mb-4">
        <div class="card-header">
          <h4>Rapports CSP (Admin)</h4>
          <small class="text-muted">Nécessite une authentification</small>
        </div>
        <div class="card-body">
          <div id="cspStatsContainer">
            <p>Chargement...</p>
          </div>
        </div>
      </div>

      <!-- Derniers rapports CSP -->
      <div class="card mb-4">
        <div class="card-header">
          <h4>Dernières Violations CSP</h4>
        </div>
        <div class="card-body">
          <div id="cspReportsContainer">
            <p>Chargement...</p>
          </div>
        </div>
      </div>

      <div class="d-flex gap-2">
        <button type="button" class="btn btn-secondary" onclick="history.back()">Retour</button>
        <a href="/csp-test" class="btn btn-warning">Tester CSP</a>
      </div>
    </div>
  `,
  onLoad: async function () {
    await loadPublicStats();
    await loadCSPStats();
    await loadCSPReports();
  },
} satisfies Page;

async function loadPublicStats() {
  const container = document.getElementById("publicStatsContainer");
  if (!container) return;

  try {
    const stats = await getPublicStats();
    
    if (stats.length === 0) {
      container.innerHTML = `<p class="text-muted">Aucune donnée disponible</p>`;
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Catégorie</th>
              <th>Nombre de Produits</th>
            </tr>
          </thead>
          <tbody>
            ${stats.map(stat => `
              <tr>
                <td>${stat.nom}</td>
                <td><span class="badge bg-primary">${stat.compte}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<p class="text-danger">Erreur chargement stats publiques</p>`;
  }
}

async function loadCSPStats() {
  const container = document.getElementById("cspStatsContainer");
  if (!container) return;

  try {
    const stats = await getCSPStats();
    console.log("Stats CSP reçues:", stats); // Debug
    
    container.innerHTML = `
      <div class="row">
        <div class="col-md-3">
          <div class="text-center">
            <h3 class="text-primary">${stats.total}</h3>
            <p class="text-muted">Total</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="text-center">
            <h3 class="text-warning">${stats.today}</h3>
            <p class="text-muted">Aujourd'hui</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="text-center">
            <h3 class="text-info">${stats.thisWeek}</h3>
            <p class="text-muted">Cette semaine</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="text-center">
            <h3 class="text-success">${Object.keys(stats.byDirective).length}</h3>
            <p class="text-muted">Directives</p>
          </div>
        </div>
      </div>
      
      ${Object.keys(stats.byDirective).length > 0 ? `
        <h5 class="mt-4">Violations par Directive</h5>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Directive</th>
                <th>Violations</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(stats.byDirective).map(([directive, count]) => `
                <tr>
                  <td><code>${directive}</code></td>
                  <td><span class="badge bg-danger">${count}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
    `;
  } catch (error) {
    container.innerHTML = `<p class="text-danger">Accès restreint - Connectez-vous en tant qu'admin</p>`;
  }
}

async function loadCSPReports() {
  const container = document.getElementById("cspReportsContainer");
  if (!container) return;

  try {
    const { reports } = await getCSPReports(1, 10);
    
    if (reports.length === 0) {
      container.innerHTML = `<p class="text-muted">Aucune violation enregistrée</p>`;
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Heure</th>
              <th>Directive</th>
              <th>URI Bloquée</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            ${reports.slice(0, 10).map(report => `
              <tr>
                <td><small>${new Date(report.timestamp).toLocaleString()}</small></td>
                <td><code class="text-danger">${report.violation.directive || 'N/A'}</code></td>
                <td><small class="text-truncate" style="max-width: 200px;">${report.violation.blockedUri || 'N/A'}</small></td>
                <td><small>${report.ipAddress || 'N/A'}</small></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<p class="text-danger">Accès restreint - Connectez-vous en tant qu'admin</p>`;
  }
} 