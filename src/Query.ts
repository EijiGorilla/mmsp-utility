import {
  dateTable,
  utilityLineLayer,
  utilityLineLayer1,
  utilityPointLayer,
  // // stationStructureLayer,
  utilityPointLayer1,
} from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";

// Updat date
export async function dateUpdate() {
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const query = dateTable.createQuery();
  query.where = "category = 'Utility Relocation'";

  return dateTable.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const dates = stats.map((result: any) => {
      const date = new Date(result.attributes.date);
      const year = date.getFullYear();
      const month = monthList[date.getMonth()];
      const day = date.getDate();
      const final = year < 1990 ? "" : `${month} ${day}, ${year}`;
      return final;
    });
    return dates;
  });
}

// Generate chart data
const uitlType = [
  "Telecom",
  "Water",
  "Sewage",
  "Power",
  "Safety",
  "Drainage",
  "Gas",
];

export async function generateUtilPointChartData({ station, company }: any) {
  var total_telecom_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 1 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_telecom_incomp",
    statisticType: "sum",
  });

  var total_telecom_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 1 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_telecom_comp",
    statisticType: "sum",
  });

  var total_water_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 2 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_water_incomp",
    statisticType: "sum",
  });

  var total_water_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 2 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_water_comp",
    statisticType: "sum",
  });

  var total_sewage_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 3 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_sewage_incomp",
    statisticType: "sum",
  });

  var total_sewage_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 3 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_sewage_comp",
    statisticType: "sum",
  });

  var total_power_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 4 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_power_incomp",
    statisticType: "sum",
  });

  var total_power_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 4 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_power_comp",
    statisticType: "sum",
  });

  var total_safety_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 5 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_safety_incomp",
    statisticType: "sum",
  });

  var total_safety_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 5 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_safety_comp",
    statisticType: "sum",
  });

  var total_drainage_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 6 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_drainage_incomp",
    statisticType: "sum",
  });

  var total_drainage_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 6 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_drainage_comp",
    statisticType: "sum",
  });

  var total_gas_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 7 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_gas_incomp",
    statisticType: "sum",
  });

  var total_gas_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 7 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_gas_comp",
    statisticType: "sum",
  });

  // Query
  var query = utilityPointLayer.createQuery();
  query.outStatistics = [
    total_telecom_incomp,
    total_telecom_comp,
    total_water_incomp,
    total_water_comp,
    total_sewage_incomp,
    total_sewage_comp,
    total_power_incomp,
    total_power_comp,
    total_safety_incomp,
    total_safety_comp,
    total_drainage_incomp,
    total_drainage_comp,
    total_gas_incomp,
    total_gas_comp,
  ];

  // Query
  const qStation = "Station1 = '" + station + "'";
  const qCompany = "Company = '" + company + "'";
  const qStationCompany = qStation + " AND " + qCompany;

  const finalExpression = station && !company ? qStation : qStationCompany;

  query.where = finalExpression;
  utilityPointLayer.definitionExpression = finalExpression;
  utilityPointLayer1.definitionExpression = finalExpression;
  // stationStructureLayer.definitionExpression = qStation;
  utilityPointLayer.visible = true;
  utilityPointLayer1.visible = true;
  utilityLineLayer.visible = false;
  utilityLineLayer1.visible = false;

  return utilityPointLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const telecom_incomp = stats.total_telecom_incomp;
    const telecom_comp = stats.total_telecom_comp;
    const water_incomp = stats.total_water_incomp;
    const water_comp = stats.total_water_comp;
    const sewage_incomp = stats.total_sewage_incomp;
    const sewage_comp = stats.total_sewage_comp;
    const power_incomp = stats.total_power_incomp;
    const power_comp = stats.total_power_comp;
    const safety_incomp = stats.total_safety_incomp;
    const safety_comp = stats.total_safety_comp;
    const drainage_incomp = stats.total_drainage_incomp;
    const drainage_comp = stats.total_drainage_comp;
    const gas_incomp = stats.total_gas_incomp;
    const gas_comp = stats.total_gas_comp;

    const data = [
      {
        category: uitlType[0],
        comp: telecom_comp,
        incomp: telecom_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Telecom_Logo2.svg",
      },
      {
        category: uitlType[1],
        comp: water_comp,
        incomp: water_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Water_Logo2.svg",
      },
      {
        category: uitlType[2],
        comp: sewage_comp,
        incomp: sewage_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Sewage_Logo2.svg",
      },
      {
        category: uitlType[3],
        comp: power_comp,
        incomp: power_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Power_Logo2.svg",
      },
      {
        category: uitlType[4],
        comp: safety_comp,
        incomp: safety_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Safety.svg",
      },
      {
        category: uitlType[5],
        comp: drainage_comp,
        incomp: drainage_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Drainage.svg",
      },
      {
        category: uitlType[6],
        comp: gas_comp,
        incomp: gas_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Gas_Logo2.svg",
      },
    ];
    return data;
  });
}

