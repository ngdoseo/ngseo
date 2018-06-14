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
import { getWorkspace, getWorkspacePath } from "../utility/config";
import { strings, experimental } from "@angular-devkit/core";
import {
  // getDecoratorMetadata,
  // findNode,
  addImportToModule
} from "../utility/ast-utils";
import { InsertChange } from "../utility/change";
//import { JsonObject } from "../core/src";

function getClientProjectOptions(
  host: Tree,
  options: any
): experimental.workspace.WorkspaceProject {
  const workspace = getWorkspace(host);

  if (!options.clientProject) {
    options.clientProject = workspace["defaultProject"];
  }
  if (!options.clientProject) {
    options.clientProject = Object.keys(workspace["projects"])[0];
  }

  return options;
}

// function getWorkspacePath(host: Tree): string {
//   const possibleFiles = ["/angular.json", "/.angular.json"];

//   return possibleFiles.filter(path => host.exists(path))[0];
// }

function externalUniversal(options: any, host: Tree): Rule {
  const filePathServer = "/src/app/app.server.module.ts";
  let existsUniversal = host.exists(filePathServer);
  if (existsUniversal) {
    return (host: Tree, _context: SchematicContext) => {
      return host;
    };
  } else {
    //If universal has not yet been run get default project name

    return branchAndMerge(
      externalSchematic("@schematics/angular", "universal", options)
    );
  }
}

function changeConfigPaths(options: any, host: Tree): Rule {
  return (host: Tree) => {
    const workspace = getWorkspace(host);

    const clientProject = workspace.projects[options.clientProject];

    clientProject.architect.server.options.outputPath =
      clientProject.architect.build.options.outputPath + "-server";

    clientProject.architect.build.configurations["static"] =
      clientProject.architect.build.configurations["production"];
    clientProject.architect.build.configurations["static"][
      "fileReplacements"
    ] = [
      {
        replace: "src/environments/environment.ts",
        with: "src/environments/environment.seo.ts"
      }
    ];

    const workspacePath = getWorkspacePath(host);
    host.overwrite(workspacePath, JSON.stringify(workspace, null, 2));

    return host;
  };
}

function createFiles(options: any, host: Tree): Rule {
  const projectName = options.clientProject;
  const workspace = getWorkspace(host);

  const clientProject = workspace.projects[options.clientProject as string];

  const dist = clientProject.architect.build.options.outputPath;

  const distserver = dist + "-server";

  const templateSource = apply(url("./files"), [
    template({
      ...strings,
      ...(options as object),
      stripTsExtension: (s: string) => {
        return s.replace(/\.ts$/, "");
      },
      projectName,
      dist,
      distserver
    }),
    move("")
  ]);
  return mergeWith(templateSource);
}

function addModuleLoader(): Rule {
  return (host: Tree) => {
    host.getDir("src").visit(filePath => {
      if (!filePath.endsWith("app.server.module.ts")) {
        return;
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

function addDependenciesandCreateScripts(options: any): Rule {
  return (host: Tree) => {
    const pkgPath = "/package.json";
    const buffer = host.read(pkgPath);
    if (buffer === null) {
      throw new SchematicsException("Could not find package.json");
    }

    const pkg = JSON.parse(buffer.toString());

    (pkg.scripts["ssr:client"] = "ts-node projects/ssr/ssr-cli.ts --client"),
      (pkg.scripts["ssr:server"] = "ts-node projects/ssr/ssr-cli.ts --server"),
      (pkg.dependencies["@nguniversal/module-map-ngfactory-loader"] = "^6.0.0");
    pkg.dependencies["@nguniversal/express-engine"] = "^6.0.0";
    pkg.dependencies["webpack"] = "^4.8.3";
    pkg.dependencies["ts-loader"] = "^4.3.0";
    pkg.dependencies["fs-extra"] = "^6.0.1";
    pkg.dependencies["chalk"] = "^2.4.1";
    pkg.dependencies["webpack-node-externals"] = "^1.7.2";
    pkg.dependencies["progress-bar-webpack-plugin"] = "1.11.0";
    (pkg.devDependencies["@types/html-minifier"] = "^3.5.2"),
      (pkg.devDependencies["@types/minimatch"] = "^3.0.3"),
      (pkg.devDependencies["html-minifier"] = "^3.5.16"),
      (pkg.devDependencies["puppeteer"] = "^1.4.0"),
      (pkg.devDependencies["purify-css"] = "^1.2.5"),
      (pkg.devDependencies["yargs-parser"] = "^10.0.0");
    delete pkg.devDependencies["@angular/platform-server"];

    host.overwrite(pkgPath, JSON.stringify(pkg, null, 2));

    return host;
  };
}

export function ssr(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    options = getClientProjectOptions(host, options);

    return chain([
      externalUniversal(options, host),
      changeConfigPaths(options, host),
      addModuleLoader(),
      createFiles(options, host),
      addDependenciesandCreateScripts(options)
    ])(host, context);
  };
}
