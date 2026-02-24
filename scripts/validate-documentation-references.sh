#!/bin/bash

# Documentation Reference Integrity Validator
# Validates that all centralized documentation references work correctly across projects

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track results
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Function to print status
print_status() {
    local status=$1
    local message=$2
    
    case $status in
        "PASS")
            echo -e "${GREEN}✓ PASS${NC}: $message"
            ((PASSED_CHECKS++))
            ;;
        "FAIL")
            echo -e "${RED}✗ FAIL${NC}: $message"
            ((FAILED_CHECKS++))
            ;;
        "INFO")
            echo -e "${BLUE}ℹ INFO${NC}: $message"
            ;;
        "WARN")
            echo -e "${YELLOW}⚠ WARN${NC}: $message"
            ;;
    esac
    ((TOTAL_CHECKS++))
}

# Function to check if file exists
check_file_exists() {
    local file_path=$1
    local description=$2
    
    if [[ -f "$file_path" ]]; then
        print_status "PASS" "$description exists: $file_path"
        return 0
    else
        print_status "FAIL" "$description missing: $file_path"
        return 1
    fi
}

# Function to check if directory exists
check_dir_exists() {
    local dir_path=$1
    local description=$2
    
    if [[ -d "$dir_path" ]]; then
        print_status "PASS" "$description exists: $dir_path"
        return 0
    else
        print_status "FAIL" "$description missing: $dir_path"
        return 1
    fi
}

# Function to validate relative path references
validate_relative_reference() {
    local from_file=$1
    local reference_path=$2
    local description=$3
    
    # Resolve the reference path relative to the from_file directory
    local from_dir=$(dirname "$from_file")
    local resolved_path="$from_dir/$reference_path"
    
    if [[ -f "$resolved_path" ]]; then
        print_status "PASS" "$description reference valid: $reference_path"
        return 0
    else
        print_status "FAIL" "$description reference broken: $reference_path (resolves to: $resolved_path)"
        return 1
    fi
}

echo "🔍 Documentation Reference Integrity Validator"
echo "============================================"
echo ""

# Get the script directory to find project paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FORGE_PATTERNS_DIR="$(dirname "$SCRIPT_DIR")"

# Define project paths relative to forge-patterns
MCP_GATEWAY_DIR="$FORGE_PATTERNS_DIR/../mcp-gateway"
UIFORGE_WEBAPP_DIR="$FORGE_PATTERNS_DIR/../uiforge-webapp"
UIFORGE_MCP_DIR="$FORGE_PATTERNS_DIR/../uiforge-mcp"

print_status "INFO" "Starting validation of centralized documentation references"
print_status "INFO" "Forge Patterns directory: $FORGE_PATTERNS_DIR"
print_status "INFO" "MCP Gateway directory: $MCP_GATEWAY_DIR"
print_status "INFO" "UIForge WebApp directory: $UIFORGE_WEBAPP_DIR"
print_status "INFO" "UIForge MCP directory: $UIFORGE_MCP_DIR"
echo ""

# 1. Validate centralized documentation structure
print_status "INFO" "Validating centralized documentation structure..."

check_dir_exists "$FORGE_PATTERNS_DIR/docs/shared-rules" "Shared rules directory"
check_dir_exists "$FORGE_PATTERNS_DIR/docs/shared-rules/quality-standards" "Quality standards directory"
check_dir_exists "$FORGE_PATTERNS_DIR/docs/shared-rules/development-workflows" "Development workflows directory"

