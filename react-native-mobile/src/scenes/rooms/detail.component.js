import * as React from 'react';
import { RoomDetailLayout } from '../../layouts/rooms/detail';

export function RoomDetail( {navigation,route} ){


    return(
        <>
            <RoomDetailLayout navigation={navigation} route={route}/>   
        </>
    );
}
