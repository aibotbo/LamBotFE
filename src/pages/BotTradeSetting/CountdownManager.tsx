import { useEffect, useState } from "react";
import Countdown from "./Countdown";

interface FollowBotSchedule {
    id: number;
    followbotschedule_name: string;
    followbotid: number[];
    status: string;
    hour_of_day: number;
    minute_of_day: number;
    created_at: string;
    updated_at: string;
}

interface CountdownManagerProps {
    schedules: FollowBotSchedule[];
    onCountdownEnd: (schedule: FollowBotSchedule) => void;
}

const CountdownManager: React.FC<CountdownManagerProps> = ({ schedules, onCountdownEnd }) => {
    const [sortedSchedules, setSortedSchedules] = useState<FollowBotSchedule[]>([]);
    const [currentSchedule, setCurrentSchedule] = useState<FollowBotSchedule | null>(null);

    useEffect(() => {
        const now = new Date();

        // Sắp xếp các đối tượng dựa trên thời gian hiện tại
        const sorted = schedules.sort((a, b) => {
            const timeA = new Date();
            timeA.setHours(a.hour_of_day, a.minute_of_day, 0, 0);
            if (timeA <= now) {
                timeA.setDate(timeA.getDate() + 1);
            }

            const timeB = new Date();
            timeB.setHours(b.hour_of_day, b.minute_of_day, 0, 0);
            if (timeB <= now) {
                timeB.setDate(timeB.getDate() + 1);
            }

            return timeA.getTime() - timeB.getTime();
        });

        setSortedSchedules(sorted);
        setCurrentSchedule(sorted.length > 0 ? sorted[0] : null);
    }, [schedules]);

    const handleCountdownEnd = (schedule: FollowBotSchedule) => {
        if (sortedSchedules.length > 0) {
            onCountdownEnd(schedule);
            // Lấy đối tượng tiếp theo từ danh sách sortedSchedules
            const nextIndex = sortedSchedules.findIndex(s => s.id === schedule.id) + 1;
            if (nextIndex < sortedSchedules.length) {
                setCurrentSchedule(sortedSchedules[nextIndex]);
            } else {
                setCurrentSchedule(null); // Không có đối tượng tiếp theo
            }
        }
    };

    return (
        <div>
            {currentSchedule && (
                <div
                    style={{
                        width: '70px',
                        overflow: 'hidden'
                    }}
                    className={`flex justify-center px-2 rounded-[0.375rem] text-xs text-ink-100 leading-5 ${currentSchedule.status === 'start' ? 'bg-green-100' : 'bg-red-100'}`}
                >
                    <Countdown
                        foundObject={currentSchedule}
                        onCountdownEnd={() => handleCountdownEnd(currentSchedule)}
                    />
                </div>
            )}
        </div>
    );
};

export default CountdownManager;
