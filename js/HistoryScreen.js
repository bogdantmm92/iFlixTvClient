'use strict';

var React = require('react-native');

var FileItem = require('./FileItem');
var Utils = require('./Utils');

var {
  AppRegistry,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ListView,
  StyleSheet,
  Text,
  LinkingIOS,
  View,
} = React;

var HistoryScreen = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var itemsCache = [];
    return {
      itemsCache: [itemsCache],
      dataSource: ds.cloneWithRows(itemsCache),
    };
  },

  componentDidMount: function() {
    this._loadHistory();
  },

  _loadHistory: function() {
    Utils.loadHistoryFromDB().then(function(items) {
      this.setState({
        itemsCache: items,
        dataSource: this.state.dataSource.cloneWithRows(items)
      });
    }.bind(this));
  },

  _onFileClicked: function(item) {
    Utils.triggerItem(item);
  },

  renderItem: function(item) {
    return (<FileItem
      onFileClicked={this._onFileClicked}
      item={item}/>);
  },

  render: function() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderItem} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    // backgroundColor: '#FF0000',
  },
});

module.exports = HistoryScreen;
