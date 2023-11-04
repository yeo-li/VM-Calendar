import * as calendar from "./allNewCalendar.js";
import * as ls from './DBLoaderSaver.js';
import * as ml from './ManagementLeaveDB.js'
import {getAcquiredLeaveArray} from "./ManagementLeaveDB.js";

async function navigationBar(){
    return `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <a class="navbar-brand" href="/whenisyourleave"><h3>휴가 언제야</h3></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link active" id="add-pathname" aria-current="page" href="#">Edit Work Schedule</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" href="/whenisyourleave/NewLeave">Add New Leave</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" href="/whenisyourleave/leave/remove">Remove Leave</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" href="https://www.notion.so/a258a9fe4c0f46ab8494f6910539faf9">Couple Notion</a>
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

export async function clearHTML(template){
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
    <div id="main">${template}
    <a class="btn" href="#" id="leaveStatusTableToggle">▼ 휴가 현황 표</a>
    <div class="container" id="leaveStatusTable" style="display: none">${await leaveStatusTable()}</div>
    
    <a class="btn" href="#" id="leaveTableToggle">▼ Leave Table</a>
    <div class="container" id="leaveTable1" style="display: none">${await leaveTable()}</div>
    </div>
    
    <div class="modal-dialog modal-dialog-centered" id="modal" ></div>
<script src="/script/pathnameAdder.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
</body>
</html>
    `;
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
    <div id="main">
    ${await header(year, month, url)}
    ${template}
    
    <a class="btn" href="#" id="leaveStatusTableToggle">▼ 휴가 현황 표</a>
    <div class="container" id="leaveStatusTable" style="display: none">${await leaveStatusTable()}</div>
    
    <a class="btn" href="#" id="leaveTableToggle">▼ Leave Table</a>
    <div class="container" id="leaveTable1" style="display: none">${await leaveTable()}</div>
    </div>
    
<div class="modal fade" id="exampleModalCenter" tabindex="-1" aria-labelledby="exampleModalCenterTitle" style="display: none;" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle"> Menu </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div id="modal" class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
    
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
                <td>${ml.countLeaveDays(await ml.getLeaveArray(leave))}</td>
                <td>${ml.countLeaveDays(await ml.getUsedLeaveArray(leave))}</td>
                <td>${ml.countLeaveDays(await ml.getLeaveArray(leave)) - ml.countLeaveDays(await ml.getUsedLeaveArray(leave))}</td>
            </tr>
        `;

        acquiredLeave += ml.countLeaveDays(await ml.getLeaveArray(leave));
        usedLeave += ml.countLeaveDays(await ml.getUsedLeaveArray(leave));
        remainedLeave += (ml.countLeaveDays(await ml.getLeaveArray(leave)) - ml.countLeaveDays(await ml.getUsedLeaveArray(leave)));
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

export async function addNewVacation(){
    return `   <h2>add new leave page</h2> <hr>
    <form action="/whenisyourleave/NewLeave/add" method="post">
        <p>휴가 종류: <select name="classification">
            <option>외박</option>
            <option>연가</option>
            <option>위로</option>
            <option>포상</option>
            <option>청원</option>
        </select></p>
        
        <p>휴가 발급일: <input type="date" name="dateOfIssuance"></p>

        <p>휴가명: <input type="text" name="name"></p>

        <p>일 수: <input type="number" name="days"></p>

        <input type="submit" value="add">
    </form>`;
}

export async function searchVacation(url, date){
    return `
        <form action="${url}" method="get">
        <input type="hidden" value="${date}" name="date">
        휴가 종류:
        <select name="classification">
        <option>--선택--</option>
        <option value="외박">외박</option>
        <option value="위로">위로</option>
        <option value="연가">연가</option>
        <option value="포상">포상</option>
        <option value="청원">청원</option>
</select>
        <input type="submit" value="search">
    </form>
    `
}

export async function submitBtn(value){
    return `<button type="submit" form="leaveTable">${value}</button>`;
}

export async function searchLeaveTable(actionURL, classification, date, checkType){
    await ls.loadFile();
    const leaves = await ml.getLeaveArray(classification);
    //const leaves = ls.LeaveDB;
    let html = `
        <form action="${actionURL}" method="post" id="leaveTable">
        <input type="hidden" value="${date}" name="date">
        <table class="table table-bordered">
        <thead class="table-light">
            <th>순번</th>
            <th>휴가명</th>
            <th>일 수</th>
            <th>선택</th>
        </thead><tbody>
`;

    for(let i = 0; i < leaves.length; i++){
        const dateOfIssuance = new Date(leaves[i].dateOfIssuance);
        const DATE = new Date(date);
        console.log(dateOfIssuance, DATE);
        if(leaves[i].isUsed || DATE <= dateOfIssuance){
            continue;
        }
        html += `<tr>
            <td>${i+1}</td>
            <td>${leaves[i].name}</td>
            <td>${leaves[i].days}</td>
            <td><input type="${checkType}" name="isChecked" value="${leaves[i].name}"></td>
        </tr>`;
    }

    html += '</tbody></table></form>';

    return html;
}