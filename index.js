const server = require("./server.js");
const winston = require("winston");
const PORT = process.env.PORT || 9934;

process.on("uncaughtException", (err) => {    
    winston.log("error", `Uncaught Exception: ${err}`);    
    process.exit(1);    
});

process.on("uncaughtRejection" , (err, promise) => {
    winston.log("error", `Uncaught Rejection: ${err}`);    
    process.exit(1);
});

["NODE_ENV", "PORT"].forEach(name => {
    if(!process.env[name]){
        throw new Error(`Environment variable for "${name}" is missing.`);
    }
});
server.listen(PORT, (err) => {    
    if(err) return console.log(err);    
    console.log(`ImageServer Rest Service: PORT ${PORT}`);        
});