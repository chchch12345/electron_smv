// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
var express = require('express');
var app2 = express();
var http = require('http');
var url = require('url');
var fs = require('fs');
const socketIo = require("socket.io");
var cors = require('cors')
var public = path.join(__dirname, 'public');
var upload = require("express-fileupload");
var Datastore = require('nedb')
//'C:/SMV_venue_client/schedules.db'
const db = new Datastore({ filename: public + '/schedules.db', autoload: true });
const log = require('error-log-file')
var mac = '000000000000';
var DisconTimeout10min;
var server_off_time;
var server_on_time;
var intervalTimeSleep;

//W
var app3 = express();
var http3 = require('http').createServer(app3);
//W

if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        fullscreen: true
    })
    mainWindow.setMenuBarVisibility(false)
    // and load the index.html of the app.
    //   mainWindow.loadFile('index.html')
    mainWindow.loadURL('http://localhost/admin/')
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) { }

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};

app2.use(cors())
app2.use(upload())

app2.use('/admin', express.static(path.join(__dirname, 'public')));
app2.use(express.json({ limit: '1mb' }));

app2.get('/', function (req, res) {
    res.send('Server UP!')
})
app2.get('/admin/config', function (req, res) {
    res.sendFile(path.join(public, '/config/config.html'));
});
app2.get('/admin/schedule', function (req, res) {
    res.sendFile(path.join(public, '/schedule/schedule.html'));
});

app2.get('/admin/screen_off.php', function (req, res) {
var time = 1;

var interval23 = setInterval(function() { 
   if (time <= 3) { 
    off();
    lightoff();
    // console.log(time)
      time++;
   }
   else { 
      clearInterval(interval23);
   }
}, 10000);

res.send('off')
    // off();
    // lightoff();
    // res.send('off')
})

app2.get('/admin/reboot.php', function (req, res) {
    res.send('restart')
    restart();

})

app2.get('/admin/lighton.php', function (req, res) {
    res.send('lighton')
    lighton();
})

app2.get('/admin/lightoff.php', function (req, res) {
    res.send('lightoff')
    lightoff();
})

app2.get('/admin/filedata', function (req, res) {
    fs.readFile(path.join(__dirname, 'config.xml'), "utf8", function read(err, data) {
        if (err) throw err;
        if (data == '') {
            res.send('empty');
        }
        else {
            res.send(JSON.parse(data))
        }
    });
})

app2.get('/admin/signage', function (req, res) {
    openlink();
})

app2.get('/admin/download/success_log', function (req, res) {
    var date = new Date();

    const file = public + `/log/` + date.getFullYear() + `_success_log.txt`
    // const file = `${public}/log/` + date.getFullYear() + `_success_log.txt`;
    res.download(file); // Set disposition and send it.
});

app2.get('/admin/download/error_log', function (req, res) {
    var date = new Date();
    const file = public + `/log/` + date.getFullYear() + `_error_log.txt`
    // const file = `${public}/log/` + date.getFullYear() + `_error_log.txt`;
    res.download(file); // Set disposition and send it.
});

const server = http.createServer(app2);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('socket connected')
    //server check
    var intervalServer = setInterval(function () {
        fs.readFile(path.join(__dirname, 'config.xml'), "utf8", function read(err, data) {
            if (err) throw err;
            if (data == '') {
                //console.log("empty")
                var emitdata = {
                    isreacheable: 'empty',
                    IP: ''
                }
                socket.emit("isreacheble", emitdata)
            }
            else {
                var jsonData = JSON.parse(data);
                if (jsonData.serIP == '') {
                    //console.log("empty")
                    var emitdata = {
                        isreacheable: 'empty',
                        IP: ''
                    }
                    socket.emit("isreacheble", emitdata)
                } else {
                    const isReachable = require('is-reachable');

                    (async () => {

                        if (await isReachable(jsonData.serIP)) {
                            var emitdata = {
                                isreacheable: 'Reachable',
                                IP: jsonData.serIP
                            }
                            socket.emit("isreacheble", emitdata)
                        } else {
                            var emitdata = {
                                isreacheable: 'Unreachable',
                                IP: jsonData.serIP
                            }
                            socket.emit("isreacheble", emitdata)
                        }
                    })();
                }
            }
        });
    }, 11000);
    //server check

    //network 
    var intNetwork = setInterval(function () {
        var network = require('network');
        network.get_interfaces_list(function (err, list) {
            //console.log(list)
            socket.emit("autoupdate", list)
        })
    }, 11000);
    //network 

    socket.on("disconnect", function () {
        console.log("socket disconnected");
        clearInterval(intNetwork);
        clearInterval(intervalServer);
    });
})

