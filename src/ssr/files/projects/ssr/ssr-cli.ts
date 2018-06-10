import * as minimist from "minimist";

import { readdirSync, readFileSync } from "fs";
import { join, normalize, resolve } from "path";
import { Observable, ReplaySubject } from "rxjs";
import { clearLine, cursorTo, moveCursor } from "readline";

import { filter } from "rxjs/internal/operators/filter";
import { webpackSSRConfig } from "./webpack/config";
import { logging, terminal } from "@angular-devkit/core";
import { exec_child, readConfig } from "./utils/spwan";

import { SSRCliOptions } from "./utils/models";
import { runCommand } from "./utils/command-runner";
import { Launchserver } from "./utils/expressserver";
const events = require("events");





function loadCommands() {

  return {


    // Other.
   // 'config': require('../../commands/config').default,
   // 'help': require('../../commands/help').default,
    // 'serve': require('./commands/serve').default,
      'build': require('./commands/build').default,
     'static': require('./commands/static').default,
     'express': require('./commands/express').default,
     'spider': require('./commands/spider').default,
     'add-seo': require('./commands/add-seo').default,





  }
}





let standardInput;
try {
  standardInput = process.stdin;
} catch (e) {
  delete process.stdin;
  process.stdin = new events.EventEmitter();
  standardInput = process.stdin;
}


const commands = loadCommands();

cli({
  cliArgs: process.argv.slice(2),
  inputStream: standardInput,
  outputStream: process.stdout,
})
  .then(function(exitCode: number) {
   console.log(exitCode);
  })
  .catch(function(err: Error) {
    console.log("Unknown error: " + err.toString());
    process.exit(127);
  })






async function server(){
  let appServer = await Launchserver();
    appServer.listen(4200, async () => {
      console.log('server app')
})
}

 async function cli(options: any) {
  // ensure the environemnt variable for dynamic paths
  process.env.PWD = normalize(process.env.PWD || process.cwd());
  process.env.CLI_ROOT = process.env.CLI_ROOT || resolve(__dirname, '..', '..');

  const commands = loadCommands();

  const logger = new logging.IndentLogger('clissr');
  let loggingSubscription;

    loggingSubscription = initializeLogging(logger);



  const context = {
    project: 'angular.json'
  };

  try {

    const maybeExitCode = await runCommand( commands,options.cliArgs, logger, context);
    if (typeof maybeExitCode === 'number') {
      console.assert(Number.isInteger(maybeExitCode));

      return maybeExitCode;
    }

    return 0;
  } catch (err) {
    if (err instanceof Error) {
      logger.fatal(err.message);
      logger.fatal(err.stack);
    } else if (typeof err === 'string') {
      logger.fatal(err);
    } else if (typeof err === 'number') {
      // Log nothing.
    } else {
      logger.fatal('An unexpected error occured: ' + JSON.stringify(err));
    }

    if (options.testing) {
      debugger;
      throw err;
    }

    loggingSubscription.unsubscribe();
    return 1;
  }
}

// Initialize logging.
export function initializeLogging(logger: logging.Logger) {
  return logger
    .pipe(filter(entry => (entry.level != 'debug')))
    .subscribe(entry => {
      let color = (x: string) => terminal.dim(terminal.white(x));
      let output = process.stdout;
      switch (entry.level) {
        case 'info':
          color = terminal.white;
          break;
        case 'warn':
          color = terminal.yellow;
          break;
        case 'error':
          color = terminal.red;
          output = process.stderr;
          break;
        case 'fatal':
          color = (x) => terminal.bold(terminal.red(x));
          output = process.stderr;
          break;
      }

      cursorTo(output,0);
      clearLine(output,0);

      output.write(color(entry.message));
    });
}


