#!/bin/bash

# Simple Documentation Validation
set -e

echo "🔍 Testing Documentation References"
echo "=================================="

FORGE_PATTERNS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MCP_GATEWAY_DIR="$FORGE_PATTERNS_DIR/../mcp-gateway"
SIZA_DIR="$FORGE_PATTERNS_DIR/../siza"
UI_MCP_DIR="$FORGE_PATTERNS_DIR/../ui-mcp"

echo "Forge Patterns: $FORGE_PATTERNS_DIR"
echo "MCP Gateway: $MCP_GATEWAY_DIR"
echo "Siza: $SIZA_DIR"
echo "UI MCP: $UI_MCP_DIR"
echo ""

# Test centralized files exist
echo "Testing centralized files..."
test -f "$FORGE_PATTERNS_DIR/docs/shared-rules/agent-rules.md" && echo "✓ agent-rules.md exists" || echo "✗ agent-rules.md missing"
test -f "$FORGE_PATTERNS_DIR/docs/shared-rules/quality-standards/testing.md" && echo "✓ testing.md exists" || echo "✗ testing.md missing"
test -f "$FORGE_PATTERNS_DIR/docs/shared-rules/quality-standards/security.md" && echo "✓ security.md exists" || echo "✗ security.md missing"
test -f "$FORGE_PATTERNS_DIR/docs/shared-rules/development-workflows/git-workflows.md" && echo "✓ git-workflows.md exists" || echo "✗ git-workflows.md missing"
echo ""

# Test project README files exist
echo "Testing project README files..."
test -f "$MCP_GATEWAY_DIR/.windsurf/rules/README.md" && echo "✓ MCP Gateway README exists" || echo "✗ MCP Gateway README missing"
test -f "$SIZA_DIR/.windsurf/rules/README.md" && echo "✓ Siza README exists" || echo "✗ Siza README missing"
test -f "$UI_MCP_DIR/.windsurf/rules/README.md" && echo "✓ UI MCP README exists" || echo "✗ UI MCP README missing"
echo ""

# Test specific references work
echo "Testing specific references..."

# Test MCP Gateway reference to agent rules
AGENT_RULES_PATH="$MCP_GATEWAY_DIR/../forge-patterns/docs/shared-rules/agent-rules.md"
test -f "$AGENT_RULES_PATH" && echo "✓ MCP Gateway can access agent rules" || echo "✗ MCP Gateway cannot access agent rules"

# Test Siza reference to testing standards
TESTING_STANDARDS_PATH="$SIZA_DIR/../forge-patterns/docs/shared-rules/quality-standards/testing.md"
test -f "$TESTING_STANDARDS_PATH" && echo "✓ Siza can access testing standards" || echo "✗ Siza cannot access testing standards"

# Test UI MCP reference to security standards
SECURITY_STANDARDS_PATH="$UI_MCP_DIR/../forge-patterns/docs/shared-rules/quality-standards/security.md"
test -f "$SECURITY_STANDARDS_PATH" && echo "✓ UI MCP can access security standards" || echo "✗ UI MCP cannot access security standards"

echo ""
echo "=================================="
echo "✅ Documentation validation complete!"