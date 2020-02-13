
function FooSet(IP, IPcus, IDENTITY, Flag, SchFlag, ttsh) {
    const iden = IDENTITY;
    const serIP = IP;
    const serIPcus = IPcus;
    const isSerdefault = Flag;
    const isSchdefault = SchFlag;
    const isttsh = ttsh;
    const data = { iden: iden, serIP: serIP, serIPcus: serIPcus, isSerdefault: isSerdefault, isSchdefault: isSchdefault , isttsh: isttsh };
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
            if (data.empty) {
                isemptyfile = 1;
            } else {
                console.log(data.isttsh)
                document.getElementById("ddlfunctionality").value = data.isttsh

            }
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
            FooSet(data.serIP, data.serIPcus,  data.iden , data.isSerdefault , data.isSchdefault,  document.getElementById("ddlfunctionality").value );
        })
}

function backConfig() {
    window.location.href = '../config';

    return true;
}






