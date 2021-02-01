import React, { Component } from 'react';
import { View, Text, SafeAreaView, StatusBar, StyleSheet, ImageBackground, Image, TextInput,LogBox,
     ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';

//Constants 
import ConstantImage, { IMG } from '../Constants/ImageConstant';
import ConstantColor, { CommonColors } from '../Constants/ColorConstant';
import { ConstantKeys } from '../Constants/ConstantKey';
import FontSizeConstant, { SetFontSize } from '../Constants/FontSize';
import ValidationMsg from '../Constants/ValidationConstant';
import { AuthContext } from '../Constants/Component/Component'

//Third Party
import LinearGradient from 'react-native-linear-gradient';
import Webservice from '../Constants/API'
import {ApiURL} from '../Constants/ApiURL'
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventRegister } from 'react-native-event-listeners'
import messaging from '@react-native-firebase/messaging';


export default class Login extends Component {

    
    constructor(props) {
        super(props);
        this.state = {
            isLoading : false,
            txtUserName: '',
            txtPassword: '',
            Fcm_Token : '',

            ArrLoginData : []
        };
    }

    componentDidMount(){
        LogBox.ignoreAllLogs = true
        this.getData()
        
    }


    getData = async () => {
        try {
        const value = await AsyncStorage.getItem(ConstantKeys.USERDATA)
        if(value !== null) {
            // value previously stored
            console.log("User Data: "+value)
            this.setState({ArrLoginData : JSON.parse(value)})
        }
        } catch(e) {
        // error reading value
        }

        try {
            const FCM_TOKEN = await AsyncStorage.getItem(ConstantKeys.FCM_TOKEN)
            if(FCM_TOKEN !== null) {
                // value previously stored
                console.log("Fcm Token Login : "+FCM_TOKEN)
                this.setState({Fcm_Token : FCM_TOKEN})
            }else{
                console.log("Fcm Token Login not get")
                this.getToken()
            }
            } catch(e) {
            // error reading value
            }
    }
  
    async getToken() {
        let fcmToken = await AsyncStorage.getItem(ConstantKeys.FCM_TOKEN);
        console.log("FCM TOKEN from Async Storage: "+fcmToken);
        if (!fcmToken) {
            fcmToken = await messaging().getToken();
            console.log("FCM TOKEN: "+fcmToken);

            if (fcmToken) {
                this.setState({Fcm_Token : fcmToken})
                await AsyncStorage.setItem(ConstantKeys.FCM_TOKEN, fcmToken);
                console.log("FCM TOKEN: "+fcmToken);
            }
        }
      }

