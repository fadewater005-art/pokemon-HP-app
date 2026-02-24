// ここにポケモンを追加していくだけでUIに反映されます。
// 画像・タイプアイコンは assets/ 配下に置いてください。

window.POKEMON_DATA = [
  {
    "id": "arceus",
    "name": "アルセウス",
    "types": [
      "normal"
    ],
    "image": "./assets/pokemon/arceus.png",
    "ability": {
      "kind": "dice-change",
      "from": 6,
      "to": 1,
      "text": "になる"
    }
  },
  {
    "id": "mewtwo",
    "name": "ミュウツー",
    "types": [
      "psychic"
    ],
    "image": "./assets/pokemon/mewtwo.png",
    "ability": "かいふく きんし！"
  },
  {
    "id": "mew",
    "name": "ミュウ",
    "types": [
      "psychic"
    ],
    "image": "./assets/pokemon/mew.gif",
    "ability": {
      "kind": "dice-change",
      "from": 3,
      "to": 1,
      "text": "になる"
    }
  },
  {
    "id": "giratina",
    "name": "ギラティナ（アナザーフォルム）",
    "types": [
      "ghost",
      "dragon"
    ],
    "image": "./assets/pokemon/giratina.png",
    "ability": ""
  },
  {
    "id": "palkia",
    "name": "パルキア",
    "types": [
      "water",
      "dragon"
    ],
    "image": "./assets/pokemon/palkia.png",
    "ability": ""
  },
  {
    "id": "dialga",
    "name": "ディアルガ",
    "types": [
      "steel",
      "dragon"
    ],
    "image": "./assets/pokemon/dialga.png",
    "ability": ""
  },
  {
    "id": "yveltal",
    "name": "イベルタル",
    "types": [
      "dark",
      "flying"
    ],
    "image": "./assets/pokemon/yveltal.png",
    "ability": ""
  },
  {
    "id": "lunala",
    "name": "ルナアーラ",
    "types": [
      "psychic",
      "ghost"
    ],
    "image": "./assets/pokemon/lunala.png",
    "ability": ""
  },
  {
    "id": "solgaleo",
    "name": "ソルガレオ",
    "types": [
      "psychic",
      "steel"
    ],
    "image": "./assets/pokemon/solgaleo.png",
    "ability": ""
  },
  {
    "id": "rayquaza",
    "name": "レックウザ",
    "types": [
      "dragon",
      "flying"
    ],
    "image": "./assets/pokemon/rayquaza.png",
    "ability": ""
  },
  {
    "id": "mega_rayquaza",
    "name": "メガレックウザ",
    "types": [
      "dragon",
      "flying"
    ],
    "image": "./assets/pokemon/mega_rayquaza.png",
    "ability": "じめんタイプ は 🎲1になる！"
  },
  {
    "id": "kyogre",
    "name": "カイオーガ",
    "types": [
      "water"
    ],
    "image": "./assets/pokemon/kyogre.png",
    "ability": ""
  },
  {
    "id": "groudon",
    "name": "グラードン",
    "types": [
      "ground"
    ],
    "image": "./assets/pokemon/groudon.png",
    "ability": ""
  },
  {
    "id": "zamazenta",
    "name": "ザマゼンタ",
    "types": [
      "fighting",
      "steel"
    ],
    "image": "./assets/pokemon/zamazenta.png",
    "ability": ""
  },
  {
    "id": "miraidon",
    "name": "ミライドン",
    "types": [
      "electric",
      "dragon"
    ],
    "image": "./assets/pokemon/miraidon.png",
    "ability": ""
  },
  {
    "id": "entei",
    "name": "エンテイ",
    "types": [
      "fire"
    ],
    "image": "./assets/pokemon/entei.png",
    "ability": ""
  },
  {
    "id": "lugia",
    "name": "ルギア",
    "types": [
      "psychic",
      "flying"
    ],
    "image": "./assets/pokemon/lugia.png",
    "ability": ""
  },
  {
    "id": "hooh",
    "name": "ホウオウ",
    "types": [
      "fire",
      "flying"
    ],
    "image": "./assets/pokemon/hooh.png",
    "ability": ""
  },
  {
    "id": "xerneas",
    "name": "ゼルネアス",
    "types": [
      "fairy"
    ],
    "image": "./assets/pokemon/xerneas.png",
    "ability": ""
  },
  {
    "id": "reshiram",
    "name": "レシラム",
    "types": [
      "dragon",
      "fire"
    ],
    "image": "./assets/pokemon/reshiram.png",
    "ability": ""
  },
  {
    "id": "zekrom",
    "name": "ゼクロム",
    "types": [
      "dragon",
      "electric"
    ],
    "image": "./assets/pokemon/zekrom.png",
    "ability": ""
  },
  {
    "id": "zacian",
    "name": "ザシアン",
    "types": [
      "fairy",
      "steel"
    ],
    "image": "./assets/pokemon/zacian.png",
    "ability": ""
  },
  {
    "id": "koraidon",
    "name": "コライドン",
    "types": [
      "fighting",
      "dragon"
    ],
    "image": "./assets/pokemon/koraidon.png",
    "ability": ""
  },
  {
    "id": "zeraora",
    "name": "ゼラオラ",
    "types": [
      "electric"
    ],
    "image": "./assets/pokemon/zeraora.png",
    "ability": ""
  },
  {
    "id": "zapdos",
    "name": "サンダー",
    "types": [
      "electric",
      "flying"
    ],
    "image": "./assets/pokemon/zapdos.png",
    "ability": ""
  },
  {
    "id": "articuno",
    "name": "フリーザー",
    "types": [
      "ice",
      "flying"
    ],
    "image": "./assets/pokemon/articuno.png",
    "ability": ""
  },
  {
    "id": "moltres",
    "name": "ファイヤー",
    "types": [
      "fire",
      "flying"
    ],
    "image": "./assets/pokemon/moltres.png",
    "ability": ""
  },
  {
    "id": "venusaur",
    "name": "フシギバナ",
    "types": ["grass", "poison"],
    "image": "./assets/pokemon/venusaur.png",
    "ability": "みずタイプ は 🎲1になる！"
  },
  {
    "id": "blastoise",
    "name": "カメックス",
    "types": ["water"],
    "image": "./assets/pokemon/blastoise.png",
    "ability": "ほのおタイプ は 🎲1になる！"
  },
  {
    "id": "charizard",
    "name": "リザードン",
    "types": ["fire", "flying"],
    "image": "./assets/pokemon/charizard.png",
    "ability": "くさタイプ は 🎲1になる！"
  },
  {
    "id": "pikachu",
    "name": "ピカチュウ",
    "types": ["electric"],
    "image": "./assets/pokemon/pikachu.png",
    "ability": "ひこうタイプ は 🎲1になる！"
  },
  {
    "id": "rillaboom",
    "name": "ゴリランダー",
    "types": ["grass"],
    "image": "./assets/pokemon/rillaboom.png",
    "ability": "みずタイプ は 🎲1になる！"
  },
  {
    "id": "cinderace",
    "name": "エースバーン",
    "types": ["fire"],
    "image": "./assets/pokemon/cinderace.png",
    "ability": "くさタイプ は 🎲1になる！"
  },
  {
    "id": "inteleon",
    "name": "インテレオン",
    "types": ["water"],
    "image": "./assets/pokemon/inteleon.png",
    "ability": "ほのおタイプ は 🎲1になる！"
  },
  {
    "id": "totogengar",
    "name": "ととゲンガー",
    "types": ["ghost", "poison"],
    "image": "./assets/pokemon/totogengar.png",
    "ability": "ノーマルタイプ は 🎲1になる！"
  }
];

// タイプ名 -> アイコン画像
// app.js の renderTypes で参照される
window.TYPE_ICON = {
  normal: "./assets/types/normal.svg",
  fire: "./assets/types/fire.svg",
  water: "./assets/types/water.svg",
  electric: "./assets/types/electric.svg",
  grass: "./assets/types/fairy.svg",
  ice: "./assets/types/ice.svg",
  fighting: "./assets/types/fighting.svg",
  poison: "./assets/types/ghost.svg",
  ground: "./assets/types/ground.svg",
  flying: "./assets/types/flying.svg",
  psychic: "./assets/types/psychic.svg",
  bug: "./assets/types/steel.svg",
  rock: "./assets/types/ground.svg",
  ghost: "./assets/types/ghost.svg",
  dragon: "./assets/types/dragon.svg",
  dark: "./assets/types/dark.svg",
  steel: "./assets/types/steel.svg",
  fairy: "./assets/types/fairy.svg"
};