app2.post('/upload', function (req, res) {
    if (req.files) {
        console.log(req.files.filename); // the uploaded file object

        var file = req.files.filename,
            fn = file.name;
        if (fn == 'SMV_venue_client.zip') {
            file.mv("./upload/" + fn, function (err) {
                if (err) {
                    console.log(err)
                    res.end("upload file error occured")
                }
                else {
                    //res.end("Success upload")
                    res.sendFile(path.join(public, '/uploadSuc/upload.html'));
                }
            });
        }
        else {
            res.end("Incorrect file for update. Correct example : SMV_venue_client.zip")
        }

    }
});

app2.post('/overritePatchfile', function (req, res) {
    var child_process = require('child_process');

    child_process.exec('C:/SMV_venue_client_update.bat ', function (error, stdout, stderr) {
        console.log(stdout);
        console.log(error);
        console.log(stderr)
    });
});

app2.post('/writefile', (request, response) => {
    console.log(request.body)
    //wf(request.body);

    fs.writeFile(path.join(__dirname, 'config.xml'), JSON.stringify(request.body), function (err) {
        if (err) {
            response.json({
                msg: 0
            });
            response.end();
            return console.log(err);
        } else {
            console.log("The file was saved!");
            response.json({
                msg: 1
            });
            response.end();
        }
    });

})

// app2.post('/off', (request, response) => {
//     off();
// })

app2.post('/restart', (request, response) => {
    restart();
})

app2.post('/cleartimer', (request, response) => {
    clearTimeout(DisconTimeout10min);
})

app2.post('/fetchdata', (request, response) => {
    fs.readFile(path.join(__dirname, 'config.xml'), "utf8", function read(err, data) {
        if (err) throw err;
        if (data == '') {
            //console.log("empty")
            var nodata = {
                empty: 'empty'
            }
            response.json(nodata);
            response.end();
        }
        else {
            response.json(JSON.parse(data));
            response.end();
        }
        console.log(data)
    });
})

app2.post('/setschedule', (request, response) => {
    const cron = require('node-cron')
    cron.schedule("* * * * *", () => {
        console.log("logs every minute");
    })
})

app2.post('/writeschedule', (request, response) => {
    // var Datastore = require('nedb'), db = new Datastore({ filename: 'C:/SMV_venue_client/schedules.db', autoload: true });

    console.log(request.body)
    db.insert(request.body, function (err, newDoc) {   // Callback is optional
        console.log(err)
        console.log(newDoc)
        if (err) {
            response.json({
                msg: 0
            });
            response.end();
            return console.log(err);
        } else {
            if (request.body.cat == 'dsr' || request.body.cat == 'dss') {
                setcron(request.body.cat, request.body.Hcron, request.body.Mcron, request.body.Daycron)
            } else {
                setCustomcron(request.body.cat, request.body.Daycron)
            }
            console.log("The shcedule was saved!");
            response.json({
                msg: 1
            });
            response.end();
        }
    });

})

