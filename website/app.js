/* Global Variables */

// URL params: zip, appid
const API_URL = "http://api.openweathermap.org/data/2.5/forecast";
const API_KEY = "d77adfaedc49e172ba37f4127fb858a0";

const generateBtn = document.getElementById("generate");

// Create a new date instance dynamically with JS
let currentDate = new Date();
// let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

/* API calls */
const getWeather = async (URL, zip, key) => {
  const response = await fetch(`${URL}?zip=${zip}&appid=${key}&units=metric`);
  try {
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error while getting weather data\n", error);
  }
};

const sendData = async (URL, data) => {
  const response = await fetch(URL, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("error while posting data\n", error);
  }
};

const getData = async (URL) => {
  const response = await fetch(URL);

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error while getting data from the server\n", error);
  }
};

/**
 * Function to render the date
 * @param {Date} date
 **/
const renderDate = (date) => {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    hour: date.getHours(),
    mins: date.getMinutes(),
    seconds: date.getSeconds(),
  };
};

/* Update the user interface */
const updateUI = (dataList) => {
  console.log(dataList);
  const recent = document.getElementById("recent-entry");
  const older = document.getElementById("older-entries");
  const recentDate = renderDate(new Date(dataList[dataList.length - 1].date));

  const content = `
    <p id="date">Date: 
      ${recentDate.day}/${recentDate.month}/${recentDate.year} - 
      ${recentDate.hour}:${recentDate.mins}:${recentDate.seconds}
    </p>
    <p id="temp">Temperature: ${dataList[dataList.length - 1].temp}</p>
    <p id="content"5>Feelings: ${dataList[dataList.length - 1].userResponse}</p>
  `;
  recent.innerHTML = content;

  if (dataList.length === 1) return;

  older.innerHTML = "";
  dataList.reverse().forEach((item, idx) => {
    if (idx > 0) {
      console.log(item);
      const date = renderDate(new Date(item.date));
      older.innerHTML += `
        <p class="older-date">Date: 
          ${date.day}/${date.month}/${date.year} - ${date.hour}:${date.mins}:${date.seconds}
        </p>
        <p class="older-temp">Temperature: ${item.temp}</p>
        <p class="older-content">Feelings: ${item.userResponse}</p>
      `;
    }
  });
};

/* Handling the submit and data generation */
const handleSubmit = () => {
  const zip = document.getElementById("zip").value;
  const feelings = document.getElementById("feelings").value;
  const errorWrapper = document.getElementById("error-wrapper");

  // random zip code from the map: "16515"
  getWeather(API_URL, zip, API_KEY)
    .then((data) => {
      if (data.cod === "404" || data.cod === "400") {
        errorWrapper.innerHTML = `
          <p id="not-found" class="error">${data.message}</p>
        `;
        return;
      }
      errorWrapper.innerHTML = "";
      const newData = {
        date: currentDate,
        temp: data.list[0].main.temp,
        userResponse: feelings,
      };
      sendData("/post", newData)
        .then(() => {
          getData("/all").then((data) => updateUI(data));
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => console.log(error));
};

generateBtn.addEventListener("click", handleSubmit);
