import renderCalendar from '../publics/calendar.js';
import * as renderLeave from './LeaveManagement.js';
import rendCalendar from "./allNewCalendar.js";
import * as ls from './loadAndSaveData.js';
export async function main(year, month, url){
    await ls.loadFile();
    const rendered = await rendCalendar(year, month, 1);
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
        </style>
        <!--
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
        -->
      </head>
      <body>
        <div class="container">
            ${rendered}
        </div>
        
        <div class="leaveTable">
            ${renderedLeaveTable}
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
                <td>${await renderLeave.getAccruedLeaveDays("scheduledLeave")}</td>
                <td><input type="text" style="width: 25px" value=${renderLeave.getTakenLeaveDays("scheduledLeave")} 
                name="scheduledLeave"></td>
                <td>${await renderLeave.getRemainingLeaveDays("scheduledLeave")}</td>
            </tr>
            <tr class="stressManagementLeave">
                <td>위로</td>
                <td>${await renderLeave.getAccruedLeaveDays("stressManagementLeave")}</td>
                <td><input type="text" style="width: 25px" value=${renderLeave.getTakenLeaveDays("stressManagementLeave")} 
                name="stressManagementLeave"></td>
                <td>${await renderLeave.getRemainingLeaveDays("stressManagementLeave")}</td>
            </tr>
            <tr class="incentiveLeave">
                <td>포상</td>
                <td>${await renderLeave.getAccruedLeaveDays("incentiveLeave")}</td>
                <td><input type="text" style="width: 25px" value=${await renderLeave.getTakenLeaveDays("incentiveLeave")} 
                name="incentiveLeave"></td>
                <td>${await renderLeave.getRemainingLeaveDays("incentiveLeave")}</td>
            </tr>
            <tr class="annualLeave">
                <td>연가</td>
                <td>${await renderLeave.getAccruedLeaveDays("annualLeave")}</td>
                <td><input type="text" style="width: 25px" value=${renderLeave.getTakenLeaveDays("annualLeave")} 
                name="annualLeave"></td>
                <td>${await renderLeave.getRemainingLeaveDays("annualLeave")}</td>
            </tr>
            <tr class="petitionLeave">
                <td>청원</td>
                <td>${await renderLeave.getAccruedLeaveDays("petitionLeave")}</td>
                <td><input type="text" style="width: 25px" value=${renderLeave.getTakenLeaveDays("petitionLeave")} 
                name="petitionLeave"></td>
                <td>${await renderLeave.getRemainingLeaveDays("petitionLeave")}</td>
            </tr>
            <tr>
                <td>총합</td>
                <td>${await renderLeave.getTotalAccruedLeaveDays()}</td>
                <td>${await renderLeave.getTotalTakenLeaveDays()}</td>
                <td>${await renderLeave.getTotalRemainingLeaveDays()}</td>
            </tr>
        </table>

        <input type="submit" value="save">
    </form>

    `
}

export async function updateMain(year, month, url){

}