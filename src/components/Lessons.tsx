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
    selectedGroups: string[];
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

            if (!props.hours[nextHourIndex].isSelected) {
                currentHourIndex = null;
                nextHourIndex = i + props.hours.slice(i).findIndex((hour) => hour.isSelected);
                isBreak = false;
            }
        } else {
            currentHourIndex = i;

            if (i < props.lastHourIndex) {
                nextHourIndex = i + 1;
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
        <div className="d-flex flex-column justify-content-center align-items-center">
            <div>
                <p>
                    <LessonInfo isBreak={isBreak} lesson={currentLesson}/>
                </p>
                <hr/>
                <p>
                    <LessonInfo isBreak={false} lesson={nextLesson}/>
                </p>
            </div>
        </div>
    );
}

export default Lessons
