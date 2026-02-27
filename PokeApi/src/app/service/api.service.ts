import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PokemonListResponse, PokemonDetails } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://pokeapi.co/api/v2';
  private cache = new Map<string, PokemonDetails>();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de Pokémon con paginación
   * @param limit - Cantidad de resultados (por defecto 20)
   * @param offset - Desde dónde empieza (por defecto 0)
   */
  getPokemonList(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      `${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`
    ).pipe(
      catchError(error => {
        console.error('Error al cargar lista de Pokémon:', error);
        return throwError(() => new Error('No se pudo cargar la lista de Pokémon'));
      })
    );
  }

  /**
   * Obtiene detalles completos de un Pokémon por nombre o ID
   * @param nameOrId - Nombre o ID del Pokémon
   */
  getPokemonDetails(nameOrId: string | number): Observable<PokemonDetails> {
    const key = String(nameOrId).toLowerCase();

    // Verificar caché
    if (this.cache.has(key)) {
      return new Observable(observer => {
        observer.next(this.cache.get(key)!);
        observer.complete();
      });
    }

    return this.http.get<PokemonDetails>(
      `${this.apiUrl}/pokemon/${key}`
    ).pipe(
      tap(pokemon => {
        // Guardar en caché
        this.cache.set(key, pokemon);
      }),
      catchError(error => {
        console.error(`Error al cargar Pokémon ${nameOrId}:`, error);
        return throwError(() => new Error(`No se encontró Pokémon: ${nameOrId}`));
      })
    );
  }

  /**
   * Obtiene múltiples Pokémon de una vez
   * @param namesOrIds - Array de nombres o IDs
   */
  getPokemonMultiple(namesOrIds: (string | number)[]): Observable<PokemonDetails[]> {
    return new Observable(observer => {
      const pokemons: PokemonDetails[] = [];
      let completed = 0;

      namesOrIds.forEach((nameOrId, index) => {
        this.getPokemonDetails(nameOrId).subscribe({
          next: (pokemon) => {
            pokemons[index] = pokemon;
            completed++;
            if (completed === namesOrIds.length) {
              observer.next(pokemons);
              observer.complete();
            }
          },
          error: (err) => {
            completed++;
            if (completed === namesOrIds.length) {
              observer.next(pokemons.filter(p => p !== undefined));
              observer.complete();
            }
          }
        });
      });
    });
  }

  /**
   * Obtiene la URL válida del sprite de un Pokémon
   */
  getValidSprite(pokemon: PokemonDetails): string {
    return (
      pokemon.sprites.other?.['official-artwork']?.front_default ||
      pokemon.sprites.front_default ||
      'https://via.placeholder.com/200?text=No+Image'
    );
  }

  /**
   * Limpia la caché
   */
  clearCache(): void {
    this.cache.clear();
  }
}
