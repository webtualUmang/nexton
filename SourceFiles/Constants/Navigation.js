import React, { Component } from 'react';
import { Button, TouchableOpacity, Image, View } from 'react-native';

//Navigation Libraries
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createSwitchNavigator } from "@react-navigation/compat";

//Constants 
import ConstantImage, { IMG } from '../Constants/ImageConstant';
import ConstantColor, { CommonColors } from '../Constants/ColorConstant';
import { ConstantKeys } from '../Constants/ConstantKey';
import FontSizeConstant, { SetFontSize } from '../Constants/FontSize';
import { navigationRef, isReadyRef } from './NavigationService';

//Third Party
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Initial Flow Files
import AutoLogin from '../InitialFlow/AutoLogin'
import Login from '../InitialFlow/Login'

//SideMenu Flow Files
import SideMenu from '../SideMenuFlow/SideMenu'
import MyProfile from '../SideMenuFlow/MyProfile'

//Doctor Dashborad Flow Files
import DoctorDashboard from '../DashboardFlow/Doctor/DoctorDashboard'
import TodayVisit from '../DashboardFlow/Doctor/TodayVisit'
import FutureVisits from '../DashboardFlow/Doctor/FutureVisits'
import DrVisitDetail from '../DashboardFlow/Doctor/DrVisitDetail'
import DrNotification from '../DashboardFlow/Doctor/DrNotification'

//Hospital Dashborad Flow Files
import HospitalDashboard from '../DashboardFlow/Hospital/HospitalDashboard'
import TimeTable from '../DashboardFlow/Hospital/TimeTable'
import VisitDetail from '../DashboardFlow/Hospital/VisitDetail'


//Constant Variable for navigation
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

//Main Switch navigators
// const InitialStack = createStackNavigator()


// Initial Flow Navigator
function InitialFlow() {
    return (
        <Stack.Navigator initialRouteName="AutoLogin">
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="AutoLogin" component={AutoLogin} options={{ headerShown: false }} />
            {/* <Stack.Screen name="DrNotification" component={DrNotification} options={{headerShown:false}} /> */}
        </Stack.Navigator>
    );
}

//Doctor Dashboard Stacks
function DoctorDashboardStack(navigation){
    return(
        <Stack.Navigator initialRouteName="DoctorDashboard">
            <Stack.Screen name="DoctorDashboard" component={DoctorSideMenuFlow} 
                options = {{
                    headerShown : false
                    // headerLeft: () => (
                    //     <NavigationDrawerStructure navigationProps={navigation} />
                    // ),
                    // headerStyle: {
                    //     backgroundColor: '#f4511e', //Set Header color
                    // },
                    // headerTintColor: '#fff', //Set Header text color
                    // headerTitleStyle: {
                    //     fontWeight: 'bold', //Set Header text style
                    // },
                }}
            />
            <Stack.Screen name="TodayVisit" component={TodayVisit} options={{headerShown:false}} /> 
            <Stack.Screen name="DrVisitDetail" component={DrVisitDetail} options={{headerShown:false}} /> 
            <Stack.Screen name="FutureVisits" component={FutureVisits} options={{headerShown:false}} /> 
            <Stack.Screen name="DrNotification" component={DrNotification} options={{headerShown:false}} />
        </Stack.Navigator>
    )
}


//Hospital Dashboard Stacks
function HospitalDashboardStack(navigation){
    return(
        <Stack.Navigator initialRouteName="HospitalDashboard">
            <Stack.Screen name="HospitalDashboard" component={HospitalSideMenuFlow} 
                options = {{
                    headerShown : false
                    // headerLeft: () => (
                    //     <NavigationDrawerStructure navigationProps={navigation} />
                    // ),
                    // headerStyle: {
                    //     backgroundColor: '#f4511e', //Set Header color
                    // },
                    // headerTintColor: '#fff', //Set Header text color
                    // headerTitleStyle: {
                    //     fontWeight: 'bold', //Set Header text style
                    // },
                }}
            />
            <Stack.Screen name="TimeTable" component={TimeTable} options={{headerShown:false}} />
            <Stack.Screen name="VisitDetail" component={VisitDetail} options={{headerShown:false}} />
        </Stack.Navigator>
    )
}


//Doctor SideMenu Flow navigator
function DoctorSideMenuFlow(){
    return(
        <Drawer.Navigator
        
        drawerContent = {(props) => <SideMenu {...props}/>}>
        
        <Drawer.Screen
          name="DoctorDashboard"
          
          options={{
            drawerLabel: 'Dashboard',
            drawerIcon : ({color}) => (
                      
                      <Icon name="home" size={20} color={color} />
            ),
            
          }}
          component={DoctorDashboard}
        />

        {/* <Drawer.Screen
          name="MyProfile"
          options={{
            drawerLabel: 'My Profile',
            drawerIcon : ({color}) => (
                      
                      <Icon name="user" size={20} color={color} />
            ),
          }}
          component={MyProfile}
        /> */}
        
      </Drawer.Navigator>
    );
}


//Hospital SideMenu Flow navigator
function HospitalSideMenuFlow(){
    return(
        <Drawer.Navigator
        
        drawerContent = {(props) => <SideMenu {...props}/>}>
        
        <Drawer.Screen
          name="HospitalDashboard"
          options={{
            drawerLabel: 'Dashboard',
            drawerIcon : ({color}) => (
                      
                <Icon name="home" size={20} color={color} />
            ),
          }}
          component={HospitalDashboard}
        />
        
      </Drawer.Navigator>
    );
}


//********************** Switch Navigator **********************/

var InitialRoot = ''

const AppNavigator = createSwitchNavigator({
    "Login": InitialFlow,
    "DoctorDashboard": DoctorDashboardStack,
    "HospitalDashboard": HospitalDashboardStack
}, {
    initialRouteName: "Login",
});


const AppNavigatorDash = createSwitchNavigator({
    "Login": InitialFlow,
    "DoctorDashboard": DoctorDashboardStack,
    "HospitalDashboard": HospitalDashboardStack
}, {
    initialRouteName: "DoctorDashboard",
});


//***************************************************************/ 

export default class Navigation extends Component {

    async componentDidMount(){
        this.getData()
    }

    getData = async () => {
        try {
        const value = await AsyncStorage.getItem(ConstantKeys.USERDATA)
        if(value !== null) {
            // value previously stored
            console.log("User Data in Navigation FIle: "+value)
            var userData = JSON.parse(value)
    
            if(userData.role === 'Hospital'){
                // this.props.navigation.navigate('HospitalDashboard')
                InitialRoot = "HospitalDashboard"
            }else{
                // this.props.navigation.navigate('DoctorDashboard')
                InitialRoot = "DoctorDashboard"
            }
        }
        else{
            console.log("User Data in Navigation FIle: null "+value)
            // this.props.navigation.replace('Login')
            InitialRoot = "Login"
        }
        } catch(e) {
            // error reading value
            // this.props.navigation.replace('Login')
            InitialRoot = "Login"
            console.log("Error in Navigation FIle: "+e)
        }
    }

    render() {
        return(
            <NavigationContainer 
                ref={navigationRef}
                onReady={() => {
                    isReadyRef.current = true;
            }}>
                
                <AppNavigator />
                   
            </NavigationContainer>
        )
    }
}