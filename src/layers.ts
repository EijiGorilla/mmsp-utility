import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import {
  PointSymbol3D,
  IconSymbol3DLayer,
  WebStyleSymbol,
  LineSymbol3D,
  PathSymbol3DLayer,
} from "@arcgis/core/symbols";
import SizeVariable from "@arcgis/core/renderers/visualVariables/SizeVariable";
import RotationVariable from "@arcgis/core/renderers/visualVariables/RotationVariable";
import { labelSymbol3DLine } from "./Label";
import GroupLayer from "@arcgis/core/layers/GroupLayer";

/* Standalone table for Dates */
export const dateTable = new FeatureLayer({
  portalItem: {
    id: "a084d9cae5234d93b7aa50f7eb782aec",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
});

/* Construction Boundary */

// Construction boundary
const ConstructionBoundaryFill = new UniqueValueRenderer({
  field: "MappingBoundary",
  uniqueValueInfos: [
    {
      value: 1,
      label: "",
      symbol: new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: {
          width: 2.5,
          color: [220, 220, 220],
          style: "short-dash",
        },
      }),
    },
  ],
});

export const constructionBoundaryLayer = new FeatureLayer({
  portalItem: {
    id: "0c172b82ddab44f2bb439542dd75e8ae",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,

  renderer: ConstructionBoundaryFill,
  definitionExpression: "MappingBoundary = 1",
  title: "Construction Boundary",
  elevationInfo: {
    mode: "on-the-ground",
  },
  popupEnabled: false,
});

// * Station Box * //
let stationBoxRenderer = new UniqueValueRenderer({
  field: "Layer",
  uniqueValueInfos: [
    {
      value: "U-Shape Retaining Wall",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "backward-diagonal",
        outline: {
          width: 1,
          color: "black",
        },
      }),
    },
    {
      value: "Cut & Cover Box",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "backward-diagonal",
        outline: {
          width: 1,
          color: "black",
        },
      }),
    },
    {
      value: "TBM Shaft",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "backward-diagonal",
        outline: {
          width: 1,
          color: "black",
        },
      }),
    },
    {
      value: "TBM",
      symbol: new SimpleFillSymbol({
        color: [178, 178, 178],
        style: "backward-diagonal",
        outline: {
          width: 0.5,
          color: "black",
        },
      }),
    },
    {
      value: "Station Platform",
      symbol: new SimpleFillSymbol({
        color: [240, 204, 230],
        style: "backward-diagonal",
        outline: {
          width: 0.4,
          color: "black",
        },
      }),
    },
    {
      value: "Station Box",
      symbol: new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: {
          width: 2,
          color: "red",
        },
      }),
    },
  ],
});

