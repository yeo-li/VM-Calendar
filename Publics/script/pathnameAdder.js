console.log("pathnameAdder: START!!");

const currentURL = window.location.href;

document.getElementById('add-pathname').addEventListener('click', ()=>{
    const newPathname = '/EDIT';
    window.location.href = currentURL + newPathname;
})


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

})