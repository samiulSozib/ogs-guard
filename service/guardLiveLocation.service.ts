// service/guardLiveLocation.service.ts

import { ApiResponse } from "@/app/types/api.types";
import api, { handleApiResponse } from "./api.service";
import {
  LiveLocationData,
  LiveLocationResponse,
  HeartbeatResponse,
  OfflineResponse
} from "@/app/types/guardLiveLocation";

export const guardLiveLocationService = {
  // Send live location update
  updateLocation: (data: LiveLocationData) =>
    handleApiResponse(
      api.post<LiveLocationResponse>("/guardemployee/live-location/location", data)
    ),

  // Send heartbeat
  sendHeartbeat: () =>
    handleApiResponse(
      api.post<HeartbeatResponse>("/guardemployee/live-location/heartbeat")
    ),

  // Mark as offline
  markOffline: () =>
    handleApiResponse(
      api.post<OfflineResponse>("/guardemployee/live-location/offline")
    ),
};