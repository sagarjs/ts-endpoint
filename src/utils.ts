export class BadRequest {
    public readonly code: number = 400
    public readonly msg: string = "Bad Request"

    constructor(msg: string){
        this.msg = msg
    }
}

export class ServerError {
    public readonly code?: number = 500;
    public readonly msg?: string = 'Internal Server Error';
    public readonly internalServerErrors?: InternalServerError[];

    constructor(
        code: number = 500,
        internalServerErrors?: InternalServerError[],
    ) {
        this.code = code;
        this.internalServerErrors = internalServerErrors;
    }
}

export class InternalServerError {
    public readonly code?: number = 1000;
    public readonly name?: string = 'UnknownError';
    public readonly msg: string;
    public readonly stackTrace: any;

    constructor(msg: string, stackTrace: any) {
        this.msg = msg;
        this.stackTrace = stackTrace;
    }
}
