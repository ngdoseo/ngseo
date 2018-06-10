import { CommandScope, Option, SSRCommand} from '../utils/command';

import { tags, terminal } from '@angular-devkit/core';
import { exec_child } from '../utils/spwan';
import { zip } from 'rxjs';


export default class BuildCommand extends SSRCommand {
  public readonly name = 'build';
  public readonly description = 'Build the client and server side rendered (ssr) project';
  public static aliases = ['b'];
  public readonly scope = CommandScope.inProject;
  public arguments = ['schematic'];
  public options: Option[] = [

  ];

  private initialized = false;
  public async initialize(options: any) {
    if (this.initialized) {
      return;
    }
    super.initialize(options);
    this.initialized = true;



  }

  validate(options: any): boolean | Promise<boolean> {
    if (!options._[0]) {
      this.logger.error(tags.oneLine`
        The "ng generate" command requires a
        schematic name to be specified.
        For more details, use "ng help".`);

      return false;
    }

    return true;
  }

    public async run(options: any) {

    // remove the schematic name from the options
   // options._ = options._.slice(1);
    const clientBuild = exec_child("ng",["build","--prod"],this.logger)
    .subscribe(x=> console.log('Build completed  CLIENT APPLICATION'))

    return
  }




}
