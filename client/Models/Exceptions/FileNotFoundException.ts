export class FileNotFoundException extends Error{
    constructor(filePath: string) {
        super(`File not found: ${filePath}`);
        this.name = "FileNotFoundException";
        Object.setPrototypeOf(this, FileNotFoundException.prototype);
    }
}