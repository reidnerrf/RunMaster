## iOS WatchKit + WCSession Setup (Guia)

Este projeto usa Expo/React Native. Para adicionar WatchKit e WCSession:

### 1) Gerar iOS nativo
- Rode `npx expo prebuild -p ios` para gerar `ios/` se ainda não existir.

### 2) Adicionar targets de Watch
- No Xcode, File > New > Target…
  - watchOS App (App) → PulseWatch
  - watchOS App Extension → PulseWatch Extension
- Certifique-se de marcar “Include Notification Scene” apenas se necessário.

### 3) Habilitar WCSession
- Em `Pulse` (iOS app), adicionar `WatchConnectivity.framework`.
- No `PulseWatch Extension`, importar `WatchConnectivity`.

### 4) Bridge RN (Swift)
- Criar `ios/Pulse/WatchConnectivityModule.swift` com métodos `connect()`, `disconnect()`, `send(type:payload:)` e eventos nativos `message`.
- Expor via `RCTBridgeModule` e enviar eventos com `RCTEventEmitter`.

### 5) Session Manager (Extension)
- Em `PulseWatch Extension`, criar `SessionManager` com `WCSession.default` para enviar/receber mensagens para o iPhone.

### 6) Schema de Deep Link
- Garanta `scheme` `pulse` no app iOS (Info > URL Types) para acionar comandos via Siri/Shortcuts.

### 7) Build & Test
- Execute o app iOS + Watch no simulador (parear simulador de Apple Watch).

### 8) Integração com JS
- O wrapper TS `utils/watchNative.ios.ts` se conecta ao módulo nativo `WatchConnectivity`.

Exemplos de código estão no arquivo `ios/EXEMPLOS_WATCHCONNECTIVITY.md` (a ser criado quando o projeto iOS existir).

