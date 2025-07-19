import { http, HttpResponse } from 'msw';
import type {
  CharacterListResponse,
  CharacterDetailResponse,
  PlanetDetailResponse,
  CharacterSearchResponse,
} from '../src/features/character/character.type';

export const handlers = [
  // 🧠 LIST + SEARCH ENDPOINT
  http.get('https://www.swapi.tech/api/people', ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') ?? '1';
    const name = url.searchParams.get('name') ?? '';

    // 🔍 SEARCH RESPONSE
    if (name === 'Search Patel') {
      const searchResponse: CharacterSearchResponse = {
        message: 'ok',
        result: [
          {
            _id: '5f63a36eee9fd7000499be42',
            uid: 'sp1',
            __v: 2,
            description: 'A person within the Star Wars universe',
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
          },
        ],
      };
      return HttpResponse.json(searchResponse);
    }

    if (name.length > 0) {
      const searchResponse: CharacterSearchResponse = {
        message: 'ok',
        result: [],
      };
      return HttpResponse.json(searchResponse);
    }

    // 📃 PAGINATED LIST
    const getPaginatedResponse = (page: string): CharacterListResponse => {
      const common = {
        message: 'ok' as const,
        total_records: 3,
        total_pages: 3,
      };

      const makeItem = (uid: string, name: string, planetId: string): any => ({
        uid,
        name,
        url: `https://www.swapi.tech/api/people/${uid}`,
        properties: {
          name,
          height: '172',
          mass: '77',
          hair_color: 'blond',
          skin_color: 'fair',
          eye_color: 'black',
          birth_year: '1992',
          gender: 'male',
          homeworld: `https://www.swapi.tech/api/planets/${planetId}`,
          url: `https://www.swapi.tech/api/people/${uid}`,
          created: '2025-01-18T00:00:00.000Z',
          edited: '2025-01-18T00:00:00.000Z',
        },
      });

      switch (page) {
        case '1':
          return {
            ...common,
            previous: null,
            next: 'https://www.swapi.tech/api/people?page=2&limit=10',
            results: [makeItem('1', 'Jitendra Patel', '1')],
          };
        case '2':
          return {
            ...common,
            previous: 'https://www.swapi.tech/api/people?page=1&limit=10',
            next: 'https://www.swapi.tech/api/people?page=3&limit=10',
            results: [makeItem('2', 'Jitendra Patel Page 2', '2')],
          };
        case '3':
          return {
            ...common,
            previous: 'https://www.swapi.tech/api/people?page=2&limit=10',
            next: null,
            results: [makeItem('3', 'Jitendra Patel Page 3', '3')],
          };
        default:
          return {
            ...common,
            previous: null,
            next: null,
            results: [],
          };
      }
    };

    return HttpResponse.json(getPaginatedResponse(page));
  }),

  // 🔍 DETAIL - character 1
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
          created: '2025-01-18T00:00:00.000Z',
          edited: '2025-01-18T00:00:00.000Z',
        },
      },
    };
    return HttpResponse.json(response);
  }),

  // 🔍 DETAIL - search result (sp1)
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
          created: '2025-01-18T00:00:00.000Z',
          edited: '2025-01-18T00:00:00.000Z',
        },
      },
    };
    return HttpResponse.json(response);
  }),

  // 🌍 PLANET 1
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
          climate: 'normal',
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

  // 🌍 PLANET sp1 (used in search)
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
          climate: 'normal',
          gravity: '3 standard',
          terrain: 'all types',
          surface_water: '1',
          population: '30000000',
          url: 'https://www.swapi.tech/api/planets/sp1',
          created: '2024-01-01T00:00:00.000Z',
          edited: '2024-01-01T00:00:00.000Z',
        },
      },
    };
    return HttpResponse.json(response);
  }),
  http.get('https://www.swapi.tech/api/films', () => {
    const response = {
      message: 'ok',
      result: [
        {
          uid: 'f1',
          properties: {
            title: 'A New Hope',
            episode_id: 4,
            opening_crawl: 'It is a period of civil war...',
            director: 'George Lucas',
            producer: 'Gary Kurtz, Rick McCallum',
            release_date: '1977-05-25',
            characters: [
              'https://www.swapi.tech/api/people/1',
              'https://www.swapi.tech/api/people/2',
            ],
            url: 'https://www.swapi.tech/api/films/1',
            created: '2024-01-01T00:00:00.000Z',
            edited: '2024-01-01T00:00:00.000Z',
          },
        },
        {
          uid: 'f2',
          properties: {
            title: 'The Empire Strikes Back',
            episode_id: 5,
            opening_crawl: 'It is a dark time for the Rebellion...',
            director: 'Irvin Kershner',
            producer: 'Gary Kurtz, Rick McCallum',
            release_date: '1980-05-17',
            characters: ['https://www.swapi.tech/api/people/1'],
            url: 'https://www.swapi.tech/api/films/2',
            created: '2024-01-01T00:00:00.000Z',
            edited: '2024-01-01T00:00:00.000Z',
          },
        },
      ],
    };

    return HttpResponse.json(response);
  }),
];
