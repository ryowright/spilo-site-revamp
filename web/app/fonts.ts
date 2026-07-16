import { Anton, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';

export const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
});

export const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-hanken',
  display: 'swap',
});

export const jet = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jet',
  display: 'swap',
});

// Adding this comment as part of a no-op commit