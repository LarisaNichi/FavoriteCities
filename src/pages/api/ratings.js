import AppDataSource from '@/data-source';
import User from '@/entity/User';
import Rating from '@/entity/Rating';
import { findCitiesByUser } from '@/pages/api/cities';

export default async function handler(req, res) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const ratingRepo = AppDataSource.getRepository(Rating);
  const userRepo = AppDataSource.getRepository(User);

  if (req.method === 'POST') {
    const { ratings, email } = req.body;
    const currentUser = await userRepo.findOne({
      where: { email },
    });
    const userCities = await findCitiesByUser(email);

    //Deletes repeated cities rated
    ratings.forEach(async ({ latitude, longitude }) => {
      const existingCityRating = await AppDataSource.manager.find('Rating', {
        relations: ['users'],
        where: { users: { email }, latitude, longitude },
      });
      if (existingCityRating.length !== 0) {
        await ratingRepo.remove(existingCityRating);
      } else {
        return;
      }
    });

    // Save ratings
    const ratingSaved = ratingRepo.create(
      ratings.map((rating) => ({
        ...rating,
        users: currentUser,
        cities: getRatedCity(rating.latitude, rating.longitude),
      }))
    );
    await ratingRepo.save(ratingSaved);
    // console.log('Rating saved successfully:', ratingSaved);

    function getRatedCity(latitude, longitude) {
      const ratedCity = userCities.find(
        (city) => city.latitude === latitude && city.longitude === longitude
      );
      return ratedCity;
    }

    //Returns cities with scores
    const userRatings = await findRatingsByUser(email);
    const citiesWithScores = getCitiesWithScores(userRatings, userCities);
    return res.status(200).json(citiesWithScores);
  }

  if (req.method === 'GET') {
    const { email } = req.query;
    const userRatings = await findRatingsByUser(email);
    return res.status(200).json(userRatings);
  }
}

export async function findRatingsByUser(email) {
  const userRatings = await AppDataSource.manager.find('Rating', {
    relations: ['cities'],
    where: { users: { email } },
  });
  return userRatings;
}

export function getCitiesWithScores(userRatings, userCities) {
  const ratingsObj = userRatings.reduce(
    (acc, rating) => ({ ...acc, [rating.cities?.id]: rating.score }),
    {}
  );
  const citiesWithScores = userCities.map((city) => ({
    ...city,
    score: ratingsObj[city.id] ?? 0,
  }));
  return citiesWithScores;
}

// await ratingRepo.delete({});
// await ratingRepo.clear();
