import {useEffect, useState} from "react";
import {DateTime} from "luxon";
import Timetable from "../models/Timetable.ts";
import TimeRemaining from "./TimeRemaining.tsx";
import Lessons from "./Lessons.tsx";

interface Props {
    teacherModeEnabled: boolean;
    timetable: Timetable;
}

export default function TimetableInfo(props: Props) {
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

    const hours = props.timetable.days[dayIndex]?.hours;
    const firstHourIndex = hours?.findIndex((hour) => hour.isSelected);
    const lastHourIndex = hours === undefined ? -1 :
        hours.length - [...hours].reverse().findIndex((hour) => hour.isSelected) - 1; // the last selected index

    if (firstHourIndex === -1 || lastHourIndex === -1 || hours === undefined) {
        return <p>Dnes není žádné vyučování.</p>
    }

    return <div className="d-flex flex-column gap-5">
        <TimeRemaining currentTime={currentTime} hourTimes={props.timetable.hourTimes} hours={hours}
                       firstHourIndex={firstHourIndex} lastHourIndex={lastHourIndex}/>
        <Lessons teacherModeEnabled={props.teacherModeEnabled} currentTime={currentTime}
                 hourTimes={props.timetable.hourTimes}
                 hours={hours} firstHourIndex={firstHourIndex} lastHourIndex={lastHourIndex}/>
    </div>
}
