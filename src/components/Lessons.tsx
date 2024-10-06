import LessonInfo from "./LessonInfo.tsx";
import Lesson from "../models/Lesson.ts";
import {DateTime} from "luxon";
import HourTime from "../models/HourTime.ts";
import Hour from "../models/Hour.ts";
import { ReactElement } from "react";

interface Props {
    teacherModeEnabled: boolean;
    currentTime: DateTime;
    hourTimes: HourTime[];
    hours: Hour[];
    firstHourIndex: number;
    lastHourIndex: number;
}
interface PropsLessonInfo {
    lesson: Lesson | null;
    isBreak: boolean;
}

function generateFilteredLessonInfos(
    arr: PropsLessonInfo[],
    isFirstSelectedLesson: boolean,
    isLastSelectedLesson: boolean,
    teacherModeEnabled: boolean,
    numberOfShownHours: number
) {
    for (let index = arr.length - 1; index > 0; index--) {
        if (arr[index].lesson === null) {
            if (arr[index - 1].lesson === null) {
                arr.splice(index, 1);
            } else if (arr[index - 1].isBreak) {
                arr.splice(index - 1, 1);
            }
        }
    }
    let lessonInfos: ReactElement[] = [];
    for (let index = 0; index < Math.min(arr.length, numberOfShownHours); index++) {
        lessonInfos.push(
            <LessonInfo
                teacherModeEnabled={teacherModeEnabled}
                lesson={arr[index].lesson}
                isBreak={arr[index].isBreak}
                isLongerBreak={
                    arr[index].lesson === null &&
                    (index !== arr.length - 1 || !isLastSelectedLesson) &&
                    (index !== 0 || !isFirstSelectedLesson)
                }
                key={index * 2}
            />
        );
        lessonInfos.push(<hr key={index * 2 + 1} />);
    }
    lessonInfos.pop();
    return lessonInfos;
}

function Lessons(props: Props) {
    let currentHourIndex: number = -1;
    let currentHourIsNull = false;
    let isBreak = false;

    const numberOfShownHours = 2;

    for (let i = props.firstHourIndex; i <= props.lastHourIndex; i++) {
        if (props.currentTime > props.hourTimes[i].end) {
            continue;
        }

        currentHourIndex = i;
        if (props.currentTime < props.hourTimes[i].start) {
            if (i > props.firstHourIndex) {
                isBreak = true;
            } else {
                currentHourIsNull = true;
            }
            currentHourIndex--;
        }

        break;
    }
    let LessonInfos: PropsLessonInfo[] = [];
    for (let index = currentHourIndex; index < props.hours.length; index++) {
        let lesson: Lesson | null = null;

        if (
            index !== currentHourIndex ||
            (!currentHourIsNull && index !== -1)
        ) {
            lesson = props.hours[index].selectedLesson;
        }

        LessonInfos.push({ lesson: lesson, isBreak: isBreak });
        if (index === -1) {
            break;
        }
        isBreak = false;
    }
    let LessonInfosElements = generateFilteredLessonInfos(
        LessonInfos,
        currentHourIndex < props.firstHourIndex,
        currentHourIndex >= props.lastHourIndex,
        props.teacherModeEnabled,
        numberOfShownHours
    );
    return (
        <div className="d-flex flex-column justify-content-center align-items-center"
             style={{fontSize: "calc(1rem + 2vw)"}}>
            <div>{LessonInfosElements}</div>
        </div>
    );
}

export default Lessons
