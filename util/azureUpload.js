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

const parseResponse = require("./parseResponse");

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

  // Analyze URL image for tags
  let colors = (await computerVisionClient.analyzeImageInStream(
    () => createReadStream(describeImagePath),
    { visualFeatures: ["Color"] }
  )).color;
  return colors;
};

const azureUpload = async (image, API, KEY, type) => {
  try {
    const jsonTags = await computerVisionTags(image);
    const jsonColors = await computerVisionColors(image);
    const casual = {
      type: "casual",
      items: [
        {
          name: {
            clothing: "jacket",
            climate: "mild"
          }
        },
        {
          name: {
            clothing: "hoodie",
            climate: "cold"
          }
        },
        {
          name: {
            clothing: "shirt",
            climate: "hot"
          }
        },
        {
          name: {
            clothing: "day dress",
            climate: "mild"
          }
        },
        {
          name: {
            clothing: "cocktail dress",
            climate: "hot"
          }
        },
        {
          name: {
            clothing: "indoor",
            climate: "mild"
          }
        }
      ]
    };
    const formal = {
      type: "formal",
      items: [
        {
          name: {
            clothing: "suit",
            climate: "mild"
          }
        },
        {
          name: {
            clothing: "blazer",
            climate: "mild"
          }
        },
        {
          name: {
            clothing: "dress shirt",
            climate: "mild"
          }
        }
      ]
    };
    if (type === "formal") {
      const apparel = parseResponse(jsonTags, formal);
      apparel.color = jsonColors.dominantColorForeground;
      return apparel;
    } else {
      let apparel = parseResponse(jsonTags, casual);
      // const apparel = parseResponse(jsonTags, casual);
      apparel.color = jsonColors.dominantColorForeground;

      return apparel;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = azureUpload;
