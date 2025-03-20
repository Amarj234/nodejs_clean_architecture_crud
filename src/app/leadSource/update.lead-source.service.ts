import { Request } from "express";
import { ZodError } from "zod";
import { LeadSourceRepository } from "../../core/repository/leadSource/lead-source.repository";
import { HttpStatus } from "../../enums";
import { createSlug } from "../../interfaces/http/utils";
import { ApiError } from "../../interfaces/http/utils/ApiError";
import { ApiResponse } from "../../interfaces/http/utils/ApiResponse";
import { Operation } from "../Operation";
import { LeadSourceMessage } from "./content";
import { updateLeadSourceSchema } from "./domain/update.lead-source.validator";

class UpdateLeadSourceService extends Operation {

    constructor(private readonly leadSourceRepository: LeadSourceRepository) {
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
        const payload = updateLeadSourceSchema.parse(body);
        const slug = await createSlug(payload.name);

        const [leadSource, sameNameExist] = await Promise.all([
            this.leadSourceRepository.getOne({ _id: payload.leadSourceId, organizationId: payload.organizationId }, { _id: 1 }),
            this.leadSourceRepository.getOne({ _id: { $ne: payload.leadSourceId }, organizationId: payload.organizationId, slug }, { _id: 1 })
        ]);

        if (!leadSource) throw new ApiError(HttpStatus.NOT_FOUND, LeadSourceMessage.LeadSourceNotFound);
        if (sameNameExist) throw new ApiError(HttpStatus.CONFLICT, LeadSourceMessage.SameLeadSourceExist);

        const updatedLeadSource = await this.leadSourceRepository.findOneAndUpdateData({ _id: payload.leadSourceId }, { $set: { name: payload.name, slug } }, { name: 1 });
        return new ApiResponse(HttpStatus.OK, updatedLeadSource, LeadSourceMessage.LeadSourceUpdated);
    }
}

export { UpdateLeadSourceService };

