const DEV_ORIGINS = ['http://localhost:3000', 'http://localhost:3500', 'http://localhost:5173', 'http://localhost:4173'];
const PROD_ORIGIN = process.env.PROD_ORIGIN || 'http://localhost:5173';

export {DEV_ORIGINS, PROD_ORIGIN}