// Application Logic for Digitalization Dashboard & Gantt Timeline

let expandedProjects = new Set(); // Stores project numbers that are expanded
let statusChartInstance = null;
let timelineChartInstance = null;
let quarterChartInstance = null;
let sdlcChartInstance = null;
let scurveChartInstance = null;
let currentFilterStatus = 'all';
let currentSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  // All SDLC rows hidden by default until user clicks dropdown
  expandedProjects.clear();

  initTheme();
  renderKPIs();
  renderCharts();
  renderGantt();
  setupEventListeners();
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
  renderCharts(); // Re-render charts for color contrast
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.innerHTML = theme === 'light' 
      ? '<i class="ri-moon-line"></i> Dark Mode' 
      : '<i class="ri-sun-line"></i> Light Mode';
  }
}

// KPI Calculations
function renderKPIs() {
  const total = rawProjectData.length;
  const doneCount = rawProjectData.filter(p => p.status === 'Done').length;
  const progressCount = total - doneCount;
  const rate = Math.round((doneCount / total) * 100);

  document.getElementById('kpi-total').textContent = total;
  document.getElementById('kpi-done').textContent = doneCount;
  document.getElementById('kpi-progress').textContent = progressCount;
  document.getElementById('kpi-rate').textContent = `${rate}%`;
}

// Charts Initialization
function renderCharts() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const textColor = isLight ? '#0f172a' : '#f8fafc';
  const gridColor = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)';

  // 1. Status Donut Chart
  const doneCount = rawProjectData.filter(p => p.status === 'Done').length;
  const progressCount = rawProjectData.length - doneCount;

  const ctxStatus = document.getElementById('statusChart').getContext('2d');
  if (statusChartInstance) statusChartInstance.destroy();

  statusChartInstance = new Chart(ctxStatus, {
    type: 'doughnut',
    data: {
      labels: ['Done', 'Planned / In Progress'],
      datasets: [{
        data: [doneCount, progressCount],
        backgroundColor: ['#10b981', '#eab308'],
        borderWidth: 2,
        borderColor: isLight ? '#ffffff' : '#1e293b'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 12 } }
        }
      },
      cutout: '70%'
    }
  });

  // 2. Monthly Timeline Active Projects Bar Chart
  const monthCounts = MONTHS.map(m => {
    return rawProjectData.filter(p => {
      const sIdx = MONTHS.indexOf(p.start);
      const eIdx = MONTHS.indexOf(p.end);
      const mIdx = MONTHS.indexOf(m);
      return mIdx >= sIdx && mIdx <= eIdx;
    }).length;
  });

  const ctxTimeline = document.getElementById('timelineChart').getContext('2d');
  if (timelineChartInstance) timelineChartInstance.destroy();

  timelineChartInstance = new Chart(ctxTimeline, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [{
        label: 'Active Projects',
        data: monthCounts,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: '#3b82f6',
        borderWidth: 1.5,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } },
          grid: { color: gridColor }
        },
        y: {
          ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } },
          grid: { color: gridColor }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });

  // 3. Quarterly Progress Chart (Q1, Q2, Q3, Q4 Target vs Completed)
  const quarters = ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'];
  const qTarget = [0, 0, 0, 0];
  const qDone = [0, 0, 0, 0];

  rawProjectData.forEach(p => {
    const endIdx = MONTHS.indexOf(p.end);
    let qIdx = 0;
    if (endIdx >= 3 && endIdx <= 5) qIdx = 1;
    else if (endIdx >= 6 && endIdx <= 8) qIdx = 2;
    else if (endIdx >= 9) qIdx = 3;

    qTarget[qIdx]++;
    if (p.status === 'Done') qDone[qIdx]++;
  });

  const ctxQuarter = document.getElementById('quarterChart').getContext('2d');
  if (quarterChartInstance) quarterChartInstance.destroy();

  quarterChartInstance = new Chart(ctxQuarter, {
    type: 'bar',
    data: {
      labels: quarters,
      datasets: [
        {
          label: 'Target Target Selesai',
          data: qTarget,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: '#3b82f6',
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: 'Realisasi Done',
          data: qDone,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: '#10b981',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } }, grid: { color: gridColor } },
        y: { ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } }, grid: { color: gridColor } }
      },
      plugins: {
        legend: { labels: { color: textColor, font: { family: 'Plus Jakarta Sans' } } }
      }
    }
  });

  // 4. SDLC Workload Stage Chart
  let gCnt = 0, fCnt = 0, dCnt = 0, uCnt = 0;
  rawProjectData.forEach(p => {
    const sdlc = getSdlcDistribution(p.start, p.end);
    gCnt += sdlc.gathering.length;
    fCnt += sdlc.functional.length;
    dCnt += sdlc.dev.length;
    uCnt += sdlc.uat.length;
  });

  const ctxSdlc = document.getElementById('sdlcChart').getContext('2d');
  if (sdlcChartInstance) sdlcChartInstance.destroy();

  sdlcChartInstance = new Chart(ctxSdlc, {
    type: 'polarArea',
    data: {
      labels: ['Gathering Requirement', 'Functional Design', 'Development', 'UAT'],
      datasets: [{
        data: [gCnt, fCnt, dCnt, uCnt],
        backgroundColor: [
          'rgba(245, 158, 11, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } } }
      },
      scales: {
        r: { ticks: { display: false }, grid: { color: gridColor } }
      }
    }
  });

  // 5. Cumulative S-Curve Chart (Cumulative Target vs Cumulative Done)
  let cTarget = 0;
  const targetCurve = MONTHS.map(m => {
    cTarget += rawProjectData.filter(p => p.end === m).length;
    return cTarget;
  });

  let cDone = 0;
  const doneCurve = MONTHS.map(m => {
    cDone += rawProjectData.filter(p => p.status === 'Done' && p.end === m).length;
    return cDone;
  });

  const ctxScurve = document.getElementById('scurveChart').getContext('2d');
  if (scurveChartInstance) scurveChartInstance.destroy();

  scurveChartInstance = new Chart(ctxScurve, {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [
        {
          label: 'Kumulatif Rencana Target Selesai',
          data: targetCurve,
          borderColor: '#a855f7',
          backgroundColor: 'rgba(168, 85, 247, 0.15)',
          fill: true,
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: 'Kumulatif Realisasi Done',
          data: doneCurve,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.3,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } }, grid: { color: gridColor } },
        y: { ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } }, grid: { color: gridColor } }
      },
      plugins: {
        legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Plus Jakarta Sans' } } }
      }
    }
  });
}

