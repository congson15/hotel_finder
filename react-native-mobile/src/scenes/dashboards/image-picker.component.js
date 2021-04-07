import * as React from 'react';
import { View } from 'react-native';
import  ImageBrowserLayout  from '../../layouts/dashboards/image-picker';

export function ImageBrowserScreen({ navigation, route }){
    return (
        <ImageBrowserLayout navigation={navigation} route={route}/>
    );
}