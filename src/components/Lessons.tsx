import LessonInfo from "./LessonInfo.tsx";
import Lesson from "../models/Lesson.ts";
import {DateTime} from "luxon";
import HourTime from "../models/HourTime.ts";
import Hour from "../models/Hour.ts";

interface Props {
    teacherModeEnabled: boolean;
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
            if (i > props.firstHourIndex) {
                currentHourIndex = i - 1;
                isBreak = true;
            }
            nextHourIndex = i;
        } else {
            currentHourIndex = i;
            if (i < props.lastHourIndex) {
                nextHourIndex = i + 1;
            }
        }

        if (currentHourIndex !== null && !props.hours[currentHourIndex].isSelected) {
            currentHourIndex = null;
            isBreak = false;
        }

        if (nextHourIndex !== null && !props.hours[nextHourIndex].isSelected) {
            if (currentHourIndex === null || isBreak) {
                if (isBreak) {
                    currentHourIndex = null;
                }

                nextHourIndex = nextHourIndex + props.hours.slice(nextHourIndex).findIndex((hour) => hour.isSelected);
                isBreak = false;
            }
        }
        break;
    }

    let currentLesson: Lesson | null = null;
    if (currentHourIndex !== null) {
        currentLesson = props.hours[currentHourIndex].selectedLesson;
    }

    let nextLesson: Lesson | null = null;
    if (nextHourIndex !== null) {
        nextLesson = props.hours[nextHourIndex].selectedLesson;
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center"
             style={{fontSize: "calc(1rem + 2vw)"}}>
            <div>
                <LessonInfo teacherModeEnabled={props.teacherModeEnabled} isBreak={isBreak} lesson={currentLesson}/>
                <hr/>
                <LessonInfo teacherModeEnabled={props.teacherModeEnabled} isBreak={false} lesson={nextLesson}/>
            </div>
        </div>
    );
}

export default Lessons
