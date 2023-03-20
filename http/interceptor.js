export default function(axios) {
  axios.interceptors.request.use(req => {
    return req;
  }, err => {
    return Promise.reject(err);
  });

  axios.interceptors.response.use(res => {
    return res;
  }, err => {
    return Promise.reject(err);
  });
}
