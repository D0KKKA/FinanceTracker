module.exports = {
  type: 'sqlite',
  database: process.env.DATABASE_PATH || 'finance.db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
