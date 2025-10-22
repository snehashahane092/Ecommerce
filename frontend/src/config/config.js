const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  APP_NAME: 'Cherish India',
  VERSION: '1.0.0',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
};

export default config;
