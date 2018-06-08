
export interface SSRCliOptions
{
  appOptions:AppOptions
  cliOptions:CliOptions,
  configOptions:ConfigOptions,
}

export interface AppOptions {

}

export interface CliOptions {
  command?:string
}

export interface ConfigOptions {
  projectname:string,
  defaults: {
    platform:string,
    deploy:string,
  }
  server:{
    optimizecss:boolean,
    minifyhtml:true,
  }
  static: {
    optimizecss:boolean,
    minifyhtml:true,
  }
  seo:{
    website:string,
    priority:string,
    changefreq:string,
  }
  spider: {
    force:boolean,
    ignore:string[],
    whitelist:string[],
    add:string[],
  },
  paths:{
    DIST_FOLDER:string,
    DIST_FOLDER_SERVER:string,
    SSR_FOLDER:string,
    SRC_FOLDER:string
  }


}
