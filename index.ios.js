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
  NavigatorIOS,
  Text,
  View,
} = React;

var UPCClient = React.createClass({

  // _onWSSend: function() {
  //   console.log("ssxx: send");
  //   this.websocket.send("Salutare");
  // },

  _openHistory: function() {
    this.refs.navios.push({
      component: HistoryScreen,
      title: 'History',
    });
  },

  render: function() {
    return (
      <View style={styles.container}>
        <NavigatorIOS
          ref="navios"
          style={styles.container}
          barTintColor={"#FFFFFF"}
          tintColor={"#398de3"}
          initialRoute={{
            component: FilesScreen,
            rightButtonTitle: "History",
            onRightButtonPress: this._openHistory,
            title: 'iFlix',
            passProps: { myProp: 'foo' },
          }} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#00FF00',
  },
});

AppRegistry.registerComponent('UPCClient', () => UPCClient);
