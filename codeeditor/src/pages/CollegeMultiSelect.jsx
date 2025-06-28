import React, { useState, useEffect } from "react";

const CollegeMultiSelect = ({ value, onChange }) => {
  const colleges = ["ALL", "DDU", "MSU", "NIT", "IIT"];
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedColleges, setSelectedColleges] = useState(value || []);

  useEffect(() => {
    onChange(selectedColleges);
  }, [selectedColleges]);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleCollegeSelect = (college) => {
    if (college === "ALL") {
      setSelectedColleges(["ALL"]);
    } else {
      setSelectedColleges((prev) => {
        const newSelection = prev.includes(college)
          ? prev.filter((c) => c !== college)
          : [...prev.filter((c) => c !== "ALL"), college];
        return newSelection;
      });
    }
  };

  const handleRemoveCollege = (college) => {
    setSelectedColleges((prev) => prev.filter((c) => c !== college));
  };

  return (
    <div className="relative w-full">
      <label className="font-semibold text-gray-700">Target College</label>

      <div
        className="flex flex-wrap items-center gap-2 border rounded px-3 py-2 mt-1 cursor-pointer bg-white"
        onClick={toggleDropdown}
      >
        {selectedColleges.length === 0 ? (
          <span className="text-gray-400">Select colleges...</span>
        ) : (
          selectedColleges.map((college) => (
            <span
              key={college}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {college}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCollege(college);
                }}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </span>
          ))
        )}
        <span className="ml-auto text-gray-600">{showDropdown ? "▲" : "▼"}</span>
      </div>

      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-md max-h-48 overflow-y-auto">
          {colleges.map((college) => {
            const isSelected = selectedColleges.includes(college);
            const isDisabled =
              (college === "ALL" &&
                selectedColleges.length > 0 &&
                selectedColleges[0] !== "ALL") ||
              (college !== "ALL" && selectedColleges.includes("ALL"));

            return (
              <div
                key={college}
                onClick={() => !isDisabled && handleCollegeSelect(college)}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  isDisabled ? "text-gray-400 cursor-not-allowed" : ""
                } ${isSelected ? "bg-blue-50 font-semibold" : ""}`}
              >
                {college}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CollegeMultiSelect;
