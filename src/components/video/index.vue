<template>
    <div class="m-video">
        <div v-show="showSkip" class="btn-skip" @click="showSkipBtn">
            跳过
            <img src="../../assets/delayLoad/btn_popup_close.png" alt="">
        </div>
        <!-- 音乐 -->
        <div class="play-music">
            <img src="../../assets//autoLoad/audio_play.png" alt="" v-show="playMusicShow" @touchstart="onPlayMusic">
            <img src="../../assets//autoLoad/audio_puse.png" alt="" v-show="!playMusicShow" @touchstart="onPuseMusic">
        </div>
        <video ref="videoDom" class="video" />
    </div>
</template>

<script>
import { onMounted, ref, reactive, toRefs } from 'vue'
import { commonHub } from '@/utils/commonHub.js'
import { MMD } from '../../../public/ossweb-img/lib/mmd.videoplayer.min.1.0.1'
export default {
    setup() {
        const videoDom = ref(null)
        const data = reactive({
            videoPlayer: null,
            playMusicShow: true,
            showSkip: false
        })
        commonHub.on('pageChange', (pageName) => {
            console.log('传过来的名称video', pageName)
            if (pageName === 'video') {
                data.videoPlayer.play()
                videoDom.value.play()
            }
        })
        // 跳过
        const showSkipBtn = () => {
            data.showSkip = false;
            data.videoPlayer.stopLoad()
            commonHub.commit('pageChange', 'scene')
        }

        // 初始化视频
        const initVideo = () => {
            const video = videoDom.value;
            let isVideoStart = false;
            video.setAttribute('x5-video-player-type', 'h5-page')

            const timeListener = () => {
                if (video.currentTime <= 0) return
                // 到18秒就跳 后面有些多余片段
                if (video.currentTime >= 19) {
                    data.videoPlayer.stopLoad()
                    commonHub.commit('pageChange', 'scene')
                }
                if (!isVideoStart) {
                    commonHub.commit('videoStart')
                    isVideoStart = true
                    setTimeout(() => {
                        data.showSkip = true
                    }, 1000)
                }
            }
            video.addEventListener('timeupdate', timeListener);
            data.videoPlayer = new MMD.VideoPlayer({
                videoElement: video,
                src: require('../../assets/media/intro0605.mp4'),
                loop: false,
                muted: false,
                poster: '../../assets/autoLoad/video_bg.jpg',
                tryMultipleVideoPlayAtTheSameTime: false,
                onTimes: (name) => {
                },
                onEnd: () => {

                }
            })
        }

        onMounted(() => {
            initVideo()
        })
        const onPlayMusic = () => {
            data.playMusicShow = false;
            videoDom.value.muted = 100
        }
        const onPuseMusic = () => {
            data.playMusicShow = true;
            videoDom.value.muted = 0
        }
        const refs = toRefs(data);

        return {
            ...refs,
            videoDom,
            showSkipBtn,
            onPlayMusic,
            onPuseMusic
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
    transition: all .1s;
}
</style>
