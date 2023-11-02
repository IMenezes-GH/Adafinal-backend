import { connect } from "mongoose";
import chalk from "chalk";

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await connect(MONGODB_URI);
        console.log((`Database: ${chalk.green('MongoDB connected succesfully')}`));

    } catch (err){
        console.log(chalk.red(err.message));
    }
}

export default connectDB