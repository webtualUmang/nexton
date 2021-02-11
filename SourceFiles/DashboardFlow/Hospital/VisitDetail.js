import React, { Component } from 'react';
import {
    View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, Linking,LogBox,
    StyleSheet, ActivityIndicator, SectionList, ScrollView
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
import DialogInput from 'react-native-dialog-input';


export default class VisitDetail extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            doctorData: JSON.parse(props.route.params.doctor_data),
            UserData : {},
            HospitalInfo: {},
            DoctorDetail : {},
            OpenMessageDialog : false
        };
    }

    componentDidMount() {
        LogBox.ignoreAllLogs = true
        console.log("Doctor Data : " + JSON.stringify(this.state.doctorData))
        
        this.API_Doctor_INFO_BYID()
        this.getData()
    }

    getData = async () => {
       
        try {
            const value1 = await AsyncStorage.getItem(ConstantKeys.HOSPITAL_INFO)
            if (value1 !== null) {
              // value previously stored
              console.log("Hospital Data: " + value1)
              var HospitalInfo = JSON.parse(value1)
      
              this.setState({ HospitalInfo: HospitalInfo })
  
            }
            else {
              console.log("Hospital Data: null " + value1)
            }
          } catch (e) {
            console.log("Error : " + e)
          }
      }



    API_Doctor_INFO_BYID = () => {
        this.setState({isLoading : true})
        Webservice.post(ApiURL.GetDoctorInfobyID, {
            doctor_id: this.state.doctorData.doctor_id,
        })
            .then(response => {
                //   this.setState({spinner: false});
                if (response == null) {
                    this.setState({ loading: false });
                    alert('error');
                }
                console.log(response);

                console.log('Doctor Info By ID Response : ' + JSON.stringify(response.data.Data))

                if (response.data.Status == 1) {
                    console.log("Doctor Info By ID Data: " + JSON.stringify(response.data.Data[0]))

                    this.setState({ DoctorDetail: response.data.Data[0] , isLoading : false})
                } else {
                    Toast.showWithGravity(response.data.Msg, Toast.SHORT, Toast.BOTTOM);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //API for Send message to Doctor
    API_SEND_MESSAGE_TO_DR = (message) => {
        this.setState({isLoading : true})
        Webservice.post(ApiURL.SendMessage, {
            doctor_id: this.state.DoctorDetail.doctor_id,
            msg : message,
            sender_user_id : this.state.HospitalInfo.fk_users_id,
            hospital_id : this.state.HospitalInfo.hospital_id
        })
            .then(response => {
                //   this.setState({spinner: false});
                if (response == null) {
                    this.setState({ loading: false });
                    alert('error');
                }
                console.log(response);

                console.log('Send Message Response : ' + JSON.stringify(response.data.Data))

                if (response.data.Status == 1) {
                    console.log("Send Message Data: " + JSON.stringify(response.data.Data))

                    this.setState({isLoading : false})
                    Toast.showWithGravity("Message Send Successfully...", Toast.SHORT, Toast.BOTTOM);
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

    sendMessageTap = (message) => {
        
        console.log(message)

        if(message == undefined || message == "" || message == null){
            // alert("fail")
        }else{
            this.setState({OpenMessageDialog : false})
            this.API_SEND_MESSAGE_TO_DR(message)
        }
    }

    render() {
        let BackIcon = IMG.OtherFlow.BackIcon
        let CallIcon = IMG.OtherFlow.CallIcon
        let MessageIcon = IMG.OtherFlow.MessageIcon

        return (
            <>
            <SafeAreaView style={{flex:0,backgroundColor:CommonColors.denim}} />

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

                        <Text style={styles.headerText}>Visit Detail</Text>

                        <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                            {/* <Image style={{ width: 30, height: 30, resizeMode: 'center' }}
                                source={SearchIcon}
                            /> */}
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}>
                        {this.state.isLoading == false ?
                            <ScrollView style={{ flex: 1 }}>
                                <View style={styles.MainCardView}>

                                    <Text style={styles.txtDoctorName}>
                                        Doctor : {this.state.DoctorDetail.name}
                                    </Text>

                                    <View style={{ height: 1, backgroundColor: CommonColors.darkGray, marginTop: 10 }}></View>

                                    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.txtMobileNo}>
                                            Mobile No : {this.state.DoctorDetail.mobile}
                                        </Text>
                                        {/* <TouchableOpacity style={{ marginRight: 15, height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}
                                            onPress={() => Linking.openURL(`tel:${this.state.DoctorDetail.mobile}`)}>
                                            <Image style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: CommonColors.denim }}
                                                source={CallIcon} />
                                        </TouchableOpacity> */}
                                    </View>

                                    <Text style={styles.txtEmailID}>
                                        Email : {this.state.DoctorDetail.email}
                                    </Text>

                                    <Text style={styles.txtDegree}>
                                        Degree : {this.state.DoctorDetail.degree}
                                    </Text>

                                    <Text style={styles.txtExperianse}>
                                        Experience : {this.state.DoctorDetail.experience} Years
                                    </Text>

                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <TouchableOpacity style={{flex:0.5}}
                                            onPress={() => Linking.openURL(`tel:${this.state.DoctorDetail.mobile}`)}>

                                            <View style={styles.ViewCall}>

                                                <Image style={{ height: 25, width: 25, resizeMode: 'contain', tintColor: CommonColors.whiteColor }}
                                                    source={CallIcon} />
                                            </View>
                                        </TouchableOpacity>

                                        <View style={{width:1,backgroundColor:CommonColors.whiteColor,height:30}}></View>

                                        <TouchableOpacity style={{flex:0.5}}
                                            onPress={() => this.setState({OpenMessageDialog : true})}>
                                            <View style={styles.MessageView}>
                                                <Image style={{ height: 25, width: 25, resizeMode: 'contain', tintColor: CommonColors.whiteColor  }}
                                                    source={MessageIcon} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <DialogInput isDialogVisible={this.state.OpenMessageDialog}
                                            title={"Message"}
                                            message={"Message for "+this.state.DoctorDetail.name}
                                            hintInput ={"enter your message"}
                                            submitText = {'Send'}
                                            submitInput={ (inputText) => {this.sendMessageTap(inputText)} }
                                            closeDialog={ () => this.setState({OpenMessageDialog : false})}>
                                </DialogInput>
                            </ScrollView>
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
        fontFamily: ConstantKeys.INTER_EXTRA_BOLD, fontSize: 20,
        color: CommonColors.whiteColor, flex: 1, textAlign: 'center'
    },
    MainCardView: {
        marginTop: 30, marginLeft: 20, marginRight: 20, backgroundColor: CommonColors.whiteColor,
        shadowColor: CommonColors.shadowColor, borderRadius: 10,
        shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4,
        shadowRadius: 5, elevation: 5, marginBottom: 10
    },
    txtDoctorName: {
        marginTop: 10, marginLeft: 20, marginRight: 20,
        fontSize: SetFontSize.setDimension.ts22,
        fontFamily: ConstantKeys.INTER_EXTRA_BOLD, color: CommonColors.denim
    },
    txtMobileNo: {
        marginLeft: 20, marginRight: 20, flex: 1,
        fontSize: SetFontSize.setDimension.ts18,
        fontFamily: ConstantKeys.INTER_REGULAR, color: CommonColors.darkGray
    },
    txtEmailID: {
        marginTop: 5, marginLeft: 20, marginRight: 20,
        fontSize: SetFontSize.setDimension.ts18,
        fontFamily: ConstantKeys.INTER_REGULAR, color: CommonColors.darkGray
    },
    txtDegree: {
        marginTop: 10, marginLeft: 20, marginRight: 20,
        fontSize: SetFontSize.setDimension.ts18,
        fontFamily: ConstantKeys.INTER_REGULAR, color: CommonColors.darkGray
    },
    txtExperianse: {
        marginTop: 10, marginLeft: 20, marginRight: 20, marginBottom: 10,
        fontSize: SetFontSize.setDimension.ts18,
        fontFamily: ConstantKeys.INTER_REGULAR, color: CommonColors.darkGray
    },
    ViewCall: {
        flex: 1, height: 50, backgroundColor: CommonColors.denim,
        borderBottomLeftRadius: 10, justifyContent: 'center', 
        alignItems: 'center'
    },
    MessageView:{
        flex:1, height: 50, backgroundColor:CommonColors.denim, 
        borderBottomRightRadius:10, justifyContent:'center',alignItems:'center'
    }
})