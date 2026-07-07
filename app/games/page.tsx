import { AuthGuard } from "@/components/auth-guard";
import { Lobby } from "@/components/lobby/lobby";

export default function GamesPage() {
  return (
    <AuthGuard>
      <Lobby />
    </AuthGuard>
  );
}
