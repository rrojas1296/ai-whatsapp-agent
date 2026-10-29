import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ConfigService } from "@nestjs/config";
import { Environments } from "./config/environment.js";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const config = app.get(ConfigService<Environments, true>);
  app.enableShutdownHooks();
  await app.listen(config.get("PORT", { infer: true }));
}
await bootstrap();
