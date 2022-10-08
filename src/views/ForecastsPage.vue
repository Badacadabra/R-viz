<template>
  <ion-page>
    <ion-alert
      :is-open="isAlertDisplayed"
      header="Erreur de connexion"
      message="Impossible de récupérer les données."
      :buttons="['OK']"
      @didDismiss="hideAlert()"
    ></ion-alert>
    <HeadingBar title="Prévisions détaillées" :back="true" />
    <ion-content color="light" :fullscreen="true">
      <ion-progress-bar color="tertiary" type="indeterminate" v-if="!isDataLoaded"></ion-progress-bar>
      <ion-searchbar placeholder="Tapez une adresse..." autocomplete="on" v-model="userInput" @ionChange="getSuggestions()"></ion-searchbar>
      <ion-list id="suggestions" v-if="userInput && addresses.length > 0">
        <div v-for="address in addresses" :key="address.properties.id">
          <ion-item :button="true" @click="showDetails(address)">
            <ion-label class="ion-text-wrap">{{ address.properties.label }}</ion-label>
            <ion-icon :icon="locationOutline" slot="end"></ion-icon>
          </ion-item>
        </div>
      </ion-list>
      <ion-segment :value="day" @ionChange="!isModalOpened ? { ionChange: getDayAndDate($event) } : null">
        <ion-segment-button value="today">
          <ion-label>Aujourd'hui</ion-label>
        </ion-segment-button>
        <ion-segment-button value="tomorrow">
          <ion-label>Demain</ion-label>
        </ion-segment-button>
        <ion-segment-button value="dayAfterTomorrow" v-if="j2isAvailable">
          <ion-label>Après-demain</ion-label>
        </ion-segment-button>
      </ion-segment>
      <ion-accordion-group>
        <ion-accordion>
          <ion-item slot="header">
            <ion-label>Commentaire régional</ion-label>
          </ion-item>
          <ion-item slot="content">
            <ion-label id="comment-content" class="ion-text-wrap" v-if="regionalComments">{{ regionalComments[currentDate] }}</ion-label>
          </ion-item>
        </ion-accordion>
      </ion-accordion-group>
      <ForecastsMap :date="currentDate" v-if="currentDate" @click-on-map="showDetailsFromMap" />
    </ion-content>
    <ion-modal class="main-modal" :is-open="isModalOpened">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Détails</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="hideDetails()">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content color="light" fullscreen>
        <ion-progress-bar color="tertiary" type="indeterminate" v-if="!isDataLoaded"></ion-progress-bar>
        <ion-item>
          <ion-label class="ion-text-wrap">{{ selectedAddress.properties.label }}</ion-label>
          <ion-icon :icon="locationOutline" slot="end"></ion-icon>
        </ion-item>
        <ion-segment :value="day" @ionChange="changeDateInDetails($event)">
          <ion-segment-button value="today">
            <ion-label>Aujourd'hui</ion-label>
          </ion-segment-button>
          <ion-segment-button value="tomorrow">
            <ion-label>Demain</ion-label>
          </ion-segment-button>
          <ion-segment-button value="dayAfterTomorrow" v-if="j2isAvailable">
            <ion-label>Après-demain</ion-label>
          </ion-segment-button>
        </ion-segment>
        <GaugeChart :index="indexLevel" v-if="indexLevel" :key="key" />
        <ion-list>
          <ion-item v-for="subIndex in subIndices" :key="subIndex.pollutantCode">
            <ion-label>
              <h3 v-html="subIndex.pollutantShortName"></h3>
              <p>{{ subIndex.concentration }} <span v-html="subIndex.unit"></span></p>
            </ion-label>
            <ion-badge slot="end" :class="$style[subIndex.styleClass]">{{ subIndex.indexLabel }}</ion-badge>
          </ion-item>
        </ion-list>
        <!-- <HourlyForecastsChart :api="apiPointRouteData" v-if="apiPointRouteData" /> -->
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonSearchbar, IonIcon, IonList, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonSegment, IonSegmentButton, IonProgressBar, IonAccordionGroup, IonAccordion, IonAlert } from '@ionic/vue';
import { close, locationOutline } from 'ionicons/icons';
import HeadingBar from '@/components/HeadingBar.vue';
import ForecastsMap from '@/components/ForecastsMap.vue';
import GaugeChart from '@/components/GaugeChart.vue';
// import HourlyForecastsChart from '@/components/HourlyForecastsChart.vue';
import axios from 'axios';
import { format, add } from 'date-fns';

