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

//type CourseInfo = import('./interface').CourseInfo;

declare function $$magicalImportHTMLCode$$(): string;

const htmlCode = $$magicalImportHTMLCode$$(); //This call is replaced by a string literal of the bundled HTML file by `build.mjs`

declare const GM: any;


(function() {
    'use strict';
    
    const localStorageKey = 'neptun-orarend-plus-data';
    
    const url = window.location;

    if(url.pathname.startsWith('/neptun-orarend-plus')) {
        handleTimetablePage();
    } else {
        handleNeptunPage();
    }

    async function handleTimetablePage() {
        const courses = JSON.parse(await GM.getValue('courses', '{}'));
        
        console.log('[Neptun Órarend+] Injecting HTML page');

        document.open();
        document.write(htmlCode);
        document.close();

        unsafeWindow.updateCoursesList(courses);
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

            const subject = tabElement.querySelector('h2').textContent;

            if (subject === lastSubject && !forceRefresh)
                return;

            lastSubject = subject;

            console.log('Refreshing data for subject %s', subject);

            const coursesTable = tabElement.querySelector('table.table_body');

            const data = JSON.parse(await GM.getValue('courses', '{}'));

            const currentSubjectData = data[subject] ??= {};

            const coursesTableHeaders = Array.from(coursesTable.querySelectorAll('th'), e => e.textContent);
            for (const courseRow of coursesTable.querySelectorAll('tbody>tr')) {
                const currentCourseMetaData = {};
                const courseRowCells = courseRow.querySelectorAll('td');
                for (let i = 0; i < coursesTableHeaders.length; i++) {
                    currentCourseMetaData[coursesTableHeaders[i]] = courseRowCells[i].querySelector('.tooltipDetails')?.innerText ?? courseRowCells[i].innerText;
                }
                const checkbox = courseRow.querySelector('input[type="checkbox"]');

                currentSubjectData[currentCourseMetaData['Kurzus kódja']] = {
                    metadata: currentCourseMetaData,
                    checked: checkbox.checked
                };
            }

            GM.setValue('courses', JSON.stringify(data));
        };

        setInterval(update, 500, false);
    }
})();