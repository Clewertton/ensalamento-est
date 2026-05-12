import { createFileRoute } from "@tanstack/react-router";
import { RoomsList } from "@/components/ens/RoomsList";

export const Route = createFileRoute("/rooms")({
  component: RoomsList,
  head: () => ({
    meta: [
      { title: "Salas — Ensalamento Acadêmico" },
      {
        name: "description",
        content: "Gerencie salas, edite informações e exclua registros.",
      },
    ],
  }),
});
