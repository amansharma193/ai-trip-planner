// Country interface remains the same
export interface Country {
  id: string;
  name: string;
  iso3?: string; // Marking fields as optional if they may be missing in some entries
  iso2?: string;
  numeric_code?: string;
  phone_code?: number;
  capital?: string;
  currency?: string;
  currency_name?: string;
  currency_symbol?: string;
  tld?: string;
  native?: string;
  region?: string;
  subregion?: string;
  latitude?: string;
  longitude?: string;
  emoji?: string;
}


// State interface
export interface State {
  id: number;
  name: string;
  state_code: string;
  countryCode: number; // Based on your data, this is a number
}

// City interface
export interface City {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  stateId: number; // State ID reference
}

// CityData interface to represent cityData.json structure
export interface CityData {
  id: number;
  states: {
    id: number;
    cities: City[];
  }[];
}

// CityDataArray as an alias for an array of CityData
export type CityDataArray = CityData[];

export interface Suggestion {
  id: number;
  name: string;
}

export interface SearchInputProps {
  suggestions: Suggestion[];
  query: string;
  handleInputChange: (value: string) => void;
  handleSuggestionClick: (value: string) => void;
}
