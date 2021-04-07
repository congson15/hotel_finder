import * as React from 'react';
import { SearchLayout } from '../../layouts/dashboards/search';

export function Search({ navigation, route }){
    return (
        <SearchLayout navigation={navigation} route={route}/>
    );
}