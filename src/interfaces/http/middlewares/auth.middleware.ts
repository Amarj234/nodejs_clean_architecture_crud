import { RequestHandler } from "express";
import nconf from "../../../configs";
import { HttpStatus } from "../../../enums";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const verifyJwt: RequestHandler = asyncHandler(async (req, _res, next) => {
    const unlessUrls: string[] = nconf.get("unlessUrls");
    const staticToken: string = nconf.get("general:staticToken");

    // Skip authentication for excluded URLs
    if (unlessUrls.includes(req.path)) {

        
        return next();
    }

    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized Request");
    }

    // Allow if the token matches the static token
    if (token === staticToken) {
        return next();
    }

    // const clientUserRepository = container.resolve("clientUserRepository");

    // const decodedToken = jwt.verify(token, nconf.get("jwt:secret"));
    // const user = await clientUserRepository.getOne({ _id: decodedToken.sub });

    // if (!user) {
    //     throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized Request");
    // }

    // req.user = user;

    next();
});

export { verifyJwt };

