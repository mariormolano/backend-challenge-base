import { Controller, Get, Req, UseGuards } from "@nestjs/common";

import { AppService } from "./app.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.auth.guard";

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }

  @Get("/protected")
  @UseGuards(JwtAuthGuard)
  async protected(@Req() req) {
    return {
      message: "AuthGuard works!",
      authenticated_user: req.user,
    };
  }
}

