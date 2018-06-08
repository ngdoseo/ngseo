import { CommandScope, Option, SSRCommand} from '../utils/command';

import { tags, terminal } from '@angular-devkit/core';
import { exec_child, readConfig } from '../utils/spwan';
import { zip } from 'rxjs';
import { readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import {copy,emptyDir} from 'fs-extra';
import { SSRCliOptions } from '../utils/models';
import { ROUTES } from '../routes/routes';

export default class AddSeoCommand extends SSRCommand {
  public readonly name = 'add-seo';
  public readonly description = 'prepare seo filest';
  public static aliases = ['s'];
  public readonly scope = CommandScope.inProject;
  public arguments = ['schematic'];
  public options: Option[] = [
  ];
  public xmlintro = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
              http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`
public xmlend = `
 </urlset>`




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

    public async run(options: SSRCliOptions) {

      
let ssrConfig: SSRCliOptions = {
  cliOptions: {
    command:""
  },
  appOptions:{},
  configOptions:readConfig(),
};


      const SSR_FOLDER = join(process.cwd(), ssrConfig.configOptions.paths.SSR_FOLDER);
      const DIST_FOLDER = join(process.cwd(), ssrConfig.configOptions.paths.DIST_FOLDER);
      const DIST_FOLDER_SERVER = join(process.cwd(),ssrConfig.configOptions.paths.DIST_FOLDER_SERVER);

    let xmlUrl = ``;
    let today = new Date().toLocaleDateString();

    ROUTES.forEach(route=> {

   xmlUrl = xmlUrl +  `\n     <url> \n        <loc>` + options.configOptions.seo.website + route +
    `</loc> \n        <lastmod>` + today + `</lastmod> \n        <changefreq>`+  options.configOptions.seo.changefreq +
   `</changefreq>\n        <priority>`+  options.configOptions.seo.priority + `</priority>\n      </url> `


    });

    xmlUrl = this.xmlintro + xmlUrl + this.xmlend;
    writeFileSync(join(process.cwd(),'projects/ssr/seo/sitemap.xml'),xmlUrl)

    const files = readdirSync(join(process.cwd(),'projects/ssr/seo'));
    
    files.forEach(file=>{
      copy(join(process.cwd(),'projects/ssr/seo',file), join(DIST_FOLDER,file))
    })





    return
  }




}
