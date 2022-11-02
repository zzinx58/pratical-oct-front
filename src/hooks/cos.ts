import * as COS from "cos-js-sdk-v5"
// var COS = require("cos-js-sdk-v5")

export interface InputParams  {
    Bucket?: string;
    Region?: string;
    Key?: string; 
    Body?: File|Blob;
    Sign?: Boolean;
}

export class COS_Service {
    basicParams = {
        Bucket: import.meta.env.VITE_COS_BUCKET,
        Region: import.meta.env.VITE_COS_REGION,
    }
    //@ts-ignore
    COSInstance: COS

    constructor() {
        //@ts-ignore
        this.COSInstance = new COS({
            SecretId: import.meta.env.VITE_COS_SECRETID,
            SecretKey: import.meta.env.VITE_COS_SECRETKEY,
        })
        console.log(this.COSInstance);
        
    }
    async uploadFile(inputParams?: InputParams):Promise<COS.UploadFileItemResult> {
        const myParams = {
            ...this.basicParams,
            ...inputParams,
        } as COS.UploadFileParams;
        const result = await this.COSInstance.uploadFile(myParams);
        return result;
    }

    async getAlbumContent(albumName: string, inputParams?: InputParams) {
        const myParams = {
            ...this.basicParams,
            Prefix: albumName + "/",
            ...inputParams,
        }
        const result = await this.COSInstance.getBucket(myParams);
        return result;
    }

    async getObjectUrl(inputParams?: InputParams) {
        const myParams = {
            ...this.basicParams,
            ...inputParams,
        } as COS.GetObjectUrlParams;
        const result = await new Promise((resolve, rejects) => {
            // this.COSInstance.getObjectUrl();
            this.COSInstance.getObjectUrl(myParams, (err,data) => {
                if(err) {
                    console.log(err);
                    rejects(err);
                }
                resolve(data.Url);
            })
        })
        return result;
    }

    async getBuckets() {
        const myParams = {
            ...this.basicParams,
        };
        const result = this.COSInstance.getService(myParams);
        return result;
    }

    async main() {
    
        const cosService = new COS_Service();
        const userAccountName = "1095568627@qq.com";
        const userAlbums = "userAlbums";
        const _albumName = "defaultAlbum";
        //no-need last "/"
        const getContentUrl = `${userAccountName}/${userAlbums}/${_albumName}`;
        // cosService.getAlbumContent(getContentUrl);
        const result = cosService.COSInstance.getBucket({
            Bucket: import.meta.env.VITE_COS_BUCKET,
            Region: import.meta.env.VITE_COS_REGION,
            Prefix: "q1095568627@163.com",
        });
        console.log(result);
    }
}


