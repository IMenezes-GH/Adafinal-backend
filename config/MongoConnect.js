import { connect } from "mongoose";

const DB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await connect(DB_URI);
        console.log(chalk.green('MongoDB connected succesfully'));

    } catch (err){
        console.log(chalk.red(err.message));
    }
}

export default connectDB