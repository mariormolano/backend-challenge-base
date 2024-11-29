import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MovieModule } from "src/features/movies/movie/movie.module";
import { AppService } from "./app.service";
import { AuthModule } from "src/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [AuthModule, MovieModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

