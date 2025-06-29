import "../index.css";
import "../App.css";
import "@esri/calcite-components/dist/components/calcite-switch";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { CalciteSwitch } from "@esri/calcite-components-react";
import { useEffect, useState } from "react";
import { primaryLabelColor } from "../UniqueValues";

function UndergroundSwitch() {
  const arcgisScene = document.querySelector("arcgis-scene");
  const [underground, setUnderground] = useState(false);

  useEffect(() => {
    if (arcgisScene) {
      arcgisScene.map.ground.opacity = underground === false ? 0.7 : 1;
    }
  }, [underground]);

  return (
    <>
      <div
        className="groundSwitchDiv"
        style={{
          position: "fixed",
          zIndex: 1,
          bottom: 10,

          color: "white",
          backgroundColor: "#2b2b2b",
          paddingLeft: 5,
          paddingRight: 5,
          paddingTop: 4,
          margin: 5,
          borderStyle: "solid",
          borderColor: primaryLabelColor,
          borderWidth: "0.7px",
        }}
      >
        Ground: {""}
        Off{" "}
        <CalciteSwitch
          onCalciteSwitchChange={(event) =>
            setUnderground(event.target.checked)
          }
        ></CalciteSwitch>{" "}
        On
      </div>
    </>
  );
}

export default UndergroundSwitch;
