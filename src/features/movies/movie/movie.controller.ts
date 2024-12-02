import { Controller, Get, Post, Query, Res, Req } from "@nestjs/common";
import { Response } from "express";
import { MovieService } from "./movie.service";
import { SupabaseService } from "../../../auth/service/supabase/supabase.service";
import type { UserResponse } from "@supabase/supabase-js";

@Controller("movie")
export class MovieController {
  public constructor(private readonly movieService: MovieService) {}

  @Get()
  public async getMoviesDiscover(
    @Res() res: Response,
    @Query("page") page: number,
    @Query("genre") genre: number,
    @Query("query") query: string,
    @Query("orderby") orderBy: string,
  ): Promise<void> {
    if (!query) {
      res.status(400).json({ Error: "query is required" });
    } else {
      res
        .status(201)
        .json(
          await this.movieService.getMoviesWithConditionals(
            page ? Number(page) : 1,
            genre ? Number(genre) : 0,
            String(query),
            String(orderBy),
          ),
        );
    }
  }

  @Get("popular")
  public async getMoviesPopular(@Res() res: Response, @Query("page") page: number): Promise<void> {
    res.status(201).json(await this.movieService.getPopularMovies(page ? Number(page) : 1));
  }

  @Get("nowplaying")
  public async getMoviesNowPlaying(
    @Res() res: Response,
    @Query("page") page: number,
  ): Promise<void> {
    res.status(201).json(await this.movieService.getNowPlayingMovies(page ? Number(page) : 1));
  }

  @Get("upcoming")
  public async getMoviesUpcoming(@Res() res: Response, @Query("page") page: number): Promise<void> {
    res.status(201).json(await this.movieService.getUpcomingMovies(page ? Number(page) : 1));
  }

  @Get("toprated")
  public async getMoviesTopRated(@Res() res: Response, @Query("page") page: number): Promise<void> {
    res.status(201).json(await this.movieService.getTopRatedMovies(page ? Number(page) : 1));
  }

  @Get("favorite")
  public async getMoviesFavorite(@Res() res: Response, @Query("page") page: number): Promise<void> {
    res.status(201).json(await this.movieService.getFavoriteMovies(page ? Number(page) : 1));
  }

  @Post("favorite")
  public async setFavoriteMovie(
    @Res() res: Response,
    @Query("id") id: number,
    @Query("favorite") favorite: string,
  ): Promise<void> {
    if (!id) {
      res.status(400).json({ Error: "id is required" });
    } else {
      res.status(201).json(await this.movieService.setFavoriteMovie(id, favorite));
    }
  }

  @Get("protected")
  public async getprotected(
    @Req() req: Request,
    @Res() res: Response,
    @Query("page") page: number,
  ): Promise<void> {
    const supabase = new SupabaseService();
    const authHeader = req.headers["authorization"];
    const token: string = authHeader.replace("Bearer ", "");
    //const token: string = "fmskdfkwi303j2k34si39j32jr93jw9";
    await supabase
      .getUser(token)
      .then(async (user: UserResponse) => {
        if (user.data.user) {
          res.status(201).json(await this.movieService.getFavoriteMovies(page ? Number(page) : 1));
        } else {
          res.status(401).json({ Error: "Unauthorized" });
        }
      })
      .catch(() => {
        res.status(401).json({ Error: "Unauthorized" });
      });
  }

  @Post("protected")
  public async setprotected(
    @Req() req: Request,
    @Res() res: Response,
    @Query("id") id: number,
    @Query("favorite") favorite: string,
  ): Promise<void> {
    const supabase = new SupabaseService();
    const authHeader = req.headers["authorization"];
    const token: string = authHeader.replace("Bearer ", "");
    //const token: string = "fmskdfkwi303j2k34si39j32jr93jw9";
    await supabase
      .getUser(token)
      .then(async (user: UserResponse) => {
        if (user.data.user) {
          if (!id) {
            res.status(400).json({ Error: "id is required" });
          } else {
            res.status(201).json(await this.movieService.setFavoriteMovie(id, favorite));
          }
        } else {
          res.status(401).json({ Error: "Unauthorized" });
        }
      })
      .catch(() => {
        res.status(401).json({ Error: "Unauthorized" });
      });
  }
}
