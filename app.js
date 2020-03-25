var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const axios = require("axios");
const eventList = require("./eventList");
var port = process.env.PORT || 1337;
var app = express();

fToC = f => {
  return Math.floor((f - 32) * (5 / 9));
};

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

  await axios
    .get("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
    .then(function(response) {
      console.log(response.data);
      resData.dateTime = response.data.utc_datetime;
    })
    .catch(function(error) {
      console.log(error);
    });

  await axios
    .get(
      "https://api.waqi.info/feed/ahmedabad/?token=7469034730f551142051aae18bc9e375daa5d8a8"
    )
    .then(function(response) {
      // console.log(response.data.data.aqi);
      resData.aqi = response.data.data.aqi;
    })
    .catch(function(error) {
      console.log(error);
    });

  await axios
    .get(
      "https://api.darksky.net/forecast/ba58d351c00fd5c6fdb21e13a5c02c24/22.9852618,72.6321034"
    )
    .then(function(response) {
      resData.temperature = fToC(response.data.currently.temperature);
      resData.temperatureHigh = fToC(
        response.data.daily.data[0].temperatureHigh
      );
      resData.temperatureLow = fToC(response.data.daily.data[0].temperatureLow);
      resData.weather = response.data.currently.icon;
    })
    .catch(function(error) {
      console.log(error);
    });

  var t = await new Date(resData.dateTime);

  var find = await eventList.find(data => {
    return (
      data.date.day == t.getDate() &&
      data.date.month == t.getMonth() + 1 &&
      data.date.year == t.getFullYear()
    );
  });
  if (find != null) {
    resData.event = find.name;
  }
  res.send(resData);
});

var httpServer = require("http").createServer(app);
httpServer.listen(port);

module.exports = app;
