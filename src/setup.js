
const fs = require("fs")
const process = require("process")

console.log("Creating config file")

try {
    fs.copyFileSync("src/defaultConfig.json", "./config.json")
} catch (err) {
    console.error("Error creating config file", err)
    process.exit(1)
}

console.log("Config file created")

