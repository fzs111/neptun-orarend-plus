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

type CourseMetadata = import('./interface').CourseMetadata;

//type CourseInfo = import('./interface').CourseInfo;

declare function $$magicalImportHTMLCode$$(): string;

const htmlCode = $$magicalImportHTMLCode$$(); //This call is replaced by a string literal of the bundled HTML file by `build.mjs`

(function() {
    'use strict';
    
    const url = window.location;

    if(url.pathname.startsWith('/neptun-orarend-plus')) {
        handleTimetablePage();
    } else {
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


        let lastSubject: string | null = null;
        const update = async (forceRefresh = false) => {
            const tabElement = document.querySelector('#Subject_data_for_schedule_tab_body');
            if (!tabElement)
                return;

            const subjectElem = tabElement.querySelector('h2');

            if(!subjectElem) {
                return;
            }

            const coursesTable = tabElement.querySelector('table.table_body');

            if(!coursesTable) {
                return;
            }

            const subject = subjectElem.textContent;

            if (subject === lastSubject && !forceRefresh)
                return;

            lastSubject = subject;

            if(!subject) {
                return;
            }

            console.log('Refreshing data for subject %s', subject);


            const data: SubjectInfo = await GM.getValue('courses', {});

            const currentSubjectData = data[subject] ??= {};

            const coursesTableHeaders = Array.from(coursesTable.querySelectorAll('th'), e => e.textContent || '');
            for (const courseRow of coursesTable.querySelectorAll('tbody>tr')) {
                const currentCourseMetaData: CourseMetadata = {};
                const courseRowCells = courseRow.querySelectorAll('td');
                for (let i = 0; i < coursesTableHeaders.length; i++) {
                    const titleText = courseRowCells[i].querySelector<HTMLElement>('.tooltipDetails')?.innerText ?? null;
                    const innerText = courseRowCells[i].innerText;
                    currentCourseMetaData[coursesTableHeaders[i]] = { innerText, titleText };
                }
                const checkbox = courseRow.querySelector<HTMLInputElement>('input[type="checkbox"]')!;

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