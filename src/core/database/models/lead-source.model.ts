import { Document, model, Model, Schema, Types } from "mongoose";

const modelName = "lead_sources";
type LeadSourceModel = Model<ILeadSource>;

interface ILeadSource extends Document {
    name: string;
    slug: string;
    organizationId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const LeadSourceSchema = new Schema<ILeadSource>(
    {
        name: {
            type: Schema.Types.String,
            required: true,
        },
        slug: {
            type: Schema.Types.String,
            required: true,
        },
        organizationId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        collection: modelName,
        timestamps: true,
        strict: true,
        versionKey: false,
    }
);

LeadSourceSchema.index({
    organizationId: 1,
    slug: 1,
});

const LeadSource = model<ILeadSource, LeadSourceModel>(
    modelName,
    LeadSourceSchema
);

export { ILeadSource, LeadSource, LeadSourceModel };
