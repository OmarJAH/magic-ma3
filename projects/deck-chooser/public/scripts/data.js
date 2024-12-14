// public/scripts/data.js

// Base URL for the API
const apiBase = 'http://localhost:3000';

// Function to fetch data
export async function fetchData() {
  try {
    const response = await fetch(`${apiBase}/data`);
    if (!response.ok) {
      console.error('Server responded with error:', response.status);
      throw new Error(`Error fetching data: ${response.status}`);
    }

    const rawData = await response.json();
    console.log('Loaded data:', rawData);

    // Process data: Remove 'Author' and ensure 'Nr' exists
    const processedData = rawData.map((row) => {
      const { Author, ...rest } = row;
      return { ...rest, Nr: row.Nr?.trim() || 'Keine Nummer' };
    });

    return processedData;
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    return [];
  }
}
