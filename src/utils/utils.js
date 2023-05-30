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

/**
 *
 * @param {*} time hh:mm
 * @returns Minutes ellapsed from midnight
 */
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

/**
 * A partire da una data nel formato yyyy-mm-dd restituisce un oggetto Date
 * @param {*} dateString yyyy-mm-dd
 * @returns Date
 */
export function getDate(dateString) {
  const [year, month, day] = dateString.split("-").map((x) => +x);

  return new Date(year, month - 1, day);
}

/**
 * @param {*} photo array di foto da filtrare
 * @param {*} options opzioni di filtraggio
 * @returns array di foto filtrate
 */
export function filterPhoto(photo, options) {
  let timePhoto = formatTimeToMinutes(photo.fileData.creationTime);
  let timeStart = formatTimeToMinutes(options.time.from);
  let timeEnd = formatTimeToMinutes(options.time.to);

  let datePhoto = getDate(photo.fileData.creationDate);

  let weatherCheck =
    options.weather === "" ||
    photo.weather.weather.toLowerCase() === options.weather.toLowerCase();

  let timeCheck =
    options.time.from === "" ||
    options.time.to === "" ||
    timeStart > timeEnd ||
    (timePhoto >= timeStart && timePhoto <= timeEnd);

  let periodCheck = false;

  switch (options.period) {
    case "winter":
      periodCheck =
        [0, 1].includes(datePhoto.getMonth()) ||
        (datePhoto.getMonth() === 11 && datePhoto.getDate() >= 22) ||
        (datePhoto.getMonth() === 2 && datePhoto.getDate() <= 20);
      break;
    case "spring":
      periodCheck =
        [3, 4].includes(datePhoto.getMonth()) ||
        (datePhoto.getMonth() === 2 && datePhoto.getDate() >= 21) ||
        (datePhoto.getMonth() === 5 && datePhoto.getDate() <= 20);
      break;
    case "summer":
      periodCheck =
        [6, 7].includes(datePhoto.getMonth()) ||
        (datePhoto.getMonth() === 5 && datePhoto.getDate() >= 21) ||
        (datePhoto.getMonth() === 8 && datePhoto.getDate() <= 23);
      break;
    case "autumn":
      periodCheck =
        [9, 10].includes(datePhoto.getMonth()) ||
        (datePhoto.getMonth() === 8 && datePhoto.getDate() >= 24) ||
        (datePhoto.getMonth() === 11 && datePhoto.getDate() <= 21);
      break;
    case "any":
      periodCheck = true;
      break;
    default:
      periodCheck = true;
  }

  return weatherCheck && timeCheck && periodCheck;
}

/**
 * A partire da un codice meteo restituisce la descrizione
 * @param {*} code codice meteo
 * @param {*} weatherCodes codici meteo
 * @returns descrizione meteo
 * @returns null se il codice non è presente
 */
export function getWeatherByCode(code, weatherCodes) {
  for (const section in weatherCodes) {
    for (const key in weatherCodes[section]) {
      if (code === key) return weatherCodes[section][key];
    }
  }
  return null;
}

/**
 * Controlla se una stringa è vuota
 * @param {*} str stringa da controllare
 * @returns true se la stringa non è vuota
 * @returns false se la stringa è vuota
 */
function isNonEmptyString(str) {
  return typeof str === "string" && str.trim().length > 0;
}

/**
 * Controlla se una foto è valida
 * @param {*} photo foto da controllare
 * @returns true se la foto è valida
 * @returns false se la foto non è valida
 */
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

/**
 * Converte una stringa da camelCase a normal case
 * @param {*} str sitring to convert
 * @returns stringa convertita
 */
export function camelToNormal(str) {
  let result = str.replace(/([A-Z])/g, " $1");
  result = result.split(" ");
  result = result.map((w, i) =>
    i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w.toLowerCase()
  );
  return result.join(" ");
}

/**
 * Genera una hex randomico
 * @returns hex randomico
 */
export function randomColor() {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 16).toString(16);
  }
  return color;
}
