import React, { Component } from 'react';
import {
    View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, LogBox, SectionList,
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


export default class FutureVisits extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            DoctorInfo: {},
            ArrFutureVisit: []
        };
    }


    async componentDidMount() {
        LogBox.ignoreAllLogs = true
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
                this.API_DOCTOR_FUTURE_SCHEDULE(userData.doctor_id)
            }
            else {
                console.log("Doctor Data: null " + value)
            }
        } catch (e) {

            console.log("Error : " + e)
        }
    }

    API_DOCTOR_FUTURE_SCHEDULE = (doctor_id) => {
        this.setState({ isLoading: true })
        Webservice.post(ApiURL.Doctor_Schedule_Next7Days, {
            doctor_id: doctor_id,
        })
            .then(response => {
                //   this.setState({spinner: false});
                if (response == null) {
                    this.setState({ isLoading: false });
                    alert('error');
                }
                console.log(response);

                console.log('Doctor Future Schedule Response : ' + JSON.stringify(response.data.Data))
                this.setState({ isLoading: false })
                if (response.data.Status == 1) {

                    var FutureTimeTable = []

                    for (i = 0; i < response.data.Data.length; i++) {
                        var tempdata = response.data.Data[i]
                        var dict = {}
                        dict['title'] = tempdata.tdate
                        dict['data'] = tempdata.timetable

                        FutureTimeTable.push(dict)
                    }

                    this.setState({ ArrFutureVisit: FutureTimeTable })

                    console.log("Final Future Schedule : " + JSON.stringify(FutureTimeTable))
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

    FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View style={styles.listItemSeparatorStyle} />
        );
    };

    render() {
        let BackIcon = IMG.OtherFlow.BackIcon

        return (
            <>
                <SafeAreaView style={styles.container} />

                    <StatusBar barStyle={'dark-content'}
                        backgroundColor={CommonColors.denim}
                    />
                    <SafeAreaView style={{ flex: 1, backgroundColor: CommonColors.whiteColor }}>
                        <View style={{ flex: 1, backgroundColor: CommonColors.whiteColor }}>

                            <View style={styles.headerView}>

                                <TouchableOpacity style={styles.btnBack}
                                    onPress={() => this.btnBackTap()}>
                                    <Image style={{ width: 25, height: 25, resizeMode: 'center', tintColor: CommonColors.whiteColor }}
                                        source={BackIcon}
                                    />
                                </TouchableOpacity>

                                <Text style={styles.headerText}>Future Visit's</Text>

                                <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                                    {/* <Image style={{ width: 30, height: 30, resizeMode: 'center' }}
                                        source={SearchIcon}
                                    /> */}
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 1, }}>
                            {this.state.isLoading == false ?
                                    (this.state.ArrFutureVisit.length != 0 ?
                                        <View style={{ flex: 1 }}>

                                            <SectionList
                                                ItemSeparatorComponent={() => this.FlatListItemSeparator()}
                                                sections={this.state.ArrFutureVisit}
                                                renderSectionHeader={({ section }) => (
                                                    <View style={{ height: 35, justifyContent: 'center' }}>
                                                        <Text style={styles.sectionHeaderStyle}>
                                                            {Moment(section.title).format('DD MMM. YYYY')}
                                                        </Text>
                                                    </View>
                                                )}
                                                renderItem={({ item }) => (
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <View style={{ paddingLeft: 20, paddingRight: 20, backgroundColor: CommonColors.whiteColor, flex: 1 }}>
                                                            <Text style={styles.txtHospitalName}>
                                                                {item.name}
                                                            </Text>
                                                            <Text style={styles.txtVisitTime}>
                                                                Visit Time : {item.shift}
                                                            </Text>
                                                            <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', marginBottom: 10 }}>
                                                                <Text style={styles.txtFloor}>
                                                                    Floor : {item.floor}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )}
                                                keyExtractor={(item, index) => item.key}
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
        flex: 0, backgroundColor: CommonColors.denim
    },
    headerView: {
        height: 74, width: '100%', backgroundColor: CommonColors.denim,
        alignItems: 'center', flexDirection: 'row',
        // elevation: 5, shadowColor: CommonColors.shadowColor,
        // shadowOpacity: 0.2, shadowRadius: 2,
        // shadowOffset: {
        //     height: 4,
        //     width: 0
        // },
    },
    btnBack: {
        width: 30, height: 30, justifyContent: 'center',
        alignItems: 'center', marginLeft: 20
    },
    headerText: {
        fontFamily: ConstantKeys.INTER_EXTRA_BOLD, fontSize: 20,
        color: CommonColors.whiteColor, flex: 1, textAlign: 'center'
    },
    ListView: {
        marginTop: 5, marginBottom: 10, marginLeft: 20, marginRight: 20,
        flexDirection: 'row', alignItems: 'center', backgroundColor: CommonColors.whiteColor,
        shadowColor: CommonColors.shadowColor, borderRadius: 10,
        shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4,
        shadowRadius: 5, elevation: 5,
    },
    txtHospitalName: {
        fontFamily: ConstantKeys.INTER_MEDIUM, marginLeft: 10, marginRight: 10,
        fontSize: SetFontSize.setDimension.ts18, marginTop: 10,
        color: CommonColors.midnightBlueColor
    },
    txtVisitTile: {
        fontFamily: ConstantKeys.INTER_MEDIUM, marginLeft: 10, marginRight: 10,
        fontSize: SetFontSize.setDimension.ts16, marginTop: 5, marginBottom: 10,
        color: CommonColors.darkGray
    },
    txtNoDataFound: {
        fontFamily: ConstantKeys.INTER_BOLD, fontSize: SetFontSize.setDimension.ts18,
        color: CommonColors.blackColor
    },
    listItemSeparatorStyle: {
        height: 0.5,
        width: '100%',
        backgroundColor: '#C8C8C8',
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
      txtHospitalName : {
        fontFamily:ConstantKeys.INTER_MEDIUM,
        fontSize:SetFontSize.setDimension.ts18,marginTop:10,
        color:CommonColors.blackColor
      },
      txtVisitTime:{
        fontFamily:ConstantKeys.INTER_MEDIUM,
        fontSize:SetFontSize.setDimension.ts16,marginTop:10,
        color:CommonColors.darkGray
      },
      txtFloor:{
        fontFamily:ConstantKeys.INTER_MEDIUM,
        fontSize:SetFontSize.setDimension.ts16,
        color:CommonColors.darkGray 
      },
})
