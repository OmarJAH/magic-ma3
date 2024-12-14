// public/scripts/main.js

import { fetchData } from './data.js';
import { createDropdowns, populateCards, updateSelectedFilters } from './ui.js';
import { 
  setData, 
  applyFilters, 
  getAllData, 
  addFilterValue, 
  removeFilterValue, 
  clearFilters, 
  setRandomDeckNr, 
  clearRandomDeckNr, 
  getCurrentFilters, 
  getRandomDeckNr,
  setFilters // <-- Ensure setFilters is imported
} from './filters.js';

/**
 * Callback function to remove a filter when '×' is clicked.
 * @param {string} column - The column name of the filter.
 * @param {string} value - The value of the filter.
 */
function onFilterRemove(column, value) {
  console.log(`Filter Remove Detected - Column: ${column}, Value: ${value}`);
  removeFilterValue(column, value);
  applyFiltersAndUpdate();
}

/**
 * Callback function to handle filter changes (e.g., checkbox changes).
 * @param {string} column - The column name of the filter.
 * @param {string} value - The value of the filter.
 * @param {boolean} isChecked - Whether the checkbox is checked.
 */
function onFilterChange(column, value, isChecked) {
  console.log(`Filter Change Detected - Column: ${column}, Value: ${value}, Checked: ${isChecked}`);
  if (isChecked) {
    addFilterValue(column, value);
  } else {
    removeFilterValue(column, value);
  }
  applyFiltersAndUpdate();
}

/**
 * Handles the reset filter functionality.
 */
function handleResetFilters() {
  console.log('Reset Filters Clicked');
  // Clear all user-applied checkboxes
  const dropdowns = document.querySelectorAll('.multi-select-dropdown');
  dropdowns.forEach((dropdown) => {
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
  });

  // Clear all user-applied filters
  clearFilters();

  // Clear any random deck filter
  clearRandomDeckNr();

  // Update selected filters display
  updateSelectedFilters(onFilterRemove);

  // Show all data
  applyFiltersAndUpdate();

  // Remove any deck highlights
  removeDeckHighlights();
}

/**
 * Handles the random deck selection.
 */
function handleRandomDeck() {
  const allData = getAllData();
  if (allData.length > 0) {
    const randomIndex = Math.floor(Math.random() * allData.length);
    const randomDeck = allData[randomIndex];

    console.log(`Randomly selected deck Nr: ${randomDeck.Nr}`);

    // Clear existing user-applied filters and checkboxes
    handleResetFilters();

    // Apply random deck filter
    setRandomDeckNr(String(randomDeck.Nr));

    // Update display based on the new filter
    applyFiltersAndUpdate();

    // Highlight the selected deck
    highlightSelectedDeck(randomDeck.Nr);

    // Show Reset Button
    const resetButtonRandom = document.getElementById('reset-button-random');
    resetButtonRandom.classList.remove('hidden');
    resetButtonRandom.addEventListener('click', handleResetRandomDeck);
  } else {
    console.warn('Keine Decks verfügbar für zufällige Auswahl.');
  }
}

function handleResetRandomDeck() {
  console.log('Reset Random Deck Filter Clicked');

  // Clear the random deck filter
  clearRandomDeckNr();

  // Reapply filters to show all decks
  applyFiltersAndUpdate();

  // Remove deck highlights
  removeDeckHighlights();

  // Hide Reset Button
  const resetButtonRandom = document.getElementById('reset-button-random');
  resetButtonRandom.classList.add('hidden');
}


/**
 * Highlights the selected deck card by adding a special class.
 * @param {number|string} deckNr - The 'Nr' of the deck to highlight.
 */
