<template>
  <ion-page>
    <ion-alert
      :is-open="isAlertDisplayed"
      header="Erreur de connexion"
      message="Impossible de récupérer les données."
      :buttons="['OK']"
      @didDismiss="hideAlert()"
    ></ion-alert>
    <HeadingBar title="Microcapteurs" :back="true" />
    <ion-content color="light" :fullscreen="true">
      <ion-progress-bar color="tertiary" type="indeterminate" v-if="!isDataLoaded"></ion-progress-bar>
      <ion-loading :is-open="!areChartsLoaded" message="Veuillez patienter..."></ion-loading>
      <ion-chip outline color="dark" @click="showMicrosensors()">
        <ion-icon :icon="pulseOutline"></ion-icon>
        <ion-label>Voir tous les microcapteurs</ion-label>
      </ion-chip>
      <ion-modal class="main-modal" :is-open="isMicrosensorsModalOpened">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Microcapteurs</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="hideMicrosensors()">
                <ion-icon :icon="close"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content color="light" fullscreen>
          <div id="legend">
            <figure :class="{active: diamsActive, menu: true}" @click="displayMicrosensorsOnMap(12)">
              <img src="/app/assets/img/capteur-diams.png" alt="DIAMS">
              <figcaption>DIAMS</figcaption>
            </figure>
            <figure :class="{active: nature4citylifeActive, menu: true}" @click="displayMicrosensorsOnMap(5)">
              <img src="/app/assets/img/capteur-nature4citylife.png" alt="Nature4CityLife">
              <figcaption>Nature4CityLife</figcaption>
            </figure>
          </div>
          <MicrosensorsMap :microsensors="microsensors" :campaign="campaignId" v-if="microsensors.length > 0" />
          <ion-accordion-group v-if="campaignId === 12">
            <ion-accordion v-for="microsensor in diamsMicrosensors" :key="microsensor.id_site">
              <ion-item slot="header">
                <ion-label class="ion-text-wrap">
                  <h3>{{ microsensor.nom_site }}</h3>
                </ion-label>
              </ion-item>
              <ion-list class="details" slot="content">
                <ion-item lines="none">
                  <ion-label class="ion-text-wrap">
                    <p><strong>Identifiant :</strong> {{ microsensor.id_site }}</p>
                    <p v-if="microsensor.type_site"><strong>Type :</strong> {{ microsensor.type_site }}</p>
                    <p v-if="microsensor.influence"><strong>Influence :</strong> {{ microsensor.influence }}</p>
                    <p v-if="microsensor.lat"><strong>Latitude :</strong> {{ microsensor.lat }}</p>
                    <p v-if="microsensor.lon"><strong>Longitude :</strong> {{ microsensor.lon }}</p>
                    <p v-if="microsensor.date_debut_site"><strong>Mise en service :</strong> {{ formatDate(microsensor.date_debut_site) }}</p>
                    <p v-if="microsensor.date_fin_site"><strong>Fin de la mesure :</strong> {{ formatDate(microsensor.date_fin_site) }}</p>
                    <p v-if="microsensor.marque_capteur"><strong>Marque du capteur :</strong> {{ microsensor.marque_capteur }}</p>
                    <p v-if="microsensor.modele_capteur"><strong>Modèle de capteur :</strong> {{ microsensor.modele_capteur }}</p>
                    <p v-if="microsensor.variables"><strong>Variable(s) :</strong> {{ microsensor.variables }}</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-accordion>
          </ion-accordion-group>
          <ion-accordion-group v-else>
            <ion-accordion v-for="microsensor in n4clMicrosensors" :key="microsensor.id_site">
              <ion-item slot="header">
                <ion-label class="ion-text-wrap">
                  <h3>{{ microsensor.nom_site }}</h3>
                </ion-label>
              </ion-item>
              <ion-list class="details" slot="content">
                <ion-item lines="none">
                  <ion-label class="ion-text-wrap">
                    <p><strong>Identifiant :</strong> {{ microsensor.id_site }}</p>
                    <p v-if="microsensor.type_site"><strong>Type :</strong> {{ microsensor.type_site }}</p>
                    <p v-if="microsensor.influence"><strong>Influence :</strong> {{ microsensor.influence }}</p>
                    <p v-if="microsensor.lat"><strong>Latitude :</strong> {{ microsensor.lat }}</p>
                    <p v-if="microsensor.lon"><strong>Longitude :</strong> {{ microsensor.lon }}</p>
                    <p v-if="microsensor.date_debut_site"><strong>Mise en service :</strong> {{ formatDate(microsensor.date_debut_site) }}</p>
                    <p v-if="microsensor.date_fin_site"><strong>Fin de la mesure :</strong> {{ formatDate(microsensor.date_fin_site) }}</p>
                    <p v-if="microsensor.marque_capteur"><strong>Marque du capteur :</strong> {{ microsensor.marque_capteur }}</p>
                    <p v-if="microsensor.modele_capteur"><strong>Modèle de capteur :</strong> {{ microsensor.modele_capteur }}</p>
                    <p v-if="microsensor.variables"><strong>Variable(s) :</strong> {{ microsensor.variables }}</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-accordion>
          </ion-accordion-group>
        </ion-content>
      </ion-modal>
      <ion-item>
        <ion-label>Campagne</ion-label>
        <ion-select placeholder="Votre sélection" ok-text="OK" cancel-text="Annuler" v-model="campaignId" @ionChange="selectCampaign($event)">
          <ion-select-option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">{{ campaign.name }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label>Microcapteur</ion-label>
        <ion-select placeholder="Votre sélection" ok-text="OK" cancel-text="Annuler" v-model="selectedMicrosensorId" @ionChange="selectMicrosensor($event)">
          <ion-select-option v-for="microsensor in microsensors" :key="microsensor.id_site" :value="microsensor.id_site" :class="microsensor.nom_site.length > 20 ? 'radio-wrap' : ''">{{ microsensor.nom_site }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-if="selectedMicrosensorId">
        <ion-label>Variable(s)</ion-label>
        <ion-select multiple placeholder="Votre sélection" ok-text="OK" cancel-text="Annuler" v-model="selectedVariables" @ionChange="selectVariables($event)">
          <ion-select-option v-for="(variable, i) in variables" :key="i" :value="variable" :class="variable.length > 20 ? 'checkbox-wrap' : ''">{{ variable }}</ion-select-option>
        </ion-select>
      </ion-item>
      <div id="buttons">
        <ion-button id="open-start-modal" color="secondary" fill="outline">
          <ion-icon slot="start" :icon="calendarOutline"></ion-icon>
          Date de début
        </ion-button>
        <ion-modal class="datepicker" trigger="open-start-modal">
          <ion-content force-overscroll="false">
            <ion-datetime presentation="date" :max="endDate" :value="startDate" v-model="startDate"></ion-datetime>
          </ion-content>
        </ion-modal>
        <ion-button id="open-end-modal" color="secondary" fill="outline">
          <ion-icon slot="start" :icon="calendarOutline"></ion-icon>
          Date de fin
        </ion-button>
        <ion-modal class="datepicker" trigger="open-end-modal">
          <ion-content force-overscroll="false">
            <ion-datetime presentation="date" :min="startDate" :max="today()" :value="endDate" v-model="endDate"></ion-datetime>
          </ion-content>
        </ion-modal>
      </div>
      <p id="period">Du <strong>{{ formatStartDate }}</strong> au <strong>{{ formatEndDate }}</strong></p>
      <ion-button id="measurements-btn" expand="block" color="secondary" @click="displayMeasurements()">Afficher les mesures</ion-button>
      <ion-item id="previz" v-if="measurements.length === 0">
        <ion-icon :icon="analytics"></ion-icon>
      </ion-item>
      <div v-else>
        <ion-card v-for="(variable, i) in selectedVariables" :key="i">
          <ion-card-content>
            <MicrosensorsChart :api="measurements" :microsensor="selectedMicrosensorId" :variable="variable" :key="key" />
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonList, IonChip, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonSelect, IonSelectOption, IonProgressBar, IonLoading, IonDatetime, IonCard, IonCardContent, IonAlert } from '@ionic/vue';
import { pulseOutline, calendarOutline, analytics, close } from 'ionicons/icons';
import HeadingBar from '@/components/HeadingBar.vue';
import MicrosensorsMap from '@/components/MicrosensorsMap.vue';
import MicrosensorsChart from '@/components/MicrosensorsChart.vue';
import axios from 'axios';
import { format } from 'date-fns';

