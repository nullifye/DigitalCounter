const clickedAnimations = document.getElementById("clicked-animations");

function plusone() {
  const clickedAnimation = document.createElement("div");
        clickedAnimation.classList.add("clicked-animation");
        clickedAnimation.textContent = hold ? hold.cap : "+1";
        clickedAnimations.appendChild(clickedAnimation);

  const positionX = Math.floor(Math.random() * window.innerWidth) || 0;
  const positionY = Math.floor(Math.random() * window.innerHeight) || 0;

  clickedAnimation.style.left = positionX + "px";
  clickedAnimation.style.top  = positionY + "px";

  setTimeout(function() {
    clickedAnimation.style.opacity = "0.6";
  }, 10);

  setTimeout(function() {
    clickedAnimation.style.opacity = "0";
    setTimeout(function() {
      clickedAnimations.removeChild(clickedAnimation);
    }, 300);
  }, 2000);
}

function formattedDisplayNum(num) {
  let formattedNum = num.toString().padStart(5, "0");

  formattedNum = formattedNum.split("").map(function(el) {
    return "<span data-num='" + el + "'>" + el +"</span>";
  }).join("");

  return formattedNum;
}

const dingSound = new Audio("sound/ding.mp3");

function countup() {
  plusone();

  if (!isMute) {
    const clickSound = new Audio("sound/click.mp3");
          clickSound.play();
  }

  const ctr = document.querySelector(".counter");
    let num = parseInt(ctr.innerText);
        num++;

  ctr.innerHTML = formattedDisplayNum(num); 

  if (Number.isInteger(num / notifyAt)) {
    try {
      navigator.vibrate([500]);
      console.log("=> " + notifyAt);
    }
    catch (e) {
      console.log("iOS?");
    }

    if (!isMute)
      dingSound.play();
  }

  analytics();
  updateRecordIfLoaded(num);
}

function minus() {
  const ctr = document.querySelector(".counter");
    let num = parseInt(ctr.innerText);

  if (num > 0)
    num--;

  ctr.innerHTML = formattedDisplayNum(num);

  updateRecordIfLoaded(num);
}

function reset() {
  const ctr = document.querySelector(".counter");

  ctr.innerHTML = "00000";

  hold = null;

  document.querySelector("#save").style.display = "unset";
}

function records() {
  const records      = document.querySelector(".records");
  const recordstable = document.querySelector(".recordstable");

  let rec = JSON.parse(localStorage.getItem("records"));

  recordstable.innerHTML = "";

  if (rec) {
    rec = rec.sort((a, b) => {
      return b.epoch - a.epoch;
    });

    for (var i = 0; i < rec.length; i++) {
      let d = new Date(0);
      d.setUTCSeconds(rec[i].epoch);

      let spo = document.createElement("span");
          spo.id = "_" + rec[i].epoch;
      let sp1 = document.createElement("span");
          sp1.classList.add("colcounter");
          sp1.innerText = rec[i].count.toLocaleString("en");
      let sp2 = document.createElement("span");
          sp2.classList.add("colsname");
          sp2.dataset.key = rec[i].epoch;
          sp2.innerText = rec[i].title;
      let sp3 = document.createElement("span");
          sp3.innerText = d.toLocaleString();
      let sp4 = document.createElement("span");
          sp4.classList.add("colsactions", "material-icons-round");
          sp4.dataset.key = rec[i].epoch;
          sp4.innerText = "delete_forever";

      sp2.addEventListener("click", function() {
        loadRecord(this.dataset.key);
      });

      sp4.addEventListener("click", function() {
        removeRecord(this.dataset.key);
      });

      spo.appendChild(sp1);
      sp2.appendChild(sp3);
      spo.appendChild(sp2);
      spo.appendChild(sp4);

      recordstable.appendChild(spo);
    }
  }

  records.style.display = "flex";
}

function loadRecord(id) {
  const rec = JSON.parse(localStorage.getItem("records"));
  const idx = rec.findIndex((item) => item.epoch == id);

  hold = {
    idx: idx,
    cap: rec[idx].title,
    ctr: rec[idx].count
  };

  const ctr = document.querySelector(".counter");

  ctr.innerHTML = formattedDisplayNum(hold.ctr);

  document.querySelector(".records").style.display = "none";
  document.querySelector("#save").style.display = "none";
  
}

function removeRecord(id) {
  const rem = document.querySelector("#_" + id);
        rem.remove();

  let   rec = JSON.parse(localStorage.getItem("records"));
        rec = rec.filter((item) => item.epoch != id);

  localStorage.setItem("records", JSON.stringify(rec));
}

function updateRecordIfLoaded(ctr) {
  if (hold) {
    let rec = JSON.parse(localStorage.getItem("records"));
        rec[hold.idx].epoch = parseInt(new Date().getTime() / 1000);
        rec[hold.idx].count = ctr;

    localStorage.setItem("records", JSON.stringify(rec));
  }
}

