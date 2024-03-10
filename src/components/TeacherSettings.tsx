import {useEffect, useMemo, useState} from "react";
import {nanoid} from "nanoid";
import {useQuery} from "@tanstack/react-query";
import {getTeachers} from "../api/timetable.ts";
import {FormSelect} from "react-bootstrap";
import School from "../models/School.ts";
import Teacher from "../models/Teacher.ts";

interface Props {
    selectedSchool: School;
    selectedTeacherId: string | null;
    setSelectedTeacherIdCallback: (teacherId: string | null) => void;
}

function TeacherSettings(props: Props) {
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(props.selectedTeacherId);

    const setSelectedTeacherIdCallback = props.setSelectedTeacherIdCallback;
    useEffect(() => {
        setSelectedTeacherIdCallback(selectedTeacherId);
    }, [setSelectedTeacherIdCallback, selectedTeacherId]);

    const {data, isLoading, isError} = useQuery({
        queryKey: ["teachers", props.selectedSchool],
        queryFn: () => getTeachers(props.selectedSchool),
    });

    const teachers: Teacher[] = useMemo(() => data === undefined ? [] : data, [data])

    useEffect(() => {
        if (!isLoading && (teachers === null || teachers.length < 1)) {
            setSelectedTeacherId(null);
        }
    }, [teachers, isLoading]);

    return (
        <>
            <h3>Učitel</h3>
            {(isLoading ? (<p>Načítání...</p>
            ) : isError ? (<p>Učitele se nepodařilo načíst. Škola pravděpodobně nepovolila veřejný rozvrh.</p>
            ) : <FormSelect onChange={(e) => setSelectedTeacherId(e.target.value)} value={selectedTeacherId ?? ""}
                            id="input-teacher" className="w-auto">
                {selectedTeacherId === null && <option></option>}
                {teachers.map((teacher) => (
                    <option key={nanoid()} value={teacher.id}>{teacher.name}</option>
                ))}
            </FormSelect>)
            }
        </>
    );
}

export default TeacherSettings;
