import { weatherConditions } from "./utils";

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomName(length = 5) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let name = "";
    for (let i = 0; i < length; i++) {
        name += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function generateWeather() {
    let randomIndex = Math.floor(Math.random() * weatherConditions.length);
    return weatherConditions[randomIndex];
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
            let date = new Date(
                2023,
                Math.floor(Math.random() * 12),
                Math.floor(Math.random() * 28)
            );
            let hour = new Date(
                2023,
                0,
                1,
                Math.floor(Math.random() * 24),
                Math.floor(Math.random() * 60),
                Math.floor(Math.random() * 60)
            );
            let lat = Math.random() * (ne[0] - sw[0]) + sw[0];
            let lng = Math.random() * (ne[1] - sw[1]) + sw[1];
            let position = [lat, lng];
            let authorName = randomName();
            let weather = generateWeather();
            data.push({ id, img, date, hour, weather, position, authorName });
        }
        return Promise.resolve(data);
    }
}
