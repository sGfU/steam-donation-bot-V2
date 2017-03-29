// bot.js
// created by http://steamcommunity.com/id/sgfu/ All rights reserved
// more releases at my github http://github.com/sgfu/

'use strict'

// requires

const config = require("./config.js");
const Config = require('config-js'); // do not edit this, the capitalization is VERY important
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeofferManager = require('steam-tradeoffer-manager');
const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeofferManager({
        steam: client,
        community: community,
        language: 'en' // can be any language
});

// log on options,change these in the config.js

const logOnOptions = {
    "accountName": config.steam.username,
    "password": config.steam.password,
    "twoFactorCode": SteamTotp.generateAuthCode(config.steam.twoFactorCode)
};

client.logOn(logOnOptions);

// these events happen when the bot is logged in

client.on('loggedOn', () => {
        console.log('[!]Logged into Steam!');
    
        client.setPersona(SteamUser.Steam.EPersonaState.Online, config.steam.botname);
        client.gamesPlayed(440);

        console.log('[!]Playing a gay Free To Play game cause ur mum gey');
});

// this function loads up the trade offers 

client.on('webSession', (sessionid, cookies) => {
        manager.setCookies(cookies);

        community.setCookies(cookies);
        community.startConfirmationChecker(config.steam.refreshInterval, config.steam.identity_secret);
});

// this is what happens when someone adds the bot

client.on('friendRelationship', (steamid, relationship) => {
    if (relationship === 2) {
        client.addFriend(steamid);
        console.log('[!]Someone added the bot!'); 
        client.chatMessage(steamid, `*insert message here`); // optional, these can be removed/edited
    }
});

// this accpets the donations, and declines if someone is trying to take the items

manager.on('newOffer', (offer) => {
    if (offer.itemsToGive.length === 0) {
        offer.accept((err, status) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`[!]Donation accepted. Status: ${status}.`);

            }
        });
    } else {
        offer.decline((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`[!]Donation declined (wanted our items).`)
            }
        });
        
     }
});
                
        
