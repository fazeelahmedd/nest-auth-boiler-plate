/* eslint-disable prettier/prettier */
module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'nestuser',
  password: 'nestpassword',
  database: 'nestdb',
  migrations: ['/dist/migrations/*{.ts,.js}'],
  entities: ['src/modules/**/*.entity.{ts,js}'],
};
