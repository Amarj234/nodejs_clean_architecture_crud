import AWS from "aws-sdk";
import nconf from "../../configs";

class S3Service {
    private s3: AWS.S3;
    private imageBucketName: string;

    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: nconf.get("aws:accessKeyId"),
            secretAccessKey: nconf.get("aws:secretAccessKey"),
            region: nconf.get("aws:region"),
        });
        this.imageBucketName = nconf.get("aws:imageBucketName");
    }

    private async s3Operation<T>(operation: () => Promise<T>): Promise<{ success: boolean; data?: T; error?: unknown }> {
        try {
            const data = await operation();
            return { success: true, data };
        } catch (error) {
            throw error;
        }
    }

    public async upload(key: string, body: Buffer, mimetype: string, bucketName: string = this.imageBucketName):
        Promise<{ success: boolean; data?: AWS.S3.ManagedUpload.SendData; error?: unknown }> {
        const params: AWS.S3.PutObjectRequest = {
            Bucket: bucketName,
            Key: key,
            Body: body,
            ContentType: mimetype,
        };

        return this.s3Operation(() => this.s3.upload(params).promise());
    }

    public async deleteObject(key: string, bucketName: string = this.imageBucketName):
        Promise<{ success: boolean; data?: AWS.S3.DeleteObjectOutput; error?: unknown }> {
        const params: AWS.S3.DeleteObjectRequest = {
            Key: key,
            Bucket: bucketName,
        };

        return this.s3Operation(() => this.s3.deleteObject(params).promise());
    }

    public async deleteObjects(keys: string[], bucketName: string = this.imageBucketName):
        Promise<{ success: boolean; data?: AWS.S3.DeleteObjectsOutput; error?: unknown }> {
        const params: AWS.S3.DeleteObjectsRequest = {
            Delete: {
                Objects: keys.map(key => ({ Key: key })),
            },
            Bucket: bucketName,
        };

        return this.s3Operation(() => this.s3.deleteObjects(params).promise());
    }
}

export { S3Service };
