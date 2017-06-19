import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Linking } from 'react-native'

import { isObject, wait } from 'cmn/all'


import { getDetail, genTwitterToken, getAuthURL, SERVICES } from './auth'

import styles from './style.css'

getDetail.cache(SERVICES.TWITTER, {
    consumer_key: 'AjONvgAdbD8YWCtRn5U9yA',
    consumer_secret: 'jrcJKxvJ92NeeV48RL1lotN9PigbxCCbqUkKj237yio',
    callback_url: `https://sundayschoolonline.org/auth/InstaLikes/${SERVICES.TWITTER}/instalikes`
});

getDetail.cache(SERVICES.INSTAGRAM, {
    client_id: 'b475d7b6428f40caae8b747d09a78b41',
    client_secret: 'cac3817607bf472e8a938f41751676ef',
    redirect_uri: `https://sundayschoolonline.org/auth/InstaLikes/${SERVICES.INSTAGRAM}/instalikes`
});

class App extends Component {
    state = {
        authstatus: undefined,
        authbtn: true
    }
    openAuth = async () => {
        this.setState(()=>({ authstatus:'Getting authorization page...', authbtn:false }));
        let url;
        try {
            url = await getAuthURL(SERVICES.INSTAGRAM);
        } catch(ex) {
            this.setState(()=>({ authstatus:'Failed to get authorization page, please try again.', authbtn:true }));
            return;
        }
        this.setState(()=>({ authstatus:'Opening authorization page in browser...' }));
        this.handled = false;
        console.log('will openURL');
        Linking.openURL(url);
        console.log('did openURL');
        await wait(1000);
        console.log('will setState');
        if (!this.handled) this.setState(()=>({ authstatus:'The authorization tab has been opened in your browser. If it has not, please try again.', authbtn:true }));
    }
    handleAuth = e => {
        this.handled = true;
        console.log('in handle auth, e:', e);
        const { url } = e;
        console.log('url:', url);
        // floppers://auth?json
        /* json {
            service: SERVICES.*
            approved: bool,
            ... see crossserver-link18283
        }
        */

        const details = JSON.parse(decodeURIComponent(url.substr(url.indexOf('?') + 1)));
        console.log('service:', details.service, 'details:', details);

        if (details.approved) {
            this.setState(()=>({ authstatus:details, authbtn:false }));
            Linking.removeEventListener('url', this.handleAuth);
        } else if (!details.approved) {
            this.setState(()=>({ authstatus:'You denied permission. You will not be able to use the Twitter features, please authenticate again and allow.', authbtn:true }));
        } else {
            this.setState(()=>({ authstatus:'Unknown. Please try authenicating again.', authbtn:true }));
        }
    }
    componentDidMount() {
        Linking.addEventListener('url', this.handleAuth);
    }
    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleAuth);
        console.log('UNMOUNTING!!!!!!');
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