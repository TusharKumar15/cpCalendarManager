

//---------------------------------------------Platforms---------------------------------------------------

// Hide and show the choose platforms button
var elmContainer = document.getElementById("show");

elmContainer.style.display = "none";
document.getElementById("hid_unhid").onclick = (() => {
    console.log(elmContainer.style.display);
    if(elmContainer.style.display === "none") elmContainer.style.display = "contents";
    else elmContainer.style.display = "none";
});

// List of platforms to select from
const pltfrms = ["codeforces", "codechef", "hacker rank", "hackerearth", "leetcode", "Kick start", "top code", "at coder", "cs academy"];

// functioning of the platforms list
for(var i = 0; i < pltfrms.length; i++){

    // <div id = "show">
    //     <input type="checkbox" id="check{i}"></input>
    //     <span>Platform Name</span>
    // </div>

    var elm = document.createElement("input");
    elm.type = "checkbox";
    var elmbox = elmContainer.appendChild(elm)
    elmbox.id = "check"+i;

    // send the checked box data to the local storage
    // to retrieve when the extension reloads
    elmbox.onchange = (() => {
        var elmboxT = elmbox;
        return () => {
            localStorageManager(elmboxT);
            
        }
    })();

    // if chosen earlier remains ticked on next loading
    if(localStorage[elmbox.id] === '1') elmbox.checked = true;

    // Name of platform
    var elmTxt = document.createElement("span");
    elmContainer.appendChild(elmTxt).innerHTML = pltfrms[i];
}

// storing data in local storage
function localStorageManager(elm){
    console.log(elm.checked);
    if(elm.checked) localStorage[elm.id] = '1';
    else localStorage[elm.id] = '0';
}

//---------------------------------------------Calendar-----------------------------------------------------

// array of next 14 dates
var d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var today = new Date();

var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const year = today.getFullYear(), month = today.getMonth(), date = today.getDate(), hour = today.getHours(), 
min = today.getMinutes(), sec = today.getSeconds(), millisec = today.getMilliseconds(), day = today.getDay();

// calendar week row
for(var i = 0; i < 7; i++){
    const th = document.createElement("th");
    const weekDay = document.getElementById("c1").appendChild(th);
    weekDay.className = "calendar_head";
    weekDay.innerHTML = days[(day + i) % 7];
}

//calendar dates rows
for(var i = 0; i < 14; i++){

    var cell;       // stores html element of one date box in calendar
    temp = new Date(year, month, date + i, hour, min, sec, millisec);
    d[i] = temp.getDate();
    const td = document.createElement("td");
    if(i < 7){
        cell = document.getElementById("c2").appendChild(td);
    }
    else {
        cell = document.getElementById("c3").appendChild(td);
    }

    // Add a 0 to single digit dates to maintain uniformity
    cell.innerHTML = d[i] < 10 ? "0" + d[i] : "" + d[i] ;
    cell.className = "calendar_box";

    // highlight the current date
    if(i === 0) cell.style.fontWeight = "700"

    // Show the list of contest on clicked date
    cell.onclick = (() => {
        var setDate = temp;
        return () => {
            renderList(setDate);
        }
    })();
}

//-----------------------------------------List of Contests-----------------------------------------------

renderList(today);   // By default contest today should be visible

// Show list function
function renderList(setDate){
    console.log(setDate);

    // keyStr is used to filter out contest of a particular date from the api json data
    const mnt = setDate.getMonth() % 12 + 1;
    const dt = setDate.getDate();
    var keyStr = '' + (mnt<10?'0'+mnt:mnt) + '-' + (dt<10?'0'+dt:dt)


    const lst = document.getElementById("list");
    lst.innerHTML = "<h4>Contests and challenges on " + setDate.toString().slice(0, 15) + " : </h4>"

    // url of APIs of all the platfoms stored in an array. All contain data in similar json structure
    const url = [
                    "https://kontests.net/api/v1/codeforces", 
                    "https://kontests.net/api/v1/code_chef",
                    "https://kontests.net/api/v1/hacker_rank",
                    "https://kontests.net/api/v1/hacker_earth",
                    "https://kontests.net/api/v1/leet_code",
                    "https://kontests.net/api/v1/kick_start",
                    "https://kontests.net/api/v1/top_coder",
                    "https://kontests.net/api/v1/at_coder",
                    "https://kontests.net/api/v1/cs_academy"
                ];

    
    for(var i = 0; i < url.length; i++){
        // if the user has not selected this platform then skip
        if(!document.getElementById("check"+i).checked) continue;
        getList(keyStr, url[i]).then((list) => {
            for(var j = 0; j < list.length; j++){
                createListItem(lst, list[j]);
            }
        });
    }    
}

// fetch data from API
async function getList(keyStr, url) {    
    
    var list = [];
    await fetch(url)
    .then((res) => res.json())
    .then((data) => {
        for(var i = 0; i < data.length; i++){
            // the particular segment string should match with our keyStr
            if(data[i].start_time.slice(5, 10) === keyStr){
                list.push(data[i]);
            }
        }
    });
    return list;
}


// Creating the html component for list from the fetched data
function createListItem(lst, ob){

    // <div id = "list">
    //     <a class = "listItem" href="...">
    //         <div class = "itemName" li>contest name</div>
    //         <div class = "itemShedule">Time: Time | Duration: Duration(in hrs)</div>
    //     </a>
    // </div>

    console.log(ob);
    const dv1 = document.createElement("div");

    // Redirect to the page ogf contest
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


