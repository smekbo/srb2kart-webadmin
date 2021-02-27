var express = require('express');
var router = express.Router();
var pty = require('node-pty');
var os = require('os');

const { server } = require('../sockets');


// ******
// ROUTER
// ******
let serverInfo = 
{
  status : false,
  currentMap : "",
  loadedWads : [],
  players : [],
  version : "",
  time : 0
}

router.get('/', function(req, res, next) {
  res.send(200);
});

router.post('/start', function(req, res, next) {
  startServer();
  res.send(200);
});

router.post('/restart', function(req, res, next) {
  restartServer();
  res.send(200);
});


// ***************************************
// START SERVER PROCESS AND BIND LISTENERS
// ***************************************
let readingWadList = false;
let wadListBuffer = "";
let playerJoinRegex = /\*Player \d+ has joined/g;
let playerRenamedRegex = /\*Player \d+ renamed to (.*)/g;
let showmapRegex = /MAP\d+ \(\d+\):(.*)[\r\n]/gm;
let wadRegex = /^\s[\*\s]\s\d{2}:\s(.*)\.(.*)$/gm;
let mapNameRegex = /Map is now "(.*)"/gm;    

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

var ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});

ptyProcess.onData( function(data) {
  //console.log("NEWLINE - " + data);

  // Bypass weird WAD loading errors
  if (data.includes("Press ENTER to continue"))
  {
    ptyProcess.write("\n");
  }  
  // Detect map change
  if (data.includes("Map is now") || data.match(showmapRegex))
  {
    let mapname = singleLineRegex(showmapRegex, data);
    serverInfo.currentMap = mapname;
  }
  // Detect server start
  if (data.includes("Entering main game loop"))
  {
    initServerInfo();
    serverInfo.status = true;
  }
  // Detect WADs, set server info
  if (data.match(wadRegex))
  {
    addwad(data);
  }
  // if (data.includes("wads loaded:") || readingWadList)
  // {
  //   readingWadList = true;
  //   wadListBuffer = wadListBuffer + data
  // }
  // if (data.includes("IWAD: srb2.srb"))
  // {
  //   readingWadList = false;
  //   serverInfo.loadedWads = regexWadList(wadListBuffer);
  //   wadListBuffer = "";
  // }

  // Detect player info
  if (data.match(playerJoinRegex))
  {
    serverInfo.loadedWads = regexWadList(wadListBuffer);
    wadListBuffer = "";
  }  
});

let cmd = '/home/bob/Kart-Public/bin/Linux64/Release/lsdl2srb2kart '
  + '-dedicated '
  + '-room -33 '
  + '-file /home/bob/srb2kart-webadmin/public/addons/* '
  + '-console'

ptyProcess.write(`pkill -f srb2kart\r`);
ptyProcess.write(`${cmd}\r`);


// ****************************************
// FUNCTION FOR COMMUNICATIONG WITH SOCKETS
// ****************************************
function syncServerInfo()
{
  return serverInfo;
}


// ***************
// OTHER FUNCTIONS
// ***************
let pt = 500;
function initServerInfo()
{
  showmap();
  listwad();
  version();
}

function listwad()
{
  ptyProcess.write("listwad\n");
}

function addwad(data)
{
  while ((m = wadRegex.exec(data)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === wadRegex.lastIndex) {
      wadRegex.lastIndex++;
    }
    
    serverInfo.loadedWads.push({ filename : m[1], extension: m[2] });
  }  
}

function showmap()
{
  ptyProcess.write("showmap\n");
}

function nodes()
{
  ptyProcess.write("listwad\n");
}

function map(mapname, callback)
{
  ptyProcess.write("listwad\n");
}

function version()
{
  ptyProcess.write("version\n");
}

function singleLineRegex(regex, data)
{
  let m;
  
  while ((m = regex.exec(data)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
          regex.lastIndex++;
      }
      console.log(m);
      console.log(data);
      return m[1];
  }  
}

module.exports = 
{
  syncServerInfo : syncServerInfo,
  getLoadedWads : listwad,
  router : router
}