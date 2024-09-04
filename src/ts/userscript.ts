// ==UserScript==
// @name         Neptun Órarend+
// @namespace    http://tampermonkey.net/
// @version      2024-02-01
// @description
// @author       You
// @match        https://neptun.uni-obuda.hu/hallgato/main.aspx?*ctrl=0303*
// @grant        GM_registerMenuCommand
// ==/UserScript==

declare function $$magicalImportHTMLCode$$(): string;

const htmlCode = $$magicalImportHTMLCode$$(); //This call is replaced by a string literal of the bundled HTML file by `build.mjs`


const htmlUrl = URL.createObjectURL(new Blob([htmlCode]));

(function() {
    'use strict';

    const localStorageKey = 'neptun-orarend-plus-data';

    GM_registerMenuCommand('Órarend megnyitása', openTimetable);

    function openTimetable(){
        const childWindow = window.open(htmlUrl, '_blank');

        if(!childWindow) {
            alert('Popup blocked');
            return;
        }
        
        const courses = JSON.parse(localStorage.getItem(localStorageKey) || '{}');
        console.log(courses);
        //(childWindow as Window & { courses: unknown }).courses = courses;
        childWindow.history.replaceState(courses, '');
        childWindow.document.close();

    }


    let lastSubject = null;
    const update = (forceRefresh = false) => {
        const tabElement = document.querySelector('#Subject_data_for_schedule_tab_body');
        if(!tabElement)
            return;

        const subject = tabElement.querySelector('h2').textContent;

        if(subject === lastSubject && !forceRefresh)
            return;

        lastSubject = subject;

        console.log('Refreshing data for subject %s', subject)

        const coursesTable = tabElement.querySelector('table.table_body');

        const data = JSON.parse(window.localStorage.getItem(localStorageKey) || '{}');

        const currentSubjectData = data[subject] ??= {};

        const coursesTableHeaders = Array.from(coursesTable.querySelectorAll('th'), e => e.textContent);
        for(const courseRow of coursesTable.querySelectorAll('tbody>tr')){
            const currentCourseMetaData = {};
            const courseRowCells = courseRow.querySelectorAll('td');
            for(let i = 0; i < coursesTableHeaders.length; i++){
                currentCourseMetaData[coursesTableHeaders[i]] = courseRowCells[i].querySelector('.tooltipDetails')?.innerText ?? courseRowCells[i].innerText;
            }
            const checkbox = courseRow.querySelector('input[type="checkbox"]');

            currentSubjectData[currentCourseMetaData['Kurzus kódja']] = {
                metadata: currentCourseMetaData,
                checked: checkbox.checked
            };
        }

        window.localStorage.setItem(localStorageKey, JSON.stringify(data));
    };

    setInterval(update, 500, false);
})();