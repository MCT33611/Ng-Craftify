export enum ColumnType {
    Text = 'text',
    Image = 'image',
    Action = 'action',
}

export interface ColumnConfig {
    key: string;
    type: ColumnType;
    header: string;
}
