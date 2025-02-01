import axios from "axios";

const baseURL = 'http://localhost:5297/';

const onRequestSuccess = (config) => {
    //config.headers['Authorization'] = `Bearer ${helpers.cookie_get('AT')}`;
    //config.headers['Authorization'] = `Bearer ${token}`;
    // lay token tu cookies
    config.headers['Content-Type'] = 'application/json';
  return config;
};

const onRequestError = (error) => {
    return Promise.reject(error);
}

const onResponseSuccess = (response) => {
    return response.data;
}

const onResponseError = (error) => {
    if (error.response) {
        if (error.response.status === 401) {
          window.location.href = '/authen/login';
        }
        return Promise.reject(error.response.data);
      }
      return Promise.reject(error);
}

axios.interceptors.request.use(onRequestSuccess, onRequestError);
axios.interceptors.response.use(onResponseSuccess, onResponseError);
axios.defaults.baseURL = baseURL;

var BaseRequest = {
    Get: async (url) => {
        try{
            const response = await axios.get(url);
            return response.data;
            

        } catch (err) {
            console.log('err', err);

        }
    },
    Post: async (url, data) => {
        try{ 
            const response = await axios.post(url, data);
            return response.data;
        } catch (err) {
            console.log('err', err);

        }
    },

    Put: async (url, data) => {
        try{
            const response = await axios.put(url, data);
            return response.data;
        } catch (err) {
            console.log('err', err)
        }
    },

    Delete: async (url) => {
        try{
            const response = await axios.delete(url);
            return response.data;
        } catch (err) {
            console.log('err', err)
        }
    },
}

export default BaseRequest;