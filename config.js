const config = {
  SERVICE_NAME: process.env.npm_package_name,
  SERVICE_VERSION: process.env.npm_package_version,
  PORT: process.env.BIGFOOT_DATA_SERVICE_PORT ?? 80,
  REDIS_URL: process.env.BIGFOOT_DATA_SERVICE_REDIS_URL ?? 'redis://localhost:6379/0'
}

export default config
