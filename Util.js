export const Util = {
  removeInstance(arr, instance) {
    const i = arr.indexOf(instance);
    if (i !== -1) {
      arr.splice(i, 1);
    }
  },

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}