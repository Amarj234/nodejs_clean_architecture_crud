import { Request } from "express";
import { ZodError } from "zod";
import { LeadSourceRepository } from "../../core/repository/leadSource/lead-source.repository";
import { HttpStatus } from "../../enums";
import { ApiResponse } from "../../interfaces/http/utils/ApiResponse";
import { Operation } from "../Operation";
import { getAllLeadSourceSchema } from "./domain/get-all.lead-source.validator";

class GetAllLeadSourceService extends Operation {
    constructor(private readonly leadSourceRepository: LeadSourceRepository) {
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
        const payload = getAllLeadSourceSchema.parse(body);

        const leadSources = await this.leadSourceRepository.getList({ organizationId: payload.orgId }, { name: 1 });
        return new ApiResponse(HttpStatus.OK, leadSources, "", leadSources.length);
    }
}

export { GetAllLeadSourceService };
