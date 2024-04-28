import Timetable from "../models/Timetable.ts";
import deltaTimetableLogo from '../../public/assets/images/delta-timetable-logo.svg';
import School from "../models/School.ts";
import {Link} from "react-router-dom";

const deltaSchoolId = "SYDATAAEVA";

interface Props {
    timetable: Timetable;
    selectedSchool: School;
}

function WholeTimetableLink(props: Props) {
    return (
        <>
            <Link to={props.timetable.urlCurrent} className="btn btn-outline-primary" target="_blank">
                {props.selectedSchool.id === deltaSchoolId
                    ? <img src={deltaTimetableLogo} alt="logo Delta timetable" className="delta-timetable-logo"/>
                    : <><i className="bi bi-calendar-week-fill"></i> celý rozvrh</>}
            </Link>
        </>
    );
}

export default WholeTimetableLink;