interface myData {
  isAlertDisplayed: boolean;
  userInput: string;
  addresses: [];
  isModalOpened: boolean;
  apiPointRouteData: any;
  selectedAddress: any;
  isDataLoaded: boolean;
  j2isAvailable: boolean;
  key: number;
  day: string;
  currentDate: string;
  regionalComments: any;
  indexLevel: string;
  subIndices: Array<{
    pollutantCode: string,
    pollutantName: string,
    pollutantShortName: string,
    unit: string,
    indexLabel: string,
    indexImg: string,
    concentration: number,
    styleClass: string
  }>;
}

export default defineComponent({
  name: 'ForecastsPage',
  components: {
    IonContent,
    IonPage,
    IonSearchbar,
    IonIcon,
    IonList,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonProgressBar,
    IonAccordionGroup,
    IonAccordion,
    IonAlert,
    HeadingBar,
    ForecastsMap,
    GaugeChart,
    // HourlyForecastsChart
  },
  data(): myData {
    return {
      isAlertDisplayed: false,
      userInput: '',
      addresses: [],
      isModalOpened: false,
      apiPointRouteData: null,
      selectedAddress: null,
      isDataLoaded: true,
      j2isAvailable: false,
      key: 0,
      day: 'today',
      currentDate: '',
      regionalComments: null,
      indexLevel: '',
      subIndices: []
    }
  },
  methods: {
    hideAlert(): void {
      this.isAlertDisplayed = false;
    },
    getSuggestions(): void {
      this.isDataLoaded = false;

      if (this.userInput.length > 2) {
        axios.get(`https://api-adresse.data.gouv.fr/search/?q=${this.escapeHtml(this.userInput)}&limit=100&autocomplete=1`)
          .then(response => {
            let addresses = [],
                counter = 0;

            for (let address of response.data.features) {
              if (this.isCityInPACA(address.properties.citycode) && counter < 7) {
                addresses.push(address);
                counter++;
              }
            }

            this.addresses = addresses;
            this.isDataLoaded = true;
          })
          .catch(() => {
            this.isAlertDisplayed = true;
          });
      } else {
        this.addresses = [];
        this.isDataLoaded = true;
      }
    },
    escapeHtml(text: string): string {
      const map: {'&': string, '<': string, '>': string, ' ': string} = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        ' ': '+'
      };

      return text.replace(/[&<> ]/g, m => map[m]);
    },
    isCityInPACA(inseeCode: string): boolean {
      const departmentsCodes: Array<string> = ['04', '05', '06', '13', '83', '84'];
      return departmentsCodes.includes(inseeCode.substring(0, 2));
    },
    getDayAndDate(e: CustomEvent): void {
      this.day = e ? (e.target as any).value : this.day;

      switch (this.day) {
        case 'today':
          this.currentDate = format(new Date(), 'yyyy-MM-dd');
          break;
        case 'tomorrow':
          this.currentDate = format(add(new Date(), { days: 1 }), 'yyyy-MM-dd');
          break;
        case 'dayAfterTomorrow':
          this.currentDate = format(add(new Date(), { days: 2 }), 'yyyy-MM-dd');
          break;
      }
    },
    getRegionalComments(): void {
      axios.get('https://api.atmosud.org/siam/v1/accueil')
        .then(response => {
          this.regionalComments = response.data.data.commentaires;
        })
        .catch(() => {
          this.isAlertDisplayed = true;
        });
    },
    showDetails(address: any): void {
      this.selectedAddress = address;
      this.changeDateInDetails();
    },
    showDetailsFromMap(latitude: number, longitude: number) {
      axios.get(`https://api-adresse.data.gouv.fr/reverse/?lat=${latitude}&lon=${longitude}`)
        .then(response => {
          let address = response.data.features.length > 0 ? response.data.features[0] : '';

          if (address) {
            if (address.properties.context.includes("Provence-Alpes-Côte d'Azur")) {
              this.showDetails(address);
            }
          } else {
            axios.get(`https://geo.api.gouv.fr/communes?lat=${latitude}&lon=${longitude}&format=geojson`)
              .then(response => {
                let city = response.data.features.length > 0 ? response.data.features[0] : '';

                if (city && city.codeRegion === '93') {
                  this.showDetails({
                    properties: {
                      label: `${city.properties.nom} (centroïde)`
                    },
                    geometry: {
                      coordinates: city.geometry.coordinates
                    }
                  });
                }
              })
              .catch(() => {
                this.isAlertDisplayed = true;
              });
          }
        })
        .catch(() => {
          this.isAlertDisplayed = true;
        });
    },
    hideDetails(): void {
      this.isModalOpened = false;
    },
    changeDateInDetails(e: CustomEvent): void {
      this.isDataLoaded = false;

      const longitude: number = this.selectedAddress.geometry.coordinates[0],
            latitude: number = this.selectedAddress.geometry.coordinates[1];

      this.getDayAndDate(e);

      axios.get(`https://api.atmosud.org/siam/v1/point?x=${longitude}&y=${latitude}&date_echeance=${this.currentDate}&prevision_horaire=true`)
        .then(response => {
          this.apiPointRouteData = response.data;
          this.indexLevel = response.data.data.legendes.indice_atmo.find(i => i.indice === Math.trunc(response.data.data.prevision_journaliere.indice_atmo)).qualificatif;

          let arr = [] as any;

          for (let subIndex of response.data.data.prevision_journaliere.sous_indices) {
            let obj = {} as any;

            let pollutant = response.data.data.legendes.polluants.find(poll => poll.code_polluant_eu === subIndex.code_polluant_eu);

            obj.pollutantCode = pollutant.code_polluant_eu;
            obj.pollutantName = pollutant.label;
            obj.pollutantShortName = pollutant.acronyme;
            obj.unit = pollutant.unite;

            let index = response.data.data.legendes.indice_atmo.find(i => i.indice === Math.trunc(subIndex.indice_atmo));

            obj.indexLabel = index.qualificatif;
            obj.indexImg = index.picto_url;

            obj.concentration = subIndex.concentration;

            switch (index.qualificatif) {
              case 'Bon':
                obj.styleClass = 'good';
                break;
              case 'Moyen':
                obj.styleClass = 'medium';
                break;
              case 'Dégradé':
                obj.styleClass = 'degraded';
                break;
              case 'Mauvais':
                obj.styleClass = 'bad';
                break;
              case 'Très mauvais':
                obj.styleClass = 'veryBad';
                break;
              case 'Extrêmement mauvais':
                obj.styleClass = 'extremelyBad';
                break;
            }

            arr.push(obj);
          }

          this.key++;
          this.subIndices = arr;
          this.isDataLoaded = true;
          this.isModalOpened = true;
        })
        .catch(() => {
          this.isAlertDisplayed = true;
        });
    },
    checkJ2(): void {
      const dayAfterTomorrow = format(add(new Date(), { days: 2 }), 'yyyy-MM-dd'),
            url = `https://geoservices.atmosud.org/geoserver/azurjour/wms?service=WMS&version=1.1.0&request=GetMap&layers=azurjour:paca-multi-${dayAfterTomorrow}&styles=&bbox=795487.5,6211312.5,1083487.5,6454512.5&width=768&height=648&srs=EPSG:2154&format=image/png&transparent=true`;

      axios.head(url)
        .then(response => {
          if (response.headers['content-type'] === 'image/png') {
            this.j2isAvailable = true;
          }
        });
    }
  },
  setup() {
    return {
      close,
      locationOutline
    };
  },
  mounted() {
    this.getDayAndDate();
    this.getRegionalComments();
    this.checkJ2();
  }
});
</script>

<style>
#suggestions {
  position: absolute;
  top: 115px;
  left: 0;
  right: 0;
  z-index: 9999;
  background: initial;
}

#comment-content {
  font-size: small;
}

.ios #suggestions {
  top: 103px;
}
</style>

<style module scoped>
.good {
  --background: #50f0e6;
}

.medium {
  --background: #50ccaa;
}

.degraded {
  --background: #f0e641;
}

.bad {
  --background: #ff5050;
}

.veryBad {
  --background: #960032;
}

.extremelyBad {
  --background: #872181;
}

ion-progress-bar {
  position: absolute;
  z-index: 9999;
}
</style>
