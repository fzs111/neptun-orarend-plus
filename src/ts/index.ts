function time(hh: number, mm: number) {
    return hh * 60 + mm;
}
function formatTime(t: number): string {
    return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
}


type Course = {
    start: Time,
    end: Time,
}

type CourseWithLane = Course & {
    lane: number,
}

function addLaneToCourse(course: Course, lane: number): CourseWithLane {
    return { ...course, lane };
}

function assignToLanes(courses: Course[]): [number, CourseWithLane[]] {

    courses.sort((a, b) => a.start - b.start);

    let lanes = 0;
    const freeLanes = new Set<number>;
    const endsOfOngoing: CourseWithLane[] = [];
    const coursesWithLanes = courses.map(course => {
        while (endsOfOngoing.length > 0 && endsOfOngoing.at(-1)!.end <= course.start) {
            const popped = endsOfOngoing.pop()!;
            freeLanes.add(popped.lane);
        }

        if (freeLanes.size === 0) {
            freeLanes.add(lanes++);
        }

        const lane = freeLanes.keys().next().value;

        freeLanes.delete(lane);

        const courseWithLane = addLaneToCourse(course, lane);

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

        endsOfOngoing.splice(index, 0, courseWithLane);

        return courseWithLane;
    });

    return [lanes, coursesWithLanes];
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

function render(grid: HTMLElement, courses: CourseWithLane[], timeMap: Map<Time, number>, colOffset: number, rowOffset: number) {
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];

        const elem = document.createElement('div');

        elem.textContent = String(i);

        setCoursePositionInGrid(elem, course, timeMap, colOffset, rowOffset);

        grid.append(elem);
    }
}

function setCoursePositionInGrid(elem: HTMLElement, course: CourseWithLane, timeMap: Map<number, number>, colOffset: number, rowOffset: number) {
    setPositionInGrid(
        elem, 
        course.lane + colOffset,
        course.lane + colOffset + 1,
        timeMap.get(course.start)! + rowOffset,
        timeMap.get(course.end)! + rowOffset
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

const courses = [
    [
        { start: time( 8, 0), end: time( 9,50) },
        { start: time(15,20), end: time(17, 0) },
        { start: time(10,45), end: time(12,25) },
        { start: time(13,30), end: time(15,10) },
        { start: time(12,35), end: time(14,15) },
        { start: time( 9,50), end: time(11,30) },
        { start: time(13,30), end: time(15,10) },
    ],
    [
        { start: time( 8, 0), end: time( 9,40) },
        { start: time(15,20), end: time(17, 0) },
        { start: time(10,45), end: time(12,25) },
        { start: time(13,30), end: time(15,10) },
        { start: time(12,35), end: time(14,15) },
        { start: time(13,30), end: time(15,10) },
        { start: time(13,30), end: time(15,10) },
    ],
];

const timeMap = createTimeMap(courses.flat());
const grid = document.querySelector('#timetable-column')! as HTMLElement;

const timeIter = timeMap.entries();
const { done, value: firstEntry } = timeIter.next();

if(done) {
    throw new Error('No items in the timetable');
}

addTimeMarkerElem(firstEntry);

//this relies on the fact that `timeMap` is sorted by time
let prevTime = firstEntry;

const lengths = [];
for(const time of timeIter) {
    lengths.push(String(time[0] - prevTime[0]) + 'fr');
    
    addTimeMarkerElem(time);

    prevTime = time;
}

grid.style.gridTemplateRows = `min-content ${lengths.join(' ')}`;

let columns = 1;
for(const coursesInADay of courses) {
    const [laneCount, coursesWithLanes] = assignToLanes(coursesInADay);

    const dayMarker = createElement(grid);
    setPositionInGrid(dayMarker, columns, columns + laneCount, 0, 1);
    dayMarker.innerText = 'Day';

    
    render(grid, coursesWithLanes, timeMap, columns, 1);
    
    columns += laneCount + 1;
}

function addTimeMarkerElem(time: [number, number]) {
    const timeMarker = createElement(grid);
    setPositionInGrid(timeMarker, 0, 1, time[1], time[1] + 1);
    timeMarker.classList.add('time-marker');
    const timeMarkerInner = timeMarker.appendChild(document.createElement('div'));
    timeMarkerInner.innerText = formatTime(time[0]);
}
