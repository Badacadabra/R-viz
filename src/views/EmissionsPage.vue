<template>
  <ion-page>
    <ion-alert
      :is-open="isAlertDisplayed"
      header="Erreur de connexion"
      message="Impossible de récupérer les données."
      :buttons="['OK']"
      @didDismiss="hideAlert()"
    ></ion-alert>
    <HeadingBar title="Émissions polluantes" :back="true" />
    <ion-content color="light" :fullscreen="true" scroll-y="false">
      <ion-loading :is-open="!isDataLoaded" message="Veuillez patienter..."></ion-loading>
      <ion-item>
        <ion-label>Polluant</ion-label>
        <ion-select v-model="selectedPollutant" ok-text="OK" cancel-text="Annuler" @ionChange="selectPollutant($event)">
          <ion-select-option value="nox">NOₓ</ion-select-option>
          <ion-select-option value="pm10">PM10</ion-select-option>
          <ion-select-option value="pm25">PM2.5</ion-select-option>
          <ion-select-option value="covnm">COVNM</ion-select-option>
          <ion-select-option value="so2">SO₂</ion-select-option>
          <ion-select-option value="nh3">NH₃</ion-select-option>
          <ion-select-option value="co">CO</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label>EPCI</ion-label>
        <ion-select placeholder="Votre sélection" v-model="selectedEpciCode" ok-text="OK" cancel-text="Annuler" @ionChange="selectEpci($event)">
          <ion-select-option v-for="epci in epciList" :key="epci.code_territoire" :value="epci.code_territoire" class="radio-wrap">{{ epci.nom_territoire }}</ion-select-option>
        </ion-select>
      </ion-item>
      <EmissionsMap :variables="variables" :pollutant="selectedPollutant" :geojson="emissions" v-if="emissions" @click-on-epci="selectEpciFromMap" />
      <ion-modal class="main-modal" :is-open="isModalOpened">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Statistiques</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="hideStatistics()">
                <ion-icon :icon="close"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content color="light" fullscreen>
          <ion-item color="light" v-if="selectedEpciCode">
            <ion-label class="ion-text-wrap" color="secondary">{{ epciList.find(epci => epci.code_territoire === selectedEpciCode).nom_territoire }}</ion-label>
            <ion-icon :icon="compassOutline" slot="end" color="secondary"></ion-icon>
          </ion-item>
          <ion-item>
            <ion-label>Polluant</ion-label>
            <ion-select v-model="selectedPollutant" ok-text="OK" cancel-text="Annuler" @ionChange="selectPollutant($event)">
              <ion-select-option value="nox">NOₓ</ion-select-option>
              <ion-select-option value="pm10">PM10</ion-select-option>
              <ion-select-option value="pm25">PM2.5</ion-select-option>
              <ion-select-option value="covnm">COVNM</ion-select-option>
              <ion-select-option value="so2">SO₂</ion-select-option>
              <ion-select-option value="nh3">NH₃</ion-select-option>
              <ion-select-option value="co">CO</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label>EPCI</ion-label>
            <ion-select v-model="selectedEpciCode" ok-text="OK" cancel-text="Annuler" @ionChange="selectEpci($event)">
              <ion-select-option v-for="epci in epciList" :key="epci.code_territoire" :value="epci.code_territoire" class="radio-wrap">{{ epci.nom_territoire }}</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-text>
            <h2>Émissions de {{ formatName(selectedPollutant) }} en {{ currentYear }}</h2>
          </ion-text>
          <ion-card>
            <ion-card-content>
              <ion-item lines="none">
                <ion-icon :icon="pieChartOutline" slot="start"></ion-icon>
                <ion-label class="ion-text-wrap">
                  <p>Cet EPCI a représenté <strong>{{ partOfEpciEmissionsInRegion }}&nbsp;%</strong> des émissions dans la région.</p>
                </ion-label>
              </ion-item>
              <ion-item lines="none">
                <ion-icon :icon="peopleOutline" slot="start"></ion-icon>
                <ion-label class="ion-text-wrap">
                  <p>Cela correspond à <strong>{{ emissionsPopulation.val_epci_hab }}&nbsp;{{ emissionsPopulation.unite }}</strong> à l'échelle de l'EPCI et <strong>{{ emissionsPopulation.val_reg_hab }}&nbsp;{{ emissionsPopulation.unite }}</strong> à l'échelle de la région.</p>
                </ion-label>
              </ion-item>
            </ion-card-content>
          </ion-card>
          <EmissionsDonutChart :api="distributionBySectors" :variables="variables" :pollutant="selectedPollutant" :epci="selectedEpciCode" :key="key" />
          <ion-text>
            <h2>Évolution pluriannuelle</h2>
          </ion-text>
          <EmissionsBarChart :api="totalEmissions" :variables="variables" :pollutant="selectedPollutant" :epci="selectedEpciCode" :key="key" />
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonItem, IonLabel, IonSelect, IonSelectOption, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonCard, IonCardContent, IonLoading, IonAlert } from '@ionic/vue';
import { close, compassOutline, pieChartOutline, peopleOutline } from 'ionicons/icons';
import HeadingBar from '@/components/HeadingBar.vue';
import EmissionsMap from '@/components/EmissionsMap.vue';
import EmissionsDonutChart from '@/components/EmissionsDonutChart.vue';
import EmissionsBarChart from '@/components/EmissionsBarChart.vue';
import axios from 'axios';

