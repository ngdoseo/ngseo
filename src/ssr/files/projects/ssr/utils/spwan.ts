
import { Observable } from "rxjs";
import { SpawnOptions, spawn, ChildProcess } from "child_process";
import {
  getSystemPath,
  Path,
  PathCannotBeFragmentException,
  normalize
} from "@angular-devkit/core";
import { logging, terminal } from "@angular-devkit/core";
import { join } from "path";
import * as minimatch from "minimatch";
import * as minimist from "minimist";
import { filter } from "rxjs/internal/operators/filter";

//const puppeteer = require('puppeteer');
import * as puppeteer from "puppeteer";
import { readFileSync } from "fs";
import {   ConfigOptions } from "./models";
import { Logger } from "@angular-devkit/core/src/logger";

interface ProcessOutput {
  stdout: string;
  stderr: string;
}

export function readConfig():ConfigOptions {

 return JSON.parse(readFileSync(join(process.cwd(),'projects/ssr/ssr-config.json'),'utf-8'))

}

export function checkIgnoredRoutes(patterns: string[], url: string): boolean {
  if (patterns.length == 0) {
    return true;
  }

  if (patterns.filter(pat => minimatch(url, pat)).length != 0) {
    return false;
  } else {
    return true;
  }
}

export function checkEnsuredRoutes(patterns: string[], url: string): boolean {
  if (patterns.length == 0) {
    return false;
  }

  if (patterns.filter(pat => minimatch(url, pat)).length != 0) {
    return true;
  } else {
    return false;
  }
}

export function exec_child(
  cmd: string,
  args: string[],
  logger?: logging.Logger
 ): Observable<ProcessOutput> {
  return new Observable(obs => {

    const _root: Path = normalize("");
    args = args.filter(x => x !== undefined);
    let stdout = "";
    let stderr = "";
    let stdin = "";
    const spawnOptions: SpawnOptions = { cwd: getSystemPath(_root) };
    if (process.platform.startsWith("win")) {
      args.unshift("/c", cmd);
      cmd = "cmd.exe";
      spawnOptions["stdio"] = "pipe";
    }
    // const spawnOptions: SpawnOptions = { cwd: getSystemPath(_root) };



    const childProcess = spawn(cmd, args, spawnOptions);

    childProcess.stdout.on("data", (data: Buffer) => {

      logger.warn(data.toString("utf-8"));


    });

    childProcess.stderr.on(
      "data",
      (data: Buffer) =>
        {
          logger.info(data.toString("utf-8"));
        //  console.log("javier    " + data.toString() + "\n");
        }
    );


  //   childProcess.stdout.on('data', function(data) {
  //     console.log('stdout: jav ' + data);
  //     //Here is where the output goes
  // });
  //   childProcess.stderr.on('data', function(data) {
  //     console.log('stderr:jav2 ' + data);
  //     //Here is where the error output goes
  // });



    // Create the error here so the stack shows who called this function.
    // const err = new Error(
    //   `Running "${cmd} ${args.join(" ")}" returned error code `
    // );

    // childProcess.stdout.pipe(process.stdout)

    childProcess.on("message", code => {
      console.log('dentro 10 del mensaje');
    });

childProcess.on('messa',option=>
{
  console.log(option)
})

    childProcess.on("exit", code => {
      if (!code) {
        obs.next({ stdout, stderr });
      } else {
       // err.message += `${code}.\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}\n`;
        obs.error('err');
      }
      obs.complete();
    });
  });
}


