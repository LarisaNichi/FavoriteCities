import AppDataSource from '@/data-source';
import User from '@/entity/User';
import City from '@/entity/City';
import Rating from '@/entity/Rating';

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
    const { name, country, latitude, longitude } = cityToSave;

    await createCity(email, cityToSave, latitude, longitude);
  }
  if (req.method === 'GET') {
    await findCitiesByUser();
  }

  if (req.method === 'DELETE') {
    await deleteCity();
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
      return res.status(200).json(true);
    }
    if (cityExists && !cityIsAlreadySavedByCurrentUser) {
      currentUser.cities.push(cityExists);
      await userRepo.save(currentUser);

      console.log(
        'City exists in the database and was added for a different user'
      );
      return res.status(200).json(true);
    }
    if (cityExists && cityIsAlreadySavedByCurrentUser) {
      console.log('This city already exists in your favorite list');
      return res.status(200).json(true);
    }
  }

  async function findCitiesByUser() {
    const users = await AppDataSource.manager.find('User', {
      relations: ['cities'],
    });
    return res.status(200).json(users);
  }

  async function deleteCity() {
    const { latitude, longitude, email } = req.body;

    if (!(latitude && longitude) || !email) {
      res
        .status(400)
        .json({ message: `City's coordinates and Email are required` });
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
      return res.status(404).json({
        message: `City's coordinates and Email not found`,
      });
    } else {
      user.cities = user.cities.filter(
        (city) => city.latitude !== latitude && city.longitude !== longitude
      );
      await userRepo.save(user);
      if (rating) {
        await ratingRepo.remove(rating);
      }
      return res.status(200).json(false);
    }
  }
}
