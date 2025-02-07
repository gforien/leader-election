/*************************************
 *           custom logger           *
 *************************************/
require('dotenv').config();
const nodemailer = require('nodemailer');
const transport  = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PWD
  }
});

/** sendMail
 *
 */
const sendMail = functionLogger(sendMail_);
async function sendMail_(msg) {
  const email = {
      from: 'leader-election@email.com',
      to: 'to@email.com',
      subject: 'Critical error on ',
      text: msg
  };
  try {
    await transport.sendMail(email);
  } catch (err) {
    console.log("ERROR - Could not send mail");
    console.log(err);
  }
}

/** functionLogger
 *
 */
function functionLogger(wrapped) {
  return async function() {
    // console.log(`>>>>>> ${wrapped.name}() called with: ${JSON.stringify(arguments).slice(0, 80)}`);
    console.log(`>>>> ${wrapped.name}()`);
    const result = await wrapped.apply(this, arguments);
    console.log(`<<<< ${wrapped.name} returns ${String(result).slice(0,80)}`);
    return result;
  }
}

/** setLogger
 *
 */
const orig = console.log
function setLogger(hostname) {
  console.log = function() {
    let newArgs = []
    let date = new Date();
    newArgs.push(new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().replace(/T/, ' ').replace(/\..+/, ''));
    newArgs.push(" ");
    newArgs.push(hostname);
    newArgs.push(process.pid);
    newArgs.push(" ");
    let func = `${__function}`;
    while(func.length <= 30) func = func +" ";
    newArgs.push(func);
    newArgs.push(...arguments);
    orig.apply(console, newArgs);
  }

  Object.defineProperty(global, '__stack', {
    configurable:true,
    get: function() {
      var orig = Error.prepareStackTrace;
      Error.prepareStackTrace = function(_, stack) {
          return stack;
      };
      var err = new Error;
      Error.captureStackTrace(err, arguments.callee);
      var stack = err.stack;
      Error.prepareStackTrace = orig;
      return stack;
    }
  });
 
  Object.defineProperty(global, '__line', {
    configurable:true,
    get: function() {
      return __stack[1].getLineNumber();
    }
  });
 
  Object.defineProperty(global, '__function', {
    configurable:true,
    get: function() {
      return __stack[2].getFunctionName();
    }
  });
}


module.exports = {
  "setLogger"    : setLogger,
  "functionLogger" : functionLogger,
  "sendMail"     : sendMail
};
