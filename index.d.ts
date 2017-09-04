interface EnvironmentSpec {
  defaultValue?: string;
  required?: boolean;
  type?: string;
}

interface Environment {
  [propName: string]: EnvironmentSpec;
}

type Parser = [string, (string) => any];

interface Options {
  parsers?: Parser[],
  mutable?: Boolean
}

export default function configeur(environment: Environment, options?: Options): Object;
