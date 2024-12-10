// Generated by https://quicktype.io

export interface AutoBotSignalTelegram {
    count: number;
    next: null;
    previous: null;
    results: AutoBotSignalTelegramResult[];
}

export interface AutoBotSignalTelegramResult {
    id: number;
    bot_name: string;
    win_accum: number;
    lose_accum: number;
    total_win: number;
    total_lose: number;
    total_volume: number;
}
