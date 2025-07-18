import { http, HttpResponse } from 'msw';
import type {
  CharacterListResponse,
  CharacterDetailResponse,
  PlanetDetailResponse,
} from '../src/features/character/character.type';

export const handlers = [
  http.get('https://www.swapi.tech/api/people', ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') ?? '1';

    if (page === '1') {
      const response: CharacterListResponse = {
        message: 'ok',
        total_records: 82,
        total_pages: 9,
        previous: null,
        next: 'https://www.swapi.tech/api/people?page=2&limit=10',
        results: [
          {
            uid: '1',
            name: 'Jitendra Patel',
            url: 'https://www.swapi.tech/api/people/1',
          },
        ],
      };
      return HttpResponse.json(response);
    }

    return HttpResponse.json({
      message: 'ok',
      total_records: 82,
      total_pages: 9,
      previous: 'https://www.swapi.tech/api/people?page=1&limit=10',
      next: 'https://www.swapi.tech/api/people?page=3&limit=10',
      results: [],
    });
  }),

  http.get('https://www.swapi.tech/api/people/1', () => {
    const response: CharacterDetailResponse = {
      message: 'ok',
      result: {
        uid: '1',
        properties: {
          name: 'Jitendra Patel',
          height: '172',
          mass: '77',
          hair_color: 'blond',
          skin_color: 'fair',
          eye_color: 'black',
          birth_year: '1992',
          gender: 'male',
          homeworld: 'https://www.swapi.tech/api/planets/1',
          url: 'https://www.swapi.tech/api/people/1',
          created: '2025-18-01T00:00:00.000Z',
          edited: '2025-18-01T00:00:00.000Z',
        },
      },
    };
    return HttpResponse.json(response);
  }),

  http.get('https://www.swapi.tech/api/planets/1', () => {
    const response: PlanetDetailResponse = {
      message: 'ok',
      result: {
        uid: '1',
        properties: {
          name: 'Earth',
          rotation_period: '24',
          orbital_period: '365',
          diameter: '10465',
          climate: 'noraml',
          gravity: '3 standard',
          terrain: 'all types',
          surface_water: '1',
          population: '30000000',
          url: 'https://www.swapi.tech/api/planets/1',
          created: '2024-01-01T00:00:00.000Z',
          edited: '2024-01-01T00:00:00.000Z',
        },
      },
    };
    return HttpResponse.json(response);
  }),
];
