// Coloque este arquivo em: ios/Pulse/WatchConnectivityModule.swift
// Após rodar: npx expo prebuild -p ios

import Foundation
import WatchConnectivity
import React

@objc(WatchConnectivity)
class WatchConnectivityModule: RCTEventEmitter {
  private var session: WCSession? = WCSession.isSupported() ? WCSession.default : nil

  override static func requiresMainQueueSetup() -> Bool { true }
  override func supportedEvents() -> [String]! { ["message"] }

  @objc func connect() {
    session?.delegate = self
    session?.activate()
  }

  @objc func disconnect() {
    session?.delegate = nil
  }

  @objc func send(_ type: NSString, payload: NSString) {
    guard let s = session, s.isReachable else { return }
    let dict: [String: Any] = ["type": type as String, "payload": payload as String]
    s.sendMessage(dict, replyHandler: nil, errorHandler: nil)
  }
}

extension WatchConnectivityModule: WCSessionDelegate {
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}
  func sessionDidBecomeInactive(_ session: WCSession) {}
  func sessionDidDeactivate(_ session: WCSession) {}
  func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
    if let payload = message["payload"] as? String {
      sendEvent(withName: "message", body: ["payload": payload])
    }
  }
}

