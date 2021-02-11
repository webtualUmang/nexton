import React, { Component } from 'react';
import {
    View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, StyleSheet, ActivityIndicator, TextInput,
    LogBox, ScrollView, Dimensions, FlatList, Alert
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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import FastImage from 'react-native-fast-image'


export default class AddTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            txtPaymentDesription: '',
            txtAmount: '',
            txtPaymentMode: '',
            isIncome: true,
            PaymentImage: null,
            AdminInfo: {}
        };
    }

    componentDidMount() {
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

    //API Add Transaction
    API_Add_Transaction() {
        this.setState({ isLoading: true })
        var paymentType = ''
        if (this.state.isIncome) {
            paymentType = 'Income'
        } else {
            paymentType = 'Expense'
        }
        Webservice.post(ApiURL.AddTransactions, {
            debit_credit: paymentType,
            amount: this.state.txtAmount,
            description: this.state.txtPaymentDesription,
            mode_of_payment: this.state.txtPaymentMode,
            entry_by: this.state.AdminInfo.id,
            img: this.state.PaymentImage == null ? '' : this.state.PaymentImage.base64,
            authkey: "123456",
        })
            .then(response => {
                //   this.setState({spinner: false});
                if (response == null) {
                    this.setState({ loading: false });
                    alert('error');
                }
                console.log(response);

                console.log('Get Add Transaction Response : ' + JSON.stringify(response.data.Data))

                if (response.data.Status == 1) {
                    Toast.showWithGravity(response.data.Msg, Toast.SHORT, Toast.BOTTOM);
                    this.setState({ isLoading: false })

                    const { navigation, route } = this.props;

                    route.params.refresh(null);
                    navigation.goBack();

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

    btnSelectImage = () => {

        Alert.alert(
            ValidationMsg.AppName,
            'Choose your Suitable Option',
            [
                {
                    text: 'Camera', onPress: () => {
                        launchCamera(
                            {
                                mediaType: 'photo',
                                includeBase64: true,
                                quality: 0.7
                            },
                            (response) => {
                                console.log(JSON.stringify(response))
                                if (response.didCancel) {
                                    console.log('User cancelled photo picker');

                                    this.setState({ loading: false })
                                }
                                else if (response.errorCode) {
                                    console.log('ImagePicker Error: ', response.errorCode);
                                    this.setState({ loading: false })

                                    if(response.errorCode == 'permission'){
                                        alert("Please allow Camera permission from Setting")
                                    }
                                }
                                else if (response.customButton) {
                                    console.log('User tapped custom button: ', response.customButton);
                                }
                                else {
                                    this.setState({ PaymentImage: response })
                                }
                            },
                        )
                    }
                },
                {
                    text: 'Gallary',
                    onPress: () => {
                        launchImageLibrary(
                            {
                                mediaType: 'photo',
                                includeBase64: true,
                                quality: 0.7
                            },
                            (response) => {

                                if (response.didCancel) {
                                    
                                    this.setState({isLoading:false})
                                    console.log('User cancelled photo picker');
                                }
                                else if (response.errorCode) {

                                    console.log('ImagePicker Error: ', response.error);
                                    this.setState({isLoading:false})
                                    if(response.errorCode == 'permission'){
                                        alert("Please allow Camera permission from Setting")
                                    }
                                }
                                else if (response.customButton) {
                                    this.setState({isLoading:false})
                                    console.log('User tapped custom button: ', response.customButton);
                                }
                                else {
                                    this.setState({ PaymentImage: response })
                                }

                            },
                        )
                    }
                },
                {
                    text: 'Cancel',
                    style: 'destructive'
                },
            ],
            { cancelable: true }
        );
    }

    btnAddTap = () => {
        requestAnimationFrame(() => {
            if (this.state.txtPaymentDesription == '') {
                Toast.showWithGravity(ValidationMsg.EmptyDescription, Toast.SHORT, Toast.BOTTOM);
            } else if (this.state.txtAmount == '') {
                Toast.showWithGravity(ValidationMsg.EmptyAmount, Toast.SHORT, Toast.BOTTOM);
            } else if (this.state.txtPaymentMode == '') {
                Toast.showWithGravity(ValidationMsg.EmptyPaymentMode, Toast.SHORT, Toast.BOTTOM);
            } else {
                this.API_Add_Transaction()
            }
        })
    }

    btnPaymentTypeTap = () => {
        requestAnimationFrame(() => {
            if (this.state.isIncome) {
                this.setState({ isIncome: false })
            } else {
                this.setState({ isIncome: true })
            }

        })
    }


    render() {
        let BackIcon = IMG.OtherFlow.BackIcon
        let RadioFillIcon = IMG.OtherFlow.RadioFillIcon
        let RadioIcon = IMG.OtherFlow.RadioIcon
        let RemoveIcon = IMG.OtherFlow.RemoveIcon

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

                            <Text style={styles.headerText}>Add Transaction</Text>

                            <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                                {/* <Image style={{ width: 25, height: 25, resizeMode: 'center', }}
                                    source={PlusIcon}
                                /> */}
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1 }}>
                            {this.state.isLoading == false ?
                                <View style={{ flex: 1 }}>
                                    <ScrollView style={{ flex: 1 }}>

                                        <View style={{ marginTop: 20 }}>
                                            <TouchableOpacity
                                                onPress={() => this.btnSelectImage()}>
                                                <FastImage style={{ width: '100%', height: 200 }}
                                                    source={this.state.PaymentImage != null ? { uri: this.state.PaymentImage.uri } : { uri: 'https://i.stack.imgur.com/y9DpT.jpg' }}
                                                    resizeMode={'cover'}
                                                />
                                            </TouchableOpacity>

                                            {this.state.PaymentImage != null ?
                                                <TouchableOpacity style={{
                                                    position: 'absolute', alignSelf: 'flex-end', height: 50, width: 50,
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}
                                                    onPress={() => this.setState({ PaymentImage: null })}>
                                                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }}
                                                        source={RemoveIcon}
                                                    />
                                                </TouchableOpacity>
                                                : null}
                                        </View>


                                        <Text style={styles.PaymentDesriptionTitle}>
                                            Payment Desription
                                    </Text>

                                        <View style={styles.viewPaymentDescriptionStyle}>
                                            <TextInput style={styles.TextinputStyle}
                                                multiline={true}
                                                keyboardType='default'
                                                onChangeText={(txtPaymentDesription) => this.setState({ txtPaymentDesription })}
                                                value={this.state.txtPaymentDesription}
                                                placeholder="Enter Desription" />
                                        </View>

                                        <Text style={styles.PaymentDesriptionTitle}>
                                            Amount
                                    </Text>

                                        <View style={styles.viewAmountStyle}>
                                            <TextInput style={styles.TextinputAmountStyle}
                                                numberOfLines={1}
                                                multiline={false}
                                                maxLength={10}
                                                keyboardType='number-pad'
                                                onChangeText={(txtAmount) => this.setState({ txtAmount })}
                                                value={this.state.txtAmount}
                                                placeholder="Enter Amount" />
                                        </View>

                                        <Text style={styles.PaymentDesriptionTitle}>
                                            Payment Mode
                                    </Text>

                                        <View style={styles.viewAmountStyle}>
                                            <TextInput style={styles.TextinputAmountStyle}
                                                numberOfLines={1}
                                                multiline={false}
                                                onChangeText={(txtPaymentMode) => this.setState({ txtPaymentMode })}
                                                value={this.state.txtPaymentMode}
                                                placeholder="Enter Payment Mode" />
                                        </View>

                                        <Text style={styles.PaymentDesriptionTitle}>
                                            Payment Type
                                    </Text>

                                        <View style={styles.viewPaymentType}>
                                            <TouchableOpacity style={{ flex: 0.5 }}
                                                onPress={() => this.btnPaymentTypeTap()}>

                                                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', height: 50 }}>
                                                    <Image style={{ height: 25, width: 25, resizeMode: 'contain' }}
                                                        source={this.state.isIncome ? RadioFillIcon : RadioIcon} />
                                                    <Text style={styles.txtIncome}>
                                                        Income
                                                </Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ flex: 0.5 }}
                                                onPress={() => this.btnPaymentTypeTap()}>
                                                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', height: 50 }}>
                                                    <Image style={{ height: 25, width: 25, resizeMode: 'contain' }}
                                                        source={this.state.isIncome ? RadioIcon : RadioFillIcon} />
                                                    <Text style={styles.txtExpense}>
                                                        Expense
                                                </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>


                                    </ScrollView>
                                    <LinearGradient colors={[CommonColors.denim, CommonColors.governor_bay]}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        style={styles.gradientLogin}>

                                        <TouchableOpacity style={styles.btnAdd}
                                            onPress={() => this.btnAddTap()}>
                                            <Text style={styles.txtAdd}>
                                                Add
                                            </Text>
                                        </TouchableOpacity>
                                    </LinearGradient>
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
    gradientLogin: {
        marginLeft: 20, marginRight: 20, borderRadius: 10, marginBottom: 20,
        height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 5
    },
    btnAdd: {
        height: '100%', width: '100%',
        justifyContent: 'center', alignItems: 'center'
    },
    txtAdd: {
        color: CommonColors.whiteColor,
        fontSize: SetFontSize.setDimension.ts20,
        fontFamily: ConstantKeys.INTER_BOLD
    },
    PaymentDesriptionTitle: {
        marginTop: 20, marginLeft: 20, marginRight: 20,
        color: CommonColors.midnightBlueColor, fontSize: SetFontSize.setDimension.ts18,
        fontFamily: ConstantKeys.INTER_BOLD
    },
    viewPaymentDescriptionStyle: {
        marginRight: 20,
        marginTop: 5,
        marginLeft: 20,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: CommonColors.whiteColor,
        borderColor: CommonColors.denim,
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 3,
        shadowOpacity: 0.5, minHeight: 80,
        shadowColor: CommonColors.shadowColor
    },
    TextinputStyle: {
        marginLeft: 8,
        marginRight: 8,
        fontSize: SetFontSize.setDimension.ts16,
        fontFamily: ConstantKeys.INTER_MEDIUM,
        color: CommonColors.blackColor,
        flex: 1, marginBottom: 8
    },
    viewAmountStyle: {
        height: 50,
        marginRight: 20,
        marginTop: 5,
        marginLeft: 20,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: CommonColors.whiteColor,
        borderColor: CommonColors.denim,
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 3,
        shadowOpacity: 0.5,
        shadowColor: CommonColors.shadowColor
    },
    TextinputAmountStyle: {
        marginLeft: 8,
        marginRight: 8,
        fontSize: SetFontSize.setDimension.ts16,
        fontFamily: ConstantKeys.INTER_MEDIUM,
        color: CommonColors.blackColor,
        height: 50,
    },
    txtIncome: {
        marginLeft: 10, fontFamily: ConstantKeys.INTER_MEDIUM,
        fontSize: SetFontSize.setDimension.ts16, color: CommonColors.blackColor
    },
    txtExpense: {
        marginLeft: 10, fontFamily: ConstantKeys.INTER_MEDIUM,
        fontSize: SetFontSize.setDimension.ts16, color: CommonColors.blackColor
    },
    viewPaymentType: {
        marginTop: 5, marginLeft: 20, marginRight: 20,
        flexDirection: 'row', paddingBottom: 10
    }
})