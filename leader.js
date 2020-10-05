/****************************************************
 *                                                  *
 *        leader.js : simple leader election        *
 *                                                  *
 ****************************************************/
let leader = -1;
let PID = -1;

async function leaderElection(PID) {

  console.log("STEP 1");
  let allNodes = await getNodesIp();

  let restartCount = 0;
  const restart = async (errMsg) => {
    restartCount++;
    console.log(errMsg);
    console.log(`\n\n-------------------------  RESTART n°${restartCount}  ------------------------------`);
    console.log('-------------------------------------------------------------------------------------');
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  while(true) {
    // get status
    let nodesUp = await getNodesStatus(allNodes);
    let countNodesUp = nodesUp.filter(ele => ele == true).length;
    if (countNodesUp < 3) {
      restart(`ERROR - countNodesUp = ${countNodesUp} but expected a number >= 3`);
      continue;
    }

    // if I am leader
    if(amILeader(nodesUp)) {
      for(let node of allNodes) {
        try {
          data = await got.post(`${node}/election/${PID}`);
          if(data.status != 200) {
            restart(`ERROR - election failed, status=${data.status} for node ${node}`);
            continue;
          }
        }
        catch (err) {
          restart(`ERROR - election failed for unknown reason`);
          continue;
        }
      }
    }

    // if I am NOT leader
    else {
      await new Promise(resolve => setTimeout(resolve, 10000));

      if (leader == -1) {
        console.log('Limit case: after 10 sec, there is no leader');
        restart();
      }
      else {
        leaderNode = allNodes[leader-1];
        while(true) {
          try {
            data = await got.post(`${leaderNode}/status`);
            if(data.status != 200) {
              restart(`ERROR - leader (index ${leader-1}) is down, status=${data.status} for node ${leaderNode}`);
              continue;
            }
          }
          catch (err) {
            restart(`ERROR - election failed for unknown reason`);
            continue;
          }
        }
      }
    }
  }
}

/** lookupPromise
 *
 */
async function lookupPromise(host){
    return new Promise((resolve, reject) => {
        dns.resolve4(host, (err, address) => {
            if(err) reject(err);
            resolve(address);
        });
   });
};


/** amILeader
 *
 */
const amILeader = loggingDecorator(amILeader_);
function amILeader_(nodesUp) {
  return nodesUp.slice(PID-1).every(ele => !ele);
}


/** getNodesIp
 *
 */
const getNodesIp = loggingDecorator(getNodesIp_);
async function getNodesIp_() {
  nodes = [];
  for (let i = 1; i <= 16; i++) {
    try {
      if(i != PID) {
        let iTwoDigits = (i<10)? `0${i}`: `${i}`;
        let host = `tc405-112-${iTwoDigits}.insa-lyon.fr`;
        let ipAddr = String(await lookupPromise(host));
        if(!ipAddr.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) throw new Error();
        nodes.push(`http://${ipAddr}:${PORT}`); 
      }
    }
    catch (err) {
      // throw err;
      console.log('Limit case');
      console.log(err);
    }
  }
  if(nodes.length != 15) throw new Error();
  return nodes;
}


/** getNodesStatus
 *
 */
const getNodesStatus = loggingDecorator(getNodesStatus_);
async function getNodesStatus_(allNodes) {
  nodesUp = [];
  for(let node of allNodes) {
    try {
      console.log(`request to ${node}/status`)
      data = await got(`${node}/status`, {retry: 0});
      nodesUp.push(data.status == 200);
    }
    catch (err) {
      if (err instanceof got.RequestError) {
        nodesUp.push(false)
        console.log(false);
      }
      else {
        console.log("Limit case");
        console.log(err);
      // throw err;
      }
    }
  }
  if (nodesUp.length != 15) throw new Error(`nodesUp.length = ${nodesUp.length} but expected 15`);
  return nodesUp;
}


/** loggingDecorator
 *
 */
function loggingDecorator(wrapped) {
  return async function() {
    console.log(`>>>>>> ${wrapped.name}() called with: ${JSON.stringify(arguments)}`);
    const result = await wrapped.apply(this, arguments);
    console.log(`<<<<<< ${wrapped.name} returns: ${result}`);
    console.log();
    return result;
  }
}


/***************************************
 *        express configuration        *
 ***************************************/
const got = require('got');
const express = require('express');
const dns = require('dns');
const app = express();
const PORT = 5000;

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req,res,next) => {
    if (req.body) {
      console.log(req.method + " " + req.url + " " + JSON.stringify(req.body));
    }
    else {
      console.log(req.method + ' ' + req.url);
    }
    next();
  });


/***************************
 *        endpoints        *
 ***************************/
app
  .get('/status', (req, res) => {
    res.status(200).end();
  })

  .post('/election/:pid', (req, res) => {
    let newLeaderPid = req.params.pid;

    if(newLeaderPid > PID) {
      leader = newLeaderPid;
      res.status(200).end()

    } else {
      console.log(`Limit case: received leader request from ${newLeaderPid}`)
      res.status(401).end()
    }
  })

  .use((req, res) => {
    res.status(500).end();
  });

module.exports = app.listen(PORT, () => {
  console.log("Listening on port "+PORT);

  if(process.argv.length < 3) throw new Error("usage: node leader.js PID [follower]");
  PID = process.argv[2];

  if(process.argv.length == 4 && process.argv[3] == "follower") {
    console.log(`init() as FOLLOWER ONLY with pid=${PID}`)
  }
  else {
    console.log(`init() as CONTENDER with pid=${PID}`)
    leaderElection(PID);
  }
});