interface myData {
  isAlertDisplayed: boolean;
  isDataLoaded: boolean;
  areChartsLoaded: boolean;
  startDate: string;
  endDate: string;
  diamsMicrosensors: [];
  n4clMicrosensors: [];
  microsensors: [];
  campaignId: number;
  campaigns: Array<{id: number, name: string}>;
  diamsActive: boolean;
  nature4citylifeActive: boolean;
  isMicrosensorsModalOpened: boolean;
  selectedMicrosensorId: number;
  selectedVariables: [];
  variables: [];
  measurements: [];
  key: number;
}

export default defineComponent({
  name: 'MicrosensorsPage',
  components: {
    IonContent,
    IonPage,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    IonList,
    IonChip,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonProgressBar,
    IonLoading,
    IonDatetime,
    IonCard,
    IonCardContent,
    IonAlert,
    HeadingBar,
    MicrosensorsMap,
    MicrosensorsChart
  },
  data(): myData {
    return {
      isAlertDisplayed: false,
      isDataLoaded: false,
      areChartsLoaded: true,
      startDate: '',
      endDate: '',
      diamsMicrosensors: [],
      n4clMicrosensors: [],
      microsensors: [],
      campaignId: 12,
      campaigns: [{id: 12, name: 'DIAMS'}, {id: 5, name: 'Nature4CityLife'}],
      diamsActive: true,
      nature4citylifeActive: false,
      isMicrosensorsModalOpened: false,
      selectedMicrosensorId: 0,
      selectedVariables: [],
      variables: [],
      measurements: [],
      key: 0
    };
  },
  computed: {
    formatStartDate(): string {
      return this.formatDate(this.startDate);
    },
    formatEndDate(): string {
      return this.formatDate(this.endDate);
    }
  },
  methods: {
    hideAlert(): void {
      this.isAlertDisplayed = false;
    },
    formatDate(date: string): string {
      return format(new Date(date), 'dd/MM/yyyy');
    },
    today(): string {
      return format(new Date(), 'yyyy-MM-dd');
    },
    yesterday(): string {
      let date = new Date();
      date.setDate(date.getDate() - 1);
      return format(date, 'yyyy-MM-dd');
    },
    selectCampaign(): void {
      this.selectedMicrosensorId = 0;
      this.selectedVariables = [];
      this.measurements = [];

      if (this.campaignId === 12) {
        this.microsensors = this.diamsMicrosensors;
      } else {
        this.microsensors = this.n4clMicrosensors;
      }
    },
    selectMicrosensor(e: CustomEvent): void {
      this.selectedVariables = [];
      this.measurements = [];
      this.variables = this.microsensors.find(sensor => sensor.id_site === (e.target as any).value).variables.split(', ').sort((a, b) => a.localeCompare(b));
    },
    selectVariables(): void {
      this.measurements = [];
    },
    showMicrosensors(): void {
      this.isMicrosensorsModalOpened = true;
    },
    hideMicrosensors(): void {
      this.isMicrosensorsModalOpened = false;
    },
    displayMicrosensorsOnMap(campaignId: number): void {
      switch (campaignId) {
        case 12: // DIAMS
          this.diamsActive = true;
          this.nature4citylifeActive = false;
          this.microsensors = this.diamsMicrosensors;
          break;
        case 5: // Nature4CityLife
          this.diamsActive = false;
          this.nature4citylifeActive = true;
          this.microsensors = this.n4clMicrosensors;
          break;
      }

      this.campaignId = campaignId;
    },
    displayMeasurements(): void {
      this.areChartsLoaded = false;

      axios.get(`https://api.atmosud.org/observations/capteurs/mesures?debut=${this.startDate}&fin=${this.endDate}&id_campagne=${this.campaignId}&id_site=${this.selectedMicrosensorId}&variable=${this.selectedVariables.toString()}`)
        .then(response => {
          this.measurements = response.data;
          this.key++;
        })
        .catch(() => {
          this.isAlertDisplayed = true;
        })
        .then(() => {
          this.areChartsLoaded = true;
        });
    }
  },
  beforeMount() {
    this.startDate = this.yesterday();
    this.endDate = this.today();
  },
  mounted() {
    const reqDiams = axios.get('https://api.atmosud.org/observations/capteurs/sites?id_campagne=12');
    const reqN4cl = axios.get('https://api.atmosud.org/observations/capteurs/sites?id_campagne=5');

    axios.all([reqDiams, reqN4cl])
      .then(axios.spread((...responses) => {
        const resDiams = responses[0];
        const resN4cl = responses[1];

        this.diamsMicrosensors = resDiams.data.sort((a, b) => a.nom_site.localeCompare(b.nom_site));
        this.n4clMicrosensors = resN4cl.data.sort((a, b) => a.nom_site.localeCompare(b.nom_site));

        this.microsensors = this.diamsMicrosensors;
        this.isDataLoaded = true;
      }))
      .catch(() => {
        this.isAlertDisplayed = true;
      });
  },
  setup() {
    return {
      pulseOutline,
      calendarOutline,
      analytics,
      close
    };
  }
});
</script>

