import AWS from "aws-sdk";
import nconf from "../../configs";

class SESService {
    private ses: AWS.SES;

    constructor() {
        this.ses = new AWS.SES({
            accessKeyId: nconf.get("aws:accessKeyId"),
            secretAccessKey: nconf.get("aws:secretAccessKey"),
            region: nconf.get("aws:region"),
        });
    }

    public sendEmail(params: AWS.SES.SendEmailRequest): Promise<{ success: boolean; data?: AWS.SES.SendEmailResponse; error?: unknown }> {
        return new Promise(resolve => {
            try {
                const sendPromise = this.ses.sendEmail(params).promise();
                sendPromise
                    .then(function (data) {
                        resolve({ success: true, data });
                    }).catch(function (error) {
                        resolve({ success: false, error });
                    });
            } catch (error) {
                resolve({ success: false, error });
            }
        });
    }

}

export { SESService };

