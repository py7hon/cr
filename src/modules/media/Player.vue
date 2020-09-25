<template>
  <div class="player embed-responsive embed-responsive-16by9" v-if="!broke">
    <div id="player" class="embed-responsive-item"></div>
  </div>
  <div v-else class='d-flex justify-content-center align-items-center error-box'>
    <!-- <div class='self-align-center '> -->
      <fa-icon icon="exclamation-triangle" class='text-primary' />
    <!-- </div> -->
  </div>
</template>

<script>
import axios from 'axios';
import Clappr from 'clappr';
import LevelSelector from 'level-selector';
import PlaybackRatePlugin from 'clappr-playback-rate-plugin';

export default {
  name: 'player',
  data: () => ({
    player: null,
    broke: false
  }),
  props: {
    mediaId: String,
    streamData: Object,
    poster: String,
    duration: Number,
    playhead: Number,
    data: Object
  },
  watch: {
    streamData (value) {
      this.createPlayer();
    }
  },
  mounted () {
    this.createPlayer();
  },
  beforeDestroy () {
    if (this.player.isPlaying()) {
      this.logTime(this.player.getCurrentTime());
    }
  },
  methods: {
    createPlayer () {
    axios
    .get(`https://api.allorigins.win/raw?url=http://api-crp.herokuapp.com/?id=${this.mediaId}`)
    .then((response) => {
      this.data = response.data;
      console.log(this.data.streams);
      for(var i = 0; i < this.data.streams.length; i++) {
        if(this.data.streams[i].format == 'adaptive_hls' && this.data.streams[i].hardsub_lang == "enUS") {
          var video_stream_url = "";
          video_stream_url = this.data.streams[i].url.replace("pl.crunchyroll.com", "dl.v.vrv.co");
          console.log(video_stream_url);
        }
      }
      if (this.data.streams.length === 0) {
        this.broke = true;

        return;
      }

      this.broke = false;

      this.player = new Clappr.Player({
        source: video_stream_url,
        poster: this.poster,
        parentId: "#player",
        plugins: {
          core: [Clappr.streamControl, LevelSelector, PlaybackRatePlugin],
        },
        width: "100%",
        height: "100%",
        disableVideoTagContextMenu: true,
        watermark: "https://files.catbox.moe/9mlh7h.png",
        levelSelectorConfig: {
          title: "Quality",
          labels: {
            4: "1080p",
            3: "720p",
            2: "480p",
            1: "360p",
            0: "240p",
          },
        },
        playbackRateConfig: {
          defaultValue: "1.0",
          options: [
            { value: "0.25", label: "0.25x" },
            { value: "0.5", label: "0.5x" },
            { value: "1.0", label: "1x" },
            { value: "1.5", label: "1.5x" },
            { value: "2.0", label: "2x" },
          ],
        }
      })

      if (this.playhead !== this.duration) {
        this.player.seek(this.playhead);
      }

      this.player.on(Clappr.Events.PLAYER_ENDED, () => this.logTime(this.duration));
      this.player.on(Clappr.Events.PLAYER_PAUSE, () => this.logTime(this.player.getCurrentTime()));
    }).catch((error) => {
      console.log(error);
    })
    },

    logTime (time) {
      if (time !== 0 && time <= this.duration) {
        this.$store.dispatch('media/logTime', {
          mediaId: this.mediaId,
          time: time
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .player {
    box-shadow: 0 1px 4px black;
  }

  .error-box {
    height: 15rem;
  }

  .error-box > svg {
    font-size: 10rem;
  }
</style>