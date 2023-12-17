import {useEffect, useState} from "react";
import {DateTime} from "luxon";
import Timetable from "../models/Timetable.ts";
import TimeRemaining from "./TimeRemaining.tsx";
import Lessons from "./Lessons.tsx";

interface Props {
    timetable: Timetable;
}

function TimetableInfo(props: Props) {
    const [currentTime, setCurrentTime] = useState(DateTime.now());
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(DateTime.now());
        }, 100);

        return () => {
            clearInterval(intervalId);
        }
    }, []);

    const dayIndex: number = currentTime.weekday - 1;
    if (dayIndex > 4) {
        return (
            <>
                <p>Dnes není pracovní den.</p>
            </>
        )
    }

    const hours = props.timetable.days[dayIndex]?.hours;
    const firstHourIndex = hours?.findIndex((hour) => hour.isSelected);
    const lastHourIndex = hours?.findLastIndex((hour) => hour.isSelected);

    if (firstHourIndex === -1 || lastHourIndex === -1 || hours === undefined) {
        return (
            <>
                <p>Dnes není žádné vyučování.</p>
            </>
        )
    }

    return (
        <div className="d-flex flex-column gap-4">
            <p className="display-1 fw-bold">
                <TimeRemaining currentTime={currentTime} hourTimes={props.timetable.hourTimes} hours={hours}
                               firstHourIndex={firstHourIndex} lastHourIndex={lastHourIndex}/>
            </p>
            <Lessons currentTime={currentTime} hourTimes={props.timetable.hourTimes} hours={hours}
                     firstHourIndex={firstHourIndex} lastHourIndex={lastHourIndex}/>
        </div>
    );
}

export default TimetableInfo
