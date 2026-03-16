const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const BASE_DIR = path.join(ROOT, 'ops', 'funding', 'nlnet');
const GENERATED_DIR = path.join(BASE_DIR, 'generated');
const PROJECT_PATH = path.join(BASE_DIR, 'project.json');
const APPLICANT_PATH = path.join(BASE_DIR, 'applicant.local.json');

const REQUIRED_APPLICANT_FIELDS = [
  ['applicant.legalName', 'Applicant legal name'],
  ['applicant.publicName', 'Applicant public name'],
  ['applicant.email', 'Applicant email'],
  ['applicant.city', 'Applicant city'],
  ['applicant.country', 'Applicant country'],
  ['applicant.entityType', 'Applicant entity type'],
  ['submission.requestedAmountEUR', 'Requested amount (EUR)'],
  ['submission.durationMonths', 'Project duration (months)']
];

function ensureGeneratedDir() {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfExists(filePath) {
  return fs.existsSync(filePath) ? readJson(filePath) : {};
}

function getValue(target, dottedPath) {
  return dottedPath.split('.').reduce((value, key) => value?.[key], target);
}

function buildMissingFields(packet) {
  return REQUIRED_APPLICANT_FIELDS.filter(([field]) => !getValue(packet, field)).map(
    ([field, label]) => ({ field, label })
  );
}

function buildNarrative(project) {
  const milestoneList = project.milestones
    .map(item => `- ${item.name} (${item.months})`)
    .join('\n');
  return [
    `# ${project.project.title}`,
    '',
    '## Summary',
    project.project.summary,
    '',
    '## Problem',
    project.project.problem,
    '',
    '## Proposed Work',
    project.project.solution,
    '',
    '## Why This Fits NLnet',
    project.project.fit,
    '',
    '## Deliverables',
    ...project.deliverables.map(item => `- ${item}`),
    '',
    '## Milestones',
    milestoneList,
    '',
    '## Sustainability',
    `- Distribution: ${project.sustainability.distribution}`,
    `- Maintenance: ${project.sustainability.maintenance}`,
    `- Post-grant: ${project.sustainability.postGrant}`
  ].join('\n');
}

function buildMilestonesBudget(project) {
  const milestoneRows = project.milestones
    .map(
      item =>
        `| ${item.name} | ${item.months} | EUR ${item.budgetEUR} | ${item.outcomes.join('; ')} |`
    )
    .join('\n');
  const budgetRows = project.budget
    .map(item => `| ${item.label} | EUR ${item.amountEUR} | ${item.rationale} |`)
    .join('\n');
  return [
    '# Milestones and Budget',
    '',
    '## Milestones',
    '',
    '| Milestone | Months | Budget | Outcomes |',
    '| --- | --- | --- | --- |',
    milestoneRows,
    '',
    '## Budget',
    '',
    '| Budget line | Amount | Rationale |',
    '| --- | --- | --- |',
    budgetRows
  ].join('\n');
}

function buildFormFields(project, applicant, missingFields) {
  const missing = new Set(missingFields.map(item => item.field));
  return {
    project_title: { value: project.project.title, source: 'project.json', sensitivity: 'public' },
    project_summary: {
      value: project.project.summary,
      source: 'project.json',
      sensitivity: 'public'
    },
    project_problem: {
      value: project.project.problem,
      source: 'project.json',
      sensitivity: 'public'
    },
    project_solution: {
      value: project.project.solution,
      source: 'project.json',
      sensitivity: 'public'
    },
    project_fit: { value: project.project.fit, source: 'project.json', sensitivity: 'public' },
    project_duration_months: {
      value: applicant.submission?.durationMonths ?? project.project.durationMonths,
      source: applicant.submission?.durationMonths ? 'applicant.local.json' : 'project.json',
      sensitivity: 'public'
    },
    requested_amount_eur: {
      value: applicant.submission?.requestedAmountEUR ?? project.project.requestedAmountEUR,
      source: applicant.submission?.requestedAmountEUR ? 'applicant.local.json' : 'project.json',
      sensitivity: 'public'
    },
    applicant_legal_name: {
      status: missing.has('applicant.legalName') ? 'missing' : 'provided',
      source: 'applicant.local.json',
      sensitivity: 'private'
    },
    applicant_public_name: {
      status: missing.has('applicant.publicName') ? 'missing' : 'provided',
      source: 'applicant.local.json',
      sensitivity: 'private'
    },
    applicant_email: {
      status: missing.has('applicant.email') ? 'missing' : 'provided',
      source: 'applicant.local.json',
      sensitivity: 'private'
    },
    applicant_city: {
      status: missing.has('applicant.city') ? 'missing' : 'provided',
      source: 'applicant.local.json',
      sensitivity: 'private'
    },
    applicant_country: {
      status: missing.has('applicant.country') ? 'missing' : 'provided',
      source: 'applicant.local.json',
      sensitivity: 'private'
    },
    applicant_entity_type: {
      status: missing.has('applicant.entityType') ? 'missing' : 'provided',
      source: 'applicant.local.json',
      sensitivity: 'private'
    }
  };
}

function buildMissingFieldsReport(missingFields) {
  if (missingFields.length === 0) {
    return '# Missing Fields\n\nAll required applicant fields are present.\n';
  }
  return [
    '# Missing Fields',
    '',
    'The following values still need to be added to `ops/funding/nlnet/applicant.local.json`:',
    '',
    ...missingFields.map(item => `- ${item.label} (\`${item.field}\`)`)
  ].join('\n');
}

function loadPacket() {
  const project = readJson(PROJECT_PATH);
  const applicant = readJsonIfExists(APPLICANT_PATH);
  return { project, applicant, packet: { ...project, ...applicant } };
}

module.exports = {
  APPLICANT_PATH,
  BASE_DIR,
  GENERATED_DIR,
  PROJECT_PATH,
  ROOT,
  buildFormFields,
  buildMilestonesBudget,
  buildMissingFields,
  buildMissingFieldsReport,
  buildNarrative,
  ensureGeneratedDir,
  loadPacket
};
