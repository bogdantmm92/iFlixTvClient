'use strict';

var React = require('react-native');

var _ = require('underscore');

var FileItem = require('./FileItem');
var Utils = require('./Utils');

var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var Subscribable = require('Subscribable');

var {
  AppRegistry,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ListView,
  StyleSheet,
  ActivityIndicatorIOS,
  Text,
  LinkingIOS,
  AlertIOS,
  View,
} = React;

var FilesScreen = React.createClass({
  mixins: [Subscribable.Mixin],

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var itemsCache = [];

    return {
      itemsCache: [itemsCache],
      dataSource: ds.cloneWithRows(itemsCache),
      // showLoading: true,
    };
  },

  componentDidMount: function() {
    LinkingIOS.addEventListener('url', this._handleOpenURL);
    this.addListenerOn(RCTDeviceEventEmitter,
                       'linkingAndroid',
                       this._handleOpenURL);

    this._loadLastTorrent();
    var url = LinkingIOS.popInitialURL()
    if (url) {
      this._handleOpenURL({url: url});
    }
  },
  componentWillUnmount: function() {
    LinkingIOS.removeEventListener('url', this._handleOpenURL);
  },

  _loadLastTorrent: function() {
    Utils.loadLastTorrentFromDB().then(function(items) {
      this.setState({
        itemsCache: items,
        dataSource: this.state.dataSource.cloneWithRows(items)
      });
    }.bind(this));
  },

  _handleOpenURL: function(event) {
    console.log("xxx: " + event.url);

    this.setState({
      showLoading: true,
    });

    var encodedMagnet = encodeURIComponent(event.url);
    fetch('http://api.iflix.io?action=details&magnet=' + encodedMagnet, {method: "GET"})
      .then((response) => response.json())
      .then((responseData) => {
        console.log("XXX req: " + JSON.stringify(responseData));
        var items = responseData.files;
        var index = 0;
        items = _.each(items, function(item) {
          item.index = index++;
          item.magnet = encodedMagnet;
        });

        Utils.saveLastTorrentToDB(items);

        this.setState({
          itemsCache: items,
          dataSource: this.state.dataSource.cloneWithRows(items),
          showLoading: false,
        });

      }.bind(this))
      .catch((error) => {
        console.warn(error);
      });
  },

  _onFileClicked: function(item) {
    Utils.addItemToHistory(item);

    Utils.triggerItem(item);
  },

  renderItem: function(item) {
    return (<FileItem
      onFileClicked={this._onFileClicked}
      item={item}/>);
  },

  _renderHeader: function() {
    var loading = this._renderLoadingBar();
    var infoHeader = this._renderInfoHeader();
    return (
      <View style={styles.headerContainer}>
        {loading}
        {infoHeader}
      </View>
    );
  },

  _renderInfoHeader: function() {
    return (
      <View style={styles.infoHeader}>
        <Text style={styles.infoHeaderText}>
          {"Torrent files"}
        </Text>
      </View>
    );
  },

  _renderLoadingBar: function() {
    var loading = this.state.showLoading ? 
    (
      this.props.platform === "android" ? 
          (<Text style={styles.centering}>{"Loading"}</Text>)
        :
          <ActivityIndicatorIOS
            animating={true}
            style={[styles.centering, {height: 80}]}
            size="large" />
    ) : <View/>
    return loading;
  },

  render: function() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderHeader={ this._renderHeader }
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
  headerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "stretch",
    // alignItems: 'center',
    justifyContent: 'center',
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

  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: "center",
  },
});

module.exports = FilesScreen;
