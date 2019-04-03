export default class NavigationUtil {

    static goBack(navigation){
        navigation.goBack();
    }

    static resetToHomePage(params){
        const { navigation } = params;
        navigation.navigate('Main');
    }
    /**
     * 跳转到指定页面
     * @param {要传递的参数} params 
     * @param {要跳转的页面} page 
     */
    static goPage(params, page){
        const navigation = NavigationUtil.navigation;
            navigation.navigate(
                page,
                {...params}
            )
    }
}