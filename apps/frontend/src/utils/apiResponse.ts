export class ApiResponse<T = any> {
    statusCode: number;
    success: boolean;
    data: T | null;
    message: string;

    constructor(statusCode: number, data: T | null, message: string) {
        this.statusCode = statusCode;
        this.success = statusCode >= 200 && statusCode < 300;
        this.data = data;
        this.message = message;
    }
}

export class ApiError extends ApiResponse<null> {
    constructor(statusCode: number, message: string) {
        super(statusCode, null, message);
    }
}
