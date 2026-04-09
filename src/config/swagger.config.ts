import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Setup swagger for the application
 * @param app Nest application
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription(
      'Production-grade API for Amazon-like system. \n\n' +
        '### Auth Flow\n' +
        '1. Login via `POST /auth/login` to get an access token.\n' +
        '2. Click the **Authorize** button at the top right.\n' +
        '3. Enter the token in the format: `Bearer <your-token>`.\n' +
        '4. Testing protected APIs is now enabled.',
    )
    .setVersion('1.0')
    .addTag('Auth', 'Authentication and Authorization')
    .addTag('Users', 'User management and profiles')
    .addTag('Products', 'Product catalog and management')
    .addTag('Cart', 'Shopping cart operations')
    .addTag('Orders', 'Order processing and history')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name must match with @ApiBearerAuth('JWT-auth')
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
    customSiteTitle: 'E-commerce API Docs',
  });
}
