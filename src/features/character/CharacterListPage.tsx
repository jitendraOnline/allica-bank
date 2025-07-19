import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCharacters, fetchCharacterDetail, fetchPlanet } from './CharacterService';
import type { CharacterListItem, CharacterProperties } from './character.type';
import { debouse } from '../../shared/utils';

const pageLimit = 10;

const TableRowCharacter = ({ characterItem }: { characterItem: CharacterListItem }) => {
  const { uid, name, url, homeworld, gender: initialGender } = characterItem;

  const shouldFetchDetail = !initialGender;

  const {
    data: detail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useQuery<CharacterProperties>({
    queryKey: ['character-detail', uid],
    queryFn: ({ signal }) => fetchCharacterDetail(url, signal),
    enabled: shouldFetchDetail,
    staleTime: Infinity,
  });

  const gender = initialGender
    ? initialGender
    : isDetailLoading
      ? 'Loading...'
      : isDetailError
        ? 'Unknown'
        : (detail?.gender ?? '-');

  const homeworldUrl = homeworld || detail?.homeworld;

  const {
    data: planet,
    isLoading: isPlanetLoading,
    isError: isPlanetError,
  } = useQuery({
    queryKey: ['planet', homeworldUrl],
    queryFn: ({ signal }) => fetchPlanet(homeworldUrl!, signal),
    enabled: !!homeworldUrl,
    staleTime: Infinity,
  });

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
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['characters', page, search],
    queryFn: ({ signal }) => fetchCharacters(page, search, pageLimit, signal),
    staleTime: 1000 * 60 * 5,
  });

  const debouncedSetSearchRef = useRef(
    debouse((value: string) => {
      setSearch(value);
      setPage(1);
    })
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedSetSearchRef.current(e.target.value);
  };

  const tableHeaders = ['Name', 'Gender', 'Planet'];
  const getPaginationInfo = (page: number, limit: number, total = 0) => {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return `Showing ${start}-${end} of ${total}`;
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <input
          type="text"
          placeholder="Search by character name"
          aria-label="Search by character name"
          value={inputValue}
          onChange={handleSearchChange}
          className="w-full max-w-sm p-2 border border-gray-300 rounded"
        />
      </div>

      {isError ? (
        <div className="flex items-center gap-4 p-4 border border-red-200 bg-red-50 text-red-700 rounded">
          <p className="text-sm font-medium">Error fetching characters.</p>
          <button
            onClick={() => refetch()}
            className="text-sm text-blue-600 underline hover:text-blue-800  rounded cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-700">
            {getPaginationInfo(page, pageLimit, data?.total_records ?? 0)}
          </p>

          <div className="overflow-x-auto h-[400px] rounded shadow border border-gray-200">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-900"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="px-4 py-2 text-sm text-gray-600">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  data?.results?.map((char) => (
                    <TableRowCharacter key={char.uid} characterItem={char} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={!data?.previous}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data?.next}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

function CharacterListPage() {
  return (
    <div className="p-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Character List</h2>
      <CharacterList />
    </div>
  );
}

export default CharacterListPage;
