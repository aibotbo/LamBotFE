// Generated by https://quicktype.io

export default interface BotSignal {
    count: number | null;
    next: number | null;
    previous: number | null;
    results: BotSignalResult[];
}

export interface BotSignalResult {
    //CUSTOM
    id: string;
    bot_name?: string;
    win_streak?: number;
    total_win_streak?: number;
    lose_streak?: number;
    total_lose_streak?: number;
    total_win: number;
    total_lose: number;
    total_win_lose?: string;
    total_volume?: number;
    history?: string;
    output?: number;

    //API
    // id: number;
    // o_id: number;
    // ss_id: number;
    // o_amount: number;
    // o_fold: number;
    // o_type: string;
    // account_type: string;
    // o_time: number;
    // o_owner: number;
    // o_PartnerAcc_owner: number;
    // o_PartnerAcc_owner_name: string;
    // master: number;
    // follow_configid: null;
    // o_status: string;
    // o_result: number;
    // created_at: string;
    // updated_at: string;
    // date: string;
    // trade_type: string;
}

