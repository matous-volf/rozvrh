import ClassSettings from "./ClassSettings.tsx";
import Timetable from "../models/Timetable.ts";
import GroupSettings from "./GroupSettings.tsx";
import {Button} from "react-bootstrap";
import {useState} from "react";
import {Link} from "react-router-dom";
import School from "../models/School.ts";
import SchoolSettings from "./SchoolSettings.tsx";

interface Props {
    isTimetableQueryLoading: boolean;
    isTimetableQueryError: boolean;
    timetable: Timetable | null;
    selectedSchool: School | null;
    setSelectedSchoolCallback: (school: School | null) => void;
    selectedClassId: string | null;
    selectedGroupIds: string[];
    setSelectedClassIdCallback: (classId: string | null) => void;
    setSelectedGroupIdsCallback: (groupIds: string[]) => void;
}

function SettingsPage(props: Props) {
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(props.selectedGroupIds);

    const handleSave = () => {
        props.setSelectedGroupIdsCallback(selectedGroupIds);
    }

    document.title = "Nastavení";

    return (
        <div className="container d-flex flex-column align-items-start gap-3 p-4" style={{maxWidth: "576px"}}>
            <h1>Nastavení</h1>
            <div className="w-100">
                <SchoolSettings {...props}/>
            </div>
            <div className="w-100">
                {props.selectedSchool !== null &&
                    <ClassSettings {...props} selectedSchool={props.selectedSchool}/>}
            </div>
            <div>
                {props.selectedClassId !== null &&
                    <GroupSettings {...props} timetable={props.timetable}
                                   setSelectedGroupIdsCallback={setSelectedGroupIds}/>}
            </div>
            <Link to="/">
                <Button onClick={handleSave} variant="outline-secondary">
                    <i className="bi bi-check-lg"></i> uložit
                </Button>
            </Link>
        </div>
    );
}

export default SettingsPage
