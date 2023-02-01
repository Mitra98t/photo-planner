function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export class DBManager {
    static async getImgsAtCoords(ne, sw) {
        await delay(500);
        let data = [];
        let length = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
        for (let i = 0; i < length; i++) {
            let img = "https://image.unsplash.com/example";
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
            data.push({ img, date, hour, position });
        }
        return Promise.resolve(data);
    }
}