export async function generateUtilLineChartData({ station, company }: any) {
  var total_telecom_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 1 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_telecom_incomp",
    statisticType: "sum",
  });

  var total_telecom_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 1 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_telecom_comp",
    statisticType: "sum",
  });

  var total_water_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 2 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_water_incomp",
    statisticType: "sum",
  });

  var total_water_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 2 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_water_comp",
    statisticType: "sum",
  });

  var total_sewage_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 3 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_sewage_incomp",
    statisticType: "sum",
  });

  var total_sewage_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 3 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_sewage_comp",
    statisticType: "sum",
  });

  var total_power_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 4 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_power_incomp",
    statisticType: "sum",
  });

  var total_power_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 4 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_power_comp",
    statisticType: "sum",
  });

  var total_safety_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 5 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_safety_incomp",
    statisticType: "sum",
  });

  var total_safety_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 5 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_safety_comp",
    statisticType: "sum",
  });

  var total_drainage_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 6 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_drainage_incomp",
    statisticType: "sum",
  });

  var total_drainage_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 6 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_drainage_comp",
    statisticType: "sum",
  });

  var total_gas_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 7 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_gas_incomp",
    statisticType: "sum",
  });

  var total_gas_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 7 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_gas_comp",
    statisticType: "sum",
  });

  // Query
  var query = utilityLineLayer.createQuery();
  query.outStatistics = [
    total_telecom_incomp,
    total_telecom_comp,
    total_water_incomp,
    total_water_comp,
    total_sewage_incomp,
    total_sewage_comp,
    total_power_incomp,
    total_power_comp,
    total_safety_incomp,
    total_safety_comp,
    total_drainage_incomp,
    total_drainage_comp,
    total_gas_incomp,
    total_gas_comp,
  ];

  // Query
  const qStation = "Station1 = '" + station + "'";
  const qCompany = "Company = '" + company + "'";
  const qStationCompany = qStation + " AND " + qCompany;

  const finalExpression = station && !company ? qStation : qStationCompany;

  query.where = finalExpression;
  utilityLineLayer.definitionExpression = finalExpression;
  utilityLineLayer1.definitionExpression = finalExpression;
  // stationStructureLayer.definitionExpression = qStation;
  utilityLineLayer.visible = true;
  utilityLineLayer1.visible = true;
  utilityPointLayer.visible = false;
  utilityPointLayer1.visible = false;

  return utilityLineLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const telecom_incomp = stats.total_telecom_incomp;
    const telecom_comp = stats.total_telecom_comp;
    const water_incomp = stats.total_water_incomp;
    const water_comp = stats.total_water_comp;
    const sewage_incomp = stats.total_sewage_incomp;
    const sewage_comp = stats.total_sewage_comp;
    const power_incomp = stats.total_power_incomp;
    const power_comp = stats.total_power_comp;
    const safety_incomp = stats.total_safety_incomp;
    const safety_comp = stats.total_safety_comp;
    const drainage_incomp = stats.total_drainage_incomp;
    const drainage_comp = stats.total_drainage_comp;
    const gas_incomp = stats.total_gas_incomp;
    const gas_comp = stats.total_gas_comp;

    const data = [
      {
        category: uitlType[0],
        comp: telecom_comp,
        incomp: telecom_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Telecom_Logo2.svg",
      },
      {
        category: uitlType[1],
        comp: water_comp,
        incomp: water_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Water_Logo2.svg",
      },
      {
        category: uitlType[2],
        comp: sewage_comp,
        incomp: sewage_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Sewage_Logo2.svg",
      },
      {
        category: uitlType[3],
        comp: power_comp,
        incomp: power_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Power_Logo2.svg",
      },
      {
        category: uitlType[4],
        comp: safety_comp,
        incomp: safety_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Safety.svg",
      },
      {
        category: uitlType[5],
        comp: drainage_comp,
        incomp: drainage_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Drainage.svg",
      },
      {
        category: uitlType[6],
        comp: gas_comp,
        incomp: gas_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Gas_Logo2.svg",
      },
    ];
    return data;
  });
}

