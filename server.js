const express = require('express');
const _ = require('lodash');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Vulnerable endpoint demonstrating CVE-2019-10744 (defaultsDeep)
app.post('/api/defaults-deep', (req, res) => {
    try {
        console.log('Received payload:', JSON.stringify(req.body, null, 2));
        
        // This is vulnerable to prototype pollution
        const defaults = {};
        const result = _.defaultsDeep(defaults, req.body);
        
        console.log('Object.prototype after defaultsDeep:', Object.prototype);
        
        // Create a new object to test if prototype was polluted
        const testObj = {};
        
        res.json({
            success: true,
            message: 'defaultsDeep executed',
            result: result,
            testObject: testObj,
            prototypePolluded: testObj.hasOwnProperty('isAdmin') || 'isAdmin' in testObj,
            isAdmin: testObj.isAdmin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Vulnerable endpoint demonstrating CVE-2018-3721 (merge)
app.post('/api/merge', (req, res) => {
    try {
        console.log('Received payload:', JSON.stringify(req.body, null, 2));
        
        // This is vulnerable to prototype pollution
        const target = {};
        const result = _.merge(target, req.body);
        
        console.log('Object.prototype after merge:', Object.prototype);
        
        // Create a new object to test if prototype was polluted
        const testObj = {};
        
        res.json({
            success: true,
            message: 'merge executed',
            result: result,
            testObject: testObj,
            prototypePolluded: testObj.hasOwnProperty('isAdmin') || 'isAdmin' in testObj,
            isAdmin: testObj.isAdmin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Vulnerable endpoint demonstrating CVE-2018-3721 (mergeWith)
app.post('/api/merge-with', (req, res) => {
    try {
        console.log('Received payload:', JSON.stringify(req.body, null, 2));
        
        // This is vulnerable to prototype pollution
        const target = {};
        const result = _.mergeWith(target, req.body, (objValue, srcValue) => {
            // Custom merge function (still vulnerable)
            if (_.isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        });
        
        console.log('Object.prototype after mergeWith:', Object.prototype);
        
        // Create a new object to test if prototype was polluted
        const testObj = {};
        
        res.json({
            success: true,
            message: 'mergeWith executed',
            result: result,
            testObject: testObj,
            prototypePolluted: testObj.hasOwnProperty('isAdmin') || 'isAdmin' in testObj,
            isAdmin: testObj.isAdmin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Status endpoint to check current prototype pollution
app.get('/api/status', (req, res) => {
    const testObj = {};
    res.json({
        prototypePolluded: testObj.hasOwnProperty('isAdmin') || 'isAdmin' in testObj,
        isAdmin: testObj.isAdmin,
        lodashVersion: require('lodash/package.json').version
    });
});

// Reset endpoint to clean up prototype pollution (for testing)
app.post('/api/reset', (req, res) => {
    if (Object.prototype.isAdmin !== undefined) {
        delete Object.prototype.isAdmin;
    }
    if (Object.prototype.polluted !== undefined) {
        delete Object.prototype.polluted;
    }
    
    const testObj = {};
    res.json({
        success: true,
        message: 'Prototype cleaned',
        prototypePolluded: testObj.hasOwnProperty('isAdmin') || 'isAdmin' in testObj
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Vulnerable lodash demo server running on port ${PORT}`);
    console.log(`Lodash version: ${require('lodash/package.json').version}`);
    console.log('Visit http://localhost:3000 to test the vulnerabilities');
});

module.exports = app;