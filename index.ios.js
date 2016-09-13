/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Clarifai from 'clarifai';

var options = {
  title: 'Select an Image',
  storageOptions: {
    skipBackup: true,
  },
  maxWidth: 480
};

class Clarifai_ReactNative_Starter extends Component {
  constructor() {
    super();
    this.state = {imageSource:'https://community.clarifai.com/uploads/default/_emoji/clarifai.png', tagText: ''};
    // Get Clarifai API client ready before user choose any image
    Clarifai.initialize({
      'clientId': '{CLIENT_ID}',
      'clientSecret': '{CLIENT_SECRET}'
    });
  }
  selectImage(){
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {
        
        // Do something with the selected image
        this.setState({imageSource: response.uri.replace('file://', '')});
        Clarifai.getTagsByImageBytes(response.data).then(
        (res) => {
          this.setState({tagText:res.results[0].result.tag.classes.toString()});
          console.log(res);
        },
        (error)=>{
          console.log(error);  
        });

      }
    });
  }
  

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.selectImage.bind(this)}>
          <Text>Select an image</Text>
        </TouchableHighlight>
        <Image
          source={{uri: this.state.imageSource}}
          style={styles.image}
        />
        <Text>{this.state.tagText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    width: 200,
    height:200 
  }
});

AppRegistry.registerComponent('Clarifai_ReactNative_Starter', () => Clarifai_ReactNative_Starter);
