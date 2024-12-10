// Generated by https://quicktype.io

export default interface BotSignalHistory {
    count: number | null;
    next: number | null;
    previous: number | null;
    results: BotSignalHistoryResult[];
}

export interface BotSignalHistoryResult {
    //CUSTOM
    output?: number;

    //API
    id: number | string;
    o_id: number | string;
    ss_id: number | string;
    o_amount: number;
    o_type: string;
    o_result: number;
    created_at: string;

    // o_fold: number;
    // account_type: string;
    // o_time: number;
    // o_owner: number;
    // o_PartnerAcc_owner: number;
    // o_PartnerAcc_owner_name: string;
    // master: number;
    // follow_configid: null;
    // o_status: string;
    // updated_at: string;
    // date: string;
    // trade_type: string;
}
