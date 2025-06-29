import { useEffect, useRef, useState, use } from "react";
import {
  utilityPointLayer1,
  utilityLineLayer1,
  utilityPointLayer,
  utilityLineLayer,
} from "../layers";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import Query from "@arcgis/core/rest/support/Query";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";

import "../App.css";
import {
  generatePointLineChartData,
  generateTotalProgress,
  generateUtilLineChartData,
  generateUtilLineProgress,
  generateUtilPointChartData,
  generateUtilPointProgress,
  thousands_separators,
  zoomToLayer,
} from "../Query";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-panel";
import {
  CalciteShellPanel,
  CalcitePanel,
} from "@esri/calcite-components-react";
import { primaryLabelColor, valueLabelColor } from "../UniqueValues";
import { MyContext } from "../App";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

// Draw chart
const Chart = () => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const { stations, companies, utilityTypes } = use(MyContext);
  const station = stations;
  const company = companies;
  const type = utilityTypes;

  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [chartData, setChartData] = useState([]);
  const [progress, setProgress] = useState([]);

  const chartID = "utility-bar";
  const [featureLayer, setFeatureLayer] =
    useState<FeatureLayer>(utilityPointLayer1);
  const [pointFeatureLayer, setPointFeatureLayer] =
    useState<FeatureLayer>(utilityPointLayer1);
  const [lineFeatureLayer, setLineFeatureLayer] =
    useState<FeatureLayer>(utilityLineLayer1);
  const [pointFeatureLayer1, setPointFeatureLayer1] =
    useState<FeatureLayer>(utilityPointLayer);
  const [lineFeatureLayer1, setLineFeatureLayer1] =
    useState<FeatureLayer>(utilityLineLayer);

  useEffect(() => {
    if (type === "Point") {
      generateUtilPointChartData({ station, company }).then((response: any) => {
        zoomToLayer(utilityPointLayer, arcgisScene);
        setChartData(response);
      });

      generateUtilPointProgress({ station, company }).then((response: any) => {
        setProgress(response);
      });

      setFeatureLayer(utilityPointLayer1);
    } else if (type === "Line") {
      generateUtilLineChartData({ station, company }).then((response: any) => {
        setChartData(response);
        zoomToLayer(utilityLineLayer, arcgisScene);
      });

      generateUtilLineProgress({ station, company }).then((response: any) => {
        setProgress(response);
      });

      setFeatureLayer(utilityLineLayer1);
    } else if (type === undefined) {
      // Point + Line
      generatePointLineChartData({ station, company }).then((response: any) => {
        setChartData(response);
      });

      generateTotalProgress({ station, company }).then((response: any) => {
        setProgress(response);
      });

      zoomToLayer(utilityPointLayer, arcgisScene).then(
        zoomToLayer(utilityLineLayer, arcgisScene)
      );

      setLineFeatureLayer(utilityLineLayer1);
      setPointFeatureLayer(utilityPointLayer1);

      setLineFeatureLayer1(utilityLineLayer);
      setPointFeatureLayer1(utilityPointLayer);
    }
  }, [station, company, type, type]);

  // type
  const types = [
    {
      category: "Telecom",
      value: 1,
    },
    {
      category: "Water",
      value: 2,
    },
    {
      category: "Sewage",
      value: 3,
    },
    {
      category: "Power",
      value: 4,
    },
    {
      category: "Safety",
      value: 5,
    },
    {
      category: "Drainage",
      value: 6,
    },
    {
      category: "Gas",
      value: 7,
    },
  ];

  // Define parameters
  const marginTop = 0;
  const marginLeft = 0;
  const marginRight = 0;
  const marginBottom = 0;
  const paddingTop = 10;
  const paddingLeft = 5;
  const paddingRight = 5;
  const paddingBottom = 0;

  const xAxisNumberFormat = "#'%'";
  const seriesBulletLabelFontSize = "1vw";

  // axis label
  const yAxisLabelFontSize = "0.8vw";
  const xAxisLabelFontSize = "0.8vw";
  const legendFontSize = "0.8vw";

  // 1.1. Point
  const chartIconWidth = 35;
  const chartIconHeight = 35;
  const chartIconPositionX = -21;
  const chartPaddingRightIconLabel = 45;

  const chartSeriesFillColorComp = "#0070ff";
  const chartSeriesFillColorIncomp = "#000000";
  const chartBorderLineColor = "#00c5ff";
  const chartBorderLineWidth = 0.4;

  // Utility Chart
  useEffect(() => {
    maybeDisposeRoot(chartID);

    var root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
        marginTop: marginTop,
        marginLeft: marginLeft,
        marginRight: marginRight,
        marginBottom: marginBottom,
        paddingTop: paddingTop,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        paddingBottom: paddingBottom,
        scale: 1,
        height: am5.percent(100),
      })
    );
    chartRef.current = chart;

    var yRenderer = am5xy.AxisRendererY.new(root, {
      inversed: true,
    });
    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: yRenderer,
        bullet: function (root, axis, dataItem: any) {
          return am5xy.AxisBullet.new(root, {
            location: 0.5,
            sprite: am5.Picture.new(root, {
              width: chartIconWidth,
              height: chartIconHeight,
              centerY: am5.p50,
              centerX: am5.p50,
              x: chartIconPositionX,
              src: dataItem.dataContext.icon,
            }),
          });
        },
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    yRenderer.labels.template.setAll({
      paddingRight: chartPaddingRightIconLabel,
    });

    yRenderer.grid.template.setAll({
      location: 1,
    });

    // Label properties Y axis
    yAxis.get("renderer").labels.template.setAll({
      oversizedBehavior: "wrap",
      textAlign: "center",
      fill: am5.color("#ffffff"),
      //maxWidth: 150,
      fontSize: yAxisLabelFontSize,
    });
    yAxis.data.setAll(chartData);

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 100,
        strictMinMax: true,
        numberFormat: xAxisNumberFormat,
        calculateTotals: true,
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0,
          strokeWidth: 1,
          stroke: am5.color("#ffffff"),
        }),
      })
    );

    xAxis.get("renderer").labels.template.setAll({
      //oversizedBehavior: "wrap",
      textAlign: "center",
      fill: am5.color("#ffffff"),
      //maxWidth: 150,
      fontSize: xAxisLabelFontSize,
    });

    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        centerY: am5.percent(50),
        x: am5.percent(60),
        y: am5.percent(97),
        marginTop: 10,
      })
    );
    legendRef.current = legend;

    legend.labels.template.setAll({
      oversizedBehavior: "truncate",
      fill: am5.color("#ffffff"),
      fontSize: legendFontSize,
      scale: 0.9,
      //textDecoration: "underline"
      width: am5.percent(200),
      //fontWeight: '300',
    });

    function makeSeries(name: any, fieldName: any) {
      var series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          stacked: true,
          xAxis: xAxis,
          yAxis: yAxis,
          baseAxis: yAxis,
          valueXField: fieldName,
          valueXShow: "valueXTotalPercent",
          categoryYField: "category",
          fill:
            fieldName === "incomp"
              ? am5.color(chartSeriesFillColorIncomp)
              : am5.color(chartSeriesFillColorComp),
          stroke: am5.color(chartBorderLineColor),
        })
      );

      series.columns.template.setAll({
        tooltipText: "{name}: {valueX}", // "{categoryY}: {valueX}",
        tooltipY: am5.percent(90),
        //fill: am5.color("#ffffff")
        // 100% transparent for incomplete
        fillOpacity: fieldName === "incomp" ? 0 : 1,
        strokeWidth: chartBorderLineWidth,
        //strokeOpacity: 0,
      });
      series.data.setAll(chartData);

      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text:
              fieldName === 0 ? "" : "{valueXTotalPercent.formatNumber('#.')}%", //"{valueX}",
            fill: root.interfaceColors.get("alternativeText"),
            opacity: fieldName === "incomp" ? 0 : 1,
            fontSize: seriesBulletLabelFontSize,
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });

      // Click event
      series.columns.template.events.on("click", (ev) => {
        const selected: any = ev.target.dataItem?.dataContext;
        const categorySelect: string = selected.category;
        const find = types.find((emp: any) => emp.category === categorySelect);
        const typeSelect = find?.value;

        const selectedStatus: number | null = fieldName === "incomp" ? 0 : 1;

        //
        const qStation = "Station1 = '" + station + "'";
        const qCompany = "Company = '" + company + "'";
        const qType = "Type = '" + type + "'";
        const qUtilType = "UtilType = " + typeSelect;
        const qStatus = "Status = " + selectedStatus;
        const qUtilTypeStatus = qUtilType + " AND " + qStatus;
        const qStationUtilTypeStatus = qStation + " AND " + qUtilTypeStatus;
        const qStationCompanyUtiltypeStatus =
          qStation + " AND " + qCompany + " AND " + qUtilTypeStatus;
        const qStationCompanyUtiltypeStatusType =
          qStationCompanyUtiltypeStatus + " AND " + qType;

        const qExpression = !station
          ? qUtilTypeStatus
          : station && !company
          ? qStationUtilTypeStatus
          : station && company && !type
          ? qStationCompanyUtiltypeStatus
          : qStationCompanyUtiltypeStatusType;

        console.log(qExpression);

        console.log(
          "station: ",
          station,
          ", utilType: ",
          typeSelect,
          ", company: ",
          company,
          ", pointLine: ",
          type,
          ", Status: ",
          selectedStatus
        );

        // Define Query
        var query = featureLayer.createQuery();
        // query.where = station === undefined ? sqlExpression : sqlExpressionWithCP;
        query.where = qExpression;

        //let arrLviews: any = [];
        //----- Utility Point Feature Filter ---------- //
        let highlightSelect: any;
        arcgisScene?.whenLayerView(pointFeatureLayer).then((layerView: any) => {
          //arrLviews.push(layerView);
          pointFeatureLayer.queryFeatures(query).then((results: any) => {
            if (results.features.length === 0) {
            } else {
              const lengths = results.features;
              const rows = lengths.length;

              let objID = [];
              for (var i = 0; i < rows; i++) {
                var obj = results.features[i].attributes.OBJECTID;
                objID.push(obj);
              }

              var queryExt = new Query({
                objectIds: objID,
              });

              pointFeatureLayer.queryExtent(queryExt).then((result: any) => {
                if (result.extent) {
                  arcgisScene?.view.goTo(result.extent);
                }
              });

              if (highlightSelect) {
                highlightSelect.remove();
              }
              highlightSelect = layerView.highlight(objID);

              arcgisScene?.view.on("click", () => {
                layerView.filter = new FeatureFilter({
                  where: undefined,
                });
                highlightSelect.remove();
              });
            }
          });
          layerView.filter = new FeatureFilter({
            where: qExpression,
          });

          // For initial state, we need to add this
          arcgisScene?.view.on("click", () => {
            layerView.filter = new FeatureFilter({
              where: undefined,
            });
            highlightSelect !== undefined
              ? highlightSelect.remove()
              : console.log("");
          });
        });

        let highlightSelect11: any;
        arcgisScene
          ?.whenLayerView(pointFeatureLayer1)
          .then((layerView: any) => {
            //arrLviews.push(layerView);
            pointFeatureLayer1.queryFeatures(query).then((results: any) => {
              if (results.features.length === 0) {
              } else {
                const lengths = results.features;
                const rows = lengths.length;

                let objID = [];
                for (var i = 0; i < rows; i++) {
                  var obj = results.features[i].attributes.OBJECTID;
                  objID.push(obj);
                }

                var queryExt = new Query({
                  objectIds: objID,
                });

                pointFeatureLayer1.queryExtent(queryExt).then((result: any) => {
                  if (result.extent) {
                    arcgisScene?.view.goTo(result.extent);
                  }
                });

                if (highlightSelect11) {
                  highlightSelect11.remove();
                }
                highlightSelect11 = layerView.highlight(objID);

                arcgisScene?.view.on("click", () => {
                  layerView.filter = new FeatureFilter({
                    where: undefined,
                  });
                  highlightSelect11.remove();
                });
              }
            });
            layerView.filter = new FeatureFilter({
              where: qExpression,
            });

            // For initial state, we need to add this
            arcgisScene?.view.on("click", () => {
              layerView.filter = new FeatureFilter({
                where: undefined,
              });
              highlightSelect11 !== undefined
                ? highlightSelect11.remove()
                : console.log("");
            });
          });

        //----- Utility Line Feature Filter ---------- //
        let highlightSelect2: any;
        arcgisScene?.whenLayerView(lineFeatureLayer).then((layerView: any) => {
          //arrLviews.push(layerView);

          lineFeatureLayer.queryFeatures(query).then((results: any) => {
            if (results.features.length === 0) {
            } else {
              const lengths = results.features;
              const rows = lengths.length;

              let objID = [];
              for (var i = 0; i < rows; i++) {
                var obj = results.features[i].attributes.OBJECTID;
                objID.push(obj);
              }

              var queryExt = new Query({
                objectIds: objID,
              });

              lineFeatureLayer.queryExtent(queryExt).then((result: any) => {
                if (result.extent) {
                  arcgisScene?.view.goTo(result.extent);
                }
              });

              if (highlightSelect2) {
                highlightSelect2.remove();
              }
              highlightSelect2 = layerView.highlight(objID);

              arcgisScene?.view.on("click", () => {
                layerView.filter = new FeatureFilter({
                  where: undefined,
                });
                highlightSelect2.remove();
              });
            }
          });
          layerView.filter = new FeatureFilter({
            where: qExpression,
          });
          // For initial state, we need to add this
          arcgisScene?.view.on("click", () => {
            layerView.filter = new FeatureFilter({
              where: undefined,
            });
            highlightSelect2 !== undefined
              ? highlightSelect2.remove()
              : console.log("");
          });
        });

        let highlightSelect22: any;
        arcgisScene?.whenLayerView(lineFeatureLayer1).then((layerView: any) => {
          //arrLviews.push(layerView);

          lineFeatureLayer1.queryFeatures(query).then((results: any) => {
            if (results.features.length === 0) {
            } else {
              const lengths = results.features;
              const rows = lengths.length;

              let objID = [];
              for (var i = 0; i < rows; i++) {
                var obj = results.features[i].attributes.OBJECTID;
                objID.push(obj);
              }

              var queryExt = new Query({
                objectIds: objID,
              });

              lineFeatureLayer1.queryExtent(queryExt).then((result: any) => {
                if (result.extent) {
                  arcgisScene?.view.goTo(result.extent);
                }
              });

              if (highlightSelect22) {
                highlightSelect22.remove();
              }
              highlightSelect22 = layerView.highlight(objID);

              arcgisScene?.view.on("click", () => {
                layerView.filter = new FeatureFilter({
                  where: undefined,
                });
                highlightSelect22.remove();
              });
            }
          });
          layerView.filter = new FeatureFilter({
            where: qExpression,
          });
          // For initial state, we need to add this
          arcgisScene?.view.on("click", () => {
            layerView.filter = new FeatureFilter({
              where: undefined,
            });
            highlightSelect22 !== undefined
              ? highlightSelect22.remove()
              : console.log("");
          });
        });
      });
      legend.data.push(series);
    }
    makeSeries("Complete", "comp");
    makeSeries("Incomplete", "incomp");
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  });

  return (
    <>
      <div
        slot="panel-end"
        style={{
          borderStyle: "solid",
          borderRightWidth: 5,
          borderLeftWidth: 5,
          borderBottomWidth: 5,
        }}
      >
        <div
          style={{
            color: primaryLabelColor,
            fontSize: "1.2rem",
            marginLeft: "13px",
            marginTop: "15px",
            marginBottom: "6px",
          }}
        >
          TOTAL PROGRESS
        </div>

        <div
          style={{
            color: valueLabelColor,
            fontSize: "2.5rem",
            fontWeight: "bold",
            fontFamily: "calibri",
            lineHeight: "1.2",
            marginLeft: "30px",
          }}
        >
          {thousands_separators(progress[1])} %
        </div>
        <div
          style={{
            color: valueLabelColor,
            fontSize: "1rem",
            fontFamily: "calibri",
            lineHeight: "1.2",
            marginLeft: "30px",
          }}
        >
          ({thousands_separators(progress[0])})
        </div>
        <img
          src="https://EijiGorilla.github.io/Symbols/Utility_Logo.png"
          alt="Utility Logo"
          height={"75px"}
          width={"75px"}
          style={{ marginLeft: "70%", display: "flex", marginTop: "-80px" }}
        />

        <div
          id={chartID}
          style={{
            width: "23vw",
            height: "68vh",
            backgroundColor: "rgb(0,0,0,0)",
            color: "white",
            marginRight: "10px",
            marginTop: "30px",
          }}
        ></div>
      </div>
    </>
  );
};

export default Chart;
