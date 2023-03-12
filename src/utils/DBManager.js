import { auth, db, storage } from "../firebase.js";
import { getAuth } from "firebase/auth";

import { periods, times, weatherCodes } from "./utils";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import locations from "../mocupData/locations.json";
import { deleteObject, ref } from "firebase/storage";

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

export function randomName() {
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

  return titleCase(prefixes[prefixIndex] + "" + suffixes[suffixIndex]);
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

function randomCameraModel() {
  const cameraModels = [
    "Canon EOS R5",
    "Canon EOS R6",
    "Canon EOS RP",
    "Canon EOS 1DX Mark III",
    "Canon EOS M50 Mark II",
    "Nikon Z7 II",
    "Nikon Z6 II",
    "Nikon D6",
    "Nikon D850",
    "Nikon D780",
    "Sony A7 III",
    "Sony A7R IV",
    "Sony A9 II",
    "Sony A6600",
    "Sony A6400",
    "Fujifilm X-T4",
    "Fujifilm X-T3",
    "Fujifilm X-Pro3",
    "Fujifilm GFX 100",
    "Fujifilm X100V",
    "Olympus OM-D E-M1 Mark III",
    "Olympus PEN E-PL9",
    "Olympus PEN E-PL10",
    "Olympus Tough TG-6",
    "Olympus Tough TG-Tracker",
    "Panasonic Lumix S5",
    "Panasonic Lumix S1R",
    "Panasonic Lumix GH5",
    "Panasonic Lumix GH5S",
    "Panasonic Lumix G100",
    "Leica Q2",
    "Leica M10",
    "Leica SL2",
    "Leica CL",
    "Leica T",
    "Hasselblad X1D II 50C",
    "Hasselblad H6D-400c",
    "Hasselblad H5D-50c",
    "Hasselblad 907X 50C",
    "Hasselblad HV",
  ];

  const randomIndex = Math.floor(Math.random() * cameraModels.length);
  return cameraModels[randomIndex];
}

function randomCameraSettings() {
  const ISO = 100 * Math.floor(Math.random() * (256 - 1) + 1);
  let aperture = (Math.random() * (0.9 - 22) + 22).toFixed(1);
  let shutterSpeed = Math.random() * (3000 - 1) + 3000;
  let zoom = Math.floor(Math.random() * (101 - 1) + 1);

  if (shutterSpeed < 100) {
    shutterSpeed /= 100;
    const fraction = shutterSpeed.split(".");
    const denominator = Math.pow(10, fraction[1].length);
    shutterSpeed = `1/${denominator}`;
  } else {
    shutterSpeed /= 100;
    shutterSpeed = Math.floor(shutterSpeed);
  }

  if (aperture > 10) {
    aperture = Math.floor(aperture);
  }

  return {
    ISO,
    aperture,
    shutter: shutterSpeed,
    zoom,
  };
}
function generatePhotoDescription() {
  const photoDescriptions = [
    "Immagine suggestiva di un tramonto sulla spiaggia.",
    "Paesaggio montano con neve e alberi.",
    "Vista aerea della città al crepuscolo.",
    "Ritratto di un sorridente bambino al parco.",
    "Foto artistica di una farfalla su un fiore.",
    "Scatto notturno di un grattacielo illuminato.",
    "Paesaggio marino con barche e onde.",
  ];

  let description =
    photoDescriptions[Math.floor(Math.random() * photoDescriptions.length)];
  return description;
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
    let res = [];
    //TODO usare query, non filter
    const coordQuery = query(
      collection(db, "photos")
      // where("lat", "==", "43.7714"),
      // where("lng", ">=", sw[1]),
      // where("lat", "<=", ne[0]),
      // where("lng", "<=", ne[1])
    );

    const querySnapshot = await getDocs(coordQuery);

    querySnapshot.forEach((doc) => {
      res.push({ ID: doc.id, ...doc.data() });
    });

    res = res.filter(
      (r) =>
        r.lat >= sw[0] && r.lng >= sw[1] && r.lat <= ne[0] && r.lng <= ne[1]
    );

    return Promise.resolve(res);
  }
  // static async getImgsAtCoords(ne, sw) {
  //   await delay(500);
  //   let data = [];
  //   let length = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
  //   // let length = 5;
  //   const startTimestamp = new Date(2023, 0, 1).getTime();
  //   const endTimestamp = new Date(2023, 11, 31).getTime();
  //   const oneDay = 24 * 60 * 60 * 1000;

  //   for (let i = 0; i < length; i++) {
  //     let id =
  //       Math.random().toString(36).substring(2, 15) +
  //       Math.random().toString(36).substring(2, 15);
  //     let img = "https://source.unsplash.com/random?sig=" + i;
  //     const randomTimestamp =
  //       startTimestamp + Math.random() * (endTimestamp - startTimestamp);
  //     const randomDate = new Date(randomTimestamp);
  //     const hour = randomDate.getHours() * 60 + randomDate.getMinutes();
  //     const date = Math.floor((randomTimestamp - startTimestamp) / oneDay);
  //     let lat = Math.random() * (ne[0] - sw[0]) + sw[0];
  //     let lng = Math.random() * (ne[1] - sw[1]) + sw[1];
  //     let position = [(lat + "").substring(0, 6), (lng + "").substring(0, 6)];
  //     let authorName = randomName();
  //     let weather = generateWeather();
  //     let votes = Math.floor(Math.random() * (150 - -150 + 1)) + -150;

  //     let camera = randomCameraModel();
  //     let cameraSettings = randomCameraSettings();
  //     let description = generatePhotoDescription();
  //     data.push({
  //       id,
  //       img,
  //       date,
  //       hour,
  //       weather,
  //       position,
  //       authorName,
  //       votes,
  //       camera,
  //       cameraSettings,
  //       description,
  //     });
  //   }
  //   return Promise.resolve(data);
  // }

  static async getImagesByUID(userUID) {
    let res = [];
    const photoByUIDQuery = query(
      collection(db, "photos"),
      where("authorUID", "==", userUID)
    );
    const querySnapshot = await getDocs(photoByUIDQuery);

    querySnapshot.forEach((doc) => {
      res.push({ ID: doc.id, ...doc.data() });
    });

    return Promise.resolve(res);
  }

  static async getUserInformationByUID(UID) {
    if (!UID) return Promise.reject("Missing user id");
    const docRef = doc(db, "users", UID);
    const docSnap = await getDoc(docRef);
    console.log(docSnap);
    if (docSnap.exists())
      return Promise.resolve({
        UID: UID,
        userName: `${docSnap.data().username}`,
        userEmail: `${docSnap.data().email}`,
      });
    else {
      return Promise.reject("Missing user id");
    }
  }

  /**
   *
   * @param {*} locationName Nome luogo da cercare
   * @returns informations of founded location
   */
  static async getLocationInfoByName(locationName) {
    await delay(300);
    let loc = locations.filter((l) =>
      l.luogo.toLowerCase().startsWith(locationName.toLowerCase())
    )[0];
    if (!loc) return Promise.reject("no corrisponding locations");
    return Promise.resolve(loc);
  }

  /**
   * Returns an array of location suggestions that start with the given `locationName`.
   *
   * @param {string} locationName - The name of the location to search for.
   * @returns {Promise<Array>} - A Promise that resolves to an array of location objects.
   */
  static async getLocationSuggestinosByName(locationName) {
    await delay(300);
    if (!locationName) {
      return Promise.resolve([]);
    }
    let locs = locations.filter((l) =>
      l.luogo.toLowerCase().startsWith(locationName.toLowerCase())
    );
    return Promise.resolve(locs);
  }

  static async addPhoto(photo, photoName) {
    return Promise.resolve(
      setDoc(doc(db, "photos", photoName), {
        URL: photo.URL,
        authorUID: photo.authorUID,
        fileData: {
          fileName: photo.file.nameComplete,
          name: photo.file.name,
          description: photo.file.description,
          type: photo.file.type,
          creationDate: photo.file.creationDate,
          creationTime: photo.file.creationTime,
        },
        camera: {
          model: photo.camera.model,
          make: photo.camera.make,
        },
        cameraSettings: {
          ISO: photo.exif.ISO,
          aperture: photo.exif.aperture,
          focalLength: photo.exif.focalLength,
          shutterSpeed: photo.exif.shutterSpeed,
        },
        location: photo.location.luogo,
        lat: photo.location.lat,
        lng: photo.location.lng,
      })
    );
  }

  static async removeImage(imageID) {
    const imageRef = ref(storage, imageID);

    // Delete the file
    let deleteImageRes = await deleteObject(imageRef);

    let deleteDocRes = await deleteDoc(doc(db, "photos", imageID));

    return Promise.resolve({ ...deleteDocRes, ...deleteImageRes });
  }
}
