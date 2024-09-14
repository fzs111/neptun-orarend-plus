
type SubjectInfo = import('./interface').SubjectInfo;
type CourseMetadataEntry = import('./interface').CourseMetadataEntry;

console.log('[Neptun Órarend+] Injected script running');

function time(hh: number, mm: number) {
    return hh * 60 + mm;
}
function formatTime(t: number): string {
    return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
}

type Day = 'H' | 'K' | 'SZE' | 'CS' | 'P' | 'SZO' | 'V';

type Course = {
    timetableInfo: TimetableInfo,
    properties: { [k: string]: CourseMetadataEntry },
    
    subject: string,
    checked: boolean,
    code: string,
    color: string,
}

type GroupSelector = {
    group(courses: Course[]): CourseGroup[]
}

type CourseGroup = {
    header: string,
    courses: Course[],
}

type TimetableInfo = {
    day: Day,
    start: Time,
    end: Time,
}

type Time = number;


function createMonogram(names: string): string {
    return names.split(',').map(n => n.split(' ').filter(n => !(/^dr(?!\w)|^\s*$/i.test(n))).map(n => n[0]).join('')).join(',');
}

function* generateColors() {
    yield* ['hsl(0, 54%, 79%)', 'lightyellow', 'lightgreen', 'lightblue', 'hsl(30, 54%, 79%)', 'rgb(179, 172, 230)'];

    while (true) {
        const hue = Math.floor(Math.random() * 360);

        yield `hsl(${hue}, 53%, 79%)`;
    }
}

function setPositionInGrid(elem: HTMLElement, colStart: number, colEnd: number, rowStart: number, rowEnd: number) {
    elem.style.gridColumnStart = String(colStart + 1);
    elem.style.gridColumnEnd = String(colEnd + 1);
    elem.style.gridRowStart = String(rowStart + 1);
    elem.style.gridRowEnd = String(rowEnd + 1);
}

function createElement(grid: HTMLElement): HTMLDivElement {
    return grid.appendChild(document.createElement('div'));
}



window.updateCoursesList = function (coursesList: SubjectInfo) {

    console.log('[Neptun Órarend+] Updating course list');

    const grid = document.querySelector('#timetable-column')! as HTMLElement;

    const courses = convertCoursesToTimetableFormat(coursesList);

    renderTimetableGrid(grid, courses, [
        {
            group(courses) {
                const out: CourseGroup[] = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'].map(n => ({
                    header: n,
                    courses: []
                }));

                const days = ['H', 'K', 'SZE', 'CS', 'P', 'SZO', 'V'];

                for (const course of courses) {
                    const idx = days.indexOf(course.timetableInfo.day);

                    out[idx].courses.push(course);
                }

                return out;
            },
        }
    ]);
};

function convertCoursesToTimetableFormat(coursesList: SubjectInfo): Course[] {
    const courses = [];

    const colorGenerator = generateColors();
    for (const [subject, coursesObj] of Object.entries(coursesList)) {
        const color = colorGenerator.next().value!;
        for (const [courseCode, properties] of Object.entries(coursesObj)) {
            const timetableInfo = properties.metadata["Órarend infó"];
            const match = timetableInfo.innerText.match(/^(\w+):(\d+:\d+)-(\d+:\d+)/);
            if (!match) {
                continue;
            }
            const [, dayString, startString, endString] = match;
            if(!['H', 'K', 'SZE', 'CS', 'P', 'SZO', 'V'].includes(dayString)) {
                throw new Error(`Invalid day value: ${dayString}`);
            }
            const day = dayString as Day; 
            const start = time(...startString.split(':').map(Number) as [number, number]);
            const end = time(...endString.split(':').map(Number) as [number, number]);

            courses.push({
                timetableInfo: { day, start, end },
                properties: properties.metadata,
                subject,
                checked: properties.checked,
                code: courseCode,
                color,
            });
        }
    }
    return courses;
}

