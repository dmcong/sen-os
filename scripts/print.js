const printError = (er) => console.error('\x1b[31m%s\x1b[0m', er);
const printInfo = (info) => console.info('\x1b[36m%s\x1b[0m', info);

module.exports = { printError, printInfo }