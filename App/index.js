import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Linking } from 'react-native'
import qs from 'qs'

import { genTwitterRequest, genTwitterToken, getAuthURL, SERVICES } from './auth'
import { isObject, wait } from './utils'

import styles from './style.css'

genTwitterRequest.cacheKey('REMOVED');
genTwitterRequest.cacheSecret('REMOVED');
genTwitterToken.cacheCallbackURL('https://sundayschoolonline.org/auth.html#name=Floppers&service=Twitter&protocol=floppers');

class App extends Component {
    state = {
        authstatus: undefined,
        authbtn: true
    }
    openAuth = async () => {
        this.setState(()=>({ authstatus:'Getting authorization page...', authbtn:false }));
        let url;
        try {
            url = await getAuthURL(SERVICES.TWITTER);
        } catch(ex) {
            this.setState(()=>({ authstatus:'Failed to get authorization page, please try again.', authbtn:true }));
        }
        this.setState(()=>({ authstatus:'Opening authorization page in browser...' }));
        Linking.openURL(url);
        await wait(3000);
        if (!isObject(this.state.authstatus)) this.setState(()=>({ authstatus:'Authorization failed. You probably disallowed permission. Please try again.', authbtn:true }));
    }
    handleAuth = e => {
        console.log('in handle auth, e:', e);
        const { url } = e;
        console.log('url:', url);
        // floppers://auth/Twitter?oauth_token=32vv-QAAAAAAWN0mAAABXLjPMuo&oauth_verifier=G9QYcm8Pr0o8UvU4nzvlHoK37zEc1Uf4

        const service_st = url.indexOf('auth/') + 5;
        const service_en = url.indexOf('?');
        const service = url.substr(service_st, service_en - service_st).toUpperCase();
        const details = qs.parse(url.substr(url.indexOf('?') + 1));
        console.log('service:', service, 'details:', details);

        this.setState(()=>({ authstatus:details, authbtn:false }));

        Linking.removeEventListener('url', this.handleAuth);
    }
    componentDidMount() {
        Linking.addEventListener('url', this.handleAuth);
    }
    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleAuth);
    }
    render() {
        const { authstatus, authbtn } = this.state;

        return (
            <View style={styles.container}>
                { authbtn && <Button title="Authorize" onPress={this.openAuth} /> }
                { typeof authstatus === 'string' && <Text>{authstatus}</Text> }
                { isObject(authstatus) && <Text>You can now use the Twitter features of the app!</Text> }
            </View>
        )
    }
}

AppRegistry.registerComponent('oa', () => App);