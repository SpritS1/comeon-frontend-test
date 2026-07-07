import { AuthGuard } from "@/components/auth-guard";
import { GameScreen } from "@/components/game/game-screen";

export default async function GamePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return (
    <AuthGuard>
      <GameScreen code={code} />
    </AuthGuard>
  );
}