function highlightSelectedDeck(deckNr) {
  // Remove existing highlights
  removeDeckHighlights();

  // Find the deck card with the matching 'Nr'
  const card = Array.from(document.querySelectorAll('.card')).find(cardElement => {
    const content = cardElement.querySelector('.card-content');
    if (content) {
      const nrElement = Array.from(content.querySelectorAll('p')).find(p => p.innerHTML.startsWith('<strong>Nr:'));
      if (nrElement) {
        const nr = nrElement.textContent.replace('Nr:', '').trim();
        return nr === String(deckNr);
      }
    }
    return false;
  });

  if (card) {
    card.classList.add('highlighted');
    // Optionally, scroll to the highlighted card
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * Removes highlighting from all deck cards.
 */
function removeDeckHighlights() {
  const highlightedCards = document.querySelectorAll('.card.highlighted');
  highlightedCards.forEach(card => card.classList.remove('highlighted'));
}

/**
 * Applies filters and updates selected filters display.
 */
function applyFiltersAndUpdate() {
  const filteredData = applyFilters();
  console.log('Filtered Data Length:', filteredData.length);
  populateCards(filteredData);
  updateSelectedFilters(onFilterRemove);

  // Highlight selected deck if 'Nr' filter is present and not from Random Deck
  const filters = getCurrentFilters();
  const randomNr = getRandomDeckNr();
  if (filters['Nr'] && filters['Nr'].length === 1 && !randomNr) {
    highlightSelectedDeck(filters['Nr'][0]);
  }
}

/**
 * Saves current filters to localStorage.
 * (Optional: Implemented in previous steps)
 */
function saveFilters() {
  const filters = getCurrentFilters();
  const randomNr = getRandomDeckNr();
  const combinedFilters = { ...filters };
  if (randomNr) {
    combinedFilters['Nr'] = [randomNr];
  }
  localStorage.setItem('selectedFilters', JSON.stringify(combinedFilters));
  console.log('Filters saved to localStorage:', combinedFilters);
}

/**
 * Loads filters from localStorage.
 */
function loadFilters() {
  const savedFilters = JSON.parse(localStorage.getItem('selectedFilters')) || {};
  console.log('Loaded filters from localStorage:', savedFilters);

  // Separate user filters and random deck filter
  const { Nr, ...userFilters } = savedFilters;

  // Set user filters
  setFilters(userFilters);

  // If 'Nr' exists, treat it as a user-applied filter
  if (Nr && Nr.length > 0) {
    Nr.forEach(nr => {
      addFilterValue('Nr', nr);
    });
  }

  // Update checkboxes based on loaded filters
  const dropdowns = document.querySelectorAll('.multi-select-dropdown');

  dropdowns.forEach((dropdown) => {
    const column = dropdown.dataset.column;
    const selectedValues = savedFilters[column] || [];

    selectedValues.forEach((value) => {
      const checkbox = dropdown.querySelector(`input[type="checkbox"][value="${value}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });
  });

  console.log('Checkboxes updated based on loaded filters.');
}

/**
 * Initialize the application.
 */
(async function init() {
  const data = await fetchData();
  setData(data);

  // Create dropdowns and pass the onFilterChange callback
  createDropdowns(data, onFilterChange);

  // Optionally load filters from localStorage
  loadFilters(); // Comment this line out if you want to start without any filters

  // Apply filters and update display
  applyFiltersAndUpdate();

  // Set up event listeners for reset and random buttons
  const resetButton = document.getElementById('reset-button');
  const randomButton = document.getElementById('random-button');

  if (resetButton) {
    resetButton.onclick = handleResetFilters;
    console.log('Reset button event listener attached.');
  } else {
    console.error('Reset button not found.');
  }

  if (randomButton) {
    randomButton.onclick = handleRandomDeck;
    console.log('Random button event listener attached.');
  } else {
    console.error('Random button not found.');
  }

  // Set up event listener for Toggle Filters button
  const toggleFiltersButton = document.getElementById('toggle-filters');
  const filterRow = document.getElementById('filter-row');

  if (toggleFiltersButton && filterRow) {
    toggleFiltersButton.addEventListener('click', () => {
      const isHidden = filterRow.classList.toggle('hidden');
      toggleFiltersButton.setAttribute('aria-expanded', !isHidden);
      toggleFiltersButton.textContent = isHidden ? 'Filter' : 'Filter ausblenden';
      console.log(`Filter Row toggled. Now hidden: ${isHidden}`);
    });
  } else {
    console.error('Toggle Filters Button or Filter Row not found.');
  }
})();
