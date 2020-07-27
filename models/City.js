const db = require('../db');

module.exports = db.defineModel('city', {
    id:db.STRING(50),
    name: db.STRING(100),
    pid: db.STRING(50),
});
