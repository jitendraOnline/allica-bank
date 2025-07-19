import localStorageUtils from '../../shared/storage.utils';
import type {
  CharacterListItem,
  CharacterListResponse,
  CharacterDetailResponse,
  CharacterProperties,
  PlanetDetailResponse,
  PlanetProperties,
  CharacterSearchResponse,
  CharacterSearchResultItem,
} from './character.type';

export const fetchCharacters = async (
  page = 1,
  search = '',
  limit = 10,
  signal?: AbortSignal
): Promise<CharacterListResponse> => {
  const isSearch = !!search.trim();
  const searchParam = isSearch ? `&name=${encodeURIComponent(search)}` : '';
  const url = `https://www.swapi.tech/api/people?expanded=true&page=${page}&limit=${limit}${searchParam}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Failed to fetch character list');
  const data = await res.json();
  if (isSearch) {
    const searchData = data as CharacterSearchResponse;

    const results: CharacterListItem[] = searchData.result.map(
      (item: CharacterSearchResultItem) => {
        const p = item.properties;
        return {
          uid: item.uid,
          name: p.name,
          url: p.url,
          gender: p.gender,
          homeworld: p.homeworld,
        };
      }
    );

    return {
      message: searchData.message,
      total_pages: 1,
      total_records: results.length,
      previous: null,
      next: null,
      results,
    };
  }

  const paginatedResults: CharacterListItem[] = data.results.map(
    (item: CharacterSearchResultItem) => {
      const p: CharacterProperties = item.properties;
      return {
        uid: item.uid,
        name: p.name,
        url: p.url,
        gender: p.gender,
        homeworld: p.homeworld,
      };
    }
  );

  return {
    message: data.message,
    total_pages: data.total_pages,
    total_records: data.total_records,
    previous: data.previous,
    next: data.next,
    results: paginatedResults,
  };
};

export const fetchCharacterDetail = async (
  url: string,
  signal?: AbortSignal
): Promise<CharacterProperties> => {
  const res = await fetch(`https://www.swapi.tech/api/people/${url}`, { signal });
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

export const fetchAllFilms = async (signal?: AbortSignal) => {
  const res = await fetch(`https://www.swapi.tech/api/films`, { signal });
  const data = await res.json();
  return data.result.map((item: any) => item.properties);
};

const FAV_KEY = 'favouriteCharacters';

export function getFavourites(): Record<string, CharacterListItem> {
  return localStorageUtils.get<Record<string, CharacterListItem>>(FAV_KEY) ?? {};
}

export function addFavourite(character: CharacterListItem) {
  const favs = getFavourites();
  favs[character.uid] = character;
  localStorageUtils.set(FAV_KEY, favs);
}

export function removeFavourite(uid: string) {
  const favs = getFavourites();
  delete favs[uid];
  localStorageUtils.set(FAV_KEY, favs);
}

export function isFavourite(uid: string): boolean {
  return uid in getFavourites();
}
