const rawProjectData = [
  { no: 1, name: "Core System SCAN", start: "Jan", end: "Nov", actualStart: "Jan", actualEnd: "Nov", status: "Planned / In Progress" },
  { no: 2, name: "Asset Monitoring", start: "Aug", end: "Nov", actualStart: "Aug", actualEnd: "Nov", status: "Planned / In Progress" },
  { no: 3, name: "Stock Opname", start: "Feb", end: "May", actualStart: "Feb", actualEnd: "May", status: "Done" },
  { no: 4, name: "SCANINA", start: "Feb", end: "Aug", actualStart: "Feb", actualEnd: "Aug", status: "Planned / In Progress" },
  { no: 5, name: "Personal Data Protection Management", start: "Jan", end: "Jun", actualStart: "Jan", actualEnd: "Jun", status: "Done" },
  { no: 6, name: "Regulatory Compliance Monitoring Dashboard", start: "Jun", end: "Sep", actualStart: "Jun", actualEnd: "Sep", status: "Planned / In Progress" },
  { no: 7, name: "Financing Agreement", start: "Jan", end: "Sep", actualStart: "Jan", actualEnd: "Sep", status: "Planned / In Progress" },
  { no: 8, name: "Legal Document Request", start: "Sep", end: "Dec", actualStart: "Sep", actualEnd: "Dec", status: "Planned / In Progress" },
  { no: 9, name: "Achievement Report System", start: "Aug", end: "Nov", actualStart: "Aug", actualEnd: "Nov", status: "Planned / In Progress" },
  { no: 10, name: "Audit Management System (AMS)", start: "Jul", end: "Nov", actualStart: "Jul", actualEnd: "Nov", status: "Planned / In Progress" },
  { no: 11, name: "Whistle Blowing System (SWARA)", start: "Feb", end: "Jun", actualStart: "Feb", actualEnd: "Jun", status: "Done" },
  { no: 12, name: "Document Management", start: "Sep", end: "Dec", actualStart: "Sep", actualEnd: "Dec", status: "Planned / In Progress" },
  { no: 13, name: "Fix Asset Management", start: "Jul", end: "Oct", actualStart: "Jul", actualEnd: "Oct", status: "Planned / In Progress" },
  { no: 14, name: "People Development Management", start: "Apr", end: "Dec", actualStart: "Apr", actualEnd: "Dec", status: "Planned / In Progress" },
  { no: 15, name: "Adaptive Scenario Planning (ASAP)", start: "Jan", end: "Dec", actualStart: "Jan", actualEnd: "Dec", status: "Planned / In Progress" },
  { no: 16, name: "Financial Information System (FAST)", start: "Jan", end: "Nov", actualStart: "Jan", actualEnd: "Nov", status: "Planned / In Progress" },
  { no: 17, name: "Asset and Liability Management", start: "Apr", end: "Aug", actualStart: "Apr", actualEnd: "Aug", status: "Planned / In Progress" },
  { no: 18, name: "Treasury Management System", start: "May", end: "Oct", actualStart: "May", actualEnd: "Oct", status: "Planned / In Progress" },
  { no: 19, name: "Joint Finance", start: "Jan", end: "Jun", actualStart: "Jan", actualEnd: "Jun", status: "Done" },
  { no: 20, name: "Petty Cash Management", start: "Apr", end: "Jun", actualStart: "Apr", actualEnd: "Jun", status: "Done" },
  { no: 21, name: "Permohonan Pembayaran", start: "Mar", end: "Jun", actualStart: "Mar", actualEnd: "Jun", status: "Done" },
  { no: 22, name: "Advance Monitoring System", start: "Sep", end: "Dec", actualStart: "Sep", actualEnd: "Dec", status: "Planned / In Progress" },
  { no: 23, name: "PDC & Autodebit Management", start: "Jan", end: "Apr", actualStart: "Jan", actualEnd: "Apr", status: "Done" },
  { no: 24, name: "Budgeting", start: "Oct", end: "Dec", actualStart: "Oct", actualEnd: "Dec", status: "Planned / In Progress" },
  { no: 25, name: "Plafond Management", start: "Jan", end: "Jun", actualStart: "Jan", actualEnd: "Jun", status: "Done" },
  { no: 26, name: "Financial Statement by OCR", start: "Jun", end: "Jun", actualStart: "Jun", actualEnd: "Jun", status: "Done" },
  { no: 27, name: "OSR/CAR Mobile Rejuvenate", start: "Jun", end: "Nov", actualStart: "Jun", actualEnd: "Nov", status: "Planned / In Progress" },
  { no: 28, name: "SIVA", start: "Jan", end: "Jun", actualStart: "Jan", actualEnd: "Jun", status: "Done" },
  { no: 29, name: "Workflow Automation", start: "Feb", end: "Aug", actualStart: "Feb", actualEnd: "Aug", status: "Planned / In Progress" },
  { no: 30, name: "Cyber Security", start: "Jan", end: "Dec", actualStart: "Jan", actualEnd: "Dec", status: "Planned / In Progress" },
  { no: 31, name: "IT Research & Development", start: "Feb", end: "Nov", actualStart: "Feb", actualEnd: "Nov", status: "Planned / In Progress" },
  { no: 32, name: "Project & Innovation Management", start: "Feb", end: "Sep", actualStart: "Feb", actualEnd: "Sep", status: "Planned / In Progress" },
  { no: 33, name: "SISCA Architecture", start: "Feb", end: "Jun", actualStart: "Feb", actualEnd: "Jun", status: "Done" },
  { no: 34, name: "IT Blue Print", start: "Feb", end: "Nov", actualStart: "Feb", actualEnd: "Nov", status: "Planned / In Progress" },
  { no: 35, name: "Personal Data Protection Management (Phase 2)", start: "Jun", end: "Sep", actualStart: "Jun", actualEnd: "Sep", status: "Planned / In Progress" },
  { no: 36, name: "Credit Scoring", start: "Jan", end: "Aug", actualStart: "Jan", actualEnd: "Aug", status: "Planned / In Progress" },
  { no: 37, name: "Busines Process Management", start: "Jan", end: "Nov", actualStart: "Jan", actualEnd: "Nov", status: "Planned / In Progress" },
  { no: 38, name: "Pokayoke System", start: "Feb", end: "Aug", actualStart: "Feb", actualEnd: "Aug", status: "Planned / In Progress" },
  { no: 39, name: "Datawarehouse", start: "Jan", end: "Nov", actualStart: "Jan", actualEnd: "Nov", status: "Planned / In Progress" },
  { no: 40, name: "Risk Based Pricing", start: "Apr", end: "Jul", actualStart: "Apr", actualEnd: "Jul", status: "Planned / In Progress" },
  { no: 41, name: "Risk Register", start: "Jun", end: "Oct", actualStart: "Jun", actualEnd: "Oct", status: "Planned / In Progress" },
  { no: 42, name: "Mobile Memo Approval", start: "Jul", end: "Aug", actualStart: "Jul", actualEnd: "Aug", status: "Planned / In Progress" },
  { no: 43, name: "SLIK", start: "Jan", end: "May", actualStart: "Jan", actualEnd: "May", status: "Done" },
  { no: 44, name: "Early Warning System", start: "Jul", end: "Oct", actualStart: "Jul", actualEnd: "Oct", status: "Planned / In Progress" },
  { no: 45, name: "Customer Grading", start: "May", end: "Sep", actualStart: "May", actualEnd: "Sep", status: "Planned / In Progress" },
  { no: 46, name: "Master Data & Reporting", start: "Sep", end: "Dec", actualStart: "Sep", actualEnd: "Dec", status: "Planned / In Progress" },
  { no: 47, name: "Dashboard", start: "Feb", end: "Nov", actualStart: "Feb", actualEnd: "Nov", status: "Planned / In Progress" },
  { no: 48, name: "GRANITE", start: "Feb", end: "Dec", actualStart: "Feb", actualEnd: "Dec", status: "Planned / In Progress" },
  { no: 49, name: "SANFind", start: "Jan", end: "Jun", actualStart: "Jan", actualEnd: "Jun", status: "Done" },
  { no: 50, name: "Joint Finance - AMV", start: "Jan", end: "May", actualStart: "Jan", actualEnd: "May", status: "Done" },
  { no: 51, name: "Productive Financing", start: "Jan", end: "Nov", actualStart: "Jan", actualEnd: "Nov", status: "Planned / In Progress" },
  { no: 52, name: "Document Management Service", start: "Feb", end: "Jul", actualStart: "Feb", actualEnd: "Jul", status: "Planned / In Progress" },
  { no: 53, name: "Amandemen System", start: "May", end: "Aug", actualStart: "May", actualEnd: "Aug", status: "Planned / In Progress" },
  { no: 54, name: "Insurance", start: "Sep", end: "Dec", actualStart: "Sep", actualEnd: "Dec", status: "Planned / In Progress" },
  { no: 55, name: "Mobile Approval Service", start: "Sep", end: "Dec", actualStart: "Sep", actualEnd: "Dec", status: "Planned / In Progress" },
  { no: 56, name: "Service Enhancement", start: "Oct", end: "Dec", actualStart: "Oct", actualEnd: "Dec", status: "Planned / In Progress" },
  { no: 57, name: "SPH", start: "Jan", end: "Jun", actualStart: "Jan", actualEnd: "Jun", status: "Done" },
  { no: 58, name: "Contract Restructure", start: "Feb", end: "Jun", actualStart: "Feb", actualEnd: "Jun", status: "Planned / In Progress" },
  { no: 59, name: "One Step AR", start: "Sep", end: "Dec", actualStart: "Sep", actualEnd: "Dec", status: "Planned / In Progress" },
  { no: 60, name: "Auto Posting", start: "Feb", end: "Jun", actualStart: "Feb", actualEnd: "Jun", status: "Done" }
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Helper function to calculate SDLC stages distribution across project active target months
// Distribution targets: Gathering (10%), Functional (30%), Development (50%), UAT (10%)
function getSdlcDistribution(startMonth, endMonth) {
  const sIdx = MONTHS.indexOf(startMonth.trim());
  const eIdx = MONTHS.indexOf(endMonth.trim());
  
  if (sIdx === -1 || eIdx === -1 || eIdx < sIdx) {
    return { gathering: [], functional: [], dev: [], uat: [] };
  }

  const projectMonths = [];
  for (let i = sIdx; i <= eIdx; i++) {
    projectMonths.push(i);
  }

  const total = projectMonths.length;
  const result = {
    gathering: [],
    functional: [],
    dev: [],
    uat: []
  };

  if (total === 1) {
    // Single month project: all stages fall in this month
    const m = projectMonths[0];
    result.gathering.push(m);
    result.functional.push(m);
    result.dev.push(m);
    result.uat.push(m);
    return result;
  }

  projectMonths.forEach((mIdx, pos) => {
    // Calculate normalized position center (0.0 to 1.0)
    const ratio = (pos + 0.5) / total;
    if (ratio <= 0.15) {
      result.gathering.push(mIdx);
    } else if (ratio <= 0.40) {
      result.functional.push(mIdx);
    } else if (ratio <= 0.90) {
      result.dev.push(mIdx);
    } else {
      result.uat.push(mIdx);
    }
  });

  // Guarantee at least 1 month in each phase if span allows, or fallback smoothly
  if (result.gathering.length === 0) result.gathering.push(projectMonths[0]);
  if (result.uat.length === 0) result.uat.push(projectMonths[total - 1]);
  if (result.functional.length === 0 && total >= 3) {
    result.functional.push(projectMonths[1]);
  }
  if (result.dev.length === 0) {
    const mid = Math.floor(total / 2);
    result.dev.push(projectMonths[mid]);
  }

  return result;
}
