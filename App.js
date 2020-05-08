import React; 
import {Text, View} from 'react-native';

function mainsc() {
  return (
    <View style = {{flew: 1. justifyContent: 'center', alignItems: 'center'}}>
      <Text> This is a Global Covid-19 cases map <Text>
    <View>
    );
}

const Bottom_tab= createBottomtabNavigator();

export class App extends Globalmap {
  render(){
    return (
      <Navigationcontainer>
        <Bottom_tab.Navigator>
          <Bottom_tab.Sc name = "Home" mode = mainsc>
          <Bottom_tab.Sc name = "Map" mode = Globalmap>
        <Bottom_tab.Navigator>
      <Navigationcontainer>
      )
  }
}