app2.post('/readschedule', (request, response) => {
    console.log(request.body)
    // var Datastore = require('nedb'), db = new Datastore({ filename: 'C:/SMV_venue_client/schedules.db', autoload: true });
    db.find({ cat: request.body.cat }, { schtime: 1 }, function (err, docs) {
        console.log(docs)
        response.json(docs);
        response.end();
    });
})

app2.post('/deleteschedule', (request, response) => {
    console.log('delete: ID :' + request.body._id)
    // var Datastore = require('nedb'), db = new Datastore({ filename: 'C:/SMV_venue_client/schedules.db', autoload: true });
    db.remove({ _id: request.body._id }, {}, function (err, numRemoved) {
        if (err) { response.json({ msg: err }); response.end(); }
        else {
            response.json({ msg: numRemoved });
            response.end();
        }
    });
})

app2.post('/login', (request, response) => {
    // console.log(request.body)//@dmin888
    if (request.body.id == "admin" && request.body.pw == "@dmin888") {
        response.json({
            res: true
        });
        response.end();
    }
    else {
        response.json({
            res: false
        });
        response.end();
    }
})

app2.post('/network', (request, response) => {
    var network = require('network');
    network.get_interfaces_list(function (err, list) {

        //console.log(list)
        response.json(list)
        response.end();
    })
})

app2.post('/isreacheble', (request, response) => {
    fs.readFile(path.join(__dirname, 'config.xml'), "utf8", function read(err, data) {
        if (err) throw err;
        if (data == '') {
            //console.log("empty")
            var nodata = {
                empty: 'empty'
            }
            response.json(nodata);
            response.end();
        }
        else {
            const isReachable = require('is-reachable');

            (async () => {
                if (await isReachable(data.serIP)) {
                    var data = {
                        isreacheable: 'reachable'
                    }
                    response.json(data);
                    response.end();
                } else {
                    var data = {
                        isreacheable: 'unreachable'
                    }
                    response.json(data);
                    response.end();
                }
            })();
        }
    });
})

app2.post('/autorestart', (request, response) => {
    setTimeout(function () { restart(); }, 600000);
})

app2.post('/getServerSchedule', (request, response) => {
    //mac = '000EC6DC5223'
    fs.readFile(path.join(__dirname, 'config.xml'), "utf8", function read(err, data) {
        var readjsondata;
        if (data != '') {
            readjsondata = JSON.parse(data);
            //console.log('readingschedule:' + readjsondata)
            if(readjsondata.serIP != ''){
                var hostN = readjsondata.serIP.split(':')[1].replace('//','')
                var portN = readjsondata.serIP.split(':')[2]
                // console.log(hostN)
                // console.log(portN)
            const options = {
                hostname: hostN,
                port: portN,
                path: '/Management/Device/Fetch?mac_address=' + readjsondata.iden,
                method: 'GET'
            }
            const req = http.request(options, (res) => {

                req.on('error', (error) => {
                    console.error(error)
                })

                res.on('data', (d) => {
                    try {
                        const jsondata = JSON.parse(d);

                        //for ttsh only
                        server_off_time = new Date(jsondata.data.list[0].screen_off);
                        server_on_time = new Date(jsondata.data.list[0].screen_on);
                        //for ttsh only

                        //console.log(jsondata.data.list[0].screen_off)
                        //console.log(jsondata.data.list[0].screen_on)
                        response.json({ on: jsondata.data.list[0].screen_on, off: jsondata.data.list[0].screen_off, mac: mac });
                        response.end();
                    } catch (e) {
                        errlog('getServerSchedule :' + e)
                        // console.log(e)
                    }
                })
            })

            req.end()
         }
        }
    });
    //for ttsh only 
    setTimeout(function () {
        var dtcurrent = new Date()
        var valid = (dtcurrent > server_off_time)
        var valid1 = (dtcurrent < server_on_time);
        // console.log(valid, valid1)
        if (valid && valid1) { 
            // console.log('valid')
            scclog('call /getServerSchedule :Valid time to sleep')
            isTimeToSleep() }else{
                try {clearInterval(intervalTimeSleep);} catch (e) {}
            }
    }, 20000);
    //for ttsh only
})

