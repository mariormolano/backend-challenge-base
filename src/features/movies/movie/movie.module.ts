import { Module } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { MovieController } from "./movie.controller";
import { HttpModule, HttpService } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}

