import React, { PureComponent } from 'react'
import {BackHandler, Animated, Easing, ToastAndroid} from 'react-native'
import {Button} from 'antd-mobile'
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom,
  addNavigationHelpers,
  NavigationActions,
} from 'react-navigation'
import {
  initializeListeners,
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'
import { connect } from 'react-redux'


import Loading from './containers/Loading'

import Login from './containers/User/Login/index'

import Load from './containers/load'

// 首页部分
import Home from './containers/Home/Home'
import Detail from './containers/Detail'
import Game from './containers/game/index'
import IncomeIndex from './containers/income/index'
import Incometransfer from './containers/income/transfer'
import IncomeDetails from  './containers/income/details'
import Treasure from  './containers/treasure/treasure'
import treasureDetail from  './containers/treasure/treasureDetail'
import transform from './containers/treasure/transform'
import cscTransform from './containers/treasure/cscTransform'
import treasureSuccess from './containers/treasure/success'
import friend from  './containers/energy/friend'
import friendList from './containers/energy/friendList'
import Hoist from  './containers/energy/hoist'
import bulletinList from  './containers/bulletin/list'
import bulletinDetail from  './containers/bulletin/detail'
import extract from  './containers/treasure/extract'
import extractList from  './containers/treasure/extractList'
import extractDetail  from  './containers/treasure/extractDetail'
import extraWallet  from  './containers/treasure/extraWallet'
import instructions from './containers/income/instructions'
import turnsOut from  './containers/income/turnsOut'
import bank from  './containers/bank/bank'
import bankList from  './containers/bank/bankList'
import wallet from  './containers/wallet/wallet'
import walletList from  './containers/wallet/walletList'

// 用户部分
import Account from './containers/Account/Account'
import MobileLogin from './containers/User/mobileLogin/index'
import Register from './containers/User/register/index'
import ResetPwd from './containers/User/findPwd/resetPwd'
import UserInfo from './containers/User/userInfo/index'
import Settings from './containers/User/settings/index'
import SetPassword from './containers/User/setPassword/index'
import ResetPassword from './containers/User/resetPassword/index'
import SetPayPassword from './containers/User/setPayPassword/index'
import ResetPayPassword from  './containers/User/resetPayPassword/index'
import SetRealName from  './containers/User/setRealName/index'

// 云上之巅
import Cloud from './containers/Cloud/Cloud'
import prizeResult from './containers/prize/prizeResult'
import prizeDetail from  './containers/prize/prizeDetail'
import prizeList from './containers/prize/prizeList'
import addressList from  './containers/prize/addressList'
import address from  './containers/prize/address'
import amounts from  './containers/prize/amounts'


const HomeNavigator = TabNavigator(
  {
    Home: { screen: Home, },
    Cloud: { screen: Cloud },
    Account: { screen: Account }
  },
  {
    animationEnabled: true, // 切换页面时是否有动画效果
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    lazyLoad: false,
    backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    tabBarOptions: {
      activeTintColor: '#2591ff', // 文字和图片选中颜色
      inactiveTintColor: '#666666', // 文字和图片未选中颜色
      showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
      indicatorStyle: {
          height: 0  // 如TabBar下面显示有一条线，可以设高度为0后隐藏
      },
      style: {
          backgroundColor: '#fff', // TabBar 背景色
          // height: 44
      },
      labelStyle: {
          fontSize: 11, // 文字大小
      },
    },
  }
)

// const MainNavigator = StackNavigator(
//   {
//     HomeNavigator: { screen: HomeNavigator },
//     Detail: { screen: Detail },
//     Register: { screen: Register,
//         // navigationOptions: ({navigation}) => ({
//         // headerLeft:(
//         //     <Button type="primary"  onClick={() => navigation.navigate({routeName: 'Register'})}>登录</Button>)
//         // }),
//     }
//   },
//   {
//       headerMode: 'float',
//       navigationOptions: {
//           gesturesEnabled: false,
//           headerBackTitle: null,
//           headerTintColor: '#fff',
//           headerStyle:{
//               backgroundColor: '#2591ff',
//                   height: 0  // 如TabBar下面显示有一条线，可以设高度为0后隐藏
//           }
//       },
//   }
// )

const AppNavigator = StackNavigator(
  {
    // Main: { screen: MainNavigator },
    // Login: { screen: Login },
      Load: { screen: Load },
      Home: {screen: HomeNavigator},
      Login: { screen: Login },
      MobileLogin: { screen: MobileLogin },
      Register: { screen: Register},
      Detail: { screen: Detail },
      ResetPwd: { screen: ResetPwd},
      UserInfo: {screen: UserInfo},
      Settings: {screen: Settings},
      Game: {screen: Game},
      SetPassword: {screen: SetPassword},
      ResetPassword: {screen: ResetPassword},
      SetPayPassword: {screen: SetPayPassword},
      ResetPayPassword: {screen: ResetPayPassword},
      SetRealName: {screen: SetRealName},
      IncomeIndex: {screen: IncomeIndex},
      Incometransfer: {screen: Incometransfer},
      IncomeDetails: {screen: IncomeDetails},
      bank: {screen: bank},
      bankList: {screen: bankList},
      wallet: {screen: wallet},
      walletList: {screen: walletList},
      prizeResult: {screen: prizeResult},
      prizeDetail: {screen: prizeDetail},
      prizeList: {screen: prizeList},
      amounts: {screen: amounts},
      addressList: {screen: addressList},
      address: {screen: address},
      Treasure: {screen: Treasure},
      treasureDetail: {screen: treasureDetail},
      transform: {screen: transform},
      cscTransform: {screen: cscTransform},
      treasureSuccess: {screen: treasureSuccess},
      friend: {screen: friend},
      friendList: {screen: friendList},
      Hoist: {screen: Hoist},
      bulletinList: {screen: bulletinList},
      bulletinDetail: {screen: bulletinDetail},
      extract: {screen: extract},
      extractList: {screen: extractList},
      extractDetail: {screen: extractDetail},
      extraWallet: {screen: extraWallet},
      instructions: {screen: instructions},
      turnsOut: {screen: turnsOut}
  },
  {
      headerMode: 'screen',
      mode: 'card',
      navigationOptions: {
          gesturesEnabled: false,
          headerBackTitle: null,
          headerTintColor: '#fff',
          headerStyle:{
              backgroundColor: '#2591ff'
          }
      },
    // headerMode: 'none',
    // mode: 'modal',
    // transitionConfig: () => ({
    //   transitionSpec: {
    //     duration: 300,
    //     easing: Easing.out(Easing.poly(4)),
    //     timing: Animated.timing,
    //   },
    //   screenInterpolator: sceneProps => {
    //     const { layout, position, scene } = sceneProps
    //     const { index } = scene
    //
    //     const height = layout.initHeight
    //     const translateY = position.interpolate({
    //       inputRange: [index - 1, index, index + 1],
    //       outputRange: [height, 0, 0],
    //     })
    //
    //     const opacity = position.interpolate({
    //       inputRange: [index - 1, index - 0.99, index],
    //       outputRange: [0, 1, 1],
    //     })
    //
    //     return { opacity, transform: [{ translateY }] }
    //   },
    // }),
  }
)

function getCurrentScreen(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getCurrentScreen(route)
  }
  return route.routeName
}

export const routerMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.router
)
const addListener = createReduxBoundAddListener('root')

class Router extends PureComponent {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandle)
  }

  componentDidMount() {
    initializeListeners('root', this.props.router)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
  }

  backHandle = () => {
    const currentScreen = getCurrentScreen(this.props.router)
    // if (currentScreen === 'Login') {
    //   return true
    // }
    if (currentScreen == 'Home' || currentScreen == 'Cloud' || currentScreen == 'Account') {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            return false;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        return true;
    }else{
        this.props.dispatch(NavigationActions.back())
        return true
    }
    // return false
  }

  render() {
    const { dispatch, app, router } = this.props
    // if (app.loading) return <Loading />
    const navigation = addNavigationHelpers({
      dispatch,
      state: router,
      addListener,
    })
    return <AppNavigator navigation={navigation} />
  }
}

export function routerReducer(state, action = {}) {
  return AppNavigator.router.getStateForAction(action, state)
}

export default connect(({app, router}) => ({app, router}))(Router)


