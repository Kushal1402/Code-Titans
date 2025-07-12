import type { NextConfig } from "next";
import type { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack(config: Configuration) {
    const { module = {} } = config;
    const { rules = [] } = module;
    config.module = { ...module, rules: [...rules, {
      test: /\.svg$/,
      use: ['@svgr/webpack']
    }]};

    return config;
  }
};

export default nextConfig;
