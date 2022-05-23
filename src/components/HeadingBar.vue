<template>
  <ion-header>
    <ion-toolbar color="primary">
      <ion-buttons slot="start" v-show="back">
        <ion-back-button default-href="accueil" text=""></ion-back-button>
      </ion-buttons>
      <ion-title>{{ title }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="showAbout()">
          <ion-icon :icon="informationCircleOutline" color="tertiary"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-modal :is-open="isModalOpened" class="main-modal">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>À propos</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="hideAbout()">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content color="light" :fullscreen="true">
      <ion-img class="logo" src="/app/assets/img/logo-atmosud.png" alt="Logo d'AtmoSud"></ion-img>
      <ion-card>
        <ion-card-header>
          <ion-card-title>C'est quoi, R-viz ?</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          R-viz est une application de visualisation de données relatives à la qualité de l'air en Région Sud Provence-Alpes-Côte d'Azur. Développée par <strong>AtmoSud</strong>, cette application vous permet de visualiser, avec un ensemble de cartes et de graphes, des données utiles sur tout le territoire : l'indice ATMO, les prévisions détaillées, l'indice pollinique, les mesures aux stations, les épisodes de pollution, l'exposition des populations, les émissions de polluants, les cartes annuelles, les microcapteurs et les signalements de nuisances.
        </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Qui est AtmoSud ?</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          AtmoSud est l'association agréée de surveillance de la qualité de l'air (AASQA) en Région Sud Provence-Alpes-Côte d'Azur. Nos missions : surveiller et informer.
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonHeader, IonTitle, IonToolbar, IonButton, IonBackButton, IonButtons, IonIcon, IonModal, IonContent, IonImg, IonCard, IonCardHeader, IonCardContent, IonCardTitle } from '@ionic/vue';
import { informationCircleOutline, close } from 'ionicons/icons';

interface myData {
  isModalOpened: boolean;
}

export default defineComponent({
  name: 'HeadingBar',
  props: {
    title: String,
    back: Boolean
  },
  components: {
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonBackButton,
    IonButtons,
    IonIcon,
    IonModal,
    IonContent,
    IonImg,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle
  },
  data(): myData {
    return {
      isModalOpened: false
    };
  },
  methods: {
    showAbout(): void {
      this.isModalOpened = true;
    },
    hideAbout(): void {
      this.isModalOpened = false;
    }
  },
  setup() {
    return {
      informationCircleOutline,
      close
    };
  }
});
</script>

<style scoped>
/* .toolbar-container {
  background: linear-gradient(130deg, #245aa6, 70%, #21b3e8 90%);
} */

.logo::part(image) {
  width: inherit;
  padding: 20px;
  margin: auto;
}
</style>
