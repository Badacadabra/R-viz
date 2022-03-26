<template>
  <ion-page>
    <ion-alert
      :is-open="isAlertDisplayed"
      header="Erreur de connexion"
      message="Impossible de récupérer les données."
      :buttons="['OK']"
      @didDismiss="hideAlert()"
    ></ion-alert>
    <HeadingBar title="Épisodes de pollution" :back="true" />
    <ion-content color="light" :fullscreen="true">
      <ion-chip outline color="danger" v-if="hasEpisode" @click="showCurrentEpisodes()">
        <ion-icon :icon="warning"></ion-icon>
        <ion-label>Épisode{{ currentEpisodes.length > 1 ? 's' : '' }} en cours</ion-label>
      </ion-chip>
      <ion-chip outline color="success" v-else @click="showToast">
        <ion-icon :icon="checkmarkCircle"></ion-icon>
        <ion-label>Pas d'épisode en cours</ion-label>
      </ion-chip>
      <ion-modal class="main-modal" :is-open="isCurrentEpisodesModalOpened">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Épisode{{ currentEpisodes.length > 1 ? 's' : '' }} en cours</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="hideCurrentEpisodes()">
                <ion-icon :icon="close"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content color="light" fullscreen>
          <ion-item id="previz" v-if="!selectedCurrentEpisodeDate && !selectedCurrentEpisodePollutant">
            <ion-icon :icon="map"></ion-icon>
          </ion-item>
          <EpisodesMap :date="selectedCurrentEpisodeDate" :pollutant="selectedCurrentEpisodePollutant" v-if="selectedCurrentEpisodeDate && selectedCurrentEpisodePollutant" :key="key2" />
          <ion-accordion-group>
            <ion-accordion v-for="currentEpisode in currentEpisodes" :key="currentEpisode.id">
              <ion-item slot="header">
                <ion-label class="ion-text-wrap">
                  <p>{{ formatDate(currentEpisode.date_debut) }}</p>
                  <h3>{{ currentEpisode.titre }} ({{ currentEpisode.polluant }})</h3>
                </ion-label>
              </ion-item>
              <ion-list class="zone-names" slot="content">
                <ion-item lines="none">
                  <ion-label class="ion-text-wrap">
                    <p>{{ currentEpisode.commentaire }}</p>
                  </ion-label>
                </ion-item>
                <ion-item v-for="zone in currentEpisode.zones" :key="zone.id">
                  <ion-label>
                    <h3><strong>{{ zone.nom }}</strong></h3>
                    <p><strong>Population exposée :</strong> {{ zone.population_exposee }} personnes</p>
                    <p><strong>Surface exposée :</strong> {{ zone.surface_exposee }} ha</p>
                  </ion-label>
                </ion-item>
                <ion-button id="map-btn" color="secondary" expand="block" @click="displayMap(currentEpisode)">Afficher la carte</ion-button>
              </ion-list>
            </ion-accordion>
          </ion-accordion-group>
        </ion-content>
      </ion-modal>
      <ion-chip outline color="dark" @click="showStatistics">
        <ion-icon :icon="statsChart"></ion-icon>
        <ion-label>Consulter les statistiques</ion-label>
      </ion-chip>
      <ion-modal class="main-modal" :is-open="isStatsModalOpened">
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
          <ion-text>
            <h2>À l'échelle de la région</h2>
          </ion-text>
          <ion-range :value="selectedYear" :min="new Date().getFullYear() - 4" :max="new Date().getFullYear()" step="1" ticks="true" snaps="true" :pin="true" color="secondary" @ionChange="changeYear($event)">
            <ion-icon :icon="calendarOutline" size="small" slot="start"></ion-icon>
            <ion-icon :icon="calendarOutline" slot="end"></ion-icon>
          </ion-range>
          <ion-card>
            <ion-card-header>
              <ion-card-subtitle>En résumé, en {{ selectedYear }}...</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              Il y a eu <strong>{{ nbEpisodes }} épisode{{ nbEpisodes > 1 ? 's' : '' }}</strong> de pollution dans la Région Sud Provence-Alpes-Côte d'Azur, tous polluants confondus.
            </ion-card-content>
          </ion-card>
          <ion-text>
            <h2>À l'échelle d'un département</h2>
          </ion-text>
          <ion-item>
            <ion-label>Département</ion-label>
            <ion-select interface="popover" :value="selectedDepartment" v-model="selectedDepartment" @ionChange="changeDepartment()">
              <ion-select-option value="04">Alpes-de-Haute-Provence</ion-select-option>
              <ion-select-option value="06">Alpes-Maritimes</ion-select-option>
              <ion-select-option value="13">Bouches-du-Rhône</ion-select-option>
              <ion-select-option value="05">Hautes-Alpes</ion-select-option>
              <ion-select-option value="83">Var</ion-select-option>
              <ion-select-option value="84">Vaucluse</ion-select-option>
            </ion-select>
          </ion-item>
          <EpisodesChart :api="episodesStatisticsForDepartments" :dep="selectedDepartment" v-if="episodesStatisticsForDepartments && selectedDepartment" :key="key" />
        </ion-content>
      </ion-modal>
      <ion-toast :is-open="isToastVisible" message="Rien à signaler !" :duration="2000" @didDismiss="hideToast()"></ion-toast>
      <ion-text>
        <h2>Historique</h2>
      </ion-text>
      <ion-list v-if="episodes.length === 0">
        <ion-item v-for="i in 10" :key="i">
          <ion-label>
            <p>
              <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
            </p>
            <h3>
              <ion-skeleton-text animated style="width: 70%"></ion-skeleton-text>
            </h3>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-accordion-group>
        <ion-accordion v-for="episodePart in episodesParts" :key="episodePart.id">
          <ion-item slot="header">
            <ion-label class="ion-text-wrap">
              <p>Du {{ formatDate(episodePart['date_debut'], 'long') }} au {{ formatDate(episodePart['date_fin'], 'long') }}</p>
              <h3>{{ episodePart.titre }}</h3>
            </ion-label>
          </ion-item>
          <ion-list class="zone-names" slot="content" lines="none">
            <ion-item v-for="(zone, i) in episodePart.dispositif_prefectoral.zones_en_procedure" :key="i">
              <ion-icon :icon="compassOutline" slot="start"></ion-icon>
              <ion-label>
                <p>{{ zone.nom }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>
      <ion-infinite-scroll threshold="100px" @ionInfinite="loadData($event)">
        <ion-infinite-scroll-content loading-spinner="dots"></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonChip, IonButtons, IonButton, IonToast, IonModal, IonHeader, IonTitle, IonToolbar, IonAccordionGroup, IonAccordion, IonList, IonItem, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonSkeletonText, IonSelect, IonSelectOption, IonIcon, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonRange, IonText, IonAlert } from '@ionic/vue';
