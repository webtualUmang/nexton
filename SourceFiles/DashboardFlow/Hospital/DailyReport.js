import React, { Component } from 'react';
import {
    View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, Linking, LogBox, FlatList,
    StyleSheet, ActivityIndicator, SectionList
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

export default class DailyReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            HospitalInfo: {},
            ArrDailyReports: []
        };
    }

    componentDidMount() {
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
                this.API_HOSPITAL_DAILYREPORT(userData.hospital_id)
            }
            else {
                console.log("Hospital Data: null " + value)
                this.props.navigation.navigate('Login')
            }
        } catch (e) {

            console.log("Error : " + e)
        }
    }


    API_HOSPITAL_DAILYREPORT = (hospital_id) => {
        this.setState({ isLoading: true })
        Webservice.post(ApiURL.DailyReport, {
            hospital_id: hospital_id,
        })
            .then(response => {
                //   this.setState({spinner: false});
                if (response == null) {
                    this.setState({ isLoading: false });
                    alert('error');
                }
                console.log(response);

                console.log('Hospital Daily Report Response : ' + JSON.stringify(response.data.Data))
                this.setState({ isLoading: false, })
                if (response.data.Status == 1) {

                    this.setState({ ArrDailyReports: response.data.Data })

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

    btnSelectReportTap = (data) => {
        requestAnimationFrame(() => {
            this.props.navigation.navigate('DailyReportDetail', { 'selectedReport': JSON.stringify(data) })
        })
    }

    render() {
        let BackIcon = IMG.OtherFlow.BackIcon
        let RightArrowIcon = IMG.OtherFlow.RightArrowIcon

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

                            <Text style={styles.headerText}>Daily Reports</Text>

                            <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                                {/* <Image style={{ width: 30, height: 30, resizeMode: 'center' }}
                            source={SearchIcon}
                        /> */}
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1 }}>
                            {this.state.isLoading == false ?
                                (this.state.ArrDailyReports.length != 0 ?
                                    <View style={{ flex: 1 }}>

                                        <FlatList style={{ marginTop: 5, }}
                                            data={this.state.ArrDailyReports}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => (

                                                <TouchableOpacity onPress={() => this.btnSelectReportTap(item)}>
                                                    <View style={styles.ListView}>
                                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text style={styles.txtTitleStyle}>
                                                                {item.reporting_title}
                                                            </Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Image style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: CommonColors.denim }}
                                                                source={RightArrowIcon}
                                                            />
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                    :
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.txtNoData}>No data found</Text>
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
    txtNoData: {
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
    txtTitleStyle: {
        fontFamily: ConstantKeys.INTER_MEDIUM, marginLeft: 10, marginRight: 10,
        fontSize: SetFontSize.setDimension.ts18, marginTop: 10, marginBottom: 10,
        color: CommonColors.blackColor
    },
})