    API_LOGIN = () => {
        this.setState({ isLoading : true})
        Webservice.post(ApiURL.Login, {
            username: this.state.txtUserName,
            password: this.state.txtPassword,
            device : Platform.OS,
            token : this.state.Fcm_Token,
        })
            .then(response => {
                //   this.setState({spinner: false});
                if (response == null) {
                    this.setState({ loading: false });
                    alert('error');
                }
                console.log(response);

                console.log('Login Response : '+JSON.stringify(response.data.Data))
                this.setState({ isLoading : false})

                if(response.data.Status == 1){

                    var userData = response.data.Data[0]

                    EventRegister.emit('UserName', userData.name)
                    EventRegister.emit('UserEmail', userData.email)

                    this.setState({ArrLoginData : userData})
                    this.storeData(JSON.stringify(userData))

                    if(userData.role === 'Hospital'){
                        this.props.navigation.navigate('HospitalDashboard')
                    }else{
                        this.props.navigation.navigate('DoctorDashboard')
                    }
                    
                }else{
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
          await AsyncStorage.setItem(ConstantKeys.USERDATA, value)
        } catch (e) {
          // saving error
        }
      }

    //Action Methods
    btnLoginTap = () =>{
        requestAnimationFrame(()=>{

            if(this.state.txtUserName == ''){
                Toast.showWithGravity(ValidationMsg.EmptyUserName, Toast.SHORT, Toast.BOTTOM);
            }else if(this.state.txtPassword == ''){
                Toast.showWithGravity(ValidationMsg.EmptyPassword, Toast.SHORT, Toast.BOTTOM);

            }else{
                this.API_LOGIN()
            }
        })
    }

    render() {
        //   let backgroundImg = IMG.InitialFlow.backgroundImg
        let logoBannerImg = IMG.InitialFlow.AppBanner

        return (
            <View style={styles.container}>

                <StatusBar
                    barStyle='light-content'
                />

                {/* <ImageBackground
                source={backgroundImg}
                style={{ width: '100%', height: '100%' }}
            /> */}

                <SafeAreaView style={{ flex: 1, backgroundColor: CommonColors.whiteColor }}>

                    <View style={{ height:'100%', width:'100%'}}>
                        <ScrollView style={{flex:1}}>
                        <View style={{ marginTop: 70, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={logoBannerImg}
                                style={{ width: '60%', height: 100, resizeMode: 'contain' }}
                            />
                        </View>

                        <Text style={styles.titleLoginText}>
                            Login
                        </Text>

                        <Text style={styles.titleUserName}>
                            User Name
                        </Text>

                        <View style={styles.viewTextinputStyle}>
                            <TextInput style={styles.TextinputStyle}
                                numberOfLines={1}
                                multiline={false}
                                autoCapitalize={'none'}
                                scrollEnabled={false}
                                keyboardType='email-address'
                                onChangeText={(txtUserName) => this.setState({ txtUserName })}
                                value={this.state.txtUserName}
                                placeholder="Enter UserName" />
                        </View>

                        <Text style={styles.titlePassword}>
                            Password
                        </Text>

                        <View style={styles.viewTextinputStyle}>
                            <TextInput style={styles.TextinputStyle}
                                numberOfLines={1}
                                secureTextEntry={true}
                                keyboardType='default'
                                onChangeText={(txtPassword) => this.setState({ txtPassword })}
                                value={this.state.txtPassword}
                                placeholder="Enter Password" />
                        </View>

                        <LinearGradient colors={[CommonColors.denim, CommonColors.governor_bay]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.gradientLogin}>

                            <TouchableOpacity style={styles.btnLogin}
                                onPress={() => this.btnLoginTap()}> 
                                <Text style={styles.txtLogin}>
                                    Log In
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>

                            
                    </ScrollView>

                    {this.state.isLoading == true ?
                            <View style={{height:'100%' , width : '100%',flex:1,backgroundColor:CommonColors.shadowColor,justifyContent: 'center', position:'absolute'}}>
                                    <ActivityIndicator size="large" color={CommonColors.midnightBlueColor}>

                                    </ActivityIndicator>
                            </View>  
                            :null }
                    </View>
                   

                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: CommonColors.whiteColor
    },
    titleLoginText: {
        marginTop: 50, marginLeft: 20, marginRight: 20, textAlign: 'center',
        color: CommonColors.midnightBlueColor, fontSize: SetFontSize.setDimension.ts30,
        fontFamily: ConstantKeys.INTER_EXTRA_BOLD
    },
    titleUserName: {
        marginTop: 20, marginLeft: 20, marginRight: 20,
        color: CommonColors.midnightBlueColor, fontSize: SetFontSize.setDimension.ts18,
        fontFamily: ConstantKeys.INTER_BOLD
    },
    titlePassword: {
        marginTop: 10, marginLeft: 20, marginRight: 20,
        color: CommonColors.midnightBlueColor, fontSize: SetFontSize.setDimension.ts18,
        fontFamily: ConstantKeys.INTER_BOLD
    },
    viewTextinputStyle: {
        height: 50,
        marginRight: 20,
        marginTop: 5,
        marginLeft: 20,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: CommonColors.whiteColor,
        borderColor: CommonColors.denim,
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 3,
        shadowOpacity: 0.5,
        shadowColor: CommonColors.shadowColor
    },
    TextinputStyle: {
        marginLeft: 8,
        marginRight: 8,
        fontSize: SetFontSize.setDimension.ts16,
        fontFamily: ConstantKeys.INTER_MEDIUM,
        color: CommonColors.blackColor,
        height: 50
    },
    gradientLogin: {
        marginLeft: 20, marginRight: 20, borderRadius: 10,
        height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 30
    },
    btnLogin : {
        height:'100%',width:'100%',
        justifyContent:'center',alignItems:'center'
    },
    txtLogin: {
        color: CommonColors.whiteColor,
        fontSize: SetFontSize.setDimension.ts20,
        fontFamily: ConstantKeys.INTER_BOLD
    }
})
