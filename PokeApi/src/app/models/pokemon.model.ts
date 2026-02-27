// Respuesta de la lista de Pokémon
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

// Item en la lista de Pokémon
export interface PokemonListItem {
  name: string;
  url: string;
}

// Detalles completos de un Pokémon
export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  is_default: boolean;
  order: number;
  sprites: Sprites;
  types: PokemonType[];
  stats: Stat[];
  abilities: Ability[];
  moves: Move[];
  species: NamedResource;
  held_items: HeldItem[];
  forms: Form[];
  cries: Cries;
}

export interface Sprites {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
  other?: {
    dream_world?: {
      front_default: string | null;
      front_female: string | null;
    };
    home?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    'official-artwork'?: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
  versions?: any;
}

export interface PokemonType {
  slot: number;
  type: NamedResource;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: NamedResource;
}

export interface Ability {
  ability: NamedResource;
  is_hidden: boolean;
  slot: number;
}

export interface Move {
  move: NamedResource;
  version_group_details: VersionGroupDetail[];
}

export interface VersionGroupDetail {
  level_learned_at: number;
  move_learn_method: NamedResource;
  version_group: NamedResource;
}

export interface Form {
  name: string;
  url: string;
}

export interface HeldItem {
  item: NamedResource;
  version_details: VersionDetail[];
}

export interface VersionDetail {
  rarity: number;
  version: NamedResource;
}

export interface Cries {
  latest: string;
  legacy: string;
}

export interface NamedResource {
  name: string;
  url: string;
}
