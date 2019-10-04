export class ResponseObj {
    public static ErrorCode: number;
    public static Message: string;
    public static Data: object;

    public toJson() {
        var data = {
            ErrorCode: ResponseObj.ErrorCode,
            Message: ResponseObj.Message,
            Data: ResponseObj.Data,
        }
        return data;
    }

}