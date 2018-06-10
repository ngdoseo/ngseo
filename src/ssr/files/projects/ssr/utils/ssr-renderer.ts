import "zone.js/dist/zone-node";
import "reflect-metadata";

import { renderModuleFactory } from "@angular/platform-server";
import { join } from "path";
import { readFileSync } from "fs";
import { enableProdMode } from "@angular/core";
import { SSRCliOptions } from "./models";
import { readConfig } from "./spwan";

let ssrConfig: SSRCliOptions = {
  cliOptions: {
    command:""
  },
  appOptions:{},
  configOptions:readConfig(),
};
const DIST_FOLDER = join(process.cwd(), ssrConfig.configOptions.paths.DIST_FOLDER);
const DIST_FOLDER_SERVER = join(process.cwd(),ssrConfig.configOptions.paths.DIST_FOLDER_SERVER);


const indexTemplate = readFileSync(join(DIST_FOLDER, "index.html")).toString();