interface myData {
  isAlertDisplayed: boolean;
  isDataLoaded: boolean;
  isModalOpened: boolean;
  selectedEpciCode: string;
  selectedPollutant: string;
  currentYear: number;
  variables: any;
  epciList: [];
  emissions: any;
  noxEmissions: any;
  pm10Emissions: any;
  pm25Emissions: any;
  covnmEmissions: any;
  so2Emissions: any;
  nh3Emissions: any;
  coEmissions: any;
  distributionBySectors: [],
  totalEmissions: [],
  partOfEpciEmissionsInRegion: number;
  emissionsPopulation: any;
  key: number;
}

export default defineComponent({
  name: 'EmissionsPage',
  components: {
    IonContent,
    IonPage,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonLoading,
    IonAlert,
    HeadingBar,
    EmissionsMap,
    EmissionsDonutChart,
    EmissionsBarChart
  },
  data(): myData {
    return {
      isAlertDisplayed: false,
      isDataLoaded: false,
      isModalOpened: false,
      selectedEpciCode: '',
      selectedPollutant: 'nox',
      currentYear: 0,
      variables: null,
      epciList: [],
      emissions: null,
      noxEmissions: null,
      pm10Emissions: null,
      pm25Emissions: null,
      covnmEmissions: null,
      so2Emissions: null,
      nh3Emissions: null,
      coEmissions: null,
      distributionBySectors: [],
      totalEmissions: [],
      partOfEpciEmissionsInRegion: 0,
      emissionsPopulation: null,
      key: 0
    };
  },
  methods: {
    hideAlert(): void {
      this.isAlertDisplayed = false;
    },
    formatName(pollutant: string): string {
      switch (pollutant) {
        case 'nox':
          return 'NOₓ';
        case 'pm10':
          return 'PM10';
        case 'pm25':
          return 'PM2.5';
        case 'covnm':
          return 'COVNM';
        case 'so2':
          return 'SO₂';
        case 'nh3':
          return 'NH₃';
        case 'co':
          return 'CO';
      }
    },
    getData(): void {
      let pollutant = this.selectedPollutant === 'pm25' ? 'pm2.5' : this.selectedPollutant;

      this.currentYear = this.variables[pollutant].annee;

      const reqDistribution = axios.get(`https://cigale.atmosud.org/api/emi_repartiton_epci.php?siren_epci=${this.selectedEpciCode}&polluant=${pollutant}&an=${this.currentYear}`),
            reqTotal = axios.get(`https://cigale.atmosud.org/api/emi_total_epci.php?siren_epci=${this.selectedEpciCode}&polluant=${pollutant}&an=${this.currentYear}`),
            reqPart = axios.get(`https://cigale.atmosud.org/api/emi_part_epci_reg.php?siren_epci=${this.selectedEpciCode}&polluant=${pollutant}&an=${this.currentYear}`),
            reqPopulation = axios.get(`https://api.atmosud.org/cigale/visualisation/graphiques/population?code_epci=${this.selectedEpciCode}&variable=${pollutant}&annee=${this.currentYear}`);

      axios.all([reqDistribution, reqTotal, reqPart, reqPopulation])
        .then(axios.spread((...responses) => {
          this.distributionBySectors = responses[0].data;
          this.totalEmissions = responses[1].data;
          this.partOfEpciEmissionsInRegion = responses[2].data.find(el => el.name === 'EPCI').y;
          this.emissionsPopulation = responses[3].data;

          this.key++;
          this.isModalOpened = true;
        }))
        .catch(() => {
          this.isAlertDisplayed = true;
        })
        .then(() => {
          this.isDataLoaded = true;
        });
    },
    selectPollutant(e: CustomEvent): void {
      this.emissions = this[`${(e.target as any).value}Emissions`];

      if (this.isModalOpened) {
        this.isDataLoaded = false;
        this.getData();
      }
    },
    selectEpci(): void {
      if (this.selectedEpciCode !== '') {
        this.isDataLoaded = false;
        this.getData();
      }
    },
    selectEpciFromMap(epciCode: string): void {
      this.selectedEpciCode = epciCode + '';
    },
    hideStatistics(): void {
      this.isModalOpened = false;
      this.selectedEpciCode = '';
    }
  },
  setup() {
    return {
      close,
      compassOutline,
      pieChartOutline,
      peopleOutline
    };
  },
  mounted() {
    const reqVariables = axios.get('https://api.atmosud.org/cigale/visualisation/variables');
    const reqEpciList = axios.get('https://api.atmosud.org/referentiel/territoires?rang=3');
    const reqNox = axios.get('https://geoservices.atmosud.org/geoserver/cigale/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cigale:epci_poll&outputFormat=application/json&srsName=EPSG:4326&cql_filter=nom_abrege_polluant=%27nox%27');
    const reqPm10 = axios.get('https://geoservices.atmosud.org/geoserver/cigale/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cigale:epci_poll&outputFormat=application/json&srsName=EPSG:4326&cql_filter=nom_abrege_polluant=%27pm10%27');
    const reqPm25 = axios.get('https://geoservices.atmosud.org/geoserver/cigale/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cigale:epci_poll&outputFormat=application/json&srsName=EPSG:4326&cql_filter=nom_abrege_polluant=%27pm2.5%27');
    const reqCovnm = axios.get('https://geoservices.atmosud.org/geoserver/cigale/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cigale:epci_poll&outputFormat=application/json&srsName=EPSG:4326&cql_filter=nom_abrege_polluant=%27covnm%27');
    const reqSo2 = axios.get('https://geoservices.atmosud.org/geoserver/cigale/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cigale:epci_poll&outputFormat=application/json&srsName=EPSG:4326&cql_filter=nom_abrege_polluant=%27so2%27');
    const reqNh3 = axios.get('https://geoservices.atmosud.org/geoserver/cigale/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cigale:epci_poll&outputFormat=application/json&srsName=EPSG:4326&cql_filter=nom_abrege_polluant=%27nh3%27');
    const reqCo = axios.get('https://geoservices.atmosud.org/geoserver/cigale/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cigale:epci_poll&outputFormat=application/json&srsName=EPSG:4326&cql_filter=nom_abrege_polluant=%27co%27');

    axios.all([reqVariables, reqEpciList, reqNox, reqPm10, reqPm25, reqCovnm, reqSo2, reqNh3, reqCo])
      .then(axios.spread((...responses) => {
        this.variables = responses[0].data;
        this.epciList = responses[1].data.sort((a, b) => a.nom_territoire.localeCompare(b.nom_territoire));
        this.noxEmissions = responses[2].data;
        this.pm10Emissions = responses[3].data;
        this.pm25Emissions = responses[4].data;
        this.covnmEmissions = responses[5].data;
        this.so2Emissions = responses[6].data;
        this.nh3Emissions = responses[7].data;
        this.coEmissions = responses[8].data;

        this.emissions = this.noxEmissions;
      }))
      .catch(() => {
        this.isAlertDisplayed = true;
      })
      .then(() => {
        this.isDataLoaded = true;
      });
  }
});
</script>

<style>
.alert-radio-label.sc-ion-alert-md,
.alert-radio-label.sc-ion-alert-ios {
  white-space: normal;
}

.radio-wrap.alert-tappable.sc-ion-alert-md {
  height: 80px;
}

.radio-wrap.alert-tappable.sc-ion-alert-ios {
  height: 50px;
}
</style>

<style scoped>
ion-text h2 {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
