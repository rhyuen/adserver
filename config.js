const nconf = require("nconf");

nconf.file("./keys.json");

module.exports = {
    mongo: process.env.MONGO || nconf.get("mongo")
};