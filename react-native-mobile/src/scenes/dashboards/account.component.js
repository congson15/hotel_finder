import * as React from 'react';
import { View } from 'react-native';
import { AccountLayout } from '../../layouts/dashboards/account';

export function Account({ navigation }){
    return (
        <AccountLayout navigation={navigation}/>
    );

}