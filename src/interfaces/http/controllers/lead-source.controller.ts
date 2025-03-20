import { Router } from "express";
import { CreateLeadSourceService, DeleteLeadSourceService, GetAllLeadSourceService, UpdateLeadSourceService } from "../../../app/leadSource";
import { HttpStatus } from "../../../enums";
import { asyncHandler } from "../utils/asyncHandler";

type LeadSourceService = CreateLeadSourceService | GetAllLeadSourceService | UpdateLeadSourceService | DeleteLeadSourceService;

class LeadSourceController {
    constructor(
        private readonly services: {
            createLeadSourceService: CreateLeadSourceService;
            getAllLeadSourceService: GetAllLeadSourceService;
            updateLeadSourceService: UpdateLeadSourceService;
            deleteLeadSourceService: DeleteLeadSourceService;
        }
    ) { }

    get router(): Router {
        const router = Router();
        router.post("/create", this.handle(this.services.createLeadSourceService, HttpStatus.CREATED));
        // router.post("/creates",(req,res)=>{
        //     console.log("req.body",req.body);
        //     res.status(200).send("ok");
        // });
        router.post("/get-all", this.handle(this.services.getAllLeadSourceService));
        router.post("/update", this.handle(this.services.updateLeadSourceService));
        router.post("/delete", this.handle(this.services.deleteLeadSourceService));
        return router;
    }

    private handle(service: LeadSourceService, successStatus = HttpStatus.OK) {
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

export { LeadSourceController };

