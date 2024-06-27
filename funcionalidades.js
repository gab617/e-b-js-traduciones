/* const fs = require('fs');
const path = require('path'); */


function findElementById(data, id) {
  for (const category in data) {
    if (data.hasOwnProperty(category)) {
      const foundElement = data[category].find(element => element.id === id);
      if (foundElement) {
        return foundElement;
      }
    }
  }
  return null;
}


module.exports = findElementById;