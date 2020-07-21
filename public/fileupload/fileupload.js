
function FooSet(IP, IPcus, IDENTITY, Flag, SchFlag, ttsh, SS , SSvalue , Signage) {
    const iden = IDENTITY;
    const serIP = IP;
    const serIPcus = IPcus;
    const isSerdefault = Flag;
    const isSchdefault = SchFlag;
    const isttsh = ttsh;
    const isScreenShot = SS;
    const SSInt = SSvalue;
    const isSignage = Signage;
    const data = { iden: iden, serIP: serIP, serIPcus: serIPcus, isSerdefault: isSerdefault, isSchdefault: isSchdefault , isttsh: isttsh , isScreenShot: isScreenShot , SSInt: SSInt , isSignage: isSignage };
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

function makelist(array) {
    // Create the list element:
    
    var list = document.createElement('ul');
    list.setAttribute('style', 'list-style-type:decimal;');

    Object.keys(array).forEach(function (key) {
        Object.keys(array[key]).forEach(function (key2) {
            console.log(array[key][key2].url)
            var inputUrl = document.createElement("input");
            inputUrl.setAttribute("style", 'height: 2.75em;padding-left: 1%;width: 20%;box-shadow: 0 0 0 1px lightblue;border-radius: 4px;border: none;');
            inputUrl.setAttribute("value",  array[key][key2].url);
    
            // var button = document.createElement("button");
            // button.innerHTML = 'ADD';
            // button.setAttribute('style', 'width: 10%;margin-left: 20px;');
    
            // button.onclick = function () {
            //     console.log(button.parentNode)
            //     console.log(button.parentNode.children[1].value)
            //     document.getElementById('MAList').appendChild(button.parentNode);
            //     button.parentNode.removeChild(button.parentNode.children[2])
            //      button.parentNode.parentNode.removeChild(button.parentNode);
            //     document.getElementById("showSave").style.display = "block";
            //     return;
            // };
    
            var inputDesc = document.createElement("input");
            inputDesc.setAttribute("style", 'margin-left: 1%;height: 2.75em;padding-left: 1%;width: 20%;box-shadow: 0 0 0 1px lightblue;border-radius: 4px;border: none;');
            inputDesc.setAttribute("value", array[key][key2].description);
    
            var item = document.createElement('li');
            item.style.fontFamily = 'monospace';
            item.style.fontWeight = 'bold';
            item.style.padding = '5px';
            item.style.color = 'lightslategray';
    
            var inputID = document.createElement("input");
            inputID.setAttribute("type", "hidden");
            inputID.setAttribute("value", array[key][key2]._id);
    
            item.appendChild(inputUrl);
            item.appendChild(inputDesc);
            // item.appendChild(button);
            item.appendChild(inputID);
    
            list.appendChild(item);
        })


    });

    return list;
}

function refreshData() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch('/Getdb4Excel', options).then(function (response) {
        return response.json()
    })
        .then(function (data) {
            console.log(data.docs.length)

            if(data.docs.length >0)
            {
                document.getElementById("showRemoveAll").style.display = "block";
                document.getElementById("listTitle").style.display = "inline-flex";

            if (document.getElementById('DataList').children.length > 0) {
                var myNode = document.getElementById("DataList");
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.firstChild);
                }
            }
            document.getElementById('DataList').appendChild(makelist(data));
            }else{
                document.getElementById("showRemoveAll").style.display = "none";
                document.getElementById("listTitle").style.display = "none";

                if (document.getElementById('DataList').children.length > 0) {
                    var myNode = document.getElementById("DataList");
                    while (myNode.firstChild) {
                        myNode.removeChild(myNode.firstChild);
                    }
                }
            }

        })
}

function Setdefault() {
    refreshData();
    return true;
};

function backConfig() {
    window.location.href = '../config';

    return true;
}

function removeall() {
        const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch('/deleteAlldb4Excel', options).then(function (response) {
        return response.json()
    })
        .then(function (data) {
            console.log(data.delN)
            refreshData();
        })
    return true;
}

function validateForm(){
    console.log(document.getElementsByName('filename')[0].files.length)
    if(document.getElementsByName('filename')[0].files.length > 0)
    {
        return true;
    }else
    {
        return false;
    }
}








