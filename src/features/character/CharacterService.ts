import type {
  CharacterListItem,
  CharacterListResponse,
  CharacterDetailResponse,
  CharacterProperties,
  PlanetDetailResponse,
  PlanetProperties,
} from './character.type';

import type { CharacterSearchResponse, CharacterSearchResultItem } from './character.type';

export const fetchCharacters = async (
  page = 1,
  search = '',
  limit = 10,
  signal?: AbortSignal
): Promise<CharacterListResponse> => {
  const isSearch = !!search.trim();
  const searchParam = isSearch ? `&name=${encodeURIComponent(search)}` : '';
  const url = `https://www.swapi.tech/api/people?page=${page}&limit=${limit}${searchParam}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Failed to fetch character list');

  if (isSearch) {
    const data: CharacterSearchResponse = await res.json();
    return {
      message: data.message,
      total_pages: 1,
      total_records: data.result.length ?? 0,
      previous: null,
      next: null,
      results: data.result.map(
        (item: CharacterSearchResultItem): CharacterListItem => ({
          uid: item.uid,
          name: item.properties.name,
          url: item.properties.url,
          gender: item.properties.gender,
          homeworld: item.properties.homeworld,
        })
      ),
    };
  } else {
    const data: CharacterListResponse = await res.json();
    return {
      message: data.message,
      total_pages: data.total_pages,
      total_records: data.total_records,
      previous: data.previous,
      next: data.next,
      results: data.results.map(
        (item): CharacterListItem => ({
          uid: item.uid,
          name: item.name,
          url: item.url,
        })
      ),
    };
  }
};

export const fetchCharacterDetail = async (
  url: string,
  signal?: AbortSignal
): Promise<CharacterProperties> => {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Failed to fetch character detail');

  const data: CharacterDetailResponse = await res.json();
  return data.result.properties;
};

export const fetchPlanet = async (url: string, signal?: AbortSignal): Promise<PlanetProperties> => {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Failed to fetch planet');

  const data: PlanetDetailResponse = await res.json();
  return data.result.properties;
};
