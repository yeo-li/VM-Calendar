import * as calendar from "./allNewCalendar.js";
import * as ls from './DBLoaderSaver.js';
import * as ml from './ManagementLeaveDB.js'
import {getAcquiredLeaveArray} from "./ManagementLeaveDB.js";

async function navigationBar(){
    return `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <a class="navbar-brand" href="/TESTPAGE"><h3>휴가 언제야</h3></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link active" id="add-pathname" aria-current="page" href="#">Edit Calendar</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Add Leaves</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="https://www.notion.so/a258a9fe4c0f46ab8494f6910539faf9">Couple Notion</a>
                </li>
            </ul>
        </div>
    </div>
</nav>`;
}

async function header(year, month, url){
    return `
<div class="container">
    <div><a class="btn" href = '${url}/prev_process'><h1>&lt</h1></a></div>
    ${calendar.calendarTitle(year, month)}
    <div><a class="btn" href = '${url}/next_process' ><h1>&gt</h1></a></div>
</div>`;
}

export async function html(year, month, url, template){
    return `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/css/style.css">
    <title>휴가언제야</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>
<body>
    ${await navigationBar()}
    ${await header(year, month, url)}
    ${template}
    
    <a class="btn" href="#" id="leaveStatusTableToggle">▼ 휴가 현황 표</a>
    <div class="container" id="leaveStatusTable" style="display: none">${await leaveStatusTable()}</div>
    
    <a class="btn" href="#" id="leaveTableToggle">▼ Leave Table</a>
    <div class="container" id="leaveTable" style="display: none">${await leaveTable()}</div>
    
<script src="/script/pathnameAdder.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
</body>
</html>
    `;
}

export async function main(year, month, url){
    await ls.loadFile();
    return await calendar.createCalendarHTML(new Date(year, month-1, 1), url);

}
export async function mainForEdit(year, month){
    await ls.loadFile();
    return await calendar.createCalendarHTMLForEdit(new Date(year, month-1, 1));

}

export async function leaveTable(){
    await ls.loadFile();
    //const scheduledLeave = await ml.getLeaveArray("외박");
    const leaves = ls.LeaveDB;
    let html = `<table class="table table-bordered">
        <thead class="table-light">
            <th>외박</th>
            <th>발급일</th>
            <th>일수</th>
        </thead><tbody>
`;

    for(const leave of leaves){
        let Class = ``;
        if(leave.isUsed){
            Class = `table-secondary`;
        }else if(ml.isAcquiredLeaveAvailable(leave)){
            Class = `table-info`;
        }


        html += `<tr class="${Class}">
            <td>${leave.name}</td>
            <td>${leave.dateOfIssuance}</td>
            <td>${leave.days}</td>
        </tr>`;
    }

    html += '</tbody></table>';

    return html;
}

export async function leaveStatusTable(){
    await ls.loadFile();
    let html = `<table class="table table-bordered" id="leaveStatusTable">
        <thead class="table-light">
        <th>휴가</th>
        <th>획득</th>
        <th>사용</th>
        <th>잔여</th>
</thead><tbody>`;
    const leaveArray = ['외박', '위로', '연가', '포상', '청원'];
    let acquiredLeave = 0;
    let usedLeave = 0;
    let remainedLeave = 0;
    for(const leave of leaveArray){
        html += `
            <tr>
                <td>${leave}</td>
                <td>${ml.countLeaveDays(await ml.getAcquiredLeaveArray(leave))}</td>
                <td>${ml.countLeaveDays(await ml.getUsedLeaveArray(leave))}</td>
                <td>${ml.countLeaveDays(await ml.getUnusedAndAcquiredLeaveArray(leave))}</td>
            </tr>
        `;

        acquiredLeave += ml.countLeaveDays(await ml.getAcquiredLeaveArray(leave));
        usedLeave += ml.countLeaveDays(await ml.getUsedLeaveArray(leave));
        remainedLeave += ml.countLeaveDays(await ml.getUnusedAndAcquiredLeaveArray(leave));
    }




    html += `
        <tr>
        <td>총</td>
        <td>${acquiredLeave}</td>
        <td>${usedLeave}</td>
        <td>${remainedLeave}</td>
</tr>
        
    
</tbody></table>`;

    return html;
}