// Render Gantt Table
function renderGantt() {
  const tbody = document.getElementById('gantt-tbody');
  tbody.innerHTML = '';

  const filtered = rawProjectData.filter(p => {
    const matchesStatus = currentFilterStatus === 'all' || 
      (currentFilterStatus === 'Done' && p.status === 'Done') ||
      (currentFilterStatus === 'Progress' && p.status !== 'Done');

    const matchesSearch = p.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
      p.no.toString().includes(currentSearchQuery);

    return matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="16" class="empty-state">
          <i class="ri-folder-unknow-line"></i>
          <p>Tidak ada data digitalisasi yang sesuai dengan filter.</p>
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(p => {
    const isExpanded = expandedProjects.has(p.no);
    const sdlc = getSdlcDistribution(p.start, p.end);

    const sIdxTarget = MONTHS.indexOf(p.start);
    const eIdxTarget = MONTHS.indexOf(p.end);
    const sIdxActual = MONTHS.indexOf(p.actualStart);
    const eIdxActual = MONTHS.indexOf(p.actualEnd);

    const isDone = (p.status === 'Done');
    const statusBadgeClass = isDone ? 'badge-done' : 'badge-progress';
    const statusLabel = isDone ? 'Done' : 'Planned / In Progress';
    
    // Collapsed = 2 rows (Target + Actual), Expanded = 6 rows (+ 4 SDLC sub-rows)
    const rowSpanVal = isExpanded ? 6 : 2;

    // 1. Target Line Row (Always visible)
    const trTarget = document.createElement('tr');
    trTarget.className = 'project-master-row';

    let monthCellsTarget = '';
    MONTHS.forEach((m, idx) => {
      const isTarget = idx >= sIdxTarget && idx <= eIdxTarget;
      monthCellsTarget += `
        <td class="cell-month">
          ${isTarget ? `<div class="bar-cell bar-target" title="${p.name} (Target: ${p.start} - ${p.end})">Target</div>` : ''}
        </td>
      `;
    });

    trTarget.innerHTML = `
      <td class="col-no" rowspan="${rowSpanVal}">
        <strong>${p.no}</strong>
      </td>
      <td class="col-name" rowspan="${rowSpanVal}">
        <button class="toggle-btn ${isExpanded ? 'expanded' : ''}" onclick="toggleExpand(${p.no})" title="${isExpanded ? 'Sembunyikan 4 Baris SDLC' : 'Tampilkan 4 Baris SDLC'}">
          <i class="ri-arrow-right-s-line"></i>
        </button>
        <span class="project-title-clickable" onclick="openProjectModal(${p.no})">${p.name}</span>
      </td>
      <td class="col-stage"><strong>Target Line</strong></td>
      <td class="col-status" rowspan="${rowSpanVal}">
        <span class="badge ${statusBadgeClass}">${statusLabel}</span>
      </td>
      ${monthCellsTarget}
    `;

    tbody.appendChild(trTarget);

    // 2. Actual Line Row (Always visible)
    const trActual = document.createElement('tr');
    trActual.className = 'sdlc-row';
    let monthCellsActual = '';
    MONTHS.forEach((m, idx) => {
      const isActual = idx >= sIdxActual && idx <= eIdxActual;
      monthCellsActual += `
        <td class="cell-month">
          ${isActual ? `<div class="bar-cell bar-actual" title="${p.name} (Actual: ${p.actualStart} - ${p.actualEnd})">Actual</div>` : ''}
        </td>
      `;
    });
    trActual.innerHTML = `
      <td class="col-stage"><strong>Actual Line</strong></td>
      ${monthCellsActual}
    `;
    tbody.appendChild(trActual);

    // 3. The 4 SDLC Sub-Rows (Hidden by default, shown when dropdown is clicked)
    if (isExpanded) {
      const stagesConfig = [
        { label: 'Gathering Requirement', activeIdxs: sdlc.gathering },
        { label: 'Functional Design', activeIdxs: sdlc.functional },
        { label: 'Development', activeIdxs: sdlc.dev },
        { label: 'UAT', activeIdxs: sdlc.uat }
      ];

      stagesConfig.forEach(st => {
        const trStage = document.createElement('tr');
        trStage.className = 'sdlc-row';
        let monthCellsStage = '';
        
        MONTHS.forEach((m, idx) => {
          const isActive = st.activeIdxs.includes(idx);
          monthCellsStage += `
            <td class="cell-month">
              ${isActive ? `<div class="bar-cell bar-sdlc" title="${st.label}"></div>` : ''}
            </td>
          `;
        });

        trStage.innerHTML = `
          <td class="col-stage sdlc-label">${st.label}</td>
          ${monthCellsStage}
        `;
        tbody.appendChild(trStage);
      });
    }
  });
}

// Expand / Collapse Single Project
function toggleExpand(projectNo) {
  if (expandedProjects.has(projectNo)) {
    expandedProjects.delete(projectNo);
  } else {
    expandedProjects.add(projectNo);
  }
  renderGantt();
}

// Expand All / Collapse All
function expandAllProjects() {
  rawProjectData.forEach(p => expandedProjects.add(p.no));
  renderGantt();
}

function collapseAllProjects() {
  expandedProjects.clear();
  renderGantt();
}

// Event Listeners setup
function setupEventListeners() {
  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

  document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearchQuery = e.target.value;
    renderGantt();
  });

  document.getElementById('filterStatus').addEventListener('change', (e) => {
    currentFilterStatus = e.target.value;
    renderGantt();
  });

  document.getElementById('btnExpandAll').addEventListener('click', expandAllProjects);
  document.getElementById('btnCollapseAll').addEventListener('click', collapseAllProjects);
  document.getElementById('btnExportCsv').addEventListener('click', exportToCsv);

  // Page Tab Switching Logic
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const pageId = tab.getAttribute('data-page');
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.page-view').forEach(page => {
        page.classList.remove('active');
      });
      
      const targetPage = document.getElementById(`page-${pageId}`);
      if (targetPage) targetPage.classList.add('active');
    });
  });
}

