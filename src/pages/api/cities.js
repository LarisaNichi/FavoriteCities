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

    const currentUser = await userRepo.findOne({
      where: { email },
      relations: ['cities'],
    });
    //findOne returns an Object, find returns and Array with objects
    const cityExists = await cityRepo.findOneBy({ id });

    console.log('current user:', currentUser);

    cityIsAlreadySavedByCurrentUser = currentUser.cities.some(
      (city) => city.id === id
    );

    if (!cityExists) {
      const citySaved = cityRepo.create(cityToSave);
      await cityRepo.save(citySaved);
      currentUser.cities.push(citySaved);
      await userRepo.save(currentUser);
      // citySaved.users = [currentUser];

      // const users = await AppDataSource.manager.find('User', {
      //   relations: ['cities'],
      // });
      // console.log('Users with their cities:', users);

      // const cities = await AppDataSource.manager.find('City', { relations: ['users'] });
      // console.log('Cities with their users:', cities);

      res.status(200).json(true);
      console.log('City created');
    }
    if (cityExists && !cityIsAlreadySavedByCurrentUser) {
      currentUser.cities.push(cityExists);
      await userRepo.save(currentUser);

      res.status(200).json(true);
      console.log(
        'City exists in the database and was added for a different user'
      );
    }
    if (cityExists && cityIsAlreadySavedByCurrentUser) {
      res.status(200).json(true);
      console.log('This city already exists in your favorite list');
    }
  }

  if (req.method === 'GET') {
    const users = await AppDataSource.manager.find('User', {
      relations: ['cities'],
    });
    res.status(200).json(users);
  }
}
