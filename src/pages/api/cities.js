import AppDataSource from '@/data-source';
import User from '@/entity/User';
import City from '@/entity/City';

export default async function handler(req, res) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const userRepo = AppDataSource.getRepository(User);
  const cityRepo = AppDataSource.getRepository(City);

  let cityIsAlreadySavedByCurrentUser;

  if (req.method === 'POST') {
    const { cityToSave, email } = req.body;
    const id = cityToSave.id;
    await createCity(email, cityToSave, id);
  }
  if (req.method === 'GET') {
    await findCitiesByUser();
  }

  if (req.method === 'DELETE') {
    await deleteCity();
  }

  async function createCity(email, cityToSave, id) {
    const currentUser = await userRepo.findOne({
      where: { email },
      relations: ['cities'],
    });
    //findOne returns an Object, find returns and Array with objects
    const cityExists = await cityRepo.findOneBy({ id });
    cityIsAlreadySavedByCurrentUser = currentUser.cities.some(
      (city) => city.id === id
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
    const { id: citiesId, email } = req.body;

    if (!citiesId || !email) {
      res.status(400).json({ message: 'City Id and Email are required  ' });
    }

    const user = await userRepo.findOne({
      where: { email },
      relations: ['cities'],
    });
    const city = await cityRepo.findOne({
      where: { id: citiesId },
    });

    if (!user || !city) {
      return res.status(404).json({ message: 'City Id and Email not found' });
    } else {
      user.cities = user.cities.filter((city) => city.id !== citiesId);

      await userRepo.save(user);
      return res.status(200).json(false);
    }
  }
}
