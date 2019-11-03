const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const monk = require("monk");
const mongo = require("mongodb");

const dbPort = 27000;
const dbURL = `localhost:${dbPort}/database`;
const db = monk(dbURL);
const imageDataURI = require("image-data-uri");

const userCollection = db.get("users");
const clothingCollection = db.get("clothing");

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

module.exports.uploadImage = (uri, type) =>
  new Promise(async (resolve, reject) => {
    let response = {
      success: false,
      message: ""
    };
    try {
      const imgData = imageDataURI.decode(uri);
      const imgName = `./data/${imgData.imageType.replace("/", ".")}`;
      fs.writeFile(imgName, imgData.dataBase64, "base64", err => {
        if (err) {
          console.log(err);
        } else {
          console.log("File written");
        }
      });

      let apparel = await azureUpload(imgName, API, KEY, type);

      const time = Date.now();
      let timesWorn = 0;
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

module.exports.getValidList = (climate, type) => {
  console.log("lol");
};
