import { stringToBool } from "../util/parseUtil.js";
import { DEV_ORIGINS, PROD_ORIGIN } from "./origins.js";
import chalk from "chalk";

const useDevelopmentOrigins = stringToBool(process.env.USE_DEVELOPMENT_ORIGINS || 'false');
console.log(chalk.bold.yellowBright(`USE_DEVELOPMENT_ORIGINS IS SET TO: ${chalk.underline.blueBright(useDevelopmentOrigins)}`))

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || DEV_ORIGINS.includes(origin)) {
            console.log(origin)
            callback(null, true)
        } else {
            callback(new Error('Origin not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

export default corsOptions