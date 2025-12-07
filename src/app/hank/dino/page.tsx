import DinoGame from '@/components/DinoGame';

export default function HankDinoPage() {
  return (
    <DinoGame
      player="hank"
      playerEmoji="🦖"
      playerName="Hank"
      defaultDifficulty="easy"
      defaultDailyLimit={10}
      portalUrl="/hank"
    />
  );
}
