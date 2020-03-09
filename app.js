var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const eventList = require("./eventList");

var port = process.env.PORT || 1337;

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public", { maxAge: 31557600000 }));

app.get("/getData", async (req, res) => {
  var resData = {
    dateTime: "",
    aqi: "",
    event: "",
    weather: "",
    temperatureHigh: "",
    temperatureLow: "",
    temperature: ""
  };

  axios.get('http://worldtimeapi.org/api/timezone/Asia/Kolkata')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

  axios.get('https://api.waqi.info/feed/ahmedabad/?token=7469034730f551142051aae18bc9e375daa5d8a8')
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

  axios.get('https://api.darksky.net/forecast/ba58d351c00fd5c6fdb21e13a5c02c24/22.9852618,72.6321034')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

  console.log("getData");
  res.send("getData");
});

var httpServer = require("http").createServer(app);
httpServer.listen(port);

module.exports = app;
