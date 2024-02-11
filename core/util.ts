function union(joints: Array<[String, any]>): Record<any, any> {
  return joints.reduce((a, c) => {
    const key = c[0];
    const value = c[1];
    if (a.hasOwnProperty(key.toString())) {
      a[key.toString()].push(value);
    } else {
      a[key.toString()] = [value];
    }
    return a;
  }, {});
}

export { union };
