/*
 * config.js limpio para ejecución desde web local
 */

const configuracion = {
    WebSocketClient: {
        host: "ws://localhost:13002",   // WebSocket local como el SASMEX original
        url: "localhost",
        protocolo: "public"
    },
    FireBase: {}, // ya no se usa
    port: 0,      // ya no se usa
    host: "localhost",
    nombre: "Monitor Público Local"
};
