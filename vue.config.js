module.exports = {
    devServer: {
      proxy: {
        '^/api': {
          target: 'https://mhjr.hydradigital.com.br',
          ws: true,
          changeOrigin: true
        }
      }
    }
  };
  