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
    <Section description={descriptionMarkup}>
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

const WeatherSection = () => {
  const titleMarkup = (
    <Text bold>
      Configure weather settings
    </Text>
  );

  return (
    <Section title={titleMarkup}>
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
    <WeatherSection />
  </Page>
));
