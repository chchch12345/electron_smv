

function confirm_restart(el) {

    el.parentNode.parentNode.style.display = 'none';
    // if (confirm(question)) {

    fooRestart();
    // alert("Processing...");
    // console.log('restart')

    // } else {
    //     return false;
    // }

}

function confirm_off(el) {
    // if (confirm(question)) {

    el.parentNode.parentNode.style.display = 'none';

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch('/off', options);

    return true;

    // } else {
    //     return false;
    // }
}

function confirm_system(el) {
    el.parentNode.parentNode.style.display = 'none';

    // console.log(document.getElementById("InpVol").value)
    // console.log(document.getElementById("InpBrig").value)
    
    const data = { volume: document.getElementById("InpVol").value, brightness: document.getElementById("InpBrig").value};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch('/SetVolB', options).then(function (data) {});

    return true;
}

function confirm_screenshot(el) {
    el.parentNode.parentNode.style.display = 'none';

    console.log(document.getElementById("ddlSS").value)

    if(Number(document.getElementById("SSIntTxt").value)<30)
    {
        document.getElementById("SSIntTxt").value = 30
    }
    if(Number(document.getElementById("SSIntTxt").value)>3600)
    {
        document.getElementById("SSIntTxt").value = 3600
    }
    console.log(document.getElementById("SSIntTxt").value)

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
            FooSet(data.serIP, data.serIPcus,  data.iden , data.isSerdefault , data.isSchdefault,  data.isttsh , document.getElementById("ddlSS").value , document.getElementById("SSIntTxt").value );
            fetch('/updateSS', options).then(function (response) {})
        })  
}

function FooSet(IP, IPcus, IDENTITY, Flag, SchFlag , ttsh , SS , SSvalue) {
    console.log(txtiden.value)
    const iden = IDENTITY;
    const serIP = IP;
    const serIPcus = IPcus;
    const isSerdefault = Flag;
    const isSchdefault = SchFlag;
    const isttsh = ttsh;
    const isScreenShot = SS;
    const SSInt = SSvalue;
    const data = { iden: iden, serIP: serIP, serIPcus: serIPcus, isSerdefault: isSerdefault, isSchdefault: isSchdefault , isttsh: isttsh , isScreenShot: isScreenShot , SSInt: SSInt };
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

function fooRestart() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch('/restart', options);


    return true;
}

