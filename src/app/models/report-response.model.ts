export interface ReportResponse<T> {
    data: T;
    message: string;
    success: boolean;
}
