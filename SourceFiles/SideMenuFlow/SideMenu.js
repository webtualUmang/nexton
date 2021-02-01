import React, { Component } from 'react';

import { SafeAreaView, View, StyleSheet, Text, Image, Alert , LogBox} from 'react-native';

//Third Party
import { DrawerContentScrollView, DrawerItem, DrawerItemList, } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

//Constants
import ValidationMsg from '../Constants/ValidationConstant';
import { CommonColors } from '../Constants/ColorConstant';
import FontSizeConstant, { SetFontSize } from '../Constants/FontSize';
import { ConstantKeys } from '../Constants/ConstantKey';
import { EventRegister } from 'react-native-event-listeners'


const clearAll = async (props) => {
  try {
    await AsyncStorage.clear()
  } catch (e) {
    // clear error
  }

  // Reset Navigation & Navigate to Login Screen
  props.navigation.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [
        { name: 'Login' },
      ],
    })
  );
  console.log('LogOut Sucess.')
}

var userName = ''
var userEmail = ''


class SideMenu extends Component {
  // const { state, descriptors, navigation, } = props;
  // LogBox.ignoreAllLogs = true

  constructor(props){
    super(props)
    this.state = {
      userName : '',
      userEmail : ''
    }
  }

  componentDidMount(){

    this.getData()

    this.listener = EventRegister.addEventListener('UserName', (data) => {
      console.log('User Name from Event: '+data)
      userName = data
      this.setState({ userName: data })
    })

    this.listener = EventRegister.addEventListener('UserEmail', (data) => {
      console.log('User Email : '+data)
      userEmail = data
      this.setState({ userEmail: data })
    })
  }


  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(ConstantKeys.USERDATA)
      if (value !== null) {
        // value previously stored
        console.log("User Data: " + value)
        var userData = JSON.parse(value)

        this.setState({ userName: userData.name, userEmail : userData.email })
      }
      else {
        console.log("User Data: null " + value)
      }
    } catch (e) {
      console.log("Error : " + e)
    }
  }

  componentWillUnmount(){
    EventRegister.removeEventListener(this.listener)
  }

  render(){

    
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: CommonColors.denim }}>

      <DrawerContentScrollView {...this.props}>

        <View style={{ backgroundColor: CommonColors.denim, }}>
          <Image style={{ width: 70, height: 70, resizeMode: 'cover', borderRadius: 35, marginLeft: 15, marginTop: 20, }}
            source={{ uri: 'https://randomuser.me/api/portraits/women/74.jpg' }}
          />

          <Text style={{
            marginLeft: 15, marginTop: 10, fontFamily: ConstantKeys.INTER_SEMIBOLD, fontSize: SetFontSize.setDimension.ts18,
            color: CommonColors.whiteColor
          }}>
            {this.state.userName}
            </Text>

          <Text style={{
            marginLeft: 15, marginTop: 0, fontFamily: ConstantKeys.INTER_REGULAR, fontSize: SetFontSize.setDimension.ts14,
            color: CommonColors.whiteColor, marginBottom: 10
          }}>
            {this.state.userEmail}
            </Text>
        </View>

        <DrawerItemList {...this.props}
          activeTintColor={CommonColors.whiteColor}
          inactiveTintColor={CommonColors.blackColor}
          labelStyle={{ fontSize: SetFontSize.setDimension.ts14, fontFamily: ConstantKeys.INTER_MEDIUM, }}
        />

        <DrawerItem
          label='Logout'
          icon={({ color }) =>
            <Icon name="sign-out" size={20} color={color} />
          }
          activeTintColor={CommonColors.whiteColor}
          inactiveTintColor={CommonColors.blackColor}
          labelStyle={{ fontSize: SetFontSize.setDimension.ts14, fontFamily: ConstantKeys.INTER_MEDIUM }}
          onPress={() => {
            Alert.alert(
              ValidationMsg.AppName,
              'Are you sure you want to logout?',
              [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                  text: 'Yes',
                  onPress: () => {
                    clearAll(this.props)
                  }
                },
              ],
              { cancelable: true }
            );
          }}
        />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
  }
}



export default SideMenu
