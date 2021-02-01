/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

//Local Files
import { ConstantKeys } from './SourceFiles/Constants/ConstantKey'
import Navigation from './SourceFiles/Constants/Navigation'
import Navi from './SourceFiles/Constants/Navi'

import * as NavigationService from './SourceFiles/Constants/NavigationService'

//Firebase
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';


class App extends React.Component {

  async componentDidMount(){

    this.checkApplicationPermission()
    this.NotificationGet()
  }

  componentWillUnmount() {
    this.NotificationGet();
  }

  async checkApplicationPermission() {
    const authorizationStatus = await messaging().requestPermission();
  
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled.');
      this.getToken()
    } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
      console.log('User has provisional notification permissions.');
    } else {
      console.log('User has notification permissions disabled');
      const authorizationStatus = await messaging().requestPermission();

      if (authorizationStatus) {
        console.log('Permission status:', authorizationStatus);
        if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
          console.log('User has notification permissions enabled.');
          this.getToken()
        }
      }
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem(ConstantKeys.FCM_TOKEN);
    console.log("FCM TOKEN from Async Storage: "+fcmToken);
    if (!fcmToken) {
        fcmToken = await messaging().getToken();
        console.log("FCM TOKEN: "+fcmToken);
        if (fcmToken) {
            await AsyncStorage.setItem(ConstantKeys.FCM_TOKEN, fcmToken);
            console.log("FCM TOKEN: "+fcmToken);
        }
    }
  }

  async NotificationGet(){
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );

        // NavigationService.isReadyRef.current = true;
        // NavigationService.navigate('DrNotification');

        setTimeout(() => {
          NavigationService.navigate('DrNotification')
        }, 1000);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );

          // NavigationService.changeStack('DoctorDashboard')

          setTimeout(() => {
            NavigationService.navigate('DrNotification')
          }, 1000);
            
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        // setLoading(false);
      });
  }

  render(){
    return(
      <Navi/>
    )
  }
}


const styles = StyleSheet.create({
});

export default App;
