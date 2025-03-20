import { Request } from "express";
import { ZodError } from "zod";
import { LeadSourceUserRepository } from "../../core/repository/users/UserRepository";
import { HttpStatus } from "../../enums";
import { ApiError } from "../../interfaces/http/utils/ApiError";
import { ApiResponse } from "../../interfaces/http/utils/ApiResponse";
import { Operation } from "../Operation";
import { LeadSourceMessage } from "../leadSource/content";
//import { deleteLeadSourceSchema } from "../leadSource/domain/delete.lead-source.validator";

class DeleteUserSourceService extends Operation {

    constructor(private readonly leadSourceUserRepository: LeadSourceUserRepository) {
        super();
    }

    async execute(req: Request): Promise<void> {
        try {
            const result = await this.deleteLeadSource(req.body);
            this.emit("SUCCESS", result);
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                this.emit("VALIDATION_ERROR", error);
            } else this.emit("ERROR", error as Error);
        }
    }

    async deleteLeadSource(body: Request["body"]): Promise<ApiResponse> {
       // const payload = deleteLeadSourceSchema.parse(body);

        const leadSource = await this.leadSourceUserRepository.getOne({ _id: body.id });

        if (!leadSource) {
            throw new ApiError(HttpStatus.NOT_FOUND, LeadSourceMessage.LeadSourceNotFound);
        }

        await this.leadSourceUserRepository.deleteOneData({ _id: body.id });
        return new ApiResponse(HttpStatus.OK, { _id: leadSource._id, isDelete: true }, LeadSourceMessage.LeadSourceDeleted);
    }
}

export { DeleteUserSourceService };

