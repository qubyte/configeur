export default configure;

declare function configure(environment: configeur.Environment, options?: configeur.Options): Object;

declare namespace configeur {
  export interface Environment {
    [propName: string]: EnvironmentSpec;
  }
  export interface EnvironmentSpec {
    defaultValue?: string;
    required?: boolean;
    type?: string;
  }
  export interface Options {
    parsers?: Parser[],
    mutable?: Boolean
  }
  export type Parser = [string, (string) => any]
}
