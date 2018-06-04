import { Observable } from "rxjs";
import { SpawnOptions, spawn, ChildProcess, exec } from "child_process";
import {
    getSystemPath, Path, PathCannotBeFragmentException, normalize,
  } from '@angular-devkit/core';
  import { logging, terminal } from '@angular-devkit/core';
import { join } from "path";
import { Minimatch } from 'minimatch';
import * as minimist from 'minimist';
import { filter } from "rxjs/internal/operators/filter";
import {clearLine, cursorTo} from 'readline';
import { exec_child } from "../utils/spwan";









exec_child("ng",["serve"]).subscribe(X=>
  {
    console.log(X);
    exec_child("ng",[ "run toh-pt6:server"]).subscribe(p=> console.log('ahora si'))

  });