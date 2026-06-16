import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita o CORS globalmente
  app.enableCors();

  // Pipe de validação global usando o class-validator/class-transformer
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Observação: a aplicação "docs" (Next.js) já está na porta 3001 por padrão.
  // Colocarei na 3002 ou de acordo com uma var de ambiente PORT, caindo na 3001
  // caso forçar.
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`🚀 REST API running on: http://localhost:${port}`);
}
bootstrap();
