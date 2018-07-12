import React, {Component} from 'react'
import {StyleSheet, View, Animated, ImageBackground, Easing} from 'react-native'


var wave_interval = null

class Wave extends Component {

    constructor(props) {
        super(props)
        this.state = {
            // waveTopValue: new Animated.Value(0),
            // waveMiddValue: new Animated.Value(0),
            // waveBottomValue: new Animated.Value(0)
            waveMiddValue: 100,
            waveBottomValue: 100,
            midd: false,
            bott: false
        }
    }

    componentDidMount() {
        this.startAnimation()
    }
    startAnimation() {
        wave_interval = setInterval(()=>{
            if(this.state.waveMiddValue >= 140){
                this.setState({ midd: true })
            }
            if(this.state.waveBottomValue >= 130){
                this.setState({ bott: true })
            }
            if(this.state.waveMiddValue === 100){
                this.setState({ midd: false })
            }
            if(this.state.waveBottomValue === 100){
                this.setState({ bott: false })
            }
            if(this.state.midd === false){
                this.setState({ waveMiddValue: this.state.waveMiddValue + 0.8 })
            }else{
                this.setState({ waveMiddValue: this.state.waveMiddValue -  0.8 })
            }
            if(this.state.bott === false){
                this.setState({ waveBottomValue: this.state.waveBottomValue + 0.5 })
            }else{
                this.setState({ waveBottomValue: this.state.waveBottomValue - 0.5 })
            }
        }, 60)
        // const createAnimation = (value, duration, easing, index, delay = 0) => {
        //     if (index === '1') {
        //         this.state.waveTopValue.setValue(0.5)
        //     } else if (index === '2') {
        //         this.state.waveMiddValue.setValue(0.5)
        //     } else {
        //         this.state.waveBottomValue.setValue(0.5)
        //     }
        //     return Animated.timing(
        //         value,
        //         {
        //             toValue: 1,
        //             duration,
        //             easing,
        //             delay
        //         }
        //     )
        //
        //
        // }
        // Animated.parallel([
        //     createAnimation(this.state.waveTopValue, 300, Easing.linear, '1',200),
        //     createAnimation(this.state.waveMiddValue, 1000, Easing.linear, '2', 600),
        //     createAnimation(this.state.waveBottomValue, 1500, Easing.linear, '3', 800)
        // ]).start(() => this.startAnimation())

    }

    render() {
        // const waveTopStyles = this.state.waveTopValue.interpolate({
        //     inputRange: [0, 1],
        //     outputRange: ['100%', '120%']
        // })
        // const waveMiddleStyles = this.state.waveMiddValue.interpolate({
        //     inputRange: [0.2, 0.4, 0.6, 0.8, 1, 1, 1],
        //     outputRange: ['105%', '110%', '115%', '120%', '125%', '115%', '100%']
        // })
        // const waveBottomStyles = this.state.waveBottomValue.interpolate({
        //     inputRange: [0.2, 0.4, 0.6, 0.8, 1, 1, 1],
        //     outputRange: ['105%', '110%', '115%', '120%', '125%', '115%', '100%']
        // })
        // const waveTopStyless = {
        //     width: waveTopStyles
        // }
        // const waveMiddleStyless = {
        //     width: waveMiddleStyles
        // }
        // const waveBottomStyless = {
        //     width: waveBottomStyles
        // }
        const {waveMiddValue, waveBottomValue} = this.state
        const waveMiddleStyless = {
            width: waveMiddValue+ '%'
        }
        const waveBottomStyless = {
            width: waveBottomValue + '%'
        }
        return (
            <View style={styles.waveWrapper}>
                <Animated.View style={[styles.waveWrapperInner, styles.bgTop]}>
                    <ImageBackground  resizeMode='cover' source={require('../images/me/wave-top.png')}
                                     style={[styles.wave, styles.waveTop]}/>
                </Animated.View>
                <Animated.View style={[styles.waveWrapperInner, styles.bgMiddle]}>
                    <ImageBackground resizeMode='cover' source={require('../images/me/wave-mid.png')}
                                     style={[styles.wave, styles.waveMiddle,waveMiddleStyless]}/>
                </Animated.View>
                <Animated.View style={[styles.waveWrapperInner, styles.bgBottom]}>
                    <ImageBackground resizeMode='cover' source={require('../images/me/wave-bot.png')}
                                     style={[styles.wave, styles.waveBottom,waveBottomStyless]}/>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    waveWrapper: {
        overflow: 'hidden',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 80,
        margin: 'auto',
    },
    waveWrapperInner: {
        position: 'absolute',
        width: '100%',
        overflow: 'hidden',
        height: '100%',
        bottom: -1,
    },
    bgTop: {
        zIndex: 6,
        opacity: 0.5,
    },
    bgMiddle: {
        zIndex: 10,
        opacity: 0.75,
    },
    bgBottom: {
        zIndex: 5,
    },
    wave: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    waveTop: {
        width: '100%', height: 43,
    },
    waveMiddle: {
        width: '100%', height: 40
    },
    waveBottom: {
        width: '100%', height: 50
    }
})

export default Wave
