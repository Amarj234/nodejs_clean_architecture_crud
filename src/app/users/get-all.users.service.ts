import { Request } from "express";
import { ZodError } from "zod";
import { LeadSourceUserRepository } from "../../core/repository/users/UserRepository";
import { HttpStatus } from "../../enums";
import { ApiResponse } from "../../interfaces/http/utils/ApiResponse";
import { Operation } from "../Operation";
//import { getAllLeadSourceSchema } from "../leadSource/domain/get-all.lead-source.validator";

class GetAllUserSourceService extends Operation {
    constructor(private readonly leadSourceUserRepository: LeadSourceUserRepository) {
        super();
    }

    async execute(req: Request): Promise<void> {
        try {
            const result = await this.getAllLeadSource(req.body);
            this.emit("SUCCESS", result);
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                this.emit("VALIDATION_ERROR", error);
            } else this.emit("ERROR", error as Error);
        }
    }

    async getAllLeadSource(body: Request["body"]): Promise<ApiResponse> {
        //const payload = getAllLeadSourceSchema.parse(body);
try{

    const leadSources = await this.leadSourceUserRepository.getList();
 
    return new ApiResponse(HttpStatus.OK, leadSources, "Sucsses", leadSources.length);
} catch(e) {


}
       
      
       
    }
}

export { GetAllUserSourceService };