export async function generatePointLineChartData({ station, company }: any) {
  var total_telecom_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 1 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_telecom_incomp",
    statisticType: "sum",
  });

  var total_telecom_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 1 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_telecom_comp",
    statisticType: "sum",
  });

  var total_water_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 2 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_water_incomp",
    statisticType: "sum",
  });

  var total_water_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 2 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_water_comp",
    statisticType: "sum",
  });

  var total_sewage_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 3 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_sewage_incomp",
    statisticType: "sum",
  });

  var total_sewage_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 3 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_sewage_comp",
    statisticType: "sum",
  });

  var total_power_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 4 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_power_incomp",
    statisticType: "sum",
  });

  var total_power_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 4 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_power_comp",
    statisticType: "sum",
  });

  var total_safety_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 5 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_safety_incomp",
    statisticType: "sum",
  });

  var total_safety_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 5 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_safety_comp",
    statisticType: "sum",
  });

  var total_drainage_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 6 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_drainage_incomp",
    statisticType: "sum",
  });

  var total_drainage_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 6 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_drainage_comp",
    statisticType: "sum",
  });

  var total_gas_incomp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 7 and Status = 0) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_gas_incomp",
    statisticType: "sum",
  });

  var total_gas_comp = new StatisticDefinition({
    onStatisticField:
      "CASE WHEN (UtilType = 7 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_gas_comp",
    statisticType: "sum",
  });

  var query = new Query();
  query.outStatistics = [
    total_telecom_incomp,
    total_telecom_comp,
    total_water_incomp,
    total_water_comp,
    total_sewage_incomp,
    total_sewage_comp,
    total_power_incomp,
    total_power_comp,
    total_safety_incomp,
    total_safety_comp,
    total_drainage_incomp,
    total_drainage_comp,
    total_gas_incomp,
    total_gas_comp,
  ];

  // Query
  const defaultExpression = "1=1";
  const qStation = "Station1 = '" + station + "'";
  const qCompany = "Company = '" + company + "'";
  const qStationCompany = qStation + " AND " + qCompany;
  const finalExpression = station && !company ? qStation : qStationCompany;

  const layerVisibleTrue = () => {
    utilityLineLayer.visible = true;
    utilityLineLayer1.visible = true;
    utilityPointLayer.visible = true;
    utilityPointLayer1.visible = true;
  };

  if (station === undefined) {
    query.where = defaultExpression;
    utilityPointLayer.definitionExpression = defaultExpression;
    utilityPointLayer1.definitionExpression = defaultExpression;
    utilityLineLayer.definitionExpression = defaultExpression;
    utilityLineLayer1.definitionExpression = defaultExpression;
    // stationStructureLayer.definitionExpression = '1=1';
    layerVisibleTrue();
  } else {
    query.where = finalExpression;
    utilityPointLayer.definitionExpression = finalExpression;
    utilityPointLayer1.definitionExpression = finalExpression;
    utilityLineLayer.definitionExpression = finalExpression;
    utilityLineLayer1.definitionExpression = finalExpression;
    // stationStructureLayer.definitionExpression = qStation;

    layerVisibleTrue();
  }

  const pointCompile = utilityPointLayer
    .queryFeatures(query)
    .then((response: any) => {
      var stats = response.features[0].attributes;

      const gas_comp = stats.total_gas_comp;
      const gas_incomp = stats.total_gas_incomp;
      const safety_comp = stats.total_safety_comp;
      const safety_incomp = stats.total_safety_incomp;
      const water_comp = stats.total_water_comp;
      const water_incomp = stats.total_water_incomp;
      const drainage_comp = stats.total_drainage_comp;
      const drainage_incomp = stats.total_drainage_incomp;
      const sewage_comp = stats.total_sewage_comp;
      const sewage_incomp = stats.total_sewage_incomp;
      const power_comp = stats.total_power_comp;
      const power_incomp = stats.total_power_incomp;
      const telecom_comp = stats.total_telecom_comp;
      const telecom_incomp = stats.total_telecom_incomp;

      return [
        gas_comp, //0
        gas_incomp, //1
        safety_comp, //2
        safety_incomp, //3
        water_comp, //4
        water_incomp, //5
        drainage_comp, //6
        drainage_incomp, //7
        sewage_comp, //8
        sewage_incomp, //9
        power_comp, //10
        power_incomp, //11
        telecom_comp, //12
        telecom_incomp, //13
      ];
    });

  const lineCompile = utilityLineLayer
    .queryFeatures(query)
    .then((response: any) => {
      var stats = response.features[0].attributes;
      const gas_comp = stats.total_gas_comp;
      const gas_incomp = stats.total_gas_incomp;
      const safety_comp = stats.total_safety_comp;
      const safety_incomp = stats.total_safety_incomp;
      const water_comp = stats.total_water_comp;
      const water_incomp = stats.total_water_incomp;
      const drainage_comp = stats.total_drainage_comp;
      const drainage_incomp = stats.total_drainage_incomp;
      const sewage_comp = stats.total_sewage_comp;
      const sewage_incomp = stats.total_sewage_incomp;
      const power_comp = stats.total_power_comp;
      const power_incomp = stats.total_power_incomp;
      const telecom_comp = stats.total_telecom_comp;
      const telecom_incomp = stats.total_telecom_incomp;

      return [
        gas_comp,
        gas_incomp,
        safety_comp,
        safety_incomp,
        water_comp,
        water_incomp,
        drainage_comp,
        drainage_incomp,
        sewage_comp,
        sewage_incomp,
        power_comp,
        power_incomp,
        telecom_comp,
        telecom_incomp,
      ];
    });

  const point = await pointCompile;
  const line = await lineCompile;

  // zoom
  // if (point[0] === null) {
  //   zoomToLayer(utilityLineLayer, arcgisScene?.view);
  // } else if (line[0] === null) {
  //   zoomToLayer(utilityPointLayer, arcgisScene?.view);
  // } else {
  //   zoomToLayer(utilityPointLayer, arcgisScene?.view);
  // }

  const data = [
    {
      category: uitlType[0], // Telecom
      comp: point[12] + line[12],
      incomp: point[13] + line[13],
      icon: "https://EijiGorilla.github.io/Symbols/Telecom_Logo2.svg",
    },
    {
      category: uitlType[1], // Water
      comp: point[4] + line[4],
      incomp: point[5] + line[5],
      icon: "https://EijiGorilla.github.io/Symbols/Water_Logo2.svg",
    },
    {
      category: uitlType[2], // Sewage
      comp: point[8] + line[8],
      incomp: point[9] + line[9],
      icon: "https://EijiGorilla.github.io/Symbols/Sewage_Logo2.svg",
    },
    {
      category: uitlType[3], // Power
      comp: point[10] + line[10],
      incomp: point[11] + line[11],
      icon: "https://EijiGorilla.github.io/Symbols/Power_Logo2.svg",
    },
    {
      category: uitlType[4], // Safety
      comp: point[2] + line[2],
      incomp: point[3] + line[3],
      icon: "https://EijiGorilla.github.io/Symbols/Safety.svg",
    },
    {
      category: uitlType[5], // Drainage
      comp: point[6] + line[6],
      incomp: point[7] + line[7],
      icon: "https://EijiGorilla.github.io/Symbols/Drainage.svg",
    },
    {
      category: uitlType[6], // Gas
      comp: point[0] + line[0],
      incomp: point[1] + line[1],
      icon: "https://EijiGorilla.github.io/Symbols/Gas_Logo2.svg",
    },
  ];
  return data;
}

