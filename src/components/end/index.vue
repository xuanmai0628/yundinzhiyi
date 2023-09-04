<template>
    <div class="m-end" v-show="endShow">
        <div class="m-end-bg-box" v-show="endHide">
            <div class="m-end-bg">
                <div class="m-end-book-now" @click="onStartAni"></div>
                <div class="user-add-city">您已成功加入{{ data.cityName }}!</div>
                <div class="m-end-invite-now-bg" @click="onGoShare(0)"></div>
                <div class="m-end-invite-now" @click="onGoShare(1)"></div>
                <div class="return-scene" @click="onReturnScene"></div>
            </div>
        </div>


        <!-- 海报展示  -->
        <div class="m-share-bg" :style="{backgroundImage:`url(${shareImg})`}">
            <div  class="m-share-info" :style="{backgroundImage:`url(${shareTitleImg})`}"></div>
            <div class="m-share-return" @click="onReturnEnd"></div>
            <div class="m-share-user">
                <p>张三</p>
                <p>已加入{{ cityName }}城邦</p>
            </div>
            <div class="m-share-rank">
                已有<span>{{ 1 }}</span>弈士入驻{{ cityName }}城邦目前排名第<span>{{ 1 }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref, reactive, toRefs } from 'vue'
import { commonHub } from '@/utils/commonHub.js'
import { MMD } from '../../../public/ossweb-img/lib/mmd.videoplayer.min.1.0.1';
import { gsap } from 'gsap';
import { useStore } from 'vuex'

export default {
    setup() {
        const store = useStore();
        const data = reactive({
            endShow: false,
            videoPlayer: null,
            bookNowAni: null,
            cityName: null,
            endHide: true,
            shareImg: null,
            shareTitleImg:null
        })
        commonHub.on('pageChange', (pageName) => {
            console.log('传过来的名称video', pageName)
            if (pageName === 'end') {
                data.endShow = true;
                data.cityName = store.state.cachedView.name
                // 封面地址修改和标题修改
                data.shareImg = store.state.cachedView.shareImg
                data.shareTitleImg = store.state.cachedView.shareTitleImg
            }
        })

        // 初始化视频
        const initVideo = () => {
            const video = videoDom.value;
            let isVideoStart = false;
            video.setAttribute('x5-video-player-type', 'h5-page')

            const timeListener = () => {
                if (video.currentTime <= 0) return
                if (!isVideoStart) {
                    // commonHub.commit('videoStart')
                    isVideoStart = true
                    // setTimeout(() => {
                    //   data.showSkip = true
                    // }, 1000)
                }
            }
            video.addEventListener('timeupdate', timeListener);
            // data.videoPlayer = new MMD.VideoPlayer({
            //     videoElement: video,
            //     src: require('../../assets/media/intro0605.mp4'),
            //     loop: false,
            //     muted: false,
            //     poster: '../../assets/autoLoad/video_bg.jpg',
            //     tryMultipleVideoPlayAtTheSameTime: false,
            //     // timesParam: data.times,
            //     onTimes: (name) => {
            //         console.log(name);
            //     },
            //     onEnd: () => {

            //     }
            // })
        }
        const onStartAni = () => {
            gsap.fromTo(".m-end-book-now",
                {
                    scale: 0.7,
                },
                {
                    scale: 1,
                },
            );
            setTimeout(() => {
                alert("啊啊啊啊啊");
            }, 500)
        }
        onMounted(() => {
            // initVideo()
        })
        // const onPlayMusic = () => {
        //   data.playMusicShow = false;
        //   videoDom.value.muted = 100
        // }
        // const onPuseMusic = () => {
        //   data.playMusicShow = true;
        //   videoDom.value.muted = 0
        // }
        // 重新选择英雄
        const onReturnScene = () => {
            commonHub.commit('pageChange', 'scene')
        }
        // 查看邀请人 封面
        const onGoShare = (status) => {
            if (status) {
                gsap.fromTo(".m-end-invite-now",
                    {
                        scale: 0.7,
                    },
                    {
                        scale: 1,
                        onComplete: () => {
                            data.endHide = false
                        }
                    },
                )
                gsap.to(".m-share-bg", {
                    opacity: 1,
                    duration: 1,
                })
            } else {
                gsap.to(".m-share-bg", {
                    opacity: 1,
                    duration: 1,
                    onComplete: () => {
                        data.endHide = false
                    }
                })
            }

        }
        // 返回邀请人
        const onReturnEnd = () => {
            gsap.to(".m-share-bg", {
                opacity: 0,
                duration: 1,
            })
            data.endHide = true
        }
        const refs = toRefs(data);

        return {
            ...refs,
            onStartAni,
            data,
            onReturnScene,
            onGoShare,
            onReturnEnd
            // videoDom,
            // onPlayMusic,
            // onPuseMusic
        }
    }
}
</script>

<style lang="less" scoped>
@import './index.less';

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
    transition: all .5s;
}
</style>

