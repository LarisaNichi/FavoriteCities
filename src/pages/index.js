import HomeContent from '@/components/compHome/homeContent';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Home() {
  const [randomFavoriteCities, setRandomFavoriteCities] = useState([]);
  const [randomCities, setRandomCities] = useState([]);
  const { data: session } = useSession();
  const currentUser = session?.user.email;
  const targetCount = 7;
  const numItems = 5;
  const numRandomCities = 5;

  useEffect(() => {
    (async () => {
      if (currentUser) {
        const query = new URLSearchParams({
          email: currentUser,
        }).toString();
        const res = await fetch(`/api/cities?${query}`);
        const cities = await res.json();
        const randomCitiesGet = getRandomItems(cities, numItems);
        setRandomFavoriteCities(randomCitiesGet);
      }
    })();
  }, [currentUser]);

  useEffect(() => {
    (async () => {
      await getRandomCities(targetCount)
        .then((data) => {
          getCityAndCountry(data).then((data) => {
            setRandomCities(data.slice(0, numRandomCities));
          });
        })
        .catch((error) => console.error('Error fetching data:', error));
    })();
  }, []);

  function getRandomItems(arr, numItems) {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numItems);
  }

  async function getRandomCities(targetCount) {
    let results = [];
    let attempts = 0;
    while (results.length < targetCount) {
      attempts++;
      try {
        const fetchPromises = [];
        for (let i = 0; i < targetCount; i++) {
          fetchPromises.push(
            fetch('https://random-city-api.vercel.app/api/random-city').then(
              (response) => response.json()
            )
          );
        }
        const fetchedData = await Promise.all(fetchPromises);
        fetchedData.forEach((item) => {
          if (item) {
            results.push(item);
          }
        });
        if (results.length >= targetCount) {
          break;
        }
      } catch (error) {
        console.error(`Error on attempt ${attempts}:`, error);
      }
      if (attempts > 1) {
        console.warn('Too many failed attempts, stopping.');
        break;
      }
    }
    return results.slice(0, targetCount);
  }

  async function getCityAndCountry(randomItems) {
    const fetchPromises = randomItems.map(({ city }) =>
      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
    );

    const results = await Promise.allSettled(fetchPromises);

    const fulfilled = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);
    // const rejected = results
    //   .filter((result) => result.status === 'rejected')
    //   .map((result) => result.reason);

    // console.log('Fulfilled Results:', fulfilled);
    // console.log('Rejected Errors:', rejected);
    const randomCities = fulfilled
      .map(({ results }) => results)
      .filter((result) => result !== undefined)
      .flat();
    return randomCities;
  }

  return (
    <>
      <Head>
        <title>Favorite Cities App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/favicon.ico" />
      </Head>

      <HomeContent
        randomFavoriteCities={randomFavoriteCities}
        randomCities={randomCities}
      ></HomeContent>
    </>
  );
}
