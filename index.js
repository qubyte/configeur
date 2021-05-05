import processConfig from './lib/process-config.js';
import makeParsers from './lib/make-parsers.js';

export default function configeur(schema, options = {}) {
  return processConfig(schema, process.env, makeParsers(options.parsers), options.mutable);
}
