import http  from 'http' // 아직 잘 모르겠음
import fs from 'fs' // 파일 시스템 모듈을 사용할때 필요함
import * as url from 'url' // url 모듈을 가져옴
import bodyParser from "body-parser";
import * as template from './routes/template.js'
import * as data from './routes/dataCRUD.js'
import renderCalendar from './publics/calendar.js'
import * as LM from './routes/LeaveManagement.js'
import express, {response} from 'express'
import * as calendar from './routes/allNewCalendar.js';

const app = express();
const port = 3000;

/*
  기본 pathname에 들어왔을 때 로직
  현재 날짜를 받고 오늘시달력을 표시 함
  나머지는 달력과 관계 없으므로 그냥 다 표시가기
  필수적으로 표시해야 할 정보: 달력, 휴가관리표(성과제 외박 발급 표, 획득/사용/잔여 휴가 표시 표)
  달력과 휴가관리표는 어떻게 수정할 것인지?

  페이지에서 수정 버튼을 눌러 수정 페이지로 간다 -> 수정한다 -> 저장한다 ->  저장된다. >> 채택

  항상 같은 것: 휴가 사용표 및 성과제 외박 발급표 -> 미들웨어
  추가적으로 필요한 것: express.js 사용법, npm 사용법
*/

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  // 현재 날짜를 구한 뒤 현재 날짜의 달력을 출력함 or year과 month, day를 보냄
  const today = new Date();
  const nowYear = today.getFullYear();
  const nowMonth = today.getMonth() + 1;
  const nowDay = today.getDate();

  //res.send('/: Completed');
  res.redirect(`/VMC/${nowYear}/${nowMonth}/${nowDay}`);
});
app.get('/VMC/:year/:month/:day', async (req, res) => {
  const year = Number.parseInt(req.params.year);
  const month = Number.parseInt(req.params.month);

  res.send(await template.main(year, month, req.url));
});

// todo 원하는 날짜에 근무표 저장 한 뒤 메인 페이지로 이동하는 로직 짜기
app.post('/update_calendar', async (req, res) => {
  const workSchedule = req.body;

  for(let key in workSchedule){
    const date = await new Date(key);
    const year = await date.getFullYear();
    const month = await date.getMonth()+1;
    const day = await date.getDate();

    await calendar.withinFile(()=> {
      return calendar.insertWorkSchedule(year, month, day, workSchedule[key]);
    });
  }

  res.redirect('/');
});

app.get('/VMC/:year/:month/:day/next_process', (req, res) => {
  let newMonth = Number(req.params.month) + 1;
  let newYear = req.params.year;
  let newDay = req.params.day;

  if(newMonth > 12){
    newYear = Number(newYear) + 1;
    newMonth -= 12;
  }

  res.redirect(`/VMC/${newYear}/${newMonth}/${newDay}`);
});
app.get('/VMC/:year/:month/:day/prev_process', (req, res) => {
  let newMonth = req.params.month - 1;
  let newYear = req.params.year;
  let newDay = req.params.day;

  if(newMonth < 1){
    newYear = Number(newYear) - 1;
    newMonth += 12;
  }

  res.redirect(`/VMC/${newYear}/${newMonth}/${newDay}`);
});


app.get('/update_takenLeaves', async (req, res) =>
{
  const queryString = req.query;

  for(let key in queryString){
    const value = queryString[key];
    await LM.withinFile(() =>{
      return LM.updateTakenLeaveDaysToDB(key, Number.parseInt(value));
    });
  }

  res.redirect(`/`);
});




app.listen(port, () => {
  console.log('서버가 실행됩니다.(port: 3000)');
})




/*
const printHTML = function (year, month){
  const mainHomeHTML = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Calender</title>

      <style>
      div {
          border: 1px solid rgb(39, 131, 39);
          align-content: center;
      }
      
      div.calender {
          background-color: rgba(111, 228, 111, 0.356);
          border: 1px solid rgb(39, 131, 39);
          align-content: center;
      }

      div.null {
        border: 0px;
      }
  </style>

      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
          ${cd.calendar(year,month)}
      </div>

    
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    </body>
  </html>
  `;

  return mainHomeHTML;
}

const server = http.createServer(async function(request, response){
    const URL = request.url;
    const queryData = url.parse(URL, true).query; // url의 queryString을 분석하여 연관배열로 반환해줌
    const pathname = url.parse(URL, true).pathname; // url의 pathname을 가져옴

    if(pathname === '/'){
      

      







      const mainHTML = printHTML(2023, 9);

      response.end(mainHTML); // template 출력
      response.writeHead(200); // 성공적으로 끝나면 200 보내기
    } else{
      response.end('Not Fount'); // template 출력
      response.writeHead(404); // 성공적으로 끝나면 200 보내기
    }
});

server.listen(3000);
*/