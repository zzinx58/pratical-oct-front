import * as COS from "cos-js-sdk-v5"
// var COS = require("cos-js-sdk-v5")

const Bucket = "school-work-1308651335"
const Region = "ap-shanghai"
const SecretId = "AKIDa8GRYQ7gDaouoX5QlGkHh2JQNAnGYcQ2"
const SecretKey = "SAuU42qQlrId52tdHpLl17C6sfKm252w"

//@ts-ignore
const COSInstance = new COS({
    SecretId: SecretId,
    SecretKey: SecretKey
})

export default COSInstance