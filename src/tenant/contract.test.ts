import { validateTenantProfile, assertTenantProfile } from './contract';
import type { TenantProfile } from './contract';

const validProfile: TenantProfile = {
  tenant_id: 'forge-space',
  github_owner: 'Forge-Space',
  sonar_org: 'forge-space',
  npm_scope: '@forgespace',
  quality_policy: {
    min_quality_score: 80,
    block_on_critical: true,
    block_on_high: false
  },
  ci_policy: {
    require_sonar: true,
    require_security_scan: true,
    enforce_pr_checks: true
  }
};

describe('tenant/contract', () => {
  describe('validateTenantProfile', () => {
    it('returns true for a valid profile', () => {
      expect(validateTenantProfile(validProfile)).toBe(true);
    });

    it('returns false for null', () => {
      expect(validateTenantProfile(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(validateTenantProfile(undefined)).toBe(false);
    });

    it('returns false for a primitive', () => {
      expect(validateTenantProfile('string')).toBe(false);
      expect(validateTenantProfile(42)).toBe(false);
      expect(validateTenantProfile(true)).toBe(false);
    });

    it('returns false when tenant_id is missing', () => {
      const { tenant_id: _, ...rest } = validProfile;
      expect(validateTenantProfile(rest)).toBe(false);
    });

    it('returns false when tenant_id is empty', () => {
      expect(
        validateTenantProfile({ ...validProfile, tenant_id: '   ' })
      ).toBe(false);
    });

    it('returns false when tenant_id is non-string', () => {
      expect(
        validateTenantProfile({ ...validProfile, tenant_id: 123 })
      ).toBe(false);
    });

    it('returns false when github_owner is missing', () => {
      const { github_owner: _, ...rest } = validProfile;
      expect(validateTenantProfile(rest)).toBe(false);
    });

    it('returns false when sonar_org is empty', () => {
      expect(
        validateTenantProfile({ ...validProfile, sonar_org: '' })
      ).toBe(false);
    });

    it('returns false when npm_scope is non-string', () => {
      expect(
        validateTenantProfile({ ...validProfile, npm_scope: 42 })
      ).toBe(false);
    });

    it('returns false when quality_policy is missing', () => {
      const { quality_policy: _, ...rest } = validProfile;
      expect(validateTenantProfile(rest)).toBe(false);
    });

    it('returns false when quality_policy is not an object', () => {
      expect(
        validateTenantProfile({ ...validProfile, quality_policy: 'bad' })
      ).toBe(false);
    });

    it('returns false when quality_policy.min_quality_score is not a number', () => {
      expect(
        validateTenantProfile({
          ...validProfile,
          quality_policy: {
            ...validProfile.quality_policy,
            min_quality_score: 'high'
          }
        })
      ).toBe(false);
    });

    it('returns false when quality_policy.block_on_critical is not boolean', () => {
      expect(
        validateTenantProfile({
          ...validProfile,
          quality_policy: {
            ...validProfile.quality_policy,
            block_on_critical: 'yes'
          }
        })
      ).toBe(false);
    });

    it('returns false when quality_policy.block_on_high is not boolean', () => {
      expect(
        validateTenantProfile({
          ...validProfile,
          quality_policy: {
            ...validProfile.quality_policy,
            block_on_high: 1
          }
        })
      ).toBe(false);
    });

    it('returns false when ci_policy is missing', () => {
      const { ci_policy: _, ...rest } = validProfile;
      expect(validateTenantProfile(rest)).toBe(false);
    });

    it('returns false when ci_policy is null', () => {
      expect(
        validateTenantProfile({ ...validProfile, ci_policy: null })
      ).toBe(false);
    });

    it('returns false when ci_policy.require_sonar is not boolean', () => {
      expect(
        validateTenantProfile({
          ...validProfile,
          ci_policy: {
            ...validProfile.ci_policy,
            require_sonar: 'true'
          }
        })
      ).toBe(false);
    });

    it('returns false when ci_policy.require_security_scan is not boolean', () => {
      expect(
        validateTenantProfile({
          ...validProfile,
          ci_policy: {
            ...validProfile.ci_policy,
            require_security_scan: 0
          }
        })
      ).toBe(false);
    });

    it('returns false when ci_policy.enforce_pr_checks is not boolean', () => {
      expect(
        validateTenantProfile({
          ...validProfile,
          ci_policy: {
            ...validProfile.ci_policy,
            enforce_pr_checks: null
          }
        })
      ).toBe(false);
    });

    it('accepts a profile with extra keys (structural typing)', () => {
      expect(
        validateTenantProfile({ ...validProfile, extra: 'data' })
      ).toBe(true);
    });
  });

  describe('assertTenantProfile', () => {
    it('does not throw for a valid profile', () => {
      expect(() => assertTenantProfile(validProfile)).not.toThrow();
    });

    it('throws for null', () => {
      expect(() => assertTenantProfile(null)).toThrow(
        'Invalid tenant profile'
      );
    });

    it('throws for an empty object', () => {
      expect(() => assertTenantProfile({})).toThrow(
        'Invalid tenant profile'
      );
    });

    it('throws with descriptive message listing required keys', () => {
      expect(() => assertTenantProfile(undefined)).toThrow(
        /tenant_id.*github_owner.*sonar_org.*npm_scope.*quality_policy.*ci_policy/
      );
    });

    it('throws when one nested policy is invalid', () => {
      expect(() =>
        assertTenantProfile({
          ...validProfile,
          quality_policy: { min_quality_score: 'bad' }
        })
      ).toThrow('Invalid tenant profile');
    });
  });
});
