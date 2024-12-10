// Generated by https://quicktype.io

export default interface BotSignalPersonalUpsert {
    config_name?: string;
    owner_type?: string;
    config_type?: string;
    conditions?: Conditions;
    is_onlytrade?: boolean;
}

export interface Conditions {
    [key: string]: {
        [key: string]: any;
    }
}