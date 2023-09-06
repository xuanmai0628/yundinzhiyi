<template>
    <div class="m-scene" v-show="sceneShow">
        <div class="bg public-class" v-show="cityListShow">
        </div>
        <div v-show="cityListShow" class="scene-spr-ani">
            <div class="scene-tips"></div>

        </div>
        <div></div>
        <div class="city-list-swiper" :style="currentCover">
            <div v-show="cityListShow" class="city-list-item" v-for="item in imgArr" :key="item.id" @click="onGoCity(item)">
                <img class="cover" :src="item.coverSrc" alt="显示不出来">
                <img class="name" :src="item.nameSrc" alt="" :style="item.position">
            </div>
        </div>

        <!-- 地址内页 -->
        <div v-show="cityPageShow" class="city-page">
            <div class="city-message" :style="currentInfo">

            </div>
            <img class="city-text" :src="currentText" alt="">
            <div class="city-return-btn">
                <div class="city-return-left city-btn" @click="onReturnCityList">
                </div>
                <div class="city-join-right city-btn" @click="onGoEnd">
                </div>
                <div class="city-ani-btn"></div>
            </div>
        </div>

        <div class="play-music">
            <img src="../../assets//autoLoad/audio_play.png" alt="" v-show="playMusicShow" @touchstart="onPlayMusic">
            <img src="../../assets//autoLoad/audio_puse.png" alt="" v-show="!playMusicShow" @touchstart="onPauseMusic">
        </div>

        <video ref="videoDom" class="video public-class" />
        <audio ref="audioDom" loop :src="audioSrcAlways"></audio>
        <audio ref="audioSrcDom" :src="audioSrc"></audio>

    </div>
</template>

<script>
import './index.less';
import { ref, onMounted, reactive, toRefs } from 'vue';
import { commonHub } from '@/utils/commonHub.js'
import { MMD } from '../../../public/ossweb-img/lib/mmd.videoplayer.min.1.0.1';
import { useStore } from 'vuex'

