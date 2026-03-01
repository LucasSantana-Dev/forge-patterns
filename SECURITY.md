# Security Policy

This policy covers [@forgespace/core](https://github.com/Forge-Space/core) (forge-patterns). For general Forge Space security policy, see the [organization-level policy](https://github.com/Forge-Space/.github/blob/main/SECURITY.md).

## Reporting a Vulnerability

### Preferred: GitHub Private Security Advisory

Open a [Private Security Advisory](https://github.com/Forge-Space/core/security/advisories/new) directly on this repository.

### Alternative: Email

Send details to [security@forgespace.co](mailto:security@forgespace.co).

## Scope

This is a shared configuration and pattern library published to npm. Key security considerations:

- Path traversal protection in pattern loading
- Symlink validation and security boundaries
- Configuration template placeholder standards (no real secrets)
- MCP context server access controls

For internal security development guidelines, see [docs/SECURITY.md](docs/SECURITY.md).

## Supported Versions

Only the latest npm release is supported with security updates.

## Safe Harbor

We support safe harbor for security researchers acting in good faith. See the [organization-level policy](https://github.com/Forge-Space/.github/blob/main/SECURITY.md) for full safe harbor terms.

## Contact

- **Email**: [security@forgespace.co](mailto:security@forgespace.co)
- **GitHub**: [Open a Private Security Advisory](https://github.com/Forge-Space/core/security/advisories/new)
