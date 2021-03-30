//based on fhir-bridge/src/test/resources/Condition/create-condition-default.json
let conditionTemplate = '{\n' +
    '  "resourceType": "Condition",\n' +
    '  "id": "example",\n' +
    '  "text": {\n' +
    '    "status": "generated",\n' +
    '    "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Severe burn of left ear (Date: 24-May 2012)</div>"\n' +
    '  },\n' +
    '  "clinicalStatus": {\n' +
    '    "coding": [\n' +
    '      {\n' +
    '        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",\n' +
    '        "code": "active"\n' +
    '      }\n' +
    '    ]\n' +
    '  },\n' +
    '  "verificationStatus": {\n' +
    '    "coding": [\n' +
    '      {\n' +
    '        "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",\n' +
    '        "code": "confirmed"\n' +
    '      }\n' +
    '    ]\n' +
    '  },\n' +
    '  "category": [\n' +
    '    {\n' +
    '      "coding": [\n' +
    '        {\n' +
    '          "system": "http://terminology.hl7.org/CodeSystem/condition-category",\n' +
    '          "code": "encounter-diagnosis",\n' +
    '          "display": "Encounter Diagnosis"\n' +
    '        },\n' +
    '        {\n' +
    '          "system": "http://snomed.info/sct",\n' +
    '          "code": "439401001",\n' +
    '          "display": "Diagnosis"\n' +
    '        }\n' +
    '      ]\n' +
    '    }\n' +
    '  ],\n' +
    '  "severity": {\n' +
    '    "coding": [\n' +
    '      {\n' +
    '        "system": "http://snomed.info/sct",\n' +
    '        "code": "24484000",\n' +
    '        "display": "Severe"\n' +
    '      }\n' +
    '    ]\n' +
    '  },\n' +
    '  "code": {\n' +
    '    "coding": [\n' +
    '      {\n' +
    '        "system": "http://fhir.de/CodeSystem/dimdi/icd-10-gm",\n' +
    '        "code": "B97.2",\n' +
    '        "display": "Coronavirus as the cause of diseases classified to other chapters"\n' +
    '      }\n' +
    '    ],\n' +
    '    "text": "Coronavirus as the cause of diseases classified to other chapters"\n' +
    '  },\n' +
    '  "bodySite": [\n' +
    '    {\n' +
    '      "coding": [\n' +
    '        {\n' +
    '          "system": "http://snomed.info/sct",\n' +
    '          "code": "49521004",\n' +
    '          "display": "Left external ear structure"\n' +
    '        }\n' +
    '      ],\n' +
    '      "text": "Left Ear"\n' +
    '    }\n' +
    '  ],\n' +
    '  "subject": {\n' +
    '    "identifier": {\n' +
    '        "system": "urn:jboss:domain:keycloak:1.1",\n' +
    '        "value": "e911dac7-c7bc-4edb-9b25-260ce1b757fa"\n' +
    '    },      \n' +
    '    "reference": "http://localhost:8082/fhir/Patient/103",\n' +
    '    "type": "Patient"\n' +
    '      \n' +
    '    \n' +
    '  },\n' +
    '  "onsetDateTime": "2012-05-24",\n' +
    '  "recorder": {\n' +
    '    "reference": "http://external.fhir.server/Practitioner/f201"\n' +
    '  }\n' +
    '}';

export default conditionTemplate;