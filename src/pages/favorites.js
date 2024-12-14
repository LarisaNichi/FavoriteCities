import FavoritesContent from '@/components/compFavorites/favoritesContent';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Favorites() {
  const [citiesWithScores, setCitiesWithScores] = useState([]);
  const { data: session } = useSession();
  const currentUser = session?.user.email;

  useEffect(() => {
    (async () => {
      if (currentUser) {
        const query = new URLSearchParams({
          email: currentUser,
          withScore: true,
        }).toString();
        const res = await fetch(`/api/cities?${query}`);
        const citiesAndScores = await res.json();
        console.log('CITIES AND SCORES FROM FAVORITES', citiesAndScores);
        setCitiesWithScores(citiesAndScores);
      }
    })();
  }, [currentUser]);

  async function deleteCityFromFavorites(latitude, longitude, email) {
    try {
      const response = await fetch('/api/cities', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude, email }),
      });
      const result = await response.json();
      if (response.ok) {
        const newCitiesList = citiesWithScores.filter(
          (city) => city.latitude !== latitude && city.longitude !== longitude
        );
        setCitiesWithScores(newCitiesList);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleRatingOnChange(e, name, country, latitude, longitude, id) {
    const cityData = {
      id,
      name,
      country,
      latitude,
      longitude,
      score: +e.value,
    };

    setCitiesWithScores((prevCities) => {
      const currentCityIndex = prevCities.findIndex((city) => city.id === id);
      // const currentCity = prevCities[currentCityIndex];
      if (currentCityIndex !== -1) {
        const newCitiesWithScores = [...prevCities];
        newCitiesWithScores[currentCityIndex] = cityData;
        return newCitiesWithScores;
      }
      return [...prevCities, ratingData];
    });
  }

  async function sendRatings() {
    try {
      const ratings = citiesWithScores.map(({ id, country, ...restCity }) => ({
        ...restCity,
      }));
      console.log('RATINGS TO BE SENT', ratings);

      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ratings,
          email: currentUser,
        }),
      });
      const result = await response.json();
      setCitiesWithScores(result);
    } catch (error) {
      console.error(error);
    }
  }

  if (citiesWithScores.length === 0) {
    return null;
  }

  return (
    <>
      <FavoritesContent
        deleteCityFromFavorites={deleteCityFromFavorites}
        handleRatingOnChange={handleRatingOnChange}
        sendRatings={sendRatings}
        currentUser={currentUser}
        citiesWithScores={citiesWithScores}
      ></FavoritesContent>
      ;
    </>
  );
}
