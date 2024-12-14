// public/scripts/filters.js

let allData = []; // Holds all deck data
let currentFilters = {}; // Holds user-applied filters
let randomDeckNr = null; // Holds the 'Nr' of the randomly selected deck

/**
 * Sets the deck data.
 * @param {Array} data - The array of deck objects.
 */
export function setData(data) {
  allData = data;
  console.log('Data set:', allData);
}

/**
 * Gets all deck data.
 * @returns {Array} - The array of all deck objects.
 */
export function getAllData() {
  return allData;
}

/**
 * Sets user-applied filters.
 * @param {Object} filters - The filters to set { column: [values] }.
 */
export function setFilters(filters) {
  currentFilters = { ...filters };
  console.log('Filters set:', currentFilters);
}

/**
 * Adds a user-applied filter value to a column.
 * @param {string} column - The column name.
 * @param {string} value - The value to add.
 */
export function addFilterValue(column, value) {
  if (!currentFilters[column]) {
    currentFilters[column] = [];
  }
  if (!currentFilters[column].includes(value)) {
    currentFilters[column].push(value);
    console.log(`Added filter: ${column} = ${value}`);
  }
}

/**
 * Removes a user-applied filter value from a column.
 * @param {string} column - The column name.
 * @param {string} value - The value to remove.
 */
export function removeFilterValue(column, value) {
  if (currentFilters[column]) {
    currentFilters[column] = currentFilters[column].filter(v => v !== value);
    if (currentFilters[column].length === 0) {
      delete currentFilters[column];
    }
    console.log(`Removed filter: ${column} = ${value}`);
  }
}

/**
 * Clears all user-applied filters.
 */
export function clearFilters() {
  currentFilters = {};
  console.log('Cleared all user-applied filters.');
}

/**
 * Sets the randomly selected deck number.
 * @param {string} nr - The 'Nr' of the randomly selected deck.
 */
export function setRandomDeckNr(nr) {
  randomDeckNr = nr;
  console.log(`Set random deck Nr: ${randomDeckNr}`);
}

/**
 * Clears the randomly selected deck number.
 */
export function clearRandomDeckNr() {
  console.log(`Cleared random deck Nr: ${randomDeckNr}`);
  randomDeckNr = null;
}

/**
 * Applies selected filters to the data.
 * Includes both user-applied filters and random deck filter.
 * @returns {Array} - The filtered data.
 */
export function applyFilters() {
  console.log('Applying filters:', currentFilters, 'Random Deck Nr:', randomDeckNr);
  return allData.filter((row) => {
    // Check user-applied filters
    const userFilterMatch = Object.entries(currentFilters).every(([column, selectedValues]) => {
      const rowValue = row[column] || '';
      // For 'Nr', perform exact matching
      if (column === 'Nr') {
        return selectedValues.some(token => String(rowValue) === String(token));
      } else {
        // For other columns, require all selected values to be present (AND logic)
        return selectedValues.every(token => rowValue.includes(token));
      }
    });

    // Check random deck filter
    const randomDeckMatch = randomDeckNr
      ? String(row['Nr']) === String(randomDeckNr)
      : true; // If no random deck filter, match all

    // Both conditions must be true
    return userFilterMatch && randomDeckMatch;
  });
}

/**
 * Gets the current user-applied filters.
 * @returns {Object} - The current user-applied filters { column: [values] }.
 */
export function getCurrentFilters() {
  return currentFilters;
}

/**
 * Gets the randomly selected deck number.
 * @returns {string|null} - The 'Nr' of the randomly selected deck or null.
 */
export function getRandomDeckNr() {
  return randomDeckNr;
}
