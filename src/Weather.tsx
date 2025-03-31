import React, {useEffect, useRef, useState} from 'react';

type WeatherType = {
    humidity: number;
    temperature: number;
    windSpeed: number;
    location: string;
    icon: string;
}

const Weather = () => {
    const [weather, setWeather] = useState<WeatherType>(
        {
            humidity: 0,
            temperature: 0,
            windSpeed: 0,
            location: '',
            icon: '',
        }
    );

    const [darkMode, setDarkMode] = useState(false);
    const [city, setCity] = useState<string>('');
    const [searchInput, setSearchInput] = useState<string>('');

    const icons: Record<string, string> = {
        "01d": "./clear.png",
        "01n": "./clear.png",
        "02d": "./cloud.png",
        "02n": "./cloud.png",
        "03d": "./cloud.png",
        "03n": "./cloud.png",
        "04d": "./drizzle.png",
        "04n": "./drizzle.png",
        "09d": "./rain.png",
        "09n": "./rain.png",
        "10d": "./rain.png",
        "10n": "./rain.png",
        "13d": "./snow.png",
        "13n": "./snow.png",
    };

    const getCurrentCity = async () => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${import.meta.env.VITE_APP_ID}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.length > 0) {
                    const currentCity = data[0].name;
                    console.log("You are in:", currentCity);
                    setCity(currentCity);
                } else {
                    console.log("City not found");
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
            }
        );
    };

    const search =  async (city: string) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const json = await response.json();
            console.log(json);

            const icon: string = icons[json.weather[0].icon] || icons[json.weather[1].icon] || "./clear.png";

            setWeather({
                humidity: json.main.humidity,
                temperature: Math.floor(json.main.temp),
                windSpeed: json.wind.speed,
                location: json.name,
                icon: icon,
            });
        }
        catch {
            console.log("error");
        }
    }

    useEffect(() => {
        getCurrentCity();
    }, []);

    useEffect(() => {
        if (city) {
            search(city);
        }
    }, [city]);

    return (
        <>
            <div className={darkMode ? 'bg-gray-700 text-white min-h-screen' : 'bg-white text-gray-800 min-h-screen'}>
                <header className={darkMode ? 'bg-gray-700 shadow-md py-4 px-6' : 'bg-white shadow-md py-4 px-6'}>
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Weather App</h1>
                        <div className="relative hidden md:block">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && searchInput.trim()) {
                                        search(searchInput);
                                        setSearchInput('');
                                    }
                                }}
                                className="border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            />
                            <img
                                src="./search.png"
                                alt="search icon"
                                onClick={() => {
                                    if (searchInput.trim()) {
                                        search(searchInput);
                                        setSearchInput('');
                                    }
                                }}
                                className="w-5 h-5 absolute top-2.5 right-3 text-gray-400 cursor-pointer"
                            />
                        </div>
                        <button
                            className="ml-4 px-4 py-2 text-white bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition"
                            onClick={() => setDarkMode(prev => !prev)}
                        >
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </header>

                <main>
                    <div className="max-w-md mx-auto mt-10 bg-emerald-500 shadow-lg rounded-xl p-6 text-center space-y-6">
                        <img src={weather.icon} alt="clear icon" className="mx-auto w-24 h-24" />
                        <p className="text-4xl font-bold">{weather.temperature}°C</p>
                        <p className="text-2xl">{weather.location}</p>

                        <div className="flex justify-around mt-6 text-sm">
                            {/* Humidity */}
                            <div className="flex items-center space-x-2">
                                <img src="./humidity.png" alt="humidity icon" className="w-8 h-8" />
                                <div>
                                    <p className="font-semibold">{weather.humidity}%</p>
                                    <p>Humidity</p>
                                </div>
                            </div>

                            {/* Wind */}
                            <div className="flex items-center space-x-2">
                                <img src="./wind.png" alt="wind icon" className="w-8 h-8" />
                                <div>
                                    <p className="font-semibold">{weather.windSpeed} km/h</p>
                                    <p>Wind</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Weather;