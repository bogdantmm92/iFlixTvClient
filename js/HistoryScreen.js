'use strict';

var React = require('react-native');
var _ = require('underscore');
var moment = require('moment');

var FileItem = require('./FileItem');
var Utils = require('./Utils');

var SearchBar = require('react-native-search-bar');

var {
  AppRegistry,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ListView,
  StyleSheet,
  Text,
  LinkingIOS,
  AlertIOS,
  View,
} = React;

var HistoryScreen = React.createClass({
  getInitialState: function() {
    var getSectionData = (dataBlob, sectionID) => {
        return dataBlob[sectionID];
    }

    var getRowData = (dataBlob, sectionID, rowID) => {
        return dataBlob[sectionID + ':' + rowID];
    }

    var ds = new ListView.DataSource({
      getRowData: getRowData,
      getSectionData: getSectionData,
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    var itemsCache = [];
    return {
      itemsCache: [itemsCache],
      dataSource: ds.cloneWithRowsAndSections(itemsCache),
    };
  },

  componentDidMount: function() {
    this._loadHistory();
  },

  _updateWithSections: function(items) {
    var dataBlob = {};
    var sections = [];
    var rows = [];
    _.each(items, function(item) {
      var section = parseInt(item.date / (3600 * 1000));
      if (!dataBlob[section]) {
        dataBlob[section] = item.date;
        sections.push(section);
        rows.push([item.name]);
      } else {
        _.last(rows).push(item.name);
      }
      dataBlob[section + ":" + item.name] = item;
    });

    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sections, rows)
    });
  },

  _loadHistory: function() {
    Utils.loadHistoryFromDB().then(function(items) {
      this.setState({
        itemsCache: items
      });
      this._updateWithSections(items);
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

  renderSectionHeader: function(sectionData, sectionID) {
    var date = new Date(sectionData);
    date = moment(date).format('MMMM Do YYYY, h a');
    return (
      <View style={styles.infoHeader}>
        <Text style={styles.infoHeaderText}>{date}</Text>
      </View>
    );
  },

  _onChangeText: function(text) {
    var items = _.filter(this.state.itemsCache, (item) => {
      return item.name.toLowerCase().indexOf(text.toLowerCase()) > -1;
    });
    this._updateWithSections(items);
  },
  _onSearchButtonPress: function() {

  },
  _onCancelButtonPress: function() {

  },

  renderHeader: function() {
    var searchHeader = (this.props.platform === "android") ? <View/> :
      (<SearchBar
        placeholder='Search'
        onChangeText={this._onChangeText}
        onSearchButtonPress={this._onSearchButtonPress}
        onCancelButtonPress={this._onCancelButtonPress} />
      );
    return searchHeader;
  },

  render: function() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderSectionHeader={this.renderSectionHeader}
          renderHeader={this.renderHeader}
          renderRow={this.renderItem} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // top: 0,
    // backgroundColor: '#FF0000',
  },
  infoHeader: {
    flex: 1,
    alignItems: "stretch",
    padding: 8,
    backgroundColor: "#F2F2F2",
  },
  infoHeaderText: {
    fontSize: 12,
    color: "#398de3",
    fontWeight: "bold",
  },
});

module.exports = HistoryScreen;
