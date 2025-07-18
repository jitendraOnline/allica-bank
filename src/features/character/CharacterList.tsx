import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCharacters, fetchCharacterDetail, fetchPlanet } from './CharacterService';
import type { CharacterProperties } from './character.type';

const pageLimit = 10;

const TableRowCharacter = ({ uid, name, url }: { uid: string; name: string; url: string }) => {
  const {
    data: detail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useQuery<CharacterProperties>({
    queryKey: ['character-detail', uid],
    queryFn: () => fetchCharacterDetail(url),
    staleTime: Infinity,
  });

  const {
    data: planet,
    isLoading: isPlanetLoading,
    isError: isPlanetError,
  } = useQuery({
    queryKey: ['planet', detail?.homeworld],
    queryFn: () => fetchPlanet(detail!.homeworld),
    enabled: !!detail?.homeworld,
    staleTime: Infinity,
  });

  const gender = isDetailLoading
    ? 'Loading...'
    : isDetailError
      ? 'Unknown'
      : (detail?.gender ?? '-');

  const planetName = isPlanetLoading
    ? 'Loading...'
    : isPlanetError
      ? 'Unknown'
      : typeof planet === 'string'
        ? planet
        : (planet?.name ?? '-');

  return (
    <tr className="hover:bg-blue-50">
      <td className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap">{name}</td>
      <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">{gender}</td>
      <td className="px-4 py-2 text-sm text-gray-500 whitespace-nowrap">{planetName}</td>
    </tr>
  );
};

export const CharacterList = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
  });

  if (isLoading) return <p className="p-4">Loading characters...</p>;
  if (isError) return <p className="p-4 text-red-500">Error fetching characters</p>;

  return (
    <div className="p-1 flex-1 flex flex-col">
      <p>
        showing {(page - 1) * pageLimit + 1}-{page * pageLimit} of {data?.total_records}
      </p>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-900 ">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 ">Gender</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 ">Planet</th>
            </tr>
          </thead>
          <tbody className="bg-white ">
            {data?.results?.map((char: { uid: string; name: string; url: string }) => (
              <TableRowCharacter key={char.uid} uid={char.uid} name={char.name} url={char.url} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!data?.previous}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={!data?.next}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
