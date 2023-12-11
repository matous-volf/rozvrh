import {useEffect, useMemo, useState} from "react";
import {nanoid} from "nanoid";
import {useQuery} from "@tanstack/react-query";
import {FormSelect} from "react-bootstrap";
import School from "../models/School.ts";
import {getSchools} from "../api/schools.ts";

interface Props {
    selectedSchool: School | null;
    setSelectedSchoolCallback: (school: School | null) => void;
}

function ClassSettings(props: Props) {
    const [selectedSchool, setSelectedSchool] = useState<School | null>(props.selectedSchool);

    const setSelectedSchoolCallback = props.setSelectedSchoolCallback;
    useEffect(() => {
        setSelectedSchoolCallback(selectedSchool);
    }, [setSelectedSchoolCallback, selectedSchool]);

    const {data, isLoading} = useQuery({
        queryKey: ["schools"],
        queryFn: getSchools
    });

    const schools: School[] = useMemo(() => data === undefined ? [] : data, [data])

    useEffect(() => {
        if (!isLoading && schools.length < 1) {
            setSelectedSchool(null);
        }
    }, [schools, isLoading]);

    return (
        <>
            <h2>Škola</h2>
            <FormSelect onChange={(e) => setSelectedSchool(schools.find((school) => school.id === e.target.value)!)}
                        value={selectedSchool === null ? "" : selectedSchool.id} id="class-select" className="w-auto">
                {selectedSchool === null && <option></option>}
                {schools.map((school) => (
                    <option key={nanoid()} value={school.id}>{school.name}</option>
                ))}
            </FormSelect>
        </>
    );
}

export default ClassSettings
