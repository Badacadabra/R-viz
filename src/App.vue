<template>
  <ion-app>
    <ion-split-pane content-id="main">
      <ion-menu side="start" content-id="main">
        <ion-header>
          <ion-toolbar color="secondary">
            <ion-title>Catalogue de données</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list id="menu">
            <ion-item button @click="() => router.push('/atmo')">
              <ion-icon :icon="ellipseOutline" slot="start" size="large"></ion-icon>
              <ion-label>Indice ATMO</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/previsions')">
              <ion-icon :icon="layersOutline" slot="start" size="large"></ion-icon>
              <ion-label>Prévisions détaillées</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/pollens')">
              <ion-icon :icon="flowerOutline" slot="start" size="large"></ion-icon>
              <ion-label>Indice pollinique</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/mesures')">
              <ion-icon :icon="analyticsOutline" slot="start" size="large"></ion-icon>
              <ion-label>Mesures aux stations</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/episodes')">
              <ion-icon :icon="warningOutline" slot="start" size="large"></ion-icon>
              <ion-label>Épisodes de pollution</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/exposition')">
              <ion-icon :icon="bodyOutline" slot="start" size="large"></ion-icon>
              <ion-label>Exposition des populations</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/emissions')">
              <ion-icon :icon="cloudyOutline" slot="start" size="large"></ion-icon>
              <ion-label>Émissions polluantes</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/cartes')">
              <ion-icon :icon="mapOutline" slot="start" size="large"></ion-icon>
              <ion-label>Cartes annuelles</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/microcapteurs')">
              <ion-icon :icon="pulseOutline" slot="start" size="large"></ion-icon>
              <ion-label>Microcapteurs</ion-label>
            </ion-item>
            <ion-item button @click="() => router.push('/nuisances')">
              <ion-icon :icon="flagOutline" slot="start" size="large"></ion-icon>
              <ion-label>Signalements de nuisances</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main"></ion-router-outlet>
      <ion-menu side="end" content-id="main">
        <ion-header>
          <ion-toolbar color="secondary">
            <ion-title>Catalogue de services</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-card class="services" href="https://api.atmosud.org" target="_blank">
            <ion-img src="/app/assets/img/api.png"></ion-img>
            <ion-card-header>
              <ion-card-title>APIs</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              APIs d'AtmoSud à destination des développeurs
            </ion-card-content>
          </ion-card>
          <ion-card class="services" href="https://opendata.atmosud.org" target="_blank">
            <ion-img src="/app/assets/img/open-data.png"></ion-img>
            <ion-card-header>
              <ion-card-title>Open Data</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              Données d'AtmoSud dans des formats normalisés
            </ion-card-content>
          </ion-card>
          <ion-card class="services" href="https://cigale.atmosud.org/" target="_blank">
            <ion-img src="/app/assets/img/cigale.png"></ion-img>
            <ion-card-header>
              <ion-card-title>CIGALE</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              Inventaires géolocalisés air-climat-énergie en Région Sud
            </ion-card-content>
          </ion-card>
          <ion-card class="services" href="https://www.signalair.eu/fr/" target="_blank">
            <ion-img src="/app/assets/img/signalair.png"></ion-img>
            <ion-card-header>
              <ion-card-title>SignalAir</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              Application de signalement des nuisances
            </ion-card-content>
          </ion-card>
        </ion-content>
      </ion-menu>
    </ion-split-pane>
  </ion-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonImg } from '@ionic/vue';
import { warningOutline, bodyOutline, flowerOutline, analyticsOutline, layersOutline, cloudyOutline, ellipseOutline, flagOutline, mapOutline, pulseOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonImg
  },
  setup() {
    const router = useRouter();

    return {
      router,
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
@media screen and (max-width: 992px) {
  ion-menu {
    display: none;
  }
}
</style>
