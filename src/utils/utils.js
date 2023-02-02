export const weatherCodes = {
    Thunderstorm: {
        200: "thunderstorm with light rain",
        201: "thunderstorm with rain",
        202: "thunderstorm with heavy rain",
        210: "light thunderstorm",
        211: "thunderstorm",
        212: "heavy thunderstorm",
        221: "ragged thunderstorm",
        230: "thunderstorm with light drizzle",
        231: "thunderstorm with drizzle",
        232: "thunderstorm with heavy drizzle",
    },
    Drizzle: {
        300: "light intensity drizzle",
        301: "drizzle",
        302: "heavy intensity drizzle",
        310: "light intensity drizzle rain",
        311: "drizzle rain",
        312: "heavy intensity drizzle rain",
        313: "shower rain and drizzle",
        314: "heavy shower rain and drizzle",
        321: "shower drizzle",
    },
    Rain: {
        500: "light rain",
        501: "moderate rain",
        502: "heavy intensity rain",
        503: "very heavy rain",
        504: "extreme rain",
        511: "freezing rain",
        520: "light intensity shower rain",
        521: "shower rain",
        522: "heavy intensity shower rain",
        531: "ragged shower rain",
    },
    Snow: {
        600: "light snow",
        601: "Snow",
        602: "Heavy snow",
        611: "Sleet",
        612: "Light shower sleet",
        613: "Shower sleet",
        615: "Light rain and snow",
        616: "Rain and snow",
        620: "Light shower snow",
        621: "Shower snow",
        622: "Heavy shower snow",
    },
    Atmosphere: {
        701: "mist",
        711: "Smoke",
        721: "Haze",
        731: "sand/ dust whirls",
        741: "fog",
        751: "sand",
        761: "dust",
        762: "volcanic ash",
        771: "squalls",
        781: "tornado",
    },
    Clear: {
        800: "clear sky",
    },
    Clouds: {
        801: "few clouds",
        802: "scattered clouds",
        803: "broken clouds",
        804: "overcast clouds",
    },
};

export const times = {
    night: [1260, 360],
    dawn: [360, 480],
    morning: [480, 660],
    noon: [660, 780],
    afternoon: [780, 1140],
    sunset: [1140, 1260],
};
export const periods = {
    winter: [formatDateToIndex("12/21"), formatDateToIndex("3/20")],
    spring: [formatDateToIndex("3/21"), formatDateToIndex("6/20")],
    summer: [formatDateToIndex("6/21"), formatDateToIndex("9/23")],
    autumn: [formatDateToIndex("9/24"), formatDateToIndex("12/20")],
};

export function formatMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${remainingMinutes
        .toString()
        .padStart(2, "0")}`;
}

export function formatDayIndexToDate(dayIndex) {
    const startDate = new Date(2023, 0, 1);
    const oneDay = 24 * 60 * 60 * 1000;

    const targetTimestamp = startDate.getTime() + dayIndex * oneDay;
    const targetDate = new Date(targetTimestamp);

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const month = months[targetDate.getMonth()];
    const dayOfWeek = days[targetDate.getDay()];
    const dayOfMonth = targetDate.getDate();

    return `${month} ${dayOfWeek} ${dayOfMonth}`;
}

export function formatDateToIndex(dateString) {
    const [month, day] = dateString.split("/").map((x) => parseInt(x));

    const startDate = new Date(2023, 0, 1);
    const targetDate = new Date(2023, month - 1, day);
    const oneDay = 24 * 60 * 60 * 1000;

    return Math.floor((targetDate.getTime() - startDate.getTime()) / oneDay);
}
