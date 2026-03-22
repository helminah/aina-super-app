import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aina.superapp',
  appName: 'AINA',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#f5f0e8',
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#f5f0e8',
      showSpinner: false,
    },
  },
};

export default config;
