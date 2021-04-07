import * as React from 'react';
import  {CameraLayout}  from '../../layouts/dashboards/camera';

export function Camera({ navigation, route }){
    return (
        <CameraLayout navigation={navigation} route={route}/>
    );
}