module.exports = {
  CryptoDigestAlgorithm: {
    SHA256: 'SHA256'
  },
  async digestStringAsync(_algo, str) {
    // simple hash mock
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return 'mock_' + Math.abs(hash).toString(16);
  }
};

