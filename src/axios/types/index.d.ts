import { AxiosInstance } from 'axios'
import jsonp from 'jsonp'
export interface instance extends AxiosInstance {
  jsonp: jsonp
}

export default class axios {

  setInterceptors: function (any, function | object | array)

  setRequestInterceptors: function (function | object | array)

  setResponseInterceptors: function (function | object | array)

  instance: instance

  static requestInterceptors: {
    stringifyParams: function(any)
  }

  static responseInterceptors: {
    getData: function
  }

  static install: function
}