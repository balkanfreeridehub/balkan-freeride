import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Isključujemo proveru TypeScript grešaka tokom build-a na Vercelu
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Turbopack je podrazumevan, ali ostavljamo prostor za dodatna podešavanja ako zatreba
  experimental: {
    // Ovde možeš dodavati specifične Next.js 16 eksperimentalne funkcije
  }
};

export default nextConfig;