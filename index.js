import 'dotenv/config.js'

import chalk from 'chalk';
import Express from 'express';
import swaggerUi from 'swagger-ui-express';

import connectDB from './config/MongoConnect.js';


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
import mongoose from 'mongoose';


const app = Express();
app.use(Express.urlencoded({extended: false}));

app.use('/', root);
app.use('/category', categoryRoute);
app.use('/games', gameRoute);
app.use('/ratings', ratingRoute);
app.use('/users', userRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(loadSwaggerFile()));

// 404
app.use('*', (req, res) => {
    res.status(404);
    res.json({message: "404 - not found"});
})

mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Servidor aberto no port: ${chalk.green(PORT)}`)
    })
})
