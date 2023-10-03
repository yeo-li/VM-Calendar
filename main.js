import bodyParser from "body-parser";
import * as template from './routes/template.js'
import * as LM from './routes/LeaveManagement.js'
import express from 'express'
import * as ls from './routes/DBLoaderSaver.js';
import * as data from './routes/CalendarAccessor.js'

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

// main.js: server(not service)

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  // 현재 날짜를 구한 뒤 현재 날짜의 달력을 출력함 or year과 month, day를 보냄
  const today = new Date();
  const nowDate = data.getDateComponents(today);

  res.redirect(`/VMC/${nowDate.year}/${nowDate.month}/${nowDate.day}`);
});
app.get('/VMC/:year/:month/:day', async (req, res) => {
  const year = Number.parseInt(req.params.year);
  const month = Number.parseInt(req.params.month);

  res.send(await template.main(year, month, req.url));
});

app.get('/EDIT/VMC/:year/:month/:day', async (req, res) => {
  const year = Number.parseInt(req.params.year);
  const month = Number.parseInt(req.params.month);

  res.send(await template.mainForEdit(year, month, req.url));
});
app.post('/update_calendar', async (req, res) => {
  const workSchedule = req.body;

  for(let key in workSchedule){
    const date = await new Date(key);
    await ls.withinFile(()=> {
      return data.insertWorkSchedule(date, workSchedule[key]);
    });
  }

  res.redirect('/');
});

app.get('/VMC/:year/:month/:day/next_process', (req, res) => {
  let newMonth = Number(req.params.month) + 1;
  let newYear = req.params.year;
  let newDay = req.params.day;

  if(newMonth > 12){
    newYear = Number.parseInt(newYear) + 1;
    newMonth -= 12;
  }

  res.redirect(`/VMC/${newYear}/${newMonth}/${newDay}`);
});
app.get('/VMC/:year/:month/:day/prev_process', (req, res) => {
  let newMonth = req.params.month - 1;
  let newYear = req.params.year;
  let newDay = req.params.day;

  if(newMonth < 1){
    newYear = Number.parseInt(newYear) - 1;
    newMonth += 12;
  }

  res.redirect(`/VMC/${newYear}/${newMonth}/${newDay}`);
});

app.get('/EDIT/VMC/:year/:month/:day/next_process', (req, res) => {
  let newMonth = Number(req.params.month) + 1;
  let newYear = req.params.year;
  let newDay = req.params.day;

  if(newMonth > 12){
    newYear = Number.parseInt(newYear) + 1;
    newMonth -= 12;
  }

  res.redirect(`/EDIT/VMC/${newYear}/${newMonth}/${newDay}`);
});
app.get('/EDIT/VMC/:year/:month/:day/prev_process', (req, res) => {
  let newMonth = req.params.month - 1;
  let newYear = req.params.year;
  let newDay = req.params.day;

  if(newMonth < 1){
    newYear = Number.parseInt(newYear) - 1;
    newMonth += 12;
  }

  res.redirect(`/EDIT/VMC/${newYear}/${newMonth}/${newDay}`);
});


app.post('/update_takenLeaves', async (req, res) => {
  const leaves = req.body;
  for(let key in leaves){
    const value = leaves[key];
    await ls.withinFile(() =>{
      return LM.updateTakenLeaveDaysToDB(key, Number.parseInt(value));
    });
  }

  res.redirect(`/`);
});




app.listen(port, () => {
  console.log('서버가 실행됩니다.(port: 3000)');
})