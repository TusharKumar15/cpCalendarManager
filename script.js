var d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var today = new Date();
document.getElementById("date").innerHTML = today;

var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const year = today.getFullYear(), month = today.getMonth(), date = today.getDate(), hour = today.getHours(), 
min = today.getMinutes(), sec = today.getSeconds(), millisec = today.getMilliseconds(), day = today.getDay();


for(var i = 0; i < 7; i++){
    const th = document.createElement("th");
    const weekDay = document.getElementById("c1").appendChild(th);
    weekDay.style.width = "30px";
    weekDay.innerHTML = days[(day + i) % 7];
}

for(var i = 0; i < 14; i++){
    var cell;
    temp = new Date(year, month, date + i, hour, min, sec, millisec);
    d[i] = temp.getDate();
    const td = document.createElement("td");
    if(i < 7){
        cell=(document.getElementById("c2").appendChild(td))
    }
    else {
        cell = (document.getElementById("c3").appendChild(td));
    }
    cell.innerHTML = d[i] < 10 ? "0" + d[i] : "" + d[i] ;
    // cell.style.display = 'flex';
    cell.style.paddingLeft = "10px";
    cell.onclick = (() => {
        var setDate = temp;
        return () => renderList(setDate);
    })();
}

renderList(today);

function renderList(setDate){
    console.log(setDate);
    const mnt = setDate.getMonth() % 12 + 1;
    const dt = setDate.getDate();
    var keyStr = '' + (mnt<10?'0'+mnt:mnt) + '-' + (dt<10?'0'+dt:dt)
    const lst = document.getElementById("list");
    lst.innerHTML = "";
    // console.log(keyStr);
    // var cp = [];
    const url = [
                    "https://kontests.net/api/v1/codeforces", 
                    "https://kontests.net/api/v1/code_chef",
                    "https://kontests.net/api/v1/kick_start",
                    "https://kontests.net/api/v1/leet_code"
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
    console.log(ob);
    const dv = document.createElement("div");
    lst.appendChild(dv).innerHTML = ob.name  + " " +  ob.start_time  + " " +  ob.duration;
}
