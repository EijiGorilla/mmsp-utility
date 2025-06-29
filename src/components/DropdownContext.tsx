import { useEffect, useState, use } from "react";
import Select from "react-select";
import "../index.css";
import "../App.css";
import { DropDownData } from "../customClass";
import { utilityLineLayer, utilityPointLayer } from "../layers";
import { MyContext } from "../App";
import { primaryLabelColor } from "../UniqueValues";

export function DropdownData() {
  const { updateStations, updateCompanies, updateUtilityTypes } =
    use(MyContext);

  // For dropdown filter
  const [initContractPacakgeCompType, setInitContractPacakgeCompType] =
    useState([]);

  const [stations, setContractPackage] = useState<any>(null);
  const [companys, setCompany] = useState(null);
  const [utilityType, setUtilityType] = useState<null | undefined | string>(
    null
  );

  const [companyList, setCompanyList] = useState([]);
  const [utilityTypeList, setUtilityTypeList] = useState([]);
  const [companySelected, setCompanySelected] = useState({ name: "" });

  useEffect(() => {
    const dropdownData = new DropDownData({
      featureLayers: [utilityPointLayer, utilityLineLayer],
      fieldNames: ["Station1", "Company", "Type"],
    });

    dropdownData.dropDownQuery().then((response: any) => {
      setInitContractPacakgeCompType(response);
    });
  }, []);

  const handleContractPackageChange = (obj: any) => {
    setContractPackage(obj);
    setCompanyList(obj.field2);
    setCompany(null);
    setCompanySelected(obj);
    setUtilityType(null);
    updateStations(obj.field1);
    updateCompanies(undefined);
    updateUtilityTypes(undefined);
  };

  const handleCompanyChange = (obj: any) => {
    setCompanySelected(obj);
    setCompany(obj);
    setUtilityTypeList(obj.field3);
    setUtilityType(null);
    updateCompanies(obj.name);
    updateUtilityTypes(undefined);
  };

  const handleTypeChange = (obj: any) => {
    setUtilityType(obj);
    updateUtilityTypes(obj.name);
  };

  return (
    <>
      <DropdownListDisplay
        handleContractPackageChange={handleContractPackageChange}
        handleCompanyChange={handleCompanyChange}
        handleTypeChange={handleTypeChange}
        initContractPacakgeCompType={initContractPacakgeCompType}
        stations={stations}
        companys={companys}
        utilityType={utilityType}
        companyList={companyList}
        utilityTypeList={utilityTypeList}
        companySelected={companySelected}
      ></DropdownListDisplay>
    </>
  );
}

export function DropdownListDisplay({
  handleContractPackageChange,
  handleCompanyChange,
  handleTypeChange,
  initContractPacakgeCompType,
  stations,
  companys,
  utilityType,
  companyList,
  utilityTypeList,
}: any) {
  // Style CSS
  const customstyles = {
    option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused
          ? "#555555"
          : isSelected
          ? "#2b2b2b"
          : "#2b2b2b",
        color: "#ffffff",
      };
    },

    control: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      borderColor: "#949494",
      height: 35,
      width: "170px",
      color: "#ffffff",
    }),
    singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
  };

  return (
    <>
      <div className="dropdownFilterLayout">
        <b style={{ color: primaryLabelColor, margin: 10, fontSize: "0.9vw" }}>
          Station
        </b>
        <Select
          placeholder="Select Station"
          value={stations}
          options={initContractPacakgeCompType}
          onChange={handleContractPackageChange}
          getOptionLabel={(x: any) => x.field1}
          styles={customstyles}
        />
        <br />
        <b style={{ color: primaryLabelColor, margin: 10, fontSize: "0.9vw" }}>
          Company
        </b>
        <Select
          placeholder="Select Company"
          value={companys}
          options={companyList}
          onChange={handleCompanyChange}
          getOptionLabel={(x: any) => x.name}
          styles={customstyles}
        />
        <br />
        <b style={{ color: primaryLabelColor, margin: 10, fontSize: "0.9vw" }}>
          Type
        </b>
        <Select
          placeholder="Select Type"
          value={utilityType}
          options={utilityTypeList}
          onChange={handleTypeChange}
          getOptionLabel={(x: any) => x.name}
          styles={customstyles}
        />
      </div>
    </>
  );
}
