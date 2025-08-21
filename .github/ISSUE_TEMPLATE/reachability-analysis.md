---
name: Reachability Analysis
about: Perform vulnerability exposure analysis to help understand priority of remediation
title: 'Reachability Analysis: [VULNERABILITY_NAME]'
labels: ['reachability-analysis', 'security']
assignees: ''
---

# Reachability Analysis

Perform vulnerability exposure analysis against the codebase to help understand priority of remediation. This is a decision analysis that will determine if this vulnerability is **Reachable/Unknown/Unreachable**. Use the dependabot alert, the related GitHub advisory / CVE / repo links and any further knowledge to expand the scenario. The GitHub advisory and dependabot alert will list function call information IF available.

## Alert Information

**Dependabot Alert Link:** 
<!-- Paste the dependabot alert link here -->

**CVE/Advisory ID:** 
<!-- e.g., CVE-2019-10744, GHSA-jf85-cpcp-j695 -->

**Affected Package:** 
<!-- e.g., lodash -->

**Affected Version:** 
<!-- e.g., 4.17.11 -->

**Vulnerable Functions (if available):** 
<!-- List the vulnerable function names from the advisory -->

## Analysis Scenarios

There are two major scenarios:

### Scenario 1: Security Advisory Lists Function Calls ✅

The advisory provides specific function names that can be searched in the codebase to understand potential exposure.

#### Direct Dependencies Analysis

##### Direct and Reachable
- [ ] **Package Manifest Check**: Confirm the vulnerable package/version is directly referenced in package.json/requirements.txt/etc.
- [ ] **Version Confirmation**: Verify exact version in package-lock.json or GitHub dependency graph
- [ ] **Function Usage Search**: Search entire GitHub repository for calls to vulnerable functions
  - [ ] Vulnerable function: `____________________`
  - [ ] Search results: `____________________`
- [ ] **Namespace/Import Verification**: Ensure function calls reference the vulnerable dependency (not same-named functions from other packages)
  - [ ] Import/namespace analysis: `____________________`
- [ ] **Conclusion**: If vulnerable functions are called from the vulnerable package → **REACHABLE** ⚠️

##### Direct and Unreachable  
- [ ] **Direct Dependency Confirmed**: Package is only referenced directly
- [ ] **No Transitive Usage**: Dependency analysis confirms no transitive dependencies use this package
- [ ] **No Function Calls Found**: Search confirms vulnerable functions are not called
- [ ] **Conclusion**: If no reachable functions found → **UNREACHABLE** ✅

#### Transitive Dependencies Analysis

- [ ] **Transitive Dependency Detection**: If direct dependency not found, search for vulnerable package in dependency tree
- [ ] **Parent Dependency Identification**: Use package manager CLI to identify which direct dependencies pull in the vulnerable package
  - [ ] Parent dependency 1: `____________________`
  - [ ] Parent dependency 2: `____________________`
- [ ] **Parent Dependency Research**: Research each parent dependency to understand if it calls vulnerable functions
  - [ ] Parent 1 analysis: `____________________`
  - [ ] Parent 2 analysis: `____________________`
- [ ] **Confidence Assessment**: 
  - [ ] High confidence parent calls vulnerable functions → **REACHABLE** ⚠️
  - [ ] Low confidence or cannot verify → **UNKNOWN** ❓

### Scenario 2: No Function Calls in Advisory ❓

The security advisory does not mention specific function calls, making analysis impossible.

- [ ] **Advisory Review**: Confirmed that no function names are provided in the security advisory
- [ ] **Additional Research**: Searched for function names in related CVE databases, GitHub issues, or security blogs
- [ ] **Conclusion**: Unable to perform function-level analysis → **UNKNOWN** ❓

## Work Summary

### Analysis Results

**Final Determination:** [ ] Reachable / [ ] Unknown / [ ] Unreachable

**Confidence Level:** [ ] High / [ ] Medium / [ ] Low

**Reasoning:**
<!-- Provide detailed explanation of your analysis and conclusion -->

### Recommendations

**Priority:** [ ] Critical (Reachable) / [ ] Medium (Unknown) / [ ] Low (Unreachable)

**Action Items:**
- [ ] Upgrade package to secure version
- [ ] Remove unused dependency  
- [ ] Add dependency pinning
- [ ] Monitor for updates
- [ ] No action required

### Additional Notes

<!-- Any additional context, limitations of analysis, or areas for future investigation -->

---

## Dependabot-Reachability Report

**Package:** `____________________`  
**Version:** `____________________`  
**CVE:** `____________________`  
**Reachability:** `____________________`  
**Priority:** `____________________`  

**Analysis Summary:**
<!-- Brief summary for stakeholders -->

**Technical Details:**
<!-- Technical findings for development team -->