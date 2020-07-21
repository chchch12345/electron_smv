
function backConfig() {
    window.location.href = '../config';

    return true;
}

function logout() {

    window.location.href = '../';

    return true;
}

function Setdefault() {

    this.DRbtnClick();
    //this.valid_save_check();
}


function makelist(array) {
    // Create the list element:
    console.log(array)
    var list = document.createElement('ul');
    list.setAttribute('style', 'list-style: decimal inside none;display: table;white-space: nowrap;font-size: large;');

    var sortedarray = array.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)); 

    Object.keys(sortedarray).forEach(function (key) {

        var label = document.createElement("label");
        label.setAttribute('style', 'display: contents;width: 100%;margin:0;');
        label.innerHTML = "[Device ID : "+ sortedarray[key].id + "] [ X : " + sortedarray[key].d.x + " , Y : " + sortedarray[key].d.y + "] ";
        // label.innerHTML = "[x : " + array[key].d.x + " , y : " + array[key].d.y + "] ";

        // var button = document.createElement("button");
        // button.innerHTML = 'ADD';
        // button.setAttribute('style', 'width: 10%;margin-left: 20px;');

        // button.onclick = function () {
        //     console.log(button.parentNode)
        //     console.log(button.parentNode.children[1].value)
        //     document.getElementById('MAList').appendChild(button.parentNode);
        //     button.parentNode.removeChild(button.parentNode.children[2])
        //     //  button.parentNode.parentNode.removeChild(button.parentNode);
        //     document.getElementById("showSave").style.display = "block";
        //     return;
        // };

        // var input = document.createElement("input");
        // input.setAttribute("style", 'height: 2.75em;padding-left: 1%;width: 55%;box-shadow: 0 0 0 1px lightblue;border-radius: 4px;border: none;');
        // input.setAttribute("value", '');

        var item = document.createElement('li');
        item.style.fontFamily = 'monospace';
        item.style.fontWeight = 'bold';
        item.style.padding = '5px';
        item.style.color = 'lightslategray';
        item.style.textIndent = '-1%';

        var inputID = document.createElement("input");
        inputID.setAttribute("type", "hidden");
        // inputID.setAttribute("value", "x" + JSON.stringify(array[key].x).replace("-", "n") + "y" + JSON.stringify(array[key].y).replace("-", "n"));
        inputID.setAttribute("value", JSON.stringify(sortedarray[key].id));

        item.appendChild(label);
        // item.appendChild(input);
        // item.appendChild(button);
        item.appendChild(inputID);

        list.appendChild(item);

    });

    return list;
}

