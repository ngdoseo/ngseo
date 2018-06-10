
import { exec_child, readConfig } from '../utils/spwan';
import { zip } from 'rxjs';
import { logging } from '@angular-devkit/core';
import { initializeLogging } from '../ssr-cli';
import { SSRCliOptions } from '../utils/models';
const logger = new logging.IndentLogger('clissr');
let loggingSubscription;

let ssrConfig: SSRCliOptions = {
  cliOptions: {
    command:""
  },
  appOptions:{},
  configOptions:readConfig(),
};

  loggingSubscription = initializeLogging(logger);
    const clientBuild = exec_child("ng",["build","--prod"],logger)
    const serverBuild = exec_child("ng",["run",ssrConfig.configOptions.projectname + ":server"],logger)
    const zipbuild = zip(clientBuild,serverBuild);
    zipbuild.subscribe(x=> console.log('Build completed SERVER and CLIENT APPLICATION'))