function off() {
    // scclog('off() :Display off successfully')
    //require('child_process').spawn('cmd.exe', ['/C', "powershell (Add-Type '[DllImport(\"user32.dll\")]^public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);' -Name a -Pas)::SendMessage(-1,0x0112,0xF170,2)"]);
    var spawn = require('child_process').spawn,
        ls = spawn('cmd.exe', ['/C', "powershell (Add-Type '[DllImport(\"user32.dll\")]^public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);' -Name a -Pas)::SendMessage(-1,0x0112,0xF170,2)"]);

    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code);
        if(code === 0){scclog('off() :Display off successfully')}
    });

}

function offxlog() {
    // scclog('off() :Display off successfully')
    //require('child_process').spawn('cmd.exe', ['/C', "powershell (Add-Type '[DllImport(\"user32.dll\")]^public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);' -Name a -Pas)::SendMessage(-1,0x0112,0xF170,2)"]);
    var spawn = require('child_process').spawn,
        ls = spawn('cmd.exe', ['/C', "powershell (Add-Type '[DllImport(\"user32.dll\")]^public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);' -Name a -Pas)::SendMessage(-1,0x0112,0xF170,2)"]);

    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });

}

function on() {
    var spawn = require('child_process').spawn,
        ls = spawn('cmd.exe', ['/C', "powershell (Add-Type '[DllImport(\"user32.dll\")]^public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);' -Name a -Pas)::SendMessage(-1,0x0112,0xF170,-1)"]);

    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });

    var spawn = require('child_process').spawn,
        ls = spawn('cmd.exe', ['/C', "rundll32 user32.dll,SetCursorPos"]);

    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });

}

function restart() {
    // scclog('restart() :Reboot successfully')
    var spawn = require('child_process').spawn,
        ls = spawn('cmd.exe', ['/C', "shutdown /r /f /t 0"]);

    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code);
        if(code === 0){scclog('restart() :restart successfully')}
    });
}

function servercheck() {

    //light on
    var time2 = 1;

    var interval24 = setInterval(function() { 
       if (time2 <= 3) { 
        lighton();
          time2++;
       }
       else { 
          clearInterval(interval24);
       }
    }, 10000);
    //light on

    var hdnisrestart = 0;
    var intervalNetwork = setInterval(function () {
        var network = require('network');
        network.get_interfaces_list(function (err, list) {
            //  console.log(list)
            // console.log(cnt++)
            var isWifiDC = 0;
            var isLanDC = 0;
            var gotLAN = 0;
            var gotWIFI = 0;
            Object.keys(list).forEach(function (key) {
                if (list[key].name == 'Wi-Fi') {
                    if (list[key].ip_address == null) { isWifiDC = 1 };
                }
                
                if (list[key].name.startsWith('Ethe')) {
                    if (list[key].ip_address == null) { isLanDC = 1 };
                    mac = list[key].mac_address.replace(/:/gi, '')
                }
                if (list[key].name.startsWith('Ethe')) { gotLAN = 1 }
                if (list[key].name.startsWith('Wi-Fi')) { gotWIFI = 1 }
            })
            if(gotLAN == 0){ isLanDC = 1}
            if(gotWIFI == 0){ isWifiDC = 1}
            // console.log('gotLAN :' + gotLAN)
            // console.log('isLanDC :' + isLanDC)
            // console.log('gotWIFI :' + gotWIFI)
            // console.log('isWifiDC :' + isWifiDC)
            // console.log('hdnisrestart.value :' + hdnisrestart)          
            if (isWifiDC == 1 && isLanDC == 1 && hdnisrestart == 0) {
                // console.log('timerstart')
                scclog('servercheck : restart timerstart status: ' + 'GL:'+ gotLAN + ',LID:'+ isLanDC+ ',GW:'+ gotWIFI+ ',WID:'+ isWifiDC)
                hdnisrestart = 1;
                (async () => { await mainWindow.loadURL('http://localhost/admin/')})();
                DisconTimeout10min = setTimeout(function () { 
                    scclog('servercheck : restarting. reason no internet')
                    setTimeout(function () { restart(); }, 10000);
                    }, 600000);
            }
            
            if ((isWifiDC == 0 || isLanDC == 0) && hdnisrestart == 1) {
                // console.log('timerstop')
                scclog('servercheck : restart timerstop status: ' + 'GL:'+ gotLAN + ',LID:'+ isLanDC+ ',GW:'+ gotWIFI+ ',WID:'+ isWifiDC)
                hdnisrestart = 0;
                clearTimeout(DisconTimeout10min);
                (async () => {
                    await openlink();
                })();
            }
        })
    }, 11000);

}

