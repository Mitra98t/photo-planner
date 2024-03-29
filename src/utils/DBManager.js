import { db, storage } from "../firebase.js";

import { weatherCodes } from "./utils";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { deleteObject, ref } from "firebase/storage";
import Fuse from "fuse.js";

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

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
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
  return {
    code: weatherKey,
    weather: weatherCodes[randomKey][weatherKey],
  };
}

export class DBManager {
  /**
   *  returns weather codes
   */
  static async getWeatherCodes() {
    // Symulated delay
    // await delay(700);
    return Promise.resolve(weatherCodes);
  }

  /**
   * returns photos taken between the given map boundry
   * @param {*} ne north east boundry
   * @param {*} sw south west boundry
   * @returns photos taken between the given map boundry
   * @throws error if ne or sw are not defined
   */
  static async getImgsAtCoords(ne, sw) {
    if (!ne || !sw) return Promise.reject("missing coords");

    let res = [];
    //TODO usare query, non filter
    const coordQuery = query(collection(db, "photos"));

    const querySnapshot = await getDocs(coordQuery);

    querySnapshot.forEach((doc) => {
      res.push({ ID: doc.id, ...doc.data() });
    });

    res = res.filter(
      (r) =>
        r.lat >= sw[0] && r.lng >= sw[1] && r.lat <= ne[0] && r.lng <= ne[1]
    );
    res.sort((a, b) =>
      a.hasOwnProperty("smallURL") && b.hasOwnProperty("smallURL")
        ? 0
        : a.hasOwnProperty("smallURL")
        ? -1
        : 1
    );

    return Promise.resolve(res);
  }

  /**
   * Get photos published in the last week
   * @returns photos published in the last week
   */
  static async getLatesPhotos() {
    let timeLimit = Date.now() - 1000 * 60 * 60 * 24 * 7;
    let res = [];
    const latestQuery = query(
      collection(db, "photos"),
      where("uploadDate", ">=", timeLimit)
    );
    // const latestQuery = query(collection(db, "photos"));

    const querySnapshot = await getDocs(latestQuery);

    querySnapshot.forEach((doc) => {
      res.push({ ID: doc.id, ...doc.data() });
    });

    return Promise.resolve(res);
  }

  /**
   * @deprecated
   * 	@async
   * 	@function getWeatherByTimeAndLoc
   * 	@description Retrieve the weather based on date, time, and location coordinates.
   *  This function symulates the wanted weather
   * 	@param {Date} date - The date to retrieve the weather for.
   * 	@param {Time} time - The time to retrieve the weather for.
   * 	@param {Object} {lat, lng} - The location coordinates to retrieve the weather for.
   * 	@returns {Promise} A promise that resolves with the generated weather data.
   */
  static async getWeatherByTimeAndLoc(date, time, { lat, lng }) {
    await delay(500);
    return Promise.resolve(generateWeather());
  }

  /**
   * @description Retrive all photos based on user UID.
   * @async
   * @function getWeatherByTime
   * @param {string} userUID - The user UID to retrieve the photos for.
   * @returns {Promise} A promise that resolves with an array of photos.
   **/
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

    res.sort((a, b) =>
      a.uploadDate && b.uploadDate ? b.uploadDate - a.uploadDate : 0
    );

