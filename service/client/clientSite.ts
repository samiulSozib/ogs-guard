// service/client/sites.service.ts
import { ApiResponse } from "@/app/types/api.types";
import {
  Site,
  SitesPaginatedResponse,
  LocationsResponse,
  CreateSiteData,
  UpdateSiteData,
  CreateLocationData,
  UpdateLocationData,
  SiteLocation,
} from "@/app/types/client/clientSite";
import api, { handleApiResponse } from "../api.service";

export const clientSitesService = {
  /* ---------- Get All Sites ---------- */
  getSites: (page: number = 1, perPage: number = 20) =>
    handleApiResponse(
      api.get<ApiResponse<SitesPaginatedResponse>>(
        `/client/sites?page=${page}&per_page=${perPage}`
      )
    ),

  /* ---------- Get Single Site ---------- */
  getSite: (siteId: number) =>
    handleApiResponse(
      api.get<ApiResponse<Site>>(`/client/sites/${siteId}`)
    ),

  /* ---------- Create Site ---------- */
  createSite: (data: CreateSiteData) =>
    handleApiResponse(
      api.post<ApiResponse<Site>>("/client/sites", data)
    ),

  /* ---------- Update Site ---------- */
  updateSite: (siteId: number, data: UpdateSiteData) =>
    handleApiResponse(
      api.put<ApiResponse<Site>>(`/client/sites/${siteId}`, data)
    ),

  /* ---------- Delete Site ---------- */
  deleteSite: (siteId: number) =>
    handleApiResponse(
      api.delete<ApiResponse<{ message: string }>>(`/client/sites/${siteId}`)
    ),

  /* ---------- Get Site Locations ---------- */
  getSiteLocations: (siteId: number) =>
    handleApiResponse(
      api.get<ApiResponse<LocationsResponse>>(`/client/sites/${siteId}/locations`)
    ),

  /* ---------- Create Location ---------- */
  createLocation: (siteId: number, data: CreateLocationData) =>
    handleApiResponse(
      api.post<ApiResponse<SiteLocation>>(`/client/sites/${siteId}/locations`, data)
    ),

  /* ---------- Update Location ---------- */
  updateLocation: (siteId: number, locationId: number, data: UpdateLocationData) =>
    handleApiResponse(
      api.put<ApiResponse<SiteLocation>>(`/client/sites/${siteId}/locations/${locationId}`, data)
    ),

  /* ---------- Delete Location ---------- */
  deleteLocation: (siteId: number, locationId: number) =>
    handleApiResponse(
      api.delete<ApiResponse<{ message: string }>>(`/client/sites/${siteId}/locations/${locationId}`)
    ),
};