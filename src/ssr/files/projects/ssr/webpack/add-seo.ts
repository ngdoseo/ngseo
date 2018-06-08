import { logging } from "@angular-devkit/core";
import { initializeLogging } from "../ssr-cli";
import AddSeoCommand from "../commands/add-seo";
import { SSRCliOptions } from "../utils/models";
import { readConfig } from "../utils/spwan";

 const logger = new logging.IndentLogger('clissr');
 let loggingSubscription;

   loggingSubscription = initializeLogging(logger);



 const context = {
   project: 'angular.json'
 };

 let ssrConfig: SSRCliOptions = {
  cliOptions: {
    command:""
  },
  appOptions:{},
  configOptions:readConfig(),
};



 let seoCommand = new AddSeoCommand(context,logger);
 seoCommand.initialize({});
 seoCommand.run(ssrConfig)
