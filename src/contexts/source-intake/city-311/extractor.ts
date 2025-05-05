export default class City311Extractor extends BaseExtractor {
    protected deriveTableName(url: string): string {
        return "";
    }
    transform(data: any) {
        throw new Error("Method not implemented.");
    }
    extract(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    store(): Promise<any> {
        throw new Error("Method not implemented.");
    } 
}