function makeUrllist(array,urldoc, storedata) {
    // Create the list element:
    console.log(array)
    console.log(urldoc)
    console.log(storedata)
    var list = document.createElement('ul');
    list.setAttribute('style', 'list-style: decimal inside none;');

    var sortedarray = array.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)); 

    if(storedata.length >0)
    {
         document.getElementById("showUpdate").style.display = "block";
    }else
    {
         document.getElementById("showUpdate").style.display = "none";
    }
    
    Object.keys(sortedarray).forEach(function (key) {

        // var label = document.createElement("label");
        // label.setAttribute('style', 'float: left;width: 50%;margin:0;');
        // label.innerHTML = "test ";
        // label.innerHTML = "[x : " + array[key].d.x + " , y : " + array[key].d.y + "] ";

        // var button = document.createElement("button");
        // button.innerHTML = 'ADD';
        // button.setAttribute('style', 'width: 10%;margin-left: 20px;');

        // button.onclick = function () {
        //     console.log(button.parentNode)
        //     console.log(button.parentNode.children[1].value)
        //     document.getElementById('MAList').appendChild(button.parentNode);
        //     button.parentNode.removeChild(button.parentNode.children[2])
        //     //  button.parentNode.parentNode.removeChild(button.parentNode);
        //     document.getElementById("showSave").style.display = "block";
        //     return;
        // };

        // var input = document.createElement("input");
        // input.setAttribute("style", 'height: 2.75em;padding-left: 1%;width: 55%;box-shadow: 0 0 0 1px lightblue;border-radius: 4px;border: none;');
        // input.setAttribute("value", '');

        var item = document.createElement('li');
        item.style.fontFamily = 'monospace';
        item.style.fontWeight = 'bold';
        item.style.padding = '5px';
        item.style.color = 'lightslategray';

        var inputID = document.createElement("input");
        inputID.setAttribute("type", "hidden");
        inputID.setAttribute("value", JSON.stringify(sortedarray[key].id));

        var urlddl = document.createElement('select');
        urlddl.setAttribute('style', 'margin-left: 2%;width: 20%;height: 10%;display: initial;text-align: center;text-align-last: center;');

        var option = new Option('Select Url', 'value', false, '');
        urlddl.appendChild(option);

        if(urldoc.docs.length >0)
        {
            for (let i = 0; i < urldoc.docs.length; i++) {
                option = document.createElement('option');
                option.text = urldoc.docs[i].description;
                option.value = urldoc.docs[i].url;
                if(storedata.length>0)
                {
                   try {
                        if(urldoc.docs[i].url == storedata[key].url)
                        {
                            option.selected = urldoc.docs[i].url;
                        }
                    }
                    catch(err) {

                    }
                }
                urlddl.appendChild(option);
              }
            //   console.log(storedata[key].url)
        }
        
        // item.appendChild(label);
        item.appendChild(urlddl);
        // item.appendChild(input);
        // item.appendChild(button);
        item.appendChild(inputID);

        list.appendChild(item);

    });

    return list;
}

function makeDBlist(displays,array) {
    var list = document.createElement('ul');
    list.setAttribute("id", "MAList");
    list.setAttribute('style', 'list-style-type:decimal;');

    var sortedarray = array.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)); 

    Object.keys(sortedarray).forEach(function (key) {
        //console.log(array[key]._id)
            var x 
            var y
            var id

            Object.keys(displays).forEach(function (key2) {
                if(displays[key2].id == sortedarray[key]._id)
                {
                    id = displays[key2].id
                    x = displays[key2].d.x
                    y = displays[key2].d.y
                }
            })

            // var x = JSON.stringify(array[key]._id).replace(/"/g, "").split('y')[0].replace('x', '').replace('n', '-');
            // var y = JSON.stringify(array[key]._id).replace(/"/g, "").split('y')[1].replace('n', '-');

        var label = document.createElement("label");
        label.setAttribute('style', 'float: left;width: 25%;margin:0;');
        label.innerHTML = "[Device ID : "+ id + "]<br>[X : " + x + " , Y : " + y + "] ";

        var input = document.createElement("input");
        input.setAttribute("style", 'height: 2.75em;padding-left: 1%;width: 55%;box-shadow: 0 0 0 1px lightblue;border-radius: 4px;border: none;');
        input.setAttribute("value", sortedarray[key].url);

        var button = document.createElement("button");
        button.innerHTML = 'DELETE';
        button.setAttribute('style', 'width: 10%;margin-left: 20px;');

        button.onclick = function () {
            console.log(button.parentNode)
            console.log(button.parentNode.children[2].value)
            button.parentNode.parentNode.removeChild(button.parentNode)

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([{ id: button.parentNode.children[2].value }])
            };

            fetch('/deleteExtend', options)

            return;
        };

        var item = document.createElement('li');
        item.style.fontFamily = 'monospace';
        item.style.fontWeight = 'bold';
        item.style.padding = '5px';
        item.style.color = 'lightslategray';

        var inputID = document.createElement("input");
        inputID.setAttribute("type", "hidden");
        inputID.setAttribute("value", sortedarray[key]._id);

        item.appendChild(label);
        item.appendChild(input);
        item.appendChild(inputID);
        item.appendChild(button);

        list.appendChild(item);
    });

    return list;
}

