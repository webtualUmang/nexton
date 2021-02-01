import React, { Component } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, StyleSheet, LogBox, ScrollView, Dimensions, } from 'react-native';

//Constants 
import ConstantImage, { IMG } from '../../Constants/ImageConstant';
import ConstantColor, { CommonColors } from '../../Constants/ColorConstant';
import { ConstantKeys } from '../../Constants/ConstantKey';
import FontSizeConstant, { SetFontSize } from '../../Constants/FontSize';
import ValidationMsg from '../../Constants/ValidationConstant';

//Third Party
import { DrawerActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Webservice from '../../Constants/API'
import { ApiURL } from '../../Constants/ApiURL'
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class DoctorDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DoctorInfo: {}
    };
  }

  async componentDidMount() {
    LogBox.ignoreAllLogs = true
    console.disableYellowBox = true
    this.getData()
    this.NotificationGet()
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(ConstantKeys.USERDATA)
      if (value !== null) {
        // value previously stored
        console.log("User Data: " + value)
        var userData = JSON.parse(value)

        this.setState({ DoctorInfo: userData })
        this.API_DOCTOR_INFO(userData.id)
      }
      else {
        console.log("User Data: null " + value)
      }
    } catch (e) {
      console.log("Error : " + e)
    }
  }



  API_DOCTOR_INFO = (doctor_id) => {

    Webservice.post(ApiURL.GetDoctorInfo, {
      users_id: doctor_id,
    })
      .then(response => {
        //   this.setState({spinner: false});
        if (response == null) {
          this.setState({ loading: false });
          alert('error');
        }
        console.log(response);

        console.log('Doctor Info Response : ' + JSON.stringify(response.data.Data))

        if (response.data.Status == 1) {
          this.storeData(JSON.stringify(response.data.Data[0]))
        } else {
          Toast.showWithGravity(response.data.Msg, Toast.SHORT, Toast.BOTTOM);
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //Helper Methods
  storeData = async (value) => {
    try {
      await AsyncStorage.setItem(ConstantKeys.DOCTOR_INFO, value)
    } catch (e) {
      // saving error
    }
  }

  //Action Methods
  btnMenuTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    })
  }

  btnNotificationTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate('DrNotification')
    })
  }


  btnTodayVisitTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate('TodayVisit')
    })
  } 

  btnNextVisitTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate('FutureVisits')
    })
  }

  render() {
    let MenuIcon = IMG.OtherFlow.MenuIcon
    let logoBannerImg = IMG.InitialFlow.AppBanner
    let Notification = IMG.OtherFlow.Notification

    return (
      <>
     
        <SafeAreaView style={{flex:0, backgroundColor:CommonColors.denim}}/>
        <StatusBar barStyle={'dark-content'}
          backgroundColor={CommonColors.denim}
        />
         <SafeAreaView style={styles.container}>

        <View style={{ flex: 1, backgroundColor: CommonColors.whiteColor }}>

          <View style={styles.headerView}>

            <TouchableOpacity style={styles.btnMenu}
              onPress={() => this.btnMenuTap()}>

              <Image style={{ width: 25, height: 25, resizeMode: 'center', tintColor:CommonColors.whiteColor }}
                source={MenuIcon}
                
              />
            </TouchableOpacity>

            <Text style={styles.headerText}>Dashboard</Text>

            <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}
              onPress={() => this.btnNotificationTap()}>
              <Image style={{ width: 25, height: 25, resizeMode: 'center' }}
                source={Notification}
              />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
              <View style={{ marginTop: 70, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  source={logoBannerImg}
                  style={{ width: '60%', height: 100, resizeMode: 'contain' }}
                />
              </View>

              <View style={{marginLeft:20,marginRight:20,flexDirection:'row',marginTop:30,height: Dimensions.get('window').width /2 - 50,
                    paddingTop:10,paddingBottom:10,shadowColor: CommonColors.shadowColor, borderRadius: 10,backgroundColor:CommonColors.whiteColor}}>
                    
                <LinearGradient colors={[CommonColors.denim, CommonColors.governor_bay]}
                  start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                  style={{flex:0.5,marginRight:10,borderRadius:10,
                          alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity style={{flex:1, alignItems:'center',justifyContent:'center'}}
                          onPress={() => this.btnTodayVisitTap()}>

                        <Text style={{marginLeft:10,marginRight:10, fontSize:SetFontSize.setDimension.ts18,textAlign:'center',
                              color:CommonColors.whiteColor, fontFamily:ConstantKeys.INTER_BOLD}}>
                          Today's Visit
                        </Text>
                    </TouchableOpacity>
                  </LinearGradient>

                  <LinearGradient colors={[CommonColors.denim, CommonColors.governor_bay]}
                  start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                  style={{flex:0.5,marginLeft:10,borderRadius:10,
                          alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity style={{flex:1, alignItems:'center',justifyContent:'center'}}
                          onPress={() => this.btnNextVisitTap()}>

                        <Text style={{marginLeft:10,marginRight:10, fontSize:SetFontSize.setDimension.ts18,textAlign:'center',
                              color:CommonColors.whiteColor, fontFamily:ConstantKeys.INTER_BOLD}}>
                          Next 7 days Visit
                        </Text>
                    </TouchableOpacity>
                  </LinearGradient>

              </View>
            </ScrollView>
            <View>
              {/* <LinearGradient colors={[CommonColors.brinkPinkColor, CommonColors.lightSlateBlueColor]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.gradientLogin}>

                <TouchableOpacity style={styles.btnTimeTable}
                  onPress={() => this.btnTodayVisitTap()}>
                  <Text style={styles.txtTimeTable}>
                    Today's Visit
                  </Text>
                </TouchableOpacity>
              </LinearGradient> */}
            </View>
          </View>
        </View>
      </SafeAreaView>
      </>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: CommonColors.whiteColor,
  },
  headerView: {
    height: 74, width: '100%', backgroundColor: CommonColors.denim,
    alignItems: 'center', flexDirection: 'row',
    elevation: 5, shadowColor: CommonColors.shadowColor,
    shadowOpacity: 0.2, shadowRadius: 2,
    shadowOffset: {
      height: 4,
      width: 0
    },
  },
  btnMenu: {
    width: 30, height: 30, justifyContent: 'center',
    alignItems: 'center', marginLeft: 20
  },
  headerText: {
    fontFamily: ConstantKeys.INTER_EXTRA_BOLD, fontSize: SetFontSize.setDimension.ts20,
    color: CommonColors.whiteColor, flex: 1, textAlign: 'center'
  },
  gradientLogin: {
    height: 70, justifyContent: 'center', alignItems: 'center'
  },
  btnTimeTable: {
    height: '100%', width: '100%',
    justifyContent: 'center', alignItems: 'center'
  },
  txtTimeTable: {
    color: CommonColors.whiteColor,
    fontSize: SetFontSize.setDimension.ts20,
    fontFamily: ConstantKeys.INTER_BOLD
  }
})