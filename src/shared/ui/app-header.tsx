"use client";

import { CrownNavigation } from "./crown-navigation";
import { CrownTopHeader } from "./crown-top-header";
import { CrownScrollIndicator } from "./crown-scroll-indicator";

interface AppHeaderProps {
  homeLink?: boolean;
  showScrollIndicator?: boolean;
}

export function AppHeader({ homeLink = true, showScrollIndicator = true }: AppHeaderProps) {
  return (
    <>
      <CrownNavigation homeLink={homeLink} />
      <CrownTopHeader />
      {showScrollIndicator && <CrownScrollIndicator />}
    </>
  );
}
