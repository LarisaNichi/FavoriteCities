import AppDataSource from '@/data-source';
import User from '@/entity/User';

export default async function handler(req, res) {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);

  if (req.method === 'GET') {
    const { name, age } = req.body;
    const user = { name, age };
    await userRepo.save(user);
    res.status(200).json({ message: 'User created', user });
  } else {
    const users = await userRepo.find();
    res.status(200).json(users);
  }
}
