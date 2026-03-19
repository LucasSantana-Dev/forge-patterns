const {
  buildApplicantFromEnv,
  parseNumber
} = require('../scripts/funding/init-nlnet-applicant.cjs');

describe('init-nlnet-applicant', () => {
  it('returns missing vars when env is incomplete', () => {
    const result = buildApplicantFromEnv({
      NLNET_APPLICANT_LEGAL_NAME: 'Forge Space LTDA'
    });

    expect(result.missing).toContain('NLNET_APPLICANT_PUBLIC_NAME');
    expect(result.missing).toContain('NLNET_REQUESTED_AMOUNT_EUR');
  });

  it('builds applicant payload from valid env', () => {
    const result = buildApplicantFromEnv({
      NLNET_APPLICANT_LEGAL_NAME: 'Forge Space LTDA',
      NLNET_APPLICANT_PUBLIC_NAME: 'Forge Space',
      NLNET_APPLICANT_EMAIL: 'contact@forgespace.co',
      NLNET_APPLICANT_CITY: 'Sao Paulo',
      NLNET_APPLICANT_COUNTRY: 'Brazil',
      NLNET_APPLICANT_ENTITY_TYPE: 'company',
      NLNET_REQUESTED_AMOUNT_EUR: '40000',
      NLNET_DURATION_MONTHS: '6'
    });

    expect(result.missing).toHaveLength(0);
    expect(result.applicant.publicName).toBe('Forge Space');
    expect(result.submission.requestedAmountEUR).toBe(40000);
    expect(result.submission.durationMonths).toBe(6);
  });

  it('rejects non-positive numeric values', () => {
    expect(() => parseNumber('0', 'NLNET_DURATION_MONTHS')).toThrow(
      'NLNET_DURATION_MONTHS must be a positive number'
    );
  });
});
