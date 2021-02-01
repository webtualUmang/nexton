import React, { Component } from 'react';
import {
    View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, Linking,
    StyleSheet, ActivityIndicator, SectionList, ScrollView, LogBox
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

export default class DrVisitDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            DoctorInfo : {},
            Arr_Dr_TimeTable : [],
            HospitalData: JSON.parse(props.route.params.hospital_data),
        };
    }


    componentDidMount() {
        LogBox.ignoreAllLogs = true;
        console.log("Hospital Data : " + JSON.stringify(this.state.HospitalData))
        this.getData()
    }


    getData = async () => {
        try {
            const value = await AsyncStorage.getItem(ConstantKeys.DOCTOR_INFO)
            if (value !== null) {
                // value previously stored
                console.log("Doctor Data: " + value)
                var userData = JSON.parse(value)

                this.setState({ DoctorInfo: userData })
                this.API_HOSPITAL_TIMETABLE(this.state.HospitalData.hospital_id)
            }
            else {
                console.log("Doctor Data: null " + value)
            }
        } catch (e) {

            console.log("Error : " + e)
        }
    }


    // API All Dr Schedule List
    API_HOSPITAL_TIMETABLE = (hospital_id) => {
        this.setState({isLoading : true})
        Webservice.post(ApiURL.HospitalTimetable, {
            hospital_id: hospital_id,
        })
            .then(response => {
                //   this.setState({spinner: false});
                if (response == null) {
                    this.setState({ isLoading: false });
                    alert('error');
                }
                console.log(response);

                console.log('Hospital TimeTable Response : '+JSON.stringify(response.data.Data))
                this.setState({isLoading : false})
                if(response.data.Status == 1){

                        var TimeTable = []
                        
                    for(i = 0; i< response.data.Data.length; i++){
                        var tempdata = response.data.Data[i]
                        var dict = {}
                        dict['title'] = tempdata.floor
                        dict['data'] = tempdata.timetable

                        TimeTable.push(dict)
                    }

                    this.setState({Arr_Dr_TimeTable : TimeTable})
                    
                    console.log("Final Hospital Time Table : "+JSON.stringify(TimeTable))
                }else{
                    Toast.showWithGravity(response.data.Msg, Toast.SHORT, Toast.BOTTOM); 
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //API Doctor IN
    API_DOCTOR_IN = () => {
        this.setState({ isLoading: true })
        Webservice.post(ApiURL.DoctorIn, {
            users_id: this.state.DoctorInfo.doctor_id,
            hospital_doctor_schedule_id: this.state.HospitalData.hospital_doctor_schedule_id,
            authcode : '0'
        })
            .then(response => {
                //   this.setState({spinner: false});
                if (response == null) {
                    this.setState({ isLoading: false });
                    alert('error');
                }
                console.log(response);

                console.log('Doctor In Response : ' + JSON.stringify(response.data.Data))
                this.setState({ isLoading: false })
                if (response.data.Status == 1) {

                    console.log("Final Doctor In : " + JSON.stringify(response.data.Data))

                    // this.props.navigation.state.params.onGoBack();
                    this.props.route.params.onGoBack();
                    this.props.navigation.goBack()
                } else {
                    Toast.showWithGravity(response.data.Msg, Toast.SHORT, Toast.BOTTOM);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //API Doctor OUT
    API_DOCTOR_OUT = () => {
        this.setState({ isLoading: true })
        Webservice.post(ApiURL.DoctorOUT, {
            users_id: this.state.DoctorInfo.doctor_id,
            hospital_doctor_schedule_id: this.state.HospitalData.hospital_doctor_schedule_id,
            authcode : '0'
        })
            .then(response => {
                //   this.setState({spinner: false});
                if (response == null) {
                    this.setState({ isLoading: false });
                    alert('error');
                }
                console.log(response);

                console.log('Doctor OUT Response : ' + JSON.stringify(response.data.Data))
                this.setState({ isLoading: false })
                if (response.data.Status == 1) {

                    console.log("Final Doctor OUT : " + JSON.stringify(response.data.Data))

                    this.props.route.params.onGoBack();
                    this.props.navigation.goBack()
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

    btnInTap = () =>{
        requestAnimationFrame(()=>{
            this.API_DOCTOR_IN()
        })
    }

    btnOutTap = () =>{
        requestAnimationFrame(()=>{
            this.API_DOCTOR_OUT()
        })
    }

    FlatListItemSeparator = () => {
        return (
          //Item Separator
          <View style={styles.listItemSeparatorStyle} />
        );
      };

    render() {
        let BackIcon = IMG.OtherFlow.BackIcon
        let CallIcon = IMG.OtherFlow.CallIcon

        return (
            <>
                <SafeAreaView style={{flex:0, backgroundColor:CommonColors.denim}}/>
                <StatusBar barStyle={'dark-content'}
                    backgroundColor={CommonColors.denim}
                />
                

                <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, backgroundColor: CommonColors.whiteColor }}>

                    <View style={styles.headerView}>

                        <TouchableOpacity style={styles.btnBack}
                            onPress={() => this.btnBackTap()}>
                            <Image style={{ width: 25, height: 25, resizeMode: 'center', tintColor:CommonColors.whiteColor }}
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
                            <View style={{ flex:1 }}>

                                <View style={{
                                        marginTop: 30, marginLeft: 20, marginRight: 20, backgroundColor: CommonColors.whiteColor,
                                        shadowColor: CommonColors.shadowColor, borderRadius: 10,justifyContent:'center',alignItems:'center',
                                        shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4,
                                        shadowRadius: 5, elevation: 5,
                                    }}>

                                    {this.state.HospitalData.inout == 0 ? 
                                        <TouchableOpacity style={{width:'50%',height:50,marginTop:10,marginBottom:10,}}
                                                onPress={() => this.btnInTap()}>
                                            <View style={{alignItems:'center',justifyContent:'center',flex:1,
                                                backgroundColor:'green',borderRadius:10}}>
                                                <Text style={{fontFamily:ConstantKeys.INTER_SEMIBOLD,
                                                fontSize:SetFontSize.setDimension.ts18, color:CommonColors.whiteColor}}>
                                                IN
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    : (this.state.HospitalData.inout == 1 ?
                                        <TouchableOpacity style={{width:'50%',height:50,marginTop:10,marginBottom:10,}}
                                            onPress={() => this.btnOutTap()}>
                                            <View style={{alignItems:'center',justifyContent:'center',flex:1,
                                                backgroundColor:'red',borderRadius:10}}>
                                                <Text style={{fontFamily:ConstantKeys.INTER_SEMIBOLD,
                                                fontSize:SetFontSize.setDimension.ts18, color:CommonColors.whiteColor}}>
                                                    Out
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    :
                                    <View style={{marginTop:10,marginBottom:10}}>
                                        <Text style={{fontFamily:ConstantKeys.INTER_SEMIBOLD, color:CommonColors.blackColor, 
                                            fontSize:SetFontSize.setDimension.ts18, textAlign:'center'}}>
                                            You are completed your today's visit
                                        </Text>
                                    </View>)
                                    }
                                </View>

                                {this.state.Arr_Dr_TimeTable.length != 0 ?
                                <View style={{ flex: 1 }}>

                                    <Text style={{marginLeft:20,marginRight:20,marginTop:30, fontSize:SetFontSize.setDimension.ts22,
                                            fontFamily : ConstantKeys.INTER_SEMIBOLD, color:CommonColors.denim}}>
                                        Today's Schedules
                                    </Text>
                                    <SectionList style={{marginTop:10,}}
                                        ItemSeparatorComponent={() => this.FlatListItemSeparator()}
                                        sections={this.state.Arr_Dr_TimeTable}
                                        renderSectionHeader={({section}) => (
                                            <View style={{height:35,justifyContent:'center'}}>
                                                <Text style={styles.sectionHeaderStyle}>
                                                    {section.title}
                                                </Text>
                                            </View>
                                        )}
                                        renderItem={({item}) => (
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <View style={{paddingLeft:20,paddingRight:20,backgroundColor:CommonColors.whiteColor,flex:1}}>
                                                    <Text style={styles.txtDoctorName}>
                                                        {item.name}
                                                    </Text>
                                                    <Text style={styles.txtVisitTime}>
                                                        Visit Time : {item.shift}
                                                    </Text>
                                                    <View style={{flexDirection:'row', marginTop:5,alignItems:'center',marginBottom:10}}>
                                                        <Text style={styles.txtMobileNo}>
                                                            Mobile No : {item.mobile}
                                                        </Text>

                                                        <TouchableOpacity style={{ marginLet: 20, height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}
                                                            onPress={() => Linking.openURL(`tel:${item.mobile}`)}>
                                                            <Image style={{ height: 20, width: 20, resizeMode: 'contain', tintColor:CommonColors.denim }}
                                                                source={CallIcon} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                                {/* <View style={{paddingRight:20}}>
                                                        <Image style={{height:20,width:20,resizeMode:'contain'}} 
                                                            source={RightArrowIcon}
                                                        />
                                                </View> */}
                                            </View>
                                        )}
                                        keyExtractor={(item, index) => item.key}
                                        />
                                </View>
                                :
                                null
                                }
                            </View>
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
    sectionHeaderStyle: {
        backgroundColor: CommonColors.denim,
        fontSize: SetFontSize.setDimension.ts20,
        paddingLeft:20,paddingTop:5,paddingBottom:5,paddingRight:20,
        fontFamily:ConstantKeys.INTER_BOLD,
        color: CommonColors.whiteColor,
        
      },
      sectionListItemStyle: {
        fontSize: 15,
        padding: 15,
        color: CommonColors.blackColor,
        backgroundColor: '#F5F5F5',
      },
      listItemSeparatorStyle: {
        height: 0.5,
        width: '100%',
        backgroundColor: '#C8C8C8',
      },
      txtDoctorName : {
        fontFamily:ConstantKeys.INTER_MEDIUM,
        fontSize:SetFontSize.setDimension.ts18,marginTop:10,
        color:CommonColors.blackColor
      },
      txtVisitTime:{
        fontFamily:ConstantKeys.INTER_MEDIUM,
        fontSize:SetFontSize.setDimension.ts16,marginTop:10,
        color:CommonColors.darkGray
      },
      txtMobileNo:{
        fontFamily:ConstantKeys.INTER_MEDIUM,
        fontSize:SetFontSize.setDimension.ts16,
        color:CommonColors.darkGray 
      },
})