function Setdefault() {
    //document.body.className = 'freeze'
    document.getElementById("loadings").style.display = "block";
    document.getElementById("loadingsMSG").style.display = "block";
    document.getElementById("btnreset").className = 'freeze';
    document.getElementById("btnsslog").className = 'freeze';
    document.getElementById("btneelog").className = 'freeze';
    document.getElementById("btnss").className = 'freeze';

    var isemptyfile = 0;
    var ethmac = '';
    var ident = '';
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
                //console.log(data.empty)
                //console.log(isemptyfile)
                isemptyfile = 1;
            } else {
                txtiden.value = data.iden;
                // ident = data.iden;
                if (data.serIPcus == '') {
                    txtserurlcustom.value = data.serIPcus;
                    hdnCIP.value = "nots"
                }
                else {
                    if (data.serIPcus.substring(0, 5) == "https") {
                        hdnCIP.value = "gots"
                        txtserurlcustom.value = data.serIPcus.substr(8);
                        document.getElementById("ddlprotocolcus").value = 'gots'
                    } else {
                        hdnCIP.value = "nots"
                        txtserurlcustom.value = data.serIPcus.substr(7);
                        document.getElementById("ddlprotocolcus").value = 'nots'
                    }
                }

                if (data.serIP == '') {
                    txtserurl.value = data.serIP;
                    hdnDIP.value = "nots"
                }
                else {
                    if (data.serIP.substring(0, 5) == "https") {
                        hdnDIP.value = "gots"
                        txtserurl.value = data.serIP.substr(8);
                        document.getElementById("ddlprotocoldef").value = 'gots'
                    } else {
                        hdnDIP.value = "nots"
                        txtserurl.value = data.serIP.substr(7);
                        document.getElementById("ddlprotocoldef").value = 'nots'
                    }
                }

                if (data.isSerdefault == '1') {
                    document.getElementById("ddlprotocoldef").value = hdnDIP.value;
                    // document.getElementById("txtserurlcustom").style.display = "none";
                    // document.getElementById("txtserurl").style.display = "block";
                    document.getElementById("customIPdiv").style.display = "none";

                    document.getElementById("rdbdefault").checked = true
                } else {
                    document.getElementById("ddlprotocolcus").value = hdnCIP.value;
                    // document.getElementById("txtserurlcustom").style.display = "block";
                    // document.getElementById("txtserurl").style.display = "none";

                    document.getElementById("customIPdiv").style.display = "block";

                    document.getElementById("rdbcustom").checked = true
                }

                if (data.isSchdefault == 1) {
                    document.getElementById("rdbserver").checked = true
                } else {
                    document.getElementById("rdblocal").checked = true
                }


            }
        })
    fetch('/network', options).then(function (response) {
        return response.json()
    })
        .then(function (data) {
            console.log(data)
            Object.keys(data).forEach(function (key) {
                console.log(key, data[key]);
                if (data[key].name == 'Wi-Fi') {
                    //cont
                    document.getElementById('lblcontwifimac').innerHTML = data[key].mac_address;
                    document.getElementById('lblcontwifiip').innerHTML = data[key].ip_address == null ? '0.0.0.0' : data[key].ip_address;
                    document.getElementById('lblcontwifistatus').innerHTML = data[key].ip_address == null ? 'Disconnected' : 'Connected';
                    if (data[key].ip_address == null) { document.getElementById('lblcontwifistatus').style.color = "red" }
                    else { document.getElementById('lblcontwifistatus').style.color = "green" }

                    if (data[key].ip_address != null) {
                        document.querySelector('#btnsslog').setAttribute("onclick", "window.location='http://" + data[key].ip_address + "/admin/download/success_log'")
                        document.querySelector('#btneelog').setAttribute("onclick", "window.location='http://" + data[key].ip_address + "/admin/download/error_log'")
                        document.querySelector('#btnss').setAttribute("onclick", "window.location='http://" + data[key].ip_address + "/zip'")
                    }
                }
                if (data[key].name.startsWith('Ethe') || data[key].name.startsWith('eth')) {
                    //cont
                    document.getElementById('lblcontethmac').innerHTML = data[key].mac_address;
                    document.getElementById('lblcontethip').innerHTML = data[key].ip_address == null ? '0.0.0.0' : data[key].ip_address;
                    document.getElementById('lblcontethstatus').innerHTML = data[key].ip_address == null ? 'Disconnected' : 'Connected';
                    if (data[key].ip_address == null) { document.getElementById('lblcontethstatus').style.color = "red" }
                    else { document.getElementById('lblcontethstatus').style.color = "green" }

                    // txtiden.value = ident;
                    //document.body.className = '';
                    document.getElementById("loadings").style.display = "none";
                    document.getElementById("loadingsMSG").style.display = "none";

                    document.getElementById("btnreset").className = '';
                    document.getElementById("btnsslog").className = '';
                    document.getElementById("btneelog").className = '';
                    document.getElementById("btnss").className = '';
                    if (data[key].ip_address != null) {
                        document.querySelector('#btnsslog').setAttribute("onclick", "window.location='http://" + data[key].ip_address + "/admin/download/success_log'")
                        document.querySelector('#btneelog').setAttribute("onclick", "window.location='http://" + data[key].ip_address + "/admin/download/error_log'")
                        document.querySelector('#btnss').setAttribute("onclick", "window.location='http://" + data[key].ip_address + "/zip'")
                    }
                }

            });
        })

    fetch('/GetCurrentExtend', options).then(function (response) {
        return response.json()
    })
        .then(function (data) {
            //console.log(data.length)
            if(data.length >0){
                document.getElementById("showExtend").style.display = "block";
                document.getElementById("showttsh2").style.display = "block";
                document.getElementById("showttsh1").style.display = "none";
                
            }else{
                document.getElementById("showExtend").style.display = "none";
                document.getElementById("showttsh1").style.display = "block";
                document.getElementById("showttsh2").style.display = "none";

            }
        })


    return true;
};

function logout() {

    window.location.href = '../';

    return true;
}

