const users = require('../data/users.json');

const findAll = () => {
    return Promise.resolve(users);
};

module.exports = { findAll };
