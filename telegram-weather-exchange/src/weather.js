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

const getCelcius = (temp) => {
  const t = Math.round(temp - 273.15);
  return t < 0 ? "-" + t : t > 0 ? "+" + t : t;
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

const getDay = (i, stamp, back) => {
  let date = new Date(stamp.dt_txt);
  let weather = "";
  if (i == 0 || (back && stamp.dt_txt.slice(0, 10) != back.dt_txt.slice(0, 10))) {
    weather += "\n\n🗓 *" + getDate(date) + "*\n";
  }
  weather +=
    `\n\t ⏱ ${getTime(date)}\t${getCelcius(stamp.main.temp)}°C;\n\t 🌡 Feels like: ${getCelcius(stamp.main.feels_like)}°C;\n\t 🪁 Description: ${stamp.weather[0].description}.\n`;
  return weather;
};

const getWeather = async () => {
  try {
    let weather = "🇺🇦 *Weather in Kharkiv:*\n";
    const response = await axios.get(url);
    for (let i = 0; i < response.data.list.length; i++) {
      weather += getDay(i, response.data.list[i], response.data.list[i - 1]);
    }
    return weather; 
  } catch (error) {
    return "Cannot get weather..."
  }
};

module.exports = getWeather;
