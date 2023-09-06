import HourTime from "../models/HourTime.ts";
import {useEffect, useState} from "react";
import {DateTime} from 'luxon';

interface Props {
    hourTime: HourTime;
}

function TimeRemaining(props: Props) {
    const [currentTime, setCurrentTime] = useState(DateTime.now());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(DateTime.now());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        }
    }, []);

    let awaitedTime: DateTime;

    if (currentTime < props.hourTime.start) {
        awaitedTime = props.hourTime.start;
    } else {
        awaitedTime = props.hourTime.end;
    }

    const timeRemaining = awaitedTime.diff(currentTime);

    return (
        <>
            {timeRemaining.toFormat("mm:ss")}
        </>
    );
}

export default TimeRemaining
