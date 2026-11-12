/**
 * Minh họa code kết nối, Subscribe & Xử lý tin nhắn bằng Node.js (Tương đương nhánh ESP32 MCU trong Node-RED)
 * Chạy thử: node src/subscriber_esp32.js
 */
const mqtt = require("mqtt");

// 1. Khởi tạo MQTT Client và cấu hình địa chỉ Broker
const BROKER_URL = process.env.MQTT_BROKER || "mqtt://broker.emqx.io:1883";
const TOPIC = "light";

const client = mqtt.connect(BROKER_URL);

// 2. Khi kết nối thành công -> Đăng ký (Subscribe) topic cần nhận
client.on("connect", () => {
    console.log(`[ESP32 MCU] Đã kết nối tới MQTT Broker: ${BROKER_URL}`);
    client.subscribe(TOPIC, { qos: 0 }, (err) => {
        if (!err) {
            console.log(`[ESP32 MCU] Đang lắng nghe tại topic: '${TOPIC}'...`);
        }
    });
});

// 3. Khi nhận được tin nhắn -> Đọc topic, đọc payload và xử lý điều khiển Light
client.on("message", (topic, messageBuffer) => {
    const payload = messageBuffer.toString().trim();
    console.log(`\n[ESP32 MCU] Nhận gói tin -> Topic: '${topic}' | Payload: '${payload}'`);

    if (payload === "1" || payload.toLowerCase() === "true") {
        console.log("=> Kết quả kiểm tra: True -> Điều khiển LIGHT: BẬT (ON)");
    } else {
        console.log("=> Kết quả kiểm tra: False -> Điều khiển LIGHT: TẮT (OFF)");
    }
});
