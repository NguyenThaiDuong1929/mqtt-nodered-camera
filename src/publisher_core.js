/**
 * Minh họa code kết nối & Publish MQTT bằng Node.js (Tương đương nhánh CORE PLATFORM trong Node-RED)
 * Chạy thử: node src/publisher_core.js
 */
const mqtt = require("mqtt");

// 1. Khởi tạo MQTT Client và cấu hình địa chỉ Broker
const BROKER_URL = process.env.MQTT_BROKER || "mqtt://broker.emqx.io:1883";
const TOPIC = "light";

const client = mqtt.connect(BROKER_URL);

client.on("connect", () => {
    console.log(`[CORE PLATFORM] Đã kết nối tới MQTT Broker: ${BROKER_URL}`);

    // Giả lập tín hiệu từ Camera IP (true -> gửi "1", false -> gửi "0")
    const cameraSignal = true;
    const payload = cameraSignal ? "1" : "0";

    console.log(`[CORE PLATFORM] Camera=${cameraSignal} -> Publish topic='${TOPIC}', payload='${payload}'`);

    // 2. Publish tin nhắn lên Broker
    client.publish(TOPIC, payload, { qos: 0, retain: false }, (err) => {
        if (err) {
            console.error("[CORE PLATFORM] Lỗi khi gửi tin:", err);
        } else {
            console.log("[CORE PLATFORM] Gửi tin nhắn thành công!");
        }
        client.end();
    });
});