// Open Project Detail Modal
function openProjectModal(projectNo) {
  const p = rawProjectData.find(item => item.no === projectNo);
  if (!p) return;

  const sdlc = getSdlcDistribution(p.start, p.end);
  const getMonthsStr = (arr) => arr.map(i => MONTHS[i]).join(', ') || '-';

  const modalHtml = `
    <div class="modal-overlay active" id="projectModal">
      <div class="modal-content">
        <button class="modal-close" onclick="closeProjectModal()"><i class="ri-close-line"></i></button>
        <h2>No. ${p.no} - ${p.name}</h2>
        <p style="color: var(--text-muted); margin-top: 4px;">Detail Digitalisasi & Breakdown SDLC Timeline</p>
        
        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <span>Status Timeline</span>
              <strong>${p.status === 'Done' ? 'Done (Selesai)' : 'Planned / In Progress'}</strong>
            </div>
            <div class="detail-item">
              <span>Target Period</span>
              <strong>${p.start} - ${p.end}</strong>
            </div>
            <div class="detail-item">
              <span>Actual Period</span>
              <strong>${p.actualStart} - ${p.actualEnd}</strong>
            </div>
            <div class="detail-item">
              <span>Duration Span</span>
              <strong>${MONTHS.indexOf(p.end) - MONTHS.indexOf(p.start) + 1} Bulan</strong>
            </div>
          </div>

          <h3 style="font-size: 0.95rem; margin-top: 8px;">Breakdown SDLC Sub-Lines:</h3>
          <div class="sdlc-breakdown-list">
            <div class="sdlc-breakdown-item">
              <span><strong>Gathering Requirement</strong></span>
              <span class="badge badge-progress">${getMonthsStr(sdlc.gathering)}</span>
            </div>
            <div class="sdlc-breakdown-item">
              <span><strong>Functional Design</strong></span>
              <span class="badge badge-progress">${getMonthsStr(sdlc.functional)}</span>
            </div>
            <div class="sdlc-breakdown-item">
              <span><strong>Development</strong></span>
              <span class="badge badge-progress">${getMonthsStr(sdlc.dev)}</span>
            </div>
            <div class="sdlc-breakdown-item">
              <span><strong>UAT</strong></span>
              <span class="badge badge-progress">${getMonthsStr(sdlc.uat)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('projectModal');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
}

// Export CSV Functionality
function exportToCsv() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "No,Digitalisasi,Target Start,Target End,Actual Start,Actual End,Status\n";

  rawProjectData.forEach(p => {
    const row = `"${p.no}","${p.name}","${p.start}","${p.end}","${p.actualStart}","${p.actualEnd}","${p.status}"`;
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Digitalization_Project_Dashboard.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
