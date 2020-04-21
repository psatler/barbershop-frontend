function isEmpty(obj: object): boolean {
  return !obj || Object.keys(obj).length === 0;
}

export { isEmpty };
