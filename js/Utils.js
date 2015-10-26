var React = require('react-native');

var _ = require('underscore');

var {
  AsyncStorage,
} = React;

var Utils = {
  loadHistoryFromDB: function() {
    return new Promise(function(resolve, reject) {
        AsyncStorage.getItem("HISTORY").then(
          (result) => {
            resolve(JSON.parse(result || "[]"));
          },
          (error) => {
            reject(error);
          });
      });
  },

  loadLastTorrentFromDB: function() {
    return new Promise(function(resolve, reject) {
        AsyncStorage.getItem("LAST_TORRENT").then(
          (result) => {
            resolve(JSON.parse(result || "[]"));
          },
          (error) => {
            reject(error);
          });
      });
  },
  saveLastTorrentToDB: function(items) {
    return AsyncStorage.setItem("LAST_TORRENT", JSON.stringify(items));
  },

  addItemToHistory: function(itemToAdd) {
    itemToAdd.date = Date.now();
    this.loadHistoryFromDB().then(function(items) {
      items = _.filter(items, function(item) {
        return item.name !== itemToAdd.name;
      });
      AsyncStorage.setItem("HISTORY", JSON.stringify([itemToAdd].concat(items)));
    });
  },

  triggerItem: function(item) {
    var url = 'http://api.iflix.io/?action=trigger&index=' + item.index + '&magnet=' + item.magnet;
    console.log("xxx url: " + url);
    fetch(url, {method: "GET"})
      .then((response) => response.json())
      .then((responseData) => {
        console.log("XXX req: " + JSON.stringify(responseData));
      }.bind(this))
      .catch((error) => {
        console.warn(error);
      });
  },
};

module.exports = Utils;
