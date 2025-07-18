const path = require('path');

// This will give the directory where the main file (app.js) is located
module.exports = path.dirname(require.main.filename);
