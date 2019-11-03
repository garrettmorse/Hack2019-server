const parseResponse = (tags, items) => {
  const confident = tags.filter(obj => obj.confidence > 0.5);
  const validClothes = [];

  confident.forEach(object => {
    items.items.forEach(item => {
      if (object.name === item.name.clothing) {
        const tuple = {
          clothing: object.name,
          climate: item.name.climate
        };
        validClothes.push(tuple);
      }
    });
  });
  const json = {
    apparel: validClothes[0].clothing,
    type: items.type,
    climate: validClothes[0].climate
  };
  console.log("JSON");
  console.log(json);
  return json;
};
module.exports = parseResponse;
console.log();
// we parse out the data we don't want from azure here
