export const SOCRATA_SOURCES = {
  // Los Angeles City open data portal
  LA_CITY: {
    BASE_URL: 'https://data.lacity.org',
    DATASETS: {
      // 311 service request datasets, grouped by year
      CITY_311: {
        CURRENT_YEAR: {
          RESOURCE_ID: 'h73f-gn57',
          YEAR: '2025',
        },
        PAST_YEARS: [
          {
            YEAR: '2024',
            RESOURCE_ID: '',
          },
        ],
      },
    },
  },
};
