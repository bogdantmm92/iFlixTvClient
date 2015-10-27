/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var FilesScreen = require('./js/FilesScreen');
var HistoryScreen = require('./js/HistoryScreen');

var {
  AppRegistry,
  StyleSheet,
  LinkingIOS,
  TouchableHighlight,
  ListView,
  ToolbarAndroid,
  BackAndroid,
  Text,
  View,
} = React;

var UPCClient = React.createClass({

  getInitialState: function() {
    return {
      currentScreen: "FilesScreen",
    };
  },

  componentDidMount: function() {
    BackAndroid.addEventListener('hardwareBackPress', function() {
      if (this.state.currentScreen === "FilesScreen") {
        return false;
      }
      this.setState({currentScreen: "FilesScreen"});
      return true;
    }.bind(this));
  },

  _onActionSelected: function(position) {
    if (position === 0) { // index of 'Settings'
      this.setState({currentScreen: "HistoryScreen"});
    }
  },

  render: function() {
    var currentScreen = (this.state.currentScreen === "FilesScreen") ? <FilesScreen platform="android"/> : <HistoryScreen platform="android"/>
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          title="iFlix"
          actions={[{title: 'History', show: 'always'}]}
          onActionSelected={this._onActionSelected} />
        { currentScreen }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#00FF00',
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
});

AppRegistry.registerComponent('UPCClient', () => UPCClient);
