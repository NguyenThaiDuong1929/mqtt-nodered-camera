/**
 * TỔNG HỢP CODE TRONG CÁC NODE FUNCTION CỦA NODE-RED
 * File này giúp dễ dàng đọc và kiểm tra logic xử lý tin nhắn trên GitHub.
 */

// ============================================================================
// 1. MÔ HÌNH THEO SƠ ĐỒ: CORE PLATFORM -> MQTT (topic: light) -> ESP32 -> Light
// ============================================================================

/**
 * Node Function phía gửi: CORE PLATFORM
 * Nhận trạng thái từ Camera IP (true/false), rẽ nhánh gửi "1" hoặc "0" vào topic "light"
 */
function corePlatformCreateMessage(msg) {
    const isDetected = msg.payload; // true hoặc false từ Camera IP
    msg.topic = "light";

    if (isDetected === true) {
        msg.payload = "1"; // Nhánh true:1
    } else {
        msg.payload = "0"; // Nhánh false:0
    }
    return msg;
}

/**
 * Node Function phía nhận: ESP32 (MCU)
 * Nhận tin nhắn từ topic "light", kiểm tra điều kiện để bật/tắt đèn (Light)
 */
function esp32ProcessMessage(msg) {
    const receivedTopic = msg.topic;
    const receivedPayload = String(msg.payload).trim();

    if (receivedPayload === "1" || receivedPayload.toLowerCase() === "true") {
        msg.lightState = "ON";
        msg.payload = `[ESP32 - topic '${receivedTopic}'] Nhận '${receivedPayload}' (True) -> LIGHT: BẬT (ON)`;
    } else {
        msg.lightState = "OFF";
        msg.payload = `[ESP32 - topic '${receivedTopic}'] Nhận '${receivedPayload}' (false) -> LIGHT: TẮT (OFF)`;
    }
    return msg;
}

// ============================================================================
// 2. MÔ HÌNH GIAO TIẾP HAI CHIỀU: BÊN A <-> BÊN B
// ============================================================================

/**
 * Node Function: Tạo tin nhắn của Bên A gửi cho Bên B
 */
function createMessageA(msg) {
    msg.topic = "demo/a_to_b";
    msg.payload = "Xin chào B";
    return msg;
}

/**
 * Node Function: Tạo tin nhắn phản hồi của Bên B gửi lại Bên A
 */
function createMessageB(msg) {
    msg.topic = "demo/b_to_a";
    msg.payload = "B đã nhận được tin nhắn";
    return msg;
}

/**
 * Node Function: Ví dụ đóng gói nhiều trường dữ liệu bằng JSON qua MQTT
 */
function createJsonMessageA(msg) {
    msg.topic = "demo/a_to_b";
    msg.payload = JSON.stringify({
        sender: "A",
        text: "Xin chào B",
        timestamp: Date.now()
    });
    return msg;
}

module.exports = {
    corePlatformCreateMessage,
    esp32ProcessMessage,
    createMessageA,
    createMessageB,
    createJsonMessageA
};
