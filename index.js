// require("dotenv").config();
const fs = require("fs");
var requests = require("requests");
const http = require("http");

const indexFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace(
    "{%tempval%}",
    (orgVal.main.temp - 273.15).toFixed(2)
  );
  temperature = temperature.replace(
    "{%mintempval%}",
    (orgVal.main.temp_min - 273.15).toFixed(2)
  );
  temperature = temperature.replace(
    "{%maxtempval%}",
    (orgVal.main.temp_max - 273.15).toFixed(2)
  );
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Jamshedpur&appid=f54e5d6cf5234e9d56c0f14212f0e1a1"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        const realTimeData = arrData
          .map((val) => replaceVal(indexFile, val))
          .join(" ");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);

        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening");
});
