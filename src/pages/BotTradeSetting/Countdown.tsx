import React, { useEffect, useState } from "react";

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

interface CountdownProps {
    foundObject: FollowBotSchedule;
    onCountdownEnd: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ foundObject, onCountdownEnd }) => {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!foundObject) return;

        const calculateTimeLeft = () => {
            const now = new Date();
            const targetTime = new Date();
            targetTime.setHours(foundObject.hour_of_day, foundObject.minute_of_day, 0, 0);
            if (targetTime <= now) {
                targetTime.setDate(targetTime.getDate() + 1);
            }
            return targetTime.getTime() - now.getTime();
        };

        const updateCountdown = () => {
            const initialTimeLeft = calculateTimeLeft();
            setTimeLeft(initialTimeLeft);
        };

        const intervalId = setInterval(() => {
            setTimeLeft(prevTimeLeft => {
                if (prevTimeLeft && prevTimeLeft <= 0) {
                    clearInterval(intervalId);
                    onCountdownEnd();
                    return null;
                }
                return prevTimeLeft && prevTimeLeft - 1000;
            });
        }, 1000);

        updateCountdown();

        return () => clearInterval(intervalId);
    }, [foundObject, onCountdownEnd]);

    if (timeLeft === null || timeLeft <= 0) {
        return null;
    }

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <div>{`${hours}:${minutes}:${seconds}`}</div>
    );
};

export default Countdown;