check_file_exists "$FORGE_PATTERNS_DIR/docs/shared-rules/README.md" "Shared rules README"
check_file_exists "$FORGE_PATTERNS_DIR/docs/shared-rules/agent-rules.md" "Agent rules"
check_file_exists "$FORGE_PATTERNS_DIR/docs/shared-rules/quality-standards/testing.md" "Testing standards"
check_file_exists "$FORGE_PATTERNS_DIR/docs/shared-rules/quality-standards/security.md" "Security standards"
check_file_exists "$FORGE_PATTERNS_DIR/docs/shared-rules/quality-standards/README.md" "Quality standards README"
check_file_exists "$FORGE_PATTERNS_DIR/docs/shared-rules/development-workflows/git-workflows.md" "Git workflows"
check_file_exists "$FORGE_PATTERNS_DIR/docs/shared-rules/development-workflows/README.md" "Development workflows README"
check_file_exists "$FORGE_PATTERNS_DIR/docs/SHARED_DOCUMENTATION.md" "Master documentation index"

echo ""

# 2. Validate MCP Gateway references
print_status "INFO" "Validating MCP Gateway documentation references..."

if [[ -d "$MCP_GATEWAY_DIR" ]]; then
    check_file_exists "$MCP_GATEWAY_DIR/.windsurf/rules/README.md" "MCP Gateway rules README"
    check_file_exists "$MCP_GATEWAY_DIR/.windsurf/rules/project-specific.md" "MCP Gateway project-specific rules"
    
    # Validate specific references from MCP Gateway README
    validate_relative_reference "$MCP_GATEWAY_DIR/.windsurf/rules/README.md" "../../../forge-patterns/docs/shared-rules/agent-rules.md" "MCP Gateway agent rules reference"
    validate_relative_reference "$MCP_GATEWAY_DIR/.windsurf/rules/README.md" "../../../forge-patterns/docs/shared-rules/quality-standards/testing.md" "MCP Gateway testing standards reference"
    validate_relative_reference "$MCP_GATEWAY_DIR/.windsurf/rules/README.md" "../../../forge-patterns/docs/shared-rules/quality-standards/README.md" "MCP Gateway quality standards reference"
    validate_relative_reference "$MCP_GATEWAY_DIR/.windsurf/rules/README.md" "../../../forge-patterns/docs/shared-rules/development-workflows/README.md" "MCP Gateway development workflows reference"
else
    print_status "WARN" "MCP Gateway directory not found: $MCP_GATEWAY_DIR"
fi

echo ""

# 3. Validate UIForge WebApp references
print_status "INFO" "Validating UIForge WebApp documentation references..."

if [[ -d "$UIFORGE_WEBAPP_DIR" ]]; then
    check_file_exists "$UIFORGE_WEBAPP_DIR/.windsurf/rules/README.md" "UIForge WebApp rules README"
    check_file_exists "$UIFORGE_WEBAPP_DIR/.windsurf/rules/project-specific.md" "UIForge WebApp project-specific rules"
    
    # Validate specific references from UIForge WebApp README
    validate_relative_reference "$UIFORGE_WEBAPP_DIR/.windsurf/rules/README.md" "../../../forge-patterns/docs/shared-rules/agent-rules.md" "UIForge WebApp agent rules reference"
    validate_relative_reference "$UIFORGE_WEBAPP_DIR/.windsurf/rules/README.md" "../../../forge-patterns/docs/shared-rules/quality-standards/testing.md" "UIForge WebApp testing standards reference"
    validate_relative_reference "$UIFORGE_WEBAPP_DIR/.windsurf/rules/README.md" "../../../forge-patterns/docs/shared-rules/quality-standards/README.md" "UIForge WebApp quality standards reference"
    validate_relative_reference "$UIFORGE_WEBAPP_DIR/.windsurf/rules/README.md" "../../../forge-patterns/docs/shared-rules/development-workflows/README.md" "UIForge WebApp development workflows reference"
else
    print_status "WARN" "UIForge WebApp directory not found: $UIFORGE_WEBAPP_DIR"
fi

echo ""

# 4. Validate UIForge MCP references
print_status "INFO" "Validating UIForge MCP documentation references..."

