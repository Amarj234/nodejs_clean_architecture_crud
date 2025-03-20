import { Request } from "express";
import { Types } from "mongoose";
import { ZodError } from "zod";
import { LeadSourceRepository } from "../../core/repository/leadSource/lead-source.repository";
import { HttpStatus } from "../../enums";
import { createSlug } from "../../interfaces/http/utils";
import { ApiError } from "../../interfaces/http/utils/ApiError";
import { ApiResponse } from "../../interfaces/http/utils/ApiResponse";
import { Operation } from "../Operation";
import { LeadSourceMessage } from "./content";
import { createLeadSourceSchema } from "./domain/create.lead-source.validator";

class CreateLeadSourceService extends Operation {
    constructor(private readonly leadSourceRepository: LeadSourceRepository) {
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
        const payload = createLeadSourceSchema.parse(body);
        console.log(payload);
        const slug = await createSlug(payload.name);
        const existingLeadSource = await this.leadSourceRepository.getOne({ organizationId: payload.organizationId, slug }, { _id: 1 });

        if (existingLeadSource) {
            throw new ApiError(HttpStatus.CONFLICT, LeadSourceMessage.SameLeadSourceExist);
        }

        const leadSource = await this.leadSourceRepository.createData({ slug, name: payload.name, organizationId: new Types.ObjectId(payload.organizationId) });
        return new ApiResponse(HttpStatus.CREATED, leadSource, LeadSourceMessage.LeadSourceCreated);
    }
}

export { CreateLeadSourceService };

