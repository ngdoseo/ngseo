import {
  Option,
  CommandContext,
  SSRCommand,
  CommandConstructor,
  CommandScope,
  ArgumentStrategy
}  from "./command";
import { logging, terminal } from '@angular-devkit/core';
import * as yargsParser from "yargs-parser";
import * as minimist from "minimist";
import { SSRCliOptions } from "./models";
import { readConfig } from "./spwan";
import StaticCommand from "../commands/static";
import SpiderCommand from "../commands/spider";
import { webpackRun} from "./webpacklaunch";
import ExpressCommand from "../commands/express";

export interface CommandMap {
  [key: string]: CommandConstructor;
}


export async function runCommand(
  commandMap:CommandMap,
  args: string[],
  logger: logging.Logger,
  context: CommandContext
): Promise<number | void> {

  const rawOptions = yargsParser(args, {
    alias: { help: ["h"] },
    boolean: ["help"]
  });

  const argsm = minimist(args, {
  });



  let ssrConfig: SSRCliOptions = {
    cliOptions: {
      command:""
    },
    appOptions:{},
    configOptions:readConfig(),
  };


  const platforms = ["server", "client"];
  const flatArgv = Object.keys(argsm).map(x => x);

  const platformId = flatArgv.filter(x => platforms.indexOf(x) != -1);

  const availableCommands = ["build", "add-seo", "spider", "static", "express"];


  if (flatArgv[2]==undefined)
  {
   
    throw `You must choose a command from ${availableCommands} `;
  }
  let commandRequested:any = availableCommands.indexOf(flatArgv[2])



  if (commandRequested == -1) {
    throw `You must choose a command from ${availableCommands} `;
  } else if (commandRequested.length > 1)
    throw `You must choose only on1 command from ${availableCommands} `;
  else {
    ssrConfig.cliOptions.command = flatArgv[2];
  }



  switch (platformId.length) {
    case 2:
      throw "You must choose between server or client rendering process --server or --client";
    case 1:
      ssrConfig.configOptions.defaults.platform = platformId[0];
    default:
      break;
  }

  if (ssrConfig.configOptions.defaults.platform=="server")
  {

    await webpackRun(ssrConfig.cliOptions.command,logger);




  }
  else{
    let Cmd: CommandConstructor;

    Cmd = findCommand(commandMap, ssrConfig.cliOptions.command);


  const command = new Cmd(context, logger);


await command.initialize(ssrConfig);
command.run(ssrConfig)



//args = await command.initializeRaw(args);
// let options = parseOptions(
//   args,
//   command.options,
//   command.arguments,
//   command.argStrategy
// );



  }

}

function findCommand(map: CommandMap, name: string): CommandConstructor | null {

  let Cmd: CommandConstructor = map[name];

  if (!Cmd) {
    // find command via aliases
    Cmd = Object.keys(map)
      .filter(key => {
        if (!map[key].aliases) {
          return false;
        }
        const foundAlias = map[key].aliases.filter(
          (alias: string) => alias === name
        );

        return foundAlias.length > 0;
      })
      .map(key => {
        return map[key];
      })[0];
  }

  if (!Cmd) {
    return null;
  }
  return Cmd;
}

function listAllCommandNames(map: CommandMap): string[] {
  return Object.keys(map).concat(
    Object.keys(map).reduce(
      (acc, key) => {
        if (!map[key].aliases) {
          return acc;
        }

        return acc.concat(map[key].aliases);
      },
      [] as string[]
    )
  );
}
