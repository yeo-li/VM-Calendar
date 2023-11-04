console.log("pathnameAdder: START!!");

const currentURL = window.location.href;

document.getElementById('add-pathname').addEventListener('click', ()=>{
    const newPathname = '/EDIT';
    window.location.href = currentURL + newPathname;
});


let isLeaveTableDisplay = false;
document.getElementById('leaveTableToggle').addEventListener('click', () => {
    const leaveTable = document.getElementById('leaveTable');

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
    document.getElementById('modal').style.display = 'block';

    document.getElementById('main').style.display = 'none';
    const myForm = document.createElement('form');
    myForm.id = 'myForm';
    myForm.method = 'get';
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.value = date;
    hiddenInput.name = "date";

    const applyVacationBtn = document.createElement('button');
    applyVacationBtn.type='button';
    applyVacationBtn.innerHTML = '휴가 추가';
    applyVacationBtn.onclick = function () {submitForm('apply')};

    const updateVacationBtn = document.createElement('button');
    updateVacationBtn.type='button';
    updateVacationBtn.innerHTML = '휴가 수정';
    updateVacationBtn.onclick = function () {submitForm('update')};

    const releaseVacationBtn = document.createElement('button');
    releaseVacationBtn.type='button';
    releaseVacationBtn.innerHTML = '휴가 해제';
    releaseVacationBtn.onclick = function () {submitForm('release')};

    const addMemoBtn = document.createElement('button');
    addMemoBtn.type='button';
    addMemoBtn.innerHTML = '메모 추가';
    addMemoBtn.onclick = function (){submitForm('memo')};


    myForm.appendChild(hiddenInput);
    myForm.appendChild(applyVacationBtn);
    myForm.appendChild(updateVacationBtn);
    myForm.appendChild(releaseVacationBtn);
    myForm.appendChild(addMemoBtn);

    document.getElementById('modal').innerHTML = '';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = "button";
    cancelBtn.innerHTML = '취소';
    cancelBtn.onclick = function () {
        document.getElementById('main').style.display = 'block';
        document.getElementById('modal').style.display = 'none';
    };
    myForm.appendChild(cancelBtn);


    document.getElementById('modal').appendChild(myForm);

}

