const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const monk = require("monk");
const mongo = require("mongodb");

const dbPort = 27017;
const dbURL = `localhost:${dbPort}/hack2019`;
const db = monk(dbURL);
db.then(() => {
  console.log("DB connected to server");
});
const imageDataURI = require("image-data-uri");

const userCollection = db.get("users");
const clothingCollection = db.get("clothingCollection");

const parseResponse = require("../util/parseResponse");
const azureUpload = require("../util/azureUpload");

const API = "https://clothingdetector.cognitiveservices.azure.com/";
const KEY = "ec2576ae25604dc884f427b53bd07eba";

module.exports.enroll = (username, password) =>
  new Promise(async (resolve, reject) => {
    let response = {
      success: false,
      message: ""
    };
    try {
      const existingUsers = await userCollection.count({
        username
      });
      if (existingUsers === 0) {
        await userCollection.insert({
          username,
          password,
          clothing: {},
          pushTokens: []
        });
        const createUserMap = callback => {
          const userMap = {};

          userCollection
            .find({}, { username: 1 })
            .then(users => {
              users.forEach(user => {
                userMap[user._id] = user.username;
              });
              callback(null, users);
            })
            .catch(e => callback(e, null));
        };
        response.success = true;
        response.message = "User enrolled!";
        resolve(response);
      } else {
        response.success = false;
        response.message = "User already exists!";
        resolve(response);
      }
    } catch (error) {
      response.success = false;
      response.message = error.message;
      reject(response);
    }
  });

module.exports.login = (username, password) =>
  new Promise(async (resolve, reject) => {
    let response = {
      success: false,
      message: ""
    };
    try {
      const result = await userCollection.findOne({ username });

      if (result != null && bcrypt.compareSync(password, result.password)) {
        response.token = jwt.sign(
          {
            userID: result._id
          },
          "secret"
        );
        response.success = true;
        response.message = "Login Successful!";
        resolve(response);
      } else {
        response.success = false;
        response.message = "Username or Password incorrect.";
      }
    } catch (error) {
      response.message = error.message;
      reject(response);
    }
  });

module.exports.uploadImage = (username, uri, type) =>
  new Promise(async (resolve, reject) => {
    let response = {
      success: false,
      message: ""
    };
    try {
      const imgData = imageDataURI.decode(uri);
      const imgName = `./static/${imgData.imageType.replace("/", ".")}`;
      fs.writeFile(imgName, imgData.dataBase64, "base64", err => {
        if (err) {
          console.log(err);
        } else {
          console.log("File written");
        }
      });

      let apparel = await azureUpload(imgName, API, KEY, type);

      const time = Date.now();
      let timesWorn = 1;
      await clothingCollection.insert({
        apparel,
        time,
        uri,
        timesWorn
      });
    } catch (error) {
      response.message = error.message;
      reject(response);
    }
  });

module.exports.getValidList = async (username, thisClimate, thisType) => {
  const clothingArray = await clothingCollection.find({});
  const validArray = [];
  clothingArray.forEach(object => {
    const { climate, type } = object.apparel;
    const { time, uri, timesWorn } = object;
    const newObj = {
      time,
      uri,
      timesWorn
    };
    if (climate === thisClimate && type === thisType) {
      validArray.push(newObj);
    }
  });
  const tolerance = 2000000000;

  for (i = 0; i < validArray.length - 1; i++) {
    for (j = 1; j < validArray.length; j++) {
      validArray.sort(() => {
        if (Math.abs(validArray[i].time - validArray[j].time) > tolerance) {
          console.log("worn > time");
          console.log(`validArray[i:${i}]: ${validArray[i].timesWorn}`);
          console.log(`validArray[i:${i}]: ${validArray[i].time}`);
          console.log(`validArray[j:${j}]: ${validArray[j].timesWorn}`);
          console.log(`validArray[j:${j}]: ${validArray[j].time}`);
          // worn > time
          return validArray[i].timesWorn > validArray[j].timesWorn;
        } else {
          // worn < time
          console.log("worn < time");
          console.log(`validArray[i:${i}]: ${validArray[i].timesWorn}`);
          console.log(`validArray[i:${i}]: ${validArray[i].time}`);
          console.log(`validArray[j:${j}]: ${validArray[j].timesWorn}`);
          console.log(`validArray[j:${j}]: ${validArray[j].time}`);

          return validArray[i].time > validArray[j].time;
        }
      });
    }
  }
  return validArray;
};
