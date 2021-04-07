import * as React from 'react';
import { View } from 'react-native';
import { HomeLayout } from '../../layouts/dashboards/home';
export function Home({ navigation,route }){
    return (
        <>
            <HomeLayout navigation={navigation} route={route}/>
        </>
    );
}