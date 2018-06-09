const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const winston = require("winston");
const serveStatic = require("serve-static");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const config = require("../config.js");


module.exports = (app) => {        
    const corsOptions = {     
        credentials: true,
        origin: ["http://localhost:9999", "https://rfed.netlify.com"]
    };
    winston.add(winston.transports.File, {filename: "my_error_log.log"});    
    app.use(serveStatic(path.join(__dirname, "public/images")));    
    app.use(cookieParser());
    app.use(cors(corsOptions));    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(logger("dev")); 
    mongoose.connection.openUri(config.mongo)
        .once("open",  () => {            
            console.log("DB Connection OPEN.");
        }).on("error", e => {
            console.log("ERR with DB CONN");
            winston.log("error", `MONGODB ERROR: ${e}`);
        });
};