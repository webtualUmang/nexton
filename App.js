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

import ConstantColor, { CommonColors } from './SourceFiles/Constants/ColorConstant'

//Firebase
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage, hideMessage } from "react-native-flash-message";


class App extends React.Component {

  async componentDidMount(){

    this.checkApplicationPermission()
    this.NotificationGet()
  }

  componentWillUnmount() {
    this.NotificationGet();
    clearTimeout()
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
    

    // App is in Forground State
    messaging().onMessage(remoteMessage => {
      console.log(
        'Notification caused app to open state:',
        remoteMessage,
      );

      // For Display Notification Banner when app is in Forground State
      showMessage({
        message: remoteMessage.notification.title,
        description : remoteMessage.notification.body,
        type: "info",
        duration : 3000,
        backgroundColor : CommonColors.governor_bay,
        onPress : () => {

            /* THIS FUNC/CB WILL BE CALLED AFTER MESSAGE PRESS */

            var data = remoteMessage.data ?? null

            if(data != null){
              if(data.category == 'dailyreport'){
                NavigationService.navigate('DailyReport')
              }
              else if(data.category == 'doctornotification'){
                NavigationService.navigate('DrNotification')
              }
              else{
                
              }
            }else{
              // NavigationService.navigate('DrNotification')
            }
        },
      });
    })

    // App is in Background State
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage
      );

        // NavigationService.isReadyRef.current = true;
        // NavigationService.navigate('DrNotification');

        var data = remoteMessage.data ?? null

        if(data != null){
          if(data.category == 'dailyreport'){
            NavigationService.navigate('DailyReport')
          }
          else if(data.category == 'doctornotification'){
            NavigationService.navigate('DrNotification')
          }
          else{

          }
        }else{
          // NavigationService.navigate('DrNotification')
        }
    });

    // App is in Quite State
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {

          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage, //notification
          );

            setTimeout(() => {
              //NavigationService.navigate('DrNotification')

              var data = remoteMessage.data ?? null

              if(data != null){
                if(data.category == 'dailyreport'){
                  NavigationService.navigate('DailyReport')
                }
                else if(data.category == 'doctornotification'){
                  NavigationService.navigate('DrNotification')
                }
                else{

                }
              }
              else{
                // NavigationService.navigate('DrNotification')
              }
            }, 1000);
            
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
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
