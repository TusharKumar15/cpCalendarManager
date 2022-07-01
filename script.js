var d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var today = new Date();

var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const year = today.getFullYear(), month = today.getMonth(), date = today.getDate(), hour = today.getHours(), 
min = today.getMinutes(), sec = today.getSeconds(), millisec = today.getMilliseconds(), day = today.getDay();


for(var i = 0; i < 7; i++){
    const th = document.createElement("th");
    const weekDay = document.getElementById("c1").appendChild(th);
    weekDay.className = "calendar_head";
    weekDay.innerHTML = days[(day + i) % 7];
}

for(var i = 0; i < 14; i++){
    var cell;
    temp = new Date(year, month, date + i, hour, min, sec, millisec);
    d[i] = temp.getDate();
    const td = document.createElement("td");
    if(i < 7){
        cell = document.getElementById("c2").appendChild(td);
    }
    else {
        cell = document.getElementById("c3").appendChild(td);
    }
    cell.innerHTML = d[i] < 10 ? "0" + d[i] : "" + d[i] ;
    cell.className = "calendar_box";
    if(i === 0) cell.style.fontWeight = "700"
    cell.onclick = (() => {
        var setDate = temp;
        return () => {
            renderList(setDate);
        }
    })();
}

renderList(today);

function renderList(setDate){
    console.log(setDate);
    const mnt = setDate.getMonth() % 12 + 1;
    const dt = setDate.getDate();
    var keyStr = '' + (mnt<10?'0'+mnt:mnt) + '-' + (dt<10?'0'+dt:dt)
    const lst = document.getElementById("list");
    lst.innerHTML = "<h4>Contests and challenges on " + setDate.toString().slice(0, 15) + " : </h4>"
    const url = [
                    "https://kontests.net/api/v1/codeforces", 
                    "https://kontests.net/api/v1/code_chef",
                    "https://kontests.net/api/v1/kick_start",
                    "https://kontests.net/api/v1/leet_code",
                    "https://kontests.net/api/v1/hacker_rank",
                    "https://kontests.net/api/v1/hacker_earth"
                ]
    for(var i = 0; i < url.length; i++){
        getList(keyStr, url[i]).then((list) => {
            for(var j = 0; j < list.length; j++){
                createListItem(lst, list[j]);
            }
        });
    }    
}

async function getList(keyStr, url) {    
    
    var list = [];
    await fetch(url)
    .then((res) => res.json())
    .then((data) => {
        for(var i = 0; i < data.length; i++){
            if(data[i].start_time.slice(5, 10) === keyStr){
                list.push(data[i]);
            }
        }
    });
    return list;
}

function createListItem(lst, ob){

    // <div id = "list">
    //     <a class = "listItem" href="...">
    //         <div class = "itemName" li>contest name</div>
    //         <div class = "itemShedule">Time: Time | Duration: Duration(in hrs)</div>
    //     </a>
    // </div>

    console.log(ob);
    const dv1 = document.createElement("div");
    dv1.onclick = () => chrome.tabs.create({active: true, url: ob.url});
    // dv1.href = ob.url; 
    const dv2 = document.createElement("div");
    const dv3 = document.createElement("div");
    dv1.className = "listItem";
    dv2.className = "itemName";
    dv3.className = "itemSchedule";
    lst.appendChild(dv1);
    dv1.appendChild(dv2).innerHTML = ob.name;
    dv1.appendChild(dv3).innerHTML = "Time: " + ob.start_time.slice(11, 16) + " UTC " + " | Duration: "
                                     + Math.round(JSON.parse(ob.duration)/3600) + "hrs" ;
}



