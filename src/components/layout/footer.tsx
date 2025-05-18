
export default function Footer() {
  const currentYear = 2025;
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} MaisonMate. All rights reserved.</p>
        <p>Your destination for quality home supplies.</p>
        <p className="mt-2">réalisé par ALOUACH Abdennour & ELGARRAB Idris, Professeur BOUROUMANE Farida</p>
      </div>
    </footer>
  );
}
