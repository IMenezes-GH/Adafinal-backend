import chalk from "chalk";

const chalkMethod = (method) => {
    switch (method){
        case 'GET':
            return chalk.white(method)
        case 'POST':
            return chalk.yellow.bold(method)
        case 'PATCH':
            return chalk.yellowBright.bold(method)
        case 'DELETE':
            return chalk.redBright.bold(method)
        default:
            return chalk.gray(method)
    }
}

const chalkStatus = (statusCode) => {
    if (statusCode >= 100 && statusCode < 200) return chalk.gray(statusCode);
    if (statusCode >= 200 && statusCode < 300) return chalk.green(statusCode);
    if (statusCode >= 400 && statusCode < 500) return chalk.hex('#FFAC1C').bold(statusCode);
    if (statusCode >= 500) return chalk.red.bold(statusCode);

}

const requestLogger = (req, res, next) => {
    const datetime = new Date().toLocaleString();
    const origin = `${chalkMethod(req.method)}\t${req.headers.origin}\t${req.originalUrl}`
    const requestBody = req.method !== 'GET' ? `${JSON.stringify(req.body)}\t${JSON.stringify(req.params)}` : '';
    const response = res.statusCode >= 100 && res.statusCode <= 399  ? `${chalk.bold.green(res.statusCode)}` : `${chalkStatus(res.statusCode)}`

    const message = chalk.bgBlackBright(`${datetime}\t${origin}\t${requestBody}\t${response}`)
    console.log(message);
    next();
}

export default(requestLogger)