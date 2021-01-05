# Use COVID-19 api to show cases on the map

## Step 1 & Step 2: 
Set up React-Native on mac and Go through React-Native tutorial. 
In the terminal we enter:  
"
-npm install -g expo-cli. 
expo init myproject.    
cd myproject.   
npm start.   
"
Scan QR code then u can change lines in App.js, e.g. <Text>Hello World!</Text>.   
Then on simulator screen u see the screenshot below.  
![Image text](https://github.com/BUEC500C1/covid19-app-xxLin97/blob/master/WechatIMG8.jpeg)
## Step 3: Develop use case to display a map. 
In this part, I use the documentation from "https://github.com/react-native-community/react-native-maps" and you have to include maps in your library first.The code is modified in App.js and the result is shown below in this screenshot.  
![Image text](https://github.com/BUEC500C1/covid19-app-xxLin97/blob/master/Simulator%20Screen%20Shot%20-%20iPhone%2012%20Pro%20Max%20-%202021-01-05%20at%2016.47.15.png). 
## Step 4: Excercise COVID-19 API. 
Type the code“https://api.covid19api.com/countries” then we get covid19 data of every countries and we save it to a json file called country.js  
## Step 5: Overlay data on maps. 
