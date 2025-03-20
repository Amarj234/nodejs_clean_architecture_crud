import { Request, Response, Router } from "express";
import { AddressInfo } from "net";
import nconf from "./configs";
import container from "./container";
import mongooseConnect from "./core/database/mongoose";
import { verifyJwt } from "./interfaces/http/middlewares/auth.middleware";
import router from "./router";

const app = container.resolve("app");

declare global {
    namespace Express {
        export interface Request {
            // user?: IUser;
        }
    }
}

const startServer = () => {
    const apiRouter: Router = Router();

    apiRouter.use(verifyJwt);

    apiRouter.use("/health-check", (_req: Request, res: Response) => { res.status(200).send("Success") });

    apiRouter.use("/api/v1", router);
    app.use(apiRouter);
    app.use(container.resolve("errorHandler"));

    const server = app.listen(nconf.get("web:port"), () => {
        const { port } = server.address() as AddressInfo;
        console.log(`[p ${process.pid}] Listening at port ${port}`);
    });
};

try {
    mongooseConnect(nconf).then(startServer);
} catch (err) {
    console.log("Server Encountered error: ", err);
}
