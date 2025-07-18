import type {
  CharacterListItem,
  CharacterListResponse,
  CharacterDetailResponse,
  CharacterProperties,
  PlanetDetailResponse,
  PlanetProperties,
} from './character.type';

export const fetchCharacters = async (page = 1, limit = 10): Promise<CharacterListItem[]> => {
  const res = await fetch(`https://www.swapi.tech/api/people?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch character list');

  const data: CharacterListResponse = await res.json();
  return data.results;
};

export const fetchCharacterDetail = async (url: string): Promise<CharacterProperties> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch character detail');

  const data: CharacterDetailResponse = await res.json();
  return data.result.properties;
};

export const fetchPlanet = async (url: string): Promise<PlanetProperties> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch planet');

  const data: PlanetDetailResponse = await res.json();
  return data.result.properties;
};
