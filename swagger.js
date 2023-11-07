import swaggerAutogen from 'swagger-autogen'
import chalk from 'chalk'
import path from 'path';
import fs from 'fs';

const __dirname = new URL('.', import.meta.url).pathname;

const loadSwaggerFile = () => {
    try {
        const swaggerFile = fs.readFileSync(path.join(__dirname, 'swagger_output.json'), 'utf-8');
        swaggerFile && console.log(chalk.green('Swagger file found.'));
        return JSON.parse(swaggerFile);

    } catch (err) {
        console.log(chalk.red('Unable to load swagger file:', err.message))
    }
}

const doc = {
    info: {
      title: 'Best Browser Games API',
      description: 'API Backend do Best Browser Games'
    },
    host: 'https://adafinal-backend-cgd5vzou6-imenezes-gh.vercel.app',
    tags: [{name: 'Games'}, {name: 'Users'}, {name: 'Ratings'}, {name: 'Auth'}],
    components: {
        securitySchemes:{
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }
  };

const generateSwaggerFile = () => {
    const outputFile = './swagger_output.json';
    const input = ['./index.js'];
    
    console.log(chalk.blue('Swagger re-gen requested.'));
    swaggerAutogen(outputFile, input, doc)
}


export {generateSwaggerFile, loadSwaggerFile}