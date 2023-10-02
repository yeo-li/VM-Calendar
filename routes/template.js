import * as lm from './LeaveManagement.js';
import createCalendarHTML from "./allNewCalendar.js";
import * as ls from './DBLoaderSaver.js';
export async function main(year, month, url){
    await ls.loadFile();
    const rendered = await createCalendarHTML(new Date(year, month-1, 1));
    const renderedLeaveTable = await leaveTable();

    return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Calendar</title>
        
        <style>
            .today {
            background-color: #ffec88;
            }
            .leave {
            background-color: lightgreen;
            }
            .issued {
            background-color: yellow;
            }
        </style>
        <!--
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
        -->
      </head>
      <body>
        <div class="container">
        <a href = '${url}/prev_process'>prev</a>
        <a href="/">home</a>
        <a href = '${url}/next_process'>next</a>
            ${rendered}
        </div>
        
        <div class="leaveTable">
        <hr>
            ${renderedLeaveTable}
        </div>
        
        <hr>
        
        <div class="scheduledLeaveTable">
            ${await scheduledLeaveTable()}
        </div>
      
      <!--          
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
      -->
      </body>
    </html>
    `;
}

async function leaveTable() {
    return `
    <form action="/update_takenLeaves" method="post">
        <table border="2" align="center">
            <th>휴가</th>
            <th>획득</th>
            <th>사용</th>
            <th>잔여</th>
            <tr class="scheduledLeave">
                <td>정기</td>
                <td>${await lm.getAccruedLeaveDays("scheduledLeave")}</td>
                <td><input type="text" style="width: 25px" value=${lm.getTakenLeaveDays("scheduledLeave")} 
                name="scheduledLeave"></td>
                <td>${await lm.getRemainingLeaveDays("scheduledLeave")}</td>
            </tr>
            <tr class="stressManagementLeave">
                <td>위로</td>
                <td>${await lm.getAccruedLeaveDays("stressManagementLeave")}</td>
                <td><input type="text" style="width: 25px" value=${lm.getTakenLeaveDays("stressManagementLeave")} 
                name="stressManagementLeave"></td>
                <td>${await lm.getRemainingLeaveDays("stressManagementLeave")}</td>
            </tr>
            <tr class="incentiveLeave">
                <td>포상</td>
                <td>${await lm.getAccruedLeaveDays("incentiveLeave")}</td>
                <td><input type="text" style="width: 25px" value=${await lm.getTakenLeaveDays("incentiveLeave")} 
                name="incentiveLeave"></td>
                <td>${await lm.getRemainingLeaveDays("incentiveLeave")}</td>
            </tr>
            <tr class="annualLeave">
                <td>연가</td>
                <td>${await lm.getAccruedLeaveDays("annualLeave")}</td>
                <td><input type="text" style="width: 25px" value=${lm.getTakenLeaveDays("annualLeave")} 
                name="annualLeave"></td>
                <td>${await lm.getRemainingLeaveDays("annualLeave")}</td>
            </tr>
            <tr class="petitionLeave">
                <td>청원</td>
                <td>${await lm.getAccruedLeaveDays("petitionLeave")}</td>
                <td><input type="text" style="width: 25px" value=${lm.getTakenLeaveDays("petitionLeave")} 
                name="petitionLeave"></td>
                <td>${await lm.getRemainingLeaveDays("petitionLeave")}</td>
            </tr>
            <tr>
                <td>총합</td>
                <td>${await lm.getTotalAccruedLeaveDays()}</td>
                <td>${await lm.getTotalTakenLeaveDays()}</td>
                <td>${await lm.getTotalRemainingLeaveDays()}</td>
            </tr>
        </table>

        <input type="submit" value="save leave table">
    </form>

    `
}

async function scheduledLeaveTable(){
    const scheduledLeaves = ls.LeaveManagementDB.aboutAccruedLeaveDays.find(e => e.classification === "scheduledLeave").details;
    let html = `<table border="1px" align="center">
    <thead>
    <th>외박</th>
    <th>발급일</th>
    <th>수량</th>
    </thead>
    <tbody>`;

    for(const leave of scheduledLeaves){
        const date = leave.DateOfIssuance;
        const days = leave.days;
        const index = scheduledLeaves.indexOf(leave) + 1;
        let Class = '';

        if(lm.isLeaveIssued(leave)){
            Class = 'issued';
        }

        html += `<tr class="${Class}">
            <td>제 ${index}차 성과제</td>
            <td>${date}</td>
            <td>${days}일</td>
        </tr>`;
    }

    html+='</tbody></table>';

    return html;
}

export async function updateMain(year, month, url){

}