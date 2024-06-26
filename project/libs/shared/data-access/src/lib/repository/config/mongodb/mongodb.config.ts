import { ConfigType, registerAs } from '@nestjs/config'
import { plainToClass } from 'class-transformer';
import { MongoConfigSchema } from './mongodb.schema';
import { DEFAULT_MONGODB_EXPRESS_PORT, DEFAULT_MONGODB_PORT } from './mongodb.constant';
import { ConfigEnvironment } from '@project/shared/core';

type PromisifiedConfig = Promise<ConfigType<typeof getConfig>>;

async function getConfig(): Promise<MongoConfigSchema> {
  const port = process.env.MONGODB_PORT || String(DEFAULT_MONGODB_PORT);
  const express_port = process.env.MONGODB_EXPRESS_PORT || String(DEFAULT_MONGODB_EXPRESS_PORT);
  const config = plainToClass(MongoConfigSchema, {
    port: parseInt(port, 10),
    express_port: parseInt(express_port, 10),
    host: process.env.MONGODB_HOST,
    dbName: process.env.MONGODB,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    authDatabase: process.env.MONGODB_AUTH_DATABASE
  })

  await config.validate();

  return config;
}

export default registerAs(ConfigEnvironment.DB, async (): PromisifiedConfig => {
  return getConfig();
})
