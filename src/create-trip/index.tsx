import { useCallback, useMemo, useState } from "react";
// import { GetCountries, GetState, GetCity } from "react-country-state-city";
import stateData from "../../stateData.json";
import countryData from "../../countryData.json";
import cityData from "../../cityData.json";
import { Country, State, CityDataArray, Suggestion } from "../types/types";
import SearchInput from "@/components/custom/searchInput";
import { Input } from "@/components/ui/input";
import { SelectBudgetOption, SelectTravelersList } from "@/constants/options";
import { Button } from "@/components/ui/button";

const countries: Country[] = countryData as Country[];
const states: State[] = stateData;
const cities: CityDataArray = cityData as CityDataArray;

function CreateTrip() {
  const [searchTerm, setSearchTerm] = useState("");

  const countryMap: { [key: string]: string } = useMemo(() => {
    const map: { [key: string]: string } = {};
    countries.forEach((country: Country) => {
      map[parseInt(country.id)] = country.name;
    });
    return map;
  }, []);

  const stateMap: { [key: string]: State } = useMemo(() => {
    const map: { [key: string]: State } = {};
    states.forEach((state: State) => {
      map[state.id] = state;
    });
    return map;
  }, []);

  const stateToCountryMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    states.forEach((state) => {
      const countryName = countryMap[state.countryCode];
      if (countryName) {
        map[state.id] = countryName;
      }
    });
    return map;
  }, [countryMap]);
  const sortCopy = useCallback(
    (arr: Suggestion[]) => {
      const res = arr.slice(0).sort((a: Suggestion, b: Suggestion) => {
        if (
          a.name.toLowerCase() === searchTerm.toLowerCase() ||
          a.name.toLowerCase().split(",").includes(searchTerm.toLowerCase())
        )
          return -1;
        else if (
          b.name.toLowerCase() === searchTerm.toLowerCase() ||
          b.name.toLowerCase().split(",").includes(searchTerm.toLowerCase())
        )
          return 1;
        else return 0;
      });
      return res;
    },
    [searchTerm]
  );
  const searchResult = useMemo(() => {
    if (!searchTerm) return { countries: [], states: [], cities: [] };

    const result = {
      countries: [] as Suggestion[],
      states: [] as Suggestion[],
      cities: [] as Suggestion[],
    };

    if (searchTerm.toLowerCase() === "goa") {
      console.log();
    }

    result.countries = sortCopy(
      countries
        .filter((country) =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(
          (country) =>
            ({ id: parseInt(country.id), name: country.name } as Suggestion)
        )
    ).slice(0, 5); // Limit to 5 results

    // Search in state names
    result.states = sortCopy(
      states
        .filter((state) =>
          state.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((state) => ({
          id: state.id,
          name: `${state.name}, ${stateToCountryMap[state.id] || "Unknown"}`,
        }))
    ).slice(0, 5); // Limit to 5 results

    // Search in city names
    result.cities = sortCopy(
      cities.flatMap((city) =>
        city.states.flatMap((state) => {
          return state.cities
            .filter((cityItem) =>
              cityItem.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((cityItem) => {
              // Lookup state information from stateMap
              const foundState = stateMap[state.id];
              // Get the country name from stateToCountryMap using the state's id
              const countryName = foundState
                ? stateToCountryMap[state.id]
                : "Unknown";

              return {
                id: cityItem.id,
                name: `${cityItem.name}, ${
                  foundState ? foundState.name : "Unknown"
                }, ${countryName || "Unknown"}`,
              };
            });
        })
      )
    ).slice(0, 5); // Limit to 5 results

    return result;
  }, [searchTerm, sortCopy, stateMap, stateToCountryMap]);

  const handleSuggestionClick = (suggestionName: string) => {
    setSearchTerm(suggestionName); // Set the selected suggestion in the input field
    searchResult.cities = [];
    searchResult.states = [];
    searchResult.countries = [];
  };

  return (
    <div className="sm:px-10 md:px-32 xl:px-10 lg:px-56 px-5 mt-10 flex flex-col justify-center align-middle mx-auto w-[75vw]">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences 🏕️🚙
      </h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is your destination of choice?
          </h2>
          <div>
            <SearchInput
              suggestions={[
                ...searchResult.cities.map((city) => ({
                  id: city.id,
                  name: city.name,
                })),
                ...searchResult.states.map((state) => ({
                  id: state.id,
                  name: state.name,
                })),
                ...searchResult.countries.map((country) => ({
                  id: country.id,
                  name: country.name,
                })),
              ].sort((a: Suggestion, b: Suggestion) => {
                if (searchTerm.toLowerCase() === a.name.toLowerCase())
                  return -1;
                else if (searchTerm.toLowerCase() === b.name.toLowerCase())
                  return 1;
                else return 0;
              })}
              query={searchTerm}
              handleInputChange={setSearchTerm}
              handleSuggestionClick={handleSuggestionClick}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>

          <Input placeholder={"e.g. 3"} type="number" />
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOption.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-lg cursor-pointer"
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on traveling with on your next adventure?
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelersList.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-lg cursor-pointer"
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="my-3 flex justify-end">
        <Button>Generate Trip</Button>
      </div>
    </div>
  );
}

export default CreateTrip;
