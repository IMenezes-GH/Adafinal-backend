import 'dotenv/config.js'

import cors from 'cors';

import chalk from 'chalk';
import Express from 'express';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import requestLogger from './middleware/Logger.js';

import connectDB from './config/MongoConnect.js';
import corsOptions from './config/corsOptions.js';


import {generateSwaggerFile, loadSwaggerFile} from './swagger.js';
generateSwaggerFile();

const PORT = process.env.PORT || 3000;

connectDB();

// ROTAS
import root from './routes/root.js';
import categoryRoute from './routes/categoryRoute.js';
import gameRoute from './routes/gameRoute.js';
import ratingRoute from './routes/ratingRoute.js';
import userRoute from './routes/userRoute.js';
import authRoute from './routes/AuthRoute.js';
import newsRoute from './routes/NewsRoute.js';

import mongoose from 'mongoose';

const app = Express();

app.use(cors(corsOptions));
app.use(Express.urlencoded({extended: false}));
app.use(Express.json());
app.use(requestLogger);


app.use('/auth', cookieParser());


app.use('/', root);
app.use('/ratings', ratingRoute);
app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/games', gameRoute);
app.use('/category', categoryRoute);
app.use('/news', newsRoute);

const CUSTOM_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(loadSwaggerFile(), {customCssUrl: CUSTOM_URL}));


// 404
app.all('*', (req, res) => {
    res.status(404);
    res.json({message: "404 - not found"});
})

mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Servidor aberto no port: ${chalk.green(PORT)}`)
    })
})

export default app