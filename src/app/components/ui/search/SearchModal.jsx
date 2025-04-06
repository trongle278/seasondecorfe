"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";

const SearchModal = ({
  isOpen,
  onClose,
  searchType,
  onSearch,
  suggestions = [],
  title,
  icon: Icon,
  anchorEl,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Reset selected items when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedItems([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  // Update filtered suggestions when suggestions prop changes
  useEffect(() => {
    setFilteredSuggestions(suggestions);
  }, [suggestions]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Filter suggestions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSuggestions(suggestions);
    } else {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.label?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
  }, [searchTerm, suggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // If multiple selection (season) and items are selected
    if (searchType === "season" && selectedItems.length > 0) {
      const labels = selectedItems.map((item) => item.label).join(", ");
      const values = selectedItems.map((item) => item.value);
      onSearch(labels, searchType, values);
    } else {
      // For single selection searches
      onSearch(searchTerm, searchType);
    }

    onClose();
  };

  const handleSuggestionClick = (suggestion) => {
    if (searchType === "season") {
      // For season, handle multiple selection
      const alreadySelected = selectedItems.some(
        (item) => item.value === suggestion.value
      );

      if (alreadySelected) {
        // Remove if already selected
        setSelectedItems(
          selectedItems.filter((item) => item.value !== suggestion.value)
        );
      } else {
        // Add to selected items
        setSelectedItems([...selectedItems, suggestion]);
      }
    } else {
      // For other types, use single selection
      setSearchTerm(suggestion.label);
      onSearch(suggestion.label, searchType, suggestion.value);
      onClose();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedItems([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const completeMultiSelection = () => {
    if (selectedItems.length > 0) {
      const labels = selectedItems.map((item) => item.label).join(", ");
      const values = selectedItems.map((item) => item.value);
      onSearch(labels, searchType, values);
      onClose();
    }
  };

  // Check if a suggestion is already selected (for multiple selection)
  const isSelected = (suggestion) => {
    return selectedItems.some((item) => item.value === suggestion.value);
  };

  // Close on escape key, outside click, or scroll
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        // Make sure we're not clicking the anchor element
        if (anchorEl && !anchorEl.contains(e.target)) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorEl, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="z-40 absolute w-full dark:text-white" ref={dropdownRef}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="bg-white dark:bg-black rounded-xl shadow-xl w-full min-w-[320px] max-w-md overflow-hidden mt-2 border border-gray-200 dark:border-gray-700"
            style={{
              position: "sticky",
              top: anchorEl
                ? anchorEl.getBoundingClientRect().bottom + window.scrollY
                : undefined,
              left: anchorEl
                ? anchorEl.getBoundingClientRect().left + window.scrollX
                : undefined,
              maxWidth: anchorEl ? Math.max(320, anchorEl.offsetWidth) : 420,
            }}
          >
            <div className="p-3">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                {Icon && <Icon className="mr-2" size={16} />}
                {title}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder={`Search for ${searchType === 'sublocation' ? 'location' : searchType}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <IoSearchOutline size={18} />
                  </div>

                  {/* Clear button */}
                  {(searchTerm || selectedItems.length > 0) && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <IoCloseCircle size={18} />
                    </button>
                  )}
                </div>
              </form>

              {/* Selected items display (for multiple selection) */}
              {searchType === "season" && selectedItems.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedItems.map((item, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center bg-rose-100 text-rose-800 rounded-full px-2 py-1 text-xs"
                    >
                      {item.icon && <span className="mr-1">{item.icon}</span>}
                      <span>{item.label}</span>
                      <button
                        type="button"
                        className="ml-1 text-rose-600 hover:text-rose-800"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        <IoCloseCircle size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 max-h-60 overflow-y-auto">
                {filteredSuggestions.length > 0 ? (
                  <div className="space-y-1">
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors flex items-center ${
                          isSelected(suggestion)
                            ? "bg-rose-50 dark:bg-rose-900/20"
                            : ""
                        }`}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.icon && (
                          <span className="mr-3 text-gray-600 dark:text-gray-300">
                            {suggestion.icon}
                          </span>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {suggestion.label}
                          </p>
                          {suggestion.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {suggestion.description}
                            </p>
                          )}
                        </div>
                        {searchType === "season" && isSelected(suggestion) && (
                          <span className="text-rose-500">
                            <IoCloseCircle size={16} />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : searchTerm ? (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">
                      No results found for "{searchTerm}"
                    </p>
                    <p className="text-xs mt-1">Try different keywords</p>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">
                      Type to search or select from suggestions
                    </p>
                  </div>
                )}
              </div>

              {/* Apply button for multiple selection */}
              {searchType === "season" && selectedItems.length > 0 && (
                <div className="mt-3 text-right">
                  <button
                    type="button"
                    className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-full text-sm transition-colors"
                    onClick={completeMultiSelection}
                  >
                    Apply ({selectedItems.length})
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
