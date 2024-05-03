import HourTime from "../models/HourTime.ts";
import {DateTime, Duration} from "luxon";
import Hour from "../models/Hour.ts";
import {useEffect} from "react";
import {useLocalStorage} from "usehooks-ts";
import LessonProgressBar from "./LessonProgressBar.tsx";

interface Props {
    currentTime: DateTime;
    hourTimes: HourTime[];
    hours: Hour[];
    firstHourIndex: number;
    lastHourIndex: number;
}

function TimeRemaining(props: Props) {
    const [progressBarEnabled] = useLocalStorage<boolean>("progressBarEnabled", true);

    let hourIndex: number | null = null;
    let previousAwaitedTime = DateTime.now().startOf("day");
    for (let i = props.firstHourIndex; i <= props.lastHourIndex; i++) {
        if (props.currentTime > props.hourTimes[i].end) {
            if (props.hours[i].isSelected) {
                previousAwaitedTime = props.hourTimes[i].end;
            }
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
            previousAwaitedTime = hourTime.start;
            awaitedTime = hourTime.end;
        }

        timeRemaining = awaitedTime.diff(props.currentTime);
    }

    useEffect(() => {
        document.title = timeRemaining === null ? "Rozvrh" : timeRemaining.toFormat("mm:ss");
    }, [timeRemaining]);

    return <>
        <p className="fw-bold"
           style={{
               fontFamily: "Familjen Grotesk, sans-serif",
               fontWeight: 700,
               fontSize: "calc(1rem + 12vw)",
               marginBottom: "-0.3em"
           }}>
            {timeRemaining === null ? "00:00" : <>{timeRemaining.toFormat("mm:ss")}</>}
        </p>

        {progressBarEnabled && <LessonProgressBar currentTime={props.currentTime}
                                                  previousAwaitedTime={previousAwaitedTime}
                                                  timeRemaining={timeRemaining}/>}
    </>
}

export default TimeRemaining
