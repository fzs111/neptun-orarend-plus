declare global {
    interface Window {
        updateCoursesList(coursesList: SubjectInfo): void;
    }
}


export type CourseMetadataEntry = { titleText: string | null, innerText: string}
export type SubjectInfo = Record<string, CourseData>;
export type CourseData = Record<string, { checked: boolean, metadata: CourseMetadata }>;
export type CourseMetadata = Record<string, CourseMetadataEntry>;