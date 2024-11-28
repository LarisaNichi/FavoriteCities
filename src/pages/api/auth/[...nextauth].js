import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import AppDataSource from '@/data-source';
import User from '@/entity/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          required: true,
        },
        password: { label: 'Password', type: 'password', required: true },
      },
      authorize: async (credentials) => {
        console.log(credentials);
        if (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
        }
        const userRepo = AppDataSource.getRepository(User);
        const { email, password } = credentials;
        const userExists = await userRepo.findOneBy({ email });

        if (!userExists) {
          const hashedPassword = bcrypt.hashSync(password, 10);
          const user = { email, password: hashedPassword };
          await userRepo.save(user);
          return user;
          // console.log('user was created');
        }
        if (userExists && bcrypt.compareSync(password, userExists.password)) {
          console.log(userExists.email, userExists.password);
          return userExists;
        }
        // console.log('Email already in use.');
        return null;
      },
    }),
  ],
};
export default NextAuth(authOptions);
