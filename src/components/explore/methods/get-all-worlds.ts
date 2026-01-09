interface World {
  id: string;
  slug: string;
  title: string;
  description: string;
  pinCount: number;
  loreCount: number;
  author: { name: string };
  isPublic: boolean;
}

export function getAllWorlds(): World[] {
  return [
    {
      id: "1",
      slug: "eldoria-chronicles",
      title: "Eldoria Chronicles",
      description: "A vast high fantasy realm with ancient dragons, magical kingdoms, and epic wars that shaped the continent.",
      pinCount: 247,
      loreCount: 58,
      author: { name: "MythWeaver" },
      isPublic: true,
    },
    {
      id: "2",
      slug: "shadow-veil",
      title: "Shadow Veil",
      description: "Dark fantasy world torn between light and darkness, where demons walk among mortals.",
      pinCount: 189,
      loreCount: 42,
      author: { name: "DarkLord99" },
      isPublic: true,
    },
    {
      id: "3",
      slug: "azure-coast",
      title: "The Azure Coast",
      description: "Tropical archipelago of trading cities, pirates, and ancient sea temples.",
      pinCount: 156,
      loreCount: 35,
      author: { name: "SeaCaptain" },
      isPublic: true,
    },
    {
      id: "4",
      slug: "iron-kingdoms",
      title: "Iron Kingdoms",
      description: "Steampunk fantasy where dwarves build massive machines and humans mine rare crystals.",
      pinCount: 203,
      loreCount: 47,
      author: { name: "SteamEngineer" },
      isPublic: true,
    },
    {
      id: "5",
      slug: "whispering-woods",
      title: "Whispering Woods",
      description: "Enchanted forest home to elves, fey creatures, and ancient druidic circles.",
      pinCount: 134,
      loreCount: 39,
      author: { name: "ForestKeeper" },
      isPublic: true,
    },
    {
      id: "6",
      slug: "crimson-wastes",
      title: "Crimson Wastes",
      description: "Brutal desert wasteland where warlords battle for control of oasis fortresses.",
      pinCount: 98,
      loreCount: 28,
      author: { name: "SandWarrior" },
      isPublic: true,
    },
  ];
}
