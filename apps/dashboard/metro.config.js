// Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

/** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);
const config = getSentryExpoConfig(__dirname);

module.exports = config;
