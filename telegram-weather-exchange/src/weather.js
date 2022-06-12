const axios = require("axios");

const url =
  "https://api.openweathermap.org/data/2.5/forecast?lat=49.9923181&lon=36.231014&appid=e6ef805a11855cbc4faf8a569b8eb26e";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDate = (date) => {
  return (
    days[date.getDay()] +
    ", " +
    months[date.getMonth()] +
    " " +
    date.getDate() +
    ":"
  );
};

const getCelcius = (stamp) => {
  const temp = Math.round(stamp.main.temp - 273.15);
  return temp < 0 ? "-" + temp : temp > 0 ? "+" + temp : temp;
};

const getTime = (date) => {
  let hour = date.getHours();
  let minute = date.getMinutes();
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  return hour + ":" + minute;
};

const getDay = (stamp, next) => {
  let date = new Date(stamp.dt_txt);
  let weather = "";
  if (next && stamp.dt_txt.slice(0, 10) != next.dt_txt.slice(0, 10)) {
    weather += "\n\n🗓 *" + getDate(date) + "*\n";
  }
  weather +=
    " \n\t ⏱ " +
    getTime(date) +
    "\t *" +
    getCelcius(stamp) +
    "°C*;" +
    " \n\t 🌡 Feels like: " +
    getCelcius(stamp) +
    "°C;" +
    " \n\t 🪁 Description: *" +
    stamp.weather[0].description +
    "*.\n";
  return weather;
};

const getWeather = async () => {
  let weather = "";
  const response = await axios.get(url);
  weather += `🇺🇦 *Weather in Kharkiv:*\n\n`;
  for (let i = 0; i < response.data.list.length; i++) {
    weather += getDay(response.data.list[i], response.data.list[i + 1]);
  }
  return weather;
};

module.exports = getWeather;
