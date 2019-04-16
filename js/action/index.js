import onThemeChange from './theme';
import {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} from './popular'
import {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} from './trending'
import {OnLoadFavoriteData} from './favorite'
export default {
    onThemeChange,
    onRefreshPopular,
    onLoadMorePopular,
    onLoadMoreTrending,
    onRefreshTrending,
    OnLoadFavoriteData,
    onFlushPopularFavorite,
    onFlushTrendingFavorite,
}