function serConSave() {
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
            var schetype = document.querySelector('input[name="cake"]:checked').value
            if (document.querySelector('input[name="drone"]:checked').value == 1) {
                if (txtserurl.value == '') {
                    FooSet(txtserurl.value, data.serIPcus, txtiden.value, '1', schetype , data.isttsh , data.isScreenShot  , data.SSInt);
                    hdnDIP.value = 'nots';
                } else {
                    if (document.getElementById("ddlprotocoldef").value == 'nots') {
                        hdnDIP.value = 'nots';
                        FooSet('http://' + txtserurl.value, data.serIPcus, txtiden.value, '1', schetype , data.isttsh , data.isScreenShot  , data.SSInt);
                    } else {
                        hdnDIP.value = 'gots';
                        FooSet('https://' + txtserurl.value, data.serIPcus, txtiden.value, '1', schetype , data.isttsh , data.isScreenShot  , data.SSInt);
                    }
                }
            } else {
                if (txtserurlcustom.value == '') {
                    FooSet(data.serIP, txtserurlcustom.value, txtiden.value, '0', schetype , data.isttsh , data.isScreenShot  , data.SSInt);
                    hdnCIP.value = 'nots';
                } else {
                    if (document.getElementById("ddlprotocolcus").value == 'nots') {
                        hdnCIP.value = 'nots';
                        FooSet(data.serIP, 'http://' + txtserurlcustom.value, txtiden.value, '0', schetype , data.isttsh , data.isScreenShot  , data.SSInt);
                    } else {
                        hdnCIP.value = 'gots';
                        FooSet(data.serIP, 'https://' + txtserurlcustom.value, txtiden.value, '0', schetype , data.isttsh , data.isScreenShot  , data.SSInt);
                    }
                }
            }

        })
}

function reset() {
    txtiden.value = document.getElementById('lblcontethmac').innerHTML.replace(/:/gi, '');
}

function handleClick(drone) {
    console.log(drone.value);
    if (drone.value == 1) {
        document.getElementById("ddlprotocoldef").value = hdnDIP.value;
        // document.getElementById("txtserurlcustom").style.display = "none";
        // document.getElementById("txtserurl").style.display = "block";

        document.getElementById("customIPdiv").style.display = "none";

    }
    else {
        document.getElementById("ddlprotocolcus").value = hdnCIP.value;
        // document.getElementById("txtserurl").style.display = "none";
        // document.getElementById("txtserurlcustom").style.display = "block"

        document.getElementById("customIPdiv").style.display = "block";
    }
}


if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}


function Goshc() {
    window.location.href = '../schedule';

    return true;
}

function Goext() {
    window.location.href = '../extend';

    return true;
}

function Gottsh() {
    window.location.href = '../ttsh';

    return true;
}


function ConfirmPopOFF() {
    document.getElementById("popmsgqueryoff").className = "alertConfirm";
    document.getElementById("popmsgqueryoff").style.display = "block";
}

function ConfirmPopRES() {
    document.getElementById("popmsgqueryrestart").className = "alertConfirm";
    document.getElementById("popmsgqueryrestart").style.display = "block";
}


function ConfirmPopSys() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch('/GetVolB', options).then(function (response) {
        return response.json()
    })
        .then(function (data) {
            //console.log(data)
            document.getElementById("InpVol").value = data.v
            document.getElementById("txtvol").textContent = data.v
            document.getElementById("InpBrig").value = data.b*10
            document.getElementById("txtbrig").textContent = data.b*10

            document.getElementById("popSystemControl").className = "alertConfirm2";
            document.getElementById("popSystemControl").style.display = "block";
        })
}

function updateTxtvol(v) {
    document.getElementById("txtvol").textContent = v;    
}

function updateTxtbrig(v) {
    document.getElementById("txtbrig").textContent = v;    
}

function ConfirmPopSS() {
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

                document.getElementById("ddlSS").value = data.isScreenShot
                document.getElementById("SSIntTxt").value = data.SSInt

                document.getElementById("popScreenShotControl").className = "alertConfirm2";
                document.getElementById("popScreenShotControl").style.display = "block";
            
                if(document.getElementById("ddlSS").value == 1)
                {
                    document.getElementById("SSIntDiv").style.display = "block";
                }else{
                    document.getElementById("SSIntDiv").style.display = "none";
                }
            }
        })
    return true;
}

function dllSSonchange() {
    if(document.getElementById("ddlSS").value == 1)
    {
        document.getElementById("SSIntDiv").style.display = "block";
    }else{
        document.getElementById("SSIntDiv").style.display = "none";
    }
}








