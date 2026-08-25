import { TagDataBuilder, TagDataClasses } from "./builderOut.js"
//import TagInfoBuilder from "https://example.com"
import fs from "fs"

//
// Do NOT remove content above
//


let builder = new TagDataBuilder()

builder.AddTagToken(
    new TagDataClasses.TagTokenEntry("test")
        .SetDescription("test")
        .WithColor([255,0,0])
)

builder.Finalize()
let dataJsonStr = builder.toJSON()


//
// Do NOT remove content below
//

fs.writeFileSync( "output.json", JSON.stringify(JSON.parse(dataJsonStr), null, 2) );
