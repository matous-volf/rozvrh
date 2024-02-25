import Lesson from "../models/Lesson.ts";

interface Props {
    teacherModeEnabled: boolean;
    lesson: Lesson | null;
    isBreak: boolean;
}

function LessonInfo(props: Props) {
    let content;

    if (props.isBreak) {
        content = <span className="fw-bold">přestávka</span>;
    } else if (props.lesson === null) {
        content = <span className="fw-bold">volno</span>;
    } else {
        content = <>
            <span className="fw-bold">{props.lesson.subject}</span>
            {props.teacherModeEnabled && props.lesson.group !== null && <span>{props.lesson.group.name}</span>}
            <span>{props.lesson.room}</span>
        </>
    }

    return (
        <div className="d-flex flex-row justify-content-center gap-3">
            {content}
        </div>
    );
}

export default LessonInfo
