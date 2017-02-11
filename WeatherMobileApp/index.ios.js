'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default class WeatherMobileApp extends Component {
  constructor(props) {
      super(props);

      this.state = {
        icon: "\uf00d",
        temperature: "0",
        location: "",
        description: "",
        city: "london"
      };

      this.getWeather();
    }

  getWeather() {
    console.log(this);
    fetch(`http://localhost:5000/weather/${this.state.city}`)
    .then(
      res => res.json()
    ).then(
      res => this.setState({
        icon: res.icon,
        temperature: res.temperature,
        location: res.location,
        description: res.description
      })
    )
  }

  render() {
    return (
      <View style={styles.container}>
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
                   onChangeText={evt => this._onChangeText(evt)}
                   onSubmitEditing={_ => this.getWeather()}
                   clearButtonMode={"always"}
                   clearTextOnFocus={true}
                   enablesReturnKeyAutomatically={true}
                   returnKeyType={"search"}/>
      </View>
    );
  }

  _onChangeText(e) {
    this.setState({
      city: e
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
