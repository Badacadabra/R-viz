<template>
  <ion-page>
    <HeadingBar title="Nuisances" :back="true" />
    <ion-content color="light" :scroll-y="false" :fullscreen="true">
      <img id="signalair" src="/assets/img/logo-signalair.png">
      <div id="buttons">
        <ion-button id="open-start-modal" color="secondary" fill="outline">
          <ion-icon slot="start" :icon="calendarOutline"></ion-icon>
          Date de début
        </ion-button>
        <ion-modal trigger="open-start-modal">
          <ion-content force-overscroll="false">
            <ion-datetime presentation="date" :max="endDate" v-model="startDate"></ion-datetime>
          </ion-content>
        </ion-modal>
        <ion-button id="open-end-modal" color="secondary" fill="outline">
          <ion-icon slot="start" :icon="calendarOutline"></ion-icon>
          Date de fin
        </ion-button>
        <ion-modal trigger="open-end-modal">
          <ion-content force-overscroll="false">
            <ion-datetime presentation="date" :min="startDate" :max="today()" v-model="endDate"></ion-datetime>
          </ion-content>
        </ion-modal>
      </div>
      <p id="period">Du <strong>{{ formatStartDate }}</strong> au <strong>{{ formatEndDate }}</strong></p>
      <div id="legend">
        <figure>
          <img src="/assets/img/odeur.png" alt="Odeur">
          <figcaption>Odeur</figcaption>
        </figure>
        <figure>
          <img src="/assets/img/son.png" alt="Son/bruit">
          <figcaption>Son/bruit</figcaption>
        </figure>
        <figure>
          <img src="/assets/img/visuel.png" alt="Visuel">
          <figcaption>Visuel</figcaption>
        </figure>
        <figure>
          <img src="/assets/img/brulage.png" alt="Brûlage">
          <figcaption>Brûlage</figcaption>
        </figure>
      </div>
      <NuisanceMap :start="startDate" :end="endDate" v-if="startDate && endDate" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonDatetime, IonIcon, IonModal } from '@ionic/vue';
import { calendarOutline } from 'ionicons/icons';
import { format } from 'date-fns';
import HeadingBar from '@/components/HeadingBar.vue';
import NuisanceMap from '@/components/NuisanceMap.vue';

interface myData {
  startDate: string;
  endDate: string;
}

export default defineComponent({
  name: 'NuisancePage',
  data(): myData {
    return {
      startDate: '',
      endDate: ''
    };
  },
  computed: {
    formatStartDate(): string {
      return format(new Date(this.startDate), 'dd/MM/yyyy');
    },
    formatEndDate(): string {
      return format(new Date(this.endDate), 'dd/MM/yyyy');
    }
  },
  methods: {
    today(): string {
      return format(new Date(), 'yyyy-MM-dd');
    },
    oneWeekAgo(): string {
      let date = new Date();
      date.setDate(date.getDate() - 7);
      return format(date, 'yyyy-MM-dd');
    }
  },
  components: {
    IonContent,
    IonPage,
    IonDatetime,
    IonIcon,
    IonModal,
    HeadingBar,
    NuisanceMap
  },
  setup() {
    return {
      calendarOutline
    };
  },
  beforeMount() {
    this.startDate = this.oneWeekAgo();
    this.endDate = this.today();
  }
});
</script>

<style scoped>
#signalair {
  height: 50px;
  display: block;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
}

#buttons {
  display: flex;
  justify-content: center;
  padding: 10px;
}

ion-modal {
  --width: 290px;
  --height: 382px;
  --border-radius: 8px;
}

ion-modal ion-datetime {
  height: 382px;
}

#period {
  text-align: center;
  margin-top: 0;
}

#legend {
  font-size: small;
  font-weight: bold;
  text-align: center;
  background-color: white;
  opacity: 1;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  margin: 0;
  width: 100%;
}

#legend figure {
  margin: 12px;
}

#legend figure img {
  width: 52px;
}
</style>
