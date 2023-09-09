import HourTime from "../models/HourTime.ts";
import {DateTime} from 'luxon';

interface Props {
    currentTime: DateTime;
    hourTimes: HourTime[];
    firstHourIndex: number;
    lastHourIndex: number;
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
    if (hourIndex === null) {
        return (
            <>Vyučování skončilo.</>
        )
    }

    const hourTime = props.hourTimes[hourIndex];
    let awaitedTime: DateTime;
    if (props.currentTime < hourTime.start) {
        awaitedTime = hourTime.start;
    } else {
        awaitedTime = hourTime.end;
    }

    const timeRemaining = awaitedTime.diff(props.currentTime);

    return (
        <>
            {timeRemaining.toFormat("mm:ss")}
        </>
    );
}

export default TimeRemaining
