

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
    this.valid_save_check();
}

function makelist(array) {
    // Create the list element:
    var list = document.createElement('ul');
    list.setAttribute('style', 'list-style-type:none;');

    Object.keys(array).forEach(function (key) {

        var label = document.createElement("label");
        label.setAttribute('style', 'float: left;width: 25%;margin:0;');
        label.innerHTML = "[x : " + array[key].x + " , y : " + array[key].y + "] ";

        var button = document.createElement("button");
        button.innerHTML = 'ADD';
        button.setAttribute('style', 'width: 10%;margin-left: 20px;');

        button.onclick = function () {
            console.log(button.parentNode)
            console.log(button.parentNode.children[1].value)
            document.getElementById('MAList').appendChild(button.parentNode);
            button.parentNode.removeChild(button.parentNode.children[2])
            //  button.parentNode.parentNode.removeChild(button.parentNode);
            document.getElementById("showSave").style.display = "block";
            return;
        };

        var input = document.createElement("input");
        input.setAttribute("style", 'height: 2.75em;padding-left: 1%;width: 55%;box-shadow: 0 0 0 1px lightblue;border-radius: 4px;border: none;');
        input.setAttribute("value", '');

        var item = document.createElement('li');
        item.style.fontFamily = 'monospace';
        item.style.fontWeight = 'bold';
        item.style.padding = '5px';
        item.style.color = 'lightslategray';

        var inputID = document.createElement("input");
        inputID.setAttribute("type", "hidden");
        inputID.setAttribute("value", "x" + JSON.stringify(array[key].x).replace("-", "n") + "y" + JSON.stringify(array[key].y).replace("-", "n"));


        item.appendChild(label);
        item.appendChild(input);
        item.appendChild(button);
        item.appendChild(inputID);

        list.appendChild(item);

    });

    return list;
}

function makeDBlist(array) {

    var list = document.createElement('ul');
    list.setAttribute("id", "MAList");
    list.setAttribute('style', 'list-style-type:none;');

    Object.keys(array).forEach(function (key) {
        //console.log(array[key]._id)
        var x = JSON.stringify(array[key]._id).replace(/"/g, "").split('y')[0].replace('x', '').replace('n', '-');
        var y = JSON.stringify(array[key]._id).replace(/"/g, "").split('y')[1].replace('n', '-');

        var label = document.createElement("label");
        label.setAttribute('style', 'float: left;width: 25%;margin:0;');
        label.innerHTML = "[x : " + x + " , y : " + y + "] ";

        var input = document.createElement("input");
        input.setAttribute("style", 'height: 2.75em;padding-left: 1%;width: 55%;box-shadow: 0 0 0 1px lightblue;border-radius: 4px;border: none;');
        input.setAttribute("value", array[key].url);

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
        inputID.setAttribute("value", array[key]._id);

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
                    var flux = [];

                    AlldisplayData.forEach(function (Ditem, Dindex, Dobject) {
                        var tempid = "x" + JSON.stringify(Ditem.x).replace("-", "n") + "y" + JSON.stringify(Ditem.y).replace("-", "n");
                        AllDBData.forEach(function (DBitem, DBindex, DBobject) {
                            if (tempid == DBitem._id) {
                                flux.push(Dindex)
                            }
                        });
                    });
                    flux.reverse();
                    flux.forEach(function (f) {
                        AlldisplayData.splice(f, 1);
                    });

                    if (document.getElementById('MunAList').children.length > 0) {
                        var myNode = document.getElementById("MunAList");
                        while (myNode.firstChild) {
                            myNode.removeChild(myNode.firstChild);
                        }
                    }
                    document.getElementById('MunAList').appendChild(makelist(AlldisplayData));

                    if (document.getElementById('MAList').children.length > 0) {
                        var myNode = document.getElementById("MAList");
                        while (myNode.firstChild) {
                            myNode.removeChild(myNode.firstChild);
                        }
                    }
                    // document.getElementById('MAList').appendChild(makeDBlist(AllDBData));
                    document.getElementById('MAList').parentNode.replaceChild(makeDBlist(AllDBData), document.getElementById('MAList'))


                    this.valid_save_check();
                })

        })
}

function SAbtnClick() {
    // console.log(document.getElementById('MAList'));

    var saveExtendList = [];
    var ul = document.getElementById("MAList");
    var items = ul.getElementsByTagName("li");
    for (var i = 0; i < items.length; ++i) {
        console.log(items[i].children[1].value)
        console.log(items[i].children[2].value)

        saveExtendList.push({ _id: items[i].children[2].value, url: items[i].children[1].value });
    }
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

function valid_save_check() {
    console.log(document.getElementById('MAList').childNodes.length)
    if (document.getElementById('MAList').childNodes.length > 0) {
        document.getElementById("showSave").style.display = "block";
    } else {
        document.getElementById("showSave").style.display = "none";
    }

}



