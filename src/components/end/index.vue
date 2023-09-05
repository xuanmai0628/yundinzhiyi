<template>
    <div class="m-end" v-show="endShow" ref="cs">
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
        <div class="m-share-bg">
            <img class="m-share-img" :src="shareImg" alt="">
            <div class="m-share-info" :style="{ backgroundImage: `url(${shareTitleImg})` }"></div>
            <div class="m-share-return" @click="onReturnEnd"></div>
            <div class="m-share-user">
                <p>张三</p>
                <p>已加入{{ cityName }}城邦</p>
            </div>
            <div class="m-share-rank">
                已有<span>{{ 1 }}</span>弈士入驻{{ cityName }}城邦目前排名第<span>{{ 1 }}</span>
            </div>

            <div id="capture">
                <h1>我真的哭死</h1>
            </div>

            <div class="share-save-img" @touchstart="onDownStart" @touchend="onDownEnd"></div>
            <div class="share-friend" @click="onShowOverlay"></div>
            <div class="share-overlay" @click="onHideOverlay" v-show="overlayShow">
            </div>
            <div class="share-icon" v-show="overlayShow"></div>

        </div>
    </div>
</template>

<script>
import { onMounted, ref, reactive, toRefs } from 'vue'
import { commonHub } from '@/utils/commonHub.js'
import { MMD } from '../../../public/ossweb-img/lib/mmd.videoplayer.min.1.0.1';
import { gsap } from 'gsap';
import { useStore } from 'vuex'
// import { ImageResource } from 'pixi.js';
import html2canvas from 'html2canvas'
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
            shareTitleImg: null,
            overlayShow: false,
            // 下载图片的
            timer: null,
            lock: 1
        })

        let cs = ref()
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
        //分享好友
        const onShowOverlay = () => {
            data.overlayShow = true
            gsap.to(".share-overlay",
                {
                    opacity: 0.8,
                }
            );
        }
        const onHideOverlay = () => {
            data.overlayShow = false
            gsap.to(".share-overlay",
                {
                    opacity: 0,
                }
            );
        };

        const onDownStart = () => {
            //手指触摸
            clearTimeout(data.timer); //再次清空定时器，防止重复注册定时器
            data.timer = setTimeout(() => {
                downloadIamge();
            }, 1000);
        }
        const onDownEnd = () => {
            //手指离开
            clearTimeout(data.timer);
        }

        const downloadIamge = () => {
            console.log('调用函数');
            //下载图片地址和图片名
            html2canvas(document.querySelector('#capture')).then((canvas) => {
                if (data.lock) {

                    console.log('执行添加', canvas);

                    cs.value.appendChild(canvas);
                    data.lock = 0;
                }
            });



            // let image = new Image();
            // // 解决跨域 Canvas 污染问题
            // image.setAttribute("crossOrigin", "anonymous");
            // image.onload = () => {
            //     console.log('到下载这步了');
            //     let canvas = document.createElement("canvas");
            //     canvas.width = image.width;
            //     canvas.height = image.height;
            //     let context = canvas.getContext("2d");
            //     context.drawImage(image, 0, 0, image.width, image.height);
            //     let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
            //     let a = document.createElement("a"); // 生成一个a元素
            //     let event = new MouseEvent("click"); // 创建一个单击事件
            //     a.download = name || "photo"; // 设置图片名称
            //     a.href = url; // 将生成的URL设置为a.href属性
            //     a.dispatchEvent(event); // 触发a的单击事件
            // };
            // image.src = imgsrc;
        }

        const refs = toRefs(data);

        return {
            ...refs,
            onStartAni,
            data,
            onReturnScene,
            onGoShare,
            onReturnEnd,
            onShowOverlay,
            onHideOverlay,
            onDownStart,
            onDownEnd,
            cs
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

