export const WISH_ICONS = [
  { value: "headphones", symbol: "🎧", label: "Наушники" },
  { value: "coffee", symbol: "☕", label: "Кофе" },
  { value: "lamp", symbol: "💡", label: "Лампа" },
  { value: "books", symbol: "📚", label: "Книги" },
  { value: "travel", symbol: "🧳", label: "Путешествия" },
  { value: "stars", symbol: "🌌", label: "Звёзды" },
  { value: "yarn", symbol: "🧶", label: "Рукоделие" },
  { value: "music", symbol: "💿", label: "Музыка" },
  { value: "gift", symbol: "🎁", label: "Подарок" },
  { value: "game", symbol: "🎮", label: "Игры" },
  { value: "phone", symbol: "📱", label: "Смартфон" },
  { value: "computer", symbol: "💻", label: "Компьютер" },
  { value: "camera", symbol: "📷", label: "Фото" },
  { value: "watch", symbol: "⌚", label: "Часы" },
  { value: "clothes", symbol: "👕", label: "Одежда" },
  { value: "shoes", symbol: "👟", label: "Обувь" },
  { value: "bag", symbol: "👜", label: "Сумка" },
  { value: "jewelry", symbol: "💍", label: "Украшения" },
  { value: "cosmetics", symbol: "💄", label: "Косметика" },
  { value: "perfume", symbol: "🧴", label: "Парфюмерия" },
  { value: "home", symbol: "🏠", label: "Для дома" },
  { value: "plant", symbol: "🪴", label: "Растения" },
  { value: "food", symbol: "🍕", label: "Еда" },
  { value: "cake", symbol: "🎂", label: "Сладости" },
  { value: "sport", symbol: "⚽", label: "Спорт" },
  { value: "bicycle", symbol: "🚲", label: "Велосипед" },
  { value: "car", symbol: "🚗", label: "Автомобиль" },
  { value: "ticket", symbol: "🎟️", label: "Билет" },
  { value: "money", symbol: "💵", label: "Деньги" },
  { value: "other", symbol: "✨", label: "Другое" },
] as const;

export type WishIcon = (typeof WISH_ICONS)[number];
export type WishIconValue = WishIcon["value"];
export type WishIconSymbol = WishIcon["symbol"];

export const DEFAULT_WISH_ICON: WishIconValue = "gift";

export function getWishIcon(value: WishIconValue): WishIcon {
  return (
    WISH_ICONS.find((icon) => icon.value === value) ??
    WISH_ICONS.find((icon) => icon.value === DEFAULT_WISH_ICON)!
  );
}
