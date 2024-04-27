import {useCallback, useMemo} from "react";
import MainPage from "./MainPage.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import SettingsPage from "./SettingsPage.tsx";
import {useQuery} from "@tanstack/react-query";
import {getTimetableClass, getTimetableTeacher} from "../api/timetable.ts";
import School from "../models/School.ts";
import {useLocalStorage, useTernaryDarkMode} from "usehooks-ts";
import TernaryDarkMode from "../models/TernaryDarkMode.ts";

function App() {
    const {isDarkMode, ternaryDarkMode, setTernaryDarkMode} = useTernaryDarkMode({defaultValue: "system"});
    const [selectedSchool, setSelectedSchool] = useLocalStorage<School | null>("selectedSchool", null);
    const [teacherModeEnabled, setTeacherModeEnabled] = useLocalStorage<boolean>("teacherModeEnabled", false);
    const [selectedClassId, setSelectedClassId] = useLocalStorage<string | null>("selectedClassId", null);
    const [selectedTeacherId, setSelectedTeacherId] = useLocalStorage<string | null>("selectedTeacherId", null);
    const [selectedGroupIds, setSelectedGroupIds] = useLocalStorage<string[]>("selectedGroupIds", []);

    const handleDarkModeChange = useCallback((ternaryDarkMode: TernaryDarkMode) => {
        setTernaryDarkMode(ternaryDarkMode);
    }, [setTernaryDarkMode]);

    const handleSelectedSchoolChange = useCallback((school: School | null) => {
        if (school?.id !== selectedSchool?.id) {
            setSelectedClassId(null);
            setSelectedGroupIds([]);
            setSelectedSchool(school);
        }
    }, [selectedSchool?.id, setSelectedClassId, setSelectedGroupIds, setSelectedSchool]);

    const handleTeacherModeEnabledChange = useCallback(setTeacherModeEnabled, [setTeacherModeEnabled]);

    const handleSelectedClassIdChange = useCallback((classId: string | null) => {
        if (classId !== selectedClassId) {
            setSelectedGroupIds([]);
            setSelectedClassId(classId);
        }
    }, [selectedClassId, setSelectedClassId, setSelectedGroupIds]);

    const handleSelectedTeacherIdChange = useCallback((teacherId: string | null) => {
        if (teacherId !== selectedTeacherId) {
            setSelectedTeacherId(teacherId);
        }
    }, [selectedTeacherId, setSelectedTeacherId]);

    const handleSelectedGroupIdsChange = useCallback((groupIds: string[]) => {
        setSelectedGroupIds(groupIds);
    }, [setSelectedGroupIds]);

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
                getTimetableTeacher(selectedSchool, selectedTeacherId!) :
                getTimetableClass(selectedSchool, selectedClassId!, selectedGroupIds);
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
                                   ternaryDarkMode={ternaryDarkMode}
                                   selectedSchool={selectedSchool}
                                   teacherModeEnabled={teacherModeEnabled}
                                   selectedClassId={selectedClassId}
                                   selectedTeacherId={selectedTeacherId}
                                   selectedGroupIds={selectedGroupIds}
                                   setTernaryDarkModeCallback={handleDarkModeChange}
                                   setSelectedSchoolCallback={handleSelectedSchoolChange}
                                   setTeacherModeEnabledCallback={handleTeacherModeEnabledChange}
                                   setSelectedClassIdCallback={handleSelectedClassIdChange}
                                   setSelectedTeacherIdCallback={handleSelectedTeacherIdChange}
                                   setSelectedGroupIdsCallback={handleSelectedGroupIdsChange}/>,
        },
    ]), [timetable, timetableQuery.isLoading, timetableQuery.isError, ternaryDarkMode, teacherModeEnabled,
        selectedSchool, selectedClassId, selectedTeacherId, selectedGroupIds, handleDarkModeChange,
        handleSelectedSchoolChange, handleTeacherModeEnabledChange, handleSelectedClassIdChange,
        handleSelectedTeacherIdChange, handleSelectedGroupIdsChange]);

    return <div className="min-vh-100 text-body bg-body" data-bs-theme={isDarkMode ? "dark" : "light"}>
        <RouterProvider router={router}/>
    </div>
}

export default App
