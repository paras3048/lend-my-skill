import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadController } from './routes/upload/upload.controller';
import { UploadService } from './routes/upload/upload.service';
import { AuthModule } from './graphql/routes/auth/auth.module';
import { AuthController } from './routes/auth/auth.controller';
import { AuthService } from './routes/auth/auth.service';
import { UserSignupMiddleware } from './middlewares/user-signup.middleware';
import { UserLoginMiddleware } from './middlewares/user-login.middleware';
import { NotificationsController } from './routes/notifications/notifications.controller';
import { NotificationsService } from './routes/notifications/notifications.service';
import { ProfileController } from './routes/profile/profile.controller';
import { ProfileService } from './routes/profile/profile.service';
import { ProfileBioUpdateMiddleware } from './middlewares/profile-bio-update.middleware';
import { PostingsController } from './routes/postings/postings.controller';
import { PostingsService } from './routes/postings/postings.service';
import { UserStatusGateway } from './gateways/user-status.gateway';
import { OrdersGateway } from './gateways/orders.gateway';
import { WebhookController } from './routes/webhook/webhook.controller';
import { WebhookService } from './routes/webhook/webhook.service';
import { OrdersController } from './routes/orders/orders.controller';
import { OrdersService } from './routes/orders/orders.service';
import { ChatsController } from './routes/chats/chats.controller';
import { ChatsService } from './routes/chats/chats.service';
import { ChatsGateway } from './gateways/chats.gateway';
import { MessagesController } from './routes/messages/messages.controller';
import { MessagesService } from './routes/messages/messages.service';
import { MessagesGateway } from './gateways/messages.gateway';
import { CategoriesController } from './routes/categories/categories.controller';
import { CategoriesService } from './routes/categories/categories.service';
import { ReviewsService } from './routes/reviews/reviews.service';
import { ReviewsController } from './routes/reviews/reviews.controller';
import { SearchController } from './routes/search/search.controller';
import { SearchService } from './routes/search/search.service';
import { JwtService } from './services/jwt/jwt.service';
import { JwtController } from './services/jwt/jwt.controller';
import { EditController } from './routes/postings/edit/edit.controller';
import { EditService } from './routes/postings/edit/edit.service';
import { ErrorController } from './routes/error/error.controller';
import { ErrorService } from './routes/error/error.service';
import { ExploreController } from './routes/explore/explore.controller';
import { ExploreService } from './routes/explore/explore.service';

@Module({
  imports: [
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
    //   sortSchema: true,
    //   playground: true,
    //   cors: true,
    // }),
    // AuthModule,
  ],
  controllers: [
    AppController,
    UploadController,
    AuthController,
    NotificationsController,
    ProfileController,
    PostingsController,
    WebhookController,
    OrdersController,
    ChatsController,
    MessagesController,
    CategoriesController,
    ReviewsController,
    SearchController,
    JwtController,
    EditController,
    ErrorController,
    ExploreController,
  ],
  providers: [
    AppService,
    UploadService,
    AuthService,
    NotificationsService,
    ProfileService,
    PostingsService,
    UserStatusGateway,
    OrdersGateway,
    WebhookService,
    OrdersService,
    ChatsService,
    ChatsGateway,
    MessagesService,
    MessagesGateway,
    CategoriesService,
    ReviewsService,
    SearchService,
    JwtService,
    EditService,
    ErrorService,
    ExploreService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserSignupMiddleware).forRoutes('auth/signup');
    consumer.apply(UserLoginMiddleware).forRoutes('auth/login');
    // consumer
    //   .apply(ProfileBioUpdateMiddleware)
    //   .exclude('profile/details')
    //   .forRoutes('profile/bio', 'profile/detailed-bio');
  }
}
