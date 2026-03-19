#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { APPLICANT_PATH, BASE_DIR } = require('./nlnet-lib.cjs');

const REQUIRED_ENV_FIELDS = [
  ['NLNET_APPLICANT_LEGAL_NAME', 'applicant.legalName'],
  ['NLNET_APPLICANT_PUBLIC_NAME', 'applicant.publicName'],
  ['NLNET_APPLICANT_EMAIL', 'applicant.email'],
  ['NLNET_APPLICANT_CITY', 'applicant.city'],
  ['NLNET_APPLICANT_COUNTRY', 'applicant.country'],
  ['NLNET_APPLICANT_ENTITY_TYPE', 'applicant.entityType'],
  ['NLNET_REQUESTED_AMOUNT_EUR', 'submission.requestedAmountEUR'],
  ['NLNET_DURATION_MONTHS', 'submission.durationMonths']
];

function parseNumber(value, envName) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${envName} must be a positive number`);
  }
  return parsed;
}

function buildApplicantFromEnv(env) {
  const missing = REQUIRED_ENV_FIELDS.filter(([name]) => !String(env[name] ?? '').trim()).map(
    ([name]) => name
  );

  if (missing.length > 0) {
    return { missing };
  }

  return {
    missing: [],
    applicant: {
      legalName: env.NLNET_APPLICANT_LEGAL_NAME.trim(),
      publicName: env.NLNET_APPLICANT_PUBLIC_NAME.trim(),
      email: env.NLNET_APPLICANT_EMAIL.trim(),
      city: env.NLNET_APPLICANT_CITY.trim(),
      country: env.NLNET_APPLICANT_COUNTRY.trim(),
      entityType: env.NLNET_APPLICANT_ENTITY_TYPE.trim()
    },
    submission: {
      requestedAmountEUR: parseNumber(env.NLNET_REQUESTED_AMOUNT_EUR, 'NLNET_REQUESTED_AMOUNT_EUR'),
      durationMonths: parseNumber(env.NLNET_DURATION_MONTHS, 'NLNET_DURATION_MONTHS')
    }
  };
}

function parseArgs(argv) {
  return {
    force: argv.includes('--force')
  };
}

function main() {
  const { force } = parseArgs(process.argv.slice(2));

  if (!force && fs.existsSync(APPLICANT_PATH)) {
    throw new Error(
      `Refusing to overwrite ${path.relative(process.cwd(), APPLICANT_PATH)} (use --force)`
    );
  }

  const data = buildApplicantFromEnv(process.env);
  if (data.missing.length > 0) {
    const requiredList = data.missing.map(name => `- ${name}`).join('\n');
    throw new Error(`Missing required NLnet env vars:\n${requiredList}`);
  }

  const payload = {
    _generatedBy: 'scripts/funding/init-nlnet-applicant.cjs',
    _generatedAt: new Date().toISOString(),
    applicant: data.applicant,
    submission: data.submission
  };

  fs.mkdirSync(BASE_DIR, { recursive: true });
  fs.writeFileSync(APPLICANT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(APPLICANT_PATH);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  buildApplicantFromEnv,
  parseNumber,
  REQUIRED_ENV_FIELDS
};
