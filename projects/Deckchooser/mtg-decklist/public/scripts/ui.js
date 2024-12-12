// public/scripts/ui.js

import { getCurrentFilters, getRandomDeckNr } from './filters.js';

/**
 * Creates multi-select dropdowns for filtering.
 * @param {Array} data - The array of deck objects.
 * @param {Function} onFilterChange - Callback to handle filter changes.
 */
export function createDropdowns(data, onFilterChange) {
  const filterContainer = document.getElementById('filter-container');
  filterContainer.innerHTML = ''; 
  console.log('Creating dropdowns for filters.');

  const columns = Object.keys(data[0] || {});
  const filteredColumns = columns.filter((column) =>
    column !== 'Cover' && column !== 'Nr' && column !== 'ImageNumber'
  );

  const predefinedFilters = {
    Farben: ['B', 'W', 'R', 'G', 'U'] // predefined base colors
  };

  filteredColumns.forEach((column) => {
    let uniqueValues = [];

    if (predefinedFilters[column]) {
      uniqueValues = predefinedFilters[column];
    } else {
      const tokenSet = new Set();
      data.forEach(row => {
        if (row[column]) {
          const tokens = row[column].split(',').map(t => t.trim()).filter(t => t);
          tokens.forEach(token => tokenSet.add(token));
        }
      });
      uniqueValues = Array.from(tokenSet).sort((a, b) => a.localeCompare(b));
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'filter-wrapper';
    console.log(`Creating dropdown for column: ${column}`);

    const label = document.createElement('label');
    label.textContent = column;

    const dropdown = document.createElement('div');
    dropdown.className = 'multi-select-dropdown';
    dropdown.dataset.column = column;

    const header = document.createElement('div');
    header.className = 'multi-select-header';
    header.textContent = `Alle ${column}`;
    dropdown.appendChild(header);

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'multi-select-options';

    uniqueValues.forEach((value) => {
      const optionLabel = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = value;
      
      // Update the onchange handler to call the callback with filter details
      checkbox.onchange = () => {
        console.log(`Checkbox Toggled - Column: ${column}, Value: ${value}, Checked: ${checkbox.checked}`);
        onFilterChange(column, value, checkbox.checked);
      };
      
      optionLabel.appendChild(checkbox);
      optionLabel.appendChild(document.createTextNode(value));
      optionsContainer.appendChild(optionLabel);
    });

    dropdown.appendChild(optionsContainer);
    wrapper.appendChild(label);
    wrapper.appendChild(dropdown);
    filterContainer.appendChild(wrapper);

    // Toggle open/close on header click
    header.addEventListener('click', () => {
      toggleDropdown(dropdown);
    });
  });
}

/**
 * Toggles the dropdown open state and closes others.
 * @param {HTMLElement} dropdown - The dropdown to toggle.
 */
function toggleDropdown(dropdown) {
  const isOpen = dropdown.classList.toggle('open');
  console.log(`Toggling dropdown for ${dropdown.dataset.column}. Open state: ${isOpen}`);

  // Close other dropdowns
  const allDropdowns = document.querySelectorAll('.multi-select-dropdown');
  allDropdowns.forEach((dd) => {
    if (dd !== dropdown) {
      dd.classList.remove('open');
    }
  });
}

/**
 * Populates deck cards based on the provided data.
 * @param {Array} data - The array of deck objects to display.
 */
export function populateCards(data) {
  const container = document.getElementById('data-container');
  const noDataMessage = document.getElementById('no-data-message');
  const template = document.getElementById('card-template');

  container.innerHTML = ''; // Clear existing cards

  if (data.length === 0) {
    noDataMessage.style.display = 'block';
    return;
  } else {
    noDataMessage.style.display = 'none';
  }

  const fragment = document.createDocumentFragment();

  data.forEach((row) => {
    const cardFragment = template.content.cloneNode(true);
    const cardElement = cardFragment.querySelector('.card');
    cardElement.style.backgroundImage = `url(${row.Cover})`;

    const cardContent = cardFragment.querySelector('.card-content');
    Object.entries(row).forEach(([key, value]) => {
      // Skip unwanted keys
      if (key === 'Cover' || key === 'Nr' || key === 'ImageNumber') return;
      // Skip empty values
      if (value == null || value.trim() === '') return;

      const p = document.createElement('p');
      p.innerHTML = `<strong>${key}:</strong> ${value}`;
      cardContent.appendChild(p);
    });

    fragment.appendChild(cardFragment);
  });

  container.appendChild(fragment);
}

/**
 * Updates the selected filters display box in the main frame.
 * @param {Function} onFilterRemove - Callback to remove a filter when '×' is clicked.
 */
export function updateSelectedFilters(onFilterRemove) {
  const filtersList = document.getElementById('filters-list-main');
  const selectedFiltersContainer = document.getElementById('selected-filters-main');
  filtersList.innerHTML = ''; // Clear existing filters

  const filters = getCurrentFilters(); // Get user-applied filters from 'filters.js'
  const randomNr = getRandomDeckNr(); // Get random deck filter if any

  let hasFilters = false;

  Object.entries(filters).forEach(([column, values]) => {
    values.forEach((value) => {
      // Exclude 'Nr' filters applied via Random Deck
      if (column === 'Nr' && randomNr === String(value)) {
        return; // Skip displaying this filter tag
      }

      hasFilters = true;
      const filterTag = document.createElement('div');
      filterTag.className = 'filter-tag-main';
      filterTag.innerHTML = `${column}: ${value} <span data-column="${column}" data-value="${value}">&times;</span>`;
      filtersList.appendChild(filterTag);
    });
  });

  if (hasFilters) {
    selectedFiltersContainer.style.display = 'block';
  } else {
    selectedFiltersContainer.style.display = 'none';
  }

  // Add event listeners to remove filter tags
  const removeButtons = document.querySelectorAll('.filter-tag-main span');
  removeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const column = e.target.getAttribute('data-column');
      const value = e.target.getAttribute('data-value');
      onFilterRemove(column, value);

      // Add 'removing' class for animation
      const filterTag = e.target.parentElement;
      filterTag.classList.add('removing');

      // Listen for animation end to remove the element
      filterTag.addEventListener('animationend', () => {
        filterTag.remove();
      }, { once: true });
    });
  });
}
