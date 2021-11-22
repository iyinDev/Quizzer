import {writeFileSync} from "fs";

const path = "../utils/firebase-config.json"

export function updateConfig(config) {
    const jsonString = JSON.stringify(config)
    writeFileSync(path ,jsonString, "utf-8")
    console.log(jsonString)
}

// paste config Object to update firebase-config.json.
const config = {}

updateConfig(config)