export const stationBoxLayer = new FeatureLayer({
  portalItem: {
    id: "52d4f29105934e3f95f6b39c7e5fba6e",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  renderer: stationBoxRenderer,
  minScale: 150000,
  maxScale: 0,
  title: "Station Box",

  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

// * Station Layer * //
function IconSymbol(name: string) {
  return new WebStyleSymbol({
    name: name,
    styleName: "EsriIconsStyle", //EsriRealisticTransportationStyle, EsriIconsStyle
  });
}

const stationRenderer = new UniqueValueRenderer({
  field: "Station",
  defaultSymbol: IconSymbol("Train"),
});

const stationLayerTextSymbol = labelSymbol3DLine({
  materialColor: "orange",
  fontSize: 30,
  fontFamily: "Ubuntu Mono",
  fontWeight: "normal",
  haloColor: "black",
  haloSize: 0.7,
  vOffsetScreenLength: 40,
  vOffsetMaxWorldLength: 100,
  vOffsetMinWorldLength: 20,
});

var labelClass = new LabelClass({
  symbol: stationLayerTextSymbol,
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: 'DefaultValue($feature.Station1, "no data")',
    //value: "{TEXTSTRING}"
  },
});

export const stationLayer = new FeatureLayer({
  portalItem: {
    id: "52d4f29105934e3f95f6b39c7e5fba6e",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "Station",
  labelingInfo: [labelClass],
  renderer: stationRenderer,
  definitionExpression: "sector = 'MMSP'",
  elevationInfo: {
    // this elevation mode will place points on top of
    // buildings or other SceneLayer 3D objects
    mode: "relative-to-ground",
  },
});
stationLayer.listMode = "hide";

// * Utility Point * //
function customSymbol3D(name: string) {
  return new WebStyleSymbol({
    //portal: 'https://www.maps.arcgis.com',
    // IMPORTANT: Your browser needs to be able to open the following link. It will say insecure so need to go to advanced.
    styleUrl:
      "https://www.maps.arcgis.com/sharing/rest/content/items/c04d4d4145f64f8fa38407dd5331dd1f/data",
    name: name,
  });
}

function utilPtSymbolStreet(name: string) {
  return new WebStyleSymbol({
    name: name,
    styleName: "EsriRealisticStreetSceneStyle",
  });
}

function utilPtSymbolSignal(name: string) {
  return new WebStyleSymbol({
    name: name,
    styleName: "EsriRealisticSignsandSignalsStyle",
  });
}

function utilPtSymbolSafety(name: string) {
  return new WebStyleSymbol({
    name: name,
    styleName: "EsriRealisticSignsandSignalsStyle",
  });
}

function utilPtSymbolOthers(name: string) {
  return new WebStyleSymbol({
    name: name,
    styleName: "EsriThematicTreesStyle",
  });
}

const verticalOffsetRelocation = {
  screenLength: 10,
  maxWorldLength: 30,
  minWorldLength: 35,
};

// Function that automatically creates the symbol for the points of interest
function getUniqueValueSymbol(name: string, color: any, sizeS: number) {
  return new PointSymbol3D({
    symbolLayers: [
      new IconSymbol3DLayer({
        resource: {
          href: name,
        },
        size: sizeS,
        outline: {
          color: color,
          size: 2,
        },
      }),
    ],

    verticalOffset: verticalOffsetRelocation,

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: [128, 128, 128, 0.1],
      size: 0.2,
      border: {
        color: "grey",
      },
    },
  });
}

const utilPointSymbolRenderer = new UniqueValueRenderer({
  valueExpression:
    // eslint-disable-next-line no-multi-str
    "When($feature.UtilType2 == 1, 'Telecom Pole (BTS)', \
    $feature.UtilType2 == 2, 'Telecom Pole (CATV)', \
    $feature.UtilType2 == 3, 'Telecom Pole', \
    $feature.UtilType2 == 4, 'Sluice Gate', \
    $feature.UtilType2 == 5, 'Air Valve', \
    $feature.UtilType2 == 6, 'District Meter', \
    $feature.UtilType2 == 7, 'Water Meter', \
    $feature.UtilType2 == 8, 'Gate Valve', \
    $feature.UtilType2 == 9, 'Valve', \
    $feature.UtilType2 == 10, 'STC', \
    $feature.UtilType2 == 11, 'Drain Box', \
    $feature.UtilType2 == 12, 'Manhole', \
    $feature.UtilType2 == 13, 'Electric Pole', \
    $feature.UtilType2 == 14, 'Street Light', \
    $feature.UtilType2 == 15, 'Traffic Light', \
    $feature.UtilType2 == 16, 'Road Safety Signs', \
    $feature.UtilType2 == 17, 'Junction Box', \
    $feature.UtilType2 == 18, 'Pedestal', \
    $feature.UtilType2 == 19, 'Transvault', \
    $feature.UtilType2 == 20, 'Fire Hydrant', \
    $feature.UtilType2 == 21, 'Handhole', $feature.UtilType)",
  uniqueValueInfos: [
    {
      value: "Telecom Pole (BTS)",
      symbol: customSymbol3D("3D_Telecom_BTS"),
    },
    {
      value: "Telecom Pole (CATV)",
      symbol: customSymbol3D("3D_TelecomCATV_Pole"),
    },
    {
      value: "Telecom Pole",
      symbol: customSymbol3D("3D_TelecomCATV_Pole"),
    },
    {
      value: "Sluice Gate", // update later
      symbol: utilPtSymbolStreet("Jersey_Barrier"),
    },
    {
      value: "Air Valve", // update later
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: "District Meter", // update later
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: "Water Meter", // update later
      symbol: customSymbol3D("3D_Water_Meter"),
    },
    {
      value: "Gate Valve", // update later
      symbol: customSymbol3D("3D_Water_Valve"),
    },
    {
      value: "Valve", // update later
      symbol: customSymbol3D("3D_Water_Valve"),
    },
    {
      value: "STC", // update later
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: "Drain Box", // update later
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: "Manhole",
      symbol: utilPtSymbolStreet("Storm_Drain"),
    },
    {
      value: "Electric Pole",
      //symbol: utilPtSymbolInfra("Powerline_Pole")
      symbol: customSymbol3D("3D_Electric_Pole"),
    },
    {
      value: "Street Light",
      symbol: utilPtSymbolStreet("Overhanging_Street_and_Sidewalk_-_Light_on"),
    },
    {
      value: "Traffic Light",
      symbol: utilPtSymbolSignal("Traffic_Light_4"),
    },
    {
      value: "Road Safety Signs",
      symbol: utilPtSymbolSafety("Pedestrian_Crossing"),
    },
    {
      value: "Junction Box",
      symbol: customSymbol3D("3D_Drain_Box"),
    },
    {
      value: "Pedestal",
      symbol: utilPtSymbolOthers("Sansevieria"),
    },
  ],
  visualVariables: [
    new SizeVariable({
      axis: "height",
      field: "SIZE",
      valueUnit: "meters",
    }),
    new RotationVariable({
      field: "ROTATION",
    }),
  ],
});

export const utilityPointLayer = new FeatureLayer({
  portalItem: {
    id: "8d700179fca44aef967ea78a01fc4279",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "Point Symbol",

  renderer: utilPointSymbolRenderer,
  elevationInfo: {
    mode: "relative-to-ground", // original was "relative-to-scene"
    featureExpressionInfo: {
      expression: "$feature.Height",
    },
    unit: "meters",
    //offset: 0
  },
  popupTemplate: {
    title: "<h5>{comp_agency}</h5>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Id",
          },
          {
            fieldName: "UtilType",
            label: "Utility Type",
          },
          {
            fieldName: "UtilType2",
            label: "Utility Name",
          },
          {
            fieldName: "LAYER",
            label: "<h5>Action</h5>",
          },
          {
            fieldName: "Status",
            label: "<h5>Status</h5>",
          },
          {
            fieldName: "Station1",
          },
          {
            fieldName: "Remarks",
          },
        ],
      },
    ],
  },
});

