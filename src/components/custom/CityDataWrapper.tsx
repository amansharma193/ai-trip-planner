import { useMemo } from "react";
import {
  Country,
  State,
  CityDataArray,
  CityDataWrapperProps,
  PlaceMaps,
  City,
  Suggestion,
} from "../../types/types";
import stateData from "../../../stateData.json";
import countryData from "../../../countryData.json";
import cityData from "../../../cityData.json";
import SearchInput from "./SearchInput";

const countries: Country[] = countryData as Country[];
const states: State[] = stateData;
const cities: CityDataArray = cityData as CityDataArray;

function CityDataWrapper({ searchTerm, setSearchTerm }: CityDataWrapperProps) {
  const sortFunction = (
    a: Country | State | City,
    b: Country | State | City
  ) => {
    const searchTermLower = searchTerm.toLowerCase();
    const aNameLower = a.name.toLowerCase();
    const bNameLower = b.name.toLowerCase();
    if (aNameLower === searchTermLower) return -1;
    if (bNameLower === searchTermLower) return 1;
    return 0;
  };
  const countryMap = useMemo(() => {
    const map: PlaceMaps = {};
    countries.forEach((country) => {
      map[parseInt(country.id)] = country.name;
    });
    return map;
  }, []);

  const stateMap = useMemo(() => {
    const map: { [key: string]: State } = {};
    states.forEach((state) => {
      map[state.id] = state;
    });
    return map;
  }, []);

  const stateToCountryMap = useMemo(() => {
    const map: PlaceMaps = {};
    states.forEach((state) => {
      const countryName = countryMap[state.countryCode];
      if (countryName) {
        map[state.id] = countryName;
      }
    });
    return map;
  }, [countryMap]);

  const searchResult = useMemo(() => {
    if (!searchTerm) return { countries: [], states: [], cities: [] };

    const searchTermLower = searchTerm.toLowerCase();

    const result = {
      countries: countries
        .filter((country) =>
          country.name.toLowerCase().includes(searchTermLower)
        )
        .sort(sortFunction)
        .map((country) => ({ id: country.id, name: country.name }))
        .slice(0, 5),

      states: states
        .filter((state) => state.name.toLowerCase().includes(searchTermLower))
        .sort(sortFunction)
        .map((state) => ({
          id: state.id,
          name: `${state.name}, ${stateToCountryMap[state.id] || "Unknown"}`,
        }))
        .slice(0, 5),

      cities: cities
        .flatMap((city) =>
          city.states.flatMap((state) =>
            state.cities
              .filter((cityItem) =>
                cityItem.name.toLowerCase().includes(searchTermLower)
              )
              .sort(sortFunction)
              .map((cityItem) => {
                const foundState = stateMap[state.id];
                const countryName = foundState
                  ? stateToCountryMap[parseInt(state.id)]
                  : "Unknown";
                return {
                  id: cityItem.id,
                  name: `${cityItem.name}, ${
                    foundState ? foundState.name : "Unknown"
                  }, ${countryName || "Unknown"}`,
                };
              })
          )
        )
        .slice(0, 5),
    };
    console.log("result => ", result);

    return result;
  }, [searchTerm, stateMap, stateToCountryMap]);

  const handleSuggestionClick = (suggestionName: string) => {
    setSearchTerm(suggestionName); // Set the selected suggestion in the input field
    searchResult.cities = [];
    searchResult.states = [];
    searchResult.countries = [];
  };
  return (
    <>
      <SearchInput
        suggestions={(
          [
            ...searchResult.cities,
            ...searchResult.states,
            ...searchResult.countries,
          ] as Suggestion[]
        ).sort((a, b) => {
          if (searchTerm.toLowerCase() === a.name.split(",")[0].toLowerCase())
            return -1;
          else if (
            searchTerm.toLowerCase() === b.name.split(",")[0].toLowerCase()
          )
            return 1;
          else return 0;
        })}
        query={searchTerm}
        handleInputChange={setSearchTerm}
        handleSuggestionClick={handleSuggestionClick}
      />
    </>
  );
}

export default CityDataWrapper;
