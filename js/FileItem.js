'use strict';

var React = require('react-native');

var {
  AppRegistry,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  View,
} = React;

var FileItem = React.createClass({

  _onFileClicked: function() {
    if (this.props.onFileClicked) {
      this.props.onFileClicked(this.props.item);
    }
  },

  render: function() {
    var sourceUri = this.props.item.type == "text/plain" ? "https://www.iconfinder.com/icons/315178/download/png/32" : "https://www.iconfinder.com/icons/293273/download/png/64";
    return (
      <TouchableHighlight
        underlayColor='#E6E6E6'
        onPress={ this._onFileClicked }>
        <View style={styles.fileItemContainer}>
          <Image
            style={styles.fileImage}
            source={{uri: sourceUri}} />
          <View style={styles.infoContainer}>
            <Text style={styles.fileName} numberOfLines={1}>
              {this.props.item.name}
            </Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.fileType}>
                {this.props.item.type}
              </Text>
              <Text style={styles.fileSize}>
                {this.props.item.size}
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  fileItemContainer: {
    flex: 1,
    height: 60,
    alignItems: 'center',
    // marginTop: 10,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E6E6E6'
  },
  fileImage: {
    width: 20,
    height: 20,
    marginLeft: 20,
    borderRadius: 0,
    margin: 10,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  // Name
  fileName: {
    // marginTop: 8,
    fontSize: 16,
    color: "#000000",
    marginRight: 20,
    marginBottom: 6,
  },
  fileType: {
    fontSize: 12,
    color: "#BABABA",
    marginRight: 10,
  },
  fileSize: {
    position: 'absolute',
    fontSize: 12,
    color: "#398de3",
    right: 20,
  }

});

module.exports = FileItem;
