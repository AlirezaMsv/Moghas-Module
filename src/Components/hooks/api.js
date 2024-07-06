import { camelizeKeys } from "humps";
import axios from "axios";
// import buildProgress from "Utils/progress";

export const cancelToken = () => axios.CancelToken.source();

// Function to delete a cookie by its name
export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}


export function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getOptions(request, downloadProgress, uploadProgress) {
  let optionModel = {
    headers: {},
    cancelToken: cancelToken.token,
    withCredentials: true,
  };
  //   if (uploadProgress) {
  //     optionModel.onUploadProgress = function (progressEvent) {
  //       let totalSize = progressEvent.total;
  //       buildProgress("آپلود", progressEvent.loaded, totalSize);
  //     };
  //   }
  //   if (downloadProgress) {
  //     optionModel.onDownloadProgress = function (progressEvent) {
  //       let totalSize = progressEvent.total;
  //       buildProgress(request.documentName, progressEvent.loaded, totalSize);
  //     };
  //   }
  return optionModel;
}

export function getServerUrl() {
  return window.publicUrl || process.env.apiAddress || localStorage.getItem("publicUrl");
}

const normalizeResponse = (response) => {
  if (response.status !== 200) {
    return Promise.reject(response);
  }
  const camelizedJson = camelizeKeys(response.data);
  return Object.assign(camelizedJson);
};

const removeAllCookie = () => {
  var cookies = document.cookie.split(";");
  cookies.map((cookie) => {
    let days = -1;
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      var expires = "; expires=" + date.toUTCString();
    } else var expires = "";
    document.cookie = cookie + "=" + "" + expires + "; path=/";
  });
};

const handleError = (error) => {
  if (error.request.status === 401) {
    removeAllCookie();
    window.location.href = `${
      window.publicUrl || process.env.apiAddress
    }/Signin?ReturnUrl=${window.location.href}`;
  }
  return Promise.reject(error);
};

// This makes every API response have the same shape, regardless of how nested it was.
export const postApi = async (endpoint, body, params, options) => {
  let fullUrl =
    endpoint.indexOf(`${getServerUrl()}/`) === -1
      ? `${getServerUrl()}/${endpoint}`
      : endpoint;

  if (params) {
    fullUrl = fullUrl + "?";
    Object.keys(params).forEach((element) => {
      if (params[element] === undefined || params[element] === null)
        throw new Error(
          `The parameter '${element}' must be defined and cannot be null.`
        );
      else
        fullUrl +=
          element + "=" + encodeURIComponent("" + params[element]) + "&";
    });
    fullUrl = fullUrl.replace(/[?&]$/, "");
  }

  try {
    const response = await axios.post(fullUrl, body, {
      ...options,
      ...getOptions(body),
      withCredentials: true, // Ensure credentials are included
    });
    return normalizeResponse(response);
  } catch (error) {
    return await handleError(error);
  }
};

// This makes every API response have the same shape, regardless of how nested it was.
export const putApi = async (endpoint, body, params, options) => {
  let fullUrl =
    endpoint.indexOf(`${getServerUrl()}/`) === -1
      ? `${getServerUrl()}/${endpoint}`
      : endpoint;

  if (params) {
    fullUrl = fullUrl + "?";
    Object.keys(params).forEach((element) => {
      if (params[element] === undefined || params[element] === null)
        throw new Error(
          `The parameter '${element}' must be defined and cannot be null.`
        );
      else
        fullUrl +=
          element + "=" + encodeURIComponent("" + params[element]) + "&";
    });
    fullUrl = fullUrl.replace(/[?&]$/, "");
  }

  try {
    const response = await axios.put(fullUrl, body, {
      ...options,
      ...getOptions(body),
      withCredentials: true, // Ensure credentials are included
    });
    return normalizeResponse(response);
  } catch (error) {
    return await handleError(error);
  }
};

export const deleteApi = async (endpoint, params, options) => {
  let fullUrl =
    endpoint.indexOf(`${getServerUrl()}/`) === -1
      ? `${getServerUrl()}/${endpoint}`
      : endpoint;

  if (params) {
    fullUrl = fullUrl + "?";
    Object.keys(params).forEach((element) => {
      if (params[element] === undefined || params[element] === null)
        throw new Error(
          `The parameter '${element}' must be defined and cannot be null.`
        );
      else
        fullUrl +=
          element + "=" + encodeURIComponent("" + params[element]) + "&";
    });
    fullUrl = fullUrl.replace(/[?&]$/, "");
  }

  try {
    const response = await axios.delete(fullUrl, {
      ...options,
      ...getOptions(params),
    });
    return normalizeResponse(response);
  } catch (error) {
    return await handleError(error);
  }
};

export const getApi = async (endpoint, params, options) => {
  let fullUrl =
    endpoint.indexOf(`${getServerUrl()}/`) === -1
      ? `${getServerUrl()}/${endpoint}`
      : endpoint;

  if (params) {
    fullUrl = fullUrl + "?";
    Object.keys(params).forEach((element) => {
      if (params[element] === undefined || params[element] === null)
        throw new Error(
          `The parameter '${element}' must be defined and cannot be null.`
        );
      else
        fullUrl +=
          element + "=" + encodeURIComponent("" + params[element]) + "&";
    });
    fullUrl = fullUrl.replace(/[?&]$/, "");
  }

  try {
    const response = await axios.get(fullUrl, {
      ...options,
      ...getOptions(params),
    });
    return normalizeResponse(response);
  } catch (error) {
    return await handleError(error);
  }
};

export const getBlob = async (endpoint, params, config) => {
  let fullUrl =
    endpoint.indexOf(`${getServerUrl()}/`) === -1
      ? `${getServerUrl()}/${endpoint}`
      : endpoint;
  if (params) {
    fullUrl = fullUrl + "?";
    Object.keys(params).forEach((element) => {
      if (params[element] === undefined || params[element] === null)
        params[element] = "";
      else
        fullUrl +=
          element + "=" + encodeURIComponent("" + params[element]) + "&";
    });
    fullUrl = fullUrl.replace(/[?&]$/, "");
  }

  const res = await axios.get(fullUrl, {
    ...getOptions(params),
    ...config,
    responseType: "blob",
  });
  return res;
};

export const postBlob = async (endpoint, body, params, config) => {
  let fullUrl =
    endpoint.indexOf(`${getServerUrl()}/`) === -1
      ? `${getServerUrl()}/${endpoint}`
      : endpoint;

  if (params) {
    fullUrl = fullUrl + "?";
    Object.keys(params).forEach((element) => {
      if (params[element] === undefined || params[element] === null)
        throw new Error(
          `The parameter '${element}' must be defined and cannot be null.`
        );
      else
        fullUrl +=
          element + "=" + encodeURIComponent("" + params[element]) + "&";
    });
    fullUrl = fullUrl.replace(/[?&]$/, "");
  }
  const res = await axios.post(fullUrl, body, {
    ...getOptions(body, true, true),
    ...config,
    responseType: "blob",
  });
  return res;
};
