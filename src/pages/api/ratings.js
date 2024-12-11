import AppDataSource from '@/data-source';
import User from '@/entity/User';
import City from '@/entity/City';
import Rating from '@/entity/Rating';

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

    const userCitiesData = await AppDataSource.manager.find('User', {
      where: { email },
      relations: ['cities'],
    });
    const userCities = userCitiesData[0].cities;

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

    //Save ratings
    const ratingSaved = ratingRepo.create(
      ratings.map((rating) => ({
        ...rating,
        users: currentUser,
        cities: getRatedCity(rating.latitude, rating.longitude),
      }))
    );

    await ratingRepo.save(ratingSaved);
    // console.log('Rating saved successfully:', ratingSaved);

    // await ratingRepo.delete({});

    function getRatedCity(latitude, longitude) {
      const ratedCity = userCities.find(
        (city) => city.latitude === latitude && city.longitude === longitude
      );
      return ratedCity;
    }

    const ratingsSavedByUser = await AppDataSource.manager.find('Rating', {
      relations: ['cities'],
      where: { users: { email } },
    });

    return res.status(200).json(ratingsSavedByUser);

    // await ratingRepo.clear();
    // await ratingRepo.query(`DELETE FROM sqlite_sequence WHERE name = 'Rating'`);

    // await AppDataSource.getRepository(Rating)
    //   .createQueryBuilder()
    //   .delete()
    //   .from('sqlite_sequence')
    //   .where({ name: 'Rating' })
    //   .execute();
    // console.log('Auto-increment ID has been reset.');
  }

  if (req.method === 'GET') {
    const { email } = req.query;
    await findRatingsByUser(email);
  }

  async function findRatingsByUser(email) {
    const userRatings = await AppDataSource.manager.find('Rating', {
      relations: ['cities'],
      where: { users: { email } },
    });

    // const userRatingsSent = userRatings.map(({ cities, users, ...rest }) => ({
    //   cities,
    //   ...rest,
    // }));
    return res.status(200).json(userRatings);
  }
}
