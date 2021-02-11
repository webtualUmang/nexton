import React, { Component } from 'react';
import {
    View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, StyleSheet, ActivityIndicator,
    LogBox, ScrollView, Dimensions, FlatList
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
import ImageView from "react-native-image-viewing";
import FastImage from 'react-native-fast-image'

var prop = null

export default class AccoutingDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            PaymentData: JSON.parse(props.route.params.data),
            images: [],
            isVisible: false
        };
    }

    componentDidMount() {
        var img = []
        img.push({ uri: this.state.PaymentData.img })
        this.setState({ images: img })
    }

    //Action Methods
    btnBackTap = () => {
        requestAnimationFrame(() => {
            const { navigation, route } = this.props;

            navigation.goBack();

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

                            <Text style={styles.headerText}>Details</Text>

                            <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                                {/* <Image style={{ width: 25, height: 25, resizeMode: 'center' }}
                    source={Notification}
                /> */}
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1 }}>
                            {this.state.isLoading == false ?
                                <View style={{ flex: 1, }}>
                                    {this.state.PaymentData.img != null ?
                                        <TouchableOpacity onPress={() => this.setState({ isVisible: true })}>
                                            <FastImage style={{ width: '100%', height: 200 }}
                                                source={{ uri: this.state.PaymentData.img }}
                                                resizeMode={'cover'}
                                            />
                                        </TouchableOpacity>
                                        : null}

                                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                                        <Text style={styles.DiscriptionTitle}>
                                            Description : {" "}
                                            <Text style={styles.txtDiscription}>
                                                {this.state.PaymentData.description}
                                            </Text>
                                        </Text>

                                        <Text style={styles.AmountTitle}>
                                            Amount : {" "}
                                            <Text style={this.state.PaymentData.debit_credit == 'credit' ? styles.txtAmountIncome : styles.txtAmountExpense}>
                                                ₹ {this.state.PaymentData.amount}
                                            </Text>
                                        </Text>

                                        <Text style={styles.PaymentModeTitle}>
                                            Payment Mode : {" "}
                                            <Text style={styles.txtPaymentMode}>
                                                {this.state.PaymentData.mode_of_payment}
                                            </Text>
                                        </Text>

                                        <Text style={styles.DateTitle}>
                                            Date : {" "}
                                            <Text style={styles.txtDate}>
                                                {Moment(this.state.PaymentData.created_date).format('DD MMM. YYYY [at] hh:mm a')}
                                            </Text>
                                        </Text>
                                    </View>

                                    <ImageView
                                        images={this.state.images}
                                        imageIndex={0}
                                        visible={this.state.isVisible}
                                        onRequestClose={() => this.setState({ isVisible: false })}
                                    />
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
    DiscriptionTitle: {
        flexDirection: 'row', fontSize: SetFontSize.setDimension.ts18,
        fontFamily: ConstantKeys.INTER_BOLD, color: CommonColors.blackColor
    },
    txtDiscription: {
        flexDirection: 'row', fontSize: SetFontSize.setDimension.ts16,
        fontFamily: ConstantKeys.INTER_REGULAR, color: CommonColors.darkGray
    },
    AmountTitle: {
        flexDirection: 'row', fontSize: SetFontSize.setDimension.ts18, marginTop: 10,
        fontFamily: ConstantKeys.INTER_BOLD, color: CommonColors.blackColor
    },
    txtAmountIncome: {
        flexDirection: 'row', fontSize: SetFontSize.setDimension.ts16,
        fontFamily: ConstantKeys.INTER_REGULAR, color: 'green'
    },
    txtAmountExpense: {
        flexDirection: 'row', fontSize: SetFontSize.setDimension.ts16,
        fontFamily: ConstantKeys.INTER_REGULAR, color: 'red'
    },
    PaymentModeTitle: {
        flexDirection: 'row', fontSize: SetFontSize.setDimension.ts18, marginTop: 10,
        fontFamily: ConstantKeys.INTER_BOLD, color: CommonColors.blackColor
    },
    txtPaymentMode: {
        flexDirection: 'row', fontSize: SetFontSize.setDimension.ts16,
        fontFamily: ConstantKeys.INTER_REGULAR, color: CommonColors.darkGray
    },
    DateTitle: {
        flexDirection: 'row', fontSize: SetFontSize.setDimension.ts18, marginTop: 10,
        fontFamily: ConstantKeys.INTER_BOLD, color: CommonColors.blackColor
    },
    txtDate: {
        flexDirection: 'row', fontSize: SetFontSize.setDimension.ts16,
        fontFamily: ConstantKeys.INTER_REGULAR, color: CommonColors.darkGray
    }

})