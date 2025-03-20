import { Router } from "express";
import { CreateUserSourceService, DeleteUserSourceService, GetAllUserSourceService, UpdateUserSourceService } from "../../../app/users";
import { HttpStatus } from "../../../enums";
import { asyncHandler } from "../utils/asyncHandler";

type UserSourceService = CreateUserSourceService | GetAllUserSourceService | UpdateUserSourceService | DeleteUserSourceService;

class UserSourceController {
    constructor(
        private readonly services: {
            createUserSourceService: CreateUserSourceService;
            getAllUserSourceService: GetAllUserSourceService;
            updateUserSourceService: UpdateUserSourceService;
            deleteUserSourceService: DeleteUserSourceService;
        }
    ) { }

    get router(): Router {
        const router = Router();
        router.post("/create", this.handle(this.services.createUserSourceService, HttpStatus.CREATED));
        // router.post("/creates",(req,res)=>{
        //     console.log("req.body",req.body);
        //     res.status(200).send("ok");
        // });
        router.get("/get-all", this.handle(this.services.getAllUserSourceService));
        router.post("/update", this.handle(this.services.updateUserSourceService));
        router.post("/delete", this.handle(this.services.deleteUserSourceService));
        return router;
    }

    private handle(service: UserSourceService, successStatus = HttpStatus.OK) {
        console.log("service", service);
        return asyncHandler((req, res, next) => {
            service.on("SUCCESS", (result) => {
                if (!res.headersSent) res.status(successStatus).send(result);
            });
            service.on("VALIDATION_ERROR", next);
            service.on("ERROR", next);
            service.execute(req);
        });
    }
}

export { UserSourceController };

