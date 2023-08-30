import { compare, genSalt, hash } from 'bcrypt-nodejs';

export async function Hashpassword(plainText: string): Promise<string> {
  return new Promise(function (resolve, reject) {
    genSalt(10, function (error, salt) {
      if (error) {
        reject(error);
      } else {
        hash(plainText, salt, null, function (error, hash) {
          if (error) {
            reject(error);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
}

export async function Comparepassword(
  plainText: string,
  hash: string,
): Promise<string> {
  return new Promise(function (resolve, reject) {
    compare(plainText, hash, function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
