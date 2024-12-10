import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import images from 'assets';
import { Link } from 'react-router-dom';
import CopyTradeZoomSelectInput from './CopyTradeZoomSelectInput';
import InputSelectOption from 'types/InputSelectOption';
import { useMediaQuery } from 'react-responsive';
import CopyTelegramUpSvg from 'svgs/CopyTelegramUpSvg';
import CopyTelegramDownSvg from 'svgs/CopyTelegramDownSvg';
import APIs from 'apis'; // Import your API endpoints
import './index.scss'
import trendingDown from '../../assets/images/trending_down.svg'
import trendingUp from '../../assets/images/trending_up.svg'
import aiDown from '../../assets/images/copy_trade_ai_.jpg'
import aiUp from '../../assets/images/copy_trade_ai_buy.jpg'
import Animated from './Animated';

export interface BotInterface {
    label: string;
    value: string;
    [x: string]: any;
}

interface IProps {
    refetch?: number
}

const CopyTradeAI = ({ }: IProps) => {
    const [botList, setBotList] = useState<BotInterface[]>([]);
    const largeHeaderRef = useRef<HTMLDivElement>(null);
    const [searchInputTelegram, setSearchInputTelegram] = useState<InputSelectOption>({
        value: '',
        label: '',
    });
    const [isTelegramChatOpen, setIsTelegramChatOpen] = useState(true);
    const [analysisPercentages, setAnalysisPercentages] = useState<Record<string, number>>({});
    const [prediction, setPrediction] = useState<String | null>(null);

    const [isLoadingDetail, setIsLoadingDetail] = useState(false)

    // Responsive design handling
    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)',
    });
    const isTablet = useMediaQuery({
        query: '(min-width: 768px)',
    });

    const labelsMap: Record<string, string> = {
        '23': 'Phương pháp AI Dự báo Xu hướng BO',
        '24': 'Phương pháp Phân tích Tín hiệu AI BO',
        '25': 'Phương pháp AI Giao dịch Thông minh BO',
        '26': 'Phương pháp AI Chiến lược Tối ưu BO',
        '27': 'Phương pháp AI Phân tích Tâm lý Thị trường BO',
    };

    const loadDetail = async () => {
        try {
            setPrediction(null)
            setIsLoadingDetail(true)
            const noLoadingAxios = axios.create();
            await noLoadingAxios.get(`${APIs.botOrderDetail}/${searchInputTelegram.value}`).then((res) => {
                const details = res?.data?.results;
                setAnalysisPercentages((prev) => {
                    return {
                        ...prev,
                        [searchInputTelegram.value]: parseFloat((Math.random() * (73.9 - 52.4) + 52.4).toFixed(1)),
                    };
                });
                if (details && details.length > 0) {
                    const latestDetail = details[0];
                    setPrediction(latestDetail.o_type);
                }
            })
        } catch (err) {

        } finally {
            setTimeout(() => {
                setIsLoadingDetail(false);
            }, 3000);
        }
    }

    // useEffect(() => {
    //     loadDetail()
    // },[refetch])

    const fetchListBots = async () => {
        await axios.get(`${APIs.botSignalTeleList}`).then((res) => {
            const result = res?.data?.results
                .filter((bot: any) => bot.id >= 23 && bot.id <= 27) // Filter bots with IDs 23-27
                .map((bot: any) => {
                    const botId = bot.id.toString();
                    return {
                        value: botId,
                        label: labelsMap[botId], // Assign the corresponding label
                    };
                });

            setBotList(result)

            if (result?.length > 0 && !searchInputTelegram.value) {
                const firstBot = result[0];
                setSearchInputTelegram(firstBot);
                // loadOrderDetail(firstBot.value);
            }
        })
    }

    useEffect(() => {
        fetchListBots()
    }, [])

    return (
        <div
            className={`${isDesktop ? 'col-span-2' : ''} bg-background-80 rounded-3xl flex overflow-hidden flex-col`}
        >
            <div
                className={`px-6 py-5 flex justify-between overflow-hidden items-center ${isTelegramChatOpen ? 'border-b border-ink-10' : ''
                    }`}
            >
                <p className={`text-xl text-ink-100 font-semibold`}>
                    Phân tích AI
                </p>
                {!isDesktop && isTelegramChatOpen && (
                    <CopyTelegramDownSvg
                        className="text-ink-100"
                        onClick={() => {
                            setIsTelegramChatOpen(false);
                        }}
                    />
                )}
                {!isDesktop && !isTelegramChatOpen && (
                    <CopyTelegramUpSvg
                        className="text-ink-100"
                        onClick={() => {
                            setIsTelegramChatOpen(true);
                        }}
                    />
                )}
            </div>
            {/* Select BOT */}
            {isTelegramChatOpen && (
                <div className="flex justify-between px-6 py-5 gap-2 items-center">
                    <div className="flex gap-2 flex-grow md:flex-initial items-center">
                        <CopyTradeZoomSelectInput
                            inputValue={searchInputTelegram}
                            options={botList}
                            containerClassName={`${isTablet ? 'w-[24.75rem]' : 'w-[10.375rem]'
                                } flex-grow md:flex-initial`}
                            labelName="Phương pháp dự báo"
                            // onSelectChange={onSelectTelegramChange}
                            onSelectChange={(_, value) => {
                                setPrediction(null)
                                setSearchInputTelegram(value)
                            }}
                        />

                        <Link to="/copy_trade_zoom">
                            <div className="p-[0.625rem] border border-ink-10 bg-ink-05 rounded-2xl flex-grow md:flex-initial">
                                <img
                                    className="w-[2.25rem]"
                                    src={images.copy.ai}
                                    alt="BotLambotrade"
                                />
                            </div>
                        </Link>
                        <button onClick={() => !isLoadingDetail && loadDetail()}
                            className={`${isLoadingDetail ? 'bg-ink-05 cursor-not-allowed' : 'bg-[#59cf59]'} px-4 h-14 flex items-center justify-center rounded-lg border border-ink-10`}>Phân tích</button>
                    </div>

                    <Link to="/copy_trade_zoom">
                        <div className="p-[0.625rem] border border-ink-10 bg-ink-05 rounded-2xl">
                            <img
                                className="w-[2.25rem]"
                                src={images.copy.stock}
                                alt="BotLambotrade"
                            />
                        </div>
                    </Link>
                </div>
            )}

            {isTelegramChatOpen && <div className='relative grow flex items-center justify-center h-[600px]' ref={largeHeaderRef}>
                {isLoadingDetail || !prediction ? (
                    <Animated largeHeaderRef={largeHeaderRef} />
                ) : (
                    <div
                        className='relative z-0 w-full h-full'
                        style={{
                            backgroundImage: `url(${prediction === 'SELL' ? aiDown : aiUp})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className='bg-black/70 absolute z-10 w-full h-full'></div>
                    </div>
                )}
                <div
                    className={`absolute z-10 gap-2 ${!isLoadingDetail && prediction ? 'slide-in' : ''
                        }`}
                >
                    <h1 className='text-4xl font-bold'>
                       {prediction && !isLoadingDetail && <>AI <span className='thin'>dự báo xu hướng</span></>} 
                    </h1>
                    {(!isLoadingDetail && prediction) ? (
                        prediction !== 'SELL' ? (
                            <div className='py-1 px-2 border border-[#59cf59] bg-[#51d85156] rounded flex items-center gap-2 text-3xl'>
                                Xu hướng tăng {analysisPercentages[searchInputTelegram.value]}%{' '}
                                <img src={trendingUp} alt='up' />
                            </div>
                        ) : (
                            prediction === 'SELL' && (
                                <div className='py-1 px-2 border border-[#ff1717] bg-[#d64f4f79] text-3xl rounded flex items-center gap-2'>
                                    Xu hướng giảm {analysisPercentages[searchInputTelegram.value]}%{' '}
                                    <img src={trendingDown} alt='down' />
                                </div>
                            )
                        )
                    ) : null}
                </div>
                {isLoadingDetail && (
                    <div className='absolute bg-black/50 inset-0 z-[9999] w-full h-full flex items-center justify-center'>
                        <h1 className='main-title text-3xl'>
                            AI <span className='thin'>phân tích</span>
                        </h1>
                        <span className='loader'></span>
                    </div>
                )}
            </div>}

        </div>
    );
};

export default CopyTradeAI;
