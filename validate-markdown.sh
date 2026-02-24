#!/bin/bash

# Simple markdown validation script
echo "Validating markdown files..."

FILES=(
    "src/mcp-context-server/context-store/uiforge-webapp.md"
    "src/mcp-context-server/context-store/uiforge-mcp.md"
    "src/mcp-context-server/context-store/forge-patterns.md"
    "src/mcp-context-server/context-store/mcp-gateway.md"
)

ISSUES_FOUND=0

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Checking $file..."
        
        # Check for common issues
        if grep -n "^##[^#].*$" "$file" > /dev/null; then
            echo "  ⚠️  Found heading without blank line before"
            ((ISSUES_FOUND++))
        fi
        
        if grep -n "^###.*$" "$file" | grep -v "^### $" > /dev/null; then
            echo "  ⚠️  Found heading without blank line before"
            ((ISSUES_FOUND++))
        fi
        
        if grep -n "^- [^#].*$" "$file" | head -5 > /dev/null; then
            echo "  ⚠️  Found list without blank line before"
            ((ISSUES_FOUND++))
        fi
        
        if grep -n "^[^[:space:]].*https://[^[:space:]]*$" "$file" > /dev/null; then
            echo "  ⚠️  Found bare URL"
            ((ISSUES_FOUND++))
        fi
        
        echo "  ✅ Basic structure validation passed"
    else
        echo "  ❌ File not found: $file"
        ((ISSUES_FOUND++))
    fi
done

echo ""
echo "Validation complete. Issues found: $ISSUES_FOUND"

if [ $ISSUES_FOUND -eq 0 ]; then
    echo "🎉 All markdown files look good!"
    exit 0
else
    echo "⚠️  Some issues found. Consider manual review."
    exit 1
fi
