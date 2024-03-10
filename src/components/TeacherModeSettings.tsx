import {ChangeEvent} from "react";
import {FormCheck} from "react-bootstrap";

interface Props {
    teacherModeEnabled: boolean;
    setTeacherModeEnabledCallback: (teacherModeEnabled: boolean) => void;
}

function TeacherModeSettings(props: Props) {
    return (
        <>
            <FormCheck type="switch" id="input-teacher-mode" label="učitelský režim" checked={props.teacherModeEnabled}
                       onChange={(event: ChangeEvent<HTMLInputElement>) =>
                           props.setTeacherModeEnabledCallback(event.target.checked)}/>
        </>
    );
}

export default TeacherModeSettings
