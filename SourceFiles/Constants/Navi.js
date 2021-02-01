import React, { useEffect } from 'react';
import { Button, TouchableOpacity, Image, View, ActivityIndicator } from 'react-native';


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

// AuthContext
import { AuthContext } from "./Component/Component";

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

const InitialStack = createStackNavigator()
const Stack = createStackNavigator()
const Drawer = createDrawerNavigator();


const RootStackScreen = ({navigation}) => (
    <InitialStack.Navigator headerMode='none' initialRouteName="Login">
        <InitialStack.Screen name="AutoLogin" component={AutoLogin}/>
        <InitialStack.Screen name="Login" component={Login}/>
    </InitialStack.Navigator>
);

//Doctor Dashboard Stacks
const DoctorDashboardStack = ({navigation}) =>{
    return(
        <Stack.Navigator initialRouteName="DoctorDashboard">
            <Stack.Screen name="DoctorDashboard" component={DoctorSideMenuFlow} 
                options = {{
                    headerShown : false
                }}
            />
            <Stack.Screen name="TodayVisit" component={TodayVisit} options={{headerShown:false}} /> 
            <Stack.Screen name="DrVisitDetail" component={DrVisitDetail} options={{headerShown:false}} /> 
            <Stack.Screen name="FutureVisits" component={FutureVisits} options={{headerShown:false}} /> 
            <Stack.Screen name="DrNotification" component={DrNotification} options={{headerShown:false}} />
        </Stack.Navigator>
    )
}

const HospitalDashboardStack = (navigation) => {
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
const HospitalSideMenuFlow =() => {
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

const Navi = () => {

    const [isLoading , setIsLoading ] = React.useState(true)
    const [userData , setUserData ] = React.useState(null)

    useEffect(() => {
        // setTimeout(() => {
        //     setIsLoading(false)
        //     getData()
        // }, 2000);
        getData()
    }, [])

    const getData = async () => {
        try {
        const value = await AsyncStorage.getItem(ConstantKeys.USERDATA)
        if(value !== null) {
            // value previously stored
            console.log("User Data in Navigation FIle: "+value)
            var userData = JSON.parse(value)
    
            if(userData.role === 'Hospital'){
                setUserData("HospitalDashboard")
            }else if(userData.role === 'Doctor'){
                setUserData("DoctorDashboard")
            }else{
                setUserData("Login")
            }
            setIsLoading(false)
        }
        else{
            console.log("User Data in Navigation FIle: null "+value)
            // this.props.navigation.replace('Login')
            setUserData("Login")
            setIsLoading(false)
        }
        } catch(e) {
            // error reading value
            // this.props.navigation.replace('Login')
            setUserData("Login")
            setIsLoading(false)
            console.log("Error in Navigation FIle: "+e)
        }
    }

    const AppNavigator = createSwitchNavigator({
        "Login": RootStackScreen,
        "DoctorDashboard": DoctorDashboardStack,
        "HospitalDashboard": HospitalDashboardStack
    }, {
        initialRouteName: "Login",
    });

    const AppNavigatorDoctor = createSwitchNavigator({
        "Login": RootStackScreen,
        "DoctorDashboard": DoctorDashboardStack,
        "HospitalDashboard": HospitalDashboardStack
    }, {
        initialRouteName: "DoctorDashboard",
    });

    const AppNavigatorHospital = createSwitchNavigator({
        "Login": RootStackScreen,
        "DoctorDashboard": DoctorDashboardStack,
        "HospitalDashboard": HospitalDashboardStack
    }, {
        initialRouteName: "HospitalDashboard",
    });

    if(isLoading){
        return(
            <AutoLogin />
        )
    }

    return(
        <AuthContext.Provider>
            <NavigationContainer ref={navigationRef}
                onReady={() => {
                    isReadyRef.current = true;
            }}> 
            {userData == 'DoctorDashboard' ? 
                    
                    <AppNavigatorDoctor/> 
                :
                    (userData == 'HospitalDashboard' ?
                        <AppNavigatorHospital />
                    :
                        (userData == "Login" ?
                        <AppNavigator />
                        :null)
                    )
                    
                }
            </NavigationContainer>
        </AuthContext.Provider>
    )
}

export default Navi