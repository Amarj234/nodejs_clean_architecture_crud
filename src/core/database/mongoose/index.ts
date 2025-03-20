import mongoose from "mongoose";
import nconf from "../../../configs";

const mongooseConnect = (config: nconf.Provider) => {
    const uri = config.env().get("DATABASE_URL");

    // set mongoose Promise to Bluebird
    mongoose.Promise = Promise;

    // Exit application on error
    mongoose.connection.on("error", (err) => {
        console.log("in m error ", err);
        // logger.error(`MongoDB connection error: ${err}`);
        process.exit(1);
    });

    // print mongoose logs in dev env
    mongoose.set("debug", true);

    mongoose.connect(uri);

    return new Promise((resolve, reject) => {
        mongoose.connection.on("connected", () => {
            console.log("in m uri ", uri);
            // logger.info(`Mongoose default connection is open to ${uri}`);
            console.log(`Database Connected Successfully to ${uri}`);
            resolve(mongoose.connection);
        });
    });
};

export default mongooseConnect;
