import {Platform,} from 'react-native';


export const ConstantKeys = {
    GOOGLE_KEY:          'AIzaSyBNhS6KxZoIZjMS-c9CcYxxdIdlWjpU4lM', //  AIzaSyD8bw72R-bXhXCfs9BGdyIh_Q-nGfmDpnw
    USERDATA :           "UserData",
    FCM_TOKEN :             "FCM_TOKEN",
    HOSPITAL_INFO :       "HospitalInfo",
    DOCTOR_INFO :       "DoctorInfo",

    ...Platform.select({
        ios: {
            INTER_BLACK: 'Inter-Black',
            INTER_BOLD: 'Inter-Bold',
            INTER_EXTRA_BOLD: 'Inter-ExtraBold',
            INTER_EXTRA_LIGHT: 'Inter-ExtraLight',
            INTER_LIGHT: 'Inter-Light',
            INTER_REGULAR: 'Inter-Regular',
            INTER_MEDIUM: 'Inter-Medium',
            INTER_SEMIBOLD: 'Inter-SemiBold',
            INTER_THIN: 'Inter-Thin',
        },
        android: {
            INTER_BLACK: 'Inter-Black',
            INTER_BOLD: 'Inter-Bold',
            INTER_EXTRA_BOLD: 'Inter-ExtraBold',
            INTER_EXTRA_LIGHT: 'Inter-ExtraLight',
            INTER_LIGHT: 'Inter-Light',
            INTER_REGULAR: 'Inter-Regular',
            INTER_MEDIUM: 'Inter-Medium',
            INTER_SEMIBOLD: 'Inter-SemiBold',
            INTER_THIN: 'Inter-Thin',
        },
      }),
};