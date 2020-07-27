const db = require('../db');

module.exports = db.defineModel('test', {
    userId:db.STRING(100),
    id:db.STRING(50),
    email: {
        type: db.STRING(100),
        unique: true
    },
    passwd: db.STRING(100),
    name: db.STRING(100),
    identity: db.STRING(100),
    birth: db.STRING(10),
    // createdAt: db.BIGINT,
    // updatedAt: db.BIGINT,
    // version: db.BIGINT,
    gender: db.BOOLEAN
});
