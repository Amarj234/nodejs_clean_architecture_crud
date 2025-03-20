import { Request } from "express";
import { ZodError } from "zod";
import { LeadSourceRepository } from "../../core/repository/leadSource/lead-source.repository";
import { HttpStatus } from "../../enums";
import { ApiError } from "../../interfaces/http/utils/ApiError";
import { ApiResponse } from "../../interfaces/http/utils/ApiResponse";
import { Operation } from "../Operation";
import { LeadSourceMessage } from "./content";
import { deleteLeadSourceSchema } from "./domain/delete.lead-source.validator";

class DeleteLeadSourceService extends Operation {

    constructor(private readonly leadSourceRepository: LeadSourceRepository) {
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
        const payload = deleteLeadSourceSchema.parse(body);

        const leadSource = await this.leadSourceRepository.getOne({ _id: payload.leadSourceId }, { _id: 1 });

        if (!leadSource) {
            throw new ApiError(HttpStatus.NOT_FOUND, LeadSourceMessage.LeadSourceNotFound);
        }

        await this.leadSourceRepository.deleteOneData({ _id: payload.leadSourceId });
        return new ApiResponse(HttpStatus.OK, { _id: leadSource._id, isDelete: true }, LeadSourceMessage.LeadSourceDeleted);
    }
}

export { DeleteLeadSourceService };

