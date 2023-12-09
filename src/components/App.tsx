import {useCallback, useMemo} from "react";
import {useCookies} from "react-cookie";
import MainPage from "./MainPage.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import SettingsPage from "./SettingsPage.tsx";
import {useQuery} from "@tanstack/react-query";
import {getTimetable} from "../api/timetable.ts";
import {getSchools} from "../api/schoolList.ts";

function App() {
    const [cookies, setCookies] = useCookies(["selectedClassId", "selectedGroupIds"]);
    const selectedGroupIds: string[] = cookies.selectedGroupIds;
    if (selectedGroupIds === undefined) {
        setCookies("selectedGroupIds", []);
    }
    const selectedClassId: string = cookies.selectedClassId;
    if (selectedClassId === undefined) {
        setCookies("selectedClassId", null);
    }

    const handleSelectedClassIdChange = useCallback((classId: string | null) => {
            setCookies("selectedClassId", classId);
        }, [setCookies]
    );

    const handleSelectedGroupIdsChange = useCallback((groupIds: string[]) => {
            setCookies("selectedGroupIds", groupIds);
        }, [setCookies]
    );

    const timetableQuery = useQuery({
        queryKey: ["timetable", selectedClassId, selectedGroupIds],
        queryFn: () => {
            if (selectedClassId === null) {
                return null;
            }

            return getTimetable(selectedClassId, selectedGroupIds)
        }
    });

    const timetable = timetableQuery.data === undefined ? null : timetableQuery.data;

    const childrenProps = useMemo(() => {
        return {
            isQueryLoading: timetableQuery.isLoading,
            isQueryError: timetableQuery.isError,
            timetable: timetable,
            selectedClassId: selectedClassId,
            selectedGroupIds: selectedGroupIds,
            setSelectedClassIdCallback: handleSelectedClassIdChange,
            setSelectedGroupIdsCallback: handleSelectedGroupIdsChange
        };
    }, [timetableQuery.isLoading, timetableQuery.isError, timetable, selectedClassId, selectedGroupIds,
        handleSelectedClassIdChange, handleSelectedGroupIdsChange]);

    const router = useMemo(() => createBrowserRouter([
        {
            path: "/",
            element: <MainPage {...childrenProps}/>,
        },
        {
            path: "/nastaveni",
            element: <SettingsPage {...childrenProps}/>,
        },
    ]), [childrenProps]);

    return (
        <div className="h-100">
            <RouterProvider router={router}/>
        </div>
    );
}

export default App