function openlink() {
    //const open = require('open');
    //const sendkeys = require('sendkeys-js')
    // var myInterval =  setInterval(function () {   
    //     if(mac !== '000000000000'){
    var seturl = '';
    fs.readFile(path.join(__dirname, 'config.xml'), "utf8", function read(err, data) {
        if (err) throw err;
        //jsondata.serIP + '/Web/displaySignage.html#/view/' + jsondata.iden 
        var jsondata;
        if (data != '') {
            jsondata = JSON.parse(data);
            if (jsondata.isSerdefault == '1') {
                if (jsondata.serIP != '') { seturl = jsondata.serIP + '/Web/displaySignage.html#/view/' + jsondata.iden }
                else { seturl = 'http://localhost/admin' }
            } else {
                if (jsondata.serIPcus != '') { seturl = jsondata.serIPcus }
                else { seturl = 'http://localhost/admin' }
            }
        } else { seturl = 'http://localhost/admin' }


        (async () => {//http://119.73.206.46:7890/Web/displaySignage.html#/init/b8aeed78f1cb
            // open(seturl);
            await mainWindow.loadURL(seturl)
            //clearInterval(myInterval);
            // for win
            //if (seturl == 'http://localhost/admin') { } else { sendkeys.send('{f11}') }
        })();
    });
    //  }
    // }, 10000);   

}

function setcron(cat, Hcron, Mcron, Daycron) {
    const cron = require('node-cron')
    var setcronstr = Mcron + ' ' + Hcron + ' * ' + ' * ' + Daycron;
    console.log('cat :' + cat)
    console.log(setcronstr)
    var valid = cron.validate(setcronstr);
    console.log('valid : ' + valid)
    if (cat == 'dsr') {
        console.log('display off schedule')
        cron.schedule(setcronstr, () => {
            scclog('server_start_cron() :from local cron')
            var time = 1;
            var interval99 = setInterval(function() { 
                if (time <= 3) { 
                 off();
                 lightoff();
                 // console.log(time)
                   time++;
                }
                else { 
                   clearInterval(interval99);
                }
             }, 10000);
        })
    }
    if (cat == 'dss') {
        console.log('restart schedule')
        cron.schedule(setcronstr, () => {
            restart();
        })
    }


}

function setCustomcron(cat, Daycron) {
    var schedule = require('node-schedule');
    var date = new Date(Daycron);
    console.log('cat :' + cat)
    console.log(date)
    if (cat == 'csr') {
        console.log('custom display off schedule')
        schedule.scheduleJob(date, function () {
            scclog('server_start_cron() :from local cron')
            var time = 1;
            var interval99 = setInterval(function() { 
                if (time <= 3) { 
                 off();
                 lightoff();
                 // console.log(time)
                   time++;
                }
                else { 
                   clearInterval(interval99);
                }
             }, 10000);
        });
    }
    if (cat == 'css') {
        console.log('custom restart schedule')
        schedule.scheduleJob(date, function () {
            // console.log('restartING')
            restart();
        });
    }

}

