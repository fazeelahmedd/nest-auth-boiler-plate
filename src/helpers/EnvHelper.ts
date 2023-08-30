/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
export function appEnv(name: string, def?: any): any {
  let val = undefined;
  if (process.env[name] === undefined) {
    val = def;
  } else {
    val = process.env[name];
  }

  if (typeof val == 'string') {
    if (val.toLowerCase() == 'true') {
      val = true;
    } else if (val.toLowerCase() == 'false') {
      val = false;
    }
  }
  return val;
}
