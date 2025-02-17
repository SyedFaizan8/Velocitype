// apiResponse.ts
export class ApiResponse<T> {
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

    toJSON() {
        return {
            statusCode: this.statusCode,
            success: this.success,
            data: this.data,
            message: this.message,
        };
    }
}

export class ApiError extends ApiResponse<null> {
    constructor(statusCode: number, message: string) {
        super(statusCode, null, message);
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            success: this.success,
            data: this.data,
            message: this.message,
        };
    }
}