function DRbtnClick() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch('/GetCurrentExtend', options).then(function (response) {
        return response.json()
    })
        .then(function (AlldisplayData) {
            fetch('/getDBExtend', options).then(function (response) {
                return response.json()
            })
                .then(function (AllDBData) {
                    // var clonedObjDisplay = Object.assign({}, AlldisplayData);
                    // var flux = [];

                    // AlldisplayData.forEach(function (Ditem, Dindex, Dobject) {
                    //     // var tempid = "x" + JSON.stringify(Ditem.d.x).replace("-", "n") + "y" + JSON.stringify(Ditem.d.y).replace("-", "n");
                    //     var tempid = Ditem.id
                    //     AllDBData.forEach(function (DBitem, DBindex, DBobject) {
                    //         if (tempid == DBitem._id) {
                    //             flux.push(Dindex)
                    //         }
                    //     });
                    // });
                    // flux.reverse();
                    // flux.forEach(function (f) {
                    //     AlldisplayData.splice(f, 1);
                    // });

                    if (document.getElementById('MunAList').children.length > 0) {
                        var myNode = document.getElementById("MunAList");
                        while (myNode.firstChild) {
                            myNode.removeChild(myNode.firstChild);
                        }
                    }
                    document.getElementById('MunAList').appendChild(makelist(AlldisplayData));

                    if (document.getElementById('UrlList').children.length > 0) {
                        var myNode = document.getElementById("UrlList");
                        while (myNode.firstChild) {
                            myNode.removeChild(myNode.firstChild);
                        }
                    }
                    // document.getElementById('MAList').appendChild(makeDBlist(AllDBData));
                    fetch('/Getdb4Excel', options).then(function (res) { return res.json() }).then(function (urlDoc) {
                        document.getElementById('UrlList').appendChild(makeUrllist(AlldisplayData,urlDoc,AllDBData));
                    })
               
                    // document.getElementById('MAList').parentNode.replaceChild(makeDBlist(clonedObjDisplay,AllDBData), document.getElementById('MAList'))
                    
                    //this.valid_save_check();
                })

        })
}

function SAbtnClick() {
    // console.log(document.getElementById('MAList'));

    var saveExtendList = [];
    var ul = document.getElementById("UrlList");
    var items = ul.getElementsByTagName("li");
    
    for (var i = 0; i < items.length; ++i) {
        saveExtendList.push({ did: items[i].lastElementChild.value, url: items[i].firstElementChild.value });
    }
    console.log(saveExtendList)
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(saveExtendList)
    };

    fetch('/saveExtend', options).then(function (response) {
        return response.json()
    })
        .then(function (data) {

            if (data.msg == 1) {
                if (document.getElementById("popmsgcontent").innerHTML != "SAVE SUCCESSFUL !") { document.getElementById("popmsgcontent").innerHTML = "SAVE SUCCESSFUL !"; }
                document.getElementById("popmsg").className = "alertScc";
                document.getElementById("popmsg").style.display = "block";
                setTimeout(function () { document.getElementById("popmsg").style.display = "none"; }, 3000);
                this.DRbtnClick();
            } else {
                if (document.getElementById("popmsgcontent").innerHTML != "error!") { document.getElementById("popmsgcontent").innerHTML = "error!"; }
                document.getElementById("popmsg").className = "alertErr";
                document.getElementById("popmsg").style.display = "block";
                setTimeout(function () { document.getElementById("popmsg").style.display = "none"; }, 3000);
                // alert("error!")
            }
        })
}

function UDbtnClick() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch('/UpdateExtendDisplay', options).then(function (response) { return response.json() }).then(function (data) {})
}

function IDENbtnClick() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch('/ShowExtendDisplayID', options).then(function (response) { return response.json() }).then(function (data) {})
}

function valid_save_check() {
    console.log(document.getElementById('MAList').childNodes.length)
    if (document.getElementById('MAList').childNodes.length > 0) {
        document.getElementById("showSave").style.display = "block";
    } else {
        document.getElementById("showSave").style.display = "none";
    }

}



