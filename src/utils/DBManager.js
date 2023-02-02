import { weatherCodes } from "./utils";

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function titleCase(str) {
    return str
        .toLowerCase()
        .split(" ")
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}

function randomName() {
    const prefixes = [
        "happy",
        "friendly",
        "joyful",
        "smiling",
        "positive",
        "lovely",
        "kind",
        "gentle",
        "sweet",
        "caring",
    ];
    const suffixes = [
        "bear",
        "panda",
        "otter",
        "bunny",
        "kitten",
        "puppy",
        "fox",
        "deer",
        "racoon",
        "lion",
    ];

    const prefixIndex = Math.floor(Math.random() * prefixes.length);
    const suffixIndex = Math.floor(Math.random() * suffixes.length);

    return titleCase(prefixes[prefixIndex] + " " + suffixes[suffixIndex]);
}

function generateWeather() {
    let randomKey =
        Object.keys(weatherCodes)[
            Math.floor(Math.random() * Object.keys(weatherCodes).length)
        ];
    let weatherKey = Object.keys(weatherCodes[randomKey])[
        Math.floor(Math.random() * Object.keys(weatherCodes[randomKey]).length)
    ];
    return titleCase(weatherCodes[randomKey][weatherKey]);
}

export class DBManager {
    static async getImgsAtCoords(ne, sw) {
        await delay(500);
        let data = [];
        let length = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
        for (let i = 0; i < length; i++) {
            let id =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
            let img = "https://source.unsplash.com/random?sig=" + i;
            let date = (
                new Date(
                    2023,
                    Math.floor(Math.random() * 12),
                    Math.floor(Math.random() * 28)
                ) + ""
            ).substring(0, 15);
            let hour = (
                new Date(
                    2023,
                    0,
                    1,
                    Math.floor(Math.random() * 24),
                    Math.floor(Math.random() * 60),
                    Math.floor(Math.random() * 60)
                ) + " "
            ).substring(16, 21);
            let lat = Math.random() * (ne[0] - sw[0]) + sw[0];
            let lng = Math.random() * (ne[1] - sw[1]) + sw[1];
            let position = [
                (lat + "").substring(0, 6),
                (lng + "").substring(0, 6),
            ];
            let authorName = randomName();
            let weather = generateWeather();
            data.push({ id, img, date, hour, weather, position, authorName });
        }
        return Promise.resolve(data);
    }
}