if [[ -d "$UIFORGE_MCP_DIR" ]]; then
    check_file_exists "$UIFORGE_MCP_DIR/.windsurf/rules/README.md" "UIForge MCP rules README"
    check_file_exists "$UIFORGE_MCP_DIR/.windsurf/rules/project-specific.md" "UIForge MCP project-specific rules"
    
    # Validate specific references from UIForge MCP README
    validate_relative_reference "$UIFORGE_MCP_DIR/.windsurf/rules/README.md" "../../../forge-patterns/docs/shared-rules/agent-rules.md" "UIForge MCP agent rules reference"
    validate_relative_reference "$UIFORGE_MCP_DIR/.windsurf/rules/README.md" "../../../forge-patterns/docs/shared-rules/quality-standards/testing.md" "UIForge MCP testing standards reference"
    validate_relative_reference "$UIFORGE_MCP_DIR/.windsurf/rules/README.md" "../../../forge-patterns/docs/shared-rules/quality-standards/README.md" "UIForge MCP quality standards reference"
    validate_relative_reference "$UIFORGE_MCP_DIR/.windsurf/rules/README.md" "../../../forge-patterns/docs/shared-rules/development-workflows/README.md" "UIForge MCP development workflows reference"
else
    print_status "WARN" "UIForge MCP directory not found: $UIFORGE_MCP_DIR"
fi

echo ""

# 5. Validate internal references within centralized documentation
print_status "INFO" "Validating internal references within centralized documentation..."

# Check agent rules references
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/shared-rules/agent-rules.md" "development-workflows/README.md" "Agent rules development workflows reference"
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/shared-rules/agent-rules.md" "quality-standards/README.md" "Agent rules quality standards reference"
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/shared-rules/agent-rules.md" "quality-standards/testing.md" "Agent rules testing guidelines reference"

# Check testing standards references
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/shared-rules/quality-standards/testing.md" "../agent-rules.md" "Testing standards agent rules reference"
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/shared-rules/quality-standards/testing.md" "../development-workflows/README.md" "Testing standards development workflows reference"
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/shared-rules/quality-standards/testing.md" "README.md" "Testing standards quality overview reference"

# Check security standards references
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/shared-rules/quality-standards/security.md" "../agent-rules.md" "Security standards agent rules reference"
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/shared-rules/quality-standards/security.md" "../development-workflows/README.md" "Security standards development workflows reference"
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/shared-rules/quality-standards/security.md" "README.md" "Security standards quality overview reference"

# Check git workflows references
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/shared-rules/development-workflows/git-workflows.md" "../agent-rules.md" "Git workflows agent rules reference"
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/shared-rules/development-workflows/git-workflows.md" "../quality-standards/README.md" "Git workflows quality standards reference"
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/shared-rules/development-workflows/git-workflows.md" "README.md" "Git workflows development overview reference"

echo ""

# 6. Validate master documentation index
print_status "INFO" "Validating master documentation index references..."

# Check that SHARED_DOCUMENTATION.md references exist
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/SHARED_DOCUMENTATION.md" "shared-rules/README.md" "Master index shared rules reference"
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/SHARED_DOCUMENTATION.md" "shared-rules/agent-rules.md" "Master index agent rules reference"
validate_relative_reference "$FORGE_PATTERNS_DIR/docs/SHARED_DOCUMENTATION.md" "shared-rules/quality-standards/testing.md" "Master index testing standards reference"

echo ""

# 7. Summary and results
echo "============================================"
print_status "INFO" "Validation Summary"
echo "============================================"
echo "Total checks: $TOTAL_CHECKS"
echo -e "Passed: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Failed: ${RED}$FAILED_CHECKS${NC}"

if [[ $FAILED_CHECKS -eq 0 ]]; then
    echo ""
    print_status "PASS" "All documentation references are valid! 🎉"
    echo "The centralized documentation structure is working correctly."
    exit 0
else
    echo ""
    print_status "FAIL" "Some documentation references are broken. Please fix the issues above."
    echo "Run this script again after fixing the issues."
    exit 1
fi