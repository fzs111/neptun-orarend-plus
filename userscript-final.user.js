"use strict";
// ==UserScript==
// @name         Neptun Órarend+
// @namespace    http://tampermonkey.net/
// @version      2024-02-01
// @description
// @author       You
// @match        https://neptun.uni-obuda.hu/hallgato/main.aspx?*ctrl=0303*
// @match        https://fzs111.github.io/neptun-orarend-plus*
// @grant        GM.registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==
const htmlCode = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Órarend</title>\n\n    <!-- These tags are replaced by the JS and CSS files by `build.mjs` -->\n    <style>#timetable-column {\n  --row-gap: 0.05em;\n  --extra-width: 0.1em;\n  --z-header-marker: 3;\n  --z-time-marker: 2;\n  --z-course: 1;\n  --z-horizontal-line: 0;\n  display: grid;\n  row-gap: var(--row-gap);\n  column-gap: 1em;\n  height: 90vh;\n}\n#timetable-column > * {\n  border: 1px solid black;\n  background-color: white;\n}\n#timetable-column .time-marker {\n  border: none;\n  padding: 0;\n  position: sticky;\n  left: 0px;\n  z-index: var(--z-time-marker);\n}\n#timetable-column .time-marker > * {\n  /* move time (&) onto gridlines */\n  translate: 0 calc(-50% - var(--row-gap) / 2);\n  background-color: white;\n  padding: 0 5px;\n  border: 1px solid black;\n}\n#timetable-column .horizontal-line {\n  border: none;\n  border-top: calc(var(--extra-width) + var(--row-gap)) dashed gray;\n  translate: 0 calc(-1 * (var(--extra-width) / 2 + var(--row-gap)));\n  z-index: var(--z-horizontal-line);\n  transition: border-color 1s;\n}\n#timetable-column .horizontal-line:hover {\n  border-color: red;\n}\n#timetable-column .course {\n  justify-self: start;\n  z-index: var(--z-course);\n}\n#timetable-column .header-marker {\n  position: sticky;\n  top: 0px;\n  z-index: var(--z-header-marker);\n}\n\n/*# sourceMappingURL=index.css.map */\n</style>\n    <script>\"use strict\";\nconsole.log('[Neptun Órarend+] Injected script running');\nfunction time(hh, mm) {\n    return hh * 60 + mm;\n}\nfunction formatTime(t) {\n    return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;\n}\nfunction createMonogram(names) {\n    return names.split(',').map(n => n.split(' ').filter(n => !(/^dr(?!\\w)|^\\s*$/i.test(n))).map(n => n[0]).join('')).join(',');\n}\nfunction* generateColors() {\n    yield* ['hsl(0, 54%, 79%)', 'lightyellow', 'lightgreen', 'lightblue', 'hsl(30, 54%, 79%)', 'rgb(179, 172, 230)'];\n    while (true) {\n        const hue = Math.floor(Math.random() * 360);\n        yield `hsl(${hue}, 53%, 79%)`;\n    }\n}\nfunction setPositionInGrid(elem, colStart, colEnd, rowStart, rowEnd) {\n    elem.style.gridColumnStart = String(colStart + 1);\n    elem.style.gridColumnEnd = String(colEnd + 1);\n    elem.style.gridRowStart = String(rowStart + 1);\n    elem.style.gridRowEnd = String(rowEnd + 1);\n}\nfunction createElement(grid) {\n    return grid.appendChild(document.createElement('div'));\n}\nwindow.updateCoursesList = function (coursesList) {\n    console.log('[Neptun Órarend+] Updating course list');\n    const grid = document.querySelector('#timetable-column');\n    const courses = convertCoursesToTimetableFormat(coursesList);\n    renderTimetableGrid(grid, courses, [\n        {\n            group(courses) {\n                const out = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'].map(n => ({\n                    header: n,\n                    courses: []\n                }));\n                const days = ['H', 'K', 'SZE', 'CS', 'P', 'SZO', 'V'];\n                for (const course of courses) {\n                    const idx = days.indexOf(course.timetableInfo.day);\n                    out[idx].courses.push(course);\n                }\n                return out;\n            },\n        }\n    ]);\n};\nfunction convertCoursesToTimetableFormat(coursesList) {\n    const courses = [];\n    const colorGenerator = generateColors();\n    for (const [subject, coursesObj] of Object.entries(coursesList)) {\n        const color = colorGenerator.next().value;\n        for (const [courseCode, properties] of Object.entries(coursesObj)) {\n            const timetableInfo = properties.metadata[\"Órarend infó\"];\n            const match = timetableInfo.innerText.match(/^(\\w+):(\\d+:\\d+)-(\\d+:\\d+)/);\n            if (!match) {\n                continue;\n            }\n            const [, dayString, startString, endString] = match;\n            if (!['H', 'K', 'SZE', 'CS', 'P', 'SZO', 'V'].includes(dayString)) {\n                throw new Error(`Invalid day value: ${dayString}`);\n            }\n            const day = dayString;\n            const start = time(...startString.split(':').map(Number));\n            const end = time(...endString.split(':').map(Number));\n            courses.push({\n                timetableInfo: { day, start, end },\n                properties: properties.metadata,\n                subject,\n                checked: properties.checked,\n                code: courseCode,\n                color,\n            });\n        }\n    }\n    return courses;\n}\nfunction renderTimetableGrid(grid, courses, groupByKeys) {\n    // Clear all children\n    grid.replaceChildren();\n    const timeMap = createTimeMap(courses.map(course => course.timetableInfo));\n    const templateRowHeights = renderTimeMarkerColumn(grid, timeMap, groupByKeys.length);\n    const headerTemplateRowHeights = groupByKeys.map(() => 'min-content').join(' ');\n    grid.style.gridTemplateRows = `${headerTemplateRowHeights} ${templateRowHeights}`;\n    const [width, templateColWidths] = renderCoursesWithHeader(grid, courses, groupByKeys, timeMap, 1, 0);\n    renderHorizontalLines(grid, timeMap.size, 0, width + 1, groupByKeys.length);\n    grid.style.gridTemplateColumns = ['fit-content(1fr)', templateColWidths].join(' ');\n    function assignToLanes(courses) {\n        courses.sort((a, b) => a.timetableInfo.start - b.timetableInfo.start);\n        let lanes = 0;\n        const freeLanes = new Set;\n        const endsOfOngoing = [];\n        const laneMap = new WeakMap;\n        for (const course of courses) {\n            while (endsOfOngoing.length > 0 && endsOfOngoing.at(-1).timetableInfo.end <= course.timetableInfo.start) {\n                const popped = endsOfOngoing.pop();\n                freeLanes.add(laneMap.get(popped));\n            }\n            if (freeLanes.size === 0) {\n                freeLanes.add(lanes++);\n            }\n            const lane = freeLanes.keys().next().value;\n            freeLanes.delete(lane);\n            laneMap.set(course, lane);\n            const binarySearch = (arr, target) => {\n                let start = 0;\n                let end = arr.length;\n                while (start < end) {\n                    const middle = Math.floor((start + end) / 2);\n                    if (arr[middle].timetableInfo.end > target) {\n                        start = middle + 1;\n                    }\n                    else {\n                        end = middle;\n                    }\n                }\n                return start;\n            };\n            const index = binarySearch(endsOfOngoing, course.timetableInfo.end);\n            endsOfOngoing.splice(index, 0, course);\n        }\n        ;\n        return [lanes, laneMap];\n    }\n    function createTimeMap(courses) {\n        const times = new Set;\n        for (const course of courses) {\n            times.add(course.start);\n            times.add(course.end);\n        }\n        const timesSorted = [...times].sort((a, b) => a - b);\n        const timeMap = new Map();\n        for (let i = 0; i < timesSorted.length; i++) {\n            timeMap.set(timesSorted[i], i);\n        }\n        return timeMap;\n    }\n    function renderCourseGroup(grid, courses, timeMap, laneMap, colOffset, rowOffset) {\n        const colWidths = [];\n        for (let i = 0; i < courses.length; i++) {\n            const course = courses[i];\n            const elem = document.createElement('div');\n            elem.textContent = createMonogram(String(course.properties.Oktatók.innerText));\n            elem.style.backgroundColor = course.color;\n            elem.classList.add('course');\n            setCoursePositionInGrid(elem, course, timeMap, laneMap, colOffset, rowOffset);\n            grid.append(elem);\n            colWidths.push('fit-content(1fr)');\n        }\n        return colWidths.join(' ');\n    }\n    function setCoursePositionInGrid(elem, course, timeMap, laneMap, colOffset, rowOffset) {\n        const lane = laneMap.get(course);\n        if (lane === undefined) {\n            throw new Error('lane not assigned to course in `setCoursePositionInGrid`');\n        }\n        setPositionInGrid(elem, colOffset + lane, colOffset + lane + 1, rowOffset + timeMap.get(course.timetableInfo.start), rowOffset + timeMap.get(course.timetableInfo.end));\n    }\n    function renderCoursesWithHeader(grid, courses, groupByKeys, timeMap, startColumn, startRow) {\n        if (groupByKeys.length === 0) {\n            const [laneCount, laneMap] = assignToLanes(courses);\n            const templateColWidths = renderCourseGroup(grid, courses, timeMap, laneMap, startColumn, startRow);\n            return [laneCount, templateColWidths];\n        }\n        else {\n            const [key, ...newGroupByKeys] = groupByKeys;\n            const groups = key.group(courses);\n            let columns = 0;\n            const templateColWidths = [];\n            for (const { header, courses: group } of groups) {\n                const groupMarker = createElement(grid);\n                groupMarker.innerText = header;\n                groupMarker.classList.add('header-marker');\n                const [width, curTemplateColWidths] = renderCoursesWithHeader(grid, group, newGroupByKeys, timeMap, startColumn + columns, startRow + 1);\n                const realWidth = Math.max(width, 1);\n                templateColWidths.push(curTemplateColWidths);\n                setPositionInGrid(groupMarker, startColumn + columns, startColumn + columns + realWidth, startRow, startRow + 1);\n                columns += realWidth;\n            }\n            return [columns, templateColWidths.join(' ')];\n        }\n    }\n    /**\n     * @returns string of CSS `grid-template-rows` row heights\n    */\n    function renderTimeMarkerColumn(grid, timeMap, startRow) {\n        const timeIter = timeMap.entries();\n        const { done, value: firstEntry } = timeIter.next();\n        if (done) {\n            throw new Error('No items in the timetable');\n        }\n        function addTimeMarkerElem(time) {\n            const timeMarker = createElement(grid);\n            setPositionInGrid(timeMarker, 0, 1, startRow + time[1], startRow + time[1] + 1);\n            timeMarker.classList.add('time-marker');\n            const timeMarkerInner = timeMarker.appendChild(document.createElement('div'));\n            timeMarkerInner.innerText = formatTime(time[0]);\n        }\n        addTimeMarkerElem(firstEntry);\n        //this relies on the fact that `timeMap` is sorted by time\n        let prevTime = firstEntry;\n        const lengths = [];\n        for (const time of timeIter) {\n            lengths.push(String(time[0] - prevTime[0]) + 'fr');\n            addTimeMarkerElem(time);\n            prevTime = time;\n        }\n        return lengths.join(' ');\n    }\n    /*\n    function groupCourses(courses: Course[], key: string): Map<unknown, Course[]> {\n        return Map.groupBy(courses, course => course.properties[key]);\n        }*/\n    function renderHorizontalLines(grid, lineCount, startColumn, endColumn, startRow) {\n        for (let i = 0; i < lineCount; i++) {\n            const horizontalLine = createElement(grid);\n            setPositionInGrid(horizontalLine, startColumn, endColumn, startRow + i, startRow + i + 1);\n            horizontalLine.classList.add('horizontal-line');\n        }\n    }\n}\n</script>\n\n</head>\n<body>\n    <div id=\"timetable-column\">\n\n    </div>\n</body>\n</html>"; //This call is replaced by a string literal of the bundled HTML file by `build.mjs`
(function () {
    'use strict';
    const url = window.location;
    if (url.pathname.startsWith('/neptun-orarend-plus')) {
        handleTimetablePage();
    }
    else {
        handleNeptunPage();
    }
    async function handleTimetablePage() {
        console.log('[Neptun Órarend+] Injecting HTML page');
        document.open();
        document.write(htmlCode);
        document.close();
        unsafeWindow.updateCoursesList(await GM.getValue('courses', {}));
        await GM.addValueChangeListener('courses', (_key, _oldValue, newValue) => {
            unsafeWindow.updateCoursesList(newValue);
        });
    }
    function handleNeptunPage() {
        GM.registerMenuCommand('Órarend megnyitása', openTimetable);
        function openTimetable() {
            const childWindow = window.open('https://fzs111.github.io/neptun-orarend-plus', '_blank');
            if (!childWindow) {
                alert('Popup blocked');
                return;
            }
        }
        let lastSubject = null;
        const update = async (forceRefresh = false) => {
            const tabElement = document.querySelector('#Subject_data_for_schedule_tab_body');
            if (!tabElement)
                return;
            const subjectElem = tabElement.querySelector('h2');
            if (!subjectElem) {
                return;
            }
            const coursesTable = tabElement.querySelector('table.table_body');
            if (!coursesTable) {
                return;
            }
            const subject = subjectElem.textContent;
            if (subject === lastSubject && !forceRefresh)
                return;
            lastSubject = subject;
            if (!subject) {
                return;
            }
            console.log('Refreshing data for subject %s', subject);
            const data = await GM.getValue('courses', {});
            const currentSubjectData = data[subject] ??= {};
            const coursesTableHeaders = Array.from(coursesTable.querySelectorAll('th'), e => e.textContent || '');
            for (const courseRow of coursesTable.querySelectorAll('tbody>tr')) {
                const currentCourseMetaData = {};
                const courseRowCells = courseRow.querySelectorAll('td');
                for (let i = 0; i < coursesTableHeaders.length; i++) {
                    const titleText = courseRowCells[i].querySelector('.tooltipDetails')?.innerText ?? null;
                    const innerText = courseRowCells[i].innerText;
                    currentCourseMetaData[coursesTableHeaders[i]] = { innerText, titleText };
                }
                const checkbox = courseRow.querySelector('input[type="checkbox"]');
                const courseCode = currentCourseMetaData['Kurzus kódja'].innerText;
                currentSubjectData[courseCode] = {
                    metadata: currentCourseMetaData,
                    checked: checkbox.checked
                };
            }
            GM.setValue('courses', data);
        };
        setInterval(update, 500, false);
    }
})();
