import LessonInfo from "./LessonInfo.tsx";
import Lesson from "../models/Lesson.ts";
import {DateTime} from "luxon";
import HourTime from "../models/HourTime.ts";
import Hour from "../models/Hour.ts";

interface Props {
    currentTime: DateTime;
    hourTimes: HourTime[];
    hours: Hour[];
    firstHourIndex: number;
    lastHourIndex: number;
}

function Lessons(props: Props) {
    let currentHourIndex: number | null = null;
    let nextHourIndex: number | null = null;
    let isBreak = false;

    for (let i = props.firstHourIndex; i <= props.lastHourIndex; i++) {
        if (props.currentTime > props.hourTimes[i].end) {
            continue;
        }

        if (props.currentTime < props.hourTimes[i].start) {
            if (i > 0) {
                currentHourIndex = i - 1;
            }
            nextHourIndex = i;
            isBreak = true;
        } else {
            currentHourIndex = i;
            if (i < props.hourTimes.length - 1) {
                nextHourIndex = i + 1;
            }
        }
        break;
    }

    let currentLesson: Lesson | null = null;
    if (currentHourIndex !== null) {
        // group
        if (props.hours[currentHourIndex].lessons.length > 0) {
            currentLesson = props.hours[currentHourIndex].lessons[0];
        }
    }

    let nextLesson: Lesson | null = null;
    if (nextHourIndex !== null) {
        // group
        if (props.hours[nextHourIndex].lessons.length > 0) {
            nextLesson = props.hours[nextHourIndex].lessons[0];
        }
    }

    return (
        <>
            <p>
                <LessonInfo isBreak={isBreak} lesson={currentLesson}/>
            </p>
            <p>
                <LessonInfo isBreak={false} lesson={nextLesson}/>
            </p>
        </>
    );
}

export default Lessons
