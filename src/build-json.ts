import fs from "fs"

let dataJson = ["test"]

fs.writeFileSync( "output.json", JSON.stringify(dataJson) );
