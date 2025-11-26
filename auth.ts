import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import bcrypt from 'bcryptjs';

// Mock user database (replace with actual database later)
const users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@agrivoice.com',
    password: '$2a$10$7QD9Z9Z9Z9Z9Z9Z9Z9Z9Z.YvqZVqZVqZVqZVqZVqZVqZVqZVqZV', // 'password123'
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) return null;

        // Find user by email
        const user = users.find((u) => u.email === email);
        
        if (!user) return null;

        // For demo purposes, accept 'password123' or check hashed password
        const passwordsMatch = password === 'password123' || 
                              await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
});