function renderTimetableGrid(grid: HTMLElement, courses: Course[], groupByKeys: GroupSelector[]) {
    // Clear all children
    grid.replaceChildren();

    const timeMap = createTimeMap(courses.map(course => course.timetableInfo));
    const templateRowHeights = renderTimeMarkerColumn(grid, timeMap, groupByKeys.length);

    const headerTemplateRowHeights = groupByKeys.map(() => 'min-content').join(' ');
    grid.style.gridTemplateRows = `${headerTemplateRowHeights} ${templateRowHeights}`;

    const [width, templateColWidths] = renderCoursesWithHeader(grid, courses, groupByKeys, timeMap, 1, 0);

    renderHorizontalLines(grid, timeMap.size, 0, width + 1, groupByKeys.length);

    grid.style.gridTemplateColumns = ['fit-content(1fr)', templateColWidths].join(' ');


    function assignToLanes(courses: Course[]): [number, WeakMap<Course, number>] {

        courses.sort((a, b) => a.timetableInfo.start - b.timetableInfo.start);

        let lanes = 0;
        const freeLanes = new Set<number>;
        const endsOfOngoing: Course[] = [];
        const laneMap = new WeakMap<Course, number>;
        for (const course of courses) {
            while (endsOfOngoing.length > 0 && endsOfOngoing.at(-1)!.timetableInfo.end <= course.timetableInfo.start) {
                const popped = endsOfOngoing.pop()!;
                freeLanes.add(laneMap.get(popped)!);
            }

            if (freeLanes.size === 0) {
                freeLanes.add(lanes++);
            }

            const lane = freeLanes.keys().next().value;

            freeLanes.delete(lane);

            laneMap.set(course, lane);

            const binarySearch = (arr: Course[], target: number) => {
                let start = 0;
                let end = arr.length;
                while (start < end) {
                    const middle = Math.floor((start + end) / 2);
                    if (arr[middle].timetableInfo.end > target) {
                        start = middle + 1;
                    } else {
                        end = middle;
                    }
                }
                return start;
            };

            const index = binarySearch(endsOfOngoing, course.timetableInfo.end);

            endsOfOngoing.splice(index, 0, course);
        };

        return [lanes, laneMap];
    }


    function createTimeMap(courses: TimetableInfo[]): Map<Time, number> {
        const times: Set<Time> = new Set;
        for (const course of courses) {
            times.add(course.start);
            times.add(course.end);
        }

        const timesSorted = [...times].sort((a, b) => a - b);

        const timeMap = new Map<Time, number>();

        for (let i = 0; i < timesSorted.length; i++) {
            timeMap.set(timesSorted[i], i);
        }

        return timeMap;
    }

    function renderCourseGroup(grid: HTMLElement, courses: Course[], timeMap: Map<Time, number>, laneMap: WeakMap<Course, number>, colOffset: number, rowOffset: number): string {
        const colWidths = [];

        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];

            const elem = document.createElement('div');

            elem.textContent = createMonogram(String(course.properties.Oktatók.innerText));
            elem.style.backgroundColor = course.color;

            elem.classList.add('course');

            setCoursePositionInGrid(elem, course, timeMap, laneMap, colOffset, rowOffset);

            grid.append(elem);

            colWidths.push('fit-content(1fr)');
        }

        return colWidths.join(' ');
    }


    function setCoursePositionInGrid(elem: HTMLElement, course: Course, timeMap: Map<number, number>, laneMap: WeakMap<Course, number>, colOffset: number, rowOffset: number) {
        const lane = laneMap.get(course);

        if (lane === undefined) {
            throw new Error('lane not assigned to course in `setCoursePositionInGrid`');
        }

        setPositionInGrid(
            elem,
            colOffset + lane,
            colOffset + lane + 1,
            rowOffset + timeMap.get(course.timetableInfo.start)!,
            rowOffset + timeMap.get(course.timetableInfo.end)!
        );
    }

    function renderCoursesWithHeader(grid: HTMLElement, courses: Course[], groupByKeys: GroupSelector[], timeMap: Map<number, number>, startColumn: number, startRow: number): [number, string] {
        if (groupByKeys.length === 0) {

            const [laneCount, laneMap] = assignToLanes(courses);

            const templateColWidths = renderCourseGroup(grid, courses, timeMap, laneMap, startColumn, startRow);

            return [laneCount, templateColWidths];
        } else {
            const [key, ...newGroupByKeys] = groupByKeys;

            const groups = key.group(courses);

            let columns = 0;
            const templateColWidths = [];
            for (const { header, courses: group } of groups) {

                const groupMarker = createElement(grid);
                groupMarker.innerText = header;
                groupMarker.classList.add('header-marker');

                const [width, curTemplateColWidths] = renderCoursesWithHeader(grid, group, newGroupByKeys, timeMap, startColumn + columns, startRow + 1);

                const realWidth = Math.max(width, 1);

                templateColWidths.push(curTemplateColWidths);

                setPositionInGrid(groupMarker, startColumn + columns, startColumn + columns + realWidth, startRow, startRow + 1);

                columns += realWidth;
            }

            return [columns, templateColWidths.join(' ')];
        }
    }

    /**
     * @returns string of CSS `grid-template-rows` row heights
    */
    function renderTimeMarkerColumn(grid: HTMLElement, timeMap: Map<number, number>, startRow: number): string {
        const timeIter = timeMap.entries();
        const { done, value: firstEntry } = timeIter.next();

        if (done) {
            throw new Error('No items in the timetable');
        }

        function addTimeMarkerElem(time: [number, number]) {
            const timeMarker = createElement(grid);
            setPositionInGrid(timeMarker, 0, 1, startRow + time[1], startRow + time[1] + 1);
            timeMarker.classList.add('time-marker');
            const timeMarkerInner = timeMarker.appendChild(document.createElement('div'));
            timeMarkerInner.innerText = formatTime(time[0]);
        }

        addTimeMarkerElem(firstEntry);

        //this relies on the fact that `timeMap` is sorted by time
        let prevTime = firstEntry;

        const lengths = [];
        for (const time of timeIter) {
            lengths.push(String(time[0] - prevTime[0]) + 'fr');

            addTimeMarkerElem(time);

            prevTime = time;
        }

        return lengths.join(' ');
    }
    /*
    function groupCourses(courses: Course[], key: string): Map<unknown, Course[]> {
        return Map.groupBy(courses, course => course.properties[key]);
        }*/

    function renderHorizontalLines(grid: HTMLElement, lineCount: number, startColumn: number, endColumn: number, startRow: number) {
        for (let i = 0; i < lineCount; i++) {
            const horizontalLine = createElement(grid);
            setPositionInGrid(horizontalLine, startColumn, endColumn, startRow + i, startRow + i + 1);
            horizontalLine.classList.add('horizontal-line');
        }
    }

}