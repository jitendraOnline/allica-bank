import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCharacters, fetchPlanet } from './CharacterService';
import type { CharacterListItem } from './character.type';
import { debouse } from '../../shared/utils';
import { Link, useSearchParams } from 'react-router-dom';
import { useFavourites } from './hooks/useFavourites';

const pageLimit = 10;

const TableRowCharacter = ({ characterItem }: { characterItem: CharacterListItem }) => {
  const { uid, name, homeworld, gender: initialGender } = characterItem;

  const [searchParams] = useSearchParams();
  const query = searchParams.toString();
  const querySuffix = query ? `?${query}` : '';

  const {
    data: planet,
    isLoading: isPlanetLoading,
    isError: isPlanetError,
  } = useQuery({
    queryKey: ['planet', homeworld],
    queryFn: ({ signal }) => fetchPlanet(homeworld!, signal),
    enabled: !!homeworld,
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
      <td className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap">
        <Link to={`/characters/${uid}${querySuffix}`} className="text-blue-600 hover:underline">
          {name}
        </Link>
      </td>
      <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">{initialGender}</td>
      <td className="px-4 py-2 text-sm text-gray-500 whitespace-nowrap">{planetName}</td>
    </tr>
  );
};

export const CharacterList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(search);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const { favourites } = useFavourites();

  const updateParams = (newPage: number, newSearch: string) => {
    setSearchParams({ page: String(newPage), search: newSearch });
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['characters', page, search],
    queryFn: ({ signal }) => fetchCharacters(page, search, pageLimit, signal),
    staleTime: 1000 * 60 * 5,
    enabled: !showFavouritesOnly,
  });

  const debouncedSetSearchRef = useRef(
    debouse((value: string) => {
      updateParams(1, value);
    })
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedSetSearchRef.current(val);
  };

  const handlePageChange = (newPage: number) => {
    updateParams(newPage, search);
  };

  const tableHeaders = ['Name', 'Gender', 'Planet'];
  const getPaginationInfo = (page: number, limit: number, total = 0) => {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return `Showing ${start}-${end} of ${total}`;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex gap-2 ">
        <input
          type="text"
          placeholder="Search by character name"
          aria-label="Search by character name"
          value={inputValue}
          onChange={handleSearchChange}
          className="w-full max-w-sm p-2 border border-gray-300 rounded"
        />
        <label className="inline-flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            checked={showFavouritesOnly}
            onChange={() => setShowFavouritesOnly((prev) => !prev)}
          />
          <span className="text-sm">Show Favourites Only</span>
        </label>
      </div>

      {isError ? (
        <div className="flex items-center gap-4 p-4 border border-red-200 bg-red-50 text-red-700 rounded">
          <p className="text-sm font-medium">Error fetching characters.</p>
          <button
            onClick={() => refetch()}
            className="text-sm text-blue-600 underline hover:text-blue-800 rounded cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {!isLoading && (
            <p className="text-sm text-gray-700">
              {search
                ? `Found ${data?.total_records} result for ${search}. ${data?.total_records === 0 ? 'try differnt character name' : ''} `
                : getPaginationInfo(page, pageLimit, data?.total_records ?? 0)}
            </p>
          )}

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
                {showFavouritesOnly ? (
                  Object.values(favourites).length === 0 ? (
                    <p className="text-gray-500">No favourites added.</p>
                  ) : (
                    Object.values(favourites).map((char) => (
                      <TableRowCharacter key={char.uid} characterItem={char} />
                    ))
                  )
                ) : isLoading ? (
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

      {!search && (
        <div className="flex justify-between items-center pt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={!data?.previous}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!data?.next}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
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
