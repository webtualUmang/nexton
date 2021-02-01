import React, { Component } from 'react';
import {
    View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, LogBox,
    StyleSheet, ActivityIndicator, FlatList
} from 'react-native';

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
import Moment from 'moment';


export default class DrNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            ArrMessages: [],
            DoctorInfo: {}
        };
    }

    async componentDidMount(){
        LogBox.ignoreAllLogs = true
        this.getData()
    }

    getData = async () => {
        try {
          const value = await AsyncStorage.getItem(ConstantKeys.USERDATA)
          if (value !== null) {
            // value previously stored
            console.log("User Data: " + value)
            var userData = JSON.parse(value)
    
            this.setState({ DoctorInfo: userData })
            this.API_GETMESSAGES(userData.id)
          }
          else {
            console.log("User Data: null " + value)
          }
        } catch (e) {
          console.log("Error : " + e)
        }
    }

    API_GETMESSAGES = (user_id) => {
        this.setState({isLoading : true})
        Webservice.post(ApiURL.Get_Messages, {
            users_id: user_id,
          })
            .then(response => {
              //   this.setState({spinner: false});
              if (response == null) {
                this.setState({ loading: false });
                alert('error');
              }
              console.log(response);
    
              console.log('Get Massages Response : ' + JSON.stringify(response.data.Data))
      
              if (response.data.Status == 1) {
                this.setState({ArrMessages : response.data.Data, isLoading : false})
              } else {
                Toast.showWithGravity(response.data.Msg, Toast.SHORT, Toast.BOTTOM);
              }
            })
            .catch((error) => {
              console.log(error)
            })
    }

    //Action Methods
    btnBackTap = () => {
        requestAnimationFrame(() => {
            this.props.navigation.goBack()
        })
    }

    render() {
        let BackIcon = IMG.OtherFlow.BackIcon

        return (
            <>
                <SafeAreaView style={{ flex: 0, backgroundColor: CommonColors.denim }} />
                <StatusBar barStyle={'dark-content'}
                    backgroundColor={CommonColors.denim}
                />

                <SafeAreaView style={styles.container}>
                    <View style={{ flex: 1, backgroundColor: CommonColors.whiteColor }}>

                        <View style={styles.headerView}>

                            <TouchableOpacity style={styles.btnBack}
                                onPress={() => this.btnBackTap()}>
                                <Image style={{ width: 25, height: 25, resizeMode: 'center', tintColor: CommonColors.whiteColor }}
                                    source={BackIcon}
                                />
                            </TouchableOpacity>

                            <Text style={styles.headerText}>My Notifications</Text>

                            <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                                {/* <Image style={{ width: 30, height: 30, resizeMode: 'center' }}
                                    source={SearchIcon}
                                /> */}
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1 }}>
                        {this.state.isLoading == false ?
                            (this.state.ArrMessages.length != 0 ?
                                <View style={{ flex: 1 }}>

                                    <FlatList style={{ marginTop: 5, }}
                                        data={this.state.ArrMessages}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (

                                            
                                                <View style={styles.ListView}>
                                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                                        <Text style={styles.txtMessage}>
                                                            {item.message_data}
                                                        </Text>

                                                        <View style={styles.viewDate}>
                                                            <Text style={styles.txtDate}>
                                                                {Moment(item.created_date).format('DD MMM. YYYY [at] hh:mm a') }
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                        )}
                                    />
                                </View>
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.txtNoDataFound}>No data found</Text>
                                </View>
                            )
                            :
                            <View style={{ flex: 1, backgroundColor: 'transperent', justifyContent: 'center' }}>
                                <ActivityIndicator size="large" color={CommonColors.midnightBlueColor}>

                                </ActivityIndicator>
                            </View>
                        }
                    </View>

                    </View>
                </SafeAreaView>
            </>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: CommonColors.whiteColor
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
    btnBack: {
        width: 30, height: 30, justifyContent: 'center',
        alignItems: 'center', marginLeft: 20
    },
    headerText: {
        fontFamily: ConstantKeys.INTER_EXTRA_BOLD, fontSize: SetFontSize.setDimension.ts20,
        color: CommonColors.whiteColor, flex: 1, textAlign: 'center'
    },
    txtNoDataFound: {
        fontFamily: ConstantKeys.INTER_BOLD, fontSize: SetFontSize.setDimension.ts18,
        color: CommonColors.blackColor
    },
    ListView: {
        marginTop: 5, marginBottom: 10, marginLeft: 20, marginRight: 20,
        flexDirection: 'row', alignItems: 'center', backgroundColor: CommonColors.whiteColor,
        shadowColor: CommonColors.shadowColor, borderRadius: 10,
        shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4,
        shadowRadius: 5, elevation: 5,
    },
    txtMessage: {
        fontFamily: ConstantKeys.INTER_REGULAR, marginLeft: 10, marginRight: 10,
        fontSize: SetFontSize.setDimension.ts16, marginTop: 10,
        color: CommonColors.blackColor
    },
    viewDate:{
        marginTop:10,backgroundColor : CommonColors.denim,minHeight:30,justifyContent:'center',
        borderBottomRightRadius:10, borderBottomLeftRadius:10
    },
    txtDate: {
        fontFamily: ConstantKeys.INTER_MEDIUM, marginLeft:10,marginRight:10,
        fontSize: SetFontSize.setDimension.ts16,
        color: CommonColors.whiteColor
    },
    txtNoDataFound: {
        fontFamily: ConstantKeys.INTER_BOLD, fontSize: SetFontSize.setDimension.ts18,
        color: CommonColors.blackColor
    }
})