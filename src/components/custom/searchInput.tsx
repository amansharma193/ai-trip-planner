import React from "react";
import { Input } from "@/components/ui/input"; // Adjust the path based on your project structure
import Dropdown from "@/components/custom/dropdown"; // Create a dropdown component if you don't have one
import { SearchInputProps } from "@/types/types";

const SearchInput: React.FC<SearchInputProps> = ({
  suggestions,
  handleInputChange,
  query,
  handleSuggestionClick,
}) => {
  return (
    <div className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Search..."
        className="border border-gray-300 rounded-md"
      />
      {query && suggestions.length > 0 && (
        <Dropdown>
          {suggestions.slice(0, 5).map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion.name)}
              className="p-2 hover:bg-gray-200"
            >
              {suggestion.name}
            </div>
          ))}
        </Dropdown>
      )}
    </div>
  );
};

export default SearchInput;
