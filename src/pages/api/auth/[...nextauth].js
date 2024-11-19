import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import AppDataSource from '@/data-source';
import User from '@/entity/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'your username',
        },
        name: {
          label: 'name',
          type: 'text',
          placeholder: 'your name',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        console.log(credentials);

        if (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
        }
        const userRepo = AppDataSource.getRepository(User);
        const { username, name, password } = credentials;
        const user = { username, name, password };
        await userRepo.save(user);

        // if (req.method === 'POST') {
        //   const { username, password } = credentials;
        //   const user = { name, password };
        //   await userRepo.save(user);
        //   res.status(200).json({ message: 'User created', user });
        // } else {
        //   const users = await userRepo.find();
        //   res.status(200).json(users);
        // }

        // You need to provide your own logic here that takes the credentials submitted and returns either a object representing a user or value  that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        // const res = await fetch('/your/endpoint', {
        //   method: 'POST',
        //   body: JSON.stringify(credentials),
        //   headers: { 'Content-Type': 'application/json' },
        // });
        // const user = await res.json();

        // // If no error and we have user data, return it
        // if (res.ok && user) {
        //   return user;
        // }
        // // Return null if user data could not be retrieved
        // return null;

        // Replace this with your logic to authenticate the user
        // const user = { id: 1, name: "John Doe", email: "john@example.com" };

        // // This is where you'd authenticate the user (e.g., check username/password)
        // if (credentials.username === "john" && credentials.password === "password123") {
        //   return user;
        // }
        // return null; // Return null if authentication fails

        return {
          id: 1,
          name: credentials.username,
          email: credentials.username + '@example.com',
        };
      },
    }),
  ],
};
export default NextAuth(authOptions);
