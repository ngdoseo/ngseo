import {
  Rule,
  SchematicContext,
  Tree,
  externalSchematic,
  chain,
  branchAndMerge,
  SchematicsException,
  apply,
  url,
  template,
  move,
  mergeWith
} from "@angular-devkit/schematics";
    
//hola  d
      

import * as ts from "typescript";
import { getWorkspace } from "../utility/config";
import { strings, experimental } from "@angular-devkit/core";
import {
  // getDecoratorMetadata,
  // findNode,
  addImportToModule
} from "../utility/ast-utils";
import { InsertChange } from "../utility/change";
//import { JsonObject } from "../core/src";

function getClientProjectOptions(
  host: Tree, options: any,
): experimental.workspace.WorkspaceProject {
  const workspace = getWorkspace(host);
  if (!options.clientProject) {
    options.clientProject = workspace['defaultProject'];
  }
  if (!options.clientProject) {
    options.clientProject = Object.keys(workspace['projects'])[0];
  }

  return options;
}

// function getWorkspacePath(host: Tree): string {
//   const possibleFiles = ["/angular.json", "/.angular.json"];

//   return possibleFiles.filter(path => host.exists(path))[0];
// }

function externalUniversal(options: any, host: Tree): Rule {
  //Check If Universal has already been launched
  const filePathServer = "/src/app/app.server.module.ts";
  let existsUniversal = host.exists(filePathServer);
  if (existsUniversal) {
    return (host: Tree, _context: SchematicContext) => {
      return host;
    };
  } else {
    //If universal has not yet been run get default project name
    const workspace = getWorkspace(host);
    if (options.clientProject === undefined) {
      options.clientProject = workspace["defaultProject"];
    }
    return branchAndMerge(
      externalSchematic("@schematics/angular", "universal", options)
    );
  }
}

// function changeConfigPaths(options: any): Rule {
//   return (host: Tree, context: SchematicContext) => {
//     const workspace = getWorkspace(host);
//     if (options.clientProject === undefined) {
//       options.clientProject = workspace["defaultProject"];
//     }

//     const clientProject = workspace.projects[options.clientProject as string];
//     if (!clientProject.architect) {
//       throw new SchematicsException("Client project architect not found.");
//     }

//     clientProject.architect.server.options.outputPath = "dist/server";
//     clientProject.architect.build.options.outputPath = "dist";
//     const workspacePath = getWorkspacePath(host);
//     host.overwrite(workspacePath, JSON.stringify(workspace, null, 2));

//     return host;
//   };
// }

function createFiles(options: any): Rule {
  const projectName=options.clientProject;
  const templateSource = apply(url("./files"), [
    template({
      ...strings,
      ...(options as object),
      stripTsExtension: (s: string) => {
        return s.replace(/\.ts$/, "");
      },
      projectName
    }),
    move("")
  ]);
  return mergeWith(templateSource);
}

function addModuleLoader(): Rule {
  return (host: Tree) => {

    host.getDir('src').visit(filePath => {
   
      if (!filePath.endsWith("app.server.module.ts")) {
        return
      }
      const content = host.read(filePath);
  
      if (!content) {
        throw new SchematicsException(`app.server.modulets does not exist.`);
      }
      const sourceText = content.toString("utf-8");

      const source = ts.createSourceFile(
        filePath,
        sourceText,
        ts.ScriptTarget.Latest,
        true
      );
   

      const importRecorder = host.beginUpdate(filePath);
      const importChanges = addImportToModule(
        source,
        filePath,
        "ModuleMapLoaderModule",
        "@nguniversal/module-map-ngfactory-loader"
      );
  
      for (const change of importChanges) {
        if (change instanceof InsertChange) {
          importRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(importRecorder);

      return host;
    });
  };
}

function addDependenciesandCreateScripts(options:any): Rule {
  return (host: Tree) => {
    const pkgPath = "/package.json";
    const buffer = host.read(pkgPath);
    if (buffer === null) {
      throw new SchematicsException("Could not find package.json");
    }

    const pkg = JSON.parse(buffer.toString());

//    const ngCoreVersion = pkg.dependencies["@angular/core"];

    pkg.scripts["webpack:server"] = "webpack --config projects/ssr/webpack.server.config.js --progress --colors";
    pkg.scripts["build:ssr"]= "npm run build:client-and-server-bundles && npm run webpack:server";
    pkg.scripts["serve:ssr"] = "node dist/"+ options.clientProject +"/server";
    pkg.scripts["spider:ssr"] = "node dist/"+ options.clientProject +"/spider",
    pkg.scripts["ssr"] = "npm run build:ssr && npm run serve:ssr";
    pkg.scripts["build:client-and-server-bundles"] =  "ng build --prod && ng run "+ options.clientProject +":server  && ts-node projects/ssr/utils/copyIndex.ts";
    pkg.scripts["webpack:spider"]= "webpack --config projects/ssr/webpack.spider.config.js --progress --colors";
    
    
    pkg.dependencies[ "@nguniversal/module-map-ngfactory-loader"] = "^6.0.0";
    pkg.dependencies["@nguniversal/express-engine"] = "^6.0.0";

    pkg.devDependencies["webpack"] = "^4.8.3";
    pkg.devDependencies["ts-loader"] =  "^4.3.0";
    pkg.devDependencies["webpack-cli"] = "^2.1.3";
    pkg.devDependencies["fs-extra"]="^6.0.1";


    host.overwrite(pkgPath, JSON.stringify(pkg, null, 2));

    return host;
  };
}

export function ssr(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {

    options = getClientProjectOptions(host,options);
  
    return chain([
      externalUniversal(options, host),
     // changeConfigPaths(options),
      addModuleLoader(),
      createFiles(options),
      addDependenciesandCreateScripts(options)
    ])(host, context);
  };
}
