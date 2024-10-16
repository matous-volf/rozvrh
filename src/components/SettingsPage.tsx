import ClassSettings from "./ClassSettings.tsx";
import Timetable from "../models/Timetable.ts";
import GroupSettings from "./GroupSettings.tsx";
import {Button} from "react-bootstrap";
import {useState} from "react";
import {Link} from "react-router-dom";
import School from "../models/School.ts";
import SchoolSettings from "./SchoolSettings.tsx";
import TeacherModeSettings from "./TeacherModeSettings.tsx";
import TeacherSettings from "./TeacherSettings.tsx";
import TernaryDarkMode from "../models/TernaryDarkMode.ts";
import ColorSchemeSettings from "./ColorSchemeSettings.tsx";
import ProgressBarSettings from "./ProgressBarSettings.tsx";
import ShownHoursCountSettings from "./ShownHoursCountSettings.tsx";

interface Props {
    isTimetableQueryLoading: boolean;
    isTimetableQueryError: boolean;
    timetable: Timetable | null;
    ternaryDarkMode: TernaryDarkMode;
    selectedSchool: School | null;
    teacherModeEnabled: boolean;
    selectedClassId: string | null;
    selectedTeacherId: string | null;
    selectedGroupIds: string[];
    setTernaryDarkModeCallback: (ternaryDarkMode: TernaryDarkMode) => void;
    setSelectedSchoolCallback: (school: School | null) => void;
    setTeacherModeEnabledCallback: (teacherModeEnabled: boolean) => void;
    setSelectedClassIdCallback: (classId: string | null) => void;
    setSelectedTeacherIdCallback: (teacherId: string | null) => void;
    setSelectedGroupIdsCallback: (groupIds: string[]) => void;
}

export default function SettingsPage(props: Props) {
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(props.selectedGroupIds);

    const handleSave = () => {
        props.setSelectedGroupIdsCallback(selectedGroupIds);
    }

    document.title = "Nastavení";

    return <div className="container d-flex flex-column align-content-stretch gap-3 p-4" style={{maxWidth: "576px"}}>
        <h2>Nastavení</h2>
        <div>
            <ColorSchemeSettings {...props}/>
        </div>
        <div>
            <ProgressBarSettings/>
        </div>
        <div>
            <ShownHoursCountSettings timetable={props.timetable}/>
        </div>
        <div>
            <SchoolSettings {...props}/>
        </div>
        <div>
            {props.selectedSchool !== null &&
                <TeacherModeSettings {...props}/>}
        </div>
        <div>
            {props.selectedSchool !== null && (!props.teacherModeEnabled ?
                <ClassSettings {...props} selectedSchool={props.selectedSchool}/> :
                <TeacherSettings {...props} selectedSchool={props.selectedSchool}/>)}
        </div>
        <div>
            {!props.teacherModeEnabled && props.selectedClassId !== null &&
                <GroupSettings {...props} timetable={props.timetable}
                               setSelectedGroupIdsCallback={setSelectedGroupIds}/>}
        </div>
        <Link to="/">
            <Button onClick={handleSave} variant="primary">
                <i className="bi bi-check-lg"></i> uložit
            </Button>
        </Link>
    </div>
}
