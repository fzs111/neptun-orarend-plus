function time(hh: number, mm: number) {
    return hh * 60 + mm;
}
function formatTime(t: number): string {
    return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
}


type Course = {
    start: Time,
    end: Time,
    properties: { [k: string]: string},
}

function assignToLanes(courses: Course[]): [number, WeakMap<Course, number>] {

    courses.sort((a, b) => a.start - b.start);

    let lanes = 0;
    const freeLanes = new Set<number>;
    const endsOfOngoing: Course[] = [];
    const laneMap = new WeakMap<Course, number>;
    for (const course of courses) {
        while (endsOfOngoing.length > 0 && endsOfOngoing.at(-1)!.end <= course.start) {
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
                if (arr[middle].end > target) {
                    start = middle + 1;
                } else {
                    end = middle;
                }
            }
            return start;
        };

        const index = binarySearch(endsOfOngoing, course.end);

        endsOfOngoing.splice(index, 0, course);
    };

    return [lanes, laneMap];
}

type Time = number;

function createTimeMap(courses: Course[]): Map<Time, number> {
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

        elem.textContent = String(i);

        setCoursePositionInGrid(elem, course, timeMap, laneMap, colOffset, rowOffset);

        grid.append(elem);

        colWidths.push('1fr');
    }

    return colWidths.join(' ');
}

function setCoursePositionInGrid(elem: HTMLElement, course: Course, timeMap: Map<number, number>, laneMap: WeakMap<Course, number>, colOffset: number, rowOffset: number) {
    const lane = laneMap.get(course);

    if(lane === undefined) {
        throw new Error('lane not assigned to course in `setCoursePositionInGrid`');
    }

    setPositionInGrid(
        elem, 
        colOffset + lane,
        colOffset + lane + 1,
        rowOffset + timeMap.get(course.start)!,
        rowOffset + timeMap.get(course.end)!
    );
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



function main(){
    const courses = [
        { start: time( 8, 0), end: time( 9,50), properties: {'Tárgy': 'asd', 'Day': 'Monday'} },
        { start: time(15,20), end: time(17, 0), properties: {'Tárgy': 'asd', 'Day': 'Monday'} },
        { start: time(10,45), end: time(12,25), properties: {'Tárgy': 'bxd', 'Day': 'Monday'} },
        { start: time(13,30), end: time(15,10), properties: {'Tárgy': 'emk', 'Day': 'Monday'} },
        { start: time(12,35), end: time(14,15), properties: {'Tárgy': 'bxd', 'Day': 'Monday'} },
        { start: time( 9,50), end: time(11,30), properties: {'Tárgy': 'emk', 'Day': 'Monday'} },
        { start: time(13,30), end: time(15,10), properties: {'Tárgy': 'bxd', 'Day': 'Monday'} },
        { start: time( 8, 0), end: time( 9,40), properties: {'Tárgy': 'emk', 'Day': 'Tuesday'} },
        { start: time(15,20), end: time(17, 0), properties: {'Tárgy': 'bxd', 'Day': 'Tuesday'} },
        { start: time(10,45), end: time(12,25), properties: {'Tárgy': 'emk', 'Day': 'Tuesday'} },
        { start: time(13,30), end: time(15,10), properties: {'Tárgy': 'asdf', 'Day': 'Tuesday'} },
        { start: time(12,35), end: time(14,15), properties: {'Tárgy': 'asd', 'Day': 'Tuesday'} },
        { start: time(13,30), end: time(15,10), properties: {'Tárgy': 'emk', 'Day': 'Tuesday'} },
        { start: time(13,30), end: time(15,10), properties: {'Tárgy': 'asd', 'Day': 'Tuesday'} },
    ];

    const grid = document.querySelector('#timetable-column')! as HTMLElement;
    renderTimetableGrid(grid, courses, ['Day']);
}

document.addEventListener('DOMContentLoaded', main);

function renderTimetableGrid(grid: HTMLElement, courses: Course[], groupByKeys: string[]) {
  const timeMap = createTimeMap(courses);

  const rowHeights = renderTimeMarkerColumn(grid, timeMap, groupByKeys.length);

  const headerTemplateRowHeights = groupByKeys.map(() => 'min-content').join(' ');

  grid.style.gridTemplateRows = `${headerTemplateRowHeights} ${rowHeights}`;

  renderCoursesWithHeader(grid, courses, groupByKeys, timeMap, 1, 0);
}

function renderCoursesWithHeader(grid: HTMLElement, courses: Course[], groupByKeys: string[], timeMap: Map<number, number>, startColumn: number, startRow: number): [number, string] {
    if(groupByKeys.length === 0) {

        const [laneCount, laneMap] = assignToLanes(courses);

        const templateColWidths = renderCourseGroup(grid, courses, timeMap, laneMap, startColumn, startRow);

        return [laneCount, templateColWidths];
    } else {
        const [key, ...newGroupByKeys] = groupByKeys;

        
        const groups = groupCourses(courses, key);
        
        let columns = 0;
        const templateColWidths = [];
        for(const [title, group] of groups) {

            const groupMarker = createElement(grid);
            groupMarker.innerText = title;

            const [width, curTemplateColWidths] = renderCoursesWithHeader(grid, group, newGroupByKeys, timeMap, startColumn + columns, startRow + 1);
            templateColWidths.push(curTemplateColWidths);
            
            setPositionInGrid(groupMarker, startColumn + columns, startColumn + columns + width, startRow, startRow + 1);

            columns += width;
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
        setPositionInGrid(timeMarker, 0, 1, startRow + time[1] - 1, startRow + time[1]);
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

function groupCourses(courses: Course[], key: string): Map<string, Course[]> {
    return Map.groupBy(courses, course => course.properties[key]);
}