import { Request } from "express";
import { ZodError } from "zod";
import { LeadSourceUserRepository } from "../../core/repository/users/UserRepository";
import { HttpStatus } from "../../enums";
//import { createSlug } from "../../interfaces/http/utils";
import { ApiError } from "../../interfaces/http/utils/ApiError";
import { ApiResponse } from "../../interfaces/http/utils/ApiResponse";
import { Operation } from "../Operation";
import { LeadSourceMessage } from "../leadSource/content";
//import { updateLeadSourceSchema } from "../leadSource/domain/update.lead-source.validator";

class UpdateUserSourceService extends Operation {

    constructor(private readonly leadSourceUserRepository: LeadSourceUserRepository) {
        super();
    }

    async execute(req: Request): Promise<void> {
        try {
            const result = await this.updateLeadSource(req.body);
            this.emit("SUCCESS", result);
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                this.emit("VALIDATION_ERROR", error);
            } else this.emit("ERROR", error as Error);
        }
    }

    async updateLeadSource(body: Request["body"]): Promise<ApiResponse> {
        // const payload = updateLeadSourceSchema.parse(body);
        // const slug = await createSlug(payload.name);

        const [ sameNameExist] = await Promise.all([
            this.leadSourceUserRepository.getOne({ name: body.name }, { _id: 1 })
            
        ]);

        // if (!leadSource) throw new ApiError(HttpStatus.NOT_FOUND, LeadSourceMessage.LeadSourceNotFound);
        if (sameNameExist) throw new ApiError(HttpStatus.CONFLICT, LeadSourceMessage.SameLeadSourceExist);

        const updatedLeadSource = await this.leadSourceUserRepository.findOneAndUpdateData({ _id: body.id}, { $set: { name: body.name} }, { name: 1 });
        return new ApiResponse(HttpStatus.OK, updatedLeadSource, LeadSourceMessage.LeadSourceUpdated);
    }
}

export { UpdateUserSourceService };

