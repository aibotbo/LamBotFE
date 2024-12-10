export default interface BotSettingUpdate {
    account_type?: string | number;
    master?: number;
    master_name?: string;
    o_amount?: number;
    fold_command?: number;
    status?: string;
    block_status?: string;
    current_profit?: number;
    current_date_profit?: number;
    current_volume?: number;
    current_date_volume?: number;
    aim_min?: number;
    aim_max?: number;
}