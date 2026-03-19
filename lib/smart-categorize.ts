"use strict";

/**
 * Smart Auto-Categorization Engine
 * 
 * Instantly suggests a transaction category based on the description text.
 * Uses keyword & substring matching — no API call required, zero latency.
 */

type CategoryKeywords = {
  category: string;
  keywords: string[];
};

const CATEGORY_RULES: CategoryKeywords[] = [
  {
    category: "Food & Drinks",
    keywords: [
      // International chains
      "starbucks", "mcdonald", "mcdonalds", "mcd", "kfc", "pizza hut", "burger king",
      "dominos", "subway", "dunkin", "jco", "chatime", "gongcha", "xiboba",
      // Indonesian chains & common words
      "hokben", "yoshinoya", "solaria", "es teler", "warmindo", "warteg",
      "bakso", "mie ayam", "nasi goreng", "nasi padang", "sate", "soto",
      "richeese", "mixue", "janji jiwa", "kopi kenangan", "fore coffee",
      // Generic food words
      "makan", "makanan", "food", "eat", "breakfast", "lunch", "dinner",
      "snack", "coffee", "kopi", "cafe", "restaurant", "restoran",
      "bakery", "roti", "drink", "minuman", "jajan", "kantin",
      "gofood", "grabfood", "shopeefood",
      // Grocery
      "indomaret", "alfamart", "alfamidi", "superindo", "giant",
      "hypermart", "supermarket", "grocery", "belanja dapur",
    ],
  },
  {
    category: "Transport",
    keywords: [
      "gojek", "goride", "gocar", "grab", "grabcar", "grabike",
      "uber", "taxi", "taksi", "ojek", "ojol", "angkot",
      "bus", "kereta", "train", "krl", "mrt", "lrt", "transjakarta",
      "bensin", "pertamina", "shell", "bbm", "fuel", "gas", "spbu",
      "parkir", "parking", "tol", "toll", "e-toll", "etoll",
      "transport", "transportasi", "maxim",
    ],
  },
  {
    category: "Shopping",
    keywords: [
      "tokopedia", "shopee", "lazada", "bukalapak", "blibli", "zalora",
      "uniqlo", "h&m", "zara", "miniso", "daiso",
      "belanja", "shopping", "beli", "buy", "purchase",
      "baju", "celana", "sepatu", "tas", "fashion", "clothing", "clothes",
      "mall", "store", "toko",
    ],
  },
  {
    category: "Entertainment",
    keywords: [
      "netflix", "spotify", "disney", "youtube", "hbo", "prime video",
      "apple music", "joox", "vidio",
      "bioskop", "cinema", "xxi", "cgv", "movie", "film",
      "game", "gaming", "steam", "playstation", "ps5", "xbox", "nintendo",
      "konser", "concert", "tiket", "ticket", "event", "hiburan",
      "karaoke", "bowling",
    ],
  },
  {
    category: "Education",
    keywords: [
      "sekolah", "school", "kuliah", "university", "kampus",
      "buku", "book", "kursus", "course", "udemy", "coursera",
      "les", "tutor", "bimbel", "ruangguru", "zenius",
      "belajar", "study", "education", "pendidikan",
      "spp", "uang sekolah", "uang kuliah",
      "alat tulis", "stationery", "fotokopi", "print",
    ],
  },
  {
    category: "Health",
    keywords: [
      "apotek", "pharmacy", "obat", "medicine", "vitamin",
      "dokter", "doctor", "rumah sakit", "hospital", "klinik", "clinic",
      "kesehatan", "health", "medical",
      "gym", "fitness", "olahraga", "sport",
      "halodoc", "alodokter",
    ],
  },
  {
    category: "Home & Bills",
    keywords: [
      "listrik", "electricity", "pln", "air", "pdam", "water",
      "sewa", "rent", "kos", "kost", "kontrakan",
      "internet", "wifi", "indihome", "biznet", "firstmedia",
      "tagihan", "bill", "iuran",
      "furniture", "ikea", "informa", "ace hardware",
      "laundry", "cleaning", "bersih",
    ],
  },
  {
    category: "Gadgets",
    keywords: [
      "handphone", "hp", "iphone", "samsung", "xiaomi", "oppo", "vivo",
      "laptop", "macbook", "thinkpad", "lenovo", "asus",
      "tablet", "ipad", "smartwatch", "earphone", "headset", "airpods",
      "charger", "aksesoris", "accessories", "electronic", "elektronik",
      "erafone", "ibox",
    ],
  },
  {
    category: "Travel",
    keywords: [
      "hotel", "hostel", "airbnb", "penginapan",
      "tiket pesawat", "flight", "airlines", "garuda", "lion air",
      "citilink", "airasia", "batik air", "sriwijaya",
      "traveloka", "tiket.com", "booking", "agoda",
      "liburan", "vacation", "travel", "wisata", "tour",
    ],
  },
  {
    category: "Utilities",
    keywords: [
      "pulsa", "paket data", "kuota", "topup", "top up", "top-up",
      "telkomsel", "indosat", "xl", "smartfren", "tri",
      "gopay", "ovo", "dana", "shopeepay", "linkaja",
      "transfer", "admin", "biaya admin",
    ],
  },
];

/**
 * Suggests a category based on the transaction description.
 * Returns the category string if a match is found, or null if no confident match.
 */
export function suggestCategory(description: string): string | null {
  if (!description || description.trim().length < 2) return null;

  const text = description.toLowerCase().trim();

  // Phase 1: Exact keyword/substring match
  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (text.includes(keyword)) {
        return rule.category;
      }
    }
  }

  // Phase 2: Word-level matching (check individual words)
  const words = text.split(/\s+/);
  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      for (const word of words) {
        // Match if a word starts with the keyword or vice versa (for variants)
        if (word.length >= 3 && (keyword.startsWith(word) || word.startsWith(keyword))) {
          return rule.category;
        }
      }
    }
  }

  return null;
}
