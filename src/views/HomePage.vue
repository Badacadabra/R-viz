<template>
  <ion-page>
    <HeadingBar title="Accueil" :back="false" />
    <ion-content color="light" :fullscreen="true" class="hidden-lg-xl">
      <ion-text>
        <h2>Catalogue de données</h2>
      </ion-text>
      <ion-list id="menu">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item button router-link="/atmo">
                <ion-icon :icon="ellipseOutline" slot="start" size="large"></ion-icon>
                <ion-label>Indice ATMO</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item button router-link="/previsions">
                <ion-icon :icon="layersOutline" slot="start" size="large"></ion-icon>
                <ion-label>Prévisions détaillées</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item button router-link="/pollens">
                <ion-icon :icon="flowerOutline" slot="start" size="large"></ion-icon>
                <ion-label>Indice pollinique</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item button router-link="/mesures">
                <ion-icon :icon="analyticsOutline" slot="start" size="large"></ion-icon>
                <ion-label>Mesures aux stations</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item button router-link="/episodes">
                <ion-icon :icon="warningOutline" slot="start" size="large"></ion-icon>
                <ion-label>Épisodes de pollution</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item button router-link="/cartes">
                <ion-icon :icon="mapOutline" slot="start" size="large"></ion-icon>
                <ion-label>Cartes annuelles</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item button router-link="/exposition">
                <ion-icon :icon="bodyOutline" slot="start" size="large"></ion-icon>
                <ion-label>Exposition des populations</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item button router-link="/emissions">
                <ion-icon :icon="cloudyOutline" slot="start" size="large"></ion-icon>
                <ion-label>Émissions polluantes</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item button router-link="/microcapteurs">
                <ion-icon :icon="pulseOutline" slot="start" size="large"></ion-icon>
                <ion-label>Microcapteurs</ion-label>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item button router-link="/nuisances">
                <ion-icon :icon="flagOutline" slot="start" size="large"></ion-icon>
                <ion-label>Signalements de nuisances</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-list>
      <ion-text>
        <h2>Catalogue de services</h2>
      </ion-text>
      <swiper :modules="modules" :pagination="true" :slides-per-view="1.5">
        <swiper-slide>
          <ion-card class="services" @click="showWebPage('https://api.atmosud.org')">
            <ion-img src="/app/assets/img/api.png"></ion-img>
            <ion-card-header>
              <ion-card-title>APIs</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              APIs d'AtmoSud à destination des développeurs
            </ion-card-content>
          </ion-card>
        </swiper-slide>
        <swiper-slide>
          <ion-card class="services" @click="showWebPage('https://cigale.atmosud.org/')">
            <ion-img src="/app/assets/img/cigale.png"></ion-img>
            <ion-card-header>
              <ion-card-title>CIGALE</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              Inventaires géolocalisés air-climat-énergie en Région Sud
            </ion-card-content>
          </ion-card>
        </swiper-slide>
        <swiper-slide>
          <ion-card class="services" @click="showWebPage('https://www.signalair.eu/fr/')">
            <ion-img src="/app/assets/img/signalair.png"></ion-img>
            <ion-card-header>
              <ion-card-title>SignalAir</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              Application de signalement des nuisances
            </ion-card-content>
          </ion-card>
        </swiper-slide>
      </swiper>
    </ion-content>
    <ion-content color="light" class="hidden-sm-md">
      <ion-icon id="home-icon" :icon="home"></ion-icon>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonCard, IonItem, IonIcon, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { home, warningOutline, bodyOutline, flowerOutline, analyticsOutline, layersOutline, cloudyOutline, ellipseOutline, flagOutline, mapOutline, pulseOutline } from 'ionicons/icons';
import { Browser } from '@capacitor/browser';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import '@ionic/vue/css/ionic-swiper.css';
import HeadingBar from '@/components/HeadingBar.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    IonContent,
    IonPage,
    IonCard,
    IonItem,
    IonIcon,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    Swiper,
    SwiperSlide,
    HeadingBar
  },
  methods: {
    async showWebPage(url: string) {
      await Browser.open({ url });
    }
  },
  setup() {
    return {
      modules: [Pagination],
      home,
      warningOutline,
      bodyOutline,
      flowerOutline,
      analyticsOutline,
      layersOutline,
      cloudyOutline,
      ellipseOutline,
      flagOutline,
      mapOutline,
      pulseOutline
    };
  }
});
</script>

<style>
.swiper {
  padding-bottom: 12px;
}

.swiper-horizontal > .swiper-pagination-bullets, .swiper-pagination-bullets.swiper-pagination-horizontal, .swiper-pagination-custom, .swiper-pagination-fraction {
  bottom: 0;
}

.ios .swiper {
  padding-bottom: 0;
}

#menu ion-icon {
  color: var(--ion-color-secondary);
}
</style>

<style scoped>
#home-icon {
  color: white;
  width: 50%;
  height: 100%;
  display: block;
  margin: auto;
}

.ios ion-list + ion-text h2 {
  margin-bottom: -5px;
}

ion-grid, ion-col {
  padding: 0;
}

@media (min-width: 992px) {
  .hidden-lg-xl {
    display: none;
  }
}

@media (max-width: 992px) {
  .hidden-sm-md {
    display: none;
  }
}
</style>
