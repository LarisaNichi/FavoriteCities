import AppDataSource from '@/data-source';
import User from '@/entity/User';
import City from '@/entity/City';
import Rating from '@/entity/Rating';
import { findRatingsByUser } from '@/pages/api/ratings';
import { getCitiesWithScores } from '@/pages/api/ratings';

export default async function handler(req, res) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const userRepo = AppDataSource.getRepository(User);
  const cityRepo = AppDataSource.getRepository(City);
  const ratingRepo = AppDataSource.getRepository(Rating);

  let cityIsAlreadySavedByCurrentUser;

  if (req.method === 'POST') {
    const { cityToSave, email } = req.body;
    const { latitude, longitude } = cityToSave;

    await createCity(email, cityToSave, latitude, longitude);
    return res.status(200).json({ message: 'City created successfully!' });
  }

  if (req.method === 'GET') {
    const { email, withScore } = req.query;
    if (!email) {
      throw new Error('Email is required');
    }
    const userCities = await findCitiesByUser(email);
    if (withScore) {
      const userRatings = await findRatingsByUser(email);
      const citiesWithScores = getCitiesWithScores(userRatings, userCities);
      return res.status(200).json(citiesWithScores);
    }
    return res.status(200).json(userCities);
  }

  if (req.method === 'DELETE') {
    const { latitude, longitude, email } = req.body;
    try {
      await deleteCity(latitude, longitude, email);
      return res.status(200).json({ message: 'City removed successfully!' });
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async function createCity(email, cityToSave, latitude, longitude) {
    const currentUser = await userRepo.findOne({
      where: { email },
      relations: ['cities'],
    });
    //findOne returns an Object, find returns and Array with objects
    const cityExists = await cityRepo.findOneBy({ latitude, longitude });
    cityIsAlreadySavedByCurrentUser = currentUser.cities.some(
      (city) => city.latitude === latitude && city.longitude === longitude
    );

    if (!cityExists) {
      const citySaved = cityRepo.create(cityToSave);
      await cityRepo.save(citySaved);
      currentUser.cities.push(citySaved);
      await userRepo.save(currentUser);
      // citySaved.users = [currentUser];
      console.log('City created');
    }
    if (cityExists && !cityIsAlreadySavedByCurrentUser) {
      currentUser.cities.push(cityExists);
      await userRepo.save(currentUser);
      console.log(
        'City exists in the database and was added for a different user'
      );
    }
    if (cityExists && cityIsAlreadySavedByCurrentUser) {
      console.log('This city already exists in your favorite list');
    }
  }

  async function deleteCity(latitude, longitude, email) {
    if (!(latitude && longitude) || !email) {
      throw new Error(`City's coordinates and Email are required`);
    }

    const user = await userRepo.findOne({
      where: { email },
      relations: ['cities'],
    });
    const city = await cityRepo.findOne({
      where: { latitude, longitude },
    });
    const rating = await AppDataSource.manager.find('Rating', {
      relations: ['users', 'cities'],
      where: { users: { email }, cities: { latitude, longitude } },
    });

    if (!user || !city) {
      throw new Error(`City's coordinates and Email not found`);
    }
    user.cities = user.cities.filter(
      (city) => city.latitude !== latitude && city.longitude !== longitude
    );
    await userRepo.save(user);
    if (rating) {
      await ratingRepo.remove(rating);
    }
  }
}

export async function findCitiesByUser(email) {
  const user = await AppDataSource.manager.find('User', {
    relations: ['cities'],
    where: { email },
  });
  const cities = user[0].cities;
  return cities;
}
