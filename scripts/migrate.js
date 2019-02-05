const path = require("path");
const Umzug = require('Umzug');

let umzug = new Umzug({
    logging: function() {
        console.log.apply(null, arguments);
    },
    migrations: {
        path: "./database/migrations",
        pattern: /\.js$/
    },
    upName: 'up',
    downName: 'down'
});

function logUmzugEvent(eventname) {
    return function(name, migration) {
        console.log(`${name} ${eventname}`);
    }
}

umzug.on("migrating", logUmzugEvent("migration"));
umzug.on("migrated", logUmzugEvent("migrated"));
umzug.on("reverting", logUmzugEvent("reverting"));
umzug.on('reverted', logUmzugEvent('reverted'));

umzug.up().then(console.log("all migrations done"));