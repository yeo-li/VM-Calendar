console.log("pathnameAdder: START!!");

const currentURL = window.location.href;

document.getElementById('add-pathname').addEventListener('click', ()=>{
    const newPathname = '/EDIT';
    window.location.href = currentURL + newPathname;
});


let isLeaveTableDisplay = false;
document.getElementById('leaveTableToggle').addEventListener('click', () => {
    const leaveTable = document.getElementById('leaveTable1');

    if(isLeaveTableDisplay === false){
        leaveTable.style.display = 'block';
        isLeaveTableDisplay = true;
        document.getElementById('leaveTableToggle').innerHTML = "▲ Leave Table";
    } else{
        leaveTable.style.display = 'none';
        isLeaveTableDisplay = false;
        document.getElementById('leaveTableToggle').innerHTML = "▼ Leave Table";
    }

});

let isLeaveStatusTableDisplay = false;
document.getElementById('leaveStatusTableToggle').addEventListener('click', () => {
    const leaveStatusTable = document.getElementById('leaveStatusTable');

    if(isLeaveStatusTableDisplay === false){
        leaveStatusTable.style.display = 'block';
        isLeaveStatusTableDisplay = true;
        document.getElementById('leaveStatusTableToggle').innerHTML = "▲ 휴가 현황 표";
    } else{
        leaveStatusTable.style.display = 'none';
        isLeaveStatusTableDisplay = false;
        document.getElementById('leaveStatusTableToggle').innerHTML = "▼ 휴가 현황 표";
    }

});

function submitForm(uniqueValue){
    document.getElementById('myForm').action = `/whenisyourleave/leave/${uniqueValue}`;

    const uniqueInput = document.createElement('input');
    uniqueInput.type = 'hidden';
    uniqueInput.name = 'uniqueValue';
    uniqueInput.value = uniqueValue;

    document.getElementById('myForm').appendChild(uniqueInput);
    document.getElementById('myForm').submit();

    return true;
}

function Modal(date){

    const myForm = document.createElement('form');
    myForm.className = 'row';
    myForm.id = 'myForm';
    myForm.method = 'get';

    const div = document.createElement('div');
    div.className = 'row';

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.value = date;
    hiddenInput.name = "date";



    const applyVacationBtn = document.createElement('div');
    applyVacationBtn.style.margin = '7px 7px';
    applyVacationBtn.className='btn btn-primary';
    applyVacationBtn.innerHTML = '휴가 추가';
    applyVacationBtn.onclick = function () {submitForm('apply')};

    const releaseVacationBtn = document.createElement('div');
    releaseVacationBtn.style.margin = '7px 7px';
    releaseVacationBtn.className='btn btn-primary';
    releaseVacationBtn.innerHTML = '휴가 해제';
    releaseVacationBtn.onclick = function () {submitForm('release')};

    const addMemoBtn = document.createElement('div');
    addMemoBtn.style.margin = '7px 7px';
    addMemoBtn.className='btn btn-primary';
    addMemoBtn.innerHTML = '메모 추가/수정';
    addMemoBtn.onclick = function (){submitForm('memo')};


    div.appendChild(hiddenInput);
    div.appendChild(applyVacationBtn);
    div.appendChild(document.createElement('br'));
    div.appendChild(releaseVacationBtn);
    div.appendChild(document.createElement('br'));
    div.appendChild(addMemoBtn);
    myForm.appendChild(div);
    document.getElementById('modal').innerHTML = '';

    document.getElementById('modal').appendChild(myForm);

}