const utilityStatusRenderer = new UniqueValueRenderer({
  valueExpression:
    // eslint-disable-next-line no-multi-str
    "When($feature.Checks == 1, 'NeedCheck',\
    $feature.Status == 1 && $feature.LAYER == 1, 'DemolishComplete',\
    $feature.Status == 0 && $feature.LAYER == 1, 'DemolishIncomplete',\
    $feature.Status == 0 && $feature.LAYER == 2, 'RelocIncomplete', \
    $feature.Status == 1 && $feature.LAYER == 2, 'RelocComplete', \
    $feature.Status == 0 && $feature.LAYER == 3, 'NewlyAdded', \
    $feature.Status == 1 && $feature.LAYER == 3, 'NewlyAddedComplete', \
    $feature.Status == 1 && $feature.LAYER == 4, 'Retained', \
    $feature.Status == 0 && $feature.LAYER == 5, 'Replaced', \
    $feature.Status == 1 && $feature.LAYER == 5, 'ReplaceComplete', \
    $feature.Status == 0 && $feature.LAYER == 6, 'TemporaryDivertIncomplete', \
    $feature.Status == 1 && $feature.LAYER == 6, 'TemporaryDivertComplete', \
    $feature.Status == 0 && $feature.LAYER == 7, 'ReturnedIncomplete', \
    $feature.Status == 1 && $feature.LAYER == 7, 'ReturnedComplete', \
    $feature.Comp_Agency)",
  uniqueValueInfos: [
    {
      value: "NeedCheck",
      label: "Need to Check",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Unknown_v2.png",
        "#D13470",
        20
      ),
    },
    {
      value: "DemolishIncomplete",
      label: "To be Demolished",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Demolished.png",
        "#D13470",
        20
      ),
    },
    {
      value: "DemolishComplete",
      label: "Demolision Completed",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/DemolishComplete_v2.png",
        "#D13470",
        25
      ),
    },
    {
      value: "RelocIncomplete",
      label: "Proposed Relocation",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Relocatd.png",
        "#D13470",
        30
      ),
    },
    {
      value: "RelocComplete",
      label: "Relocation Completed",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Utility_Relocated_Completed_Symbol.png",
        "#D13470",
        30
      ),
    },
    {
      value: "NewlyAdded",
      label: "Add New Utility",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/NewlyAdded.png",
        "#D13470",
        35
      ),
    },
    {
      value: "NewlyAddedComplete",
      label: "Newly Utility Added",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/NewlyAdded_Completed.png",
        "#D13470",
        35
      ),
    },
    {
      value: "Replaced",
      label: "To be Replaced",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/UL_Replace_icomplete_symbol.png",
        "#D13470",
        30
      ),
    },
    {
      value: "ReplaceComplete",
      label: "Replacement Complete",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/UL_Replace_complete.png",
        "#D13470",
        30
      ),
    },
    {
      value: "Retained",
      label: "Retained",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/UL_Retained.png",
        "#D13470",
        30
      ),
    },
    {
      value: "TemporaryDivertIncomplete",
      label: "To be Temporary Diverted",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Temp_Diversion_Incomplete_Logo.png",
        "#D13470",
        30
      ),
    },
    {
      value: "TemporaryDivertComplete",
      label: "Temporary Diversion Completed",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Temp_Diversion_Complete_Logo.png",
        "#D13470",
        30
      ),
    },
    {
      value: "ReturnedIncomplete",
      label: "To be Returned",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Returned_Incomplete_Logo.png",
        "#D13470",
        30
      ),
    },
    {
      value: "ReturnedComplete",
      label: "Returned Completed",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Returned_Complete_Logo.png",
        "#D13470",
        30
      ),
    },
    {
      value: "NoAction",
      label: "Require Data Checking",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Unknown_v2.png",
        "#D13470",
        30
      ),
    },
  ],
});

