import LessonInfo from "./LessonInfo.tsx";
import Lesson from "../models/Lesson.ts";
import {DateTime} from "luxon";
import HourTime from "../models/HourTime.ts";
import Hour from "../models/Hour.ts";
import {ReactElement} from "react";
import { useLocalStorage } from "usehooks-ts";

interface Props {
    teacherModeEnabled: boolean;
    currentTime: DateTime;
    hourTimes: HourTime[];
    hours: Hour[];
    firstHourIndex: number;
    lastHourIndex: number;
}

interface LessonInfoProps {
    lesson: Lesson | null;
    isBreak: boolean;
}

function generateFilteredLessonInfos(
    lessonInfoProps: LessonInfoProps[],
    isFirstSelectedLesson: boolean,
    lastSelectedLessonIndex: number,
    teacherModeEnabled: boolean,
    shownHoursCount: number
) {
    for (let index = lessonInfoProps.length - 1; index > 0; index--) {
        if (lessonInfoProps[index].lesson === null) {
            if (lessonInfoProps[index - 1].lesson === null) {
                lessonInfoProps.splice(index, 1);
            } else if (lessonInfoProps[index - 1].isBreak) {
                lessonInfoProps.splice(index - 1, 1);
            }
        }
    }
    let lessonInfos: ReactElement[] = [];
    for (let index = 0; index < Math.min(lessonInfoProps.length, shownHoursCount); index++) {
        lessonInfos.push(
            <LessonInfo
                teacherModeEnabled={teacherModeEnabled}
                lesson={lessonInfoProps[index].lesson}
                isBreak={lessonInfoProps[index].isBreak}
                isLongBreak={
                    lessonInfoProps[index].lesson === null &&
                    (index !== lessonInfoProps.length - 1 || index < lastSelectedLessonIndex) &&
                    (index !== 0 || !isFirstSelectedLesson)
                }
                key={index * 2}
            />
        );
        lessonInfos.push(<hr key={index * 2 + 1}/>);
    }
    lessonInfos.pop();
    return lessonInfos;
}

function Lessons(props: Props) {
    let currentHourIndex = -1;
    let isBreak = false;

    const [shownHoursCount] = useLocalStorage<number>("shownHoursCount", 2);

    for (let i = props.firstHourIndex; i <= props.lastHourIndex; i++) {
        if (props.currentTime > props.hourTimes[i].end) {
            continue;
        }

        currentHourIndex = i;
        if (props.currentTime < props.hourTimes[i].start) {
            if (i > props.firstHourIndex) {
                isBreak = true;
            }
            currentHourIndex--;
        }

        break;
    }

    let lessonInfoProps: LessonInfoProps[] = [];
    for (let index = currentHourIndex; index < props.hours.length; index++) {
        let lesson: Lesson | null = null;

        if (index !== -1) {
            lesson = props.hours[index].selectedLesson;
        }

        lessonInfoProps.push({lesson, isBreak});

        if (index === -1) {
            break;
        }

        isBreak = false;
    }

    return <div className="d-flex flex-column justify-content-center align-items-center"
                style={{fontSize: "calc(1rem + 2vw)"}}>
        <div>
            {generateFilteredLessonInfos(
                lessonInfoProps,
                currentHourIndex < props.firstHourIndex,
                props.lastHourIndex - currentHourIndex,
                props.teacherModeEnabled,
                shownHoursCount
            )}
        </div>
    </div>
}

export default Lessons
