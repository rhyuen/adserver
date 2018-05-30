const express = require("express");
const winston = require("winston");
const path = require("path");
const app = express();
const wrapAsync = require("./common/util.js");
const middleware = require("./common/middleware.js");

middleware(app);

app.get("/", wrapAsync(async (req, res) => {        
    res.status(200).json({
            route: "/",
            message: "Server for determining which ads to serve.  Returns a series of urls on an image server for the requesting page.",
            routes: "/images for images"
    });    
}));

app.get("/images", wrapAsync(async (req, res) => {               
    res.status(200).json({
        addresses: [
            "https://ry-image-server.now.sh/one.jpg",
            "https://ry-image-server.now.sh/two.jpg",
            "https://ry-image-server.now.sh/three.jpg",
            "https://ry-image-server.now.sh/fw1.jpg",
            "https://ry-image-server.now.sh/fw2.jpg",
            "https://ry-image-server.now.sh/fw3.jpg",
            "https://ry-image-server.now.sh/fw4.jpg",
            "https://ry-image-server.now.sh/fw5.jpg",
            "https://ry-image-server.now.sh/fw6.jpg",
            "https://ry-image-server.now.sh/fw7.jpg"
        ]
    });
}));

// app.get("/imgref", wrapAsync(async (req, res) => {    
//     if(!res.cookie["adserver"]){
//         res.cookie("adserver", 1);
//     }else{
//         const updated = Number(req.cookies["adserver"]) + 1;
//         res.cookie("adserver", updated);
//     }
//     res.status(200).json({route: "imgref", cookie: req.cookies["adserver"]});
// }));

app.get("*", wrapAsync(async (req, res, next) => {    
    res.status(404).json({
        route: "Route not found.",
        message: "This route doesn't exist"
    });
}));

app.use((err, req, res, next) => {        
    winston.log("error", `App caught an error: ${err}`);
    if(process.env.NODE_ENV !=="production"){
        res.status(500).json({
            message: "Something went wrong.", 
            error: err.message,
            code: err.httpStatusCode
        });    
    }else{
        res.status(500).json({
            message: "Something went wrong.  I've goofed.  I'm quite sorry for the inconvenience."           
        });    
    }  
});

module.exports = app;