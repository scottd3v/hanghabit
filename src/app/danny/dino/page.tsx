import DinoGame from '@/components/DinoGame';

export default function DannyDinoPage() {
  return (
    <DinoGame
      player="danny"
      playerEmoji="🦕"
      playerName="Danny"
      defaultDifficulty="medium"
      defaultDailyLimit={10}
      portalUrl="/danny"
    />
  );
}
