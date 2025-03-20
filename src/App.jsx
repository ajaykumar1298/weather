import { useEffect, useState } from "react";
import "./App.css";
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
// const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
import SendIcon from '@mui/icons-material/Send';

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
function App() {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState(null);
  const [lastCity, setLastCity] = useState("");
  const [error, setError] = useState("");

  const handleBtnLatLng = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          try {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            );
            const result = await res.json();
  
            if (result.cod === "404") {
              setData(null);
              setError("City not found. Please enter a valid city.");
            } else {
              setData(result);
              setError(""); // Clear error on successful fetch
            }
          } catch (e) {
            setError("There is some issue fetching the weather data.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Failed to get location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      console.log("Geolocation is not supported by this browser.");
    }
  };
  


  const handleBtn = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a city name.");
      return;
    }
    setInputValue("")

    let city = inputValue.trim();
    if (lastCity === city) return;

    setLastCity(city);
    setError(""); // Reset error message

    try {
      let res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      let result = await res.json();

      if (result.cod === "404") {
        setData(null);
        setError("City not found. Please enter a valid city.");
      } else {
        // console.log(result);
        setData(result);
        setError(""); // Clear error on successful fetch
      }
    } catch (e) {
      setError("There is some issue fetching the weather data.");
    }
  };

  return (
    <div className="app">
      <h1>Weather App</h1>
    
      <div className="input-container">
        <button type=" button" className="currBtn" onClick={handleBtnLatLng}>Find Me</button>
      </div>
      or
      <br />
      <br />
      <div className="input-container">
        
        <input
          type="text"
          value={inputValue}
          placeholder="Enter City Name"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="gps" onClick={handleBtn}><SendIcon/></button>
      </div>
    
      {error && <p className="error-msg">{error}</p>}
      {data && (
        <div className="weather-info">
          <h2>{data.name}</h2>
          <p className="temp">{data.main.temp}°C</p>
          <p className="weather-cond">{data.weather[0].description}</p>
          <p className="feels-like">Feels like: {data.main.feels_like}°C</p>
          <div className="weather-icon">
            <img
              src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt={data.weather[0].description}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