    return Promise.resolve(res);
  }

  /**
   * retrive a list of compressed image ready to be shown as placeholder
   */
  static async getImageSample(imgCount) {
    if (!imgCount) Promise.reject("missing image count");

    let res = [];
    const photoSampleQuery = query(
      collection(db, "photos"),
      // orderBy("authorUID", "desc"),
      where("smallURL", "!=", ""),
      limit(imgCount)
    );
    const querySnapshot = await getDocs(photoSampleQuery);

    querySnapshot.forEach((doc) => {
      res.push({ ID: doc.id, ...doc.data() });
    });

    return Promise.resolve(res);
  }

  /**
   * @description Retrive all user info based on user UID.
   * @param {string} UID - The user UID to retrive information for.
   * @returns {Promise} A promise that resolves with an object containing user info.
   */
  static async getUserInformationByUID(UID) {
    if (!UID) return Promise.reject("Missing user id");
    const docRef = doc(db, "users", UID);
    const docSnap = await getDoc(docRef);
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
   * @description Get location info by location name.
   * @param {string} locationName - name of the location to search for.
   * @returns Location information.
   */
  static async getLocationInfoByName(locationName) {
    let locations = await JSON.parse(
      httpGet(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          locationName
        )}&format=json&accept-language=it&limit=1`
      )
    );
    locations.length = 50;

    for (const l in locations) {
      locations[l] = {
        placeID: locations[l].place_id,
        luogo: locations[l].display_name,
        lat: locations[l].lat,
        lng: locations[l].lon,
        //TODO better zoom value
        zoom: 15,
        boundry: locations[l].boundingbox,
      };
    }

    let loc = locations.filter((l) =>
      l.luogo.toLowerCase().startsWith(locationName.toLowerCase())
    )[0];
    if (!loc) return Promise.reject("no corrisponding locations");
    return Promise.resolve(loc);
  }

  /**
   * Returns an array of location suggestions that start with the given `locationName`.
   * @param {string} locationName - The name of the location to search for.
   * @returns {Promise} - A Promise that resolves to an array of location objects.
   */
  static async getLocationSuggestinosByName(locationName) {
    let locations = await JSON.parse(
      httpGet(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          locationName
        )}&format=json&accept-language=it&limit=4`
      )
    );

    for (const l in locations) {
      locations[l] = {
        placeID: locations[l].place_id,
        luogo: locations[l].display_name,
        lat: locations[l].lat,
        lng: locations[l].lon,
        //TODO better zoom value
        zoom: 15,
        boundry: locations[l].boundingbox,
      };
    }

    return Promise.resolve(locations);
  }

  /**
   * @description add a photo to the database.
   * @param {photo} photo - photo object to add to the database.
   * @param {string} photoName - name of the photo to add to the database as ID.
   * @returns {Promise} a promise that resolve with result of the setDoc operation.
   */
  static async addPhoto(photo, photoName) {
    let now = new Date();
    let nowDate = now.getTime();
    return Promise.resolve(
      setDoc(doc(db, "photos", photoName), {
        URL: photo.URL,
        smallURL: photo.smallURL,
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
        weather: {
          weather: photo.weather.weather,
          code: photo.weather.code,
        },
        location: photo.location.luogo,
        lat: photo.location.lat,
        lng: photo.location.lng,
        placeID: photo.location.placeID,
        uploadDate: nowDate,
      })
    );
  }

  /**
   * @description add a user settings to the database.
   * @param {string} userUID user UID
   * @param {settings} settings settings object
   * @returns {Promise} a promise that resolve to the result of the setDoc operation.
   */
  static async addSettingsToUID(userUID, settings) {
    let upSettings = {
      monochromaticMaps: false,
      showEmail: false,
      theme: "light",
    };
    for (const key in upSettings) {
      if (settings.hasOwnProperty(key)) {
        upSettings[key] = settings[key];
      }
    }
    return Promise.resolve(
      setDoc(doc(db, "settings", userUID), { ...upSettings })
    );
  }

  static async getSettingsByUID(userUID) {
    const docRef = doc(db, "settings", userUID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists())
      return Promise.resolve({
        ...docSnap.data(),
      });
    else {
      return Promise.reject("cant fetch settings");
    }
  }

  static async removeImage(imageID) {
    const imageRef = ref(storage, imageID);
    const imageRefSmall = ref(storage, imageID + "_small");

    // Delete the file
    await deleteObject(imageRef);
    try {
      await deleteObject(imageRefSmall);
    } catch (e) {
      console.log("small image not found");
    }

    await deleteDoc(doc(db, "photos", imageID));
    await deleteDoc(doc(db, "votes", imageID));

    return Promise.resolve("deleted");
  }

  static async getVotersByPhotoID(photoID) {
    if (!photoID) return Promise.reject("Missing photo id");
    const docRef = doc(db, "votes", photoID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists())
      return Promise.resolve({
        photoID: photoID,
        upVoters: docSnap.data().upVoters,
        downVoters: docSnap.data().downVoters,
      });
    else {
      return Promise.resolve({
        photoID: photoID,
        upVoters: [],
        downVoters: [],
      });
    }
  }

  static async addVote(vote, userUID, photoID) {
    let currentVotes = await this.getVotersByPhotoID(photoID);
    if (
      vote >= 0 &&
      currentVotes.upVoters.findIndex((voter) => voter === userUID) !== -1
    ) {
      currentVotes.upVoters.splice(
        currentVotes.upVoters.findIndex((voter) => voter === userUID),
        1
      );
      await setDoc(doc(db, "votes", photoID), {
        photoID: photoID,
        upVoters: currentVotes.upVoters,
        downVoters: currentVotes.downVoters,
      });
      return Promise.resolve({
        photoID: photoID,
        upVoters: currentVotes.upVoters,
        downVoters: currentVotes.downVoters,
      });
    }
    if (
      vote <= 0 &&
      currentVotes.downVoters.findIndex((voter) => voter === userUID) !== -1
    ) {
      currentVotes.downVoters.splice(
        currentVotes.downVoters.findIndex((voter) => voter === userUID),
        1
      );
      await setDoc(doc(db, "votes", photoID), {
        photoID: photoID,
        upVoters: currentVotes.upVoters,
        downVoters: currentVotes.downVoters,
      });
      return Promise.resolve({
        photoID: photoID,
        upVoters: currentVotes.upVoters,
        downVoters: currentVotes.downVoters,
      });
    }

    if (currentVotes.upVoters.findIndex((voter) => voter === userUID) !== -1)
      currentVotes.upVoters.splice(
        currentVotes.upVoters.findIndex((voter) => voter === userUID),
        1
      );
    if (currentVotes.downVoters.findIndex((voter) => voter === userUID) !== -1)
      currentVotes.downVoters.splice(
        currentVotes.downVoters.findIndex((voter) => voter === userUID),
        1
      );
    if (
      vote > 0 &&
      currentVotes.upVoters.findIndex((voter) => voter === userUID) === -1
    )
      currentVotes.upVoters = [...currentVotes.upVoters, userUID];
    else if (
      vote < 0 &&
      currentVotes.downVoters.findIndex((voter) => voter === userUID) === -1
    )
      currentVotes.downVoters = [...currentVotes.downVoters, userUID];
    else return Promise.reject("cant vote");

    await setDoc(doc(db, "votes", photoID), {
      photoID: photoID,
      upVoters: currentVotes.upVoters,
      downVoters: currentVotes.downVoters,
    });

    return Promise.resolve({
      photoID: photoID,
      upVoters: currentVotes.upVoters,
      downVoters: currentVotes.downVoters,
    });
  }

  static async getUsersByDisplayName(displayName) {
    let res = [];
    const usersQuery = query(collection(db, "users"));

    const querySnapshot = await getDocs(usersQuery);

    querySnapshot.forEach((doc) => {
      res.push({ ID: doc.id, ...doc.data() });
    });

    let fuse = new Fuse(res, {
      keys: ["username"],
    });

    const result = fuse.search(displayName).map((r) => r.item);

    return Promise.resolve(result.slice(0, 5));
  }

  static async getChangelogComplete() {
    let res = [];
    const changeLogQuery = query(collection(db, "changeLog"));

    const querySnapshot = await getDocs(changeLogQuery);

    querySnapshot.forEach((doc) => {
      res.push({ ID: doc.id, ...doc.data() });
    });

    if (res.length <= 0) return Promise.reject("missing logs");

    res = res.sort((a, b) => b.version.localeCompare(a.version));

    return Promise.resolve(res);
  }

  static async getLastChangelog() {
    let res = [];
    const changeLogQuery = query(collection(db, "changeLog"));

    const querySnapshot = await getDocs(changeLogQuery);

    querySnapshot.forEach((doc) => {
      res.push({ ID: doc.id, ...doc.data() });
    });

    if (res.length <= 0) return Promise.reject("missing logs");

    let toGive = res.sort((a, b) => b.version.localeCompare(a.version))[0];

    return Promise.resolve(toGive);
  }
}
