import React from 'react'
import { StyleSheet, Image } from 'react-native'


export const Thumb = ({ img, style}) => (
    <Image
        source={img}
        style={style ? style : styles.icon}
        />
)

const styles = StyleSheet.create({
    icon: {
        width: 28,
        height: 28,
        marginRight: 20
    },
})

export default Thumb