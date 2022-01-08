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

  const descriptionMarkup = (
    <Text>
      Note: the API key is required as its used to pull the weather from
      https://openweathermap.org/. Signup is free and takes less than 5
      minutes. Create an account and enter in your API key in the field below.

      https://home.openweathermap.org/users/sign_in
    </Text>
  );

  return (
    <Section title={titleMarkup} description={descriptionMarkup}>
      <Select
        label="Unit (celcius or fahrenheit)"
        settingsKey={STORAGE_KEYS.WEATHER_UNIT}
        options={[
          {name: "c"},
          {name: "f"},
        ]}
      />

      <TextInput
        label="Open Weather Map API Key (required)"
        settingsKey={STORAGE_KEYS.WEATHER_API_KEY}
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
