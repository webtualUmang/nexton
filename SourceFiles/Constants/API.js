import { create } from 'apisauce'
import qs from 'qs';
import R from 'ramda';
import Toast from 'react-native-simple-toast';
import { ApiURL } from './ApiURL';

import ValidationMsg from './ValidationConstant';
 
const api = create({
  baseURL: ApiURL.BaseURL,
  headers: {
      Accept: 'application/json',
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
      
  },
  timeout: 30000
});

const monitor = (response) => {
  const { config: { method, url }, data, status } = response;
  console.group(`Requesting [${method.toUpperCase()}] ${url}:`);
  console.log('Response Status:', status);
  console.log('Response Data:', data);
  console.groupEnd();
};
api.addMonitor(monitor);

api.addRequestTransform((request) => {
  if (R.contains(request.method, ['delete', 'post', 'put'])) {
      if (!(request.data instanceof FormData)) {
          request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          request.data = qs.stringify(request.data);
      }
  }
});

api.addResponseTransform((response) => {
  if(response.problem=='NETWORK_ERROR'){
    Toast.showWithGravity(ValidationMsg.InternetConnection, Toast.SHORT, Toast.CENTER);
  }else if(response.problem=='TIMEOUT_ERROR'){
    Toast.showWithGravity(ValidationMsg.Server_Not_Responding, Toast.SHORT, Toast.CENTER);
  }
  //console.log('Response Data:', JSON.stringify(response.data));
  /* if (response.data.erro !== undefined) {
      response.ok = false;
      let message = (typeof response.data.erro === 'object')
          ? response.data.erro.mensagem
          : response.data.erro;

      if (!message) {
          message = 'Erro desconhecido';
      }

      response.data = { message };
  } else {
      const data = response.data.item || response.data.itens || null;
      if (response.data['access-token'] !== undefined) {
          data.tokenapi = response.data['access-token'];
      }
      if (response.data.total_itens !== undefined) {
          response.count = +response.data.total_itens;
      }
      response.data = data;
  } */
});

export default api;