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


export default class TodayVisit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            ArrVisit: [],
            DoctorInfo: {}
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
                this.API_DOCTOR_SCHEDULE(userData.doctor_id)
            }
            else {
                console.log("Doctor Data: null " + value)
            }
        } catch (e) {

            console.log("Error : " + e)
        }
    }


    API_DOCTOR_SCHEDULE = (doctor_id) => {
        this.setState({ isLoading: true })
        Webservice.post(ApiURL.DoctorSchedule, {
            doctor_id: doctor_id,
        })
            .then(response => {
                //   this.setState({spinner: false});
                if (response == null) {
                    this.setState({ isLoading: false });
                    alert('error');
                }
                console.log(response);

                console.log('Doctor Response : ' + JSON.stringify(response.data.Data))
                this.setState({ isLoading: false })
                if (response.data.Status == 1) {


                    this.setState({ ArrVisit: response.data.Data })

                    console.log("Final Doctor Schedule : " + JSON.stringify(response.data.Data))
                } else {
                    Toast.showWithGravity(response.data.Msg, Toast.SHORT, Toast.BOTTOM);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    refresh() {
        this.API_DOCTOR_SCHEDULE(this.state.DoctorInfo.doctor_id)
    }

    //Action Methods
    btnBackTap = () => {
        requestAnimationFrame(() => {
            this.props.navigation.goBack()
        })
    }

    btnSelectHospitalTap = (data) => {
        requestAnimationFrame(() => {
            this.props.navigation.navigate('DrVisitDetail', { hospital_data: JSON.stringify(data), onGoBack: () => this.refresh(), })
        })
    }


    render() {
        let BackIcon = IMG.OtherFlow.BackIcon
        let RightArrowIcon = IMG.OtherFlow.RightArrowIcon
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
                            <Image style={{ width: 25, height: 25, resizeMode: 'center', tintColor:CommonColors.whiteColor }}
                                source={BackIcon}
                            />
                        </TouchableOpacity>

                        <Text style={styles.headerText}>Today's Time Table</Text>

                        <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                            {/* <Image style={{ width: 30, height: 30, resizeMode: 'center' }}
        source={SearchIcon}
      /> */}
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}>
                        {this.state.isLoading == false ?
                            (this.state.ArrVisit.length != 0 ?
                                <View style={{ flex: 1 }}>

                                    <FlatList style={{ marginTop: 5, }}
                                        data={this.state.ArrVisit}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (

                                            <TouchableOpacity onPress={() => this.btnSelectHospitalTap(item)}>
                                                <View style={styles.ListView}>
                                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                                        <Text style={styles.txtHospitalName}>
                                                            {item.name}
                                                        </Text>

                                                        <Text style={styles.txtVisitTile}>
                                                            Visit Time : {item.shift}
                                                        </Text>
                                                    </View>
                                                    <View style={{ paddingRight: 10 }}>
                                                        {item.inout == 2 ?
                                                            <Text style={{
                                                                fontFamily: ConstantKeys.INTER_MEDIUM, fontSize: SetFontSize.setDimension.ts16,
                                                                color: 'green'
                                                            }}>
                                                                Visit Completed
                                                        </Text> :
                                                            <Image style={{ height: 20, width: 20, resizeMode: 'contain', tintColor:CommonColors.denim }}
                                                                source={RightArrowIcon}
                                                            />
                                                        }

                                                    </View>
                                                </View>
                                            </TouchableOpacity>
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
        color: CommonColors.blackColor
    },
    txtVisitTile: {
        fontFamily: ConstantKeys.INTER_MEDIUM, marginLeft: 10, marginRight: 10,
        fontSize: SetFontSize.setDimension.ts16, marginTop: 5, marginBottom: 10,
        color: CommonColors.darkGray
    },
    txtNoDataFound: {
        fontFamily: ConstantKeys.INTER_BOLD, fontSize: SetFontSize.setDimension.ts18,
        color: CommonColors.blackColor
    }
})