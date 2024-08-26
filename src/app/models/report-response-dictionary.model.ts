export interface ReportResponseDictionary<T> {
    data: { [key: string]: T };
    message: string;
    success: boolean;
}