export class MedLexiconError extends Error {
    constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
        super(message);
        this.name = "MedLexiconError";
        this.statusCode = statusCode;
        this.code = code;
    }
}