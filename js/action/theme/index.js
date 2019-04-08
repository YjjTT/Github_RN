import Types from '../types';

export default function onTheme(theme){
    return {type: Types.THEME_CHANGE, theme: theme}
}