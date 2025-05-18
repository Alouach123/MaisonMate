
export default function Footer() {
  const currentYear = 2025;
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} MaisonMate. All rights reserved.</p>
        <p>Your destination for quality home supplies.</p>
        <p className="mt-2">
          Projet éducatif réalisé par ALOUACH Abdennour et ELGARRAB Idris.
          <br />
          Encadrement pédagogique : Prof. BOUROUMANE Farida.
        </p>
      </div>
    </footer>
  );
}
