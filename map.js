import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Vibration } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import Geocoder from 'react-native-geocoding';

const countryStyle = require('../mapStyle.json');

export default class Map extends Globalmap
    constructor(props) {
        super(props);
        this.state = {
        latitude: null,
        longitude: null,
        marker: [],
        country: '',
        validCountry: false,
        countryStats: {
          dateOfOccurance: "",
          confirmedCases: 0,
          recoveredPatients: 0,
          deathCount: 0
        }
        }
        this.handlePress = this.handlePress.bind(this);
    }

    findCountry(coordinate){
      Geocoder.init("AIzaSyDyxazCJ99CEdnxoxOG3UIolRj5C8_KvEU");
      var country = '';
      Geocoder.from(coordinate).then(json => {
        var coordinateData = json.results[0].address_components;
        for (var i = 0; i < coordinateData.length; i++){
          for(var j = 0; j < coordinateData[i].types.length; j++){
            if(coordinateData[i].types[j] == "country"){
              country = coordinateData[i].long_name
              break;
            } 
          }
        }

        if(country != ''){
          this.setState({
            country: country
          })
        }
        else {
          this.setState({
            country: "Please select a valid country"
          })
        }
        this.getCountryStatistics();
        ;})
    }

    handlePress(e){
        Geocoder.from(e.nativeEvent.coordinate).then(json => {
          var coordinateData = json.results[0].address_components;
          var country = '';
          for (var i = 0; i < coordinateData.length; i++){
            for(var j = 0; j < coordinateData[i].types.length; j++){
              if(coordinateData[i].types[j] == "country"){
                country = coordinateData[i].long_name
                break;
              } 
            }
          }
          if(country != ''){
            this.setState({
              country: country
            }, () => this.getCountryStatistics())
          }
          ;})
        this.setState({ 
          marker: [{
          coordinates: {
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude
          },
          key: 0}
        ],
        longitude: e.nativeEvent.coordinate.longitude,
        latitude: e.nativeEvent.coordinate.latitude
      }),
        (error) => console.log('Error:', error)
            
    }

    async componentDidMount() {
        const { status } = await Permissions.getAsync(Permissions.LOCATION)

        if (status != 'granted') {
            const response = await Permissions.askAsync(Permissions.LOCATION)
        }
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => this.setState({ 
              marker: [{
              coordinates: {
                latitude: coords.latitude,
                longitude: coords.longitude
              },
              key: 0}
            ],
            longitude: coords.longitude,
            latitude: coords.latitude
          }, () => this.findCountry(coords)),
            (error) => console.log('Error:', error)
        )
    }

    getCountryStatistics() {
      var api_url = `https://api.covid19api.com/total/country/${this.state.country}`;
      fetch(api_url)
        .then((data) => data.json())
        .then((dataJson) => {
          if (dataJson.length >= 1 && dataJson[dataJson.length-1] != undefined){
            this.setState({
              loadingCovidData: false,
              countryStats: {
                dateOfOccurance: dataJson[dataJson.length-1]["Date"],
                confirmedCases: dataJson[dataJson.length-1]["Confirmed"],
                recoveredPatients: dataJson[dataJson.length-1]["Recovered"],
                deathCount: dataJson[dataJson.length-1]["Deaths"]
              }
            });
          }
          else {
            this.setState({
              countryStats: {
                dateOfOccurance: "N/A",
                confirmedCases: 0,
                recoveredPatients: 0,
                deathCount: 0
              }
            });            
          } 
    }).catch((error)=>console.log(error) );
    }

    render(){
        const { latitude, longitude, countryStats, country } = this.state
        var date = countryStats.dateOfOccurance.slice(0,10);
        const stringStat = "Date: " + date +"\n"+ "Confirmed Cases: " + countryStats.confirmedCases +"\n"+
        "Death Count: " + countryStats.deathCount + "\n" + "Recovered: " + countryStats.recoveredPatients;
        if(country == ''){
          return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading location...</Text>
            </View>
        );
        }
        else if(country == 'Retry'){
          return (
            <MapView 
                provider={PROVIDER_GOOGLE}
                style={styles.mapStyle} 
                initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta: 100,
                    longitudeDelta: 0.341
                }}
                onLongPress={this.handlePress}
                customMapStyle={countryStyle}
                rotateEnabled={false}
            >
                {this.state.marker.map(marker => ( 
                <Marker key={marker.key} coordinate={marker.coordinates}
                title={country} /> ))}
            </MapView>
          );   
        }
        else {
            return (
                <MapView 
                    provider={PROVIDER_GOOGLE}
                    style={styles.mapStyle} 
                    initialRegion={{
                        latitude,
                        longitude,
                        latitudeDelta: 100,
                        longitudeDelta: 0.341
                    }}
                    onLongPress={this.handlePress}
                    customMapStyle={countryStyle}
                    rotateEnabled={false}
                    >
                    {this.state.marker.map(marker => (
                    <Marker key={marker.key} coordinate={marker.coordinates}
                    title={country} description={stringStat}/>
                    ))}
                </MapView>
          );   
        }
    }
  }

  const styles = StyleSheet.create({
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });