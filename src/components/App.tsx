import {useCallback, useMemo} from "react";
import {useCookies} from "react-cookie";
import MainPage from "./MainPage.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import SettingsPage from "./SettingsPage.tsx";
import {useQuery} from "@tanstack/react-query";
import {getTimetableClass, getTimetableTeacher} from "../api/timetable.ts";
import School from "../models/School.ts";

function App() {
    const [cookies, setCookies] = useCookies([
        "selectedSchool", "teacherModeEnabled", "selectedClassId", "selectedTeacherId", "selectedGroupIds",
    ]);
    const teacherModeEnabled: boolean = cookies.teacherModeEnabled;
    if (teacherModeEnabled === undefined) {
        setCookies("teacherModeEnabled", false);
    }
    const selectedSchool: School | null = cookies.selectedSchool;
    if (selectedSchool === undefined) {
        setCookies("selectedSchool", null);
    }
    const selectedClassId: string = cookies.selectedClassId;
    if (selectedClassId === undefined) {
        setCookies("selectedClassId", null);
    }
    const selectedTeacherId: string = cookies.selectedTeacherId;
    if (selectedTeacherId === undefined) {
        setCookies("selectedTeacherId", null);
    }
    const selectedGroupIds: string[] = cookies.selectedGroupIds;
    if (selectedGroupIds === undefined) {
        setCookies("selectedGroupIds", []);
    }

    const handleSelectedSchoolChange = useCallback((school: School | null) => {
            if (school?.id !== selectedSchool?.id) {
                setCookies("selectedClassId", null);
                setCookies("selectedGroupIds", []);
                setCookies("selectedSchool", school);
            }
        }, [selectedSchool, setCookies]
    );

    const handleTeacherModeEnabledChange = useCallback((teacherModeEnabled: boolean) => {
        setCookies("teacherModeEnabled", teacherModeEnabled);
    }, [setCookies]);

    const handleSelectedClassIdChange = useCallback((classId: string | null) => {
            if (classId !== selectedClassId) {
                setCookies("selectedGroupIds", []);
                setCookies("selectedClassId", classId);
            }
        }, [selectedClassId, setCookies]
    );

    const handleSelectedTeacherIdChange = useCallback((teacherId: string | null) => {
            if (teacherId !== selectedTeacherId) {
                setCookies("selectedTeacherId", teacherId);
            }
        }, [selectedTeacherId, setCookies]
    );

    const handleSelectedGroupIdsChange = useCallback((groupIds: string[]) => {
            setCookies("selectedGroupIds", groupIds);
        }, [setCookies]
    );

    const timetableQuery = useQuery({
        queryKey: ["timetable",
            selectedSchool?.id,
            teacherModeEnabled,
            selectedClassId,
            selectedTeacherId,
            selectedGroupIds],
        queryFn: () => {
            if (selectedSchool === null ||
                (teacherModeEnabled ? selectedTeacherId === null : selectedClassId === null)) {
                return null;
            }

            return teacherModeEnabled ?
                getTimetableTeacher(selectedSchool, selectedTeacherId) :
                getTimetableClass(selectedSchool, selectedClassId, selectedGroupIds);
        }
    });
    const timetable = timetableQuery.data === undefined ? null : timetableQuery.data;

    const router = useMemo(() => createBrowserRouter([
        {
            path: "/",
            element: <MainPage teacherModeEnabled={teacherModeEnabled}
                               timetable={timetable}
                               isQueryLoading={timetableQuery.isLoading}
                               isQueryError={timetableQuery.isError}/>,
        },
        {
            path: "/nastaveni",
            element: <SettingsPage isTimetableQueryLoading={timetableQuery.isLoading}
                                   isTimetableQueryError={timetableQuery.isError}
                                   timetable={timetable}
                                   selectedSchool={selectedSchool}
                                   teacherModeEnabled={teacherModeEnabled}
                                   setSelectedSchoolCallback={handleSelectedSchoolChange}
                                   setTeacherModeEnabledCallback={handleTeacherModeEnabledChange}
                                   selectedClassId={selectedClassId}
                                   selectedTeacherId={selectedTeacherId}
                                   selectedGroupIds={selectedGroupIds}
                                   setSelectedClassIdCallback={handleSelectedClassIdChange}
                                   setSelectedTeacherIdCallback={handleSelectedTeacherIdChange}
                                   setSelectedGroupIdsCallback={handleSelectedGroupIdsChange}/>,
        },
    ]), [timetable, timetableQuery, teacherModeEnabled, selectedSchool, handleSelectedSchoolChange,
        handleTeacherModeEnabledChange, selectedClassId, selectedTeacherId, selectedGroupIds,
        handleSelectedClassIdChange, handleSelectedTeacherIdChange, handleSelectedGroupIdsChange]);

    return (
        <div className="h-100">
            <RouterProvider router={router}/>
        </div>
    );
}

export default App
