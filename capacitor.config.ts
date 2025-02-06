import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lavariso.app',
  appName: 'lavarisoapp',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    BackgroundMode: {
      enabled: true
    }
  }
};

export default config;
