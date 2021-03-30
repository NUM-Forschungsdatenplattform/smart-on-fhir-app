import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import Keycloak, {KeycloakAdapter, KeycloakConfig} from "keycloak-js";
import jwtDecode from "jwt-decode";

Vue.config.productionTip = false

const initOptions: KeycloakConfig = {
  url: 'http://localhost:8088/auth',
  realm: 'master',
  clientId: 'app-html5',
};


const _keycloak = Keycloak(initOptions);

_keycloak
    /**
     * Both check-sso and login-required options for onLoad are problematic
     * None of these allow us to pass in smart on fhir related scopes
     * so we init with none of these and perform login explicitly if not authentication is
     * in place, so that we can pass scopes to auth call. without these scopes, keycloak
     * will give us an ordinary token without the custom claims smart on fhir uses
     */
    // .init({onLoad: "check-sso", redirectUri: 'http://localhost:9090/',  checkLoginIframe: false})
    .init({redirectUri: 'http://localhost:9090/',  checkLoginIframe: false})
    .then((success:boolean) => {
        if (!_keycloak.authenticated){
            _keycloak.login({scope: "launch/patient patient/*.*"})
        }else
        {
            if (_keycloak.token != null) {
                const tokenContents = jwtDecode(_keycloak.token)

                new Vue({
                    vuetify,
                    render: h =>
                        h(App,
                            {props:
                                    {oaToken: _keycloak.token,
                                    //@ts-ignore //TODO: tokenContents should be typed
                                    oaPatient: tokenContents.patient}}),

                } ).$mount('#app')
            }
        }
    });
