import { useParams, useNavigate, useLocation } from 'react-router-dom'; // ⬅️ added useLocation
import { useQuery } from '@tanstack/react-query';
import { fetchCharacterDetail, fetchPlanet, fetchAllFilms } from './CharacterService';
import type { FilmDetail } from './character.type';
import { useFavourites } from './hooks/useFavourites';

function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // ⬅️ capture search params

  const {
    data: character,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['character', id],
    queryFn: ({ signal }) => fetchCharacterDetail(id!, signal),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
  const { isFavourite, toggleFavourite } = useFavourites(id, { ...character!, uid: id! });
  const {
    data: planet,
    isLoading: isPlanetLoading,
    isError: isPlanetError,
  } = useQuery({
    queryKey: ['planet', character?.homeworld],
    queryFn: ({ signal }) => fetchPlanet(character!.homeworld, signal),
    enabled: !!character?.homeworld,
    staleTime: Infinity,
  });

  const {
    data: films = [],
    isLoading: isFilmsLoading,
    isError: isFilmsError,
  } = useQuery({
    queryKey: ['films'],
    queryFn: async ({ signal }) => {
      const allFilms = await fetchAllFilms(signal);
      return allFilms.filter((film: FilmDetail) => film.characters.includes(character!.url));
    },
    enabled: !!character?.url,
    staleTime: 1000 * 60 * 10,
  });

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error loading character.{' '}
        <button onClick={() => refetch()} className="underline text-blue-600">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4  space-y-6">
      <button
        onClick={() => navigate(`/characters${location.search}`)} // ⬅️ go back preserving page/search
        className="text-sm text-blue-600 underline hover:text-blue-800"
      >
        ← Back to Character List
      </button>
      <button
        disabled={isLoading}
        onClick={toggleFavourite}
        className={`text-sm ml-4 ${isFavourite ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600 disabled:text-gray-200`}
        aria-label="Toggle Favourite Button"
      >
        {isFavourite ? '★' : '☆'} Favourite
      </button>
      {isLoading ? (
        <div className="text-gray-500">Loading character details...</div>
      ) : (
        <>
          <h1 className="text-2xl font-bold">{character?.name}</h1>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <p>
              <strong>Gender:</strong> {character?.gender}
            </p>
            <p>
              <strong>Hair Color:</strong> {character?.hair_color}
            </p>
            <p>
              <strong>Eye Color:</strong> {character?.eye_color}
            </p>
            <p>
              <strong>Home Planet:</strong>{' '}
              {isPlanetLoading ? 'Loading...' : isPlanetError ? 'Unknown' : (planet?.name ?? '-')}
            </p>
          </div>
        </>
      )}

      <div>
        <h2 className="text-lg font-semibold mt-6 mb-2">Films</h2>
        {isFilmsLoading ? (
          <p>Loading films...</p>
        ) : isFilmsError ? (
          <p className="text-red-500">Failed to load films.</p>
        ) : films.length === 0 ? (
          <p>No films found for this character.</p>
        ) : (
          <ul className="list-disc list-inside text-sm">
            {films.map((film: FilmDetail) => (
              <li key={film.uid}>
                {film.title} ({film.release_date})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CharacterDetailPage;
