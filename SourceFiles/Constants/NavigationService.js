// NavigationService.js

import * as React from 'react';
import { StackActions , CommonActions} from '@react-navigation/native';

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

export function navigate(name, params) {

  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted

    // const pushAction = StackActions.push(name, params);

    // navigationRef.current.dispatch(pushAction);


    // Work in both state but when start DoctorDashboard then Notification screen dismiss
    // navigationRef.current.dispatch({
    //   ...CommonActions.reset({
    //     index: 0,
    //     key : 'DoctorDashboard',
    //     routes: [{name : name, params : params}],
    //   })
    // });

    navigationRef.current.navigate(name, params);

  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
    console.log("isReadyRef.current && navigationRef.current not found")
  }
}
