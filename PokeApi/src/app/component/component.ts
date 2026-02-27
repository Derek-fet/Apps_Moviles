import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { PokemonDetails, PokemonListItem, PokemonListResponse } from '../models/pokemon.model';

@Component({
  selector: 'app-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './component.html',
  styleUrl: './component.css',
})
export class PokemonListComponent implements OnInit {
  // Signals para estado reactivo
  pokemonList = signal<PokemonDetails[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchQuery = signal('');
  currentPage = signal(0);
  totalCount = signal(0);

  private limit = 20;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPokemonList();
  }

  /**
   * Carga la lista de Pokémon con paginación
   */
  loadPokemonList(): void {
    this.loading.set(true);
    this.error.set(null);
    this.searchQuery.set('');

    const offset = this.currentPage() * this.limit;

    this.apiService.getPokemonList(this.limit, offset).subscribe({
      next: (response: PokemonListResponse) => {
        this.totalCount.set(response.count);
        
        // Obtener detalles de cada Pokémon
        const names = response.results.map(item => item.name);
        this.apiService.getPokemonMultiple(names).subscribe({
          next: (details) => {
            this.pokemonList.set(details);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set('Error al cargar detalles de Pokémon');
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        this.error.set('Error al cargar la lista de Pokémon');
        this.loading.set(false);
      }
    });
  }

  /**
   * Busca un Pokémon por nombre o ID
   */
  searchPokemon(): void {
    const query = this.searchQuery().toLowerCase().trim();
    
    if (!query) {
      this.currentPage.set(0);
      this.loadPokemonList();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.apiService.getPokemonDetails(query).subscribe({
      next: (pokemon) => {
        this.pokemonList.set([pokemon]);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(`Pokémon "${query}" no encontrado`);
        this.pokemonList.set([]);
        this.loading.set(false);
      }
    });
  }

  /**
   * Cambia a la siguiente página
   */
  nextPage(): void {
    const maxPages = Math.ceil(this.totalCount() / this.limit);
    if (this.currentPage() < maxPages - 1) {
      this.currentPage.update(p => p + 1);
      this.loadPokemonList();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Cambia a la página anterior
   */
  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.loadPokemonList();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Obtiene el color según el tipo de Pokémon
   */
  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return colors[type.toLowerCase()] || '#A8A878';
  }

  /**
   * Obtiene sprite válido del Pokémon
   */
  getSprite(pokemon: PokemonDetails): string {
    return this.apiService.getValidSprite(pokemon);
  }

  /**
   * Calcula el número de página actual
   */
  getCurrentPageNumber(): number {
    return this.currentPage() + 1;
  }

  /**
   * Calcula el número total de páginas
   */
  getTotalPages(): number {
    return Math.ceil(this.totalCount() / this.limit);
  }
}
