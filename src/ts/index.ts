function time(hh: number, mm: number) {
    return hh * 60 + mm;
}
function formatTime(t: number): string {
    return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
}


type Course = {
    start: Time,
    end: Time,
    properties: { [k: string]: unknown},
}


type Time = number;


function createMonogram(names: string): string {
    return names.split(',').map(n => n.split(' ').filter(n => !(/^dr(?!\w)|^\s*$/i.test(n))).map(n => n[0]).join('')).join(',');
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


    const testCoursesRaw = {"Algoritmusok és adatszerkezetek * (NSXAA1HBNF)Mintatanterv:#NIK Mérnökinformatikus Nappali Bsc (F-tanterv)":{"LA01":{"metadata":{"":"LA01","Kurzus kódja":"LA01","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:14:25-16:05 (BA.1.15)","Oktatók":"Gáspár Balázs","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"LA02":{"metadata":{"":"LA02","Kurzus kódja":"LA02","Kurzus típusa":"Labor","Fő/Várólista/Limit":"15/0/24","Órarend infó":"CS:16:15-17:50 (BA.1.15)","Oktatók":"Gáspár Balázs","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"LA03":{"metadata":{"":"LA03","Kurzus kódja":"LA03","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"SZE:09:50-11:30 (BA.2.14)","Oktatók":"Egres Kata","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"LA04":{"metadata":{"":"LA04","Kurzus kódja":"LA04","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"H:13:30-15:10 (BK.1.127)","Oktatók":"Gáspár Balázs","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"LA05":{"metadata":{"":"LA05","Kurzus kódja":"LA05","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"H:11:40-13:20 (BA.1.15)","Oktatók":"Dr. Sergyán Szabolcs","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"LA06":{"metadata":{"":"LA06","Kurzus kódja":"LA06","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"H:13:30-15:10 (BA.1.15)","Oktatók":"Dr. Sergyán Szabolcs","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"LA07":{"metadata":{"":"LA07","Kurzus kódja":"LA07","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"SZE:14:25-16:05 (BA.2.14)","Oktatók":"Egres Kata","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"LA08":{"metadata":{"":"LA08","Kurzus kódja":"LA08","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"SZE:16:15-17:50 (BA.2.14)","Oktatók":"Egres Kata","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"LA09":{"metadata":{"":"LA09","Kurzus kódja":"LA09","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"K:14:25-16:05 (BA.1.13)","Oktatók":"Kovács Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":true},"LA10":{"metadata":{"":"LA10","Kurzus kódja":"LA10","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"K:16:15-17:50 (BA.1.13)","Oktatók":"Kovács Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"LA11":{"metadata":{"":"LA11","Kurzus kódja":"LA11","Kurzus típusa":"Labor","Fő/Várólista/Limit":"0/0/0","Órarend infó":"H:17:55-19:30 (BA.2.10)","Oktatók":"Tusor Balázs","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"EA":{"metadata":{"":"EA","Kurzus kódja":"EA","Kurzus típusa":"Elmélet","Fő/Várólista/Limit":"231/0/300","Órarend infó":"H:08:00-10:35 (BA.1.32.Audmax)","Oktatók":"Dr. Szénási Sándor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":true}},"Haladó szoftverfejlesztés * (NSXHSFHBNF)Mintatanterv:#NIK Mérnökinformatikus Nappali Bsc (F-tanterv)":{"HSZF_EA":{"metadata":{"":"HSZF_EA","Kurzus kódja":"HSZF_EA","Kurzus típusa":"Elmélet","Fő/Várólista/Limit":"326/0/336","Órarend infó":"H:20:25-22:00","Oktatók":"Molnár Attila, Dr. Vámossy Zoltán Imre","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":true},"HSZF_LA01":{"metadata":{"":"HSZF_LA01","Kurzus kódja":"HSZF_LA01","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"SZE:08:00-11:30 (BA.1.14)","Oktatók":"Molnár Attila","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"HSZF_LA02":{"metadata":{"":"HSZF_LA02","Kurzus kódja":"HSZF_LA02","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"SZE:08:00-11:30 (BA.1.14)","Oktatók":"Molnár Attila","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"HSZF_LA03":{"metadata":{"":"HSZF_LA03","Kurzus kódja":"HSZF_LA03","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"H:14:25-17:50 (BA.1.13)","Oktatók":"Dr. Simon-Nagy Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"HSZF_LA04":{"metadata":{"":"HSZF_LA04","Kurzus kódja":"HSZF_LA04","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"H:14:25-17:50 (BA.1.13)","Oktatók":"Dr. Simon-Nagy Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"HSZF_LA05":{"metadata":{"":"HSZF_LA05","Kurzus kódja":"HSZF_LA05","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:09:50-13:20 (BA.2.14)","Oktatók":"Egres Kata","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":true},"HSZF_LA06":{"metadata":{"":"HSZF_LA06","Kurzus kódja":"HSZF_LA06","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:09:50-13:20 (BA.2.14)","Oktatók":"Egres Kata","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"HSZF_LA07":{"metadata":{"":"HSZF_LA07","Kurzus kódja":"HSZF_LA07","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:15:20-18:40 (BA.1.13)","Oktatók":"Haydu Lénárt","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"HSZF_LA08":{"metadata":{"":"HSZF_LA08","Kurzus kódja":"HSZF_LA08","Kurzus típusa":"Labor","Fő/Várólista/Limit":"14/0/24","Órarend infó":"CS:15:20-18:40 (BA.1.13)","Oktatók":"Molnár Attila","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"HSZF_LA09":{"metadata":{"":"HSZF_LA09","Kurzus kódja":"HSZF_LA09","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"SZE:08:55-12:25 (BA.1.15)","Oktatók":"Mikhel Roland","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"HSZF_LA10":{"metadata":{"":"HSZF_LA10","Kurzus kódja":"HSZF_LA10","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"SZE:08:55-12:25 (BA.1.15)","Oktatók":"Mikhel Roland","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"HSZF_LA11":{"metadata":{"":"HSZF_LA11","Kurzus kódja":"HSZF_LA11","Kurzus típusa":"Labor","Fő/Várólista/Limit":"0/0/0","Órarend infó":"","Oktatók":"","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false}},"Számítógép hálózatok (NKXSH1HBNF)Mintatanterv:#NIK Mérnökinformatikus Nappali Bsc (F-tanterv)":{"SzGH_EA":{"metadata":{"":"SzGH_EA","Kurzus kódja":"SzGH_EA","Kurzus típusa":"Elmélet","Fő/Várólista/Limit":"318/0/336","Órarend infó":"SZE:12:35-14:15 (BA.1.32.Audmax)","Oktatók":"Zaletnyik Péter Tibor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":true},"SzGH_LA_01":{"metadata":{"":"SzGH_LA_01","Kurzus kódja":"SzGH_LA_01","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"H:10:45-12:25 (BA.2.14)","Oktatók":"Légrádi Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"SzGH_LA_02":{"metadata":{"":"SzGH_LA_02","Kurzus kódja":"SzGH_LA_02","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"H:12:35-14:15 (BA.2.14)","Oktatók":"Légrádi Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"SzGH_LA_03":{"metadata":{"":"SzGH_LA_03","Kurzus kódja":"SzGH_LA_03","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"H:14:25-16:05 (BA.2.14)","Oktatók":"Légrádi Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"SzGH_LA_04":{"metadata":{"":"SzGH_LA_04","Kurzus kódja":"SzGH_LA_04","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:09:50-11:30 (BA.1.14)","Oktatók":"Légrádi Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"SzGH_LA_05":{"metadata":{"":"SzGH_LA_05","Kurzus kódja":"SzGH_LA_05","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:11:40-13:20 (BA.1.14)","Oktatók":"Légrádi Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"SzGH_LA_06":{"metadata":{"":"SzGH_LA_06","Kurzus kódja":"SzGH_LA_06","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:13:30-15:10 (BA.1.14)","Oktatók":"Légrádi Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"SzGH_LA_07":{"metadata":{"":"SzGH_LA_07","Kurzus kódja":"SzGH_LA_07","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:17:05-18:40 (BA.1.14)","Oktatók":"Szabó Patrik László","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":true},"SzGH_LA_08":{"metadata":{"":"SzGH_LA_08","Kurzus kódja":"SzGH_LA_08","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:08:00-09:40 (BA.1.14)","Oktatók":"Zaletnyik Péter Tibor","Nyelv":"magyar","Telephely":"","Megj.":"Csizmadia Gábor demo kurzus","Leírás":""},"checked":false},"SzGH_LA_09":{"metadata":{"":"SzGH_LA_09","Kurzus kódja":"SzGH_LA_09","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"SZE:14:25-16:05 (BA.1.15)","Oktatók":"Zaletnyik Péter Tibor","Nyelv":"magyar","Telephely":"","Megj.":"Gazdag Dominika demo kurzus","Leírás":""},"checked":false},"SzGH_LA_10":{"metadata":{"":"SzGH_LA_10","Kurzus kódja":"SzGH_LA_10","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"K:08:55-10:35 (BA.2.14)","Oktatók":"Zaletnyik Péter Tibor","Nyelv":"magyar","Telephely":"","Megj.":"Vaszkó Attila demo kurzus","Leírás":""},"checked":false},"SzGH_LA_11":{"metadata":{"":"SzGH_LA_11","Kurzus kódja":"SzGH_LA_11","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"K:14:25-16:05 (BA.1.15)","Oktatók":"Zaletnyik Péter Tibor","Nyelv":"magyar","Telephely":"","Megj.":"Miskolczi Richárd demo kurzus","Leírás":""},"checked":false},"SzGH_LA_12":{"metadata":{"":"SzGH_LA_12","Kurzus kódja":"SzGH_LA_12","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"K:18:45-20:20 (BA.1.15)","Oktatók":"Zaletnyik Péter Tibor","Nyelv":"magyar","Telephely":"","Megj.":"Bod Gergely demo kurzus","Leírás":""},"checked":false},"SzGH_LA_13":{"metadata":{"":"SzGH_LA_13","Kurzus kódja":"SzGH_LA_13","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"SZE:08:15-09:40 (BA.2.14)","Oktatók":"Zaletnyik Péter Tibor","Nyelv":"magyar","Telephely":"","Megj.":"Petkó Csaba demo kurzus","Leírás":""},"checked":false},"SzH_ÜM_LA_02":{"metadata":{"":"SzH_ÜM_LA_02","Kurzus kódja":"SzH_ÜM_LA_02","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"SZE:17:05-18:40 (BA.1.13)","Oktatók":"Szabó Patrik László","Nyelv":"magyar","Telephely":"","Megj.":"Horváth Zsombor demo kurzus","Leírás":""},"checked":false},"SzH_ÜM_LA_03":{"metadata":{"":"SzH_ÜM_LA_03","Kurzus kódja":"SzH_ÜM_LA_03","Kurzus típusa":"Labor","Fő/Várólista/Limit":"5/0/24","Órarend infó":"SZE:18:45-20:20 (BA.1.13)","Oktatók":"Szabó Patrik László","Nyelv":"magyar","Telephely":"","Megj.":"Horváth Zsombor demo kurzus","Leírás":"Csak Szoftver specializációs hallgatóknak!"},"checked":false},"SzGH_SLG_EA":{"metadata":{"":"SzGH_SLG_EA","Kurzus kódja":"SzGH_SLG_EA","Kurzus típusa":"Elmélet","Fő/Várólista/Limit":"0/0/24","Órarend infó":"","Oktatók":"","Nyelv":"magyar","Telephely":"","Megj.":"Horváth Zsombor demo kurzus","Leírás":""},"checked":false},"SzGH_SLG_LA":{"metadata":{"":"SzGH_SLG_LA","Kurzus kódja":"SzGH_SLG_LA","Kurzus típusa":"Labor","Fő/Várólista/Limit":"0/0/24","Órarend infó":"","Oktatók":"","Nyelv":"magyar","Telephely":"","Megj.":"Horváth Zsombor demo kurzus","Leírás":""},"checked":false},"SzGH_LA_14":{"metadata":{"":"SzGH_LA_14","Kurzus kódja":"SzGH_LA_14","Kurzus típusa":"Labor","Fő/Várólista/Limit":"1/0/10","Órarend infó":"","Oktatók":"","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false}},"Analízis II. (NMXAN2HBNF)Mintatanterv:#NIK Mérnökinformatikus Nappali Bsc (F-tanterv)":{"ANAL_EA":{"metadata":{"":"ANAL_EA","Kurzus kódja":"ANAL_EA","Kurzus típusa":"Elmélet","Fő/Várólista/Limit":"229/0/300","Órarend infó":"K:12:35-14:15 (BA.1.32.Audmax)","Oktatók":"Dr. Vajda István","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":true},"ANAL_GY_01":{"metadata":{"":"ANAL_GY_01","Kurzus kódja":"ANAL_GY_01","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"25/0/25","Órarend infó":"K:14:25-16:05 (BA.F.06)","Oktatók":"Dr. Vajda István","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"ANAL_GY_02":{"metadata":{"":"ANAL_GY_02","Kurzus kódja":"ANAL_GY_02","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"25/0/25","Órarend infó":"CS:10:45-12:25 (BC.4.401)","Oktatók":"Dr. György Anna","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"ANAL_GY_03":{"metadata":{"":"ANAL_GY_03","Kurzus kódja":"ANAL_GY_03","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"25/0/25","Órarend infó":"P:08:55-10:35 (BA.F.07)","Oktatók":"Berta Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"ANAL_GY_04":{"metadata":{"":"ANAL_GY_04","Kurzus kódja":"ANAL_GY_04","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"25/0/25","Órarend infó":"P:10:45-12:25 (BA.F.07)","Oktatók":"Berta Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":true},"ANAL_GY_05":{"metadata":{"":"ANAL_GY_05","Kurzus kódja":"ANAL_GY_05","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"25/0/25","Órarend infó":"H:11:40-13:20 (BA.F.07)","Oktatók":"Hegedüs Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"ANAL_GY_06":{"metadata":{"":"ANAL_GY_06","Kurzus kódja":"ANAL_GY_06","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"15/0/25","Órarend infó":"K:15:20-17:00 (BA.F.07)","Oktatók":"Hegedüs Gábor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"ANAL_GY_07":{"metadata":{"":"ANAL_GY_07","Kurzus kódja":"ANAL_GY_07","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"26/0/26","Órarend infó":"K:08:00-09:40 (BA.F.07)","Oktatók":"Záborszky Ágnes Zsuzsanna","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"Ez a kurzus nem indul!":{"metadata":{"":"Ez a kurzus nem indul!","Kurzus kódja":"Ez a kurzus nem indul!","Kurzus típusa":"Ez a kurzus nem indul!","Fő/Várólista/Limit":"Ez a kurzus nem indul!","Órarend infó":"Ez a kurzus nem indul!","Oktatók":"Ez a kurzus nem indul!","Nyelv":"Ez a kurzus nem indul!","Telephely":"Ez a kurzus nem indul!","Megj.":"","Leírás":"Ez a kurzus nem indul!"},"checked":false},"ANAL_GY_09":{"metadata":{"":"ANAL_GY_09","Kurzus kódja":"ANAL_GY_09","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"25/0/25","Órarend infó":"CS:15:20-17:00 (BA.F.04)","Oktatók":"Dr. Cserjés Ágota Rita","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"ANAL_GY_10":{"metadata":{"":"ANAL_GY_10","Kurzus kódja":"ANAL_GY_10","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"26/0/26","Órarend infó":"H:10:45-12:25 (BC.4.403)","Oktatók":"Szabó László Attila","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"A kurzusra a jelentkezés letiltásra került.":{"metadata":{"":"A kurzusra a jelentkezés letiltásra került.","Kurzus kódja":"A kurzusra a jelentkezés letiltásra került.","Kurzus típusa":"A kurzusra a jelentkezés letiltásra került.","Fő/Várólista/Limit":"A kurzusra a jelentkezés letiltásra került.","Órarend infó":"A kurzusra a jelentkezés letiltásra került.","Oktatók":"A kurzusra a jelentkezés letiltásra került.","Nyelv":"A kurzusra a jelentkezés letiltásra került.","Telephely":"A kurzusra a jelentkezés letiltásra került.","Megj.":"","Leírás":"A kurzusra a jelentkezés letiltásra került."},"checked":false}},"Tutorálás (NBXTUTHBNF)Mintatanterv:#NIK Mérnökinformatikus Nappali Bsc (F-tanterv)":{"Ez a kurzus nem indul!":{"metadata":{"":"Ez a kurzus nem indul!","Kurzus kódja":"Ez a kurzus nem indul!","Kurzus típusa":"Ez a kurzus nem indul!","Fő/Várólista/Limit":"Ez a kurzus nem indul!","Órarend infó":"Ez a kurzus nem indul!","Oktatók":"Ez a kurzus nem indul!","Nyelv":"Ez a kurzus nem indul!","Telephely":"Ez a kurzus nem indul!","Megj.":"","Leírás":"Ez a kurzus nem indul!"},"checked":false},"TU_GY_01_Lifecoach":{"metadata":{"":"TU_GY_01_Lifecoach","Kurzus kódja":"TU_GY_01_Lifecoach","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"56/0/150","Órarend infó":"","Oktatók":"Lazányi Kornélia Rozália","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"TU_GY_02_Demonstrátor":{"metadata":{"":"TU_GY_02_Demonstrátor","Kurzus kódja":"TU_GY_02_Demonstrátor","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"25/0/30","Órarend infó":"","Oktatók":"Zaletnyik Péter Tibor","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":true},"TU_GY_03_Projekt":{"metadata":{"":"TU_GY_03_Projekt","Kurzus kódja":"TU_GY_03_Projekt","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"38/0/200","Órarend infó":"","Oktatók":"Tafferner-Gulyás Viktória","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"TU_GY_04_Csop.vez":{"metadata":{"":"TU_GY_04_Csop.vez","Kurzus kódja":"TU_GY_04_Csop.vez","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"23/0/100","Órarend infó":"","Oktatók":"Lazányi Kornélia Rozália","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false}},"Fizika (KTXFIBHBNF)Mintatanterv:#NIK Mérnökinformatikus Nappali Bsc (F-tanterv)":{"Fiz_EA":{"metadata":{"":"Fiz_EA","Kurzus kódja":"Fiz_EA","Kurzus típusa":"E-Learning","Fő/Várólista/Limit":"203/0/236","Órarend infó":"CS:17:55-19:30 (BA.1.32.Audmax)","Oktatók":"Dr. Rácz Ervin, Dr. Bencze Attila István","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":true},"Fiz_Gy_01":{"metadata":{"":"Fiz_Gy_01","Kurzus kódja":"Fiz_Gy_01","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"48/0/48","Órarend infó":"","Oktatók":"Dr. Bencze Attila István","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"Fiz_Gy_02":{"metadata":{"":"Fiz_Gy_02","Kurzus kódja":"Fiz_Gy_02","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"48/0/48","Órarend infó":"","Oktatók":"Dr. Bencze Attila István","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":true},"Fiz_Gy_03":{"metadata":{"":"Fiz_Gy_03","Kurzus kódja":"Fiz_Gy_03","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"37/0/70","Órarend infó":"","Oktatók":"Dr. Bencze Attila István","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"Fiz_Gy_04":{"metadata":{"":"Fiz_Gy_04","Kurzus kódja":"Fiz_Gy_04","Kurzus típusa":"Gyakorlat","Fő/Várólista/Limit":"70/0/70","Órarend infó":"","Oktatók":"Dr. Bencze Attila István","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false}},"Digitális rendszerek (NKXDR1HBNF)Mintatanterv:#NIK Mérnökinformatikus Nappali Bsc (F-tanterv)":{"DR1_EA":{"metadata":{"":"DR1_EA","Kurzus kódja":"DR1_EA","Kurzus típusa":"Elmélet","Fő/Várólista/Limit":"288/0/312","Órarend infó":"K:10:45-12:25 (BA.1.32.Audmax)","Oktatók":"Dr. Komoróczki-Steiner Henriette","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":true},"DR1_LA_01":{"metadata":{"":"DR1_LA_01","Kurzus kódja":"DR1_LA_01","Kurzus típusa":"Labor","Fő/Várólista/Limit":"23/0/24","Órarend infó":"H:10:45-12:25 (BA.2.18)","Oktatók":"Dr. Komoróczki-Steiner Henriette","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"DR1_LA_02":{"metadata":{"":"DR1_LA_02","Kurzus kódja":"DR1_LA_02","Kurzus típusa":"Labor","Fő/Várólista/Limit":"19/0/24","Órarend infó":"H:12:35-14:15 (BA.2.18)","Oktatók":"Dr. Komoróczki-Steiner Henriette","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"DR1_LA_03":{"metadata":{"":"DR1_LA_03","Kurzus kódja":"DR1_LA_03","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"K:08:55-10:35 (BA.2.18)","Oktatók":"Dr. Komoróczki-Steiner Henriette","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"DR1_LA_04":{"metadata":{"":"DR1_LA_04","Kurzus kódja":"DR1_LA_04","Kurzus típusa":"Labor","Fő/Várólista/Limit":"6/0/24","Órarend infó":"H:16:15-17:50 (BA.2.18)","Oktatók":"Dr. Komoróczki-Steiner Henriette","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"DR1_LA_05":{"metadata":{"":"DR1_LA_05","Kurzus kódja":"DR1_LA_05","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:08:00-09:40 (BA.2.18)","Oktatók":"Zakár István","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"DR1_LA_06":{"metadata":{"":"DR1_LA_06","Kurzus kódja":"DR1_LA_06","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:09:50-11:30 (BA.2.18)","Oktatók":"Zakár István","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"DR1_LA_07":{"metadata":{"":"DR1_LA_07","Kurzus kódja":"DR1_LA_07","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"K:14:25-16:05 (BA.2.18)","Oktatók":"Somlyai László","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"DR1_LA_08":{"metadata":{"":"DR1_LA_08","Kurzus kódja":"DR1_LA_08","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"K:16:15-17:50 (BA.2.18)","Oktatók":"Somlyai László","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"DR1_LA_09":{"metadata":{"":"DR1_LA_09","Kurzus kódja":"DR1_LA_09","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"K:17:55-19:30 (BA.2.18)","Oktatók":"Somlyai László","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"DR1_LA_10":{"metadata":{"":"DR1_LA_10","Kurzus kódja":"DR1_LA_10","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:11:40-13:20 (BA.2.18)","Oktatók":"Somlyai László","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"DR1_LA_11":{"metadata":{"":"DR1_LA_11","Kurzus kódja":"DR1_LA_11","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:13:30-15:10 (BA.2.18)","Oktatók":"Somlyai László","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"DR1_LA_12":{"metadata":{"":"DR1_LA_12","Kurzus kódja":"DR1_LA_12","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"CS:15:20-17:00 (BA.2.18)","Oktatók":"Somlyai László","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"DR1_LA_13":{"metadata":{"":"DR1_LA_13","Kurzus kódja":"DR1_LA_13","Kurzus típusa":"Labor","Fő/Várólista/Limit":"24/0/24","Órarend infó":"P:12:35-14:15 (BA.2.18)","Oktatók":"Zakár István","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":true},"DR1_EA_SLG":{"metadata":{"":"DR1_EA_SLG","Kurzus kódja":"DR1_EA_SLG","Kurzus típusa":"Elmélet","Fő/Várólista/Limit":"0/0/24","Órarend infó":"","Oktatók":"Dr. Komoróczki-Steiner Henriette","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false},"DR1_LA_SLG":{"metadata":{"":"DR1_LA_SLG","Kurzus kódja":"DR1_LA_SLG","Kurzus típusa":"Labor","Fő/Várólista/Limit":"0/0/24","Órarend infó":"","Oktatók":"Fekete György","Nyelv":"magyar","Telephely":"","Megj.":"","Leírás":""},"checked":false}}};


    const windowCourses = (history.state /*as { courses?: Record<string, Record<string, {checked: boolean, metadata: Record<string, string>}>> }*/);

    if(!windowCourses) {
        console.warn('Using test course data');
    }
    const coursesRaw = windowCourses || testCoursesRaw;


    const courses = [];

    for(const [subject, coursesObj] of Object.entries(coursesRaw)) {
        for(const [courseCode, properties] of Object.entries(coursesObj)) {
            const timetableInfo = properties.metadata["Órarend infó"];
            const match = timetableInfo.match(/^(\w+):(\d+:\d+)-(\d+:\d+)/);
            if(!match) {
                continue;
            }
            const [ , day, startString, endString] = match;
            const startTime = time(...startString.split(':').map(Number) as [number, number]);
            const endTime = time(...endString.split(':').map(Number) as [number, number]);

            courses.push({
                start: startTime,
                end: endTime,
                properties: {
                    Nap: day,
                    subject,
                    Tárgy: subject.match(/^[\w\s]*/)?.[0] || subject,
                    checked: properties.checked,
                    code: courseCode,
                    ...properties.metadata
                }
            });
        }
    }

    const grid = document.querySelector('#timetable-column')! as HTMLElement;
    renderTimetableGrid(grid, courses, [
        {
            group(courses) {
                const out: CourseGroup[] = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'].map(n => ({
                    header: n,
                    courses: []
                }));

                const days = ['H', 'K', 'SZE', 'CS', 'P', 'SZO', 'V'];

                for(const course of courses) {
                    const idx = days.indexOf(String(course.properties.Nap));

                    if(idx === -1) {
                        continue;
                    }

                    out[idx].courses.push(course);
                }

                return out;
            },
        }]);
}

document.addEventListener('DOMContentLoaded', main);

function renderTimetableGrid(grid: HTMLElement, courses: Course[], groupByKeys: GroupSelector[]) {
    const timeMap = createTimeMap(courses);
    const templateRowHeights = renderTimeMarkerColumn(grid, timeMap, groupByKeys.length);

    const headerTemplateRowHeights = groupByKeys.map(() => 'min-content').join(' ');
    grid.style.gridTemplateRows = `${headerTemplateRowHeights} ${templateRowHeights}`;

    const [width, templateColWidths] = renderCoursesWithHeader(grid, courses, groupByKeys, timeMap, 1, 0);

    renderHorizontalLines(grid, timeMap.size, 0, width + 1, groupByKeys.length);

    grid.style.gridTemplateColumns = ['fit-content(1fr)', templateColWidths].join(' ');

        
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

            elem.textContent = createMonogram(String(course.properties.Oktatók));

            elem.classList.add('course');

            setCoursePositionInGrid(elem, course, timeMap, laneMap, colOffset, rowOffset);

            grid.append(elem);

            colWidths.push('fit-content(1fr)');
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

    function renderCoursesWithHeader(grid: HTMLElement, courses: Course[], groupByKeys: GroupSelector[], timeMap: Map<number, number>, startColumn: number, startRow: number): [number, string] {
        if(groupByKeys.length === 0) {

            const [laneCount, laneMap] = assignToLanes(courses);

            const templateColWidths = renderCourseGroup(grid, courses, timeMap, laneMap, startColumn, startRow);

            return [laneCount, templateColWidths];
        } else {
            const [key, ...newGroupByKeys] = groupByKeys;

            const groups = key.group(courses);
            
            let columns = 0;
            const templateColWidths = [];
            for(const {header, courses: group} of groups) {

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
        for(let i = 0; i < lineCount; i++) {
            const horizontalLine = createElement(grid);
            setPositionInGrid(horizontalLine, startColumn, endColumn, startRow + i, startRow + i + 1);
            horizontalLine.classList.add('horizontal-line');
        }
    }

}

type GroupSelector = {
    group(courses: Course[]): CourseGroup[]
}

type CourseGroup = {
    header: string,
    courses: Course[],
}