function server_start_cron() {
    fs.readFile(path.join(__dirname, 'config.xml'), "utf8", function read(err, data) {
        if (err) throw err;
        try {
            var jsondata = JSON.parse(data);
            // console.log(jsondata.isSchdefault)
            if (jsondata.isSchdefault == '0') {
                const cron = require('node-cron')
                var schedule = require('node-schedule');
                // var Datastore = require('nedb'), db = new Datastore({ filename: 'C:/SMV_venue_client/schedules.db', autoload: true });
                db.find({ cat: 'dsr' }, { Hcron: 1, Mcron: 1, Daycron: 1 }, function (err, docs) {
                    console.log(docs)
                    Object.keys(docs).forEach(function (key) {
                        var setcronstr = docs[key].Mcron + ' ' + docs[key].Hcron + ' * ' + ' * ' + docs[key].Daycron;
                        console.log(setcronstr)
                        var valid = cron.validate(setcronstr);
                        console.log('valid set : ' + docs[key]._id)
                        cron.schedule(setcronstr, () => {
                            scclog('server_start_cron() :from local cron')
                            var time = 1;
                            var interval99 = setInterval(function() { 
                                if (time <= 3) { 
                                 off();
                                 lightoff();
                                 // console.log(time)
                                   time++;
                                }
                                else { 
                                   clearInterval(interval99);
                                }
                             }, 10000);
                        })
                    });
                });

                db.find({ cat: 'dss' }, { Hcron: 1, Mcron: 1, Daycron: 1 }, function (err, docs) {
                    console.log(docs)
                    Object.keys(docs).forEach(function (key) {
                        var setcronstr = docs[key].Mcron + ' ' + docs[key].Hcron + ' * ' + ' * ' + docs[key].Daycron;
                        console.log(setcronstr)
                        var valid = cron.validate(setcronstr);
                        console.log('valid set : ' + docs[key]._id)
                        cron.schedule(setcronstr, () => {
                            restart();
                        })
                    });
                });

                db.find({ cat: 'csr' }, { Daycron: 1 }, function (err, docs) {
                    console.log(docs)
                    Object.keys(docs).forEach(function (key) {
                        var date = new Date(docs[key].Daycron);
                        console.log('valid set cust :' + date)
                        schedule.scheduleJob(date, function () {
                            scclog('server_start_cron() :from local cron')
                            var time = 1;
                            var interval99 = setInterval(function() { 
                                if (time <= 3) { 
                                 off();
                                 lightoff();
                                 // console.log(time)
                                   time++;
                                }
                                else { 
                                   clearInterval(interval99);
                                }
                             }, 10000);
                        });
                    });
                });


                db.find({ cat: 'css' }, { Daycron: 1 }, function (err, docs) {
                    console.log(docs)
                    Object.keys(docs).forEach(function (key) {
                        var date = new Date(docs[key].Daycron);
                        console.log('valid set cust :' + date)
                        schedule.scheduleJob(date, function () {
                            // console.log('restartING')
                            restart();
                        });
                    });
                });
            }

        } catch (e) {
            errlog('server_start_cron :' + e)
            // console.log(e)
        }
    });
}
async function errlog(msg) {
    var date = new Date();
    var fileN = date.getFullYear() + '_error_log.txt';
    await log(msg, { fileName: fileN })
}
async function scclog(msg) {
    var date = new Date();
    var fileN = date.getFullYear() + '_success_log.txt';
    await log(msg, { fileName: fileN })
}

