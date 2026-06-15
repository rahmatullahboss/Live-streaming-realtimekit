import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("camera", "routes/camera.tsx"),
  route("director/:eventId", "routes/director.$eventId.tsx"),
  route("compositor/:eventId", "routes/compositor.$eventId.tsx"),
  route("score/:eventId", "routes/score.$eventId.tsx"),
] satisfies RouteConfig;
