import { useEffect, useState } from 'react';

const CountdownTimer = ({ targetDate, isPpt }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                mins: Math.floor((difference / 1000 / 60) % 60),
                secs: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [hasPassed, setHasPassed] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const left = calculateTimeLeft();
            setTimeLeft(left);
            if (Object.keys(left).length === 0) {
                setHasPassed(true);
            } else {
                setHasPassed(false);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (hasPassed) {
        return <span className="text-red-500 font-bold text-xs">Deadline Passed</span>;
    }

    return (
        <div className={`mt-1 text-xs font-medium flex space-x-1 ${isPpt ? 'text-indigo-600' : 'text-emerald-600'}`}>
            <span>{timeLeft.days}d</span>
            <span>{timeLeft.hours}h</span>
            <span>{timeLeft.mins}m</span>
            <span>{timeLeft.secs}s</span>
        </div>
    );
};

export default CountdownTimer;
