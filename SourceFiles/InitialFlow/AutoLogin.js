import React, { Component } from 'react';
import { View, Text, LogBox, Image } from 'react-native';

//Constants
import { ConstantKeys } from '../Constants/ConstantKey';
import ConstantImage, { IMG } from '../Constants/ImageConstant';


//Third Party
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class AutoLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  performTimeConsumingTask = async() => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        3000
      )
    );
  }

  async componentDidMount(){
    LogBox.ignoreAllLogs = true
    // const data = await this.performTimeConsumingTask();
    //     if (data !== null) {
    //         this.getData();  
    //     }
  }

  getData = async () => {
    try {
    const value = await AsyncStorage.getItem(ConstantKeys.USERDATA)
    if(value !== null) {
        // value previously stored
        console.log("User Data: "+value)
        var userData = JSON.parse(value)

        if(userData.role === 'Hospital'){
            this.props.navigation.navigate('HospitalDashboard')
        }else{
            this.props.navigation.navigate('DoctorDashboard')
        }
    }
    else{
        console.log("User Data: null "+value)
        this.props.navigation.replace('Login')     
    }
    } catch(e) {
    // error reading value
        this.props.navigation.replace('Login')
        console.log("Error : "+e)
    }
}

  render() {
    let logoBannerImg = IMG.InitialFlow.AppBanner
    return (
      <View style={{flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor:'white'}}>
          <Image
            source={logoBannerImg}
            style={{ width: '60%', height: 100, resizeMode: 'contain' }}
          />
      </View>
    );
  }
}
