import React, { createContext, useState } from "react";
import "./App.css";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { CalciteShell } from "@esri/calcite-components-react";
import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import Chart from "./components/Chart";
import UndergroundSwitch from "./components/UndergroundSwitch";

type MyDropdownContextType = {
  stations: any;
  companies: any;
  utilityTypes: any;
  updateStations: any;
  updateCompanies: any;
  updateUtilityTypes: any;
};

const initialState = {
  stations: undefined,
  companies: undefined,
  utilityTypes: undefined,
  updateStations: undefined,
  updateCompanies: undefined,
  updateUtilityTypes: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});

function App() {
  const [stations, setStations] = useState<any>();
  const [companies, setCompanies] = useState<any>();
  const [utilityTypes, setUtilityTypes] = useState<any>();

  const updateStations = (newContractcp: any) => {
    setStations(newContractcp);
  };

  const updateCompanies = (newCompany: any) => {
    setCompanies(newCompany);
  };

  const updateUtilityTypes = (newUtilityType: any) => {
    setUtilityTypes(newUtilityType);
  };

  return (
    <div>
      <CalciteShell>
        <MyContext
          value={{
            stations,
            companies,
            utilityTypes,
            updateStations,
            updateCompanies,
            updateUtilityTypes,
          }}
        >
          <ActionPanel />
          <UndergroundSwitch />
          <Chart />
          <MapDisplay />
          <Header />
        </MyContext>
      </CalciteShell>
    </div>
  );
}

export default App;
