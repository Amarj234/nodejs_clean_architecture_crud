import { AggregateOptions, PipelineStage, ProjectionType, RootFilterQuery, UpdateQuery } from "mongoose";
import { checkIfPopulateExits } from "../../../interfaces/http/utils";
import { Populate } from "../../../types";
import { ILeadSource, LeadSourceModel, } from "../../database/models/lead-source.model";

class LeadSourceRepository {

    constructor(private readonly LeadSourceModel: LeadSourceModel) { }

    async getOne(
        condition: RootFilterQuery<ILeadSource> = {},
        fields: ProjectionType<ILeadSource> = {},
        populate: Populate = []
    ): Promise<ILeadSource> {
        const query = this.LeadSourceModel.findOne(condition, fields);
        if (checkIfPopulateExits(populate)) query.populate(populate);
        return await query.lean<ILeadSource>().exec();
    }

    async getList(
        condition: RootFilterQuery<ILeadSource> = {},
        fields: ProjectionType<ILeadSource> = {},
        populate: Populate = [],
        options: { skip?: number; limit?: number; sort?: Record<string, 1 | -1> } = {}
    ): Promise<ILeadSource[]> {
        const query = this.LeadSourceModel.find(condition, fields);
        if (checkIfPopulateExits(populate)) query.populate(populate);

        if (options.skip) query.skip(options.skip);
        if (options.limit) query.limit(options.limit);
        if (options.sort) query.sort(options.sort);

        return await query.lean<ILeadSource[]>().exec();
    }

    async createData(data: Partial<ILeadSource>): Promise<ILeadSource> {
        const leadSource = new this.LeadSourceModel(data);
        return await leadSource.save();
    }

    async findOneAndUpdateData(
        condition: RootFilterQuery<ILeadSource> = {},
        updateData: UpdateQuery<ILeadSource> = {},
        returnField: ProjectionType<ILeadSource> = {}
    ): Promise<ILeadSource | null> {
        return await this.LeadSourceModel
            .findOneAndUpdate(condition, updateData, {
                new: true,
                projection: returnField,
            })
            .lean<ILeadSource>()
            .exec();
    }

    // async updateOneData(
    //     condition: RootFilterQuery<ILeadSource> = {},
    //     setData: UpdateQuery<ILeadSource> = {}
    // ): Promise<number> {
    //     const result = await this.LeadSourceModel.updateOne(condition, setData).exec();
    //     return result.modifiedCount;
    // }

    async updateManyData(condition: RootFilterQuery<ILeadSource> = {}, setData: UpdateQuery<ILeadSource> = {}): Promise<number> {
        const result = await this.LeadSourceModel.updateMany(condition, setData).exec();
        return result.modifiedCount;
    }

    async deleteOneData(condition: RootFilterQuery<ILeadSource> = {}): Promise<void> {
        await this.LeadSourceModel.deleteOne(condition).exec();
    }

    async deleteManyData(condition: RootFilterQuery<ILeadSource> = {}): Promise<void> {
        await this.LeadSourceModel.deleteMany(condition).exec();
    }

    async aggregateData<T>(
        pipeline: PipelineStage[], // Array of valid aggregation stages
        options?: {
            skip?: number;
            limit?: number;
            sort?: Record<string, 1 | -1>;
            hint?: string | Record<string, 1 | -1>; // Hint to specify index
            allowDiskUse?: boolean; // Enable disk usage for aggregation
        }
    ): Promise<T[]> {
        const enhancedPipeline: PipelineStage[] = [...pipeline];

        // Dynamically append skip, limit, and sort stages if provided
        if (options?.sort) enhancedPipeline.push({ $sort: options.sort });
        if (options?.skip !== undefined) enhancedPipeline.push({ $skip: options.skip });
        if (options?.limit !== undefined) enhancedPipeline.push({ $limit: options.limit });

        // Configure additional aggregate options
        const aggregateOptions: AggregateOptions = {};
        if (options?.allowDiskUse) aggregateOptions.allowDiskUse = true;
        if (options?.hint) aggregateOptions.hint = options.hint;

        // Execute the aggregation pipeline with options
        return await this.LeadSourceModel.aggregate<T>(enhancedPipeline).option(aggregateOptions).exec();
    }

}

export { LeadSourceRepository };

