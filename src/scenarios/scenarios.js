//ainda em teste!!!
export const options = {
  scenarios: {
    carga: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: 10 },
        { duration: '30s', target: 50 },
        { duration: '20s', target: 0 },
      ],
      exec: 'testeCarga',
    },
    estresse: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: 100 },
        { duration: '1m', target: 200 },
        { duration: '20s', target: 0 },
      ],
      exec: 'testeEstresse',
    },
  },

  thresholds: {
    //globais
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],

    //especificos
    'http_req_duration{scenario:carga}': ['p(95)<400'],     // carga
    'http_req_failed{scenario:carga}': ['rate<0.01'],       // carga
    'http_req_duration{scenario:estresse}': ['p(95)<1000'], // estresse
  },
};