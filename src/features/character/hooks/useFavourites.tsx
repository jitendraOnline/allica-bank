import type { CharacterListItem } from '../character.type';

import { useCallback, useEffect, useState } from 'react';
import { addFavourite, removeFavourite, isFavourite, getFavourites } from '../CharacterService';

export function useFavourites(uid?: string, character?: CharacterListItem) {
  const [isFav, setIsFav] = useState(uid ? isFavourite(uid) : false);
  const [favourites, setFavourites] = useState<Record<string, CharacterListItem>>({});

  useEffect(() => {
    setFavourites(getFavourites());
  }, []);

  const toggleFavourite = useCallback(() => {
    if (!uid || !character) return;
    if (isFavourite(uid)) {
      removeFavourite(uid);
      setIsFav(false);
    } else {
      addFavourite(character);
      setIsFav(true);
    }
    setFavourites(getFavourites());
  }, [uid, character]);

  return {
    isFavourite: isFav,
    toggleFavourite,
    favourites,
  };
}
