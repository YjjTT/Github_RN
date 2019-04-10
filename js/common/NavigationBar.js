import {Component} from 'react';
import {PropTypes} from 'prop-types';
import {ViewPropTypes, View, Text} from 'react-native'

const StatusBarShape = { // 设置状态栏所接受的属性
    barStyle: PropTypes.oneOf('light-content', 'default'),
    hidden: PropTypes.bool,
    backgroundColor: PropTypes.string
}

export default class NavigationBar extends Component{
    // 提供属性的类型检查
    static PropTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleView: PropTypes.element,
        titleLayoutStyle: ViewPropTypes.style,
        hide: PropTypes.bool,
        statusBar: PropTypes.shape(StatusBarShape),
        rightButton: PropTypes.element,
        leftButton: PropTypes.element,
    }
    // 设置默认属性
    static defaultProp = {
        statusBar:{
            barStyle: 'light-content',
            hidden: false
        }
    }
    render(){
        let statusBar = !this.props.statusBar.hidden ? 
                        <View style={StyleSheet.statusBar}>
                            <StatusBar  {...this.props.statusBar} />
                        </View>: null;
        let titleView = this.props.titleView ?

        return(

        )
    }
}