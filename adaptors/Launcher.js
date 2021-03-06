/**
 *
 *  Launching other adapters
 *
 */
require('swarmutil').createAdapter("Launcher",onReadyCallback);
var childForker = require('child_process');
var forkOptions;
var forLaunch = getMyConfig().autorun;
var howMany;

function runAll(cmdObj,howMany){
    for(var k=0; k<howMany; k++){
        forkOptions = {
            cwd:process.cwd(),
            env:process.env
        };
        childForker.fork(getSwarmFilePath(cmdObj.node),null,forkOptions);
    }
}

function bindClosure(cmdObj,howMany){
    return function(){
        runAll(cmdObj,howMany);
    }
}

for(var i=0; i<forLaunch.length; i++){
    var cmdObj = forLaunch[i];
    if(cmdObj.node == undefined){
        logErr("Wrong adapter configuration: no \"node\" property where required when starting auto loading \n");
    }
    if(cmdObj.enabled == undefined || cmdObj.enabled == true){
        howMany = cmdObj.times;
        if(howMany  == undefined){
            howMany = 1;
        }
        if(cmdObj.wait == undefined){
            runAll(cmdObj,howMany);
        }
        else{
            setTimeout(bindClosure(cmdObj,howMany),cmdObj.wait);
        }
    }
}


function onReadyCallback(){
    startSwarm("LaunchingTest.js","start");

}

/*
 var n = childForker.fork(forLaunch[i],null,forkOptions);
n.on('message', function(m) {
 console.log('PARENT got message:', m);
 //n.send({ "redisHost": redisHost,"redisPort":redisPort,"shardId":shardId});
 }); */