function notify() {
  const notifyat = document.querySelector(".notifyat");

  notifyat.querySelector("#notifyat").value = parseInt(localStorage.getItem("notifyAt")) || 0;
  notifyat.style.display = "flex";
}

function save() {
  const saveas = document.querySelector(".saveas");

  saveas.querySelector("#saveas").value = "";
  saveas.style.display = "flex";
}

function trophy() {
  const trophy   = document.querySelector(".trophy");
  const trophies = document.querySelector(".trophies");

  trophies.innerHTML = "";

  for (var i = 0; i < badges.length; i++) {
    const stt = JSON.parse(localStorage.getItem(badges[i].s));
    const cls = stt ? "class='unlocked'" : "";

    const tmp = 
      `<span id="${badges[i].s}" ${cls}>
        <span class="material-icons-round">
          ${badges[i].i}
        </span>
        <span class="caption">${badges[i].t}</span>
      </span>`;

    trophies.innerHTML += tmp;
  }

  trophy.style.display = "flex";
}

function changemode() {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
    document.querySelector("#mode").innerHTML = "dark_mode";

    localStorage.setItem("isDarkMode", false);
  }
  else {
    document.body.classList.add("dark");
    document.querySelector("#mode").innerHTML = "light_mode";

    localStorage.setItem("isDarkMode", true);
  }
}

const divOverlay = document.querySelector(".movinblock");
const  triggerEl = document.querySelector("#move");
let       isDown = false;
let       offset = [0,0];

//desktop
triggerEl.addEventListener("mousedown", function(e) {
  isDown = true;
  offset = [
    divOverlay.offsetLeft - e.clientX,
    divOverlay.offsetTop - e.clientY
  ];

  triggerEl.style.cursor = "grabbing";
}, true);

document.addEventListener("mouseup", function() {
  isDown = false;
  triggerEl.style.cursor = "grab";
}, true);

document.addEventListener("mousemove", function(e) {
  if (isDown) {
    e.preventDefault();
    divOverlay.style.left    = (e.clientX + offset[0]) + "px";
    divOverlay.style.top     = (e.clientY + offset[1]) + "px";
    divOverlay.style.bottom  = (e.clientY + offset[1]) + "px";
  }
}, true);

//mobile
triggerEl.addEventListener("touchstart", function(e) {
  isDown = true;
  offset = [
    divOverlay.offsetLeft - e.touches[0].clientX,
    divOverlay.offsetTop - e.touches[0].clientY
  ];

  triggerEl.style.cursor = "grabbing";
});

document.addEventListener("touchend", function() {
  isDown = false;
  triggerEl.style.cursor = "grab";
});

document.addEventListener("touchmove", function(e) {
  if (isDown) {
    divOverlay.style.left    = (e.touches[0].clientX + offset[0]) + "px";
    divOverlay.style.top     = (e.touches[0].clientY + offset[1]) + "px";
    divOverlay.style.bottom  = (e.touches[0].clientY + offset[1]) + "px";
  }
});


document.querySelector("#reset").addEventListener("click", function(e) {
  reset();
});

document.querySelector("#mode").addEventListener("click", function(e) {
  changemode();
});

document.querySelector("#records").addEventListener("click", function(e) {
  records();
});

document.querySelector("#trophy").addEventListener("click", function(e) {
  trophy();
});

document.querySelector("#minus").addEventListener("click", function(e) {
  minus();
});

document.querySelector("#sound").addEventListener("click", function(e) {
  isMute = !isMute;

  localStorage.setItem("isMute", isMute);

  if (isMute)
    document.querySelector("#sound").innerHTML = "volume_off";
  else
    document.querySelector("#sound").innerHTML = "volume_up";
});

document.querySelector("#notify").addEventListener("click", function(e) {
  notify();
});

document.querySelector("#save").addEventListener("click", function(e) {
  save();
});

document.querySelector("#keypad").addEventListener("click", function(e) {
  countup();
});

document.querySelector("#btnnotifyat").addEventListener("click", function(e) {
  let el = document.querySelector("#notifyat").value.trim();

  document.querySelector(".notifyat").style.display = "none";

  if (el != "" && !isNaN(el) && parseInt(el) > 0) {
    document.querySelector(".notifybadge").style.display = "block";
  }
  else {
    el = 0;
    document.querySelector(".notifybadge").style.display = "none";
  }

  localStorage.setItem("notifyAt", parseInt(el));
  document.querySelector(".notifybadge").innerHTML = parseInt(el);

  notifyAt = el;
});

document.querySelector("#btnsaveas").addEventListener("click", function(e) {
  const el = document.querySelector("#saveas").value.trim();

  if (el != "") {
    document.querySelector(".saveas").style.display = "none";

    const id = parseInt(new Date().getTime() / 1000);
    const cn = document.querySelector(".counter");

    const data = {
      epoch: id,
      title: el,
      count: parseInt(cn.innerText)
    };

    let rec = JSON.parse(localStorage.getItem("records"));

    if (rec)
      rec.push(data);
    else
      rec = [data];

    localStorage.setItem("records", JSON.stringify(rec));

    loadRecord(id);
  }
});

