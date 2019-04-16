import BackPressComponent from '../../common/BackPressComponent'
import config from '../../res/data/config'
export default class AboutCommon{
  constructor(props, updateState){
    super(props);
    this.backPress = new BackPressComponent({
      backPress: () => this.onBackPress()
    });
    this.updateState = updateState;
    this.updateState({
      config
    })
  }
  componentDidMount() {
    this.backPress.componentDidMount();
    fetch('http://www.devio.org/io/GitHubPopular/json/github_app_config.json')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network Error');
        })
        .then(config => {
            if (config) {
                this.updateState({
                    data: config
                })
            }
        })
        .catch(e => {
            console(e);
        })
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  onBackPress() {
    NavigationUtil.goBack(this.props.navigation);
    return true;
  }

}