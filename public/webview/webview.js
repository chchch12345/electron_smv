
function FooSet(startUp, IP, IPcus, IDENTITY, Flag, SchFlag, ttsh, SS , SSvalue , Signage) {
    const iden = IDENTITY;
    const serIP = IP;
    const serIPcus = IPcus;
    const isSerdefault = Flag;
    const isSchdefault = SchFlag;
    const isttsh = ttsh;
    const isScreenShot = SS;
    const SSInt = SSvalue;
    const isSignage = Signage;
    const isStartup = startUp;
    const data = { startup: isStartup, iden: iden, serIP: serIP, serIPcus: serIPcus, isSerdefault: isSerdefault, isSchdefault: isSchdefault , isttsh: isttsh , isScreenShot: isScreenShot , SSInt: SSInt , isSignage: isSignage };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch('/writefile', options).then(function (response) {
        return response.json()
    })
        .then(function (data) {
            console.log('writefilemsg : ' + data.msg)
            if (data.msg == 1) {
                if (document.getElementById("popmsgcontent").innerHTML != "SAVE SUCCESSFUL !") { document.getElementById("popmsgcontent").innerHTML = "SAVE SUCCESSFUL !"; }
                document.getElementById("popmsg").className = "alertScc";
                document.getElementById("popmsg").style.display = "block";
                setTimeout(function () { document.getElementById("popmsg").style.display = "none"; }, 3000);
                //alert("The file was saved!")
            } else {
                if (document.getElementById("popmsgcontent").innerHTML != "error!") { document.getElementById("popmsgcontent").innerHTML = "error!"; }
                document.getElementById("popmsg").className = "alertErr";
                document.getElementById("popmsg").style.display = "block";
                setTimeout(function () { document.getElementById("popmsg").style.display = "none"; }, 3000);
                // alert("error!")
            }
        })


    return true;
}

function Setdefault() {
        const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch('/fetchdata', options).then(function (response) {
        return response.json()
    })
        .then(function (data) {
            console.log(data)
            document.getElementById("webid").value = data.id
        })
    return true;
};

function btnSave() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch('/fetchdata', options).then(function (response) {
        return response.json()
    })
        .then(function (data) {
            console.log(data)
            FooSet(data.startup, data.serIP, data.serIPcus,  data.iden , data.isSerdefault , data.isSchdefault,  document.getElementById("ddlfunctionality").value  , data.isScreenShot  , data.SSInt , data.isSignage );
        })
}

function backConfig() {
    window.location.href = '../config';

    return true;
}