document.querySelector("#btnnotifyatclose").addEventListener("click", function(e) {
  document.querySelector(".notifyat").style.display = "none";
});

document.querySelector("#btnsaveasclose").addEventListener("click", function(e) {
  document.querySelector(".saveas").style.display = "none";
});

document.querySelector("#btnrecordsclose").addEventListener("click", function(e) {
  document.querySelector(".records").style.display = "none";
});

document.querySelector("#btntrophyclose").addEventListener("click", function(e) {
  document.querySelector(".trophy").style.display = "none";
});


let isDarkMode = JSON.parse(localStorage.getItem("isDarkMode"));
let hold = null;

if (isDarkMode) {
  document.body.classList.add("dark");
  document.querySelector("#mode").innerHTML = "light_mode";
}

let isMute = JSON.parse(localStorage.getItem("isMute"));

if (isMute) {
  document.querySelector("#sound").innerHTML = "volume_off";
}

let notifyAt = parseInt(localStorage.getItem("notifyAt"));

if (isNaN(notifyAt)) {
  notifyAt = 33;
  localStorage.setItem("notifyAt", notifyAt);
}

if (notifyAt > 0) {
  document.querySelector(".notifybadge").innerHTML = notifyAt;
  document.querySelector(".notifybadge").style.display = "block";
}

const badges = [
  {i: "military_tech", t: "First 33",       s: "_badge1"},
  {i: "military_tech", t: "First 1,000",    s: "_badge2"},
  {i: "military_tech", t: "1,000 in a Day", s: "_badge3"},
  {i: "military_tech", t: "3-day Streak",   s: "_badge4"},
  {i: "military_tech", t: "7-day Streak",   s: "_badge5"},
  {i: "military_tech", t: "30-day Streak",  s: "_badge6"},
  {i: "military_tech", t: "100 Total Days", s: "_badge7"},
  {i: "military_tech", t: "10,000",         s: "_badge8"}
];

function lastAccessTime() {
  localStorage.setItem("lastAccessTime", parseInt(new Date().getTime() / 1000));
}

function analytics() {
  const        currentTime = parseInt(new Date().getTime() / 1000);
  const lastTimeFirstClick = parseInt(localStorage.getItem("lastTimeFirstClick"));

  const todayClicks = (parseInt(localStorage.getItem("todayClicks")) || 0) + 1;
  const totalClicks = (parseInt(localStorage.getItem("totalClicks")) || 0) + 1;
  let       numDays = (parseInt(localStorage.getItem("numDays")) || 0);
  let    streakDays = (parseInt(localStorage.getItem("streakDays")) || 1);

  if (isNaN(lastTimeFirstClick)) {
    localStorage.setItem("lastTimeFirstClick", currentTime);
  }

  const date1 = new Date(lastTimeFirstClick * 1000).setHours(0,0,0,0);
  const date2 = new Date(currentTime * 1000).setHours(0,0,0,0);

  const diffDays = (date2 - date1) / (24 * 60 * 60 * 1000);

  if (diffDays === 0) {
    localStorage.setItem("todayClicks", todayClicks);
  }
  else {
    localStorage.setItem("lastTimeFirstClick", currentTime);
    localStorage.setItem("todayClicks", 1);
    localStorage.setItem("numDays", ++numDays);

    if (diffDays == 1)
      localStorage.setItem("streakDays", ++streakDays);
    else
      localStorage.setItem("streakDays", 1);
  }

  localStorage.setItem("totalClicks", totalClicks);

//--- Start Trophy
  if (totalClicks == 33)
    localStorage.setItem("_badge1", true);
  else if (totalClicks == 1000)
    localStorage.setItem("_badge2", true);
  else if (totalClicks == 10000)
    localStorage.setItem("_badge8", true);

  if (todayClicks == 1000)
    localStorage.setItem("_badge3", true);

  if (streakDays == 3)
    localStorage.setItem("_badge4", true);
  else if (streakDays == 7)
    localStorage.setItem("_badge5", true);
  else if (streakDays == 30)
    localStorage.setItem("_badge6", true);

  if (numDays == 100)
    localStorage.setItem("_badge7", true);
//--- End Trophy   
}

lastAccessTime();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(function (sw) {
      console.info("ServiceWorker registered: ", sw.scope);

      var isUpdate = false;
      if (sw.active)
        isUpdate = true;

      sw.onupdatefound = function(event) {
        sw.installing.onstatechange = function(event) {
          if (this.state === "installed") {
            console.info("Service Worker Installed.");
            if (isUpdate) {
              window.location.reload(false);
            }
            else {
              console.info("Ready for offline use.");
            }
          }
          else {
            console.info("New Service Worker state:", this.state);
          }
        };
      };
    });
}
