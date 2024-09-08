declare global {
    interface Window {
        updateCoursesList(coursesList: CourseInfo): void;
    }
}



export type CourseInfo = Record<string, Record<string, { checked: boolean, metadata: Record<string, string> }>>;