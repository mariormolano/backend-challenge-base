import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "./guards/jwt.auth.guard";
import { SupabaseStrategy } from "./strategies/supabase.strategy";
import { SupabaseService } from "./service/supabase/supabase.service";

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>("JWT_SECRET"),
          signOptions: { expiresIn: 40000 },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtAuthGuard, SupabaseStrategy, SupabaseService],
  exports: [JwtAuthGuard, JwtModule],
  controllers: [],
})
export class AuthModule {}
