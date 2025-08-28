# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started (App + API)

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the API (MongoDB required)

   ```bash
   # ensure MongoDB is running locally or set MONGODB_URI
   export MONGODB_URI="mongodb://localhost:27017/runmaster"
   npm run server
   ```

3. Start the app (in another terminal)

   ```bash
   npm run start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

Quick commands:

```bash
npm run android   # open Android emulator
npm run ios       # open iOS simulator (macOS)
npm run web       # run web target
```

You can start developing by editing files inside the `Screens`, `components`, and `Lib` directories.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Weather API (Server proxy)

The server exposes a proxy to WeatherAPI current conditions to simplify client usage and hide the API key.

Endpoint:

```
GET /weather/current?q=<city_or_lat,lon>[&format=json|xml]
```

Examples:

```bash
curl "http://localhost:3000/weather/current?q=Sao%20Paulo" | jq .
curl "http://localhost:3000/weather/current?q=-23.55,-46.63" | jq .
curl -H "Accept: application/xml" "http://localhost:3000/weather/current?q=Lisbon&format=xml"
```

Notes:
- Defaults to JSON; pass `format=xml` for XML.
- Configure your own key by setting `WEATHERAPI_KEY` env var; a development key is used if not set.