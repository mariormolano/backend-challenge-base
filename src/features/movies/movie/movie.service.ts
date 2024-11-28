import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class MoviesService {
  private readonly bearerToken = process.env.TMDB_BEARER_TOKEN;
  private readonly baseUrl = process.env.TMDB_BASE_URL;

  constructor(private readonly httpService: HttpService) {}

  async getMoviesDiscover(genre: string, popularity: string, title: string) {
    try {
      const url = `${this.baseUrl}/discover/movie?api_key=${this.bearerToken}&with_genres=${genre}`;
    } catch (error) {
      throw new HttpException("Failed to fetch movies from TMDB", HttpStatus.BAD_GATEWAY);
    }
  }
}

// async getMovies(filters: { genre?: string; popularity?: string; title?: string }) {
//   const { genre, popularity, title } = filters;

//   try {
//     const query = new URLSearchParams({api_key: this.apiKey,...(title && { query: title }),...(popularity && { sort_by: "popularity.desc" }),});

//     const endpoint = title ? "search/movie" : "discover/movie";
//     const url = `${this.baseUrl}/${endpoint}?${query.toString()}`;

//     const response = await firstValueFrom(this.httpService.get(url));
//     const movies = response.data.results;

//     if (genre) {
//       return movies.filter((movie) => movie.genre_ids.includes(parseInt(genre)));
//     }

//     return movies;
//   } catch (error) {
//     throw new HttpException("Failed to fetch movies from TMDB", HttpStatus.BAD_GATEWAY);
//   }
// }

