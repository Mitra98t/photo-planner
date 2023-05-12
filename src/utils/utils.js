import { useMediaQuery } from "react-responsive";

/**
 * Raccolta dei weather codes usati da openweather
 */
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

/**
 * Partendo da dei Minuti trasforma in hh:mm
 * @param {*} minutes minuti nella giornata
 * @returns time of day => hh:mm
 */
export function formatMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${remainingMinutes
    .toString()
    .padStart(2, "0")}`;
}
export function formatTimeToMinutes(time) {
  const [hours, minutes] = time.split(":");
  return hours * 60 + minutes;
}

/**
 * A partire dall'indice del giorno nell'anno restituisce la data `${month} ${dayOfWeek} ${dayOfMonth}`
 * @param {*} dayIndex indice del giorno
 * @returns `${month} ${dayOfWeek} ${dayOfMonth}` relativo
 */
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

export function getDate(dateString) {
  const [year, month, day] = dateString.split("-").map((x) => +x);

  return new Date(year, month, day);
}

/**
 * vechia funzione di filtering
 * @param {*} photo
 * @param {*} options
 * @param {*} timeTags
 * @param {*} periodTags
 * @param {*} weatherTags
 * @returns
 */
export function filterPhoto(photo, options) {
  let timePhoto = formatTimeToMinutes(photo.fileData.creationTime);
  let timeStart = formatTimeToMinutes(options.time.from);
  let timeEnd = formatTimeToMinutes(options.time.to);

  let datePhoto = getDate(photo.fileData.creationDate);
  let dateStart = getDate(options.period.from);
  let dateEnd = getDate(options.period.to);

  let weatherCheck =
    options.weather === "" ||
    photo.weather.weather.toLowerCase() === options.weather.toLowerCase();

  let timeCheck =
    options.time.from === "" ||
    options.time.to === "" ||
    timeStart > timeEnd ||
    (timePhoto >= timeStart && timePhoto <= timeEnd);

  let periodCheck =
    options.period.from === "" ||
    options.period.to === "" ||
    dateStart > dateEnd ||
    (datePhoto >= dateStart && datePhoto <= dateEnd);

  return weatherCheck && timeCheck && periodCheck;
}

export function getWeatherByCode(code, weatherCodes) {
  for (const section in weatherCodes) {
    for (const key in weatherCodes[section]) {
      if (code === key) return weatherCodes[section][key];
    }
  }
  return null;
}

function isNonEmptyString(str) {
  return typeof str === "string" && str.trim().length > 0;
}

export function checkPhoto(photo) {
  let infoCheck =
    isNonEmptyString(photo.URL) && isNonEmptyString(photo.authorUID);

  let fileDataCkeck =
    !!photo.file &&
    isNonEmptyString(photo.file.nameComplete) &&
    isNonEmptyString(photo.file.name) &&
    isNonEmptyString(photo.file.description) &&
    isNonEmptyString(photo.file.type) &&
    isNonEmptyString(photo.file.creationDate) &&
    isNonEmptyString(photo.file.creationTime);

  let cameraCheck =
    !!photo.camera &&
    isNonEmptyString(photo.camera.model) &&
    isNonEmptyString(photo.camera.make);

  let weatherCheck =
    !!photo.weather &&
    isNonEmptyString(photo.weather.weather) &&
    isNonEmptyString(photo.weather.code);

  let settingsCheck =
    !!photo.exif &&
    isNonEmptyString(photo.exif.ISO + "") &&
    isNonEmptyString(photo.exif.aperture + "") &&
    isNonEmptyString(photo.exif.focalLength + "") &&
    isNonEmptyString(photo.exif.shutterSpeed);

  let locationCheck =
    !!photo.location &&
    isNonEmptyString(photo.location.luogo) &&
    isNonEmptyString(photo.location.lat) &&
    isNonEmptyString(photo.location.lng);

  return (
    infoCheck &&
    fileDataCkeck &&
    cameraCheck &&
    weatherCheck &&
    settingsCheck &&
    locationCheck
  );
}

export function formatStyle(styles) {
  return styles.join(" ");
}

export const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};
export const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};
export const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile ? children : null;
};
export const Default = ({ children }) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};

//function that given a string in camel notation returns a string of different words separated by spaces with only the first letter of the first word capitalized
export function camelToNormal(str) {
  let result = str.replace(/([A-Z])/g, " $1");
  result = result.split(" ");
  result = result.map((w, i) =>
    i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w.toLowerCase()
  );
  return result.join(" ");
}

export function randomColor() {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 16).toString(16);
  }
  return color;
}
