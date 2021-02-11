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

export default class AdminHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            AdminInfo: {}
        };
    }

    async componentDidMount() {
        LogBox.ignoreAllLogs = true
        console.disableYellowBox = true
        this.getData()
    }

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem(ConstantKeys.USERDATA)
            if (value !== null) {
                // value previously stored
                console.log("User Data: " + value)
                var userData = JSON.parse(value)

                this.setState({ AdminInfo: userData })
            }
            else {
                console.log("User Data: null " + value)
            }
        } catch (e) {
            console.log("Error : " + e)
        }
    }


    //Action Methods
    btnMenuTap = () => {
        requestAnimationFrame(() => {
            this.props.navigation.dispatch(DrawerActions.toggleDrawer())
        })
    }


    btnAccoutingTap = () => {
        requestAnimationFrame(() => {
            
            this.props.navigation.navigate('Accouting')
        })
    }

    
    render() {
        let MenuIcon = IMG.OtherFlow.MenuIcon
        let logoBannerImg = IMG.InitialFlow.AppBanner

        return (
            <>

                <SafeAreaView style={{ flex: 0, backgroundColor: CommonColors.denim }} />
                <StatusBar barStyle={'dark-content'}
                    backgroundColor={CommonColors.denim}
                />
                <SafeAreaView style={styles.container}>

                    <View style={{ flex: 1, backgroundColor: CommonColors.whiteColor }}>

                        <View style={styles.headerView}>

                            <TouchableOpacity style={styles.btnMenu}
                                onPress={() => this.btnMenuTap()}>

                                <Image style={{ width: 25, height: 25, resizeMode: 'center', tintColor: CommonColors.whiteColor }}
                                    source={MenuIcon}

                                />
                            </TouchableOpacity>

                            <Text style={styles.headerText}>Dashboard</Text>

                            <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                                {/* <Image style={{ width: 25, height: 25, resizeMode: 'center' }}
                                    source={Notification}
                                /> */}
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

                                <View style={{
                                    marginLeft: 20, marginRight: 20, flexDirection: 'row', marginTop: 30, height: Dimensions.get('window').width / 2 - 50,
                                    paddingTop: 10, paddingBottom: 10, shadowColor: CommonColors.shadowColor, borderRadius: 10, backgroundColor: CommonColors.whiteColor
                                }}>

                                    <LinearGradient colors={[CommonColors.denim, CommonColors.governor_bay]}
                                        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                                        style={{
                                            flex: 0.5, marginRight: 10, borderRadius: 10,
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                                            onPress={() => this.btnAccoutingTap()}>

                                            <Text style={{
                                                marginLeft: 10, marginRight: 10, fontSize: SetFontSize.setDimension.ts18, textAlign: 'center',
                                                color: CommonColors.whiteColor, fontFamily: ConstantKeys.INTER_BOLD
                                            }}>
                                                Accouting
                                            </Text>
                                        </TouchableOpacity>
                                    </LinearGradient>

                                    {/* <LinearGradient colors={[CommonColors.denim, CommonColors.governor_bay]}
                                        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                                        style={{
                                            flex: 0.5, marginLeft: 10, borderRadius: 10,
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                                            onPress={() => {
                                                showMessage({
                                                    message: "Simple message",
                                                    type: "info",
                                                    backgroundColor : CommonColors.governor_bay,
                                                    onPress : () => {
                                                        
                                                        this.props.navigation.navigate('AddTransaction')
                                                    },
                                                });
                                            }}>

                                            <Text style={{
                                                marginLeft: 10, marginRight: 10, fontSize: SetFontSize.setDimension.ts18, textAlign: 'center',
                                                color: CommonColors.whiteColor, fontFamily: ConstantKeys.INTER_BOLD
                                            }}>
                                                Fire Notification
                                            </Text>
                                        </TouchableOpacity>
                                    </LinearGradient> */}

                                </View>

                            </ScrollView>

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

})