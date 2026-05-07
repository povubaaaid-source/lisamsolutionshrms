import api from "./api";
import { apiRoutes, buildQueryString, type ApiEnvelope, type ApiListQuery, type ApiResource } from "./api-contract";

export const apiClient = {
  list: async <T>(resource: ApiResource, query?: ApiListQuery) => {
    const response = await api.get<ApiEnvelope<T[]>>(`${apiRoutes.resource(resource)}${buildQueryString(query)}`);
    return response.data;
  },

  detail: async <T>(resource: ApiResource, id: number | string, query?: ApiListQuery) => {
    const response = await api.get<ApiEnvelope<T>>(`${apiRoutes.detail(resource, id)}${buildQueryString(query)}`);
    return response.data;
  },

  create: async <T, P = unknown>(resource: ApiResource, payload: P) => {
    const response = await api.post<ApiEnvelope<T>>(apiRoutes.resource(resource), payload);
    return response.data;
  },

  update: async <T, P = unknown>(resource: ApiResource, id: number | string, payload: P) => {
    const response = await api.put<ApiEnvelope<T>>(apiRoutes.detail(resource, id), payload);
    return response.data;
  },

  patch: async <T, P = unknown>(resource: ApiResource, id: number | string, payload: P) => {
    const response = await api.patch<ApiEnvelope<T>>(apiRoutes.detail(resource, id), payload);
    return response.data;
  },

  remove: async <T>(resource: ApiResource, id: number | string) => {
    const response = await api.delete<ApiEnvelope<T>>(apiRoutes.detail(resource, id));
    return response.data;
  },

  action: async <T, P = unknown>(resource: ApiResource, id: number | string, action: string, payload?: P) => {
    const response = await api.post<ApiEnvelope<T>>(apiRoutes.action(resource, id, action), payload ?? {});
    return response.data;
  },

  upload: async <T>(resource: ApiResource, id: number | string, files: File[], fieldName = "files") => {
    const formData = new FormData();
    files.forEach((file) => formData.append(fieldName, file));

    const response = await api.post<ApiEnvelope<T>>(apiRoutes.action(resource, id, "files"), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },
};

export default apiClient;
