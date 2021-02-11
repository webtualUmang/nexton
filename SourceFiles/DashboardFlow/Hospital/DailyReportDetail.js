import React, { Component } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, Linking,LogBox,FlatList,
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


export default class DailyReportDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ReportDetail: JSON.parse(props.route.params.selectedReport),
    };
  }

  componentDidMount(){

  }

  //Action Methods
  btnBackTap = () =>{
    requestAnimationFrame(()=>{
        this.props.navigation.goBack()
    })
  }

  render() {
    let BackIcon = IMG.OtherFlow.BackIcon

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

                    <Text style={styles.headerText}>Details</Text>

                    <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                        {/* <Image style={{ width: 30, height: 30, resizeMode: 'center' }}
                            source={SearchIcon}
                        /> */}
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                    <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}>

                        <Text style={styles.Title}>
                            Reporting Title : {" "}
                            <Text style={styles.txtReport}>
                                {this.state.ReportDetail.reporting_title}
                            </Text>
                        </Text>

                        <Text style={styles.Title}>
                            Round Report : {" "}
                            <Text style={styles.txtReport}>
                                {this.state.ReportDetail.round_report}
                            </Text>
                        </Text>

                        <Text style={styles.Title}>
                            Complain Solutions : {" "}
                            <Text style={styles.txtReport}>
                                {this.state.ReportDetail.complain_solutions}
                            </Text>
                        </Text>

                        <Text style={styles.Title}>
                            Other Updation : {" "}
                            <Text style={styles.txtReport}>
                                {this.state.ReportDetail.other_updation}
                            </Text>
                        </Text>

                        <Text style={styles.Title}>
                            New Suggestions : {" "}
                            <Text style={styles.txtReport}>
                                {this.state.ReportDetail.new_suggestions}
                            </Text>
                        </Text>
                    </View>
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
    Title: {
        flexDirection: 'row', fontSize: SetFontSize.setDimension.ts18, marginTop:10,
        fontFamily: ConstantKeys.INTER_BOLD, color: CommonColors.blackColor
    },
    txtReport: {
        flexDirection: 'row', fontSize: SetFontSize.setDimension.ts16,
        fontFamily: ConstantKeys.INTER_REGULAR, color: CommonColors.darkGray
    },
})