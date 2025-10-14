module.exports = {
  type: 'sqlite',
  database: 'finance.db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
