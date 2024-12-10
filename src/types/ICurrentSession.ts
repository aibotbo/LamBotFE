export default interface ICurrentSession {
    ok: boolean;
    d: ISession;
}

export interface ISession {
    ss_id: number;
    ss_t: string;
    o_price: number;
    c_price: number;
    r_second: number;
    st_time: string;
    start_second?: number;
}

export interface ISessionLocal {
    r_second: number;
    ss_t: string;
}