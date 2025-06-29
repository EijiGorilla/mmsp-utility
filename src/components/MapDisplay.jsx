import { useEffect, useState } from "react";
import "../index.css";
import "../App.css";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-placement";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-compass";
import {
  utilityLineLayer1,
  utilityPointLayer,
  alignmentGroupLayer,
  utilityGroupLayer,
} from "../layers";
import "@esri/calcite-components/dist/components/calcite-button";

function MapDisplay() {
  const [sceneView, setSceneView] = useState();
  const arcgisScene = document.querySelector("arcgis-scene");
  const arcgisSearch = document.querySelector("arcgis-search");

  useEffect(() => {
    if (sceneView) {
      arcgisScene.map.add(alignmentGroupLayer);
      arcgisScene.map.add(utilityGroupLayer);
      arcgisScene.map.ground.opacity = 0.7;
      arcgisScene.view.environment.atmosphereEnabled = false;
      arcgisScene.map.ground.navigationConstraint = "none";
      arcgisSearch.sources = [
        {
          layer: utilityPointLayer,
          searchFields: ["Id"],
          displayField: "Id",
          exactMatch: false,
          outFields: ["Id"],
          name: "Unique ID (Point)",
          zoomScale: 1000,
          placeholder: "example: MER0001-X01",
        },
        {
          layer: utilityLineLayer1,
          searchFields: ["Id"],
          displayField: "Id",
          exactMatch: false,
          outFields: ["Id"],
          name: "Unique ID (Line)",
          zoomScale: 1000,
          placeholder: "example: MER0001-X01",
        },
      ];
      arcgisSearch.allPlaceholder = "Uniqu ID for Utility Features";
      arcgisSearch.includeDefaultSourcesDisabled = true;
      arcgisSearch.locationDisabled = true;
    }
  });

  return (
    <arcgis-scene
      // item-id="5ba14f5a7db34710897da0ce2d46d55f"
      basemap="dark-gray-vector"
      ground="world-elevation"
      viewingMode="local"
      zoom="13"
      center="121.0322874, 14.6750462"
      onarcgisViewReadyChange={(event) => {
        setSceneView(event.target);
      }}
    >
      <arcgis-compass position="top-right"></arcgis-compass>
      <arcgis-expand close-on-esc position="top-right" mode="floating">
        <arcgis-search></arcgis-search>
        {/* <arcgis-placement>
          <calcite-button>Placeholder</calcite-button>
        </arcgis-placement> */}
      </arcgis-expand>
      <arcgis-zoom position="bottom-right"></arcgis-zoom>
    </arcgis-scene>
  );
}

export default MapDisplay;
