<template>
  <div class="m-home">
    <div class="home-ctn">
      <transition name="fade">
        <myLoading v-show="state === 'loading'" />
      </transition>
      <transition name="fade">
        <myVideo v-show="state === 'video'" />
      </transition>
      <transition name="fade">
        <myScene v-show="state === 'scene'" />
      </transition>
      <transition name="fade">
        <myEnd v-show="state === 'end'" />
      </transition>
      <transition name="fade">
        <myShare v-show="state === 'share'" />
      </transition>
    </div>
  </div>
</template>

<script >
import { reactive, toRefs } from 'vue'

import myLoading from '@/components/loading/index.vue'
import myVideo from '@/components/video/index.vue'
import myScene from '@/components/scene/index.vue'
import myEnd from '@/components/end/index.vue'
import myShare from '@/components/share/index.vue'

import { commonHub } from '@/utils/commonHub.js'

export default {
  name: 'Home',
  components: {
    myLoading,
    myVideo,
    myScene,
    myEnd,
    myShare
  },
  setup() {
    const data = reactive({ state: 'loading', isShow: false })

    commonHub.on('pageChange', (pageName) => {
      data.state = pageName
    })

    const refs = toRefs(data)
    return {
      ...refs
    }
  }
}
</script>

<style lang="less" scoped>
.home-content{
    font-size: 16px;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}
.fade-enter-to,
.fade-leave {
	opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
	transition: all .6s;
}
</style>
