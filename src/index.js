import app from "./app.js";

const execute = async () => {
    try {
        // Quitamos la llamada al seed de aquí para evitar errores y duplicados
        app.listen(app.get("port"), () => {
            console.log("🚀 Server started on port " + app.get("port"));
        });
    } catch (error) {
        console.error("❌ Error al iniciar el servidor:", error);
        process.exit(1);
    }
}

execute();