// Generate total number and progress numbers
export async function generateUtilPointProgress({ station, company }: any) {
  var total_utilpoint_number = new StatisticDefinition({
    onStatisticField: "Status",
    outStatisticFieldName: "total_utilpoint_number",
    statisticType: "count",
  });

  var total_utilpoint_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN Status = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_utilpoint_comp",
    statisticType: "sum",
  });

  // Query
  var query = new Query();
  const qStation = "Station1 = '" + station + "'";
  const qCompany = "Company = '" + company + "'";
  const qStationCompany = qStation + " AND " + qCompany;
  const finalExpression = station && !company ? qStation : qStationCompany;
  query.where = finalExpression;
  query.outStatistics = [total_utilpoint_number, total_utilpoint_comp];

  return utilityPointLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const comp = stats.total_utilpoint_comp;
    const total = stats.total_utilpoint_number;
    const progress = ((comp / total) * 100).toFixed(0);

    return [total, progress];
  });
}

export async function generateUtilLineProgress({ station, company }: any) {
  var total_utilline_number = new StatisticDefinition({
    onStatisticField: "Status",
    outStatisticFieldName: "total_utilline_number",
    statisticType: "count",
  });

  var total_utilline_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN Status = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_utilline_comp",
    statisticType: "sum",
  });

  var query = new Query();
  const qStation = "Station1 = '" + station + "'";
  const qCompany = "Company = '" + company + "'";
  const qStationCompany = qStation + " AND " + qCompany;
  const finalExpression = station && !company ? qStation : qStationCompany;
  query.where = finalExpression;
  query.outStatistics = [total_utilline_number, total_utilline_comp];

  return utilityLineLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const comp = stats.total_utilline_comp;
    const total = stats.total_utilline_number;
    const progress = ((comp / total) * 100).toFixed(0);

    return [total, progress];
  });
}

