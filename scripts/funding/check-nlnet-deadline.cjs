#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const {
  GENERATED_DIR,
  buildMissingFields,
  ensureGeneratedDir,
  loadPacket
} = require('./nlnet-lib.cjs');

const MONTHS = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11
};

async function fetchDeadline() {
  const response = await fetch('https://nlnet.nl/commonsfund/');
  if (!response.ok) {
    throw new Error(`NLnet commons fund page returned ${response.status}`);
  }
  const html = await response.text();
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const match = text.match(
    /deadline(?: of)?\s+([A-Z][a-z]+)\s+(\d+)\s*(?:st|nd|rd|th)?\s+(\d{4})\s+(\d{1,2}:\d{2})\s+(CEST|CET)/i
  );
  if (!match) {
    throw new Error('Could not find NLnet deadline on the commons fund page.');
  }
  const [, monthName, day, year, time, zone] = match;
  const [hours, minutes] = time.split(':').map(Number);
  const offset = zone === 'CEST' ? '+02:00' : '+01:00';
  const month = MONTHS[monthName.toLowerCase()];
  const date = new Date(
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00${offset}`
  );
  return { iso: date.toISOString(), label: `${monthName} ${day}, ${year} ${time} ${zone}` };
}

function renderCheckReport(status) {
  const missingLines =
    status.missingFields.length === 0
      ? ['- None']
      : status.missingFields.map(item => `- ${item.label} (\`${item.field}\`)`);
  return [
    '# NLnet Funding Status',
    '',
    `- Generated: ${status.generatedAt}`,
    `- Current deadline: ${status.deadline.label}`,
    `- Days remaining: ${status.daysRemaining}`,
    `- Packet ready: ${status.ready ? 'yes' : 'no'}`,
    `- Manual browser handoff required: ${status.manualSubmitRequired ? 'yes' : 'no'}`,
    '',
    '## Missing Applicant Fields',
    '',
    ...missingLines,
    '',
    '## Next Step',
    '',
    status.nextStep
  ].join('\n');
}

async function main() {
  const { packet } = loadPacket();
  const missingFields = buildMissingFields(packet);
  const deadline = await fetchDeadline();
  const now = new Date();
  const deadlineDate = new Date(deadline.iso);
  const daysRemaining = Math.ceil((deadlineDate.getTime() - now.getTime()) / 86400000);
  const ready = missingFields.length === 0 && deadlineDate > now;
  const nextStep = ready
    ? 'Packet is ready for a browser-assisted NLnet submission handoff. Manual submit is still required.'
    : 'Fill the missing applicant data, re-run the packet generator, and then hand off for manual NLnet submission.';
  const status = {
    generatedAt: now.toISOString(),
    deadline,
    daysRemaining,
    ready,
    manualSubmitRequired: true,
    missingFields,
    nextStep
  };
  ensureGeneratedDir();
  fs.writeFileSync(path.join(GENERATED_DIR, 'check.json'), `${JSON.stringify(status, null, 2)}\n`);
  fs.writeFileSync(path.join(GENERATED_DIR, 'check.md'), `${renderCheckReport(status)}\n`);
  console.log(path.join(GENERATED_DIR, 'check.md'));
  if (!ready) {
    process.exit(1);
  }
}

main().catch(error => {
  ensureGeneratedDir();
  const fallback = {
    generatedAt: new Date().toISOString(),
    ready: false,
    manualSubmitRequired: true,
    missingFields: [],
    nextStep: `Resolve NLnet check failure: ${error.message}`
  };
  fs.writeFileSync(
    path.join(GENERATED_DIR, 'check.json'),
    `${JSON.stringify(fallback, null, 2)}\n`
  );
  fs.writeFileSync(
    path.join(GENERATED_DIR, 'check.md'),
    `# NLnet Funding Status\n\n- Packet ready: no\n- Manual browser handoff required: yes\n\n## Next Step\n\n${fallback.nextStep}\n`
  );
  console.error(error.message);
  process.exit(1);
});
