import { AggregateOptions, PipelineStage, ProjectionType, RootFilterQuery, UpdateQuery } from "mongoose";
import { checkIfPopulateExits } from "../../../interfaces/http/utils";
import { Populate } from "../../../types";
import { IUser, UserSourceModel } from "../../database/models/user-register";

class LeadSourceUserRepository {

    constructor(private readonly UserSourceModel: UserSourceModel) { }

    async getOne(
        condition: RootFilterQuery<IUser> = {},
        fields: ProjectionType<IUser> = {},
        populate: Populate = []
    ): Promise<IUser> {
        const query = this.UserSourceModel.findOne(condition, fields);
        if (checkIfPopulateExits(populate)) query.populate(populate);
        return await query.lean<IUser>().exec();
    }


    // async getList(): Promise<IUser[]> {
    
    //     try {
    //         const query = this.UserSourceModel.find();
    //         return await query.lean<IUser[]>().exec();
    //     } catch (error) {
    //         console.error("Error fetching user list:", error);
    //         throw new Error("Failed to fetch user list");
    //     }
    // }

    async getList(
        condition: RootFilterQuery<IUser> = {},
        fields: ProjectionType<IUser> = {},
        populate: Populate = [],
        options: { skip?: number; limit?: number; sort?: Record<string, 1 | -1> } = {}
    ): Promise<IUser[]> {
        console.log(" leadrtjkk"+fields);
        const query = this.UserSourceModel.find(condition, fields);
        console.log("query", query);
        if (checkIfPopulateExits(populate)) query.populate(populate);

        if (options.skip) query.skip(options.skip);
        if (options.limit) query.limit(options.limit);
        if (options.sort) query.sort(options.sort);

        return await query.lean<IUser[]>().exec();
    }

    async createData(data: Partial<IUser>): Promise<IUser> {
        const leadSource = new this.UserSourceModel(data);
        return await leadSource.save();
    }

    async findOneAndUpdateData(
        condition: RootFilterQuery<IUser> = {},
        updateData: UpdateQuery<IUser> = {},
        returnField: ProjectionType<IUser> = {}
    ): Promise<IUser | null> {
        return await this.UserSourceModel
            .findOneAndUpdate(condition, updateData, {
                new: true,
                projection: returnField,
            })
            .lean<IUser>()
            .exec();
    }

    // async updateOneData(
    //     condition: RootFilterQuery<IUser> = {},
    //     setData: UpdateQuery<IUser> = {}
    // ): Promise<number> {
    //     const result = await this.LeadSourceUser.updateOne(condition, setData).exec();
    //     return result.modifiedCount;
    // }

    async updateManyData(condition: RootFilterQuery<IUser> = {}, setData: UpdateQuery<IUser> = {}): Promise<number> {
        const result = await this.UserSourceModel.updateMany(condition, setData).exec();
        return result.modifiedCount;
    }

    async deleteOneData(condition: RootFilterQuery<IUser> = {}): Promise<void> {
        await this.UserSourceModel.deleteOne(condition).exec();
    }

    async deleteManyData(condition: RootFilterQuery<IUser> = {}): Promise<void> {
        await this.UserSourceModel.deleteMany(condition).exec();
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
        return await this.UserSourceModel.aggregate<T>(enhancedPipeline).option(aggregateOptions).exec();
    }

}

export { LeadSourceUserRepository };

