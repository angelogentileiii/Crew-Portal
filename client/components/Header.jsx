import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native'

function Header({ props }){

    // <TouchableOpacity
    //      style={{ backgroundColor: '#29434e' , padding: 10}}
    //      onPress={() => params.onlogout}
    // ></TouchableOpacity>

    return (
        <View>
            <Text>{props.name}</Text>
        </View>
    )
}

export default Header