function CheckserverSchedule() {
    // var intervalServerSchedule = setInterval(function () {
    //mac = '000EC6DC5223'
    setTimeout(function () {
        fs.readFile(path.join(__dirname, 'config.xml'), "utf8", function read(err, data) {
            var readjsondata;
            if (data != '') {
                readjsondata = JSON.parse(data);
                // console.log(mac)
                if(readjsondata.serIP != ''){
                    var hostN = readjsondata.serIP.split(':')[1].replace('//','')
                    var portN = readjsondata.serIP.split(':')[2]
                    // console.log(hostN)
                    // console.log(portN)
                    const options = {
                        hostname: hostN,
                        port: portN,
                        path: '/Management/Device/Fetch?mac_address=' + readjsondata.iden,
                        method: 'GET'
                    }
                    const req = http.request(options, (res) => {
    
                        req.on('error', (error) => {
                            console.error(error)
                        })
    
                        res.on('data', (d) => {
                            try {
                                const jsondata = JSON.parse(d);
                                console.log(jsondata.data.list[0].screen_off)
                                console.log(jsondata.data.list[0].screen_on)
                                var dtcurrent = new Date()
                                // var dtoff = new Date(jsondata.data.list[0].screen_off);
                                // var dton = new Date(jsondata.data.list[0].screen_on);
                                server_off_time = new Date(jsondata.data.list[0].screen_off);
                                server_on_time = new Date(jsondata.data.list[0].screen_on);
                                var valid = (dtcurrent > server_off_time)
                                var valid1 = (dtcurrent < server_on_time);
                                console.log(valid, valid1)
                                if (valid && valid1) { 
                                    console.log('valid')
                                    scclog('CheckserverSchedule() :Valid time to sleep')
                                    isTimeToSleep() }else{
                                        try {clearInterval(intervalTimeSleep);} catch (e) {}
                                    }
                            } catch (e) {
                                errlog('CheckserverSchedule :' + e)
                                // console.log(e)
                            }
                        })
                    })
    
                    req.end()
                } 
            }
        });
    }, 20000);
    // }, 12000);
}

function serverDellastYearSccLog() {
    var del = require('delete');
    var date = new Date();
    var fileN = date.getFullYear() - 1 + '_success_log.txt';
    var pathD = public + '/log/' + fileN
    // console.log(fileN)
    // async
    del([pathD], function (err, deleted) {
        if (err) throw err;
        // deleted files
        console.log(deleted);
    });

    var fileE = date.getFullYear() + '_error_log.txt'
    var pathE = public + '/log/' + fileE

    fs.access(pathE, fs.F_OK, (err) => {
        if (err) {
            console.log('create errlog');
            errlog('')
            return;
        }
        // console.log('exist')
        // file exists
    });


}

function lighton() {

    //require('child_process').spawn('cmd.exe', ['/C', "powershell (Add-Type '[DllImport(\"user32.dll\")]^public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);' -Name a -Pas)::SendMessage(-1,0x0112,0xF170,2)"]);
    var spawn = require('child_process').spawn,
    ls = spawn('cmd.exe', ['/c', public+"\\light\\CommandApp_USBRelay.exe BITFT open 01"]);

    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code);
        if(code === 0){scclog('lighton() :Display light on successfully')}
    });

}

function lightoff() {
    //require('child_process').spawn('cmd.exe', ['/C', "powershell (Add-Type '[DllImport(\"user32.dll\")]^public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);' -Name a -Pas)::SendMessage(-1,0x0112,0xF170,2)"]);
    var spawn = require('child_process').spawn,
    // ls = spawn('cmd.exe', ['/C', "powershell Powershell.exe -executionpolicy remotesigned -File  %userprofile%\\Desktop\\Light\\lightOFF.ps1"]);
        ls = spawn('cmd.exe', ['/c', public+"\\light\\CommandApp_USBRelay.exe BITFT close 01"]);

    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code);
        if(code === 0){scclog('lightoff() :Display light off successfully')}
    });

}