const utilPointStatusTextSymbol = labelSymbol3DLine({
  materialColor: "white",
  fontSize: 10,
  haloColor: [0, 0, 0, 0.7],
  haloSize: 0.4,
});

const utilPointStatusLabel = new LabelClass({
  labelPlacement: "above-center",
  labelExpressionInfo: {
    //value: "{Company}",
    expression:
      "When($feature.Status >= 0, DomainName($feature, 'Comp_Agency'), '')", //$feature.Comp_Agency
  },
  symbol: utilPointStatusTextSymbol,
});

export const utilityPointLayer1 = new FeatureLayer({
  portalItem: {
    id: "8d700179fca44aef967ea78a01fc4279",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "Point Status",

  renderer: utilityStatusRenderer,
  elevationInfo: {
    mode: "relative-to-ground", // original was "relative-to-scene"
    featureExpressionInfo: {
      expression: "$feature.Height",
    },
    unit: "meters",
    //offset: 0
  },
  labelingInfo: [utilPointStatusLabel],
  popupTemplate: {
    title: "<h5>{comp_agency}</h5>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Id",
          },
          {
            fieldName: "UtilType",
            label: "Utility Type",
          },
          {
            fieldName: "UtilType2",
            label: "Utility Name",
          },
          {
            fieldName: "LAYER",
            label: "<h5>Action</h5>",
          },
          {
            fieldName: "Status",
            label: "<h5>Status</h5>",
          },
          {
            fieldName: "Station1",
          },
          {
            fieldName: "Remarks",
          },
        ],
      },
    ],
  },
});

