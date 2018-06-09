const express = require("express");
const winston = require("winston");
const path = require("path");
const uuid = require("uuid");
const app = express();
const wrapAsync = require("./common/util.js");
const middleware = require("./common/middleware.js");
const Visitor = require("./models/visitor.js");

middleware(app);

const adRouter = express.Router();
app.use("/ad", adRouter);


adRouter.get("/", wrapAsync(async (req, res) => {        
    res.status(200).json({
            route: "/",
            message: "Server for determining which ads to serve.  Returns a series of urls on an image server for the requesting page.",
            routes: "/images for images"
    });    
}));

adRouter.get("/images", wrapAsync(async (req, res) => {               
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

adRouter.get("/imagescookie", wrapAsync(async (req, res) => {    
    console.log(req.cookies);
    console.log(req.cookies["adserver"]);
    if(!req.cookies["adserver"]){
        const visitor_id = uuid.v4();
        
        const latest_visitor = Visitor({
            cookie_id: visitor_id,
            visits: 0
        });
        const saved_visitor = await latest_visitor.save();        
        res.cookie("adserver", saved_visitor.cookie_id, {
            expires: new Date(Date.now() + 99999),
            httpOnly: false
        });
        res.status(200).json({
            addresses: [
                "https://ry-image-server.now.sh/nocookie.png"                
            ]
        });
    }else{       
       
       const recurring_visitor = await Visitor.findOne({cookie_id: req.cookies["adserver"]});                     
       recurring_visitor.visits++;       
       recurring_visitor.save();
                                          
       res.status(200).json({
           route: "imagescookie",
           description: "sends list of ad urls based on cookie",
           cookie: req.cookies["adserver"],           
           cookieid: recurring_visitor.cookie_id,
           count: recurring_visitor.visits,
           addresses: [
                "https://ry-image-server.now.sh/one.png",
                "https://ry-image-server.now.sh/two.png",
                "https://ry-image-server.now.sh/three.png",
                "https://ry-image-server.now.sh/four.png",
                "https://ry-image-server.now.sh/five.png",
           ]
       });
    }    
}));



app.get("*", wrapAsync(async (req, res, next) => {    
    winston.log("info", "route not found.");
    res.status(404).json({
        route: "Route not found.",
        message: "This route doesn't exist"
    });
}));

app.use((err, req, res, next) => {        
    winston.log("error", `App caught an error: ${err}`);
    if(process.env.NODE_ENV !== "production"){
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