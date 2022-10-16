<template>
  <ion-page>
    <HeadingBar title="Cartes annuelles" :back="true" />
    <ion-content color="light" :fullscreen="true">
      <ion-range v-model="selectedYear" :min="2012" :max="new Date().getFullYear() - 1" step="1" ticks="true" snaps="true" :pin="true" color="secondary">
        <ion-icon :icon="calendarOutline" size="small" slot="start"></ion-icon>
        <ion-icon :icon="calendarOutline" slot="end"></ion-icon>
      </ion-range>
      <ion-button expand="block" color="secondary" @click="acceptYear()">Visualiser les cartes de {{ selectedYear }}</ion-button>
      <AnnualMap :year="acceptedYear" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonRange, IonIcon, IonButton } from '@ionic/vue';
import { calendarOutline } from 'ionicons/icons';
import HeadingBar from '@/components/HeadingBar.vue';
import AnnualMap from '@/components/AnnualMap.vue';

interface myData {
  selectedYear: string;
  acceptedYear: string;
}

export default defineComponent({
  name: 'AnnualMapsPage',
  components: {
    IonContent,
    IonPage,
    IonRange,
    IonIcon,
    IonButton,
    HeadingBar,
    AnnualMap
  },
  data(): myData {
    return {
      selectedYear: (new Date().getFullYear() - 1) + '',
      acceptedYear: (new Date().getFullYear() - 1) + ''
    };
  },
  methods: {
    acceptYear(): void {
      this.acceptedYear = this.selectedYear;
    }
  },
  setup() {
    return {
      calendarOutline
    }
  }
});
</script>

<style scoped>
.ios ion-range::part(pin) {
  transform: translate3d(0px, 7px, 0px) scale(1);
}

ion-range::part(pin) {
  font-size: 10px;
  transform: translate3d(0px, -24px, 0px) scale(1);
}

ion-range {
  padding-bottom: 0;
}

ion-button {
  width: 90%;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
}
</style>
