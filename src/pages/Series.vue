<template>
  <div v-if="series && series.series_id == seriesId">
    <div class="header mb-3">
      <div class="header-image" :style="{'background-image': `url('${$https(series.landscape_image.full_url)}')`}"></div>
      <div class="header-gradient"><div class="container"><div class="row"><h2 class="text-light col-9">{{series.name}}</h2></div></div></div>
    </div>

    <div class="container">
      <div class="row mb-3">
        <div class="col-md-9 col-12 info-block">
          <p class="text-light">{{series.description}}</p>

          <div class="mb-2">
            <router-link v-for="genre in series.genres" :key="genre" :to="`/browse/categories/${series.media_type}/${genre}`" class="btn btn-secondary btn-sm mr-1">{{genre}}</router-link>
          </div>

          <toggle-queue-button @toggle="onQueueToggle" :seriesId="series.series_id" :inQueue="series.in_queue" />
          <toggle-watched-button :mediaList="mediaList" @complete="onWatchedToggle" />

          <span class="float-right">
            <a class="kitsu-link" v-if="kitsuPage" :href="kitsuPage" target="_blank" />
            <rating :rating="series.rating" />
          </span>
        </div>

        <div class="col-3 d-none d-md-block">
          <img class="img-fluid mx-auto d-block box-image" v-if="series.portrait_image" :src="$https(series.portrait_image.large_url)" />
        </div>
      </div>

      <div v-if="!collectionsLoading">
        <collection v-for="(collection, index) in mediaCollections" :key="collection.id" :collection="collection" :open="index == 0" />
      </div>
      <loading v-else />
    </div>
  </div>

  <loading v-else />
</template>

<script>
import Collection from 'modules/media/Collection'
import Loading from 'modules/shared/Loading'
import ToggleQueueButton from 'modules/media/ToggleQueueButton'
import ToggleWatchedButton from 'modules/media/ToggleSeriesWatchedButton'
import Rating from 'modules/media/Rating'

export default {
  name: 'series',
  mounted () {
    this.$store.dispatch('media/getSeries', this.seriesId)
  },
  data: () => ({
    collectionsLoading: false
  }),
  computed: {
    series () {
      return this.$store.state.media.currentSeries
    },
    kitsuPage () {
      return this.$store.state.media.currentSeriesKitsuPage
    },
    mediaCollections () {
      const collections = []
      for (const media of this.$store.state.media.mediaList) {
        if (!collections.find(collection => collection.id === media.collection_id)) {
          const collection = {}
          collection.id = media.collection_id
          collection.name = media.collection_name
          collection.media = []
          collections.push(collection)
        }

        collections.find(collection => collection.id === media.collection_id).media.push(media)
      }
      return collections
    },
    seriesId () {
      return this.$route.params.id
    },
    locale () {
      return this.$store.state.locale.locale
    },
    mediaList () {
      return this.$store.state.media.mediaList
    }
  },
  components: {
    Collection,
    Loading,
    ToggleQueueButton,
    ToggleWatchedButton,
    Rating
  },
  watch: {
    series (value) {
      this.collectionsLoading = true

      this.$store.dispatch('media/listMedia', {
        seriesId: this.seriesId,
        count: this.series.media_count
      })
        .then(() => {
          this.collectionsLoading = false
        })

      document.title = `${this.series.name} ― CR`
    },
    seriesId () {
      this.$store.dispatch('media/getSeries', this.seriesId)
    },
    locale () {
      this.$store.dispatch('media/getSeries', this.seriesId)
    }
  },
  methods: {
    onQueueToggle (endLoading) {
      this.$store.dispatch('media/getSeries', this.seriesId)
        .then(() => {
          endLoading()
        })
    },
    onWatchedToggle () {
      this.collectionsLoading = true

      this.$store.dispatch('media/listMedia', {
        seriesId: this.seriesId,
        count: this.series.media_count
      })
        .then(() => {
          this.collectionsLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'scss/_variables';

  .header {
    position: relative;
    overflow: hidden;
    margin-top: -1.5rem;
    border-bottom: 1px solid $primary;

    .header-gradient {
      background: rgb(0,0,0);
      background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 90%);
      width: 100%;
      position: absolute;
      bottom: 0;
      padding-top: 1rem;

      h2 {
        padding: 0 10px;
        text-shadow: 1px 1px 2px black;
        font-weight: bold;
      }
    }
  }

  .header-image {
    filter: blur(4px);
    width: 100%;
    height: 15rem;
    background-size: cover;
    background-position: center;
  }

  .box-image {
    margin-top: -10rem;
    box-shadow: 0 1px 4px black;
    border-radius: 4px;
  }

  .info-block {
    background: $dark;
    padding: 0.5rem 1rem;
    border-radius: 0.2rem;
    box-shadow: 0 1px 2px black;
  }

  .kitsu-link {
    background: url('~images/kitsu.svg');
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background-size: cover;
    margin: -0.5rem 0;
  }
</style>
