<template>
  <div id="line-chart" ref="lineChart" v-if="!noMeasurementsMessage"></div>
  <p v-else>Mesures indisponibles : <strong>{{ selectedPollutant.label }}</strong></p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5locales_fr_FR from '@amcharts/amcharts5/locales/fr_FR';
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import { format } from 'date-fns';

interface myData {
  apiObj: any;
  selectedPollutant: any;
  selectedStationCode: string;
  accessType: string;
  stationInfo: any;
  pollutantInfo: any;
  noMeasurementsMessage: boolean;
  startDate: string;
  endDate: string;
}

export default defineComponent({
  name: 'MeasurementsChart',
  props: {
    api: Object,
    station: String,
    pollutant: Object,
    access: String,
    start: String,
    end: String
  },
  data(): myData {
    return {
      apiObj: this.api,
      selectedPollutant: this.pollutant,
      selectedStationCode: this.station,
      accessType: this.access,
      stationInfo: null,
      pollutantInfo: null,
      noMeasurementsMessage: false,
      startDate: this.start,
      endDate: this.end
    };
  },
  mounted(): void {
    this.stationInfo = this.apiObj.data.stations.find(station => station.station_id === this.selectedStationCode);

    if (this.selectedPollutant.methode_mesure) {
      if (this.selectedPollutant.methode_mesure === 'automatique') {
        this.pollutantInfo = this.stationInfo.polluants.find(pollutant => pollutant.polluant_id === this.selectedPollutant.polluant_id);
      } else { // manuelle
        this.pollutantInfo = this.stationInfo.polluants.find(pollutant => pollutant.polluant_id === this.selectedPollutant.polluant_id + '_diff');
      }
    } else {
      this.pollutantInfo = this.stationInfo.polluants.find(pollutant => pollutant.polluant_id === this.selectedPollutant.polluant_id);

      if (!this.pollutantInfo) {
        this.pollutantInfo = this.stationInfo.polluants.find(pollutant => pollutant.polluant_id === this.selectedPollutant.polluant_id + '_diff');
      }
    }

    if (this.pollutantInfo && (this.selectedPollutant.methode_mesure === 'automatique' || !this.pollutantInfo.polluant_id.includes('_diff')) && this.pollutantInfo.mesures.length > 0) {
      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      let root = am5.Root.new(this.$refs.lineChart as HTMLElement);
      root.locale = am5locales_fr_FR;


      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root)
      ]);


      // Create chart
      // https://www.amcharts.com/docs/v5/charts/xy-chart/
      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 0,
        paddingRight: 10,
        layout: root.verticalLayout
      }));

      chart.children.unshift(am5.Label.new(root, {
        text: this.selectedPollutant.methode_mesure ? `Mesure ${this.selectedPollutant.methode_mesure}` : '',
        fontSize: 15,
        fontWeight: '400',
        textAlign: 'center',
        x: am5.percent(50),
        centerX: am5.percent(50),
        y: 15,
        paddingTop: 0,
        paddingBottom: 0
      }));

      chart.children.unshift(am5.Label.new(root, {
        text: this.accessType === 'station' ? this.pollutantInfo.label : this.stationInfo.nom,
        fontSize: 17,
        fontWeight: '500',
        textAlign: 'center',
        x: am5.percent(50),
        centerX: am5.percent(50),
        y: -4,
        paddingTop: 0,
        paddingBottom: 0
      }));


      // Add cursor
      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      let cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
        behavior: 'none'
      }));
      cursor.lineY.set('visible', false);


      // Get data
      let data = [];

      for (let measurement of this.pollutantInfo.mesures) {
        let date = new Date(measurement.date_debut),
            validation = measurement.validation,
            txt = 'validé',
            color = '#21b3e8';

        if (validation === false) {
          txt = 'brut';
          color = '#ed576b';
        }

        data.push({
          date: date.getTime(),
          value: measurement.valeur,
          min: (measurement.courbes_references.length) ? measurement.courbes_references[0].valeur_basse : null,
          max: (measurement.courbes_references.length) ? measurement.courbes_references[0].valeur_haute : null,
          strokeSettings: {
            stroke: am5.color(color),
            strokeWidth: 2
          },
          tooltipSettings: {
            validation: txt
          }
        });
      }

      let timeUnit = '' as any,
          count = 0;

      switch (this.pollutantInfo.temporalite) {
        case 'quart-horaire':
          timeUnit = 'minute';
          count = 15;
          break;
        case 'horaire':
          timeUnit = 'hour';
          count = 1;
          break;
        case 'journaliere':
          timeUnit = 'day';
          count = 1;
          break;
        case 'mensuelle':
          timeUnit = 'month';
          count = 1;
          break;
        case 'annuelle':
          timeUnit = 'year';
          count = 1;
          break;
      }


      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: {
          timeUnit,
          count
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50
        }),
        tooltip: am5.Tooltip.new(root, {})
      }));

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {})
      }));

      yAxis.children.unshift(
        am5.Label.new(root, {
          rotation: -90,
          text: this.pollutantInfo.unite,
          y: am5.p50,
          centerX: am5.p50
        })
      );


      // Create ranges
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/
      for (let threshold of this.pollutantInfo.seuils) {
        let rangeDataItem = yAxis.makeDataItem({
          value: threshold.valeur,
          affectsMinMax: true
        });

        let range = yAxis.createAxisRange(rangeDataItem);

        range.get('grid').setAll({
          stroke: am5.color('#000000'),
          strokeWidth: 1,
          strokeOpacity: 1,
          strokeDasharray: 7
        });

        range.get('label').setAll({
          fill: am5.color('#000000'),
          text: threshold.label,
          fontSize: 12,
          inside: true,
          centerX: 0,
          centerY: 20
        });
      }


      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      let tooltip = am5.Tooltip.new(root, {
        getFillFromSprite: false
      });

      tooltip.label.set('text', `{valueY} ${this.pollutantInfo.unite} ({tooltipSettings.validation})`);
      tooltip.get('background').set('fill', am5.color('#fff'));
      tooltip.get('background').set('stroke', am5.color('#000'));

      let concentrations = chart.series.push(am5xy.LineSeries.new(root, {
        name: 'Concentrations mesurées',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
        connect: false,
        tooltip
      }));

      let ref = chart.series.push(am5xy.LineSeries.new(root, {
        name: this.pollutantInfo.courbes_references[0].label,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'max',
        openValueYField: 'min',
        valueXField: 'date',
        fill: am5.color('#21b3e8'),
        connect: false
      }));

      ref.fills.template.setAll({
        fillOpacity: 0.2,
        visible: true
      });

      concentrations.strokes.template.set('templateField', 'strokeSettings');
      ref.strokes.template.set('strokeOpacity', 0.2);


      // Set data
      concentrations.data.setAll(data);
      ref.data.setAll(data);


      // Legend
      // https://www.amcharts.com/docs/v5/concepts/legend/
      let legend = chart.children.push(am5.Legend.new(root, {
        x: am5.percent(50),
        centerX: am5.percent(50),
        marginTop: 15
      }));
      legend.data.setAll(chart.series.values);


      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      concentrations.appear(1000);
      ref.appear(1000);
      chart.appear(1000, 100);


      // Set exporting
      // https://www.amcharts.com/docs/v5/concepts/exporting/
      let dataExport = [];

      for (let measurement of this.pollutantInfo.mesures) {
        let txt = '';

        if (measurement.validation === false) {
          txt = 'brut';
        }

        if (measurement.validation === true) {
          txt = 'validé';
        }

        dataExport.push({
          date_heure: format(new Date(measurement.date_debut), 'dd/MM/yyyy HH:mm'),
          concentration: measurement.valeur,
          reference_min: (measurement.courbes_references.length) ? measurement.courbes_references[0].valeur_basse : null,
          reference_max: (measurement.courbes_references.length) ? measurement.courbes_references[0].valeur_haute : null,
          unite: this.pollutantInfo.unite,
          validation: txt,
          station: this.stationInfo.nom,
          polluant: this.pollutantInfo.label
        });
      }

      am5plugins_exporting.Exporting.new(root, {
        menu: am5plugins_exporting.ExportingMenu.new(root, {}),
        filePrefix: `mesures-automatiques_${this.stationInfo.station_id}_${this.pollutantInfo.nom}_${format(new Date(this.startDate), 'dd-MM-yyyy')}_${format(new Date(this.endDate), 'dd-MM-yyyy')}`,
        dataSource: dataExport,
        jpgOptions: {
          disabled: true
        },
        pdfOptions: {
          disabled: true
        },
        pdfdataOptions: {
          disabled: true
        }
      });

    } else if (this.pollutantInfo && (this.selectedPollutant.methode_mesure === 'manuelle' || this.pollutantInfo.polluant_id.includes('_diff')) && this.pollutantInfo.mesures.length > 0) {
      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      let root = am5.Root.new(this.$refs.lineChart as HTMLElement);
      root.locale = am5locales_fr_FR;


      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root)
      ]);


      // Create chart
      // https://www.amcharts.com/docs/v5/charts/xy-chart/
      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 0,
        paddingRight: 10,
        layout: root.verticalLayout
      }));

      chart.get('colors').set('step', 3);

      chart.children.unshift(am5.Label.new(root, {
        text: this.selectedPollutant.methode_mesure ? `Mesure ${this.selectedPollutant.methode_mesure}` : '',
        fontSize: 15,
        fontWeight: '400',
        textAlign: 'center',
        x: am5.percent(50),
        centerX: am5.percent(50),
        y: 15,
        paddingTop: 0,
        paddingBottom: 0
      }));

      chart.children.unshift(am5.Label.new(root, {
        text: this.accessType === 'station' ? this.pollutantInfo.label : this.stationInfo.nom,
        fontSize: 17,
        fontWeight: '500',
        textAlign: 'center',
        x: am5.percent(50),
        centerX: am5.percent(50),
        y: -4,
        paddingTop: 0,
        paddingBottom: 0
      }));


      // Add cursor
      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      chart.set('cursor', am5xy.XYCursor.new(root, {}));


      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: {
          timeUnit: 'day',
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50
        }),
        tooltip: am5.Tooltip.new(root, {})
      }));

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
      }));

      yAxis.children.unshift(
        am5.Label.new(root, {
          rotation: -90,
          text: this.pollutantInfo.unite,
          y: am5.p50,
          centerX: am5.p50
        })
      );


      // Create series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        baseAxis: yAxis,
        valueXField: 'close',
        openValueXField: 'open',
        valueYField: 'concentration'
      }));

      series.columns.template.setAll({
        height: 0.5
      });

      series.bullets.push(function() {
        return am5.Bullet.new(root, {
          locationX: 0,
          sprite: am5.Circle.new(root, {
            radius: 2,
            fill: series.get('fill')
          })
        })
      })

      series.bullets.push(function() {
        return am5.Bullet.new(root, {
          locationX: 1,
          sprite: am5.Circle.new(root, {
            radius: 2,
            fill: series.get('fill')
          })
        })
      })

      // Set data
      let data = [];

      for (let measurement of this.pollutantInfo.mesures) {
        data.push({
          concentration: measurement.valeur,
          open: new Date(measurement.date_debut).getTime(),
          close: new Date(measurement.date_fin).getTime()
        });
      }

      yAxis.data.setAll(data);
      series.data.setAll(data);


      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear(1000);
      chart.appear(1000, 100);


      // Set exporting
      // https://www.amcharts.com/docs/v5/concepts/exporting/
      let dataExport = [];

      for (let measurement of this.pollutantInfo.mesures) {
        dataExport.push({
          date_debut: format(new Date(measurement.date_debut), 'dd/MM/yyyy HH:mm'),
          date_fin: format(new Date(measurement.date_fin), 'dd/MM/yyyy HH:mm'),
          concentration: measurement.valeur,
          unite: this.pollutantInfo.unite,
          station: this.stationInfo.nom,
          polluant: this.pollutantInfo.label
        });
      }

      am5plugins_exporting.Exporting.new(root, {
        menu: am5plugins_exporting.ExportingMenu.new(root, {}),
        filePrefix: `mesures-differees_${this.stationInfo.station_id}_${this.pollutantInfo.nom}_${format(new Date(this.startDate), 'dd-MM-yyyy')}_${format(new Date(this.endDate), 'dd-MM-yyyy')}`,
        dataSource: dataExport,
        jpgOptions: {
          disabled: true
        },
        pdfOptions: {
          disabled: true
        },
        pdfdataOptions: {
          disabled: true
        }
      });

    } else {
      this.noMeasurementsMessage = true;
    }
  }
});
</script>

<style scoped>
#line-chart {
  width: 100%;
  height: 350px;
}
</style>

