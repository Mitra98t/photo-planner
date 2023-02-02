import { periods, times, weatherCodes } from "./utils";

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
    static async getWeatherCodes() {
        await delay(700);
        return Promise.resolve(weatherCodes);
    }
    static async getTimes() {
        await delay(700);
        return Promise.resolve(times);
    }
    static async getPeriod() {
        await delay(700);
        return Promise.resolve(periods);
    }

    static async getImgsAtCoords(ne, sw) {
        await delay(500);
        let data = [];
        let length = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
        // let length = 5;
        const startTimestamp = new Date(2023, 0, 1).getTime();
        const endTimestamp = new Date(2023, 11, 31).getTime();
        const oneDay = 24 * 60 * 60 * 1000;

        for (let i = 0; i < length; i++) {
            let id =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
            let img = "https://source.unsplash.com/random?sig=" + i;
            const randomTimestamp =
                startTimestamp +
                Math.random() * (endTimestamp - startTimestamp);
            const randomDate = new Date(randomTimestamp);
            const hour = randomDate.getHours() * 60 + randomDate.getMinutes();
            const date = Math.floor(
                (randomTimestamp - startTimestamp) / oneDay
            );
            let lat = Math.random() * (ne[0] - sw[0]) + sw[0];
            let lng = Math.random() * (ne[1] - sw[1]) + sw[1];
            let position = [
                (lat + "").substring(0, 6),
                (lng + "").substring(0, 6),
            ];
            let authorName = randomName();
            let weather = generateWeather();
            let votes = Math.floor(Math.random() * (150 - -150 + 1)) + -150;

            data.push({
                id,
                img,
                date,
                hour,
                weather,
                position,
                authorName,
                votes,
            });
        }
        return Promise.resolve(data);
    }

    static async getUserInformation() {
        await delay(300);
        const names = ["John", "Emily", "Michael", "Sarah", "David"];
        const lastNames = ["Doe", "Johnson", "Smith", "Williams", "Brown"];
        const domains = [
            "gmail.com",
            "yahoo.com",
            "hotmail.com",
            "outlook.com",
            "live.com",
        ];

        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomLastName =
            lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomDomain =
            domains[Math.floor(Math.random() * domains.length)];

        return Promise.resolve({
            userName: `${randomName} ${randomLastName}`,
            userEmail: `${randomName.toLowerCase()}.${randomLastName.toLowerCase()}@${randomDomain}`,
        });
    }
}
