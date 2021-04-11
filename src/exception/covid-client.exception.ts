export class CovidClientException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CovidClientException';
        Object.setPrototypeOf(this, CovidClientException.prototype);
    }
}
