const state = {
  cachedViews: [],
  textureList: {},
  name: '德玛西亚',
  shareImg: '',
  shareTitleImg: '',
  shareBgImg: '',
}

const mutations = {
  ADD_CACHED_VIEW: (state, view) => {
    // 不重复添加
    if (state.cachedViews.includes(view.name)) return
    if (!view?.meta?.noCache) {
      state.cachedViews.push(view.name)
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = []
  },
  CHANGE_TEXTURE_LIST: (state, value) => {
    state.textureList = value
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
