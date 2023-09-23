import fs from 'fs' // 파일 시스템 모듈을 사용할때 필요함


let data = [];


/**
 * file.json을 불러온 뒤 객체 배열을 data에 반환하는 method
 */
async function loadFile() {
  const content = await new Promise((res, rej) => {
      fs.readFile(`./data/file.json`, 'utf-8', function (err, data) {
          if (err) {
              rej(err);
          } else {
              res(data);
          }
      });
  });

  data = JSON.parse(content);

}

/**
 * 필요한 년도의 json 데이터를 읽기 및 생성하는 method
 * @param {number} year 
 * @returns
 */
function getYear(year) {
  const years = data;
  const thatYear = years.find(e => e.year === year);

  if (thatYear == null) {
      years.push({
          year,
          months: []
      });
      return getYear(year);
  }

  return thatYear;
}

/**
* 필요한 년도와 월의 json 데이터를 읽기 및 생성하는 method
* @param {number} year 
* @param {number} month 
* @returns
*/
function getMonth(year, month) {
  const thatYear = getYear(year);

  const months = thatYear.months;
  const thatMonth = months.find(e => e.month === month);
  if (thatMonth == null) {
      months.push({
          month,
          days: []
      });
      return getMonth(year, month);
  }

  return thatMonth;
}

/**
 * 
 * @param {*} year 
 * @param {*} month 
 * @returns 
 */
function calendarTitle(year, month){

    return `${year}년 ${month}월`;
}

/**
 * 
 * @param {*} year 
 * @returns 
 */
function isLeapYear(year){
  if(year%4 === 0){
    if(year%100 === 0){
      if(year%400 === 0){
        return true;
      }
      return false;
    }
    return true;
  }

  return false;
}

/**
 * 
 * @param {*} year 
 * @param {*} month 
 * @returns 
 */
function periodOfMonth(year, month){
  const thirty = [4, 6, 9, 11];
  let result = 0;

  if(month == 2){
    if(isLeapYear(year, month)){
      result =  29;
    } else{
      result = 28;
    }
  } else {
    for(const day of thirty){
      if(day == month){
        result = 30;
        break;
      }
    }
  }
  if(result == 0){
    result = 31;
  }



  return result;
}

/**
 * 달력의 ord 번 째 주의 날짜를 days 배열을 통해 html로 반환
 * @param {number} ord 
 * @param {Array} days 
 * @returns 
 */
function printOneWeekDay(ord, days){
  let html = ``;

  for(let i = 0; i < 7 ; i++){
    const today = days[ord][i];
    let day = `<div class="col d${i}">`;

    if(today === 0){
      day += `&nbsp;</div>`;
    } else{
      day += `${today}</div>`;
    }

    html += day;
  }

  return html;
}

/**
 * 달력에서의 일간 근무를 삽입하여 html로 가공한 뒤 반환해줌
 * @param {number} ord 
 * @param {number} year 
 * @param {number} month 
 * @param {Array} days 
 * @returns 
 */
function printOneWeekWork(ord, year, month, days){
  let html = ``;
  //loadFile();


  const theMonthDays = getMonth(year, month);

  for(let i = 0; i < 7 ; i++){
    const today = theMonthDays.days.find(e => e.day === days[ord][i]);

    let day = `<div class="col d${i}">`;

    if(today == 0){ // today가 저번달 혹은 다음달이라면 공백 추가하기
      day += `&nbsp;</div>`;
    } else{

      if(today){
        day += `${today.work}</div>`;
      } else{
        day += `empty</div>`;
      }
    }
    html += day;
  }

  return html;
}

/**
 * ord번째 주의 근무 일정을 html로 반환해줌 
 * @param {number} ord 
 * @param {number} year 
 * @param {number} month 
 * @param {Array} days 
 * @returns 
 */
function printOneWeekSchedule(ord, year, month, days){
  let html = ``;

  loadFile();

  const theMonthDays = getMonth(year, month).days;

  for(let i = 0; i < 7 ; i++){
    const today = theMonthDays.find(e => e.day === days[ord][i]);
    let day = `<div class="col d${i} schedule">`;

    if(today == null){
      //console.log("왜 이게 실행됨?");
      day += `&nbsp;</div>`;
    } else{
      if(today != undefined){
        if(today.schedule.length > 0){
          for(let j = 0; j < today.schedule.length; j++){
            day += `<div class="btn"><font size=2>${today.schedule[j].title}</font></div>`;
          }
        } else{
          const empty = `<div class="null">&nbsp;</div><div class="null">&nbsp;</div>`;
          day += empty;
        }

        day += `</div>`;
      } else{
        //console.log("엥???")
        day += `NULL</div>`;
      }
    }

    html += day;
  }

  return html;
}

/**
 * ord번째 주의 날짜, 근무 일정, 개인 일정을 모두 정리하여  html로 반환함
 * @param {number} ord 
 * @param {string} days 
 * @param {string} work 
 * @param {string} schedule 
 * @returns 
 */
function printWeek(ord, days, works, schedules){
    return `
  <div class="week-${ord}" style="border: 0px;">

  <div class="row days">
    ${days}
  </div>
    
  <div class="row work">
    ${works}
  </div>

  <div class="row shcedule">
    ${schedules}
  </div>
  `;
}

/**
 * 초기 날짜를 저장하는 이차원 배열인 days생성 및 각각의 주차들을 모두 모은 뒤 한 달 형태의 html로 반환
 * @param {number} year 
 * @param {number} month 
 * @returns 
 */
function printWeeks(year, month){
  const _date = new Date();
  _date.setFullYear(year, month-1, 1);

  const startDay = _date.getDay(); //0~6
  const period = periodOfMonth(year, month);
  let day = 1;
  let days = [];

  for(let i = 0; i < 6; i++){
    let week = [];
    for(let j = 0; j < 7; j++){
      if((j < startDay && i === 0) || (day > period)){
        week.push(0);
      } else if(day <= period){
        week.push(day);
        day++;
      }
    }
    days.push(week);
  }


  let html = ``;

  for(let i = 0; i < 6; i++){
    html += (printWeek(i, printOneWeekDay(i, days), 
                          printOneWeekWork(i, year, month, days),
                          printOneWeekSchedule(i, year, month, days)) + '</div>');
  }


  return html;
  
}

/**
 * 입력한 년도와 월의 달력을 출력함
 * @param {number} year 
 * @param {number} month 
 * @returns 달력 html을 반환
 */
export default function calendar(year, month, url){
    // 1,3,5,7,8,10,12: 31일 2,4,6,9,11: 30일 2:28일or29일

    const date = new Date();
    const period = periodOfMonth(year, month);
    date.setFullYear(year, month-1, 1);

    const html = `
    <div class="container-xl text-center calender">
    <div class="row">
        <div class="col">
            <div class="row header">
                <a class="btn col prevDay" href=${url}/prev_process>prev</a>
                <div class="col dataTitle">${calendarTitle(year, month)}</div>
                <a class="btn col nextDay" href=${url}/next_process>next</a>
            </div>
    
            <div class="row">
                <div class="col">일</div>
                <div class="col">월</div>
                <div class="col">화</div>
                <div class="col">수</div>
                <div class="col">목</div>
                <div class="col">금</div>
                <div class="col">토</div>
            </div>

            ${printWeeks(year, month)}
            
        </div>
    </div>
</div>


    `;

    return html; // 시작을 인덱스 5번부터 하면됨!!! 그럼 배열로 구현하면 되려남...
}
