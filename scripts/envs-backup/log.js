module.exports.Log = (m) => {
  return {
    err: (...args) => console.log(`[x][${m}]:`, ...args),
    warn: (...args) => console.log(`[!][${m}]:`, ...args),
    info: (...args) => console.log(`[+][${m}]:`, ...args),
    debug: (...args) => console.log(`[-][${m}]:`, ...args),
    trace: (...args) => console.log(`[*][${m}]:`, ...args),
  };
};
