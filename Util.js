export const Util = {
  removeInstance(arr, instance) {
    const i = arr.indexOf(instance);
    if (i !== -1) {
      arr.splice(i, 1);
    }
  }
}