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


export default class Accouting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            ArrAccount: []
        };
    }


    componentDidMount() {
        this.API_ACCOUNT_INFO()
    }

    API_ACCOUNT_INFO = () => {
        this.setState({ isLoading: true })
        Webservice.post(ApiURL.GetTransactions, {
            authkey: '123456',
        })
            .then(response => {
                //   this.setState({spinner: false});
                if (response == null) {
                    this.setState({ loading: false });
                    alert('error');
                }
                console.log(response);

                console.log('Account Info Response : ' + JSON.stringify(response.data.Data))

                if (response.data.Status == 1) {
                    this.setState({ ArrAccount: response.data.Data, isLoading: false })
                } else {
                    this.setState({ ArrAccount: [], isLoading: false })
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

    btnPlusTap = () => {
        requestAnimationFrame(() => {
            this.props.navigation.navigate('AddTransaction', { refresh: this.refresh })
        })
    }

    refresh = data => {
        this.API_ACCOUNT_INFO()
    };

    btnSelectPayment = (data) => {
        requestAnimationFrame(() => {


            this.props.navigation.navigate('AccoutingDetail', { data: JSON.stringify(data) })
        })
    }

    render() {
        let BackIcon = IMG.OtherFlow.BackIcon
        let PlusIcon = IMG.OtherFlow.PlusIcon

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

                            <Text style={styles.headerText}>Accouting</Text>

                            <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}
                                onPress={() => this.btnPlusTap()}>
                                <Image style={{ width: 25, height: 25, resizeMode: 'center', }}
                                    source={PlusIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1 }}>
                            {this.state.isLoading == false ?
                                (this.state.ArrAccount.length != 0 ?
                                    <View style={{ flex: 1 }}>

                                        <FlatList style={{ marginTop: 5, }}
                                            data={this.state.ArrAccount}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item }) => (

                                                <TouchableOpacity 
                                                         onPress={() => this.btnSelectPayment(item)}>
                                                    <View style={styles.ListView}>
                                                        <View style={{ flex: 1 }}>
                                                            <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', }}>
                                                                <Text style={styles.txtDescription}>
                                                                    {item.description}
                                                                </Text>

                                                                <View style={styles.viewAmount}>
                                                                    <Text style={item.debit_credit == 'credit' ? styles.txtIncomeAmount : styles.txtExpenseAmount}>
                                                                        ₹ {item.amount}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={styles.viewDate}>
                                                                <Text style={styles.txtDate}>
                                                                    {Moment(item.created_date).format('DD MMM. YYYY [at] hh:mm a')}
                                                                </Text>
                                                            </View>

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
    txtNoDataFound: {
        fontFamily: ConstantKeys.INTER_BOLD, fontSize: SetFontSize.setDimension.ts18,
        color: CommonColors.blackColor
    },
    ListView: {
        marginTop: 5, marginBottom: 10, marginLeft: 20, marginRight: 20,
        flexDirection: 'row', alignItems: 'center', backgroundColor: CommonColors.whiteColor,
        shadowColor: CommonColors.shadowColor, borderRadius: 10,
        shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4,
        shadowRadius: 5, elevation : 5
    },
    txtDescription: {
        fontFamily: ConstantKeys.INTER_REGULAR, marginLeft: 10, marginRight: 5, flex: 1,
        fontSize: SetFontSize.setDimension.ts16, marginTop: 10,
        color: CommonColors.blackColor,
    },
    viewAmount: {
        marginTop: 10, justifyContent: 'center',
    },
    txtIncomeAmount: {
        fontFamily: ConstantKeys.INTER_MEDIUM, marginLeft: 5, marginRight: 10,
        fontSize: SetFontSize.setDimension.ts16,
        color: 'green', textAlign: 'center',
    },
    txtExpenseAmount: {
        fontFamily: ConstantKeys.INTER_MEDIUM, marginLeft: 5, marginRight: 10,
        fontSize: SetFontSize.setDimension.ts16,
        color: 'red', textAlign: 'center',
    },
    viewDate: {
        backgroundColor: CommonColors.denim, minHeight: 30, justifyContent: 'center',
        borderBottomRightRadius: 10, borderBottomLeftRadius: 10, marginTop: 10,
    },
    txtDate: {
        fontFamily: ConstantKeys.INTER_MEDIUM, marginLeft: 10, marginRight: 10,
        fontSize: SetFontSize.setDimension.ts16,
        color: CommonColors.whiteColor
    },
})