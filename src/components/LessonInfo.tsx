import Lesson from "../models/Lesson.ts";

interface Props {
    lesson: Lesson | null;
    isBreak: boolean;
}

function LessonInfo(props: Props) {
    if (props.lesson === null) {
        return (
            <>
                volno
            </>
        );
    }

    if (props.isBreak) {
        return (
            <>
                přestávka
            </>
        );
    }

    return (
        <>
            {props.lesson.subject} {props.lesson.room}
        </>
    );
}

export default LessonInfo
