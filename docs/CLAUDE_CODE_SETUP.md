# Claude Code Setup for Forge Space

> **🚀 Productivity-optimized Claude Code configuration**  
> **🛡️ Security-first with zero-secrets enforcement**

---

## 📋 **Overview**

This document explains the Claude Code setup for Forge Space development, including security considerations and git tracking policies.

## 🎯 **What's Included**

### **Claude Code Configuration**
- **Subagents**: 5 specialized agents for Forge Space ecosystem
- **Hooks**: Security validation and quality automation
- **Skills**: Domain expertise for security and MCP integration
- **Commands**: Quality gates and security scanning
- **MCP Integration**: Optimized resource usage

### **Security Features**
- **Zero-Secrets Policy**: Automated enforcement
- **Destructive Command Blocking**: Prevents dangerous operations
- **Input Validation**: Comprehensive security scanning
- **Audit Logging**: Security event tracking

## 🛡️ **Security Policy**

### **Git Tracking Exclusion**
Claude Code configuration files are **intentionally excluded** from git tracking:

```gitignore
# Claude Code configuration (user-specific)
.claude/
~/.claude/
```

### **Why Excluded?**
1. **User-Specific**: Claude configuration is personal to each developer
2. **Security**: May contain personal preferences and local paths
3. **Flexibility**: Allows customization without affecting team
4. **Zero-Secrets**: Prevents accidental secret commits

### **What This Means**
- ✅ **Configuration is local** to each developer's machine
- ✅ **No Claude files** are committed to the repository
- ✅ **Each developer** can customize their setup
- ✅ **Team consistency** through shared patterns and documentation

## 🚀 **Setup Instructions**

### **1. Clone Repository**
```bash
git clone https://github.com/Forge-Space/core
cd forge-patterns
```

### **2. Claude Code Setup**
The Claude Code configuration is **not** in the repository. Each developer should:

1. **Create their own** Claude Code setup
2. **Follow the patterns** documented here
3. **Customize as needed** for their workflow
4. **Never commit** Claude configuration files

### **3. Recommended Setup**
See the comprehensive setup guide in your local Claude configuration:
```bash
# View your Claude setup
cat ~/.claude/README.md
```

## 📁 **Configuration Structure**

### **User-Level Configuration** (`~/.claude/`)
```
~/.claude/
├── agents/forge-space/          # Specialized subagents
├── hooks/                       # Automation hooks
├── skills/                      # Domain expertise
├── commands/                   # Custom commands
├── settings.json               # Main configuration
└── README.md                   # Setup documentation
```

### **Project-Level Configuration** (Optional)
If needed, create `.claude/` in project root for team-specific settings:
```bash
# Team-specific Claude settings
.claude/
├── settings.json               # Project overrides
└── agents/                     # Project-specific agents
```

## 🔧 **Configuration Details**

### **Security Hooks**
```bash
~/.claude/hooks/security/
├── block-destructive.sh        # Block dangerous commands
└── validate-secrets.sh         # Zero-secrets validation
```

### **Quality Hooks**
```bash
~/.claude/hooks/quality/
├── auto-format.sh              # Auto-format code
└── validate-tests.sh           # Test validation
```

### **MCP Integration**
```json
{
  "mcpServers": {
    "brave-search": { ... },
    "exa": { ... },
    "memory": { ... },
    "sequential-thinking": { ... },
    "tavily": { ... },
    "uiforge-context": { ... }
  }
}
```

## 🎯 **Usage Guidelines**

### **Security Best Practices**
- **Never commit** `.claude/` directory
- **Use placeholders** for all sensitive values
- **Validate secrets** before any commit
- **Review security hooks** regularly

### **Productivity Tips**
- **Use agents** for domain-specific tasks
- **Leverage MCP resources** for external information
- **Automate quality** with hooks and commands
- **Monitor token usage** with analytics

### **Team Collaboration**
- **Share patterns** not configuration files
- **Document workflows** in README files
- **Use issue templates** for Claude-related issues
- **Maintain consistency** through documentation

## 📊 **Benefits**

### **Security Benefits**
- **Zero Secrets**: 100% compliance with zero-secrets policy
- **Local Configuration**: No risk of committing sensitive data
- **Personalization**: Each developer controls their setup
- **Audit Trail**: Security events logged locally

### **Productivity Benefits**
- **Automated Quality**: Consistent formatting and validation
- **Specialized Agents**: Domain expertise on demand
- **MCP Integration**: Optimized resource usage
- **Token Optimization**: Reduced costs and better performance

### **Team Benefits**
- **Flexibility**: Customizable setups per developer
- **Consistency**: Shared patterns and documentation
- **Onboarding**: Easy setup for new team members
- **Maintenance**: No git conflicts from configuration

## 🔍 **Troubleshooting**

### **Configuration Not Working**
```bash
# Check Claude configuration
cat ~/.claude/settings.json

# Verify hooks are executable
chmod +x ~/.claude/hooks/**/*.sh

# Test MCP servers
/agents
```

### **Git Issues**
```bash
# Check if Claude files are ignored
git check-ignore .claude/

# Remove accidentally tracked files
git rm -rf .claude/

# Update .gitignore if needed
echo ".claude/" >> .gitignore
```

### **Security Validation**
```bash
# Run security scan
/security-scan

# Validate zero-secrets
~/.claude/hooks/security/validate-secrets.sh

# Check for secrets
find . -name "*.env" -o -name "*.key" | grep -v node_modules
```

## 📋 **Maintenance**

### **Regular Tasks**
- **Monthly**: Review and update hooks and skills
- **Quarterly**: Analyze usage patterns and optimize
- **Semi-Annually**: Major configuration updates
- **Annually**: Complete setup review and refactoring

### **Security Maintenance**
- **Weekly**: Run security scans
- **Monthly**: Review security logs
- **Quarterly**: Update security patterns
- **Annually**: Security audit and assessment

## 🔄 **Backup and Restore**

### **Backup Configuration**
```bash
# Backup Claude configuration
cp -r ~/.claude ~/.claude.backup.$(date +%Y%m%d)

# Backup specific components
cp -r ~/.claude/agents ~/claude-agents.backup
cp -r ~/.claude/hooks ~/claude-hooks.backup
cp ~/.claude/settings.json ~/claude-settings.backup.json
```

### **Restore Configuration**
```bash
# Restore from backup
cp -r ~/.claude.backup.20260222 ~/.claude

# Restore specific components
cp -r ~/claude-agents.backup ~/.claude/agents
cp -r ~/claude-hooks.backup ~/.claude/hooks
cp ~/claude-settings.backup.json ~/.claude/settings.json
```

## 📞 **Support**

### **Getting Help**
- **Documentation**: `~/.claude/README.md`
- **Commands**: `/help` in Claude Code
- **Community**: Forge Space Discord and GitHub
- **Issues**: Create GitHub issue with `claude-code` label

### **Contributing**
- **Patterns**: Share useful hooks and skills
- **Documentation**: Improve setup guides
- **Security**: Report security issues privately
- **Feedback**: Provide suggestions for improvements

---

## 🎯 **Summary**

The Claude Code setup for Forge Space is designed to be:

- **🛡️ Secure**: Zero-secrets compliant with local configuration
- **🚀 Productive**: Automated quality and security validation
- **🤖 Intelligent**: Specialized agents and MCP integration
- **💰 Efficient**: Token optimization and cost control
- **👥 Team-Friendly**: Consistent patterns with personal customization

**Remember**: Claude configuration files are **intentionally excluded** from git tracking to maintain security and flexibility. Each developer should set up their own configuration following the patterns documented here.