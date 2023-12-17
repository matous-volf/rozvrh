import School from "../models/School.ts";

const schoolsUrl = "https://vitskalicky.gitlab.io/bakalari-schools-list/schoolsList.json";

export async function getSchools(): Promise<School[]> {
    const response = await fetch(schoolsUrl);
    if (!response.ok) {
        throw new Error();
    }

    return await response.json();
}
