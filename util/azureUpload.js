"use strict";

const async = require("async");
const path = require("path");
const createReadStream = require("fs").createReadStream;
const sleep = require("util").promisify(setTimeout);
const ComputerVisionClient = require("@azure/cognitiveservices-computervision")
  .ComputerVisionClient;
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;

const API = "https://clothingdetector.cognitiveservices.azure.com/";
const KEY = "ec2576ae25604dc884f427b53bd07eba";

const computerVisionTags = async image => {
  //async works to warn computervision that its an async function and has to wait later
  async.series(
    [
      async function() {},
      function() {
        return new Promise(async function(resolve, reject) {});
      }
    ],
    err => {
      throw err;
    }
  );

  /**
   * AUTHENTICATE
   * This single client is used for all examples.
   */
  let key = KEY; //env variable sets key to computer vision resource key
  let endpoint = API; //env variable sets endpoint to CV resource enpoint url
  if (!key) {
    throw new Error(
      "Set your environment variables for your subscription key and endpoint."
    );
  }

  let computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
    endpoint
  ); //generate computervision object

  let describeImagePath = `${image}`;
  console.log(describeImagePath);

  // Analyze URL image for tags
  let tags = (await computerVisionClient.analyzeImageInStream(
    () => createReadStream(describeImagePath),
    { visualFeatures: ["Tags"] }
  )).tags;
  return tags;
};

const computerVisionColors = async image => {
  //async works to warn computervision that its an async function and has to wait later
  async.series(
    [
      async function() {},
      function() {
        return new Promise(async function(resolve, reject) {});
      }
    ],
    err => {
      throw err;
    }
  );

  /**
   * AUTHENTICATE
   * This single client is used for all examples.
   */
  let key = KEY; //env variable sets key to computer vision resource key
  let endpoint = API; //env variable sets endpoint to CV resource enpoint url
  if (!key) {
    throw new Error(
      "Set your environment variables for your subscription key and endpoint."
    );
  }

  let computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
    endpoint
  ); //generate computervision object

  let describeImagePath = `${image}`;
  console.log(describeImagePath);

  // Analyze URL image for tags
  let colors = (await computerVisionClient.analyzeImageInStream(
    () => createReadStream(describeImagePath),
    { visualFeatures: ["Color"] }
  )).color;
  return colors;
};

const azureUpload = async (image, API, KEY) => {
  const jsonTags = await computerVisionTags(image);
  const jsonColors = await computerVisionColors(image);

  console.log("Boi 1");
  console.log(jsonTags);
  console.log("Boi 2");
  console.log(jsonColors);

  // return json;
};

module.exports = azureUpload;
