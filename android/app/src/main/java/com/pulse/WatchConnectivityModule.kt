// package path inferred from namespace com.pulse
package com.pulse

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class WatchConnectivityModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
	private val context = reactContext

	override fun getName(): String = "WatchConnectivity"

	@ReactMethod
	fun connect() {
		// TODO: Initialize Wearable API (MessageClient/DataClient)
	}

	@ReactMethod
	fun disconnect() {
		// TODO: Disconnect
	}

	@ReactMethod
	fun send(type: String, payload: String) {
		// TODO: Send message to wearable
	}

	private fun emit(eventName: String, payload: String) {
		context
			.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
			.emit(eventName, mapOf("payload" to payload))
	}
}