// * Utility Line * //
const utilLineStatusRenderer = new UniqueValueRenderer({
  valueExpression:
    // eslint-disable-next-line no-multi-str
    "When($feature.Remarks == 'pending', 'NoAction', \
                        $feature.Status == 1 && $feature.LAYER == 1, 'DemolishComplete',\
                        $feature.Status == 0 && $feature.LAYER == 1, 'DemolishIncomplete',\
                        $feature.Status == 0 && $feature.LAYER == 2, 'RelocIncomplete', \
                        $feature.Status == 1 && $feature.LAYER == 2, 'RelocComplete', \
                        $feature.Status == 0 && $feature.LAYER == 3, 'NewlyAdded', \
                        $feature.Status == 1 && $feature.LAYER == 3, 'NewlyAddedComplete',$feature.Comp_Agency)",
  //field: "Company",
  uniqueValueInfos: [
    {
      value: "DemolishIncomplete",
      label: "To be Demolished",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Demolished.png",
        "#D13470",
        20
      ),
    },
    {
      value: "DemolishComplete",
      label: "Demolision Completed",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/DemolishComplete_v2.png",
        "#D13470",
        25
      ),
    },
    {
      value: "RelocIncomplete",
      label: "Proposed Relocation",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Relocatd.png",
        "#D13470",
        30
      ),
    },
    {
      value: "RelocComplete",
      label: "Relocation Completed",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Utility_Relocated_Completed_Symbol.png",
        "#D13470",
        30
      ),
    },
    {
      value: "NewlyAdded",
      label: "Add New Utility",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/NewlyAdded.png",
        "#D13470",
        35
      ),
    },
    {
      value: "NewlyAddedComplete",
      label: "Newly Utility Added",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/NewlyAdded_Completed.png",
        "#D13470",
        35
      ),
    },
    {
      value: "NoAction",
      label: "Require Data Checking",
      symbol: getUniqueValueSymbol(
        "https://EijiGorilla.github.io/Symbols/Unknown_v2.png",
        "#D13470",
        35
      ),
    },
  ],
});

export const utilityLineLayer = new FeatureLayer({
  portalItem: {
    id: "8d700179fca44aef967ea78a01fc4279",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "Line Symbol ", // Relocation PLan?
  elevationInfo: {
    mode: "relative-to-ground", // original was "relative-to-scene"
    featureExpressionInfo: {
      expression: "$feature.height",
    },
    unit: "meters",
    //offset: 0
  },

  popupTemplate: {
    title: "<h5>{comp_agency}</h5>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Id",
          },
          {
            fieldName: "UtilType",
            label: "Utility Type",
          },
          {
            fieldName: "UtilType2",
            label: "Utility Name",
          },
          {
            fieldName: "LAYER",
            label: "<h5>Action</h5>",
          },
          {
            fieldName: "Status",
            label: "<h5>Status</h5>",
          },
          {
            fieldName: "CP",
          },
          {
            fieldName: "Remarks",
          },
        ],
      },
    ],
  },
});

const utilLineColor = [
  [32, 178, 170, 0.5], //Telecom Line
  [112, 128, 144, 0.5], // Internet Cable TV Line
  [230, 0, 169, 0.5], // Duct Bank
  [0, 128, 255, 0.5], // Water Distribution Pipe
  [0, 197, 255, 0.5], // Main Line
  [0, 197, 254, 0.5], // Sub-Main Line
  [205, 133, 63, 0.5], // Canal
  [224, 224, 224, 0.5], // Sewer Pipeline
  [224, 224, 223, 0.5], // Sewer Drainage
  [139, 69, 19, 0.5], // Creek
  [211, 211, 211, 0.5], // Elecric Line
  [105, 105, 105, 0.5], // Storm Drainage
  [105, 105, 104, 0.5], // Drainage
  [197, 0, 255, 0.5], // Gas line
];

const utilLineWidth = [
  0.2, 0.2, 0.2, 0.5, 0.5, 0.5, 2, 1, 1, 0.5, 0.2, 0.5, 0.5, 0.5,
];

function lineSizeShapeSymbolLayers(
  profile: "circle" | "quad" | undefined,
  cap: "round" | "none" | "butt" | "square" | undefined,
  join: "round" | "miter" | "bevel" | undefined,
  width: number,
  height: number,
  profileRotation: "heading" | "all" | undefined,
  property: number
) {
  return new LineSymbol3D({
    symbolLayers: [
      new PathSymbol3DLayer({
        profile: profile,
        material: {
          color: utilLineColor[property],
        },
        width: width,
        height: height,
        join: join,
        cap: cap,
        anchor: "bottom",
        profileRotation: profileRotation,
      }),
    ],
  });
}

