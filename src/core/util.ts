function union<T extends any>(joints: Array<[any, any]>): Record<any, T> {
  return joints.reduce((a: any, c) => {
    const key = c[0];
    const value = c[1];
    if (!key) return a;
    if (a.hasOwnProperty(key.toString())) {
      a[key].push(value);
    } else {
      a[key] = [value];
    }
    return a;
  }, {});
}

export { union };
