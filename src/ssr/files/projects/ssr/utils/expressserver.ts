import * as express from "express";

import { join } from "path";
import { SSRCliOptions } from "./models";
import { readConfig } from "./spwan";

export async function Launchserver():Promise<any> {


 
  const app = express();

  const PORT = process.env.PORT || 4200;

  let ssrConfig: SSRCliOptions = {
    cliOptions: {
      command:""
    },
    appOptions:{},
    configOptions:readConfig(),
  };
  const DIST_FOLDER = join(process.cwd(), ssrConfig.configOptions.paths.DIST_FOLDER);

  app.get("*.*", express.static(join(DIST_FOLDER)));
  app.get("*", function(req, res) {
    res.sendFile(join(DIST_FOLDER, "index.html")); // load the single view file (angular will handle the page changes on the front-end)
  });
  
  return  app;


}
