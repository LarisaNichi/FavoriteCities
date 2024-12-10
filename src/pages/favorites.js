import FavoritesContent from '@/components/compFavorites/favoritesContent';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Favorites() {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [ratingsSaved, setRatingsSaved] = useState([]);
  const { data: session } = useSession();
  const currentUser = session?.user.email;

  useEffect(() => {
    (async () => {
      await fetchUserFavoriteCities().then((data) => {
        if (data.length !== 0) {
          const cities = data[0].cities;
          setFavoriteCities(cities);
        }
      });
      await fetchUserRatings(currentUser).then((data) => {
        setRatingsSaved(data);
      });
    })();
  }, [currentUser]);

  async function fetchUserFavoriteCities() {
    const res = await fetch('/api/cities');
    const users = await res.json();
    const userData = users.filter((user) => user.email === currentUser);
    return userData;
  }

  async function fetchUserRatings(email) {
    const query = new URLSearchParams({ email }).toString();
    const res = await fetch(`/api/ratings?${query}`);
    const ratings = await res.json();
    return ratings;
  }

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
        const newCitiesList = favoriteCities.filter(
          (city) => city.latitude !== latitude && city.longitude !== longitude
        );
        setFavoriteCities(newCitiesList);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleRatingOnChange(e, name, latitude, longitude) {
    // {[id]:{ratingData}}
    const ratingData = {
      score: +e.target.value,
      name,
      latitude,
      longitude,
    };

    setRatings((prev) => [
      ...prev.filter(
        (rating) =>
          rating.latitude !== latitude && rating.longitude !== longitude
      ),
      ratingData,
    ]);
  }

  async function sendRatings() {
    try {
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
      setRatingsSaved(result);
    } catch (error) {
      console.error(error);
    }
  }

  function getCityScore(latitude, longitude) {
    const cityRating = ratingsSaved.find(
      (rating) => rating.latitude === latitude && rating.longitude === longitude
    );
    if (ratingsSaved.length !== 0 && cityRating) {
      return cityRating.score;
    } else {
      return 0;
    }
  }

  if (favoriteCities.length === 0) {
    return null;
  }

  return (
    <>
      <FavoritesContent
        favoriteCities={favoriteCities}
        getCityScore={getCityScore}
        deleteCityFromFavorites={deleteCityFromFavorites}
        handleRatingOnChange={handleRatingOnChange}
        sendRatings={sendRatings}
        currentUser={currentUser}
      ></FavoritesContent>
      ;
    </>
  );
}
