#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const {
  GENERATED_DIR,
  buildFormFields,
  buildMilestonesBudget,
  buildMissingFields,
  buildMissingFieldsReport,
  buildNarrative,
  ensureGeneratedDir,
  loadPacket
} = require('./nlnet-lib.cjs');

function writeOutput(fileName, content) {
  fs.writeFileSync(path.join(GENERATED_DIR, fileName), content);
}

function main() {
  const { project, packet } = loadPacket();
  const missingFields = buildMissingFields(packet);
  ensureGeneratedDir();
  writeOutput('application-narrative.md', `${buildNarrative(project)}\n`);
  writeOutput('milestones-budget.md', `${buildMilestonesBudget(project)}\n`);
  writeOutput(
    'form-fields.json',
    `${JSON.stringify(buildFormFields(project, packet, missingFields), null, 2)}\n`
  );
  writeOutput('missing-fields.md', `${buildMissingFieldsReport(missingFields)}\n`);
  console.log(path.join(GENERATED_DIR, 'application-narrative.md'));
}

main();
