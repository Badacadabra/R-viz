<template>
  <div id="bar-chart" ref="barChart"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5locales_fr_FR from '@amcharts/amcharts5/locales/fr_FR';
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

interface myData {
  apiObj: any;
  departmentCode: string;
}

export default defineComponent({
  name: 'EpisodesChart',
  props: {
    api: Object,
    dep: String
  },
  data(): myData {
    return {
      apiObj: this.api,
      departmentCode: this.dep
    };
  },
  mounted(): void {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    let root = am5.Root.new(this.$refs.barChart as HTMLElement);
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
      wheelX: 'panX',
      wheelY: 'zoomX',
      layout: root.verticalLayout
    }));


    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        dx: 20,
        layout: root.horizontalLayout
      })
    );

    legend.markers.template.setAll({
      width: 12,
      height: 12
    });

    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 20,
      cornerRadiusTR: 20,
      cornerRadiusBL: 20,
      cornerRadiusBR: 20
    });


    // Add data
    let data = [];
    const pollutants = this.apiObj[this.departmentCode].polluants;

    for (let i = (new Date().getFullYear() - 4); i < new Date().getFullYear(); i++) {
      data.push({
        year: i + '',
        o3: (pollutants.O3 !== undefined && pollutants.O3[i] !== undefined) ? pollutants.O3[i].nbre_episodes : 0,
        pm10: (pollutants.PM10 !== undefined && pollutants.PM10[i] !== undefined) ? pollutants.PM10[i].nbre_episodes : 0
      });
    }


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: 'year',
      renderer: am5xy.AxisRendererX.new(root, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
        minGridDistance: 30
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    xAxis.data.setAll(data);

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    yAxis.children.unshift(am5.Label.new(root, {
      text: 'Nombre de jours',
      textAlign: 'center',
      x: am5.percent(50),
      centerX: am5.percent(50),
      y: am5.percent(50),
      centerY: am5.percent(50),
      rotation: -90,
      paddingTop: 0,
      paddingBottom: 15
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name, fieldName) {
      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        categoryXField: 'year'
      }));

      series.columns.template.setAll({
        tooltipText: '{valueY}',
        width: am5.percent(90),
        tooltipY: 0
      });

      series.data.setAll(data);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: '{valueY}',
            fill: root.interfaceColors.get('alternativeText'),
            centerY: 0,
            centerX: am5.p50,
            populateText: true
          })
        });
      });

      legend.data.push(series);
    }

    makeSeries('Ozone', 'o3');
    makeSeries('PM10', 'pm10');


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);


    // Set exporting
    // https://www.amcharts.com/docs/v5/concepts/exporting/
    let dataExport = [];

    for (let i = (new Date().getFullYear() - 4); i < new Date().getFullYear(); i++) {
      dataExport.push({
        annee: i + '',
        nb_episodes_o3: (pollutants.O3 !== undefined && pollutants.O3[i] !== undefined) ? pollutants.O3[i].nbre_episodes : 0,
        nb_episodes_pm10: (pollutants.PM10 !== undefined && pollutants.PM10[i] !== undefined) ? pollutants.PM10[i].nbre_episodes : 0,
        unite: 'Nombre de jours',
        departement: this.departmentCode
      });
    }

    am5plugins_exporting.Exporting.new(root, {
      menu: am5plugins_exporting.ExportingMenu.new(root, {}),
      filePrefix: `episodes_o3_pm10_${this.departmentCode}`,
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
  }
});
</script>

<style scoped>
#bar-chart {
  width: 100%;
  height: 350px;
}
</style>

