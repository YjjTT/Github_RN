import Types from '../types';

export function onTheme(theme){
    return {type: Types.THEME_CHANGE, theme: theme}
}