export async function generateTotalProgress({ station, company }: any) {
  var total_util_number = new StatisticDefinition({
    onStatisticField: "Status",
    outStatisticFieldName: "total_util_number",
    statisticType: "count",
  });

  var total_util_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN Status = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_util_comp",
    statisticType: "sum",
  });

  var query = new Query();
  const qStation = "Station1 = '" + station + "'";
  const qCompany = "Company = '" + company + "'";
  const qStationCompany = qStation + " AND " + qCompany;
  const finalExpression = station && !company ? qStation : qStationCompany;

  if (station === undefined) {
    query.where = "1=1";
  } else {
    query.where = finalExpression;
  }
  query.outStatistics = [total_util_number, total_util_comp];

  const pointQuery = utilityPointLayer
    .queryFeatures(query)
    .then((response: any) => {
      var stats = response.features[0].attributes;
      const comp = stats.total_util_comp;
      const total = stats.total_util_number;

      return [total, comp];
    });

  const lineQuery = utilityLineLayer
    .queryFeatures(query)
    .then((response: any) => {
      var stats = response.features[0].attributes;
      const comp = stats.total_util_comp;
      const total = stats.total_util_number;

      return [total, comp];
    });

  const point = await pointQuery;
  const line = await lineQuery;

  const total = point[0] + line[0];
  const comp = point[1] + line[1];
  const progress = ((comp / total) * 100).toFixed(0);

  return [total, progress];
}

// Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }
}

export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}

export const defineActions = (event: any) => {
  const item = event.item;
  if (item.layer.type !== "group") {
    item.panel = {
      content: "legend",
      open: true,
    };
  }

  item.title === "Chainage" ||
  item.title === "Viaduct" ||
  item.title === "Pier No"
    ? (item.visible = false)
    : (item.visible = true);
};