import { warning, checkmarkCircle, statsChart, compassOutline, calendarOutline, map, close } from 'ionicons/icons';
import HeadingBar from '@/components/HeadingBar.vue';
import EpisodesMap from '@/components/EpisodesMap.vue';
import EpisodesChart from '@/components/EpisodesChart.vue';
import axios from 'axios';
import { format } from 'date-fns';

interface myData {
  isAlertDisplayed: boolean;
  hasEpisode: boolean;
  isToastVisible: boolean;
  isCurrentEpisodesModalOpened: boolean;
  isStatsModalOpened: boolean;
  episodes: [];
  currentEpisodes: [];
  selectedCurrentEpisodeDate: string;
  selectedCurrentEpisodePollutant: string;
  episodesHistory: [];
  episodesParts: [];
  episodesMax: number;
  episodesStatisticsForDepartments: any;
  selectedDepartment: string;
  selectedYear: number;
  episodesStatisticsTotal: [];
  nbEpisodes: number;
  key: number;
  key2: number;
}

export default defineComponent({
  name: 'EpisodesPage',
  components: {
    IonContent,
    IonPage,
    IonChip,
    IonButtons,
    IonButton,
    IonToast,
    IonModal,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonAccordionGroup,
    IonAccordion,
    IonList,
    IonItem,
    IonLabel,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSkeletonText,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonRange,
    IonText,
    IonAlert,
    HeadingBar,
    EpisodesMap,
    EpisodesChart
  },
  data(): myData {
    return {
      isAlertDisplayed: false,
      hasEpisode: false,
      isToastVisible: false,
      isCurrentEpisodesModalOpened: false,
      isStatsModalOpened: false,
      episodes: [],
      currentEpisodes: [],
      selectedCurrentEpisodeDate: '',
      selectedCurrentEpisodePollutant: '',
      episodesHistory: [],
      episodesParts: [],
      episodesMax: 15,
      episodesStatisticsForDepartments: null,
      selectedDepartment: '13',
      selectedYear: new Date().getFullYear(),
      episodesStatisticsTotal: [],
      nbEpisodes: 0,
      key: 0,
      key2: 0
    };
  },
  methods: {
    hideAlert(): void {
      this.isAlertDisplayed = false;
    },
    showToast(): void {
      this.isToastVisible = true;
    },
    hideToast(): void {
      this.isToastVisible = false;
    },
    showCurrentEpisodes(): void {
      this.isCurrentEpisodesModalOpened = true;
    },
    hideCurrentEpisodes(): void {
      this.isCurrentEpisodesModalOpened = false;
    },
    displayMap(episode: any): void {
      this.selectedCurrentEpisodeDate = this.formatDate(episode.date_debut, 'short');
      this.selectedCurrentEpisodePollutant = episode.polluant.toLowerCase().replace('.', '_');
      this.key2++;
    },
    showStatistics(): void {
      this.isStatsModalOpened = true;
    },
    hideStatistics(): void {
      this.isStatsModalOpened = false;
    },
    changeYear(e: CustomEvent): void {
      this.selectedYear = e ? (e.target as any).value : this.selectedYear;
      this.nbEpisodes = this.episodesStatisticsTotal.find(res => res.annee === this.selectedYear).nbre_episodes;
    },
    changeDepartment(): void {
      this.key++;
    },
    formatDate(date: string, length: string): string {
      if (length === 'short') {
        return format(new Date(date), 'yyyy-MM-dd');
      }

      if (length === 'long') {
        return format(new Date(date), 'dd/MM/yyyy (HH:mm)');
      }
    },
    loadData(e: CustomEvent): void {
      setTimeout(() => {
        for (let i = this.episodesMax; i < (this.episodesMax + 15); i++) {
          if (this.episodesHistory[i] === undefined) {
            (e.target as any).disabled = true;
          } else {
            this.episodesParts.push(this.episodesHistory[i]);
          }
        }

        this.episodesMax += 15;
        (e.target as any).complete();
      }, 500);
    }
  },
  setup() {
    return {
      warning,
      checkmarkCircle,
      statsChart,
      compassOutline,
      calendarOutline,
      map,
      close
    }
  },
  mounted() {
    const reqAlerts = axios.get('https://preprod-api.atmosud.org/siam/v1/alertes');
    const reqEpisodes = axios.get('https://preprod-api.atmosud.org/siam/v1/episodes');
    const reqStatsDep = axios.get(`https://api.atmosud.org/episodes/statistiques?agrege=annee&format=json&annee_min=${new Date().getFullYear() - 4}`);
    const reqStatsTotal = axios.get('https://api.atmosud.org/episodes/statistiques/total?format=json');

    axios.all([reqAlerts, reqEpisodes, reqStatsDep, reqStatsTotal])
      .then(axios.spread((...responses) => {
        const resAlerts = responses[0];
        const resEpisodes = responses[1];
        const resStatsDep = responses[2];
        const resStatsTotal = responses[3];

        // Handle current episodes
        if (resAlerts.data.data.alertes.length > 0) {
          this.hasEpisode = true;
        }

        // Handle episodes history (and current episodes)
        this.episodes = resEpisodes.data.data.episodes;

        for (let episode of this.episodes) {
          if (episode.statut === 'historique') {
            this.episodesHistory.push(episode);
          }

          if (episode.statut === 'en cours') {
            this.currentEpisodes.push(episode);
          }
        }

        for (let i = 0; i < this.episodesMax; i++) {
          this.episodesParts.push(this.episodesHistory[i]);
        }

        // Handle episodes statistics
        this.episodesStatisticsForDepartments = resStatsDep.data;
        this.episodesStatisticsTotal = resStatsTotal.data;
        this.changeYear();
      }))
      .catch(() => {
        this.isAlertDisplayed = true;
      });
  }
});
</script>

<style scoped>
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

#map-btn {
  width: 90%;
  margin-top: 7px;
  margin-left: auto;
  margin-right: auto;
}

.zone-names {
  background-color: #e8e9ec;
}

.zone-names ion-item {
  --background: #e8e9ec;
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

ion-accordion.accordion-expanding ion-item[slot="header"],
ion-accordion.accordion-expanded ion-item[slot="header"] {
  border-left: solid 10px var(--ion-color-tertiary);
}

ion-card {
  margin-bottom: 20px;
}

ion-range {
  padding-bottom: 0;
}

ion-range::part(pin) {
  font-size: 10px;
  transform: translate3d(0px, -24px, 0px) scale(1);
}

.ios ion-range::part(pin) {
  transform: translate3d(0px, 0px, 0px) scale(1);
}
</style>
