#NUM Platform SMART On FHIR POC Client

This is a Vue.js (v2) based single page app (SPA), developed as a proof of concept client for NUM Platform's Demographic and FHIR-Bridge components

It is configured to support both js and typescript. Various critical URLs are included directly in code and should be configured for your local development environment to run this SPA. The three URLs fundamental to getting this app running are

- Keycloak URL: See initOptions object in main.ts
- Fhir Bridge URL: See REST requests to http://localhost:8888/fhir-bridge/fhir in Softmain.js
- Demographic URL: See REST requests to http://localhost:8082/fhir/Patient in Softmain.js

This project was created using Vue CLI, following the standard Vue documentation, so please see Vue.js web site for V2 to get an understanding of Vue. The contents below are created automatically by the Vue CLI and explain how to run some key commands for this app.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
