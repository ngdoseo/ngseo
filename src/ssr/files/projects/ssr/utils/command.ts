import { logging, terminal, strings } from "@angular-devkit/core";
import { join } from "path";
import { readFileSync } from "fs";

export interface CommandConstructor {
  new (context: CommandContext, logger: logging.Logger): SSRCommand;
  aliases: string[];
  scope: CommandScope.everywhere;
}

export enum CommandScope {
  everywhere,
  inProject,
  outsideProject
}

export interface GetOptionsOptions {
  comamndName: string;
}

export interface GetOptionsResult {
  options: Option[];
  arguments: Option[];
}

export enum ArgumentStrategy {
  MapToOptions,
  Nothing
}

export abstract class SSRCommand<T = any> {
  protected _rawArgs: string[];
  public allowMissingWorkspace = false;
  private _deAliasedName: string;
  private _originalOptions: Option[];
  //readonly options: Option[] = [];
  constructor(context: CommandContext, logger: logging.Logger) {
    this.logger = logger;
    if (context) {
      this.project = context.project;
    }
  }

  async initializeRaw(args: string[]): Promise<any> {
    this._rawArgs = args;
    return args;
  }
  async initialize(_options: any): Promise<void> {
    return;
  }

  protected getSChemaJson(schemaName: string): string {
    const p = join(__dirname, "../commands/", schemaName, "schema.json");

    return readFileSync(p, "utf-8");
  }

  protected getOptions(options: GetOptionsOptions): Promise<GetOptionsResult> {
    const properties = JSON.parse(this.getSChemaJson(options.comamndName))
      .properties;

    const keys = Object.keys(properties);
    const availableOptions = keys
      .map(key => ({ ...properties[key], ...{ name: strings.dasherize(key) } }))
      .map(opt => {
        let type;
        const schematicType = opt.type;
        switch (opt.type) {
          case "string":
            type = String;
            break;
          case "boolean":
            type = Boolean;
            break;
          case "integer":
          case "number":
            type = Number;
            break;

          // Ignore arrays / objects.
          default:
            return null;
        }
        let aliases: string[] = [];
        if (opt.alias) {
          aliases = [...aliases, opt.alias];
        }
        if (opt.aliases) {
          aliases = [...aliases, ...opt.aliases];
        }
        const schematicDefault = opt.default;

        return {
          ...opt,
          aliases,
          type,
          schematicType,
          default: undefined, // do not carry over schematics defaults
          schematicDefault,
          hidden: opt.visible === false
        };
      })
      .filter(x => x);

    const commandOptions = availableOptions.filter(
      opt => opt.$default === undefined || opt.$default.$source !== "argv"
    );

    const commandArguments = availableOptions
      .filter(
        opt => opt.$default !== undefined && opt.$default.$source === "argv"
      )
      .sort((a, b) => {
        if (a.$default.index === undefined) {
          return 1;
        }
        if (b.$default.index === undefined) {
          return -1;
        }
        if (a.$default.index == b.$default.index) {
          return 0;
        } else if (a.$default.index > b.$default.index) {
          return 1;
        } else {
          return -1;
        }
      });

    this.options = commandOptions;
    return Promise.resolve({
      options: commandOptions,
      arguments: commandArguments
    });
  }

  validate(_options: T): boolean | Promise<boolean> {
    return true;
  }

  printHelp(_options: T): void {
    this.printHelpUsage(this.name, this.arguments, this.options);
    this.printHelpOptions(this.options);
  }

  protected printHelpUsage(name: string, args: string[], options: Option[]) {
    const argDisplay =
      args && args.length > 0 ? " " + args.map(a => `<${a}>`).join(" ") : "";
    const optionsDisplay = options && options.length > 0 ? ` [options]` : ``;
    this.logger.info(`usage: ssr ${name}${argDisplay}${optionsDisplay}`);
  }

  protected printHelpOptions(options: Option[]) {
    if (options && this.options.length > 0) {
      this.logger.info(`options:`);
      this.options
        .filter(o => !o.hidden)
        .sort((a, b) => (a.name >= b.name ? 1 : -1))
        .forEach(o => {
          const aliases =
            o.aliases && o.aliases.length > 0
              ? "(" + o.aliases.map(a => `-${a}`).join(" ") + ")"
              : "";
          this.logger.info(`  ${terminal.cyan("--" + o.name)} ${aliases}`);
          this.logger.info(`    ${o.description}`);
        });
    }
  }

  abstract run(options: T): number | void | Promise<number | void>;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly arguments: string[];
  abstract options: Option[];
  public argStrategy = ArgumentStrategy.MapToOptions;
  public hidden = false;
  public unknown = false;
  public scope = CommandScope.inProject;
  protected readonly logger: logging.Logger;
  protected readonly project: any;
}

export interface CommandContext {
  project: any;
}

export abstract class Option {
  abstract readonly name: string;
  abstract readonly description: string;
  readonly default?: string | number | boolean;
  readonly required?: boolean;
  abstract readonly aliases?: string[];
  abstract readonly type: any;
  readonly format?: string;
  readonly values?: any[];
  readonly hidden?: boolean = false;
}
