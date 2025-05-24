const fetchChartData = async ([location_id, account_id, perion]: [
  number,
  number,
  string,
]) => {
  if (!location_id) return null;
  if (account_id) {
    return fetch(`/api/account/${account_id}`).then((res) => res.json());
  }
  return fetch(`/api/location/${location}`).then((res) => res.json());
};
