'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
const dismissKeyboard = require('dismissKeyboard');
const DeviceUUID = require("react-native-device-uuid");

export default class WeatherMobileApp extends Component {
  constructor(props) {
      super(props);

      this.state = {
        icon: "\uf00d",
        temperature: "0",
        location: "",
        description: "",
        city: "",
        geoPos: {}
      };
    }

  getWeatherViaCity() {
    fetch(`http://localhost:5000/city/${this.state.city}`)
    .then(
      res => res.json()
    ).then(
      res => this.setState({
        icon: res.icon,
        temperature: res.temperature,
        location: res.location,
        description: res.description
      })
    ).catch(
      error => Alert.alert("Error", "Network fail")
    )
  }

  getWeatherViaGeo() {
    fetch(`http://localhost:5000/geo?lat=${this.state.geoPos.lat}&lon=${this.state.geoPos.lon}`)
    .then(
      res => res.json()
    ).then(
      res => this.setState({
        icon: res.icon,
        temperature: res.temperature,
        location: res.location,
        description: res.description
      })
    ).catch(
      error => Alert.alert("Error", "Network fail")
    )
  }

  componentDidMount() {
    this.getGeo();
  }

  getGeo() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
            geoPos: {
              lat: position.coords.latitude,
              lon: position.coords.longitude
            }
        });
        this.getWeatherViaGeo();
      },
      (error) => Alert.alert("Unable to get geolocation", error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.outerContainer}
        behavior="padding">
        <TouchableWithoutFeedback onPress={_ => dismissKeyboard()}>
          <View style={styles.innerContainer}>
            <Text style={styles.icon}>
              {this.state.icon}
            </Text>
            <Text style={styles.temperature}>
              {this.state.temperature} °C
            </Text>
            <Text style={styles.location}>
              {this.state.location}
            </Text>
            <Text style={styles.description}>
              {this.state.description}
            </Text>
            <TextInput style={styles.input}
              placeholder="City"
              onChangeText={evt => this._onChangeText(evt)}
              onSubmitEditing={_ => this.getWeatherViaCity()}
              clearButtonMode={"always"}
              clearTextOnFocus={true}
              enablesReturnKeyAutomatically={true}
              returnKeyType={"search"}/>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  _onChangeText(e) {
    this.setState({
      city: e
    })
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  temperature: {
    fontSize: 62,
    fontWeight: "100",
    margin: 0
  },
  location: {
    fontSize: 14,
    fontWeight: "100",
    marginBottom: 20,
  },
  weatherType: {
    fontSize: 34,
    fontWeight: "500"
  },
  input: {
    borderWidth: 1,
    borderColor: "#666",
    height: 40,
    marginVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  icon: {
    fontFamily: 'Weather Icons',
    fontSize: 130,
    padding: 0
  }
});

AppRegistry.registerComponent('WeatherMobileApp', () => WeatherMobileApp);
