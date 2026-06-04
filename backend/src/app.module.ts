// /backend/src/app.module.ts
BullModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    connection: {
      host: configService.get('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
      password: configService.get('REDIS_PASSWORD'),
      tls: configService.get('NODE_ENV') !== 'development' ? {} : undefined,
    },
  }),
  inject: [ConfigService],
}),

CacheModule.register({
  isGlobal: true,
  ttl: 300,  // 5 minutos por defecto
  max: 100,  // máximo 100 elementos en caché
}),