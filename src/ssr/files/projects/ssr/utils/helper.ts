import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { parse, stringify, root, rule, decl, atRule } from "postcss";
import * as purify from "purify-css";
import { createDocument } from "domino";
import {minify} from "html-minifier";
//import * as minimatch from 'minimatch';
import {filter}  from 'minimatch';

export function getWebpackStatsConfig(verbose = false) {
  return verbose
    ? Object.assign(webpackOutputOptions, verboseWebpackOutputOptions)
    : webpackOutputOptions;
}
import {
  statsToString,
  statsWarningsToString,
  statsErrorsToString
} from "../webpack/stats";
import { ReplaySubject } from "rxjs";
import { exec_child } from "./spwan";
const webpackOutputOptions = {
  colors: true,
  hash: true, // required by custom stat output
  timings: true, // required by custom stat output
  chunks: true, // required by custom stat output
  chunkModules: false,
  children: false, // listing all children is very noisy in AOT and hides warnings/errors
  modules: false,
  reasons: false,
  warnings: true,
  errors: true,
  assets: true, // required by custom stat output
  version: false,
  errorDetails: false,
  moduleTrace: false
};

const verboseWebpackOutputOptions = {
  children: true,
  assets: true,
  version: true,
  reasons: true,
  chunkModules: false, // TODO: set to true when console to file output is fixed
  errorDetails: true,
  moduleTrace: true
};


const renderURL = new ReplaySubject<string>(100);


