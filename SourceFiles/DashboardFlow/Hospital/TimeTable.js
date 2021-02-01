import React, { Component } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, Linking,LogBox,
    StyleSheet, ActivityIndicator, SectionList } from 'react-native';

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
import {ApiURL} from '../../Constants/ApiURL'
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'moment';
import DialogInput from 'react-native-dialog-input';


export default class TimeTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading : false,
            ArrTimeTable : [],
            HospitalInfo : {},
            OpenMessageDialog : false,
            selected_Doctor : {}
        };
    }


    async componentDidMount(){
        LogBox.ignoreAllLogs = true
        this.getData()
    }


    getData = async () => {
        try {
          const value = await AsyncStorage.getItem(ConstantKeys.HOSPITAL_INFO)
          if (value !== null) {
            // value previously stored
            console.log("Hospital Data: " + value)
            var userData = JSON.parse(value)
    
            this.setState({ HospitalInfo: userData })
            this.API_HOSPITAL_TIMETABLE(userData.hospital_id)
          }
          else {
            console.log("Hospital Data: null " + value)
            this.props.navigation.navigate('Login')
          }
        } catch (e) {
          
          console.log("Error : " + e)
        }
      }

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

                    this.setState({ArrTimeTable : TimeTable})
                    
                    console.log("Final Hospital Time Table : "+JSON.stringify(TimeTable))
                }else{
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
            doctor_id: this.state.selected_Doctor.doctor_id,
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

                    this.setState({isLoading : false, selected_Doctor : {}})
                    Toast.showWithGravity("Message Send Successfully...", Toast.SHORT, Toast.BOTTOM);
                } else {
                    Toast.showWithGravity(response.data.Msg, Toast.SHORT, Toast.BOTTOM);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }


    FlatListItemSeparator = () => {
        return (
          //Item Separator
          <View style={styles.listItemSeparatorStyle} />
        );
      };

    //Action Methods
    btnBackTap = () =>{
        requestAnimationFrame(()=>{
            this.props.navigation.goBack()
        })
    }

    btnSelectDoctorTap = (data) => {
        requestAnimationFrame(()=>{
            this.props.navigation.navigate('VisitDetail',{ doctor_data : JSON.stringify(data)})
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
        let RightArrowIcon = IMG.OtherFlow.RightArrowIcon
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

                        <Text style={styles.headerText}>Time Table</Text>

                        <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                            {/* <Image style={{ width: 30, height: 30, resizeMode: 'center' }}
                source={SearchIcon}
              /> */}
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}>
                        {this.state.isLoading == false ?
                            (this.state.ArrTimeTable.length != 0 ?
                            <View style={{ flex: 1 }}>
                                <SectionList
                                    ItemSeparatorComponent={() => this.FlatListItemSeparator()}
                                    sections={this.state.ArrTimeTable}
                                    renderSectionHeader={({section}) => (
                                        <View style={{height:35,justifyContent:'center'}}>
                                            <Text style={styles.sectionHeaderStyle}>
                                                {section.title}
                                            </Text>
                                        </View>
                                    )}
                                    renderItem={({item}) => (
                                        <TouchableOpacity onPress={()=> this.btnSelectDoctorTap(item)}>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <View style={{paddingLeft:20,paddingRight:20,backgroundColor:CommonColors.whiteColor,flex:1}}>
                                                <Text style={styles.txtDoctorName}>
                                                    {item.name}
                                                </Text>
                                                <Text style={styles.txtVisitTime}>
                                                    Visit Time : {item.shift}
                                                </Text>
                                                <View style={{flexDirection:'row', marginTop:5,alignItems:'center'}}>
                                                    <Text style={styles.txtMobileNo}>
                                                        Mobile No : {item.mobile}
                                                    </Text>

                                                    <TouchableOpacity style={{ marginLeft: 20, height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}
                                                        onPress={() => Linking.openURL(`tel:${item.mobile}`)}>
                                                        <Image style={{ height: 20, width: 20, resizeMode: 'contain' , tintColor: CommonColors.denim}}
                                                            source={CallIcon} />
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={{ marginLeft: 5, height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}
                                                        onPress={() => this.setState({OpenMessageDialog : true, selected_Doctor : item})}>
                                                        <Image style={{ height: 20, width: 20, resizeMode: 'contain' , tintColor: CommonColors.denim}}
                                                            source={MessageIcon} />
                                                    </TouchableOpacity>
                                                </View>

                                                <View style={{marginBottom:10,marginTop:5}}>
                                                {item.intime != null ? 
                                                    <Text style={styles.txtInTime}>
                                                        In Time : {Moment(item.intime).format('DD MMM. YYYY [at] hh:mm a') }
                                                    </Text>
                                                :null}

                                                {item.outtime != null ? 
                                                    <Text style={styles.txtOutTime}>
                                                        Out Time : {Moment(item.outtime).format('DD MMM. YYYY [at] hh:mm a') }
                                                    </Text>
                                                :null}
                                               
                                                </View>
                                            </View>

                                            <View style={{paddingRight:20}}>
                                                    <Image style={{height:20,width:20,resizeMode:'contain', tintColor: CommonColors.denim}} 
                                                        source={RightArrowIcon}
                                                    />
                                            </View>
                                        </View>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => item.key}
                                    />

                                <DialogInput isDialogVisible={this.state.OpenMessageDialog}
                                            title={"Message"}
                                            message={"Message for "+this.state.selected_Doctor.name}
                                            hintInput ={"enter your message"}
                                            submitText = {'Send'}
                                            submitInput={ (inputText) => {this.sendMessageTap(inputText)} }
                                            closeDialog={ () => this.setState({OpenMessageDialog : false, selected_Doctor : {}})}>
                                </DialogInput>
                            </View>
                            :
                            <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontFamily:ConstantKeys.INTER_BOLD, fontSize:SetFontSize.setDimension.ts18,
                                    color:CommonColors.blackColor}}>No data found</Text>
                            </View>
                            )
                        :
                        <View style={{flex:1,backgroundColor:'transperent',justifyContent: 'center'}}>
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
    //   elevation: 5, shadowColor: CommonColors.shadowColor,
    //   shadowOpacity: 0.2, shadowRadius: 2,
    //   shadowOffset: {
    //     height: 4,
    //     width: 0
    //   },
    },
    btnBack: {
      width: 30, height: 30, justifyContent: 'center',
      alignItems: 'center', marginLeft: 20
    },
    headerText: {
      fontFamily: ConstantKeys.INTER_EXTRA_BOLD, fontSize: 20,
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
      txtInTime:{
        fontFamily:ConstantKeys.INTER_MEDIUM,
        fontSize:SetFontSize.setDimension.ts16,
        color:'green'
      },
      txtOutTime:{
        fontFamily:ConstantKeys.INTER_MEDIUM,marginTop:10,
        fontSize:SetFontSize.setDimension.ts16,
        color:'red'
      }
})