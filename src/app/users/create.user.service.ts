import { Request } from "express";
import { ZodError } from "zod";
import { LeadSourceUserRepository } from "../../core/repository/users/UserRepository";
import { HttpStatus } from "../../enums";
//import { createSlug } from "../../interfaces/http/utils";
import { ApiError } from "../../interfaces/http/utils/ApiError";
import { ApiResponse } from "../../interfaces/http/utils/ApiResponse";
import { Operation } from "../Operation";
import { LeadSourceMessage } from "../leadSource/content";
import { userSchemaValidate } from "../leadSource/domain/user.validation/user-create.validation";
//import { createLeadSourceSchema } from "../leadSource/domain/create.lead-source.validator";

class CreateUserSourceService extends Operation {
    constructor(private readonly leadSourceUserRepository: LeadSourceUserRepository) {
        super();
    }

    async execute(req: Request): Promise<void> {
        try {
            const result = await this.createLeadSource(req.body);
            this.emit("SUCCESS", result);
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                this.emit("VALIDATION_ERROR", error);
            } else this.emit("ERROR", error as Error);
        }
    }

    async createLeadSource(body: Request["body"]): Promise<ApiResponse> {
        const payload = userSchemaValidate.parse(body);
        console.log(payload);
    //      const slug = await createSlug(payload.name);
        const existingLeadSource = await this.leadSourceUserRepository.getOne({ name: payload.name });

        if (existingLeadSource) {
            throw new ApiError(HttpStatus.CONFLICT, LeadSourceMessage.SameLeadSourceExist);
        }

        const leadSource = await this.leadSourceUserRepository.createData(body);
        return new ApiResponse(HttpStatus.CREATED, leadSource, LeadSourceMessage.LeadSourceCreated);
    }
}

export { CreateUserSourceService };

