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
    const name = url.searchParams.get('name') ?? '';
    if (name === 'Search Patel') {
      return HttpResponse.json({
        result: [
          {
            properties: {
              created: '2025-07-17T19:23:47.137Z',
              edited: '2025-07-17T19:23:47.137Z',
              name: 'Search Patel',
              gender: 'male',
              skin_color: 'fair',
              hair_color: 'blond',
              height: '172',
              eye_color: 'blue',
              mass: '77',
              homeworld: 'https://www.swapi.tech/api/planets/sp1',
              birth_year: '19BBY',
              url: 'https://www.swapi.tech/api/people/sp1',
            },
            _id: '5f63a36eee9fd7000499be42',
            description: 'A person within the Star Wars universe',
            uid: '1',
            __v: 2,
          },
        ],
      });
    }
    if (name.length > 0) {
      return HttpResponse.json({
        message: 'ok',
        total_records: 0,
        total_pages: 1,
        previous: null,
        next: null,
        results: [],
      });
    }

    if (page === '1') {
      const response: CharacterListResponse = {
        message: 'ok',
        total_records: 3,
        total_pages: 3,
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
    if (page === '2') {
      const response: CharacterListResponse = {
        message: 'ok',
        total_records: 3,
        total_pages: 3,
        previous: 'https://www.swapi.tech/api/people?page=1&limit=10',
        next: 'https://www.swapi.tech/api/people?page=3&limit=10',
        results: [
          {
            uid: '2',
            name: 'Jitendra Patel Page 2',
            url: 'https://www.swapi.tech/api/people/2',
          },
        ],
      };
      return HttpResponse.json(response);
    }
    if (page === '3') {
      const response: CharacterListResponse = {
        message: 'ok',
        total_records: 3,
        total_pages: 3,
        previous: 'https://www.swapi.tech/api/people?page=1&limit=10',
        next: null,
        results: [
          {
            uid: '3',
            name: 'Jitendra Patel Page 3',
            url: 'https://www.swapi.tech/api/people/2',
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

  http.get('https://www.swapi.tech/api/people/sp1', () => {
    const response: CharacterDetailResponse = {
      message: 'ok',
      result: {
        uid: 'sp1',
        properties: {
          name: 'Search Patel',
          height: '172',
          mass: '77',
          hair_color: 'black',
          skin_color: 'fair',
          eye_color: 'black',
          birth_year: '1992',
          gender: 'male',
          homeworld: 'https://www.swapi.tech/api/planets/sp1',
          url: 'https://www.swapi.tech/api/people/sp1',
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

  http.get('https://www.swapi.tech/api/planets/sp1', () => {
    const response: PlanetDetailResponse = {
      message: 'ok',
      result: {
        uid: 'sp1',
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
