import HourTime from "../models/HourTime.ts";
import {DateTime, Duration} from "luxon";
import Hour from "../models/Hour.ts";
import {useEffect} from "react";

interface Props {
    currentTime: DateTime;
    hourTimes: HourTime[];
    hours: Hour[];
    firstHourIndex: number;
    lastHourIndex: number;
    selectedGroups: string[];
}

function TimeRemaining(props: Props) {
     let hourIndex: number | null = null;
    for (let i = props.firstHourIndex; i <= props.lastHourIndex; i++) {
        if (props.currentTime > props.hourTimes[i].end) {
            continue;
        }

        hourIndex = i;
        break;
    }

    let timeRemaining: Duration | null = null;

    if (hourIndex !== null) {
        if (!props.hours[hourIndex].isSelected) {
            hourIndex = hourIndex + props.hours.slice(hourIndex).findIndex((hour) => hour.isSelected);
        }

        const hourTime = props.hourTimes[hourIndex];
        let awaitedTime: DateTime;
        if (props.currentTime < hourTime.start) {
            awaitedTime = hourTime.start;
        } else {
            awaitedTime = hourTime.end;
        }

        timeRemaining = awaitedTime.diff(props.currentTime);
    }

    useEffect(() => {
        document.title = timeRemaining === null ? "Rozvrh" : timeRemaining.toFormat("mm:ss");
    }, [timeRemaining]);

    return (
        <>
            {timeRemaining === null ? "Vyučování skončilo." : timeRemaining.toFormat("mm:ss")}
        </>
    );
}

export default TimeRemaining
