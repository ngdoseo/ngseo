import { webpackSSRConfig } from "../webpack/config";
import * as webpack from "webpack";
import { getWebpackStatsConfig } from "./helper";
import { ReplaySubject } from "rxjs";
import { exec_child, readConfig } from "./spwan";
import { Output } from "@angular/core";
import { join } from "path";
import { zip } from 'rxjs';
import { logging } from "@angular-devkit/core";
import { SSRCliOptions } from "./models";



export async function webpackRun(command: string,logger: logging.Logger) {
  const renderURL = new ReplaySubject<string>(100);
  let ssrConfig: SSRCliOptions = {
    cliOptions: {
      command:""
    },
    appOptions:{},
    configOptions:readConfig(),
  };
  const DIST_FOLDER = join(process.cwd(), ssrConfig.configOptions.paths.DIST_FOLDER);
  renderURL.subscribe((options: string) => {


    console.log('pase por aqu');
    console.log(ssrConfig.configOptions.paths.DIST_FOLDER + "/" + command);
    exec_child("node", [ssrConfig.configOptions.paths.DIST_FOLDER + "/" + command],logger).subscribe(x => {
  
      process.exit();
    });
  });

  const webpackConfig = Object.assign({}, webpackSSRConfig, {
    entry: { command: "./projects/ssr/webpack/" + command + ".ts" },
    output: {
      path: DIST_FOLDER,
      filename: command + ".js"
    }
  });

  const webpackCompiler = webpack(webpackConfig);
  const statsConfig = getWebpackStatsConfig(false);
  let i = 0;
  const callback: webpack.compiler.CompilerCallback = (err, stats) => {
    i = i + 1;
    if (err) {
      console.error(err);
    }

    const json = stats.toJson();

    renderURL.next(command);
 
  };
  webpackCompiler.run(callback);
}