<style>
.radio-wrap.alert-tappable.sc-ion-alert-md {
  height: 70px;
}

.checkbox-wrap.alert-tappable.sc-ion-alert-md {
  height: 80px;
}

.alert-radio-label.sc-ion-alert-md,
.alert-checkbox-label.sc-ion-alert-md {
  white-space: normal;
}
</style>

<style scoped>
#buttons {
  display: flex;
  justify-content: center;
  padding: 10px;
}

#period {
  text-align: center;
  margin-top: 0;
}

#measurements-btn {
  width: 90%;
  margin-top: 10px;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
}

#previz {
  --min-height: 300px;
  width: 90%;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 15px;
  border: solid 2px #e8e9ec;
}

#previz ion-icon {
  color: #e8e9ec;
  font-size: 100px;
  margin: auto;
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
  margin: 6px 12px;
  cursor: pointer;
}

#legend figure img {
  width: 52px;
}

.datepicker {
  --width: 290px;
  --height: 382px;
  --border-radius: 8px;
}

.menu {
  border: solid 2px #fff;
  padding: 3px;
  border-radius: 10px;
}

.active {
  border-color: var(--ion-color-light);
}

.details {
  background-color: #e8e9ec;
}

.details ion-item {
  --background: #e8e9ec;
}

ion-progress-bar {
  position: absolute;
  z-index: 9999;
}

ion-chip {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}

ion-modal ion-datetime {
  height: 382px;
}

ion-accordion.accordion-expanding ion-item[slot="header"],
ion-accordion.accordion-expanded ion-item[slot="header"] {
  border-left: solid 10px var(--ion-color-tertiary);
}
</style>
