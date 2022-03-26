<template>
  <ion-page>
    <HeadingBar title="Accueil" :back="false" />
    <ion-content color="light" :fullscreen="true">
      <ion-text>
        <h2>Catalogue de données</h2>
      </ion-text>
      <ion-list id="menu">
        <ion-item href="/atmo">
          <ion-icon :icon="ellipseOutline" slot="start" size="large"></ion-icon>
          <ion-label>Indice ATMO</ion-label>
        </ion-item>
        <ion-item href="/previsions">
          <ion-icon :icon="layersOutline" slot="start" size="large"></ion-icon>
          <ion-label>Prévisions détaillées</ion-label>
        </ion-item>
        <ion-item href="/pollens">
          <ion-icon :icon="flowerOutline" slot="start" size="large"></ion-icon>
          <ion-label>Indice pollinique</ion-label>
        </ion-item>
        <ion-item href="/mesures">
          <ion-icon :icon="analyticsOutline" slot="start" size="large"></ion-icon>
          <ion-label>Mesures aux stations</ion-label>
        </ion-item>
        <ion-item href="/episodes">
          <ion-icon :icon="warningOutline" slot="start" size="large"></ion-icon>
          <ion-label>Épisodes de pollution</ion-label>
        </ion-item>
        <ion-item href="/exposition">
          <ion-icon :icon="bodyOutline" slot="start" size="large"></ion-icon>
          <ion-label>Exposition des populations</ion-label>
        </ion-item>
        <ion-item href="/emissions">
          <ion-icon :icon="cloudyOutline" slot="start" size="large"></ion-icon>
          <ion-label>Émissions polluantes</ion-label>
        </ion-item>
        <ion-item href="/cartes">
          <ion-icon :icon="mapOutline" slot="start" size="large"></ion-icon>
          <ion-label>Cartes annuelles</ion-label>
        </ion-item>
        <ion-item href="/microcapteurs">
          <ion-icon :icon="pulseOutline" slot="start" size="large"></ion-icon>
          <ion-label>Microcapteurs</ion-label>
        </ion-item>
        <ion-item href="/nuisances">
          <ion-icon :icon="flagOutline" slot="start" size="large"></ion-icon>
          <ion-label>Signalements de nuisances</ion-label>
        </ion-item>
      </ion-list>
      <ion-text>
        <h2>Catalogue de services</h2>
      </ion-text>
      <swiper :modules="modules" :pagination="true" :slides-per-view="1.5">
        <swiper-slide>
          <ion-card class="services" @click="showWebPage('https://api.atmosud.org')">
            <ion-img src="/assets/img/api.png"></ion-img>
            <ion-card-header>
              <ion-card-title>APIs</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              APIs d'AtmoSud à destination des développeurs
            </ion-card-content>
          </ion-card>
        </swiper-slide>
        <swiper-slide>
          <ion-card class="services" @click="showWebPage('https://opendata.atmosud.org')">
            <ion-img src="/assets/img/open-data.png"></ion-img>
            <ion-card-header>
              <ion-card-title>Open Data</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              Données d'AtmoSud dans des formats normalisés
            </ion-card-content>
          </ion-card>
        </swiper-slide>
        <swiper-slide>
          <ion-card class="services" @click="showWebPage('https://cigale.atmosud.org/')">
            <ion-img src="/assets/img/cigale.png"></ion-img>
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
            <ion-img src="/assets/img/signalair.png"></ion-img>
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
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonCard, IonItem, IonIcon, IonLabel } from '@ionic/vue';
import { warningOutline, bodyOutline, flowerOutline, analyticsOutline, layersOutline, cloudyOutline, ellipseOutline, flagOutline, mapOutline, pulseOutline } from 'ionicons/icons';
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
.ios ion-list + ion-text h2 {
  margin-bottom: -5px;
}
</style>
