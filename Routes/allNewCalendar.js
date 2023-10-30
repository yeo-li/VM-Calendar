import {getWorkSchedule, getDateComponents} from "./CalendarAccessor.js";


export function calendarTitle(year, month){

    return `<h1 align="center" style="width: 70%">${year}년 ${month}월</h1>`;
}



function convertDateToString(date){

    const thisDate = getDateComponents(date);
    function convertNumber(number){
        let rst = '0';
        if(number < 10){
            rst += number.toString(10);
        } else{
            rst = number.toString(10);
        }

        return rst;
    }

    return `${convertNumber(thisDate.year)}-${convertNumber(thisDate.month)}-${convertNumber(thisDate.day)}`;;
}

function createDayHTML(date){
    //console.log("createDayHTML: "+ date);
    if(!date){
        return `
        <td></td>`;
    }

    const today = new Date();
    let Class = '';

    if(date.toLocaleDateString() === today.toLocaleDateString()){
        Class = "table-warning";
    } else if(getWorkSchedule(date) === '휴'){
        Class = "table-success";
    }

    return `
            <td class="${Class}" id="${convertDateToString(date)}" onclick="modal(${convertDateToString(date)})">
                <a href="#"><div>${date.getDate()}</div></a>
                <hr>
                <div >${getWorkSchedule(date)}</div>
            </td>
    `
}

function createDayHTMLForEdit(date) {
    if(!date){
        return `
        <td></td>`;
    }

    const today = new Date();
    const thisDate = getDateComponents(date);
    let Class = '';

    if(date.toLocaleDateString() === today.toLocaleDateString()){
        Class = "table-warning";
    } else if(getWorkSchedule(date) === '휴'){
        Class = "table-success";
    }

    return `
            <td class="${Class}">
                <a href="#"><div>${date.getDate()}</div></a>
                <hr>
                <div>
                <select name="${thisDate.year}/${thisDate.month}/${thisDate.day}" style="width: 40px">
                    ${createOptionTagsHTML(date)}
                </select>
                <!--<input type="text" value="${getWorkSchedule(date)}" name="${thisDate.year}/${thisDate.month}/${thisDate.day}" style="width: 27px">-->
                </div>
            </td>
    `
}

function createOptionTagsHTML(date){
    let arr = ['주', '야', '비', '휴'];
    let html = ``;
    const selectedData = getWorkSchedule(date);
    html += createOptionTagHTML(selectedData, true);
    arr = arr.filter((e) => e !== selectedData);

    for(const elem of arr){
        html += createOptionTagHTML(elem, false);
    }

    return html;
}

function createOptionTagHTML(value, selected){
    let html = `<option value="${value}" `;

    if(selected){
        html += "selected>";
    } else {
        html += ">";
    }

    html += `${value}</option>`;

    return html;
}

async function createWeekHTML(startDate){ // startDate: Date Object
    const startDay = startDate.getDay();
    // const lastDate = new Date(thisDate.year, thisDate.month, 0).getDate();
    const thisDate = getDateComponents(startDate);
    const lastDate = new Date(thisDate.year, thisDate.month, 0).getDate();
    let _date = startDate;
    let html = `<tr>`;

    for(let day = 0; day < 7; day++){
        if(day < startDay) {
            html += createDayHTML(false);
            continue;
        }

        const thisDate = new Date(_date);
        html += createDayHTML(thisDate);

        if(_date.getDate() === lastDate){
            break;
        }

        _date = new Date(_date.setDate(_date.getDate() + 1));

    }

    html += `</tr>`;

    return html;
}

export async function createCalendarHTML(date, url){
    const thisDate = getDateComponents(date);

    let html =
        `<table class="table table-bordered table-hover">
        <thead class="table-dark">
            <th>일</th>
            <th>월</th>
            <th>화</th>
            <th>수</th>
            <th>목</th>
            <th>금</th>
            <th>토</th>
        </thead>
        <tbody>
`;
    const lastDate = new Date(thisDate.year, thisDate.month, 0).getDate();
    for(let day = 1; day <= lastDate;){
        //console.log(day);
        html += await createWeekHTML(new Date(`${thisDate.year}-${thisDate.month}-${day}`));
        const daysProduced = await (7 - new Date(`${thisDate.year}-${thisDate.month}-${day}`).getDay());
        day += daysProduced;
    }

    html += `</tbody></table>`;

    return html;
}


async function createWeekHTMLForEdit(startDate){ // startDate: Date Object
    const startDay = startDate.getDay();
    // const lastDate = new Date(thisDate.year, thisDate.month, 0).getDate();
    const thisDate = getDateComponents(startDate);
    const lastDate = new Date(thisDate.year, thisDate.month, 0).getDate();
    let _date = startDate;
    let html = `<tr>`;

    for(let day = 0; day < 7; day++){
        if(day < startDay) {
            html += createDayHTML(false);
            continue;
        }

        const thisDate = new Date(_date);
        html += createDayHTMLForEdit(thisDate);

        if(_date.getDate() === lastDate){
            break;
        }

        _date = new Date(_date.setDate(_date.getDate() + 1));

    }

    html += `</tr>`;

    return html;
}

export async function createCalendarHTMLForEdit(date){
    const thisDate = getDateComponents(date);

    let html =
        `<form action="/whenisyourleave/update_calendar" method="post">
<table class="table table-bordered table-hover">
        <thead class="table-dark">
            <th>일</th>
            <th>월</th>
            <th>화</th>
            <th>수</th>
            <th>목</th>
            <th>금</th>
            <th>토</th>
        </thead>
        <tbody>
`;
    const lastDate = new Date(thisDate.year, thisDate.month, 0).getDate();
    for(let day = 1; day <= lastDate;){
        //console.log(day);
        html += await createWeekHTMLForEdit(new Date(`${thisDate.year}-${thisDate.month}-${day}`));
        const daysProduced = await (7 - new Date(`${thisDate.year}-${thisDate.month}-${day}`).getDay());
        day += daysProduced;
    }

    html += `</tbody></table> 
             <button type="submit" class="btn btn-primary" style="float: right">Save calendar</button>
             </form>`;

    return html;
}