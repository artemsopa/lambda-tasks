export default class ApiError extends Error {
    status: number;
    errors: any[];

    constructor(status: number, message: string, errors: any[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static unauthorizedError() {
        return new ApiError(401, "you are not authorized");
    }

    static badRequest(message: string, errors: any[] = []) {
        return new ApiError(400, message, errors);
    }
}