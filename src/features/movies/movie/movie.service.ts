import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, map } from "rxjs";

const cacheQuery = {};

// entrega 25 elementos por página que es la maxima visual en el frontend en una rejilla de 5x5
const itemsPerPage = 25;

// limita el número de páginas que se pueden solicitar a la API de TMDB a 10
// debido a que la API de TMDB limita el número de solicitudes por minuto
const pagesPerQuery = 10;

@Injectable()
export class MovieService {
  private readonly bearerToken = process.env.TMDB_BEARER_TOKEN;
  private readonly apiKey = process.env.TMDB_API_KEY;
  private readonly baseUrl = process.env.TMDB_BASE_URL;
  private readonly accountId = process.env.TMDB_ACCOUNT_ID;

  public totalPages: number = 1;
  public items: any[] = [];

  constructor(private readonly httpService: HttpService) {}

  public async getMoviesByTitle(query: string, page: number): Promise<any> {
    try {
      const params: object = {
        query: query,
        include_adult: false,
        language: "en-US",
        page: page,
        api_key: this.apiKey,
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/search/movie`, { params }).pipe(
          map((response) => {
            this.totalPages =
              response.data.total_pages > pagesPerQuery ? pagesPerQuery : response.data.total_pages;
            return response.data.results;
          }),
        ),
      );
      return response;
    } catch (error) {
      throw new HttpException("Error API of TMDB", HttpStatus.BAD_GATEWAY);
    }
  }

  public async getMoviesWithConditionals(
    page: number,
    genre: number,
    query: string,
    orderBy: string,
  ): Promise<any> {
    let pageCount = 1;
    let temporal: any[] = [];

    // Verifica si la consulta ya se encuentra en cacheQuery
    // para no repetir la consulta a la API
    if (cacheQuery[query]) {
      temporal = cacheQuery[query];
      if (genre > 0) {
        temporal = temporal.filter((movie) => {
          if (movie.genre_ids) {
            return movie.genre_ids.includes(genre);
          }
        });
      }
      if (orderBy === "title") {
        temporal.sort((a, b) => a.title.localeCompare(b.title));
      } else if (orderBy === "popularity") {
        temporal.sort((a, b) => b.popularity - a.popularity);
      }

      const response = {
        page: page,
        results: temporal.slice((page - 1) * itemsPerPage, page * itemsPerPage),
        total_pages: Math.ceil(temporal.length / itemsPerPage),
        total_results: temporal.length,
      };
      //console.log("Respuesta cacheada");
      return response;
    }

    while (pageCount <= this.totalPages) {
      const data = await this.getMoviesByTitle(query, pageCount).then((response) => {
        return response;
      });
      if (typeof data === "object") {
        this.items = this.items.concat(data);
      }
      pageCount++;
    }

    // Alamcena el resultado de la consulta en cacheQuery
    cacheQuery[query] = this.items;
    temporal = this.items;

    if (genre > 0) {
      temporal = temporal.filter((movie) => {
        if (movie.genre_ids) {
          return movie.genre_ids.includes(genre);
        }
      });
    }

    if (orderBy === "title") {
      temporal.sort((a, b) => a.title.localeCompare(b.title));
    } else if (orderBy === "popularity") {
      temporal.sort((a, b) => b.popularity - a.popularity);
    }

    this.items = [];

    const response = {
      page: page,
      results: temporal.slice((page - 1) * itemsPerPage, page * itemsPerPage),
      total_pages: Math.ceil(temporal.length / itemsPerPage),
      total_results: temporal.length,
    };

    //console.log("Respuesta de la API");

    return response;
  }

  public async getPopularMovies(page: number): Promise<any> {
    try {
      const params: object = {
        page: page,
        api_key: this.apiKey,
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/movie/popular`, { params }).pipe(
          map((response) => {
            return response.data;
          }),
        ),
      );
      return response;
    } catch (error) {
      throw new HttpException("Error API of TMDB", HttpStatus.BAD_GATEWAY);
    }
  }

  public async getNowPlayingMovies(page: number): Promise<any> {
    try {
      const params: object = {
        page: page,
        api_key: this.apiKey,
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/movie/now_playing`, { params }).pipe(
          map((response) => {
            return response.data;
          }),
        ),
      );
      return response;
    } catch (error) {
      throw new HttpException("Error API of TMDB", HttpStatus.BAD_GATEWAY);
    }
  }

  public async getUpcomingMovies(page: number): Promise<any> {
    try {
      const params: object = {
        page: page,
        api_key: this.apiKey,
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/movie/upcoming`, { params }).pipe(
          map((response) => {
            return response.data;
          }),
        ),
      );
      return response;
    } catch (error) {
      throw new HttpException("Error API of TMDB", HttpStatus.BAD_GATEWAY);
    }
  }

  public async getTopRatedMovies(page: number): Promise<any> {
    try {
      const params: object = {
        page: page,
        api_key: this.apiKey,
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/movie/top_rated`, { params }).pipe(
          map((response) => {
            return response.data;
          }),
        ),
      );
      return response;
    } catch (error) {
      throw new HttpException("Error API of TMDB", HttpStatus.BAD_GATEWAY);
    }
  }

  public async getFavoriteMovies(page: number): Promise<any> {
    try {
      const params: object = {
        page: page,
      };

      const headers: object = {
        Authorization: `Bearer ${this.bearerToken}`,
      };

      const response = await firstValueFrom(
        this.httpService
          .get(`${this.baseUrl}/account/${this.accountId}/favorite/movies`, { params, headers })
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
      return response;
    } catch (error) {
      const err = error as any;
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log(err);
      }

      throw new HttpException("Error API of TMDB", HttpStatus.BAD_GATEWAY);
    }
  }

  public async setFavoriteMovie(movieId: number, favorite: string): Promise<any> {
    try {
      const headers: object = {
        Authorization: `Bearer ${this.bearerToken}`,
        "Content-Type": "application/json",
      };

      const body: object = {
        media_type: "movie",
        media_id: Number(movieId),
        favorite: favorite === "true" ? true : false,
      };

      const response = await firstValueFrom(
        this.httpService
          .post(`${this.baseUrl}/account/${this.accountId}/favorite`, body, { headers })
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
      return response;
    } catch (error) {
      const err = error as any;
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log(err);
      }
      throw new HttpException("Error API of TMDB", HttpStatus.BAD_GATEWAY);
    }
  }
}