function renderutilityLineLayer() {
  const renderer = new UniqueValueRenderer({
    field: "utiltype2",
  });

  for (var i = 1; i <= utilLineColor.length; i++) {
    renderer.addUniqueValueInfo({
      value: i,
      symbol: lineSizeShapeSymbolLayers(
        "circle",
        "none",
        "miter",
        utilLineWidth[i - 1],
        utilLineWidth[i - 1],
        "all",
        i
      ),
    });
  }
  utilityLineLayer.renderer = renderer;
}

renderutilityLineLayer();

const utilLineStatusTextSymbol = labelSymbol3DLine({
  materialColor: "black",
  fontSize: 10,
  haloColor: [255, 255, 255, 0.7],
  haloSize: 0.7,
});

const utilityLineLabelClass = new LabelClass({
  //labelPlacement: 'above-center', // Polyline has not choice
  labelExpressionInfo: {
    expression:
      "When($feature.Status >= 0, DomainName($feature, 'Comp_Agency'), '')",
  },
  symbol: utilLineStatusTextSymbol,
});

export const utilityLineLayer1 = new FeatureLayer({
  portalItem: {
    id: "8d700179fca44aef967ea78a01fc4279",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "Line Status",
  elevationInfo: {
    mode: "relative-to-ground", // original was "relative-to-scene"
    featureExpressionInfo: {
      expression: "$feature.height",
    },
    unit: "meters",
    //offset: 0
  },

  renderer: utilLineStatusRenderer,
  labelingInfo: [utilityLineLabelClass],
  popupTemplate: {
    title: "<h5>{comp_agency}</h5>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Id",
          },
          {
            fieldName: "UtilType",
            label: "Utility Type",
          },
          {
            fieldName: "UtilType2",
            label: "Utility Name",
          },
          {
            fieldName: "LAYER",
            label: "<h5>Action</h5>",
          },
          {
            fieldName: "Status",
            label: "<h5>Status</h5>",
          },
          {
            fieldName: "Station1",
          },
          {
            fieldName: "Remarks",
          },
        ],
      },
    ],
  },
});

export const utilityGroupLayer = new GroupLayer({
  title: "Utility Relocation",
  visible: true,
  visibilityMode: "independent",
  layers: [
    utilityLineLayer1,
    utilityLineLayer,
    utilityPointLayer1,
    utilityPointLayer,
  ],
});

export const alignmentGroupLayer = new GroupLayer({
  title: "Alignment",
  visible: true,
  visibilityMode: "independent",
  layers: [stationBoxLayer, constructionBoundaryLayer], //stationLayer,
});

/* Station Structure */
/*
const stationStructureColors = [
  [225, 225, 225, 0], // To be Constructed (white)
  [130, 130, 130, 0.3], // Under Construction
  [255, 0, 0, 0.6], // Delayed
  [0, 197, 255, 0.5], // Completed
];

function renderStationStructureLayer() {
  const renderer = new UniqueValueRenderer({
    field: 'Status',
  });
  for (var i = 0; i < stationStructureColors.length; i++) {
    renderer.addUniqueValueInfo({
      value: i + 1,
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: stationStructureColors[i],
              colorMixMode: 'replace',
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    });
  }
  stationStructureLayer.renderer = renderer;
}

export const stationStructureLayer = new SceneLayer({
  //structureLayer
  portalItem: {
    id: '09f1e6d86cf34567bebcd22afcad8b4b',
    portal: {
      url: 'https://gis.railway-sector.com/portal',
    },
  },
  elevationInfo: {
    mode: 'absolute-height',
    offset: 0,
  },
  title: 'Station Structure',
  popupTemplate: {
    title: '<h5>{Status}</h5>',
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: 'fields',
        fieldInfos: [
          {
            fieldName: 'Type',
            label: 'Type of Structure',
          },
          {
            fieldName: 'ID',
            label: 'Structure ID',
          },
          {
            fieldName: 'Status',
            label: 'Construction Status',
          },
        ],
      },
    ],
  },
});
renderStationStructureLayer();
*/