export default {
    components: {

    },
    setup() {
        const store = useStore()
        const videoDom = ref(null);
        const audioDom = ref(null);
        const audioSrcDom = ref(null);

        const data = reactive({
            sceneShow: true,
            videoPlayer: null,
            playMusicShow: true,
            showSkip: false,
            currentCover: null,
            // 点击后隐藏轮播地址
            cityListShow: true,
            cityPageShow: false,
            // 当前选择角色的info信息
            currentInfo: null,
            currentText: null,
            //音频
            audioSrc: require("../../assets/media/bgm.mp3"),
            audioSrcAlways: require("../../assets/media/bgm.mp3")
        })

        // 地址列表数据
        const imgArr = ref([
            {
                id: 0,
                name: '德玛西亚',
                coverSrc: require("../../assets/autoLoad/city_dmxy.jpg"),
                nameSrc: require('../../assets/autoLoad/name_dmxy.png'),
                position: "right:0;bottom:10%;",
                videoSrc: require('../../assets/media/dmxy_video.mp4'),
                infoSrc: require('../../assets/autoLoad/city_info_dmxy.png'),
                textSrc: require('../../assets/autoLoad/city_text_dmxy.png'),
                audioSrc: require('../../assets/media/dmxy.mp3'),
                shareImg: require("../../assets/delayLoad/end_pop_dmxy.jpg"),
                shareTitleImg: require("../../assets/delayLoad/end_dmxy_title.png"),
                shareBgImg: require("../../assets/autoLoad/share_bg_dmxy.jpg")
            },
            {
                id: 1,
                name: '艾欧尼亚',
                coverSrc: require("../../assets//autoLoad/city_aony.jpg"),
                nameSrc: require('../../assets/autoLoad/name_aony.png'),
                position: "left:0;bottom:10%;",
                videoSrc: require('../../assets/media/aony_video.mp4'),
                infoSrc: require('../../assets/autoLoad/city_info_aony.png'),
                textSrc: require('../../assets/autoLoad/city_text_aony.png'),
                audioSrc: require('../../assets/media/aony.mp3'),
                shareImg: require("../../assets/delayLoad/end_pop_aony.jpg"),
                shareTitleImg: require("../../assets/delayLoad/end_aony_title.png"),
                shareBgImg: require("../../assets/autoLoad/share_bg_aony.jpg")
            },
            {
                id: 2,
                name: '祖安',
                coverSrc: require("../../assets/autoLoad/city_za.jpg"),
                nameSrc: require('../../assets/autoLoad/name_za.png'),
                position: "right:0;top:10%;",
                videoSrc: require('../../assets/media/za_video.mp4'),
                infoSrc: require('../../assets/autoLoad/city_info_za.png'),
                textSrc: require('../../assets/autoLoad/city_text_za.png'),
                audioSrc: require('../../assets/media/za.mp3'),
                shareImg: require("../../assets/delayLoad/end_pop_za.jpg"),
                shareTitleImg: require("../../assets/delayLoad/end_za_title.png"),
                shareBgImg: require("../../assets/autoLoad/share_bg_za.jpg")
            },
            {
                id: 3,
                name: "诺克萨斯",
                coverSrc: require("../../assets/autoLoad/city_nkss.jpg"),
                nameSrc: require('../../assets/autoLoad/name_nkss.png'),
                position: "left:0;top:10%;",
                videoSrc: require('../../assets/media/nkss_video.mp4'),
                infoSrc: require('../../assets/autoLoad/city_info_nkss.png'),
                textSrc: require('../../assets/autoLoad/city_text_nkss.png'),
                audioSrc: require('../../assets/media/nkss.mp3'),
                shareImg: require("../../assets/delayLoad/end_pop_nkss.jpg"),
                shareTitleImg: require("../../assets/delayLoad/end_nkss_title.png"),
                shareBgImg: require("../../assets/autoLoad/share_bg_nkss.jpg")
            },
        ]);

        const initVideo = () => {
            const video = videoDom.value;
            let isVideoStart = false;
            video.setAttribute('x5-video-player-type', 'h5-page')
            commonHub.on('pageChange', (pageName) => {
                console.log('scene页面接收名称', pageName);
                if (pageName === 'scene') {
                    onReturnCityList();
                    audioDom.value.play();
                    store.state.cachedView.audioDomBgm = audioDom.value;
                    //end页如果静音 那就设置图标为静音
                    data.playMusicShow = store.state.cachedView.MusicShow
                }
            })

            const timeListener = () => {
                // console.log('当前时间==>', video.currentTime);
                let timer = Math.round(video.currentTime);
                // console.log('当前时间取整==>', timer);
                if (video.currentTime <= 0) return;

                // 重复播放
                if (timer >= 9) {
                    videoDom.value.currentTime = 3.8;
                }

                if (!isVideoStart) {
                    commonHub.commit('videoStart')
                    isVideoStart = true;
                }

                if (video.currentTime > 1) {
                    // 隐藏轮播相关内容
                    data.cityListShow = false;
                }

                // 判断内页的东西显示和隐藏
                if (video.currentTime > 3) {
                    // 让内页内容显示
                    data.cityPageShow = true;
                }
            }
            video.addEventListener('timeupdate', timeListener)
            data.videoPlayer = new MMD.VideoPlayer({
                videoElement: video,
                // 定义变量 修改播放链接
                src: null,
                loop: true,
                muted: false,
                poster: '../../assets/autoLoad/city_aony.jpg',
                tryMultipleVideoPlayAtTheSameTime: false,
                timesParam: data.times,
                onTimes: (name) => {
                },
                onStart: () => {
                }
            })
        }
        const onGoCity = (item) => {
            // console.log('当前点击的视频链接', item.videoSrc);
            data.videoPlayer.src = item.videoSrc;
            // 播放当前视频
            data.videoPlayer.play();
            videoDom.value.play();
            // 设置当前封面
            data.currentCover = `background: url(${item.coverSrc}) 0 / cover no-repeat;`;
            data.currentInfo = `background: url(${item.infoSrc}) 0 / cover no-repeat;`;
            data.currentText = item.textSrc;
            store.state.cachedView.name = item.name;
            store.state.cachedView.shareImg = item.shareImg;
            store.state.cachedView.shareTitleImg = item.shareTitleImg;
            store.state.cachedView.shareBgImg = item.shareBgImg;

            // 设置音频
            data.audioSrc = item.audioSrc
            setTimeout(() => {
                audioSrcDom.value.play();
            }, 3500)
            setTimeout(()=>{
                audioDom.value.play();
            },8000)
        };
        // 开关音量音乐
        const onPlayMusic = () => {
            data.playMusicShow = false;
            videoDom.value.muted = 100;
            audioDom.value.muted = 100;
            audioSrcDom.value.muted = 100;

        }
        const onPauseMusic = () => {
            data.playMusicShow = true;
            videoDom.value.muted = 0;
            audioDom.value.muted = 0;
            audioSrcDom.value.muted = 0;

        }
        // 返回重新选择
        const onReturnCityList = () => {
            data.cityListShow = true;
            data.cityPageShow = false;
            data.videoPlayer.stopLoad();
            audioSrcDom.value.pause();
        }

        // 去落版页
        const onGoEnd = () => {
            commonHub.commit('pageChange', 'end');

        }
        onMounted(() => {
            initVideo();

        });

        const refs = toRefs(data);
        return {
            ...refs,
            imgArr,
            videoDom,
            audioDom,
            audioSrcDom,
            onGoCity,
            onReturnCityList,
            onGoEnd,
            onPlayMusic,
            onPauseMusic
        }
    }

}
</script>

<style lang="less" scoped>
@import './index.less';
</style>

