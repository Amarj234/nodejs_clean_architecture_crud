import dotenv from "dotenv";
import nconf from "nconf";
import path from "path";

dotenv.config({ path: "./.env" });
nconf.load();

const env = nconf.env().get("NODE_ENV");

// path to file can be local as well as remote
const configPath = path.join(__dirname, `${env}.config.json`);
nconf.argv().env().file({ file: configPath });

// Setting default values for the variables
// nconf.set("web:port", 3001);

export default nconf;
