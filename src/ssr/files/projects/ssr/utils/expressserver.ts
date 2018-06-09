import * as express from "express";
var bodyParser = require('body-parser');
import { join } from "path";
import { SSRCliOptions } from "./models";
import { readConfig } from "./spwan";
import { ROUTES } from "../routes/routes";

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


export async function LaunchStaticServer(){
  const app = express();

  const PORT = process.env.PORT || 5000;

  let ssrConfig: SSRCliOptions = {
    cliOptions: {
      command:""
    },
    appOptions:{},
    configOptions:readConfig(),
  };
  const DIST_FOLDER = join(process.cwd(), ssrConfig.configOptions.paths.DIST_FOLDER);
  



  app.get("*.*", express.static(join(DIST_FOLDER)));

 
  app.get('*', function(req, res) {
    console.log(req)
    res.sendFile(join(process.cwd(), 'dist/' + req.url + "/index.html"));
});
  // and the rest routes will be redirected to "/"



  app.listen(5000, async () => {
     console.log('server app port 5000')
    });

  // app.get("*", function(req, res) {
  //   res.sendFile(join(DIST_FOLDER, "index.html")); // load the single view file (angular will handle the page changes on the front-end)
  // });

}