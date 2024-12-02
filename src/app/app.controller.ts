import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.auth.guard";

import { AppService } from "./app.service";

interface RequestUser extends Request {
  user: {
    userId: number;
    username: string;
  };
}

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public getHello(@Req() req: RequestUser): object {
    return req.user;
  }
}
