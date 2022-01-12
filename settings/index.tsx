// @ts-nocheck

import {STORAGE_KEYS} from "../common/config";

const DexcomSecretsSection = () => {
  const descriptionMarkup = (
    <Text>
      These settings are required to access the Dexcom Share API in order to
      read your glucose levels.

      The server should either be set to "us" or "eu. If you're in the US, the
      server should be "us". Any other country outside of the US (eg. Canada)
      is classified as "eu" by Dexcom.
    </Text>
  );

  return (
    <Section description={descriptionMarkup} title={<Text bold align="center">Configure Dexcom Settings</Text>}>
      <TextInput title="Dexcom Share username" settingsKey={STORAGE_KEYS.DEXCOM_USERNAME} />
      <TextInput title="Dexcom Share password" settingsKey={STORAGE_KEYS.DEXCOM_PASSWORD} />

      <Select
        label="Dexcom Share server"
        settingsKey={STORAGE_KEYS.DEXCOM_SERVER}
        options={[
          {name: "eu"},
          {name: "us"},
        ]}
      />

      <Select
        label="Format: mmol/L or mg/dL"
        settingsKey={STORAGE_KEYS.DEXCOM_UNIT}
        options={[
          {name: "mmol"},
          {name: "mgdl"},
        ]}
      />
    </Section>
  );
};

const DexcomAlertSection = () => {
  const descriptionMarkup = (
    <Text>
      Configure a low and high threshold for alerting. This will enable
      vibration alerts on the smart watch when you get a low or high. Both of
      these must be configured correctly in order for alerting to properly
      function. Note: these values should be in the same unit as the format
      selected above.
    </Text>
  );

  return (
    <Section description={descriptionMarkup} title={<Text bold align="center">Configure Alerting Thresholds</Text>}>
      <TextInput title="High threshold" settingsKey={STORAGE_KEYS.DEXCOM_HIGH_THRESHOLD} />
      <TextInput title="Low threshold" settingsKey={STORAGE_KEYS.DEXCOM_LOW_THRESHOLD} />
    </Section>
  );
}

const WeatherSection = () => {
  return (
    <Section title={<Text bold align="center">Configure Weather Settings</Text>}>
      <Select
        label="Unit (celcius or fahrenheit)"
        settingsKey={STORAGE_KEYS.WEATHER_UNIT}
        options={[
          {name: "celsius"},
          {name: "fahrenheit"},
        ]}
      />
    </Section>
  );
}

registerSettingsPage(() => (
  <Page>
    <DexcomSecretsSection />
    <DexcomAlertSection />
    <WeatherSection />
  </Page>
));