function lightoffxlog() {
    //require('child_process').spawn('cmd.exe', ['/C', "powershell (Add-Type '[DllImport(\"user32.dll\")]^public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);' -Name a -Pas)::SendMessage(-1,0x0112,0xF170,2)"]);
    var spawn = require('child_process').spawn,
    // ls = spawn('cmd.exe', ['/C', "powershell Powershell.exe -executionpolicy remotesigned -File  %userprofile%\\Desktop\\Light\\lightOFF.ps1"]);
        ls = spawn('cmd.exe', ['/c', public+"\\light\\CommandApp_USBRelay.exe BITFT close 01"]);

    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code);
    });

}
function defaultConfigMacAddr() {

    fs.readFile(path.join(__dirname, 'config.xml'), "utf8", function read(err, data) {
        try {
            var jdata = JSON.parse(data);
            if (jdata.iden == '' && jdata.serIP == '' && jdata.serIPcus == '') {
                var intrWriteMac = setInterval(function () {
                    if (mac !== '000000000000') {
                        jdata.iden = mac
                        fs.writeFile(path.join(__dirname, 'config.xml'), JSON.stringify(jdata), function (err) {
                            clearInterval(intrWriteMac);
                        });
                    }
                });
            }
        } catch (error) { errlog(error) }
    });
}

function isTimeToSleep() {
    intervalTimeSleep = setInterval(function() { 
        var time = 1;
        var intervalsleep = setInterval(function() { 
            if (time <= 3) { 
             offxlog();
             lightoffxlog();
               time++;
            }
            else { 
               clearInterval(intervalsleep);
            }
         }, 10000);

        var dtcurrent = new Date()
        var valid = (dtcurrent >= server_on_time)
        if(valid){
            scclog('isTimeToSleep() interval :local time > server_on_time run restart from local')
            restart();
            // try {clearInterval(intervalTimeSleep);} catch (e) {}
        }
         
     }, 290000);
}

process.on('uncaughtException', function (err) {
    console.log(err);
    errlog(err)
});

server.listen(80, function () {
    scclog('server.listen :Server has started successfully')
    servercheck();
    server_start_cron();
    serverDellastYearSccLog();
    CheckserverSchedule();
    openlink();
    defaultConfigMacAddr();
});


//W

var last_update = new Date();

app3.all('/heartbeat', function (req, res) {

fs.readFile(path.join(__dirname, 'config.xml'), "utf8", function read(err, data) {
    var readjsondata;
    if (data != '') {
        readjsondata = JSON.parse(data);
        
        if(readjsondata.serIP != ''){
            var hostN = readjsondata.serIP.split(':')[1].replace('//','')
            var portN = readjsondata.serIP.split(':')[2]
 
        const options = {
            hostname: hostN,
            port: portN,
            path: '/InterfaceAPI/STB/Heartbeat?mac_address='  + readjsondata.iden,
            method: 'GET'
        }

        const req = http.get(options, (res) => {

            res.on('data', (d) => {
                try {
                    console.log(JSON.parse(d));

                    last_update = new Date();
                    console.log("Last update", last_update);

                    response.end();
                } catch (e) {
                    // console.log(e)
                }
            })
        })

        req.on('error', (error) => {
            //console.error(error)
        })

        req.end();
        }
      }
    });
    res.json({ "result": "ok" });
    
});

setInterval(function () {
    var child_process = require('child_process');
    var now = new Date();
    var diffMs = now - last_update;
    var diffMins = ((diffMs % 86400000) % 3600000) / 60000; // minutes

    var data = fs.readFileSync(path.join(__dirname, 'config.xml'));

    try {
        data = JSON.parse(data);
    } catch (e) { }
    //console.log("mins", diffMins);

    // var chrome = null;
    // try {
    // chrome = execSync('pgrep chrome').toString();
    // } catch(ex) {}

    if (data && data.isSerdefault == '1' && diffMins > 5) {
        // if(execSync("cat /var/www/config/auto_reboot").toString().trim() == "true" 
        // && chrome) 
        scclog('reboot :by frontend watchdog');

        setTimeout(function () {
            child_process.exec('shutdown -r');
        }, 3000);
    }
}, 60000);


http3.listen(30000, function () {
    console.log('Express server listening on port 30000');
});

//W