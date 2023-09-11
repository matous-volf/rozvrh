import ClassIdSettings from "./ClassIdSettings.tsx";
import Timetable from "../models/Timetable.ts";
import GroupSettings from "./GroupSettings.tsx";
import {Button} from "react-bootstrap";
import {useState} from "react";

interface Props {
    timetable: Timetable | null;
    selectedClassId: string | null;
    selectedGroups: string[];
    setSelectedClassIdCallback: (classId: string | null) => void;
    setSelectedGroupsCallback: (groups: string[]) => void;
}

function SettingsPage(props: Props) {
    const [selectedGroups, setSelectedGroups] = useState<string[]>(props.selectedGroups);

    const handleSelectedGroupsChange = (groups: string[]) => {
        setSelectedGroups(groups);
    }

    const handleBack = () => {
        props.setSelectedGroupsCallback(selectedGroups);
    }

    let groupsContent = null;
    if (props.timetable !== null) {
        groupsContent = <GroupSettings {...props} timetable={props.timetable}
                                       setSelectedGroupsCallback={handleSelectedGroupsChange}/>;
    }

    return (
        <div className="container d-flex flex-column align-items-start gap-3 p-4" style={{maxWidth: "576px"}}>
            <h1>Nastavení</h1>
            <div>
                <ClassIdSettings {...props}/>
            </div>
            <div>
                {groupsContent}
            </div>
            <Button href="/" onClick={handleBack} variant="outline-secondary">
                <i className="bi bi-arrow-left"></i> zpět
            </Button>
        </div>
    );
}

export default SettingsPage
