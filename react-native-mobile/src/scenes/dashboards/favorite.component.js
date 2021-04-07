import * as React from 'react';
import { View } from 'react-native';
import { FavoriteLayout } from '../../layouts/dashboards/favorite';

export function Favorite({ navigation }){
    return (
        <FavoriteLayout navigation={navigation}/>
    );
}