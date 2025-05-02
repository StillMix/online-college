const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,

  // Настройка прокси
  devServer: {
    proxy: {
      "/api": {
        target: "http://195.133.50.207", // Прокси на https
        secure: true, // Убедитесь, что прокси использует HTTPS
        changeOrigin: true, // Переписывает origin, чтобы он соответствовал целевому серверу
        logLevel: "debug", // Это поможет отладить проблемы с прокси
      },
    },
  },
});
