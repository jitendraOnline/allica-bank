import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchCharacters, fetchCharacterDetail, fetchPlanet } from './CharacterService';
import type { CharacterProperties } from './character.type';

const CharacterCard = ({
  character,
}: {
  character: {
    uid: string;
    name: string;
    detail?: CharacterProperties;
  };
}) => {
  const { detail } = character;

  const {
    data: planetName,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['planet', detail?.homeworld],
    queryFn: () => fetchPlanet(detail!.homeworld),
    enabled: !!detail?.homeworld,
    staleTime: Infinity,
  });

  return (
    <li className="flex gap-3 border border-gray-200 p-4 rounded shadow bg-white flex-1">
      <p className="text-sm text-gray-500">{character.name}</p>
      <p className="text-sm text-gray-600 capitalize">{detail?.gender ?? '-'}</p>
      <p className="text-sm text-gray-500">
        {isLoading
          ? 'Loading planet...'
          : isError
            ? 'Unknown'
            : typeof planetName === 'string'
              ? planetName
              : (planetName?.name ?? '-')}
      </p>
    </li>
  );
};

export const CharacterListPage = () => {
  const page = 1;

  const { data, isLoading } = useQuery({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
  });

  const characterDetailQueries = useQueries({
    queries:
      data?.map((char) => ({
        queryKey: ['character-detail', char.uid],
        queryFn: () => fetchCharacterDetail(char.url),
        staleTime: Infinity,
      })) ?? [],
  });

  const characters =
    data?.map((baseChar, i) => ({
      uid: baseChar.uid,
      name: baseChar.name,
      detail: characterDetailQueries[i]?.data,
      isLoading: characterDetailQueries[i]?.isLoading,
    })) ?? [];

  if (isLoading || characterDetailQueries.some((q) => q.isLoading)) {
    return <p className="p-4">Loading...</p>;
  }

  if (isLoading || characterDetailQueries.some((q) => q.isError)) {
    return <p className="p-4 text-red-500">Error loading characters</p>;
  }

  return (
    <div className="p-2  flex-1 flex flex-col">
      <h3>Character List</h3>
      <ul className="space-y-2 flex flex-col">
        {characters.map((char) => (
          <CharacterCard key={char.uid} character={char} />
        ))}
      </ul>
    </div>
  );
};

export default CharacterListPage;
