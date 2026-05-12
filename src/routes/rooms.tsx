import { createFileRoute } from "@tanstack/react-router";
import { RoomsList } from "@/components/ens/RoomsList";

export const Route = createFileRoute("/rooms")({
  component: RoomsList,
});