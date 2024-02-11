function union(joints: Array<[string | symbol | null, any]>): Record<any, any> {
  return joints.reduce((a, c) => {
    const key = c[0];
    const value = c[1];
    if (a.hasOwnProperty(key.toString())) {
      a[key].push(value);
    } else {
      a[key] = [value];
    }
    return a;
  }, {});
}

export { union };
