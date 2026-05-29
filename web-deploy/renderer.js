'use strict';

// ============================================================
//  ゲームデータ定義
// ============================================================

const EXP_TABLE = (() => {
  const t = [0, 50, 120, 220, 350, 500, 700, 950, 1250, 1600];
  let cum = 1600;
  for (let lv = 10; lv <= 999; lv++) {
    cum += Math.floor(400 + (lv - 9) * 100 + Math.pow(lv - 9, 2) * 3);
    t.push(cum);
  }
  return t; // length=1000, index=level, max level=999
})();

const ITEM_DATA = {
  // 消耗品
  herb:         { name: '薬草',         emoji: '🌿', desc: 'HPを30回復する',         type: 'consumable', effect: 'hp',   value: 30,  price: 20  },
  highHerb:     { name: '上薬草',       emoji: '🍃', desc: 'HPを80回復する',         type: 'consumable', effect: 'hp',   value: 80,  price: 50  },
  mpPotion:     { name: 'MPの薬',       emoji: '💧', desc: 'MPを25回復する',         type: 'consumable', effect: 'mp',   value: 25,  price: 35  },
  highMpPotion: { name: '上MPの薬',     emoji: '💦', desc: 'MPを60回復する',         type: 'consumable', effect: 'mp',   value: 60,  price: 80  },
  elixir:       { name: 'エリクサー',   emoji: '⭐', desc: 'HPとMPを完全回復',       type: 'consumable', effect: 'full',        value: 0,   price: 200 },
  antidote:     { name: '解毒薬',       emoji: '🧪', desc: '状態異常を全て回復する',   type: 'consumable', effect: 'cure_status',     value: 0,   price: 30   },
  phoenixFeather: { name: 'フェニックスの羽', emoji: '🪶', desc: '戦闘不能の仲間をHP50%で復活（戦闘中）', type: 'consumable', effect: 'revive_companion', value: 0, price: 3000 },

  // 武器装備品
  oldStaff:     { name: '古い魔法の杖',  emoji: '🪄', desc: '魔法力+10 [装備品]',    type: 'equipment', slot: 'weapon', atk: 0,  matk: 10, price: 0  },
  heroSword:    { name: '勇者の剣',      emoji: '⚔️', desc: '攻撃力+15 [装備品]',    type: 'equipment', slot: 'weapon', atk: 15, matk: 0,  price: 0  },
  iceBlade:     { name: '氷結の刃',      emoji: '🗡️', desc: '攻撃力+22 [装備品]',    type: 'equipment', slot: 'weapon', atk: 22, matk: 5,  price: 0  },
  thunderStaff: { name: '雷鳴の杖',      emoji: '⚡', desc: '魔法力+28 [装備品]',    type: 'equipment', slot: 'weapon', atk: 0,  matk: 28, price: 0  },
  ancientBlade: { name: '古代の聖剣',    emoji: '🌟', desc: '攻撃+28・魔法+8 [装備品]', type: 'equipment', slot: 'weapon', atk: 28, matk: 8, price: 0 },

  // 頭防具
  leatherHelm:   { name: '革の帽子',      emoji: '🪖', desc: '防御+5 [頭防具]',                type: 'equipment', slot: 'head', def: 5,                    price: 80   },
  ironHelmet:    { name: '鉄の兜',        emoji: '⛑️', desc: '防御+15 [頭防具]',               type: 'equipment', slot: 'head', def: 15,                   price: 300  },
  magicHat:      { name: '魔法使いの帽子', emoji: '🎩', desc: '魔法力+20 [頭防具]',            type: 'equipment', slot: 'head', matk: 20,                  price: 350  },
  heroCirclet:   { name: '勇者の冠',      emoji: '👑', desc: '全ステータス+10 [頭防具]',       type: 'equipment', slot: 'head', atk: 10, def: 10, matk: 10, hp: 10, mp: 10, price: 2000 },

  // 体防具
  leatherArmor:  { name: '革の鎧',        emoji: '🧥', desc: '防御+10・HP+20 [体防具]',        type: 'equipment', slot: 'body', def: 10, hp: 20,            price: 120  },
  chainmail:     { name: '鎖帷子',        emoji: '🔗', desc: '防御+25 [体防具]',                type: 'equipment', slot: 'body', def: 25,                   price: 450  },
  mageRobe:      { name: '魔道士のローブ', emoji: '🧣', desc: '魔法力+30・MP+20 [体防具]',     type: 'equipment', slot: 'body', matk: 30, mp: 20,            price: 500  },
  heroArmor:     { name: '勇者の鎧',      emoji: '🛡️', desc: '防御+50・HP+100 [体防具]',       type: 'equipment', slot: 'body', def: 50, hp: 100,           price: 5000 },
  spiritArmor:   { name: '精霊の鎧',      emoji: '🔰', desc: '防御力+12 [体防具]',             type: 'equipment', slot: 'body', def: 12,                   price: 0    },
  seaArmor:      { name: '深海の鎧',      emoji: '🌊', desc: '防御力+15 [体防具]',             type: 'equipment', slot: 'body', def: 15,                   price: 0    },

  // アクセサリー（2枠共通スロット）
  powerRing:     { name: '力の指輪',      emoji: '💍', desc: '攻撃力+10 [アクセサリー]',       type: 'equipment', slot: 'accessory', atk: 10,              price: 200  },
  magicNecklace: { name: '魔力の首飾り',  emoji: '📿', desc: '魔法力+15 [アクセサリー]',       type: 'equipment', slot: 'accessory', matk: 15,             price: 250  },
  expCharm:      { name: '経験値のお守り', emoji: '🍀', desc: '獲得EXP 1.5倍 [アクセサリー]',  type: 'equipment', slot: 'accessory', expBonus: 1.5,        price: 500  },
  healRing:      { name: '回復の指輪',    emoji: '💚', desc: '戦闘後HP自動回復 [アクセサリー]', type: 'equipment', slot: 'accessory', healAfterBattle: 0.15, price: 400 },
  speedBoots:    { name: '速さの靴',      emoji: '👟', desc: '速さ+20・逃走率UP [アクセサリー]', type: 'equipment', slot: 'accessory', speed: 20,           price: 300  },
  guardRing:     { name: '守りの指輪',    emoji: '🔵', desc: '防御+20 [アクセサリー]',            type: 'equipment', slot: 'accessory', def: 20,             price: 350  },
  ironCharm:     { name: '鉄壁のお守り',  emoji: '🪬', desc: 'ダメージ10%軽減 [アクセサリー]',    type: 'equipment', slot: 'accessory', dmgReduce: 0.10,     price: 600  },
  heroShield:    { name: '勇者の盾',      emoji: '🛡️', desc: '防御+40・HP+50 [アクセサリー]',     type: 'equipment', slot: 'accessory', def: 40, hp: 50,     price: 3000 },

  // 属性アクセサリー
  fireRing:     { name: '炎の指輪',     emoji: '🔥', desc: '🔥火属性ダメージ+30% [アクセサリー]',              type: 'equipment', slot: 'accessory', elemBonus: { fire: 0.3 },              price: 800  },
  iceNecklace:  { name: '氷の首飾り',   emoji: '❄️', desc: '❄️氷属性ダメージ+30% [アクセサリー]',              type: 'equipment', slot: 'accessory', elemBonus: { ice: 0.3 },               price: 800  },
  thunderCharm: { name: '雷のお守り',   emoji: '⚡', desc: '⚡雷属性ダメージ+30% [アクセサリー]',              type: 'equipment', slot: 'accessory', elemBonus: { thunder: 0.3 },            price: 800  },
  lightSeal:    { name: '光の聖印',     emoji: '☀️', desc: '☀️光属性ダメージ+30%・闇属性耐性 [アクセサリー]', type: 'equipment', slot: 'accessory', elemBonus: { light: 0.3 }, elemResist: { dark: 0.5 },  price: 1200 },
  darkEmblem:   { name: '闇の紋章',     emoji: '🌑', desc: '🌑闇属性ダメージ+30%・光属性耐性 [アクセサリー]', type: 'equipment', slot: 'accessory', elemBonus: { dark: 0.3 },  elemResist: { light: 0.5 }, price: 1200 },
  elemShield:   { name: '属性防御の盾', emoji: '🛡️', desc: '全属性被ダメージ-20% [アクセサリー]',             type: 'equipment', slot: 'accessory', allElemResist: 0.2,                    price: 2000 },

  // アリア専用装備
  ariaSword:  { name: 'アリアの銀剣',   emoji: '🗡️', desc: '攻撃力+18 [アリア専用]',         type: 'equipment', slot: 'weapon', atk: 18,           price: 0, forAria: true },
  ariaBlade:  { name: 'アリアの聖剣',   emoji: '⚡',  desc: '攻撃力+30・魔法+5 [アリア専用]', type: 'equipment', slot: 'weapon', atk: 30, matk: 5,   price: 0, forAria: true },
  ariaArmor:  { name: 'アリアの白鎧',   emoji: '🔰', desc: '防御力+8 [アリア専用・体防具]',   type: 'equipment', slot: 'body',   def: 8,            price: 0, forAria: true },
  ariaHelm:   { name: 'アリアの銀冠',   emoji: '👸', desc: '防御+8 [アリア専用・頭防具]',     type: 'equipment', slot: 'head',   def: 8,            price: 0, forAria: true },
  ariaRobe:   { name: 'アリアの羽衣',   emoji: '🪭', desc: '魔法力+15・MP+10 [アリア専用・体防具]', type: 'equipment', slot: 'body', matk: 15, mp: 10, price: 0, forAria: true },
  // ガイアス専用装備
  gaiusSword:    { name: '守護騎士の大剣', emoji: '⚔️', desc: '攻撃+25・防御+8 [ガイアス専用]',       type: 'equipment', slot: 'weapon', atk: 25, def: 8,             price: 0, forCompanion: 'gaius' },
  gaiusArmor:    { name: '守護騎士の重鎧', emoji: '🛡️', desc: '防御+35・HP+60 [ガイアス専用]',        type: 'equipment', slot: 'body',   def: 35, hp: 60,             price: 0, forCompanion: 'gaius' },
  // ルナ専用装備
  lunaWand:      { name: '月光の杖',       emoji: '🌙', desc: '魔法+25・MP+15 [ルナ専用]',             type: 'equipment', slot: 'weapon', matk: 25, mp: 15,            price: 0, forCompanion: 'luna'  },
  // ソラ専用装備
  solaWand:      { name: '星の杖',         emoji: '⭐', desc: '魔法+25・MP+15 [ソラ専用]',             type: 'equipment', slot: 'weapon', matk: 25, mp: 15,            price: 0, forCompanion: 'sola'  },
  // セラフィナ専用装備
  serafinaStaff: { name: '聖女のスタッフ', emoji: '✨', desc: '魔法+35・MP+20 [セラフィナ専用]',       type: 'equipment', slot: 'weapon', matk: 35, mp: 20,            price: 0, forCompanion: 'serafina' },
  serafinaDress: { name: '聖女のドレス',   emoji: '🌿', desc: '魔法+15・MP+25・HP+30 [セラフィナ専用]', type: 'equipment', slot: 'body',  matk: 15, mp: 25, hp: 30,    price: 0, forCompanion: 'serafina' },
  // ゼフィロス専用装備
  zephirosStaff: { name: '大賢者の杖',     emoji: '🔮', desc: '魔法+50・MP+30 [ゼフィロス専用]',       type: 'equipment', slot: 'weapon', matk: 50, mp: 30,            price: 0, forCompanion: 'zephiros' },
  zephirosRobe:  { name: '漆黒のローブ',   emoji: '🌑', desc: '魔法+20・MP+20 [ゼフィロス専用]',       type: 'equipment', slot: 'body',   matk: 20, mp: 20,            price: 0, forCompanion: 'zephiros' },

  // キーアイテム
  castleKey:    { name: '魔王城の鍵',    emoji: '🗝️', desc: '魔王城の門を開ける',    type: 'key',     price: 0 },
  ancientMap:   { name: '古代の地図',    emoji: '🗺️', desc: '海底神殿への道を示す',  type: 'key',     price: 0 },
  seaOrb:       { name: '海底の宝珠',    emoji: '🔮', desc: '深海の神秘的な宝珠',    type: 'key',     price: 0 },
  gemstone:     { name: '魔法の宝石',    emoji: '💎', desc: '魔王に80ダメージ（1回のみ）', type: 'special', price: 0 },

  // 錬金術専用アイテム
  heroCharm:    { name: '勇者のお守り', emoji: '🏅', desc: 'ATK+15・MATK+15 [アクセサリー]', type: 'equipment', slot: 'accessory', atk: 15, matk: 15, price: 0 },
  guardHelm:    { name: '守護の兜',     emoji: '🔰', desc: 'DEF+30 [頭防具]',                type: 'equipment', slot: 'head',      def: 30,          price: 0 },
  miracleDrug:  { name: '奇跡の薬',     emoji: '🌟', desc: 'HP/MP完全回復＋仲間全員復活',    type: 'consumable', effect: 'full_revive', value: 0,        price: 0 },

  // 神器シリーズ（クリア後コンテンツ報酬）
  godDragonSword:  { name: '神龍の剣',   emoji: '🐉', desc: 'ATK+200・全属性ダメージ+50% [武器]',      type: 'equipment', slot: 'weapon',    atk: 200, allElemBonus: 0.5, price: 0 },
  divineArmor:     { name: '神聖の鎧',   emoji: '✨', desc: 'DEF+150・HP+500 [体防具]',                type: 'equipment', slot: 'body',      def: 150, hp: 500, price: 0 },
  godDragonShield: { name: '神龍の盾',   emoji: '🐲', desc: '全ダメージ40%軽減 [アクセサリー]',        type: 'equipment', slot: 'accessory', dmgReduce: 0.40, price: 0 },
  divineRing:      { name: '神器の指輪', emoji: '💫', desc: '全ステータス+100 [アクセサリー]',          type: 'equipment', slot: 'accessory', atk: 100, def: 100, matk: 100, hp: 100, mp: 100, price: 0 },
  demonGodRing:    { name: '魔神の指輪', emoji: '🔮', desc: '全ステータス+50 [アクセサリー]',           type: 'equipment', slot: 'accessory', atk: 50, def: 50, matk: 50, hp: 50, mp: 50, price: 0 },
  voidArmor:       { name: '虚無の鎧',   emoji: '🌑', desc: 'DEF+80・全ダメージ30%軽減 [体防具]',      type: 'equipment', slot: 'body',      def: 80, dmgReduce: 0.30, price: 0 },

  // モンスター素材
  slimeGel:     { name: 'スライムのゼリー', emoji: '🟢', desc: '特殊強化に使える素材', type: 'material', price: 50  },
  wolfFang:     { name: '狼の牙',           emoji: '🦷', desc: '特殊強化に使える素材', type: 'material', price: 80  },
  iceCrystal:   { name: '氷の結晶',         emoji: '🔷', desc: '特殊強化に使える素材', type: 'material', price: 120 },
  sandCore:     { name: '砂の核',           emoji: '🟠', desc: '特殊強化に使える素材', type: 'material', price: 150 },
  deepSeaScale: { name: '深海の鱗',         emoji: '🐟', desc: '特殊強化に使える素材', type: 'material', price: 200 },
  demonHorn:    { name: '魔王の角',         emoji: '👿', desc: '特殊強化に使える素材', type: 'material', price: 500 },

  // ── 町の発展 - 伝説の武器屋（Village Lv5） ──
  legSword:  { name: '天斬の剣',   emoji: '⚔️', desc: 'ATK+150 [武器]',               type: 'equipment', slot: 'weapon',    atk: 150, price: 150000 },
  legStaff:  { name: '月詠の杖',   emoji: '🌙', desc: 'MATK+120 [武器]',              type: 'equipment', slot: 'weapon',    matk: 120, price: 120000 },
  legHelm:   { name: '鉄壁の兜',   emoji: '⛩️', desc: 'DEF+80・HP+200 [頭防具]',      type: 'equipment', slot: 'head',      def: 80, hp: 200, price: 100000 },
  legArmor:  { name: '不滅の鎧',   emoji: '🛡️', desc: 'DEF+100・HP+300 [体防具]',     type: 'equipment', slot: 'body',      def: 100, hp: 300, price: 130000 },
  legRing:   { name: '万能の指輪', emoji: '💍', desc: '全ステータス+50 [アクセサリー]', type: 'equipment', slot: 'accessory', atk: 50, def: 50, matk: 50, hp: 50, mp: 50, price: 100000 },

  // ── 砂漠Lv3 素材屋 ──
  rareCrystal: { name: 'レアクリスタル', emoji: '💎', desc: '希少な魔法の結晶', type: 'material', price: 5000 },
  ancientOre:  { name: '古代鉱石',       emoji: '🪨', desc: '古代文明の貴重な鉱石', type: 'material', price: 4000 },
  dragonScale: { name: '竜の鱗',         emoji: '🐲', desc: '竜の体から採れる希少素材', type: 'material', price: 6000 },

  // ── 砂漠Lv4 魔法書店 ──
  magicBookFire:  { name: '炎上の魔法書', emoji: '📕', desc: '🔥火属性ダメージ+20% [アクセサリー]', type: 'equipment', slot: 'accessory', elemBonus: { fire: 0.20 }, price: 50000 },
  magicBookLight: { name: '聖光の魔法書', emoji: '📗', desc: '☀️光属性ダメージ+20% [アクセサリー]', type: 'equipment', slot: 'accessory', elemBonus: { light: 0.20 }, price: 50000 },
  magicBookIce:   { name: '氷結の魔法書', emoji: '📘', desc: '❄️氷属性ダメージ+20% [アクセサリー]', type: 'equipment', slot: 'accessory', elemBonus: { ice: 0.20 }, price: 50000 },

  // ── 雪山Lv4 召喚師のテント ──
  summonGem: { name: '召喚の宝玉', emoji: '🔮', desc: '全ステータス+30 [アクセサリー]', type: 'equipment', slot: 'accessory', atk: 30, def: 30, matk: 30, hp: 30, mp: 30, price: 80000 },
};

const SHOP_INVENTORY = {
  village_shop: ['herb', 'highHerb', 'mpPotion', 'antidote', 'phoenixFeather', 'leatherHelm', 'leatherArmor', 'powerRing'],
  snow_shop:    ['highHerb', 'mpPotion', 'highMpPotion', 'elixir', 'antidote', 'phoenixFeather', 'ironHelmet', 'chainmail', 'magicNecklace', 'speedBoots', 'guardRing'],
  desert_shop:  ['highHerb', 'mpPotion', 'highMpPotion', 'elixir', 'antidote', 'phoenixFeather', 'magicHat', 'mageRobe', 'expCharm', 'healRing'],
  sea_shop:     ['elixir', 'antidote', 'phoenixFeather', 'heroCirclet', 'heroArmor', 'ironCharm', 'heroShield', 'fireRing', 'iceNecklace', 'thunderCharm', 'lightSeal', 'darkEmblem', 'elemShield'],
  // 町の発展で解放される追加在庫
  village_shop_ext:    ['highMpPotion', 'elixir', 'magicNecklace', 'speedBoots', 'guardRing'],
  village_legend_shop: ['legSword', 'legStaff', 'legHelm', 'legArmor', 'legRing'],
  desert_shop_ext:     ['guardRing', 'magicNecklace', 'ironCharm', 'ironHelmet'],
  desert_material_shop:['rareCrystal', 'ancientOre', 'dragonScale'],
  desert_magic_shop:   ['magicBookFire', 'magicBookLight', 'magicBookIce'],
  snow_shop_ext:       ['heroCirclet', 'heroArmor', 'mageRobe', 'magicHat', 'expCharm'],
  snow_summon_shop:    ['summonGem'],
};

// ============================================================
//  町の発展データ
// ============================================================

const TOWN_DEV_COSTS = [5000, 20000, 50000, 100000, 200000];

const TOWN_DEV_DATA = {
  village: {
    name: '出発の村「ライトン」', emoji: '🏘️', scene: 'village',
    descs: [
      '君が育った小さな村「ライトン」。\n\n村人たちが心配そうに見守る中、旅の準備を進めている。\n北には「深い森」が広がり、その先に洞窟、そして魔王城があると言われている。\n\n出発前に準備をしておこう。',
      '【Lv1 発展】村の道具屋が拡充され、品揃えが豊富になった。\n\n帰ってきた冒険者の話が村中に広まり、活気が出てきた。',
      '【Lv2 発展】立派な宿屋「英雄の間」が完成した！\n\n村長からの援助で、冒険者は無料で宿泊できる。\nHP・MPが全回復する。',
      '【Lv3 発展】鍛冶屋ガルドが腕を磨いた。\n\n「+15まで鍛えられるようになったぞ。試してみるか？」\n\n特別な素材と技術で、装備の限界を超えられる。',
      '【Lv4 発展】マルクが長年の修行で上位錬金術を習得！\n\n「新しいレシピを覚えたよ。すごいものが作れるはずだ！」\n\n上位錬金レシピが解放された。',
      '【Lv5 発展】伝説の武器商人が村に定住した！\n\n「世界中を旅して集めた最強の装備を揃えたぞ」\n\n村に伝説の武器屋がオープンした！',
    ],
    levels: [
      { name: 'Lv1 道具屋拡充',   unlock: '道具屋の品揃えアップ（高品質回復薬追加）' },
      { name: 'Lv2 宿屋建設',     unlock: '宿屋が無料でHP・MP全回復できる' },
      { name: 'Lv3 鍛冶屋強化',   unlock: '鍛冶屋の強化上限が+10→+15へ' },
      { name: 'Lv4 錬金術師覚醒', unlock: '上位錬金レシピが解放される' },
      { name: 'Lv5 伝説の武器屋', unlock: '最強クラスの武器・防具が購入できる' },
    ]
  },
  desert: {
    name: '砂漠のオアシス', emoji: '🌴', scene: 'desert_oasis',
    descs: [
      'オアシスに辿り着いた。\n\n澄んだ水と椰子の木——砂漠の中の楽園だ。\n冷たい水を飲み、少し休んだ。\n\n【HPが半分回復した！】\n\nオアシスの傍に旅商人が一人いた。',
      '【Lv1 発展】行商人の仲間が増え、品揃えが充実した。\n\n砂漠を越える装備が揃うようになった。\n\n【HPが半分回復した！】',
      '【Lv2 発展】オアシス近くに闘技場の支部が設立された！\n\n「エキスパート」難易度の特訓が受けられる！\n\n【HPが半分回復した！】',
      '【Lv3 発展】レア素材を扱う専門店が開業した！\n\n砂漠や竜から採れる希少素材が購入できる。\n\n【HPが半分回復した！】',
      '【Lv4 発展】砂漠の魔法使いが魔法書店を開いた！\n\n属性魔法を大幅に強化できる魔法書が手に入る！\n\n【HPが半分回復した！】',
      '【Lv5 発展】砂漠の地下に封印されたダンジョンへの扉が発見された！\n\n強力な番人が待ち受けるが、伝説の財宝があるという！\n\n【HPが半分回復した！】',
    ],
    levels: [
      { name: 'Lv1 アイテム屋拡充', unlock: '行商人の品揃えがアップ' },
      { name: 'Lv2 闘技場支部',     unlock: '闘技場エキスパート戦が解放される' },
      { name: 'Lv3 素材屋開業',     unlock: 'レア素材（竜の鱗・古代鉱石など）を購入可能' },
      { name: 'Lv4 魔法書店',       unlock: '属性ダメージ+20%の魔法書を購入可能' },
      { name: 'Lv5 秘密ダンジョン', unlock: '砂漠の秘密ダンジョンへの道が開く' },
    ]
  },
  snow: {
    name: '雪山の集落', emoji: '❄️', scene: 'snow_village',
    descs: [
      '小さな集落だった。毛皮を纏った人々が厳しい顔をしている。\n\n「あんた、冒険者か？\nこの先に氷雪の女王の城がある。近づく者は皆凍り付く。\n装備を整えてから行くことをお勧めするよ」',
      '【Lv1 発展】集落の回復泉が強化された！\n\n「体の芯まで癒してやるよ」村人が微笑んだ。\n回復スポットの回復量がアップした。',
      '【Lv2 発展】立派な装備屋が完成した！\n\n寒冷地専用の最新装備が揃うようになった。',
      '【Lv3 発展】スキル鍛錬所が建設された！\n\n「修行を積めば基礎能力が上がるぞ」\n\nゴールドを払ってステータスを強化できる！',
      '【Lv4 発展】伝説の召喚師が集落に滞在している！\n\n「召喚の力を宿した宝玉を売ろう」\n\n強力な召喚宝玉が購入できる！',
      '【Lv5 発展】雪山の奥に封印された「氷の秘密ダンジョン」の扉が開いた！\n\n極寒の迷宮に挑む覚悟はあるか？',
    ],
    levels: [
      { name: 'Lv1 回復スポット強化', unlock: '雪山の回復スポットで+100G回復量アップ' },
      { name: 'Lv2 装備屋拡充',       unlock: '装備屋に上位装備が追加される' },
      { name: 'Lv3 スキル鍛錬所',     unlock: 'ゴールドを払ってステータスを永久強化' },
      { name: 'Lv4 召喚師のテント',   unlock: '強力な召喚宝玉を購入できる' },
      { name: 'Lv5 氷の秘密ダンジョン', unlock: '雪山奥の秘密ダンジョンへの道が開く' },
    ]
  }
};

// ============================================================
//  仲間キャラクター定義
// ============================================================

const COMPANION_DEFS = {
  gaius: {
    name: 'ガイアス', emoji: '🛡️', color: '#6080ff',
    baseHp: 180, hpPerLv: 20,
    baseMp: 20,  mpPerLv: 2,
    baseAtk: 20, atkPerLv: 4,
    baseDef: 22, defPerLv: 5,
    baseMatk: 5, matkPerLv: 1,
  },
  luna: {
    name: 'ルナ', emoji: '🌙', color: '#ffe080',
    baseHp: 60,  hpPerLv: 8,
    baseMp: 55,  mpPerLv: 7,
    baseAtk: 10, atkPerLv: 3,
    baseDef: 8,  defPerLv: 2,
    baseMatk: 22, matkPerLv: 5,
  },
  sola: {
    name: 'ソラ', emoji: '⭐', color: '#a0b0ff',
    baseHp: 55,  hpPerLv: 8,
    baseMp: 55,  mpPerLv: 7,
    baseAtk: 12, atkPerLv: 3,
    baseDef: 7,  defPerLv: 2,
    baseMatk: 24, matkPerLv: 5,
  },
  serafina: {
    name: 'セラフィナ', emoji: '✨', color: '#80ff80',
    baseHp: 65,  hpPerLv: 9,
    baseMp: 65,  mpPerLv: 8,
    baseAtk: 8,  atkPerLv: 2,
    baseDef: 8,  defPerLv: 2,
    baseMatk: 32, matkPerLv: 7,
  },
  zephiros: {
    name: 'ゼフィロス', emoji: '🔮', color: '#e080ff',
    baseHp: 45,  hpPerLv: 6,
    baseMp: 75,  mpPerLv: 9,
    baseAtk: 10, atkPerLv: 2,
    baseDef: 5,  defPerLv: 1,
    baseMatk: 42, matkPerLv: 9,
  },
};

function createCompanionState(id, playerLevel) {
  const d = COMPANION_DEFS[id];
  const lv = Math.max(1, playerLevel);
  return {
    id, joined: true,
    name: d.name, emoji: d.emoji,
    level: lv,
    hp:    d.baseHp + (lv - 1) * d.hpPerLv,
    maxHp: d.baseHp + (lv - 1) * d.hpPerLv,
    mp:    d.baseMp + (lv - 1) * d.mpPerLv,
    maxMp: d.baseMp + (lv - 1) * d.mpPerLv,
    baseAtk:  d.baseAtk  + (lv - 1) * d.atkPerLv,
    baseDef:  d.baseDef  + (lv - 1) * d.defPerLv,
    baseMatk: d.baseMatk + (lv - 1) * d.matkPerLv,
    equipment: { weapon: null, head: null, body: null, acc1: null, acc2: null },
    skillCooldowns: {},
  };
}

const ENEMY_DATA = {
  slime: {
    name: 'スライム', emoji: '🟢',
    hp: 25, maxHp: 25, attack: 6, defense: 1,
    exp: 15, gold: 8,
    weak: ['fire'],
  },
  poisonFrog: {
    name: '毒ガエル', emoji: '🐸',
    hp: 30, maxHp: 30, attack: 8, defense: 2,
    exp: 20, gold: 10,
    skill: { name: '毒液', chance: 0.35, damage: 12, msg: '毒液をかけてきた！', inflict: 'poison' },
    weak: ['fire'],
  },
  goblin: {
    name: 'ゴブリン', emoji: '👺',
    hp: 40, maxHp: 40, attack: 12, defense: 3,
    exp: 30, gold: 15,
  },
  bat: {
    name: '大コウモリ', emoji: '🦇',
    hp: 35, maxHp: 35, attack: 10, defense: 2,
    exp: 25, gold: 12,
    skill: { name: '超音波', chance: 0.3, damage: 8, msg: '超音波で眠りに誘った！', inflict: 'sleep' },
    weak: ['light'],
  },
  skeleton: {
    name: 'スケルトン', emoji: '💀',
    hp: 50, maxHp: 50, attack: 14, defense: 5,
    exp: 40, gold: 20,
    weak: ['fire', 'light'],
  },
  troll: {
    name: 'トロール', emoji: '👾',
    hp: 80, maxHp: 80, attack: 20, defense: 8,
    exp: 60, gold: 35,
    skill: { name: '大振り', chance: 0.3, damage: 30, msg: '力いっぱい大振りしてきた！' },
  },
  demon: {
    name: 'デーモン', emoji: '😈',
    hp: 70, maxHp: 70, attack: 22, defense: 6,
    exp: 80, gold: 40,
    skill: { name: '黒炎', chance: 0.35, damage: 22, msg: '黒い炎を放った！' },
    weak: ['light'], resist: ['dark'],
  },
  nightmare: {
    name: 'ナイトメア', emoji: '🐴',
    hp: 90, maxHp: 90, attack: 28, defense: 10,
    exp: 100, gold: 50,
    skill: { name: '連続蹴り', chance: 0.3, damage: 20, msg: '素早く2回蹴りを放った！' },
  },

  // ── 森（強化版）──
  forestWolf: {
    name: '森の大狼', emoji: '🐺',
    hp: 45, maxHp: 45, attack: 14, defense: 3,
    exp: 35, gold: 18,
    skill: { name: '噛みつき', chance: 0.3, damage: 18, msg: '鋭い牙で噛みついた！' },
    weak: ['fire'],
  },
  poisonSlime: {
    name: '毒スライム', emoji: '🟣',
    hp: 38, maxHp: 38, attack: 10, defense: 3,
    exp: 30, gold: 15,
    skill: { name: '毒液噴射', chance: 0.4, damage: 8, msg: '毒液を噴射してきた！' },
    weak: ['fire'],
  },

  // ── 雪山エリア ──
  snowWolf: {
    name: '雪狼', emoji: '❄️',
    hp: 65, maxHp: 65, attack: 22, defense: 8,
    exp: 55, gold: 28,
    skill: { name: '凍える爪', chance: 0.35, damage: 22, msg: '凍てつく爪で引っかいた！' },
    weak: ['fire'], resist: ['ice'],
  },
  iceGolem: {
    name: '氷のゴーレム', emoji: '🧊',
    hp: 90, maxHp: 90, attack: 26, defense: 16,
    exp: 72, gold: 38,
    skill: { name: '氷柱落とし', chance: 0.3, damage: 28, msg: '巨大な氷柱を叩きつけた！', inflict: 'paralysis' },
    weak: ['fire'], resist: ['ice'], nullElem: ['thunder'],
  },
  yeti: {
    name: 'イエティ', emoji: '🦣',
    hp: 105, maxHp: 105, attack: 30, defense: 10,
    exp: 88, gold: 45,
    skill: { name: '猛吹雪', chance: 0.35, damage: 32, msg: '猛烈な吹雪を引き起こした！' },
    weak: ['fire'], resist: ['ice'],
  },
  snowFairy: {
    name: '雪の妖精', emoji: '🧚',
    hp: 55, maxHp: 55, attack: 18, defense: 5,
    exp: 60, gold: 32,
    skill: { name: '氷の矢', chance: 0.35, damage: 20, msg: '鋭い氷の矢を放った！' },
    weak: ['fire'], resist: ['ice'],
  },

  // ── 砂漠エリア ──
  sandScorpion: {
    name: '砂漠の大蠍', emoji: '🦂',
    hp: 72, maxHp: 72, attack: 24, defense: 7,
    exp: 65, gold: 35,
    skill: { name: '毒針', chance: 0.4, damage: 16, msg: '猛毒の針で刺した！', inflict: 'poison' },
    weak: ['ice'], resist: ['fire'],
  },
  mummy: {
    name: 'ミイラ', emoji: '🧟',
    hp: 80, maxHp: 80, attack: 20, defense: 13,
    exp: 70, gold: 38,
    skill: { name: '呪縛の手', chance: 0.3, damage: 18, msg: '腐った手で掴みかかった！', inflict: 'paralysis' },
    weak: ['fire', 'light'],
  },
  desertBandit: {
    name: '砂漠の盗賊', emoji: '🗡️',
    hp: 88, maxHp: 88, attack: 26, defense: 9,
    exp: 80, gold: 55,
    skill: { name: '二連斬り', chance: 0.3, damage: 36, msg: '素早く2度斬りかかった！' },
  },
  fireElemental: {
    name: '炎の精霊', emoji: '🔥',
    hp: 75, maxHp: 75, attack: 28, defense: 5,
    exp: 90, gold: 45,
    skill: { name: '炎の渦', chance: 0.35, damage: 30, msg: '炎の渦に巻き込んだ！' },
    weak: ['ice'], absorb: ['fire'],
  },

  // ── 海底神殿エリア ──
  seaSerpent: {
    name: '海蛇', emoji: '🐍',
    hp: 92, maxHp: 92, attack: 30, defense: 10,
    exp: 100, gold: 52,
    skill: { name: '毒の噛みつき', chance: 0.35, damage: 22, msg: '猛毒の牙で噛みついた！' },
    weak: ['thunder'],
  },
  deepAngler: {
    name: '深海の猟師', emoji: '🐡',
    hp: 82, maxHp: 82, attack: 25, defense: 12,
    exp: 92, gold: 48,
    skill: { name: '光弾', chance: 0.3, damage: 26, msg: '眩い光弾を放った！' },
    weak: ['thunder'],
  },
  krakenArm: {
    name: 'クラーケンの腕', emoji: '🦑',
    hp: 115, maxHp: 115, attack: 32, defense: 8,
    exp: 112, gold: 60,
    skill: { name: '締め付け', chance: 0.3, damage: 42, msg: '巨大な腕で締め付けた！' },
    weak: ['thunder'], resist: ['ice'],
  },
  darkMermaid: {
    name: '闇の人魚戦士', emoji: '🧜',
    hp: 78, maxHp: 78, attack: 27, defense: 9,
    exp: 85, gold: 44,
    skill: { name: '海流斬り', chance: 0.35, damage: 28, msg: '海流を纏った剣で斬りつけた！' },
    weak: ['light'], resist: ['dark'],
  },

  // ── 魔王城（強化版）──
  darkKnight: {
    name: '暗黒騎士', emoji: '⬛',
    hp: 150, maxHp: 150, attack: 40, defense: 18,
    exp: 155, gold: 85,
    skill: { name: '闇の剣', chance: 0.35, damage: 52, msg: '闇を纏った剣を振り下ろした！' },
    weak: ['light'], resist: ['dark'],
  },
  cursedSoul: {
    name: '呪われた魂', emoji: '👻',
    hp: 100, maxHp: 100, attack: 28, defense: 8,
    exp: 130, gold: 62,
    skill: { name: '呪いの声', chance: 0.4, damage: 24, msg: '呪いの声を浴びせた！', inflict: 'poison' },
    weak: ['light'], resist: ['dark'],
  },

  stoneGolem: {
    name: '石の番人', emoji: '🪨',
    hp: 200, maxHp: 200, attack: 30, defense: 20,
    exp: 250, gold: 120, isBoss: true,
    skill: { name: 'ストンプ', chance: 0.4, damage: 35, msg: '大地を踏み鳴らした！' },
    weakMagic: true,
    weak: ['wind'], resist: ['fire', 'ice', 'thunder'],
  },
  // ── 新ボス ──
  iceQueen: {
    name: '氷雪の女王 アイゼリア', emoji: '👸',
    hp: 280, maxHp: 280, attack: 36, defense: 16,
    exp: 380, gold: 150, isBoss: true,
    skill: { name: '猛吹雪', chance: 0.35, damage: 42, msg: '激しい吹雪が炸裂した！', inflict: 'paralysis' },
    phase2Threshold: 130,
    phase2: { name: '氷雪の女王【暴走形態】', emoji: '❄️', attackBonus: 16 },
    weak: ['fire'], absorb: ['ice'],
  },
  sandPharaoh: {
    name: 'ファラオ・ザンデス', emoji: '🤴',
    hp: 300, maxHp: 300, attack: 38, defense: 14,
    exp: 400, gold: 160, isBoss: true,
    skill: { name: '砂嵐の裁き', chance: 0.35, damage: 46, msg: '猛烈な砂嵐を引き起こした！' },
    phase2Threshold: 140,
    phase2: { name: 'ファラオ・ザンデス【覚醒形態】', emoji: '☀️', attackBonus: 18 },
    weakMagic: true,
    weak: ['ice'], resist: ['fire'],
  },
  leviathan: {
    name: '大海蛇レヴィアタン', emoji: '🐲',
    hp: 360, maxHp: 360, attack: 42, defense: 15,
    exp: 500, gold: 200, isBoss: true,
    skill: { name: '大津波', chance: 0.35, damage: 54, msg: '巨大な津波が押し寄せた！！' },
    phase2Threshold: 170,
    phase2: { name: 'レヴィアタン【深淵解放】', emoji: '🌊', attackBonus: 20 },
    weak: ['thunder'], resist: ['ice'],
  },

  demonLord: {
    name: 'デーモンロード', emoji: '👹',
    hp: 220, maxHp: 220, attack: 38, defense: 14,
    exp: 350, gold: 150, isBoss: true,
    skill: { name: '暗黒の爪', chance: 0.35, damage: 44, msg: '暗黒の爪で切りかかった！' },
    phase2Threshold: 100,
    phase2: { name: 'デーモンロード【解放形態】', emoji: '🔴', attackBonus: 14 },
    weak: ['light'], resist: ['dark'],
  },
  demonKing: {
    name: '魔王ダークロス', emoji: '👿',
    level: 100,
    hp: 8000, maxHp: 8000, attack: 200, defense: 90,
    exp: 80000, gold: 9999, isBoss: true,
    skill: { name: '暗黒の炎【業火】', chance: 0.45, damage: 320, msg: '絶対零度の漆黒の炎が炸裂した！！' },
    phase2Threshold: 4000,
    phase2: { name: '魔王ダークロス 【真の魔王形態】', emoji: '🔴', attackBonus: 80 },
    weak: ['light'], resist: ['fire', 'ice', 'thunder', 'wind'], absorb: ['dark'],
  },

  // ── 森の奥地（レベリングスポット Lv10〜25相当）──
  deepWolf: {
    name: '凶暴な大狼', emoji: '🐺',
    hp: 180, maxHp: 180, attack: 38, defense: 14,
    exp: 120, gold: 60,
    skill: { name: '猛噛み', chance: 0.35, damage: 45, msg: '猛烈に噛みついた！' },
  },
  thornBeast: {
    name: '棘の魔獣', emoji: '🦁',
    hp: 240, maxHp: 240, attack: 44, defense: 16,
    exp: 155, gold: 78,
    skill: { name: '棘の突進', chance: 0.3, damage: 55, msg: '棘を纏って突進した！' },
    resist: ['fire'],
  },
  ancientTrollL: {
    name: '古代トロール', emoji: '👾',
    hp: 320, maxHp: 320, attack: 50, defense: 20,
    exp: 195, gold: 98,
    skill: { name: '大岩投げ', chance: 0.35, damage: 65, msg: '巨大な岩を投げつけた！' },
  },

  // ── 古代遺跡（レベリングスポット Lv25〜50相当）──
  ruinsGuard: {
    name: '遺跡の番人', emoji: '⚙️',
    hp: 480, maxHp: 480, attack: 65, defense: 28,
    exp: 320, gold: 160,
    skill: { name: '石化の矢', chance: 0.3, damage: 70, msg: '石化の矢を放った！', inflict: 'paralysis' },
    weakMagic: true,
    weak: ['wind'], resist: ['fire'],
  },
  cursedScribe: {
    name: '呪われた書記官', emoji: '📜',
    hp: 400, maxHp: 400, attack: 75, defense: 20,
    exp: 290, gold: 145,
    skill: { name: '呪いの経典', chance: 0.4, damage: 80, msg: '古代の呪文を放った！', inflict: 'poison' },
    weak: ['light'], resist: ['dark'],
  },
  stoneWatcher: {
    name: '石の守護者', emoji: '🗿',
    hp: 580, maxHp: 580, attack: 58, defense: 40,
    exp: 360, gold: 180,
    skill: { name: '岩砕き', chance: 0.3, damage: 90, msg: '大地を砕く一撃を放った！' },
    weakMagic: true,
    weak: ['wind'], resist: ['fire', 'ice'],
  },

  // ── 闘技場（レベリングスポット Lv50〜100相当）──
  gladiator: {
    name: '猛者の闘士', emoji: '🗡️',
    hp: 750, maxHp: 750, attack: 92, defense: 42,
    exp: 650, gold: 325,
    skill: { name: '剛剣', chance: 0.35, damage: 110, msg: '鋼の剛剣を振り下ろした！' },
  },
  championKnight: {
    name: '覇者の騎士', emoji: '⚔️',
    hp: 920, maxHp: 920, attack: 108, defense: 50,
    exp: 820, gold: 410,
    skill: { name: '覇王斬', chance: 0.35, damage: 130, msg: '覇気を帯びた一閃！' },
  },
  arenaLegend: {
    name: '闘技場の伝説', emoji: '👑',
    hp: 1100, maxHp: 1100, attack: 125, defense: 55,
    exp: 1000, gold: 500,
    skill: { name: '伝説の一撃', chance: 0.4, damage: 160, msg: '伝説に語り継がれる一撃！' },
  },

  // ── 町の発展 秘密ダンジョン ──
  desertWarden: {
    name: '砂漠の番人', emoji: '🏺',
    hp: 80000, maxHp: 80000, attack: 500, defense: 200,
    exp: 200000, gold: 30000, isBoss: true, level: 80,
    skill: { name: '砂嵐の刃', chance: 0.35, damage: 600, msg: '猛烈な砂嵐が切り裂いた！' },
    weak: ['ice'], resist: ['fire', 'thunder'],
  },
  iceWarden: {
    name: '氷の番人', emoji: '🧊',
    hp: 80000, maxHp: 80000, attack: 520, defense: 210,
    exp: 200000, gold: 30000, isBoss: true, level: 80,
    skill: { name: '絶対零度の牢', chance: 0.35, damage: 620, msg: '極寒の力が全てを凍てつかせた！' },
    weak: ['fire'], resist: ['ice', 'light'],
  },

  // ── 乗り物システム ──
  grasslandBoar: {
    name: '大草原の大猪', emoji: '🐗',
    hp: 95, maxHp: 95, attack: 28, defense: 8,
    exp: 80, gold: 45,
    skill: { name: '突進', chance: 0.3, damage: 35, msg: '猛烈な突進をしてきた！' },
    weak: ['fire'],
  },
  windWolf: {
    name: '風狼', emoji: '🌪️',
    hp: 110, maxHp: 110, attack: 32, defense: 10,
    exp: 95, gold: 50,
    skill: { name: '嵐の爪', chance: 0.35, damage: 28, msg: '風を切る鋭い爪が迫った！' },
    weak: ['fire', 'thunder'],
  },
  gryphonJr: {
    name: 'グリフォン（若）', emoji: '🦅',
    hp: 130, maxHp: 130, attack: 38, defense: 12,
    exp: 110, gold: 60,
    skill: { name: '急降下爪撃', chance: 0.3, damage: 45, msg: '上空から急降下して攻撃した！' },
    weak: ['thunder'],
  },
  corsairPirate: {
    name: '凶賊コルセア', emoji: '🏴‍☠️',
    hp: 200, maxHp: 200, attack: 75, defense: 25,
    exp: 220, gold: 120,
    skill: { name: '二刀流斬り', chance: 0.35, damage: 90, msg: '二本の剣で連続攻撃した！' },
  },
  tropicalSerpent: {
    name: '南海の大蛇', emoji: '🐍',
    hp: 230, maxHp: 230, attack: 70, defense: 22,
    exp: 240, gold: 110,
    skill: { name: '猛毒の牙', chance: 0.4, damage: 60, msg: '猛毒の牙で噛みついた！', inflict: 'poison' },
    weak: ['fire', 'ice'],
  },
  giantCrab: {
    name: '巨大ガニ', emoji: '🦀',
    hp: 280, maxHp: 280, attack: 85, defense: 40,
    exp: 280, gold: 150,
    skill: { name: '大鋏挟み', chance: 0.3, damage: 110, msg: '巨大な鋏で挟み込んだ！' },
    weak: ['thunder'],
  },
  windDrake: {
    name: '天空の翼竜', emoji: '🐉',
    hp: 350, maxHp: 350, attack: 150, defense: 60,
    exp: 500, gold: 300,
    skill: { name: '竜巻ブレス', chance: 0.35, damage: 180, msg: '猛烈な竜巻ブレスを吐いた！' },
    weak: ['ice', 'thunder'], resist: ['wind'],
  },
  cloudGiant: {
    name: '雲の巨人', emoji: '🌩️',
    hp: 420, maxHp: 420, attack: 160, defense: 70,
    exp: 580, gold: 350,
    skill: { name: '雷鳴の拳', chance: 0.3, damage: 200, msg: '天雷を纏った拳が降り注いだ！', element: 'thunder' },
    weak: ['fire'], resist: ['thunder'],
  },
  skyPhoenix: {
    name: '天炎鳥フェニックス', emoji: '🦜',
    hp: 500, maxHp: 500, attack: 180, defense: 80,
    exp: 700, gold: 400,
    skill: { name: '業炎の翼', chance: 0.4, damage: 220, msg: '天を焦がす炎の翼が広がった！', element: 'fire' },
    weak: ['ice'], resist: ['fire'],
  },

  // ── 神々の塔（クリア後コンテンツ）──
  towerGuard1: {
    name: '神々の衛兵', emoji: '⚔️',
    hp: 30000, maxHp: 30000, attack: 600, defense: 100,
    exp: 50000, gold: 5000,
    skill: { name: '神聖斬', chance: 0.3, damage: 600, msg: '神聖な剣を振り下ろした！' },
  },
  towerGuard2: {
    name: '天空の護衛', emoji: '🛡️',
    hp: 60000, maxHp: 60000, attack: 800, defense: 140,
    exp: 80000, gold: 8000,
    skill: { name: '天空の盾撃', chance: 0.3, damage: 800, msg: '巨大な盾で強烈に叩きつけた！' },
  },
  towerArchangel: {
    name: '堕天使', emoji: '😇',
    hp: 100000, maxHp: 100000, attack: 1000, defense: 180,
    exp: 120000, gold: 12000,
    skill: { name: '断罪の光', chance: 0.35, damage: 1000, msg: '神の裁きが降り注いだ！！' },
    weak: ['dark'], resist: ['light'],
  },
  towerDemon: {
    name: '神殿の魔将', emoji: '👹',
    hp: 150000, maxHp: 150000, attack: 1200, defense: 220,
    exp: 180000, gold: 18000,
    skill: { name: '魔将の怒り', chance: 0.35, damage: 1200, msg: '暗黒の力が炸裂した！！' },
    resist: ['dark'],
  },
  towerAncient: {
    name: '古代神兵', emoji: '🗿',
    hp: 200000, maxHp: 200000, attack: 1400, defense: 260,
    exp: 250000, gold: 25000,
    skill: { name: '古代の怒り', chance: 0.3, damage: 1400, msg: '古代の力が世界を揺るがした！！' },
  },

  // ── 隠しボス ──
  godDragon: {
    name: '神龍ゴッドドラゴン', emoji: '🐉',
    hp: 999999, maxHp: 999999, attack: 1800, defense: 400,
    exp: 999999, gold: 99999, isBoss: true, level: 999,
    skill: { name: '神滅の炎', chance: 0.4, damage: 2000, msg: '世界を滅ぼす神滅の炎が炸裂した！！！' },
    weak: ['light'], resist: ['fire', 'ice', 'thunder', 'wind', 'dark'],
    phase2Threshold: 500000,
    phase2: { name: '神龍【覚醒形態】', emoji: '🔥', attackBonus: 300 },
  },
  ancientBaal: {
    name: '古の魔神バアル', emoji: '👿',
    hp: 500000, maxHp: 500000, attack: 1600, defense: 350,
    exp: 500000, gold: 50000, isBoss: true, level: 150,
    skill: { name: '魔神の咆哮', chance: 0.35, damage: 1800, msg: '魔神の力が全てを飲み込んだ！！' },
    weak: ['light'], absorb: ['dark'], resist: ['fire', 'ice', 'thunder', 'wind'],
    phase2Threshold: 250000,
    phase2: { name: '魔神バアル【解放形態】', emoji: '🌑', attackBonus: 250 },
  },
  voidWarden: {
    name: '虚無の番人ヴォイド', emoji: '⬛',
    hp: 750000, maxHp: 750000, attack: 1700, defense: 380,
    exp: 750000, gold: 75000, isBoss: true, level: 200,
    skill: { name: '虚無の嵐', chance: 0.35, damage: 1900, msg: '全てを無に帰す虚無の嵐が炸裂した！！' },
    nullElem: ['fire', 'ice', 'thunder', 'wind', 'light', 'dark'],
    phase2Threshold: 375000,
    phase2: { name: '虚無の番人【深淵解放】', emoji: '🕳️', attackBonus: 300 },
  },
};

const AREA_ENEMIES = {
  forest:       ['slime', 'poisonFrog', 'goblin', 'forestWolf'],
  cave:         ['bat', 'skeleton', 'goblin', 'troll', 'poisonSlime'],
  snow:         ['snowWolf', 'iceGolem', 'yeti', 'snowFairy'],
  desert:       ['sandScorpion', 'mummy', 'desertBandit', 'fireElemental'],
  sea:          ['seaSerpent', 'deepAngler', 'krakenArm', 'darkMermaid'],
  demon_castle: ['skeleton', 'demon', 'nightmare', 'darkKnight', 'cursedSoul'],
  grasslands:   ['grasslandBoar', 'windWolf', 'gryphonJr'],
  south_island: ['corsairPirate', 'tropicalSerpent', 'giantCrab'],
  sky:          ['windDrake', 'cloudGiant', 'skyPhoenix'],
};

// ============================================================
//  季節システム定義
// ============================================================

const SEASON_DATA = {
  spring: {
    name: '春', emoji: '🌸', color: '#ff80a0',
    desc: '生命力が満ちる季節。回復力が高まり、光属性が強化される。',
    elemBonus: { light: 0.20 },
    atkMult: 1.0, defMult: 1.0, matkMult: 1.0,
    expMult: 1.0, goldMult: 1.0,
    healAfterBattle: 0.08,
  },
  summer: {
    name: '夏', emoji: '☀️', color: '#ffcc00',
    desc: '灼熱の季節。炎属性と魔法力が強化される。',
    elemBonus: { fire: 0.25 },
    atkMult: 1.0, defMult: 1.0, matkMult: 1.15,
    expMult: 1.0, goldMult: 1.0,
    healAfterBattle: 0,
  },
  autumn: {
    name: '秋', emoji: '🍂', color: '#ff8040',
    desc: '収穫の季節。経験値とゴールドの獲得量が増える。',
    elemBonus: {},
    atkMult: 1.1, defMult: 1.0, matkMult: 1.1,
    expMult: 1.25, goldMult: 1.25,
    healAfterBattle: 0,
  },
  winter: {
    name: '冬', emoji: '❄️', color: '#80d0ff',
    desc: '厳冬の季節。氷属性と防御力が強化される。',
    elemBonus: { ice: 0.25 },
    atkMult: 1.0, defMult: 1.2, matkMult: 1.0,
    expMult: 1.0, goldMult: 1.0,
    healAfterBattle: 0,
  },
};
const SEASON_ORDER = ['spring', 'summer', 'autumn', 'winter'];
const SEASON_CYCLE_BATTLES = 25;

// ============================================================
//  ガチャシステム定義
// ============================================================
const GACHA_TABLE = {
  rates: { 5: 0.020, 4: 0.080, 3: 0.200, 2: 0.300 },
  pityLimit: 50,
  pool: {
    5: [
      { id: 'ancientBlade',   name: '古代の聖剣',      emoji: '🌟' },
      { id: 'heroArmor',      name: '勇者の鎧',        emoji: '🛡️' },
      { id: 'heroCirclet',    name: '勇者の冠',        emoji: '👑' },
      { id: 'elixir',         name: 'エリクサー×3',    emoji: '⭐', qty: 3 },
      { id: 'heroSword',      name: '勇者の剣',        emoji: '⚔️' },
    ],
    4: [
      { id: 'thunderStaff',   name: '雷鳴の杖',        emoji: '⚡' },
      { id: 'iceBlade',       name: '氷結の刃',        emoji: '🗡️' },
      { id: 'mageRobe',       name: '魔道士のローブ',  emoji: '🧣' },
      { id: 'phoenixFeather', name: 'フェニックスの羽',emoji: '🪶' },
      { id: 'elixir',         name: 'エリクサー',      emoji: '⭐' },
    ],
    3: [
      { id: 'powerRing',      name: '力の指輪',        emoji: '💍' },
      { id: 'magicNecklace',  name: '魔力の首飾り',    emoji: '📿' },
      { id: 'ironHelmet',     name: '鉄の兜',          emoji: '⛑️' },
      { id: 'magicHat',       name: '魔法使いの帽子',  emoji: '🎩' },
      { id: 'highHerb',       name: '上薬草×3',        emoji: '🍃', qty: 3 },
      { id: 'highMpPotion',   name: '上MPの薬×3',      emoji: '💦', qty: 3 },
    ],
    2: [
      { id: 'highHerb',       name: '上薬草×2',        emoji: '🍃', qty: 2 },
      { id: 'highMpPotion',   name: '上MPの薬×2',      emoji: '💦', qty: 2 },
      { id: 'antidote',       name: '解毒薬×3',        emoji: '🧪', qty: 3 },
      { id: 'mpPotion',       name: 'MPの薬×3',        emoji: '💧', qty: 3 },
    ],
    1: [
      { id: 'herb',           name: '薬草×3',          emoji: '🌿', qty: 3 },
      { id: 'mpPotion',       name: 'MPの薬',          emoji: '💧' },
      { id: 'antidote',       name: '解毒薬',          emoji: '🧪' },
      { id: 'herb',           name: '薬草×5',          emoji: '🌿', qty: 5 },
    ],
  },
};

const LEVELING_SPOTS = {
  deep_forest: {
    name: '森の奥地', emoji: '🌲', sceneId: 'deep_forest_spot',
    unlockLevel: 10,
    enemyPool: ['deepWolf', 'thornBeast', 'ancientTrollL'],
    expMult: 1.5, goldMult: 1.5,
    rareDropPool: ['highHerb', 'mpPotion', 'highMpPotion'],
  },
  ancient_ruins: {
    name: '古代遺跡', emoji: '🏛️', sceneId: 'ancient_ruins_spot',
    unlockLevel: 20,
    enemyPool: ['ruinsGuard', 'cursedScribe', 'stoneWatcher'],
    expMult: 1.7, goldMult: 1.7,
    rareDropPool: ['highMpPotion', 'elixir', 'antidote', 'powerRing', 'magicNecklace'],
  },
  arena: {
    name: '闘技場', emoji: '🏟️', sceneId: 'arena_spot',
    unlockLevel: 30,
    waveEnemies: ['gladiator', 'gladiator', 'championKnight', 'championKnight', 'arenaLegend'],
    expMult: 2.0, goldMult: 2.0,
    waves: 5,
    rareDropPool: ['elixir', 'highMpPotion', 'heroCirclet'],
    bonusGold: 800, bonusItem: 'elixir',
  },
  desert_arena_expert: {
    name: '砂漠の闘技場（エキスパート）', emoji: '🏟️', sceneId: 'desert_arena_expert',
    unlockLevel: 50,
    enemyPool: ['sandScorpion', 'mummy', 'desertBandit', 'fireElemental'],
    expMult: 3.0, goldMult: 3.0,
    rareDropPool: ['elixir', 'ironCharm', 'guardRing', 'rareCrystal', 'ancientOre'],
  },
  // ── 乗り物システム専用スポット ──
  grasslands: {
    name: '大草原', emoji: '🌾', sceneId: 'grasslands_spot',
    unlockLevel: 15,
    enemyPool: ['grasslandBoar', 'windWolf', 'gryphonJr'],
    expMult: 1.6, goldMult: 1.6,
    rareDropPool: ['highHerb', 'mpPotion', 'speedBoots', 'wolfFang'],
  },
  south_island: {
    name: '南海の孤島', emoji: '🏝️', sceneId: 'south_island_spot',
    unlockLevel: 40,
    enemyPool: ['corsairPirate', 'tropicalSerpent', 'giantCrab'],
    expMult: 2.2, goldMult: 2.2,
    rareDropPool: ['elixir', 'highMpPotion', 'ironCharm', 'deepSeaScale'],
  },
  sky_island: {
    name: '天空の浮遊島', emoji: '☁️', sceneId: 'sky_island_spot',
    unlockLevel: 60,
    enemyPool: ['windDrake', 'cloudGiant', 'skyPhoenix'],
    expMult: 2.8, goldMult: 2.8,
    rareDropPool: ['elixir', 'divineRing', 'ironCharm', 'dragonScale'],
  },
};

const WARP_DESTINATIONS = [
  { name: '出発の村「ライトン」', emoji: '🏘️', sceneId: 'village',            flag: 'vis_village' },
  { name: '深い森 入口',          emoji: '🌲', sceneId: 'forest_entrance',    flag: 'vis_forest_entrance' },
  { name: '森の奥地',             emoji: '🌳', sceneId: 'deep_forest_spot',   flag: 'vis_deep_forest' },
  { name: '暗黒の洞窟 入口',      emoji: '🕯️', sceneId: 'cave_entrance',      flag: 'vis_cave_entrance' },
  { name: '古代遺跡',             emoji: '🏛️', sceneId: 'ancient_ruins_spot', flag: 'vis_ancient_ruins' },
  { name: 'オアシス（砂漠）',     emoji: '🌴', sceneId: 'desert_oasis',       flag: 'vis_desert_oasis' },
  { name: '雪山の麓',             emoji: '🏔️', sceneId: 'snow_entrance',      flag: 'vis_snow_entrance' },
  { name: '古い港町',             emoji: '⚓', sceneId: 'sea_harbor',         flag: 'vis_sea_harbor' },
  { name: '闘技場',               emoji: '🏟️', sceneId: 'arena_spot',         flag: 'vis_arena' },
  { name: '魔王城 城門',          emoji: '🏰', sceneId: 'demon_castle_gate',  flag: 'vis_demon_castle' },
  { name: '★ 神々の塔',           emoji: '🏔️', sceneId: 'gods_tower_hub',     flag: 'vis_gods_tower' },
  { name: '★ 虚無の地',           emoji: '⬛', sceneId: 'void_map',            flag: 'vis_void_map' },
  { name: '★ 砂漠の隠し部屋',    emoji: '🏺', sceneId: 'desert_hidden',      flag: 'vis_desert_hidden' },
  { name: '★ 無限の試練',        emoji: '♾️', sceneId: 'endless_trial_hub',  flag: 'vis_endless_trial' },
  // 乗り物エリア
  { name: '🌾 大草原',            emoji: '🌾', sceneId: 'grasslands_spot',    flag: 'vis_grasslands' },
  { name: '🏝️ 南海の孤島',        emoji: '🏝️', sceneId: 'south_island_spot',  flag: 'vis_south_island' },
  { name: '☁️ 天空の浮遊島',      emoji: '☁️', sceneId: 'sky_island_hub',     flag: 'vis_sky_island' },
];

// ── 神々の塔 フロアデータ ──
const GODS_TOWER_FLOORS = [
  { floor: 1,  name: '1F 入口の間',    emoji: '🏔️', enemy: 'towerGuard1',    recoveryGold: 500 },
  { floor: 2,  name: '2F 試練の回廊',  emoji: '🏔️', enemy: 'towerGuard1',    recoveryGold: 500 },
  { floor: 3,  name: '3F 守護者の間',  emoji: '🗼',  enemy: 'towerGuard2',    recoveryGold: 800 },
  { floor: 4,  name: '4F 天空の試練',  emoji: '🗼',  enemy: 'towerGuard2',    recoveryGold: 800 },
  { floor: 5,  name: '5F 光の廊下',    emoji: '🌤️', enemy: 'towerArchangel', recoveryGold: 1200 },
  { floor: 6,  name: '6F 断罪の間',    emoji: '🌤️', enemy: 'towerArchangel', recoveryGold: 1200 },
  { floor: 7,  name: '7F 魔将の領域',  emoji: '☁️',  enemy: 'towerDemon',     recoveryGold: 1500 },
  { floor: 8,  name: '8F 暗黒の回廊',  emoji: '☁️',  enemy: 'towerDemon',     recoveryGold: 1500 },
  { floor: 9,  name: '9F 頂上への扉',  emoji: '⛅', enemy: 'towerAncient',   recoveryGold: 2000 },
  { floor: 10, name: '10F 神龍の間',   emoji: '🌟', enemy: 'godDragon',      isBossFloor: true },
];

// ============================================================
//  隠し宝箱・隠し部屋 定義
// ============================================================
const HIDDEN_TREASURES = {
  forest_spring: {
    flag: 'ht_forest_spring',
    emoji: '✨', title: '精霊の泉の秘密',
    findText: '泉の底を注意深く見ると——\n光を放つ何かが沈んでいる！\n\n深く手を伸ばして取り出してみると、\n精霊の祝福を受けた古いお守りだった。\n持つだけで力が漲る感覚がある。\n\n【「経験値のお守り」を手に入れた！】\n（獲得EXPが1.5倍になるアクセサリー）',
    type: 'chest',
    reward: { items: ['expCharm'] },
  },
  forest_deep: {
    flag: 'ht_forest_deep',
    emoji: '📦', title: '深い森の隠し宝箱',
    findText: '大きな古木の根元をよく調べると——\n苔に覆われた宝箱が土に埋まっていた！\n\n錠前を外すと、大量の金貨と上質な回復薬が。\n\n【「上MPの薬」×2・300Gを手に入れた！】',
    type: 'chest',
    reward: { gold: 300, items: ['highMpPotion', 'highMpPotion'] },
  },
  cave_deep: {
    flag: 'ht_cave_deep',
    emoji: '💎', title: '洞窟の隠し宝物庫',
    findText: '壁の不自然な箇所を押すと——\nかたりと音がして隠し扉が開いた！\n\n小さな部屋の中に、輝く宝箱が置かれていた。\n魔法の回復薬と大量の金貨が詰まっている！\n\n【「エリクサー」×1・800Gを手に入れた！】',
    type: 'chest',
    reward: { gold: 800, items: ['elixir'] },
  },
  desert_ruins: {
    flag: 'ht_desert_ruins',
    emoji: '🏺', title: '遺跡の隠し部屋',
    findText: '砂に埋もれた石板の文様を辿っていくと——\n押すと動く石板を発見！\n\n重い石扉が開くと、奥の闇に何かが蠢いている。\n\n【隠し番人「砂の魔人」が現れた！！】\n倒せば稀少な装備が手に入るかもしれない…',
    type: 'enemy',
    enemy: {
      name: '砂の魔人', emoji: '🏺',
      hp: 280, maxHp: 280,
      attack: 45, defense: 18,
      level: 20, exp: 0, gold: 0,
      weakMagic: true,
      skill: { name: '砂嵐の刃', damage: 70, chance: 0.3, msg: '🌪️ 砂嵐の刃が炸裂！' },
    },
    reward: { items: ['guardRing'] },
    rewardText: '砂の魔人の残骸から、頑丈な指輪が現れた！\n\n【「守りの指輪」を手に入れた！】\n（防御+20 アクセサリー）',
  },
  snow_pass: {
    flag: 'ht_snow_pass',
    emoji: '📦', title: '峠道の隠し宝箱',
    findText: '大きな岩の陰に雪とは異なる盛り上がりを発見！\n掘り起こすと——革のケースに包まれた宝箱が！\n\n風の精霊が宿ると言われる靴と、\n凍りついた金貨の山が入っていた。\n\n【「速さの靴」・500Gを手に入れた！】',
    type: 'chest',
    reward: { gold: 500, items: ['speedBoots'] },
  },
  sea_temple: {
    flag: 'ht_sea_temple',
    emoji: '🌊', title: '神殿の隠し宝物庫',
    findText: '壁画の一部が、他と微妙に質感が違う……\n触れると——壁が静かに回転した！\n\n奥の祭壇に、黄金に輝く盾が奉られていた！\n古代の魔法が込められた最高の守りの盾だ。\n\n【「勇者の盾」・1500Gを手に入れた！】',
    type: 'chest',
    reward: { gold: 1500, items: ['heroShield'] },
  },
};

// ============================================================
//  クエストデータ
// ============================================================
const QUEST_DATA = [
  { id: 'q_first_kill', name: '初陣',           emoji: '⚔️',  desc: '初めて魔物を倒す',                       type: 'kill_any',  count: 1,  reward: { gold: 100 } },
  { id: 'q_slime5',     name: 'スライム討伐',   emoji: '🟢',  desc: 'スライムを5体倒す',                      type: 'kill_type', enemy: 'slime', count: 5,  reward: { gold: 300, items: ['highHerb','highHerb'] } },
  { id: 'q_kills10',    name: '魔物10体討伐',   emoji: '💀',  desc: '魔物を合計10体倒す',                     type: 'kill_any',  count: 10, reward: { gold: 500, items: ['guardRing'] } },
  { id: 'q_forest',     name: '森の探索',       emoji: '🌲',  desc: '深い森の奥へ踏み込む',                   type: 'visit',     scene: 'forest_deep',        reward: { gold: 200, items: ['herb','herb'] } },
  { id: 'q_cave_boss',  name: '石の番人討伐',   emoji: '🪨',  desc: '石の番人を倒す',                         type: 'kill_boss', enemy: 'stoneGolem',          reward: { gold: 1000, items: ['elixir'] } },
  { id: 'q_lv10',       name: '冒険者見習い',   emoji: '🌟',  desc: 'レベル10に到達する',                     type: 'reach_level', level: 10,                  reward: { gold: 500, items: ['powerRing'] } },
  { id: 'q_aria_join',  name: '仲間との出会い', emoji: '👫',  desc: 'アリアをパーティに加える',               type: 'flag',      flag: 'ariaJoined',           reward: { gold: 300, items: ['herb','herb','herb'] } },
  { id: 'q_snow_boss',  name: '氷の女王討伐',   emoji: '❄️',  desc: '氷雪の女王アイゼリアを倒す',             type: 'kill_boss', enemy: 'iceQueen',            reward: { gold: 1500, items: ['elixir','highMpPotion'] } },
  { id: 'q_desert_boss',name: 'ファラオ討伐',   emoji: '🏺',  desc: 'ファラオ・ザンデスを倒す',               type: 'kill_boss', enemy: 'sandPharaoh',         reward: { gold: 2000, items: ['elixir','elixir'] } },
  { id: 'q_sea_visit',  name: '海底神殿探索',   emoji: '🌊',  desc: '海底神殿に到達する',                     type: 'visit',     scene: 'sea_temple',          reward: { gold: 1200, items: ['highMpPotion','elixir'] } },
  { id: 'q_sea_boss',   name: '大海蛇討伐',     emoji: '🐲',  desc: '大海蛇レヴィアタンを倒す',               type: 'kill_boss', enemy: 'leviathan',           reward: { gold: 2500, items: ['heroCirclet'] } },
  { id: 'q_kills50',    name: '百戦錬磨',       emoji: '🗡️',  desc: '魔物を合計50体倒す',                     type: 'kill_any',  count: 50, reward: { gold: 3000, items: ['heroShield'] } },
  { id: 'q_lv30',       name: '一流冒険者',     emoji: '👑',  desc: 'レベル30に到達する',                     type: 'reach_level', level: 30,                  reward: { gold: 2000, items: ['elixir','elixir','expCharm'] } },
  { id: 'q_castle',     name: '魔王城侵入',     emoji: '🏰',  desc: '魔王城の城門に到達する',                 type: 'visit',     scene: 'demon_castle_gate',   reward: { gold: 1000, items: ['elixir','elixir'] } },
];

// ============================================================
//  陣形データ
// ============================================================
const FORMATION_DATA = {
  balanced: { name: '均衡陣', emoji: '⚖️', desc: 'バランスの取れた標準陣形。ボーナスなし。',                         reqCompanion: false, bonuses: {} },
  offense:  { name: '突撃陣', emoji: '⚔️', desc: '攻撃力・魔法力+20%、防御力-15%。前衛全力突撃。',                  reqCompanion: true,  bonuses: { atkMult: 1.2, matkMult: 1.2, defMult: 0.85 } },
  defense:  { name: '鉄壁陣', emoji: '🛡️', desc: '防御力+30%、攻撃力・魔法力-10%。堅固な守り。',                    reqCompanion: true,  bonuses: { atkMult: 0.9, matkMult: 0.9, defMult: 1.3  } },
  magic:    { name: '魔導陣', emoji: '🔮', desc: '魔法力+30%、攻撃力・防御力-10%。魔法特化編成。',                   reqCompanion: true,  bonuses: { atkMult: 0.9, matkMult: 1.3, defMult: 0.9  } },
  speed:    { name: '迅速陣', emoji: '💨', desc: '逃走成功率+60%、攻撃力-10%。素早い撤退を重視。',                   reqCompanion: true,  bonuses: { atkMult: 0.9, escBonus: 0.6               } },
};

// ============================================================
//  絆レベル定義
// ============================================================
const BOND_LEVELS = [
  { name: '無関係',     threshold: 0,    atkB: 0,    defB: 0,    matkB: 0    },
  { name: '知人',       threshold: 50,   atkB: 0.05, defB: 0,    matkB: 0    },
  { name: '友人',       threshold: 150,  atkB: 0.05, defB: 0.05, matkB: 0    },
  { name: '親友',       threshold: 350,  atkB: 0.05, defB: 0.05, matkB: 0.05 },
  { name: '盟友',       threshold: 600,  atkB: 0.08, defB: 0.08, matkB: 0.08 },
  { name: '絆',         threshold: 1000, atkB: 0.12, defB: 0.12, matkB: 0.12 },
  { name: '深い絆',     threshold: 1500, atkB: 0.14, defB: 0.14, matkB: 0.14 },
  { name: '親愛',       threshold: 2200, atkB: 0.16, defB: 0.16, matkB: 0.16 },
  { name: '魂の友',     threshold: 3000, atkB: 0.18, defB: 0.18, matkB: 0.18 },
  { name: '永遠の絆',   threshold: 4000, atkB: 0.20, defB: 0.20, matkB: 0.20 },
  { name: '守護者の絆', threshold: 5000, atkB: 0.25, defB: 0.25, matkB: 0.25 },
];

// ============================================================
//  称号データ
// ============================================================
const TITLE_DATA = [
  {
    id: 't_slime_hunter', name: 'スライム狩人', emoji: '🟢',
    desc: 'スライムを100体倒した',
    check: () => (gs.monsterBook?.slime?.kills || 0) >= 100,
    bonus: { gold: 5000, atk: 5 },
    bonusDesc: '💰5000G、⚔️ATK+5',
  },
  {
    id: 't_veteran', name: '百戦錬磨', emoji: '⚔️',
    desc: '戦闘回数が100回を超えた',
    check: () => (gs.totalBattles || 0) >= 100,
    bonus: { gold: 3000, def: 5 },
    bonusDesc: '💰3000G、🛡️DEF+5',
  },
  {
    id: 't_demon_slayer', name: '魔王の天敵', emoji: '👿',
    desc: '魔王ダークロスを倒した',
    check: () => !!(gs.monsterBook?.demonKing?.kills),
    bonus: { gold: 10000, atk: 20, def: 10, matk: 20 },
    bonusDesc: '💰10000G、ATK+20、DEF+10、MATK+20',
  },
  {
    id: 't_guardian', name: '守護者', emoji: '🛡️',
    desc: 'ガイアスとの絆レベルが10になった',
    check: () => getBondLevel('gaius') >= 10,
    bonus: { gold: 5000, def: 15 },
    bonusDesc: '💰5000G、🛡️DEF+15',
  },
  {
    id: 't_millionaire', name: '大富豪', emoji: '💰',
    desc: '所持金が100000Gを超えた',
    check: () => (gs.player?.gold || 0) >= 100000,
    bonus: { gold: 0, matk: 8 },
    bonusDesc: '✨MATK+8',
  },
  {
    id: 't_grand_mage', name: '魔法使いの極み', emoji: '✨',
    desc: '全ての魔法・スキルを1度以上使用した',
    check: () => ['magic','guard','ironwall','palpunte','meteor','timestop','reflect','drain','teleport','ultima','berserk','confuse','bigbang'].every(s => gs.usedSkills?.[s]),
    bonus: { gold: 5000, matk: 15 },
    bonusDesc: '💰5000G、✨MATK+15',
  },
  {
    id: 't_collector', name: 'コレクター', emoji: '📖',
    desc: 'モンスター図鑑を全て埋めた',
    check: () => Object.keys(ENEMY_DATA).every(id => (gs.monsterBook?.[id]?.kills || 0) > 0),
    bonus: { gold: 8000, atk: 10, def: 10, matk: 10 },
    bonusDesc: '💰8000G、全ステータス+10',
  },
  {
    id: 't_invincible', name: '無敵の勇者', emoji: '👑',
    desc: 'レベル99に到達した',
    check: () => (gs.player?.level || 0) >= 99,
    bonus: { gold: 10000, atk: 30, def: 30, matk: 30 },
    bonusDesc: '💰10000G、全ステータス+30',
  },
  {
    id: 't_explorer', name: '探索家', emoji: '🗺️',
    desc: '全エリアを訪れた',
    check: () => WARP_DESTINATIONS.every(d => gs.flags?.[d.flag]),
    bonus: { gold: 5000, atk: 5, def: 5, matk: 5 },
    bonusDesc: '💰5000G、全ステータス+5',
  },
  {
    id: 't_smith', name: '鍛冶の達人', emoji: '⚒️',
    desc: '装備を+10まで強化した',
    check: () => Object.values(gs.player?.enhancements || {}).some(v => v >= 10),
    bonus: { gold: 3000, atk: 8, def: 8, matk: 8 },
    bonusDesc: '💰3000G、全ステータス+8',
  },
  {
    id: 't_god_dragon_slayer', name: '神龍討伐者', emoji: '🐉',
    desc: '神龍ゴッドドラゴンを倒した',
    check: () => !!(gs.monsterBook?.godDragon?.kills),
    bonus: { gold: 50000, atk: 50, def: 30, matk: 50 },
    bonusDesc: '💰50000G、ATK+50、DEF+30、MATK+50',
  },
  {
    id: 't_complete_conquest', name: '完全制覇', emoji: '👑',
    desc: '隠しボス3体（神龍・バアル・ヴォイド）を全員倒した',
    check: () => !!(gs.monsterBook?.godDragon?.kills) && !!(gs.monsterBook?.ancientBaal?.kills) && !!(gs.monsterBook?.voidWarden?.kills),
    bonus: { gold: 100000, atk: 100, def: 100, matk: 100 },
    bonusDesc: '💰100000G、全ステータス+100',
  },
  {
    id: 't_endless_warrior', name: '無限の戦士', emoji: '♾️',
    desc: '無限の試練で50波を突破した',
    check: () => (gs.endlessTrialMaxWave || 0) >= 50,
    bonus: { gold: 30000, atk: 30, def: 30, matk: 30 },
    bonusDesc: '💰30000G、全ステータス+30',
  },
  {
    id: 't_true_hero', name: '真の勇者', emoji: '🌟',
    desc: '全ての称号を取得した',
    check: () => TITLE_DATA.filter(t => t.id !== 't_true_hero').every(t => !!(gs.titles?.[t.id]?.obtained)),
    bonus: { gold: 99999, atk: 50, def: 50, matk: 50, hp: 200 },
    bonusDesc: '💰99999G、全ステータス+50、HP+200',
  },
];

// ============================================================
//  錬金術レシピデータ
// ============================================================
const ALCHEMY_RECIPES = [
  { id: 'r_high_herb',  name: '上薬草の調合',     result: 'highHerb',   resultCount: 2, ingredients: { herb: 3 },                       known: true,  desc: '薬草3個 → 上薬草2個' },
  { id: 'r_elixir',     name: 'エリクサー錬成',   result: 'elixir',     resultCount: 1, ingredients: { highHerb: 1, mpPotion: 1 },       known: true,  desc: '上薬草＋MPの薬 → エリクサー' },
  { id: 'r_hero_charm', name: '勇者のお守り錬成', result: 'heroCharm',  resultCount: 1, ingredients: { powerRing: 1, magicNecklace: 1 }, known: false, desc: '力の指輪＋魔力の首飾り → 勇者のお守り' },
  { id: 'r_guard_helm', name: '守護の兜錬成',     result: 'guardHelm',  resultCount: 1, ingredients: { ironHelmet: 1, guardRing: 1 },   known: false, desc: '鉄の兜＋守りの指輪 → 守護の兜' },
  { id: 'r_miracle',    name: '奇跡の薬調合',     result: 'miracleDrug',resultCount: 1, ingredients: { phoenixFeather: 1, elixir: 1 },  known: false, desc: 'フェニックスの羽＋エリクサー → 奇跡の薬' },
];

// ============================================================
//  モンスター素材ドロップテーブル
// ============================================================
const MATERIAL_DROPS = {
  slime:        { material: 'slimeGel',     rate: 0.35 },
  poisonSlime:  { material: 'slimeGel',     rate: 0.35 },
  poisonFrog:   { material: 'slimeGel',     rate: 0.2  },
  forestWolf:   { material: 'wolfFang',     rate: 0.35 },
  snowWolf:     { material: 'wolfFang',     rate: 0.35 },
  goblin:       { material: 'wolfFang',     rate: 0.15 },
  snowFairy:    { material: 'iceCrystal',   rate: 0.3  },
  iceGolem:     { material: 'iceCrystal',   rate: 0.4  },
  yeti:         { material: 'iceCrystal',   rate: 0.3  },
  iceQueen:     { material: 'iceCrystal',   rate: 1.0  },
  sandScorpion: { material: 'sandCore',     rate: 0.35 },
  mummy:        { material: 'sandCore',     rate: 0.3  },
  fireElemental:{ material: 'sandCore',     rate: 0.25 },
  desertBandit: { material: 'sandCore',     rate: 0.2  },
  sandPharaoh:  { material: 'sandCore',     rate: 1.0  },
  seaSerpent:   { material: 'deepSeaScale', rate: 0.35 },
  deepAngler:   { material: 'deepSeaScale', rate: 0.3  },
  krakenArm:    { material: 'deepSeaScale', rate: 0.4  },
  darkMermaid:  { material: 'deepSeaScale', rate: 0.3  },
  leviathan:    { material: 'deepSeaScale', rate: 1.0  },
  demon:        { material: 'demonHorn',    rate: 0.2  },
  darkKnight:   { material: 'demonHorn',    rate: 0.25 },
  cursedSoul:   { material: 'demonHorn',    rate: 0.2  },
  demonLord:    { material: 'demonHorn',    rate: 1.0  },
  demonKing:    { material: 'demonHorn',    rate: 1.0  },
};

// ============================================================
//  特殊強化（素材エンチャント）定義
// ============================================================
const ENCHANT_DATA = {
  poison_seal:   { name: '毒付与の刻印',    emoji: '☠️',  material: 'slimeGel',     matCount: 3, cost: 500,  desc: '物理攻撃時25%で敵に毒付与',              slot: 'weapon',    effect: 'poison_atk' },
  critical_seal: { name: '鋭撃の刻印',      emoji: '⚡',  material: 'wolfFang',     matCount: 3, cost: 600,  desc: '物理攻撃時20%でクリティカル(1.8×)',       slot: 'weapon',    effect: 'crit_bonus' },
  ice_guard:     { name: '氷結守護の刻印',  emoji: '🔷',  material: 'iceCrystal',   matCount: 2, cost: 700,  desc: '全DEF+20追加ボーナス',                   slot: 'armor',     bonus: { def: 20 } },
  sand_ward:     { name: '砂の守護の刻印',  emoji: '🟠',  material: 'sandCore',     matCount: 2, cost: 800,  desc: '全ATK・DEF・MATK+10追加ボーナス',        slot: 'armor',     bonus: { atk: 10, def: 10, matk: 10 } },
  sea_power:     { name: '深海の刻印',       emoji: '🐟',  material: 'deepSeaScale', matCount: 2, cost: 1000, desc: '全ATK・MATK+15追加ボーナス',             slot: 'any',       bonus: { atk: 15, matk: 15 } },
  demon_power:   { name: '魔王の刻印',       emoji: '👿',  material: 'demonHorn',    matCount: 1, cost: 2000, desc: '全ステータス+25追加ボーナス',             slot: 'any',       bonus: { atk: 25, def: 25, matk: 25 } },
};

// ============================================================
//  コンボ必殺技データ
// ============================================================
const COMBO_DATA = [
  {
    id: 'hero_aria',
    name: '勇者と剣士の誓い',
    emoji: '⚔️',
    members: 'アレク＋アリア',
    desc: '2人同時攻撃・大ダメージ＋3ターン攻撃力1.5倍',
    mpCost: 'アレク30・アリア30',
    performance: '二人の剣が光り輝く！',
    conditionDesc: 'アリアとの絆Lv5以上',
    check() {
      if (getBondLevel('aria') < 5) return { ok: false, reason: 'アリア絆Lv5必要' };
      if (!gs.companion?.joined || gs.companion?.hp <= 0) return { ok: false, reason: 'アリアが戦闘不能' };
      if (gs.player.mp < 30) return { ok: false, reason: 'アレクのMP不足(30)' };
      if ((gs.companion?.mp || 0) < 30) return { ok: false, reason: 'アリアのMP不足(30)' };
      return { ok: true };
    },
  },
  {
    id: 'hero_zephiros',
    name: '剣と魔法の融合',
    emoji: '🔮',
    members: 'アレク＋ゼフィロス',
    desc: '通常の5倍・属性無視・防御無視の超一撃',
    mpCost: 'アレク20・ゼフィロス50',
    performance: '魔力を纏った剣が敵を貫く！',
    conditionDesc: 'ゼフィロスとの絆Lv5以上',
    check() {
      const z = gs.companions?.zephiros;
      if (getBondLevel('zephiros') < 5) return { ok: false, reason: 'ゼフィロス絆Lv5必要' };
      if (!z?.joined || z?.hp <= 0) return { ok: false, reason: 'ゼフィロスが戦闘不能' };
      if (gs.player.mp < 20) return { ok: false, reason: 'アレクのMP不足(20)' };
      if ((z?.mp || 0) < 50) return { ok: false, reason: 'ゼフィロスのMP不足(50)' };
      return { ok: true };
    },
  },
  {
    id: 'aria_serafina',
    name: '聖剣と癒しの光',
    emoji: '✨',
    members: 'アリア＋セラフィナ',
    desc: 'アリアが全体攻撃・セラフィナが全体回復',
    mpCost: 'アリア25・セラフィナ25',
    performance: '聖なる光が剣に宿り、仲間を包む！',
    conditionDesc: 'アリア・セラフィナ絆Lv5以上',
    check() {
      const s = gs.companions?.serafina;
      if (getBondLevel('aria') < 5) return { ok: false, reason: 'アリア絆Lv5必要' };
      if (getBondLevel('serafina') < 5) return { ok: false, reason: 'セラフィナ絆Lv5必要' };
      if (!gs.companion?.joined || gs.companion?.hp <= 0) return { ok: false, reason: 'アリアが戦闘不能' };
      if (!s?.joined || s?.hp <= 0) return { ok: false, reason: 'セラフィナが戦闘不能' };
      if ((gs.companion?.mp || 0) < 25) return { ok: false, reason: 'アリアのMP不足(25)' };
      if ((s?.mp || 0) < 25) return { ok: false, reason: 'セラフィナのMP不足(25)' };
      return { ok: true };
    },
  },
  {
    id: 'gaius_serafina',
    name: '鋼鉄の聖域',
    emoji: '🛡️',
    members: 'ガイアス＋セラフィナ',
    desc: '5ターン全被ダメ50%軽減＋毎ターンHP回復',
    mpCost: 'ガイアス30・セラフィナ30',
    performance: 'ガイアスの盾とセラフィナの光が聖域を作り出す！',
    conditionDesc: 'ガイアス・セラフィナ絆Lv5以上',
    check() {
      const g = gs.companions?.gaius;
      const s = gs.companions?.serafina;
      if (getBondLevel('gaius') < 5) return { ok: false, reason: 'ガイアス絆Lv5必要' };
      if (getBondLevel('serafina') < 5) return { ok: false, reason: 'セラフィナ絆Lv5必要' };
      if (!g?.joined || g?.hp <= 0) return { ok: false, reason: 'ガイアスが戦闘不能' };
      if (!s?.joined || s?.hp <= 0) return { ok: false, reason: 'セラフィナが戦闘不能' };
      if ((g?.mp || 0) < 30) return { ok: false, reason: 'ガイアスのMP不足(30)' };
      if ((s?.mp || 0) < 30) return { ok: false, reason: 'セラフィナのMP不足(30)' };
      return { ok: true };
    },
  },
  {
    id: 'luna_sola',
    name: '双子の星爆',
    emoji: '🌙',
    members: 'ルナ＋ソラ',
    desc: '全体超大ダメージ＋敵弱体化＋パーティ全強化',
    mpCost: 'ルナ40・ソラ40',
    performance: '月と星の力が合わさり、爆発的なエネルギーが解き放たれる！',
    conditionDesc: 'ルナ・ソラ絆Lv5以上',
    check() {
      const l = gs.companions?.luna;
      const so = gs.companions?.sola;
      if (getBondLevel('luna') < 5) return { ok: false, reason: 'ルナ絆Lv5必要' };
      if (getBondLevel('sola') < 5) return { ok: false, reason: 'ソラ絆Lv5必要' };
      if (!l?.joined || l?.hp <= 0) return { ok: false, reason: 'ルナが戦闘不能' };
      if (!so?.joined || so?.hp <= 0) return { ok: false, reason: 'ソラが戦闘不能' };
      if ((l?.mp || 0) < 40) return { ok: false, reason: 'ルナのMP不足(40)' };
      if ((so?.mp || 0) < 40) return { ok: false, reason: 'ソラのMP不足(40)' };
      return { ok: true };
    },
  },
  {
    id: 'all_ultimate',
    name: '勇者パーティ究極奥義',
    emoji: '🌟',
    members: '全員',
    desc: '全体最強ダメージ＋パーティ全員HP/MP完全回復',
    mpCost: '全員50ずつ',
    performance: '仲間全員の力が一つになった！伝説の奥義が発動する！！',
    conditionDesc: '全仲間絆Lv8以上・全員パーティ在籍・1バトル1回',
    check() {
      if (gs.comboUsedThisBattle) return { ok: false, reason: '1バトル1回限り（使用済み）' };
      const allIds = ['aria','gaius','luna','sola','serafina','zephiros'];
      for (const id of allIds) {
        if (getBondLevel(id) < 8) return { ok: false, reason: `${id}の絆Lv8必要` };
        if (id === 'aria') {
          if (!gs.companion?.joined || gs.companion?.hp <= 0) return { ok: false, reason: 'アリアが戦闘不能' };
          if ((gs.companion?.mp || 0) < 50) return { ok: false, reason: 'アリアのMP不足(50)' };
        } else {
          const c = gs.companions?.[id];
          if (!c?.joined || c?.hp <= 0) return { ok: false, reason: `${c?.name || id}が戦闘不能` };
          if ((c?.mp || 0) < 50) return { ok: false, reason: `${c?.name || id}のMP不足(50)` };
        }
      }
      if (gs.player.mp < 50) return { ok: false, reason: 'アレクのMP不足(50)' };
      return { ok: true };
    },
  },
];

// ============================================================
//  属性データ定義
// ============================================================
const ELEMENT_DATA = {
  fire:    { name: '火',   emoji: '🔥' },
  ice:     { name: '氷',   emoji: '❄️' },
  thunder: { name: '雷',   emoji: '⚡' },
  wind:    { name: '風',   emoji: '🌿' },
  light:   { name: '光',   emoji: '☀️' },
  dark:    { name: '闇',   emoji: '🌑' },
  none:    { name: '無',   emoji: '⚔️' },
};

// ============================================================
//  ストーリーシーン定義
// ============================================================
const SCENES = {

  intro: {
    emoji: '🌅', title: '序章 〜運命の始まり〜', location: '',
    text: `かつてこの大地は、光と平和に満ちていた。\n\nしかし一年前、闇の魔王「ダークロス」が王国に侵攻を開始した。\n村々は焼かれ、人々は嘆き、希望は闇に飲み込まれようとしていた。\n\n君の名は「アレク」——村で育った若き冒険者。\n剣の師匠が旅立ちの前夜、こう言った。\n\n「アレク...お前には特別な力が宿っている。\nその力が何かは、旅の中で必ず分かるだろう」\n\n——そして今、君は魔王討伐の旅へ出発しようとしている。`,
    choices: [
      { text: '→ 旅を始める', next: 'village' }
    ]
  },

  village: {
    emoji: '🏘️', title: '出発の村「ライトン」', location: '出発の村',
    text: `君が育った小さな村「ライトン」。\n\n村人たちが心配そうに見守る中、旅の準備を進めている。\n北には「深い森」が広がり、その先に洞窟、そして魔王城があると言われている。\n\n出発前に準備をしておこう。`,
    onEnter: 'town_desc_village',
    choices: [
      { text: '🏪 道具屋「ジョブの店」へ入る', next: 'shop' },
      { text: '⚒️ 鍛冶屋「ハンマー工房」へ入る', next: 'village_smith' },
      { text: '🧪 錬金術師「マルク」の工房へ', next: 'village_alchemist' },
      { text: '🍺 酒場「竜の牙」で情報を集める', next: 'tavern' },
      { text: '🧓 長老ホワイト翁に会いに行く', next: 'village_elder' },
      { text: '🏨 宿屋「赤い月亭」で休む（100G）', action: 'inn_rest_village', needFlag: '!townDevVillage2' },
      { text: '🏨 宿屋「英雄の間」で休む（無料）', action: 'inn_free_village', needFlag: 'townDevVillage2' },
      { text: '🗡️ 伝説の武器屋へ', next: 'village_legend_shop', needFlag: 'townDevVillage5' },
      { text: '🐴 厩舎へ行く', next: 'village_stable' },
      { text: '🎰 幻想ガチャ屋台', action: 'open_gacha' },
      { text: '🏗️ 村に投資する', next: 'town_invest_village' },
      { text: '⚔️ レベリングスポット一覧', next: 'leveling_hub', needLevel: 10 },
      { text: '🚶 村を出発する（北の森へ向かう）', next: 'village_gate' },
    ]
  },

  shop: {
    emoji: '🏪', title: '道具屋「ジョブの店」', location: '出発の村',
    type: 'shop', shopId: 'village_shop', backScene: 'village',
    text: `「いらっしゃい！旅の準備はできてるかい？\n良いものを揃えてるよ。何でも聞いてくれ！」\n\n老店主のジョブが笑顔で迎えてくれた。`,
    choices: []
  },

  village_smith: {
    emoji: '⚒️', title: '鍛冶屋「ハンマー工房」', location: '出発の村',
    type: 'smith', backScene: 'village',
    text: `武骨な職人・ガルドが鉄槌を置いて振り返った。\n\n「強化してやろうか？装備を鍛えれば、戦いはずっと楽になるぞ。\n＋1から強化できるが、段階が上がるほど失敗しやすくなる。\n失敗すると強化値が1段階下がるから気をつけろ」`,
    choices: []
  },

  tavern: {
    emoji: '🍺', title: '酒場「竜の牙」', location: '出発の村',
    text: `薄暗い酒場の中。荒くれ者の冒険者たちが酒を飲んでいる。\n\n奥のテーブルに白髪の老冒険者が一人で座っていた。\n手招きされた。`,
    choices: [
      { text: '🧙 老冒険者の話を聞く', next: 'tavern_veteran' },
      { text: '↩️ 村に戻る', next: 'village' },
    ]
  },

  tavern_veteran: {
    emoji: '🧙', title: '酒場「竜の牙」', location: '出発の村',
    text: `老冒険者が低い声で話しかけてきた。\n\n「魔王城を目指すなら、まず北の森を抜けろ。森の魔物は手強いが、\n先に進めば洞窟があるはずだ」\n\n「洞窟には「石の番人」が守りについてる。\nあいつには魔法が効く——物理攻撃はほとんど通じないぞ」\n\n「最後に一つ——魔王の弱点は「光の魔法」だ。\n魔法は惜しみなく使え」`,
    choices: [
      { text: '🗺️ もっと詳しく聞く', next: 'tavern_veteran2' },
      { text: '↩️ 村に戻る', next: 'village' },
    ]
  },

  tavern_veteran2: {
    emoji: '🧙', title: '酒場「竜の牙」', location: '出発の村',
    text: `老冒険者は一口酒を飲んでから続けた。\n\n「洞窟の番人を倒せば「魔王城の鍵」が手に入る。\nその鍵がないと城の門は開かない」\n\n「それと——洞窟の右の通路には宝がある。左は罠があるから気をつけろ」\n\n「魔王城の図書室にも有益な情報があると聞いた。\n焦らずに調べながら進むといい」\n\n老冒険者はそう言ってまた黙り込んだ。`,
    choices: [
      { text: '↩️ 村に戻る', next: 'village' },
    ]
  },

  village_gate: {
    emoji: '🚪', title: '村の北門', location: '出発の村',
    text: `村の北門に立った。\n\n門番のロバートが心配そうに声をかけてくる。\n\n「アレク...本当に行くのか？\n魔王城は普通の人間が辿り着けるような場所じゃないぞ。\nどうか気をつけてくれ」\n\n北に続く道の向こうに、深い森の影が見える。\n\n——旅が始まる。`,
    choices: [
      { text: '🌲 森へ向かう', next: 'forest_entrance' },
      { text: '↩️ 村に戻る', next: 'village' },
    ]
  },

  forest_entrance: {
    emoji: '🌲', title: '深い森 入口', location: '深い森',
    text: `鬱蒼とした森の入口に足を踏み入れた。\n\n木々の間から差し込む光も少なく、薄暗い。\n遠くから魔物のうなり声が聞こえてくる。\n\n右奥にはまっすぐ続く獣道と、\n左手には小さな脇道がある。`,
    choices: [
      { text: '🛤️ 森の奥へ進む', next: 'forest_deep', encounterArea: 'forest', encounterRate: 0.65 },
      { text: '🌿 脇道を確認してみる', next: 'forest_spring' },
    ]
  },

  forest_spring: {
    emoji: '💧', title: '精霊の泉', location: '深い森',
    text: `脇道の先には、小さな泉があった。\n\n澄んだ水が静かに湛えられ、不思議な輝きを放っている。\n精霊の泉だろうか——飲んでみると、\n身体に活力が戻ってきた！\n\n【HPが全回復した！】`,
    onEnter: 'healing_spring',
    choices: [
      { text: '🛤️ 森の奥へ進む', next: 'forest_deep', encounterArea: 'forest', encounterRate: 0.65 },
    ]
  },

  forest_deep: {
    emoji: '🌳', title: '深い森', location: '深い森',
    text: `森の奥へと進んだ。\n\n大きな木の根が道を阻み、先へ進むのに苦労する。\n魔物の気配が濃くなってきた。\n\n木々の隙間から煙が立ち昇っているのが見える——\n誰かの家だろうか？\nさらに奥には大きな岩山の影も見える。`,
    choices: [
      { text: '🏠 煙の方へ向かう（隠者の小屋？）', next: 'hermit_hut' },
      { text: '⛰️ 岩山の方へ進む（洞窟へ）', next: 'cave_approach', encounterArea: 'forest', encounterRate: 0.5 },
    ]
  },

  hermit_hut: {
    emoji: '🏚️', title: '隠者の小屋', location: '深い森',
    text: `古びた小屋のドアをノックすると、白髪の老人が顔を出した。\n\n「おや、若い冒険者さんじゃないか。\n私はサラスという隠者だよ。久しぶりに人が来たね」\n\n老人はしばらく考えてから、棚から古びた杖を取り出した。\n\n「これをあげよう。昔、偉大な魔法使いが使っていた杖だ。\n今のお前にきっと役立つはずだよ」\n\n【「古い魔法の杖」を手に入れた！】（魔法力+10）`,
    onEnter: 'give_staff',
    choices: [
      { text: '🪄 杖を装備する', action: 'equip_staff', next: 'hermit_after_equip' },
      { text: '↩️ 礼を言って去る', next: 'cave_approach' },
    ]
  },

  hermit_after_equip: {
    emoji: '🏚️', title: '隠者の小屋', location: '深い森',
    text: `「古い魔法の杖」を装備した！\n\nサラスが微笑んで言った。\n\n「その杖はアンデッドと石の番人に特に良く効く。\n洞窟では積極的に魔法を使うといい」\n\n「気をつけて行くんだよ、勇者さん」`,
    choices: [
      { text: '⛰️ 洞窟へ向かう', next: 'cave_approach' },
    ]
  },

  cave_approach: {
    emoji: '⛰️', title: '洞窟への道', location: '深い森',
    text: `森を抜けると、巨大な岩山が目の前にそびえ立っていた。\n\n岩山の麓に洞窟の入口がある。\n入口の脇に古い石碑が立っており、こう刻まれていた。\n\n「闇を越えた者のみ、光に至る」\n\n洞窟から冷たい風と強い魔力の気配がする。`,
    choices: [
      { text: '🕯️ 洞窟に踏み込む', next: 'cave_entrance' },
      { text: '↩️ 森に戻る', next: 'forest_deep' },
    ]
  },

  cave_entrance: {
    emoji: '🕯️', title: '暗黒の洞窟 入口', location: '暗黒の洞窟',
    text: `洞窟の中は暗く、持参した松明に火をつけた。\n\n壁に石で刻まれた文字が浮かびあがる。\n「ここから先は番人の領域——入ること勿れ」\n\n突き当たりで道が二つに分かれている。\n右の通路と左の通路——どちらへ進む？`,
    choices: [
      { text: '→ 右の通路へ進む', next: 'cave_right', encounterArea: 'cave', encounterRate: 0.4 },
      { text: '← 左の通路へ進む', next: 'cave_left', encounterArea: 'cave', encounterRate: 0.5 },
    ]
  },

  cave_right: {
    emoji: '💎', title: '暗黒の洞窟 右通路', location: '暗黒の洞窟',
    text: `右の通路を慎重に進んだ。\n\n少し広い部屋に出ると、古い宝箱が置かれていた。\n\n——中を開けると、キラキラと輝く宝石が！\n\n【「魔法の宝石」を手に入れた！】\n（魔王に一度だけ80ダメージを与えられる）\n\nさらに奥へ進むと、左通路と合流する場所に出た。`,
    onEnter: 'give_gemstone',
    choices: [
      { text: '🕯️ 洞窟の奥へ進む', next: 'cave_deep', encounterArea: 'cave', encounterRate: 0.5 },
    ]
  },

  cave_left: {
    emoji: '⚠️', title: '暗黒の洞窟 左通路', location: '暗黒の洞窟',
    text: `左の通路を進んでいくと、突然足元が崩れた！\n\n咄嗟に壁に手をついて転落を免れたが、\n腕に擦り傷を負ってしまった。\n\n【罠！HPが15減った！】\n\n通路の壁に落書きがあった。\n「右の通路に宝あり。左は罠だ——後悔している冒険者より」\n\n進むと右通路と合流する地点に出た。`,
    onEnter: 'cave_trap_damage',
    choices: [
      { text: '🕯️ 洞窟の奥へ進む', next: 'cave_deep', encounterArea: 'cave', encounterRate: 0.5 },
    ]
  },

  cave_deep: {
    emoji: '🦇', title: '暗黒の洞窟 深部', location: '暗黒の洞窟',
    text: `洞窟の深部に辿り着いた。\n\n天井から無数のコウモリが吊り下がっている。\n地面には古い骨が散乱している——\nここで命を落とした冒険者たちの証だ。\n\n奥から重い足音が響いてくる。\n壁が微かに揺れている...`,
    choices: [
      { text: '⚔️ 奥へ進む（番人との決戦！）', next: 'cave_boss_intro' },
      { text: '↩️ 洞窟入口まで戻る', next: 'cave_entrance' },
    ]
  },

  cave_boss_intro: {
    emoji: '🪨', title: '暗黒の洞窟 最深部', location: '暗黒の洞窟',
    text: `広大な空洞に足を踏み入れた瞬間——\n\n巨大な石の像が動き出した！\n地響きと共に石の番人が立ち塞がる！\n\n「......侵入者よ。\nここから先は通さぬ。\n魔王様の命により、貴様を排除する！」\n\n石の巨人が拳を振り上げた！\n\n⚡ 「石の番人」との決戦！\n※魔法攻撃が有効！物理攻撃は通りにくい！`,
    choices: [
      { text: '⚔️ 戦う！！', action: 'fight_boss_golem' },
      { text: '💨 引き返す', next: 'cave_deep' },
    ]
  },

  cave_boss_defeated: {
    emoji: '🗝️', title: '石の番人 撃破！', location: '暗黒の洞窟',
    text: `石の番人を倒した！！\n\n崩れ落ちた石の塊の中から、眩く光る鍵が転がり出てきた。\n\n【「魔王城の鍵」を手に入れた！】\n\n番人の声が遠くなっていく。\n「な...なぜだ...まさか私が...若者よ...お前は本物の...勇者...」\n\n声が消え、洞窟が静寂に包まれた。\n鍵を握りしめ、前を向いた。\n\n洞窟の出口の先、道が大きく四手に分かれているのが見えた。`,
    onEnter: 'give_castle_key',
    choices: [
      { text: '⛰️ 北の雪山を目指す', next: 'crossroads_snow' },
      { text: '🏜️ 東の砂漠を目指す', next: 'crossroads_desert' },
      { text: '⚓ 南の港町を目指す（隠しエリア）', next: 'sea_harbor' },
      { text: '🌑 まっすぐ魔王城へ向かう', next: 'demon_road' },
    ]
  },

  crossroads_snow: {
    emoji: '🗺️', title: '三叉路', location: '魔王城への道',
    text: `洞窟を出ると、北に向かう山道がある。\n\n冷たい風が吹き下ろしてくる——雪山だ。\n吟遊詩人の歌にあった「氷雪の女王の城」がそこにあるという。\nなんでも、強力な武器を守っているとか。\n\n雪山は過酷だが、先へ進む力になるはずだ。`,
    choices: [
      { text: '❄️ 雪山へ向かう', next: 'snow_entrance' },
      { text: '↩️ 引き返す（三叉路へ）', next: 'cave_boss_defeated' },
    ]
  },

  crossroads_desert: {
    emoji: '🗺️', title: '三叉路', location: '魔王城への道',
    text: `洞窟を出ると、東へ続く乾いた大地が広がっている。\n\n灼熱の砂漠——古代文明の遺跡が眠る場所だという。\n行商人の話では、砂漠の深部に強力な敵が潜んでいるとか。\n\n試練は多いが、それに見合う力が得られるはずだ。`,
    choices: [
      { text: '🏜️ 砂漠へ向かう', next: 'desert_entrance' },
      { text: '↩️ 引き返す（三叉路へ）', next: 'cave_boss_defeated' },
    ]
  },

  // ============================================================
  //  雪山エリア
  // ============================================================

  snow_entrance: {
    emoji: '🏔️', title: '雪山の麓', location: '雪山',
    text: `山道を登ると、世界が白一色に変わった。\n\n足元の雪がざくざくと鳴り、吐く息が白い。\n遠くには雪煙が舞い、魔物たちのうなり声が響く。\n\n麓の小屋から光が漏れていた。\n旅人か、それとも地元の人間か——`,
    choices: [
      { text: '🏠 小屋に立ち寄る', next: 'snow_village' },
      { text: '🏔️ 山道を直接進む', next: 'snow_pass', encounterArea: 'snow', encounterRate: 0.6 },
    ]
  },

  snow_village: {
    emoji: '🏘️', title: '雪山の集落', location: '雪山',
    text: `小さな集落だった。毛皮を纏った人々が厳しい顔をしている。\n\n「あんた、冒険者か？\nこの先に氷雪の女王の城がある。近づく者は皆凍り付く。\n装備を整えてから行くことをお勧めするよ」`,
    onEnter: 'town_desc_snow',
    choices: [
      { text: '🏪 道具屋に入る', next: 'snow_village_shop' },
      { text: '⚒️ 鍛冶屋に入る', next: 'snow_smith' },
      { text: '🧪 錬金術師の小屋へ', next: 'snow_alchemist' },
      { text: '🏨 宿屋で休む（200G）', action: 'inn_rest_snow' },
      { text: '🗡️ スキル鍛錬所へ', next: 'snow_skill_forge_scene', needFlag: 'townDevSnow3' },
      { text: '🔮 召喚師のテントへ', next: 'snow_summon_tent_scene', needFlag: 'townDevSnow4' },
      { text: '🧊 氷の秘密ダンジョンへ', next: 'snow_ice_dungeon', needFlag: 'townDevSnow5' },
      { text: '🏗️ 集落に投資する', next: 'town_invest_snow' },
      { text: '↩️ 雪山の麓に戻る', next: 'snow_entrance' },
    ]
  },

  snow_village_shop: {
    emoji: '🏪', title: '雪山の道具屋', location: '雪山',
    type: 'shop', shopId: 'snow_shop', backScene: 'snow_village',
    text: `「よく来たな。雪山を越えるなら、これだけは持っていけ」\n\n防寒装備や回復薬を揃えている。`,
    choices: []
  },

  snow_smith: {
    emoji: '⚒️', title: '雪山の鍛冶屋', location: '雪山',
    type: 'smith', backScene: 'snow_village',
    text: `鍛冶師のブレアが凍てついた炉の前に立っていた。\n\n「ここまで来たなら本物の装備が必要だろう。\n鍛えてやる——ただし、高レベルの強化は失敗することもある。\n覚悟しておけ」`,
    choices: []
  },

  // ============================================================
  //  錬金術師NPC
  // ============================================================

  village_alchemist: {
    emoji: '🧪', title: '錬金術師「マルク」の工房', location: '出発の村',
    type: 'alchemy', backScene: 'village',
    text: `村の外れにある小さな工房。\n壁一面に薬瓶や鉱石が並び、独特の匂いが漂っている。\n\n白衣の老人・マルクが顔を上げた。\n\n「おお、冒険者か！\nわしは錬金術師のマルクじゃ。\nアイテムを組み合わせて、新しいものを作ることができるよ。\nさて、何を作ってみる？」`,
    choices: []
  },

  snow_alchemist: {
    emoji: '🧪', title: '錬金術師の小屋', location: '雪山',
    type: 'alchemy', backScene: 'snow_village',
    text: `集落の端にある古びた小屋。\n煙突からは青白い煙が上がっている。\n\n中に入ると、フード姿の錬金術師が振り返った。\n\n「雪山の厳しさが素材を鍛えるんじゃよ。\nアイテムを組み合わせてみなさい——\n思わぬものができるかもしれないよ」`,
    choices: []
  },

  desert_alchemist: {
    emoji: '🧪', title: '旅の錬金術師', location: '砂漠',
    type: 'alchemy', backScene: 'desert_oasis',
    text: `オアシスの木陰に旅の錬金術師が荷を広げていた。\n\n「砂漠には貴重な素材が眠ってるんだ。\n組み合わせ次第で、すごいものができるよ。\n何か作ってみるかい？」`,
    choices: []
  },

  sea_alchemist: {
    emoji: '🧪', title: '錬金術師の隠し工房', location: '南の港町',
    type: 'alchemy', backScene: 'sea_harbor',
    text: `港の一角にある隠し扉を押すと——\n奥に秘密の工房があった！\n\n老錬金術師が複雑な実験装置の前に立っている。\n\n「深海の素材は特別じゃ。\n組み合わせれば、伝説の逸品が生まれることもある——\nさ、試してみなさい」`,
    choices: []
  },

  snow_pass: {
    emoji: '❄️', title: '雪山の峠道', location: '雪山',
    text: `峠道は吹雪と魔物で満ちていた。\n\n前が見えないほどの猛吹雪の中、\n一歩一歩踏みしめながら進む。\n\n吹雪が少し収まると、前方に二手の道があった。\n左は切り立った崖沿いの細道。\n右は雪に埋もれた洞窟の入口。`,
    choices: [
      { text: '🧗 崖沿いの細道を進む', next: 'snow_cliff', encounterArea: 'snow', encounterRate: 0.55 },
      { text: '🕯️ 雪の洞窟へ入る', next: 'snow_cave', encounterArea: 'snow', encounterRate: 0.45 },
    ]
  },

  snow_cliff: {
    emoji: '🧗', title: '崖沿いの細道', location: '雪山',
    text: `崖沿いの細道は危険だったが、\n眼下に広がる雪景色は息をのむほど美しかった。\n\n道の途中、雪に半分埋もれた宝箱を発見した！\n\n中には高品質の防寒具と一緒に——\n「上薬草」が3つ入っていた！\n\n【「上薬草」を3つ手に入れた！】`,
    onEnter: 'snow_cliff_treasure',
    choices: [
      { text: '🏰 氷の城へ向かう', next: 'snow_castle_approach', encounterArea: 'snow', encounterRate: 0.5 },
    ]
  },

  snow_cave: {
    emoji: '❄️', title: '雪の洞窟', location: '雪山',
    text: `洞窟の中は意外にも風がなく、静かだった。\n\n壁面の氷が青く光っている。\nその美しさに見とれていると、壁から何かが飛び出してきた——\n\n雪の妖精たちだ！無数に群がってくる！\n\n危うく切り抜けると、洞窟の奥に隠し部屋が見えた。`,
    choices: [
      { text: '🔍 隠し部屋を調べる', next: 'snow_hidden_room' },
      { text: '🏰 氷の城へ向かう', next: 'snow_castle_approach' },
    ]
  },

  snow_hidden_room: {
    emoji: '💫', title: '雪の洞窟 奥の間', location: '雪山',
    text: `隠し部屋には古い祭壇があり、その上に氷に包まれたアイテムが置かれていた。\n\n氷を溶かすと——精霊の加護を受けた鎧が現れた！\n\n【「精霊の鎧」を手に入れた！】（防御力+12）\n\n奥にはさらに、小さな泉もあった。\n飲んでみると体が温まり、力が戻ってきた。\n\n【HPとMPが全回復した！】`,
    onEnter: 'snow_hidden_treasure',
    choices: [
      { text: '🏰 氷の城へ向かう', next: 'snow_castle_approach' },
    ]
  },

  snow_castle_approach: {
    emoji: '🏰', title: '氷雪の城 前', location: '雪山',
    text: `吹雪の向こうに、全体が氷でできた城が現れた。\n\n城全体が薄青く光り、近づくだけで骨まで凍えるような寒さがある。\n城門は開いており、中から魔力の気配が漏れている。\n\n「——来たか、侵入者よ」\n\n低く美しい声が風に乗って聞こえた。`,
    choices: [
      { text: '❄️ 城に踏み込む【氷雪の女王との決戦！】', next: 'snow_boss_intro' },
      { text: '↩️ 引き返す（回復してから来る）', next: 'snow_pass' },
    ]
  },

  snow_boss_intro: {
    emoji: '👸', title: '氷雪の城 玉座', location: '雪山 氷の城',
    text: `城の奥、氷の玉座に一人の女性が腰かけていた。\n\n全身を白銀の衣で包み、髪は雪のように白い。\nその美しさは人知を超えていた——しかし眼は冷たく、感情がない。\n\n「この城に来た者は、全員氷の彫刻になってもらう。\nそれがここの掟」\n\n氷雪の女王「アイゼリア」が立ち上がった！\n\n❄️ 凍気の魔法に注意！ 魔法攻撃が有効！`,
    choices: [
      { text: '⚔️ アイゼリアと戦う！', action: 'fight_boss_ice_queen' },
      { text: '💨 逃げ帰る', next: 'snow_castle_approach' },
    ]
  },

  snow_boss_defeated: {
    emoji: '✨', title: '氷雪の女王 撃破！', location: '雪山 氷の城',
    text: `アイゼリアを倒した！！\n\n女王は崩れ落ちながら言った。\n「...強い。本当に強い。あなたは...本物の勇者だ...\n魔王を倒せる者がいるとすれば、あなただけかもしれない...」\n\n城の氷が溶け始め、玉座の後ろの扉が開いた。\n奥の宝物庫には二つの武器が置かれていた。\n\n一方は「氷結の刃」——攻撃力を大幅に高める剣。\nもう一方は「雷鳴の杖」——魔法力を大幅に高める杖。\n\nどちらを選ぶ？`,
    onEnter: 'snow_cleared',
    choices: [
      { text: '🗡️ 氷結の刃を選ぶ（攻撃力型）', action: 'equip_ice_blade', next: 'snow_exit' },
      { text: '⚡ 雷鳴の杖を選ぶ（魔法力型）', action: 'equip_thunder_staff', next: 'snow_exit' },
    ]
  },

  snow_exit: {
    emoji: '🏔️', title: '雪山を後にする', location: '雪山',
    text: `新しい武器を手に、雪山を後にした。\n\n振り返ると、城の氷が完全に溶けて輝く光を放っていた。\n——アイゼリアは最期に何かを言い残したかったのかもしれない。\n\n次の目的地へ。まだ旅は続く。`,
    choices: [
      { text: '🏜️ 砂漠を目指す', next: 'desert_entrance' },
      { text: '🌑 魔王城を目指す', next: 'demon_road' },
    ]
  },

  // ============================================================
  //  砂漠エリア
  // ============================================================

  desert_entrance: {
    emoji: '🏜️', title: '灼熱の砂漠 入口', location: '砂漠',
    text: `地平線まで続く黄金色の砂漠が広がっていた。\n\n太陽が容赦なく照りつけ、砂地に足がめり込む。\n魔物の気配が砂の下から漂ってくる。\n\n遠くにオアシスらしき緑が見える。\nさらに先には、砂に半分埋まった石造りの建物の影も。`,
    choices: [
      { text: '🌴 オアシスへ向かう', next: 'desert_oasis' },
      { text: '🏛️ 遺跡へ向かう', next: 'desert_ruins', encounterArea: 'desert', encounterRate: 0.6 },
      { text: '↩️ 引き返す（道中へ）', next: 'crossroads_desert' },
    ]
  },

  desert_oasis: {
    emoji: '🌴', title: 'オアシス', location: '砂漠',
    text: `オアシスに辿り着いた。\n\n澄んだ水と椰子の木——砂漠の中の楽園だ。\n冷たい水を飲み、少し休んだ。\n\n【HPが半分回復した！】\n\nオアシスの傍に旅商人が一人いた。\n「あんた、この先の遺跡に行くのかい？\n気をつけな——奥の神殿にはファラオの霊が封じられてるって話だ」`,
    onEnter: 'desert_oasis_heal',
    choices: [
      { text: '🏛️ 遺跡へ向かう', next: 'desert_ruins', encounterArea: 'desert', encounterRate: 0.55 },
      { text: '🏪 商人と取引する', next: 'desert_shop' },
      { text: '🧪 旅の錬金術師に会う', next: 'desert_alchemist' },
      { text: '🏟️ 闘技場エキスパートへ', next: 'desert_arena_expert', needFlag: 'townDevDesert2' },
      { text: '🪨 素材専門店へ', next: 'desert_material_shop_scene', needFlag: 'townDevDesert3' },
      { text: '📚 魔法書店へ', next: 'desert_magic_shop_scene', needFlag: 'townDevDesert4' },
      { text: '🏺 砂漠の秘密ダンジョンへ', next: 'desert_secret_dungeon', needFlag: 'townDevDesert5' },
      { text: '🏗️ オアシスに投資する', next: 'town_invest_desert' },
      { text: '↩️ 砂漠の入口へ戻る', next: 'desert_entrance' },
    ]
  },

  desert_shop: {
    emoji: '🏪', title: '砂漠の行商人', location: '砂漠',
    type: 'shop', shopId: 'desert_shop', backScene: 'desert_oasis',
    text: `「旅人に必要なものは何でも揃えてるよ。\n砂漠では回復薬と解毒薬が命綱だ。\n準備は万全にしてから先へ進みな」`,
    choices: []
  },

  desert_ruins: {
    emoji: '🏛️', title: '古代の遺跡', location: '砂漠',
    text: `砂に半分埋もれた遺跡に辿り着いた。\n\n壁面には古代文字で何かが刻まれている。\n解読してみると——\n\n「ここに眠るはファラオ・ザンデス。\n不死の呪いをかけられ、永遠に番人として蘇る。\n彼を倒す唯一の方法は——魔法の力のみ」\n\n壁の裂け目に、折りたたまれた羊皮紙が挟まっていた。\n広げてみると——海底神殿の場所を示す古代の地図だ！\n\n【「古代の地図」を手に入れた！】\n\n奥の神殿へ続く道が見える。\n砂の下から魔物の気配が強まってきた。`,
    onEnter: 'give_ancient_map',
    choices: [
      { text: '🏛️ 神殿の奥へ進む', next: 'desert_temple', encounterArea: 'desert', encounterRate: 0.65 },
      { text: '↩️ オアシスへ戻る', next: 'desert_oasis' },
    ]
  },

  desert_temple: {
    emoji: '🔮', title: '砂漠の神殿', location: '砂漠',
    text: `神殿の内部は薄暗く、古代の罠が随所に仕掛けられていた。\n\nいくつかの仕掛けをかわしながら進むと、\n広大な王の間に出た。\n\n黄金の棺が中央に置かれており——\nその蓋がゆっくりと開きはじめた...`,
    choices: [
      { text: '⚔️ 奥へ進む【ファラオとの決戦！】', next: 'desert_boss_intro' },
      { text: '↩️ 引き返す', next: 'desert_ruins' },
    ]
  },

  desert_boss_intro: {
    emoji: '🤴', title: '砂漠の神殿 王の間', location: '砂漠 神殿',
    text: `棺から巨大な人影が現れた。\n\n黄金の装束、宝石の目、何千年もの呪いを纏った姿——\nファラオ・ザンデスだ。\n\n「この神聖な眠りを妨げる者は......永遠の呪いに処す！\n命乞いをする機会を与えよう——今すぐ去れ！」\n\n「断る！」\n\n🔮 魔法攻撃が有効！ 砂嵐と呪縛に注意！`,
    choices: [
      { text: '⚔️ ファラオ・ザンデスに挑む！', action: 'fight_boss_pharaoh' },
      { text: '💨 今は引き返す', next: 'desert_temple' },
    ]
  },

  desert_boss_defeated: {
    emoji: '🏆', title: 'ファラオ 撃破！', location: '砂漠 神殿',
    text: `ファラオ・ザンデスを倒した！！\n\nファラオは砂に溶けながら言った。\n「見事だ、若き勇者よ......\n我が呪いは解かれた。何千年ぶりかの安らぎだ...\nこれを持って行け——我が宝の中で最も価値あるものだ」\n\n崩れた玉座の下から、輝く古代の聖剣が現れた！\n\n【「古代の聖剣」を手に入れた！】（攻撃力+28・魔法力+8）\n\n砂漠に光が差し込み、神殿の呪いが解けていった。`,
    onEnter: 'desert_cleared',
    choices: [
      { text: '✨ 聖剣を装備する', action: 'equip_ancient_blade', next: 'desert_exit' },
      { text: '↩️ 砂漠を後にする（後で装備する）', next: 'desert_exit' },
    ]
  },

  desert_exit: {
    emoji: '🏜️', title: '砂漠を後にする', location: '砂漠',
    text: `砂漠を後にした。\n\nあの神殿に何千年も閉じ込められていたファラオを思うと、\n複雑な気持ちになる。\n\n——でも、先を急がなければ。\n魔王が待っている。`,
    choices: [
      { text: '🌙 砂丘の陰の双子に話しかける', next: 'luna_sola_meeting', needFlag: '!lunaJoined' },
      { text: '🌙 ルナ・ソラと話す', next: 'luna_sola_talk_1', needFlag: 'lunaJoined' },
      { text: '⚓ 南の港町を目指す（隠しエリア）', next: 'sea_harbor' },
      { text: '❄️ 雪山を目指す', next: 'snow_entrance' },
      { text: '🌑 魔王城を目指す', next: 'demon_road' },
    ]
  },

  // ============================================================
  //  海底神殿エリア（隠しエリア）
  // ============================================================

  sea_harbor: {
    emoji: '⚓', title: '古い港町', location: '南の港町',
    text: `古地図が示した場所——荒れ果てた港町だった。\n\nかつては栄えていたのだろうが、今は廃墟同然。\n埠頭に一隻の船が係留されていた。\n\n船乗りの老人が声をかけてきた。\n「海底神殿に行くのか？\nその地図があれば行けるが......並の勇者じゃ帰ってこれないぞ」\n\n「行く」\n\n老人は黙って船に乗り込んだ。`,
    requires: { item: 'ancientMap', failScene: 'sea_harbor_locked' },
    choices: [
      { text: '🚢 海底神殿へ向かう', next: 'sea_descent' },
      { text: '🏪 港の装備商と取引する', next: 'sea_harbor_shop' },
      { text: '🧪 錬金術師の隠し工房へ', next: 'sea_alchemist' },
      { text: '🏨 港の宿屋で休む（300G）', action: 'inn_rest_sea' },
      { text: '🏝️ 南海の孤島へ向かう', next: 'south_island_spot', needFlag: 'vehicleShip' },
      { text: '↩️ 引き返す', next: 'demon_road' },
    ]
  },

  sea_harbor_shop: {
    emoji: '🏪', title: '港の装備商', location: '南の港町',
    type: 'shop', shopId: 'sea_shop', backScene: 'sea_harbor',
    text: `港の一角に老いた商人が荷を広げていた。\n\n「勇者か——珍しい客だ。\n長年の旅で集めた逸品ぞろいだよ。\nどれも一級品だが、それ相応の金はもらうよ」`,
    choices: [],
  },

  sea_harbor_locked: {
    emoji: '🔒', title: '古い港町', location: '南の港町',
    text: `廃墟の港町。\n\n船乗りの老人がいるが、話を聞こうとしない。\n\n「......海底神殿に行くには古代の地図が必要だ。\nその地図がないやつに用はない」\n\n地図を探す必要がありそうだ。`,
    choices: [
      { text: '↩️ 引き返す', next: 'demon_road' },
    ]
  },

  sea_descent: {
    emoji: '🌊', title: '深海への潜航', location: '海底',
    text: `船から特殊な潜水服を着て海に飛び込んだ。\n\n光が届かない深海へ——\n巨大な生き物の影が周囲を泳いでいる。\n\n水圧に体が押しつぶされそうになりながらも、\n海底に光る建物の輪郭が見えてきた。\n\n——海底神殿だ。`,
    choices: [
      { text: '🏛️ 神殿へ向かう', next: 'sea_temple', encounterArea: 'sea', encounterRate: 0.7 },
    ]
  },

  sea_temple: {
    emoji: '🌊', title: '海底神殿', location: '海底神殿',
    text: `海底神殿の内部は青白い光に満ちていた。\n\n古代文明が建てたとされる神殿——壁面には美しい浮き彫りが続く。\n魔物たちが守護者として配置されている。\n\nいくつかの戦闘を経て、神殿の最深部へ辿り着いた。\n\n水が渦を巻き、床が震え始めた...`,
    choices: [
      { text: '🐲 奥へ進む【レヴィアタンとの決戦！】', next: 'sea_boss_intro' },
      { text: '↩️ 引き返す', next: 'sea_descent' },
    ]
  },

  sea_boss_intro: {
    emoji: '🐲', title: '海底神殿 最深部', location: '海底神殿',
    text: `神殿の最深部——広大な水の間。\n\n水面が割れ、巨大な龍が姿を現した。\n全長数十メートル、うろこは深海の闇のように黒い。\n\n「深海に踏み込んだ者よ......\nここから先は我が縄張り。生きては帰さぬ！」\n\n大海蛇レヴィアタンが咆哮した！！\n\n🌊 超強敵！ HPをしっかり管理して戦え！`,
    choices: [
      { text: '⚔️ レヴィアタンに挑む！！', action: 'fight_boss_leviathan' },
      { text: '💨 全力で逃げ帰る', next: 'sea_temple' },
    ]
  },

  sea_boss_defeated: {
    emoji: '🔮', title: 'レヴィアタン 撃破！！', location: '海底神殿',
    text: `レヴィアタンを倒した！！！\n\n巨大な龍の体が光の粒子となり、海水に溶けていった。\n\n「......信じられぬ力だ。お前は本当に......勇者か」\n\n神殿の奥の扉が開き、眩い光が差し込んだ。\n\n扉の中には、青く輝く宝珠が置かれていた。\n\n【「海底の宝珠」を手に入れた！】\n【「深海の鎧」を手に入れた！】（防御力+15）\n\n海底に光が満ちた。長い間封印されていた神殿の呪いが解かれた。`,
    onEnter: 'sea_cleared',
    choices: [
      { text: '🌟 深海の鎧を装備する', action: 'equip_sea_armor', next: 'sea_return' },
      { text: '↩️ 海底から帰還する', next: 'sea_return' },
    ]
  },

  sea_return: {
    emoji: '⚓', title: '帰還', location: '海底神殿',
    text: `老人の船で海面まで戻った。\n\n「生きて帰ってきたか......本当に勇者だな」\n\n老人は静かに微笑んだ。\n\n「この船を君にあげよう。勇者なら使いこなせるはずだ。\n船があれば南海の孤島にも行けるし、\n海での遭遇率も下がるぞ」\n\n【⛵ 船を手に入れた！】\n\n空を見上げると、遠くに魔王城の影が見える。\n——すべての準備は整った。`,
    onEnter: 'give_ship',
    choices: [
      { text: '✨ 埠頭の女性に話しかける', next: 'serafina_meeting', needFlag: '!serafinaJoined' },
      { text: '✨ セラフィナと話す', next: 'serafina_talk_1', needFlag: 'serafinaJoined' },
      { text: '🏝️ 南海の孤島へ向かう', next: 'south_island_spot', needFlag: 'vehicleShip' },
      { text: '🌑 魔王城へ向かう', next: 'demon_road' },
    ]
  },

  demon_road: {
    emoji: '🌑', title: '魔王城への荒野', location: '魔王城への道',
    text: `洞窟を抜けると、荒野が広がっていた。\n\n空は黒雲に覆われ、稲妻が走る。\n遠くに魔王城の黒い影がそびえ立っている。\n\n道端に傷ついた騎士が倒れていた。\n\n「気...気をつけろ...魔王は...HPが半分になると...\n第二の形態に変身する...攻撃が格段に強くなる...\nそれと...「魔法の宝石」があれば...大きなダメージが...」\n\n騎士はそれだけ言って意識を失った。\n薬草を使って応急処置をした。\n\n【薬草を1つ消費した（所持していない場合はスキップ）】`,
    onEnter: 'road_event',
    choices: [
      { text: '🔮 岩の上の青年に話しかける', next: 'zephiros_meeting', needLevel: 35, needFlag: '!zephirosJoined' },
      { text: '🔮 ゼフィロスと話す', next: 'zephiros_talk_1', needFlag: 'zephirosJoined' },
      { text: '🏰 魔王城へ向かう', next: 'demon_castle_gate' },
    ]
  },

  demon_castle_gate: {
    emoji: '🏰', title: '魔王城 城門', location: '魔王城',
    text: `ついに魔王城の城門に立った。\n\n黒い石で造られた巨大な城がそびえ立ち、\n城壁には赤い炎が燃え続けている。\n\n城門には強力な魔法の錠前がかかっていた。\n「魔王城の鍵」をかざすと——\n\nカチリ、と音を立てて扉が開いた。\n\n門の向こうから凄まじい魔力の波動が押し寄せてくる。\n身体が震えるが——ここで引くわけにはいかない。`,
    requires: { item: 'castleKey', failScene: 'demon_castle_gate_locked' },
    choices: [
      { text: '🏰 城内へ踏み込む', next: 'demon_castle_hall' },
    ]
  },

  demon_castle_gate_locked: {
    emoji: '🔒', title: '魔王城 城門（施錠中）', location: '魔王城への道',
    text: `魔王城の城門は巨大な魔法の錠前で固く閉ざされていた。\n\n「この錠前を開けるには...特別な鍵が必要なようだ。\n洞窟の番人が持っているという話だが...」`,
    choices: [
      { text: '⛰️ 洞窟に戻る（石の番人を倒す）', next: 'cave_approach' },
    ]
  },

  demon_castle_hall: {
    emoji: '🏰', title: '魔王城 玄関ホール', location: '魔王城',
    text: `城内に踏み込んだ。\n\n広大なホールが広がり、赤い絨毯が奥の扉まで延びている。\n壁には魔王の肖像画が飾られ、炎のトーチが不気味に揺れている。\n\n左右に廊下があり、正面に巨大な扉がある。\n\nどこへ向かう？`,
    choices: [
      { text: '← 左の廊下（守護悪魔の間）', next: 'demon_castle_left' },
      { text: '→ 右の廊下（図書室）', next: 'demon_castle_right' },
      { text: '🔽 隠し扉（地下牢への階段）', next: 'demon_castle_dungeon' },
      { text: '🚪 正面の扉（玉座の間へ）', next: 'demon_throne_approach' },
    ]
  },

  demon_castle_left: {
    emoji: '😈', title: '守護悪魔の間', location: '魔王城',
    text: `左の廊下を進むと、広い部屋に出た。\n\n部屋の中央に巨大な悪魔が立ちはだかった。\n\n「ケケケ...よくここまで来たな、勇者とやら。\n魔王様の命令だ——ここで息の根を止めてやる！」\n\n「デーモンロード」が戦いの構えをとった！`,
    choices: [
      { text: '⚔️ デーモンロードと戦う！', action: 'fight_boss_demon_lord' },
      { text: '↩️ ホールへ引き返す', next: 'demon_castle_hall' },
    ]
  },

  demon_castle_left_cleared: {
    emoji: '⭐', title: '守護悪魔 撃破！', location: '魔王城',
    text: `デーモンロードを倒した！\n\n崩れ落ちた悪魔の向こうに宝箱があった。\n開けると——黄金に輝く剣が現れた！\n\n【「勇者の剣」を手に入れた！】（攻撃力+15）\n\nこれは...伝説の勇者が持っていたという聖剣だ！\n力がみなぎってくるのを感じる。`,
    onEnter: 'give_hero_sword',
    choices: [
      { text: '⚔️ 勇者の剣を装備する', action: 'equip_hero_sword', next: 'demon_castle_hall' },
      { text: '↩️ ホールへ戻る（後で装備する）', next: 'demon_castle_hall' },
    ]
  },

  demon_castle_right: {
    emoji: '📚', title: '魔王城 図書室', location: '魔王城',
    text: `右の廊下の先には広い図書室があった。\n\n古い魔法書が並ぶ棚の中を進むと、\n一冊の本が淡く光っていた。\n\n「魔王討伐の記録」——開いて読む。\n\n「魔王ダークロスの弱点：光の魔法（通常の1.5倍効果）\nHPが半分以下になると「真の魔王形態」に変身し攻撃力が激増する。\n真の魔王形態では攻撃力がさらに跳ね上がり、通常の攻撃では歯が立たない。\n「魔法の宝石」を使用すると特大ダメージを与えられる。\n——注意：この魔王は人智を超えた力を持つ。並の勇者では絶対に勝てない」\n\n重要な情報を得た！`,
    choices: [
      { text: '↩️ ホールへ戻る', next: 'demon_castle_hall' },
    ]
  },

  demon_throne_approach: {
    emoji: '👑', title: '玉座の間 前室', location: '魔王城',
    text: `重厚な扉の前に立った。\n\n扉の向こうから、凄まじい魔力の気配が漏れている。\n心臓が激しく打ち鳴る。\n\n今まで旅してきた道のりが脳裏に浮かんだ。\n村の人々の顔、老冒険者の言葉、隠者サラスの杖——\n\n「——行くしかない」\n\n扉に手をかけ、ゆっくりと押し開けた...`,
    choices: [
      { text: '🌟 旅の記憶を振り返る（決意を固める）', next: 'demon_reflection' },
      { text: '👿 玉座の間へ入る【最終決戦！】', next: 'demon_king_intro' },
      { text: '↩️ ホールへ戻る（準備を整える）', next: 'demon_castle_hall' },
    ]
  },

  demon_king_intro: {
    emoji: '👿', title: '玉座の間', location: '魔王城 玉座の間',
    text: `広大な玉座の間。\n\n黒い玉座に腰掛けた存在が、ゆっくりと立ち上がった。\n——「魔王ダークロス」だ。\n\n「......来たか、小さな勇者よ」\n\n魔王は黒い炎を纏いながら、冷ややかに微笑んだ。\n\n「王国の希望とやらか。面白い。\nその目に絶望を刻んでやろう——\nこの世界は闇に染まる運命なのだよ」\n\n「——関係ない！俺はお前を倒す！」\n\n🔥🔥 最終決戦が始まった！！ 🔥🔥`,
    choices: [
      { text: '🗡️ 魔王に挑む！！', action: 'fight_demon_king' },
    ]
  },

  // ============================================================
  //  追加ストーリーシーン
  // ============================================================

  village_elder: {
    emoji: '🧓', title: '長老 ホワイトの家', location: '出発の村',
    text: `村の奥まった場所に、この村で一番古い家がある。\n\nドアをノックすると、真っ白な髭を蓄えた老人が顔を出した。\n村長のホワイト翁——この村の歴史を全て知る人物だ。\n\n「アレク...来ると思っていたよ。\n実は、お前の本当の出生について、ずっと話すべきか迷っていたんだ」\n\n老人は深く息を吸った。\n\n「お前の父親は——魔王に立ち向かって命を落とした勇者だった。\nその血が今、お前の中に流れている。\n魔王がお前を恐れているのは、だからだ」\n\n「父の...遺志を継ぐ...」\n\n「そしてこれを——お前の父が残した唯一の形見だ」\n\n老人は光る首飾りをアレクの首にかけた。\n\n【精神が研ぎ澄まされた！ 最大MPが10上昇！】`,
    onEnter: 'elder_blessing',
    choices: [
      { text: '💬 もっと父の話を聞く', next: 'village_elder2' },
      { text: '↩️ 村に戻る', next: 'village' },
    ]
  },

  village_elder2: {
    emoji: '🧓', title: '長老 ホワイトの家', location: '出発の村',
    text: `老人は遠くを見るような目で続けた。\n\n「お前の父、アロンは誰よりも強く、誰よりも優しい男だった。\n最後の戦いで魔王に致命傷を与えたが、力尽きて倒れた」\n\n「では魔王はその時...」\n\n「深手を負いながらも生き延び、力を蓄えて復活した。\nだが——お前の父の一撃は、今も魔王の胸に傷として残っているはずだ」\n\n老人はアレクの肩に手を置いた。\n\n「行きなさい、アレク。\n村の者たちは、お前の帰りを待っている。\n——お前の父も、天から見守っているだろう」`,
    choices: [
      { text: '↩️ 村に戻る（出発の準備をする）', next: 'village' },
    ]
  },

  demon_castle_dungeon: {
    emoji: '⛓️', title: '魔王城 地下牢', location: '魔王城',
    text: `隠し扉の先に、石造りの螺旋階段が続いていた。\n\n降りると薄暗い地下牢が広がっていた。\n鉄格子の向こうに、やつれた老人が座っている。\n\n「......生きている人間か。久しぶりに見る顔だ」\n\n老人は元は王国随一の魔法使いだったという。\n十年前に魔王に捕らえられ、ここに閉じ込められ続けているのだ。\n\n「魔王には弱点がある——胸の闇の奥に、かつて人間だった頃の後悔が眠っている。\n光の魔法でそこを貫けば、隠された力を引き出せる」\n\n老人はゆっくりと立ち上がり、鉄格子越しに両手を差し出した。\n淡い光がアレクの体を包む——\n\n「これが私に残った最後の魔力だ。受け取れ、若き勇者よ」\n\n老人の体が光の粒になって消えた。\n\n【魔法使いの加護！ 魔法攻撃力が10上昇！（永続）】`,
    onEnter: 'dungeon_sage_meeting',
    choices: [
      { text: '↩️ ホールへ戻る', next: 'demon_castle_hall' },
    ]
  },

  demon_reflection: {
    emoji: '🌟', title: '決意', location: '魔王城 玉座の間 前',
    text: `重い扉を前に、アレクは目を閉じた。\n\n——走馬灯のように、旅の記憶が蘇る。\n\n老冒険者の「魔法を惜しむな」という言葉。\n隠者サラスが手渡してくれた杖の温もり。\n氷雪の女王の最期の声——「本物の勇者...」\n砂漠で千年眠り続けたファラオの、安らかな最期の表情。\n深海の老船乗りの「生きて帰ってきたか」という声。\n地下牢で消えた魔法使いの、最後の笑顔。\n\nそして——長老の言葉が胸に響く。\n「お前の父は、誰よりも強く、誰よりも優しかった」\n\n「————行こう」\n\nアレクは深く息を吸い込んだ。\n\n恐怖はある。でも——もう迷いはない。\n父の意志を、今ここで継ぐ。\n\n【決意の力！ HPとMPが全回復した！】`,
    onEnter: 'pre_final_heal',
    choices: [
      { text: '👿 玉座の間へ入る【最終決戦！】', next: 'demon_king_intro' },
    ]
  },

  // ── アリア関連シーン ──
  aria_meeting: {
    emoji: '👱‍♀️', title: '銀髪の剣士', location: '訓練の地',
    text: `訓練場の入り口で、銀髪をポニーテールにまとめた少女が剣の素振りをしていた。\n白い鎧に青い瞳——彼女の動きは無駄なく、しなやかだ。\n\n「あ、あなたも冒険者？ 私はアリアっていうの。魔王討伐を目指して修行中なんだけど……」\n\n少女は少し照れながら、でも真剣な目でこちらを見つめた。\n\n「一緒に戦ってみない？ 私、役に立てると思うんだけどな！」`,
    choices: [
      { text: '「もちろん！ 一緒に行こう」', next: 'aria_join_yes' },
      { text: '「…今は一人で行く」', next: 'aria_join_no' },
    ]
  },

  aria_join_yes: {
    emoji: '🌟', title: '仲間が増えた！', location: '訓練の地',
    text: `「本当に！？ やった——！」\n\nアリアの顔が一気に明るくなった。\n\n「よろしく、アレク！ 私の剣技、きっと役に立てるから！ 得意技は疾風斬りと聖なる加護よ。あとは……渾身の一撃っていう切り札もあるんだけど、それは大事なときに取っておくね」\n\nアリアがパーティに加わった！\n戦闘中はアリアが自動で行動する。彼女の力を信じよう。`,
    onEnter: 'aria_join',
    choices: [
      { text: '→ 冒険を続ける', next: 'leveling_hub' },
    ]
  },

  aria_join_no: {
    emoji: '😔', title: '銀髪の剣士', location: '訓練の地',
    text: `「そっか……。うん、分かった」\n\nアリアは少し寂しそうな顔をしたが、すぐに笑顔に戻った。\n\n「また気が変わったら声かけてね。ここで待ってるから！」`,
    choices: [
      { text: '「やっぱり、一緒に来てほしい」', next: 'aria_join_yes' },
      { text: '↩️ 戻る', next: 'leveling_hub' },
    ]
  },

  aria_talk_1: {
    emoji: '👱‍♀️', title: 'アリアとの会話', location: '訓練の地',
    text: `「ねえアレク、魔王って本当に倒せると思う？」\n\nアリアが剣の手入れをしながら聞いてきた。\n\n「私、父が魔王の軍に……。だから絶対諦めないって決めたの」\n\n彼女の目に強い光が宿っている。\n\n「あなたと戦えて、良かったと思ってる。ありがとうね」`,
    choices: [
      { text: '「お互い様だよ。必ず一緒に倒そう」', next: 'aria_talk_1b' },
    ]
  },

  aria_talk_1b: {
    emoji: '✨', title: 'アリアとの会話', location: '訓練の地',
    text: `「うん！ 絶対に！」\n\nアリアは笑顔でうなずいた。その笑顔がなんだか眩しくて、思わず目を逸らしてしまった。\n\n……なんでだろう。`,
    choices: [
      { text: '↩️ 戻る', next: 'leveling_hub' },
    ]
  },

  aria_talk_2: {
    emoji: '🌙', title: '夜営のひととき', location: '訓練の地',
    text: `夜、焚き火の傍でアリアが星を見上げていた。\n\n「見て、あの星——お父さんが教えてくれた冒険者の星座なの」\n\n静かな声。でもその目はしっかりと前を向いている。\n\n「ちょっと疲れたときは、この星を見るの。そうすると頑張れる気がして。アレクは？ 疲れたときどうしてる？」`,
    choices: [
      { text: '「君のことを考えると元気が出る」', next: 'aria_talk_2b' },
      { text: '「戦い続けることかな」', next: 'aria_talk_2c' },
    ]
  },

  aria_talk_2b: {
    emoji: '💫', title: '夜営のひととき', location: '訓練の地',
    text: `「え……っ」\n\nアリアが急に顔を赤らめた。\n\n「な、なにそれ！ そんなこと言わないでよ——もう！」\n\nでも口元がほんの少し緩んでいる。\n\n「……ありがと。私も、あなたのことは信頼してるから」`,
    choices: [{ text: '↩️ 戻る', next: 'leveling_hub' }],
  },

  aria_talk_2c: {
    emoji: '⚔️', title: '夜営のひととき', location: '訓練の地',
    text: `「そっか。アレクらしいね」\n\nアリアはくすっと笑った。\n\n「じゃあ私たちは最強だね。私が迷ったらあなたが引っ張ってくれて、あなたが迷ったら私が……うん。そういうチームでいよ？」`,
    choices: [{ text: '↩️ 戻る', next: 'leveling_hub' }],
  },

  // ── ガイアス加入イベント ──
  gaius_meeting: {
    emoji: '🛡️', title: '重装の騎士', location: '古代遺跡',
    text: `遺跡の入口に、黒髪の大柄な青年が壁にもたれていた。\n重厚な鎧に身を包み、大剣を携えている。\nその目は鋭く、こちらを静かに値踏みしている。\n\n「……お前が魔王を倒しに行くという噂の勇者か」\n\n短い沈黙の後、彼は低い声で言った。\n\n「俺はガイアス。王国騎士団の元副隊長だ。魔王の軍に故郷を奪われた。\n……一人で戦うつもりか？　無謀だな」`,
    choices: [
      { text: '「一緒に戦ってくれるか？」', next: 'gaius_join_yes' },
      { text: '「一人で十分だ」', next: 'gaius_join_no' },
    ]
  },

  gaius_join_yes: {
    emoji: '🌟', title: 'ガイアス加入！', location: '古代遺跡',
    text: `ガイアスは少し間を置き、ゆっくりとうなずいた。\n\n「……分かった。道連れになってやる」\n\n彼は大剣を担ぎ直し、前を歩き始めた。\n\n「俺のスキルを教えておく。『挑発』で敵の攻撃を引き受け、『鉄壁の構え』で致命傷を防ぐ。『仁王立ち』で仲間への攻撃も俺が肩代わりできる。お前たちを守るのが俺の役目だ」\n\n🛡️ ガイアスがパーティに加わった！\n【「守護騎士の大剣」と「守護騎士の重鎧」を受け取った！】`,
    onEnter: 'gaius_join',
    choices: [
      { text: '→ 冒険を続ける', next: 'leveling_hub' },
    ]
  },

  gaius_join_no: {
    emoji: '🛡️', title: '重装の騎士', location: '古代遺跡',
    text: `「そうか。お前の意志は尊重する」\n\nガイアスは静かに視線を外し、壁に寄りかかった。\n\n「……だが、気が変わったらいつでも声をかけろ。俺はここにいる」`,
    choices: [
      { text: '「やはり一緒に来てほしい」', next: 'gaius_join_yes' },
      { text: '↩️ 戻る', next: 'leveling_hub' },
    ]
  },

  gaius_talk_1: {
    emoji: '🛡️', title: 'ガイアスとの会話', location: '古代遺跡',
    text: `「故郷か……」\n\nガイアスが呟いた。\n\n「俺の村はあの日、魔王の軍に焼かれた。騎士団長として守れなかった。お前はどうだ、アレク。守りたいものがあるから戦っているんだろう？」\n\n彼の目に、深い後悔と決意が混在している。`,
    choices: [
      { text: '「守りたいものがあるから強くなれる」', next: 'gaius_talk_1b' },
    ]
  },

  gaius_talk_1b: {
    emoji: '🛡️', title: 'ガイアスとの会話', location: '古代遺跡',
    text: `ガイアスはしばらく黙っていた。\n\n「……そうだな。俺もそれを忘れかけていた」\n\n彼は小さく笑った。珍しい表情だった。\n\n「アレク。俺はお前の盾になる。それが今の俺の答えだ」`,
    choices: [{ text: '↩️ 戻る', next: 'leveling_hub' }],
  },

  // ── ルナ＆ソラ加入イベント ──
  luna_sola_meeting: {
    emoji: '🌙', title: '砂漠の双子', location: '砂漠を後にする',
    text: `砂漠を後にしようとしたとき、砂丘の陰から二人の少女が現れた。\n\n白い服の少女が笑顔で手を振る。\n「あ、お兄さん！ 勇者さんでしょ？ 私たちにも分かっちゃった〜！」\n\n黒い服の少女が腕を組んで言い放つ。\n「……別に。ただ確認したかっただけ」\n\n白服の子が続けた。\n「私ルナで、こっちが双子のソラ！ 私たちも魔王を倒したいから、一緒に行かせて！」\n\nソラが渋々付け加える。\n「…私は別に、ルナが行くから仕方なく来るだけよ。勘違いしないで」`,
    choices: [
      { text: '「もちろん！ 一緒に行こう」', next: 'luna_sola_join_yes' },
      { text: '「今はまだ早い」', next: 'luna_sola_join_no' },
    ]
  },

  luna_sola_join_yes: {
    emoji: '🌟', title: 'ルナ＆ソラ加入！', location: '砂漠を後にする',
    text: `「やったー！ 絶対役に立てるよ！」\nルナが飛び跳ねて喜んだ。\n\nソラはそっぽを向きながら小声で言った。\n「…ふん。まあ、足手まといにはならないわよ」\n\nルナが解説してくれた。\n「私は仲間の強化が得意なの！『星の加護』でみんなの攻撃力アップ、『月光の歌』で防御アップ、『奇跡の祈り』でMP回復もできるよ！」\n\nソラが続けた。\n「…私は敵を弱らせる。『闇の呪縛』で敵の力を削ぎ、『束縛の鎖』で足止めする。あと『弱体の烙印』で完膚なきまでに弱体化させてあげる」\n\n🌙 ルナ＆ソラがパーティに加わった！\n【「月光の杖」と「星の杖」を受け取った！】`,
    onEnter: 'luna_sola_join',
    choices: [
      { text: '→ 冒険を続ける', next: 'desert_exit' },
    ]
  },

  luna_sola_join_no: {
    emoji: '🌙', title: '砂漠の双子', location: '砂漠を後にする',
    text: `ルナがしゅんとした顔になった。\n「そっかぁ……。でも、もし気が変わったら言ってね！」\n\nソラが素っ気なく言った。\n「……別に、いつでもいいけど」\n\n（でも少しだけ残念そうに見えた）`,
    choices: [
      { text: '「やはり来てほしい」', next: 'luna_sola_join_yes' },
      { text: '↩️ 先を急ぐ', next: 'desert_exit' },
    ]
  },

  luna_sola_talk_1: {
    emoji: '🌙', title: 'ルナとソラとの会話', location: '旅の途中',
    text: `ルナが明るく話しかけてきた。\n「ねえアレク、ソラってじつはすごく心配性なんだよ？ 戦闘前に絶対に私のMP確認するんだから〜」\n\nソラが顔を赤くした。\n「な……っ！ それは、ルナが心配だから仕方なくそうしてるだけよ！ あなたはすぐにそういうこと言う！」\n\n「あははー！ ソラが照れてる〜！」\n\n二人の賑やかなやりとりに、思わず笑ってしまった。`,
    choices: [
      { text: '「いいチームだな、二人とも」', next: 'luna_sola_talk_1b' },
    ]
  },

  luna_sola_talk_1b: {
    emoji: '⭐', title: 'ルナとソラとの会話', location: '旅の途中',
    text: `ルナが「えへへ」と笑った。\n「私たちずっと一緒だからね！」\n\nソラはぷいと横を向いたが、その耳が少し赤かった。\n\n「…チームって言葉、嫌いじゃないわ。それだけよ」`,
    choices: [{ text: '↩️ 進む', next: 'desert_exit' }],
  },

  // ── セラフィナ加入イベント ──
  serafina_meeting: {
    emoji: '✨', title: '聖なる光の女性', location: '南の港町',
    text: `港に戻ると、埠頭に白銀の長髪の女性が立っていた。\n白いドレスに優しい緑の瞳——彼女のまわりだけ、空気が柔らかい気がした。\n\n「……あなたが、深海の神殿を越えた方ですね」\n\n彼女は静かに微笑んだ。\n\n「私はセラフィナ。神殿の守護者でした。でも今は——神殿の封印が解かれた今、私は自由に動ける」\n\n「魔王の闇は、多くの命を傷つけている。あなたと共に戦い、癒しの力を捧げたい。……許してくれますか？」`,
    choices: [
      { text: '「ぜひ一緒に来てください」', next: 'serafina_join_yes' },
      { text: '「……考えさせてください」', next: 'serafina_join_no' },
    ]
  },

  serafina_join_yes: {
    emoji: '🌟', title: 'セラフィナ加入！', location: '南の港町',
    text: `「ありがとうございます」\n\nセラフィナはそっと微笑み、手をそっと胸に当てた。\n\n「私の力は、傷を癒すこと。『聖なる癒し』で仲間のHPを回復し、『全体回復』でパーティ全員を癒します。倒れた仲間を『蘇生』で復活させることもできます」\n\n「『浄化』で状態異常を取り除き、『聖域』でしばらくの間、皆の傷を継続的に癒します。……どうか、皆さんをお守りさせてください」\n\n✨ セラフィナがパーティに加わった！\n【「聖女のスタッフ」と「聖女のドレス」を受け取った！】`,
    onEnter: 'serafina_join',
    choices: [
      { text: '→ 冒険を続ける', next: 'sea_return' },
    ]
  },

  serafina_join_no: {
    emoji: '✨', title: '聖なる光の女性', location: '南の港町',
    text: `「……分かりました。急かすつもりはありません」\n\nセラフィナは穏やかに言った。\n\n「もし必要になったら、いつでも呼んでください。ここで待っています」`,
    choices: [
      { text: '「やはり、来てください」', next: 'serafina_join_yes' },
      { text: '↩️ 先を急ぐ', next: 'sea_return' },
    ]
  },

  serafina_talk_1: {
    emoji: '✨', title: 'セラフィナとの会話', location: '旅の途中',
    text: `夕暮れ時、セラフィナが静かに祈っていた。\n\n「……どなたに祈っているんですか？」\n\n「倒れた人たちに。魔王の被害で亡くなった方々へ」\n\n彼女の声は穏やかだが、その瞳には深い悲しみがある。\n\n「だから戦います。もうこれ以上、失われる命が出ないように」`,
    choices: [
      { text: '「あなたの祈りは必ず届く」', next: 'serafina_talk_1b' },
    ]
  },

  serafina_talk_1b: {
    emoji: '✨', title: 'セラフィナとの会話', location: '旅の途中',
    text: `セラフィナはしばらく黙っていた後、微笑んだ。\n\n「ありがとうございます、アレク。あなたの言葉が……力になります」\n\n彼女の緑の瞳が優しく揺れた。\n\n「どうか無事に旅を終えましょう。私が皆さんを守ります」`,
    choices: [{ text: '↩️ 進む', next: 'sea_return' }],
  },

  // ── ゼフィロス加入イベント ──
  zephiros_meeting: {
    emoji: '🔮', title: '黒いローブの大賢者', location: '魔王城への道',
    text: `荒野を進むと、黒いローブを纏った白髪の青年が岩の上に座っていた。\n金色の鋭い瞳がこちらを見下ろす。\n\n「……お前が魔王を倒しに行くとかいう小僧か」\n\n彼は立ち上がり、冷ややかに言った。\n\n「俺はゼフィロス。魔法界で"大賢者"と呼ばれている。言っておくが、俺が協力するのはお前の力を認めたからじゃない」\n\n「魔王ダークロスは俺の宿敵だ。邪魔をするなよ」\n\nにもかかわらず——彼は隣に立った。`,
    choices: [
      { text: '「……一緒に来てくれるか？」', next: 'zephiros_join_yes' },
      { text: '「あなたは必要ない」', next: 'zephiros_join_no' },
    ]
  },

  zephiros_join_yes: {
    emoji: '🌟', title: 'ゼフィロス加入！', location: '魔王城への道',
    text: `「ふん。仕方ない。お前では魔王には届かないだろうからな」\n\nゼフィロスはそっぽを向きながら言った。\n\n「俺の魔法を教えてやる。『インフェルノ』、『ブリザード』、『サンダーボルト』——いずれも最高位の超魔法だ。『魔力解放』で一時的に魔法力を二倍にすることもできる。その代わりHP を消費するがな」\n\n「『魔法障壁』も使える。パーティへの魔法攻撃を無効化する。……感謝しろよ」\n\n🔮 ゼフィロスがパーティに加わった！\n【「大賢者の杖」と「漆黒のローブ」を受け取った！】`,
    onEnter: 'zephiros_join',
    choices: [
      { text: '→ 魔王城を目指す', next: 'demon_road' },
    ]
  },

  zephiros_join_no: {
    emoji: '🔮', title: '黒いローブの大賢者', location: '魔王城への道',
    text: `ゼフィロスは眉一つ動かさなかった。\n\n「……そうか。なら好きにしろ」\n\n彼はローブを翻し、岩の上に戻った。\n\nしかし——なんとなく、まだそこにいる気がした。`,
    choices: [
      { text: '「……やはり来てほしい」', next: 'zephiros_join_yes' },
      { text: '↩️ 先へ進む', next: 'demon_road' },
    ]
  },

  zephiros_talk_1: {
    emoji: '🔮', title: 'ゼフィロスとの会話', location: '旅の途中',
    text: `「……アレク。一つ聞いていいか」\n\nゼフィロスが珍しく静かな声で言った。\n\n「お前はなぜ、俺のような奴を仲間にしようとした？ 俺はプライドが高く、扱いにくいはずだ」\n\n彼の金色の瞳が真剣にこちらを見つめている。`,
    choices: [
      { text: '「強さより、信頼できるかどうかだ」', next: 'zephiros_talk_1b' },
    ]
  },

  zephiros_talk_1b: {
    emoji: '🔮', title: 'ゼフィロスとの会話', location: '旅の途中',
    text: `ゼフィロスはしばらく黙っていた。\n\n「……信頼、か」\n\n彼は小さく笑った。初めて見る表情だった。\n\n「やはりお前は……おもしろいな、アレク。認めてやる。少しだけ、な」`,
    choices: [{ text: '↩️ 進む', next: 'demon_road' }],
  },

  // ── レベリングスポット ──
  leveling_hub: {
    emoji: '⚔️', title: 'レベリングスポット', location: '訓練の地',
    text: `強者を目指す冒険者のための特別な訓練場が各地に存在する。\n\n通常より多くの経験値・ゴールドが得られ、周回を重ねると敵が強くなりレアアイテムも出やすくなる。\n\n【解放条件】\n🌲 森の奥地：Lv10以上\n🏛️ 古代遺跡：Lv20以上\n🏟️ 闘技場：Lv30以上`,
    choices: [
      { text: '🌲 森の奥地（EXP×1.5 / 初心者向け）', next: 'deep_forest_spot', needLevel: 10 },
      { text: '🏛️ 古代遺跡（EXP×1.7 / 中級者向け）', next: 'ancient_ruins_spot', needLevel: 20 },
      { text: '🏟️ 闘技場（EXP×2.0 / 5連戦・ボーナスあり）', next: 'arena_spot', needLevel: 30 },
      { text: '👱‍♀️ 銀髪の剣士に話しかける', next: 'aria_meeting', needLevel: 15, needFlag: '!ariaJoined' },
      { text: '🛡️ 重装の騎士に話しかける', next: 'gaius_meeting', needLevel: 20, needFlag: '!gaiusJoined' },
      { text: '👱‍♀️ アリアと話す', next: 'aria_talk_1', needFlag: 'ariaJoined', needFlag2: '!ariaTalk1Done' },
      { text: '🌙 アリアと夜営トーク', next: 'aria_talk_2', needFlag: 'ariaJoined', needFlag2: '!ariaTalk2Done' },
      { text: '🛡️ ガイアスと話す', next: 'gaius_talk_1', needFlag: 'gaiusJoined' },
      { text: '↩️ 村に戻る', next: 'village' },
    ]
  },

  deep_forest_spot: {
    emoji: '🌲', title: '森の奥地', location: '森の奥地',
    text: `通常の森よりも奥深くに広がる魔の領域。\n凶暴な魔獣たちが縄張りを守っている。\n\n木漏れ日の中に、澄んだ泉が輝いている。\n\n✦ EXP・ゴールドが通常の1.5倍\n✦ 周回ごとに敵が15%強化\n✦ 周回数が上がるとレアアイテムがドロップ`,
    choices: [
      { text: '💧 回復の泉で全回復する', action: 'recover_forest' },
      { text: '⚔️ 挑戦する', action: 'start_leveling_deep_forest' },
      { text: '↩️ スポット一覧へ', next: 'leveling_hub' },
    ]
  },

  ancient_ruins_spot: {
    emoji: '🏛️', title: '古代遺跡', location: '古代遺跡',
    text: `太古の文明が残した神秘の遺跡。\n眠りから覚めた番人たちが侵入者を容赦なく排除する。\n\n入り口の傍に、古代の祭壇が静かに佇んでいる。\n\n✦ EXP・ゴールドが通常の1.7倍\n✦ 周回ごとに敵が15%強化\n✦ 高周回で上級アイテムがドロップ`,
    choices: [
      { text: '🕯️ 古代の祭壇で祈る（全回復）', action: 'recover_ruins' },
      { text: '⚔️ 挑戦する', action: 'start_leveling_ancient_ruins' },
      { text: '↩️ スポット一覧へ', next: 'leveling_hub' },
    ]
  },

  arena_spot: {
    emoji: '🏟️', title: '闘技場', location: '闘技場',
    text: `強者だけが集う伝説の闘技場。\n5体の猛者を連続で倒せれば豪華なボーナス報酬が待っている。\n\n控室に回復の魔法陣が描かれている。\n\n✦ EXP・ゴールドが通常の2倍\n✦ 波ごとに敵が強化\n✦ 全5体撃破でボーナス報酬（800G＋エリクサー）\n✦ 途中リタイアも可能`,
    choices: [
      { text: '✨ 魔法陣で全回復する', action: 'recover_arena' },
      { text: '🏟️ 闘技場に挑む（5連戦）', action: 'start_leveling_arena' },
      { text: '↩️ スポット一覧へ', next: 'leveling_hub' },
    ]
  },

  // ============================================================
  //  乗り物システムシーン
  // ============================================================

  village_stable: {
    emoji: '🐴', title: '厩舎「ブライトン」', location: '出発の村',
    text: `村の外れにある厩舎だ。\n\n頑丈そうな馬が数頭、のんびりと草を食べている。\n馬番のブライトンが声をかけてきた。\n\n「冒険者さんかい？\n馬があれば移動が格段に楽になるぞ。\nエンカウント率が半分になる。\n大草原へのアクセスもできるようになるぞ」`,
    choices: [
      { text: '🐴 馬を購入する（3000G）', action: 'buy_horse', needFlag: '!vehicleHorse' },
      { text: '🐴 愛馬の様子を見る', next: 'village_stable', needFlag: 'vehicleHorse' },
      { text: '🌾 大草原へ向かう', next: 'grasslands_spot', needFlag: 'vehicleHorse' },
      { text: '↩️ 村に戻る', next: 'village' },
    ]
  },

  grasslands_spot: {
    emoji: '🌾', title: '大草原', location: '大草原',
    onEnter: 'grasslands_enter',
    text: `地平線まで続く広大な草原。\n\n爽やかな風が草の波を作り、遥か遠くまで視界が開けている。\n様々な野生の魔物が草原を駆け巡っている。\n\n✦ EXP×1.6 / GOLD×1.6\n✦ 馬での移動のためエンカウント率-50%`,
    choices: [
      { text: '🌿 草原で鍛錬する', action: 'start_leveling_grasslands' },
      { text: '✨ 泉で全回復する', action: 'recover_grasslands', needFlag: '!grasslandsSpringUsed' },
      { text: '↩️ 村に戻る', next: 'village' },
    ]
  },

  south_island_spot: {
    emoji: '🏝️', title: '南海の孤島', location: '南海の孤島',
    text: `南の海に浮かぶ孤島。\n\n澄んだエメラルドグリーンの海に囲まれ、椰子の木が揺れている。\nしかし島の奥には凶悪な海賊や海の魔物が潜む。\n\n✦ EXP×2.2 / GOLD×2.2\n✦ 船での移動で到達可能`,
    choices: [
      { text: '⚔️ 島の奥へ進む', action: 'start_leveling_south_island' },
      { text: '↩️ 港町へ戻る', next: 'sea_harbor' },
    ]
  },

  sky_island_hub: {
    emoji: '☁️', title: '天空の浮遊島', location: '天空',
    text: `雲の上に浮かぶ幻の島——「天空の浮遊島」。\n\n飛行船でしか辿り着けないこの島に、\n古代の天空竜たちが棲み付いている。\n\n天空竜の素材はあらゆる装備の最終強化に使えるという。\n\n✦ EXP×2.8 / GOLD×2.8\n✦ 飛行船でのみアクセス可能`,
    choices: [
      { text: '⚔️ 天空の戦場へ向かう', next: 'sky_island_spot' },
      { text: '🏘️ 村へ戻る', next: 'village' },
    ]
  },

  sky_island_spot: {
    emoji: '⚡', title: '天空の戦場', location: '天空の浮遊島',
    text: `島の中央に広がる、嵐が渦巻く戦場。\n\n翼竜、雲の巨人、伝説の天炎鳥フェニックスが\nこの地を守護している。\n\n覚悟を決めて挑め！`,
    choices: [
      { text: '⚔️ 天空の魔物と戦う', action: 'start_leveling_sky_island' },
      { text: '↩️ 天空の浮遊島へ戻る', next: 'sky_island_hub' },
    ]
  },

  airship_dealer: {
    emoji: '🚁', title: '飛行船商人', location: '平和な世界',
    text: `怪しげな飛行船商人が声をかけてきた。\n\n「やあ勇者さん、世界を救った英雄に\n最高の乗り物を売ってあげよう！\n\n🚁 飛行船の効果：\n• 全エリアのエンカウント率-70%\n• ワープ魔法で未訪問の地にも直接飛べる\n• 天空の浮遊島にアクセス可能\n\n代金は1000000G（百万ゴールド）だ。\n世界を救った英雄への特別価格さ！」`,
    choices: [
      { text: '🚁 飛行船を購入する（1000000G）', action: 'buy_airship', needFlag: '!vehicleAirship' },
      { text: '🚁 飛行船の様子を確認', next: 'airship_dealer', needFlag: 'vehicleAirship' },
      { text: '↩️ クリア後の世界へ戻る', next: 'post_clear_hub' },
    ]
  },

  // ============================================================
  //  町の発展シーン
  // ============================================================

  town_invest_village: {
    emoji: '🏘️', title: '出発の村 投資', location: '出発の村',
    onEnter: 'open_town_invest_village',
    choices: []
  },
  town_invest_desert: {
    emoji: '🌴', title: '砂漠のオアシス 投資', location: '砂漠',
    onEnter: 'open_town_invest_desert',
    choices: []
  },
  town_invest_snow: {
    emoji: '❄️', title: '雪山の集落 投資', location: '雪山',
    onEnter: 'open_town_invest_snow',
    choices: []
  },

  village_legend_shop: {
    emoji: '⚔️', title: '伝説の武器屋「ミスリルの館」', location: '出発の村',
    type: 'shop', shopId: 'village_legend_shop', backScene: 'village',
    text: '「ようこそ！世界中を旅して集めた最強の装備を揃えた。\nこれを装備すれば、神さえも倒せるかもしれない」\n\n白髭の伝説的商人・ライオスが自慢げに語った。',
    choices: []
  },

  desert_material_shop_scene: {
    emoji: '🪨', title: '素材専門店', location: '砂漠',
    type: 'shop', shopId: 'desert_material_shop', backScene: 'desert_oasis',
    text: '「砂漠で採れるレアな素材を扱ってる。\n竜の鱗に古代鉱石——普通じゃ手に入らないものばかりだ」',
    choices: []
  },

  desert_magic_shop_scene: {
    emoji: '📚', title: '魔法書店', location: '砂漠',
    type: 'shop', shopId: 'desert_magic_shop', backScene: 'desert_oasis',
    text: '「砂漠の魔法師が長年集めた魔法書じゃ。\n装備すれば属性魔法の威力が格段に増す！\n「アクセサリー」として扱われるぞ」',
    choices: []
  },

  desert_secret_dungeon: {
    emoji: '⚱️', title: '砂漠の秘密ダンジョン 入口', location: '砂漠 地下',
    text: `砂漠の地下深くに広がる遺跡群——「砂の迷宮」。\n\n壁に刻まれた古代文字には「偉大なる番人が財宝を守る」とある。\n\n強力な「砂漠の番人」が待ち受けているが、\n倒せば伝説の財宝が手に入るという。\n\n【弱点: ❄️氷属性】`,
    choices: [
      { text: '⚔️ 番人に挑む', action: 'fight_desert_warden' },
      { text: '↩️ オアシスへ戻る', next: 'desert_oasis' },
    ]
  },

  snow_skill_forge_scene: {
    emoji: '🗡️', title: 'スキル鍛錬所', location: '雪山',
    onEnter: 'open_skill_forge',
    choices: []
  },

  snow_summon_tent_scene: {
    emoji: '🔮', title: '召喚師のテント', location: '雪山',
    type: 'shop', shopId: 'snow_summon_shop', backScene: 'snow_village',
    text: '「魔法の宝玉に召喚の力を封じ込めた。\n装備すれば身体能力が大幅に向上する——\n召喚師の魔力が宿っているから」',
    choices: []
  },

  snow_ice_dungeon: {
    emoji: '🧊', title: '氷の秘密ダンジョン 入口', location: '雪山 氷窟',
    text: `雪山の奥地——「永久氷窟」。\n\n何百年も封印されていた極寒の迷宮だ。\n\n奥深くに「氷の番人」が眠っており、\n倒せば氷の精霊が宿る秘宝が手に入るという。\n\n【弱点: 🔥火属性】`,
    choices: [
      { text: '⚔️ 番人に挑む', action: 'fight_ice_warden' },
      { text: '↩️ 集落へ戻る', next: 'snow_village' },
    ]
  },

  desert_arena_expert: {
    emoji: '🏟️', title: '闘技場 エキスパート戦', location: '砂漠 闘技場支部',
    text: `闘技場エキスパートコース——腕に覚えのある者だけが挑める。\n\n強大な古代の戦士が待ち受けている。\nEXP×3倍・ゴールド×3倍のボーナスが得られるが、\n敵も相応に強力だ。`,
    choices: [
      { text: '⚔️ 挑戦する', action: 'start_desert_arena_expert' },
      { text: '↩️ オアシスへ戻る', next: 'desert_oasis' },
    ]
  },

  // エンディング振り分け（フラグチェック後に即別シーンへ遷移）
  // ── クリア後コンテンツ ──
  post_clear_hub: {
    emoji: '🌟', title: 'クリア後の世界', location: '平和な世界',
    text: `魔王討伐から時が経った。\n\n世界に平和が戻り、人々は笑顔を取り戻した。\nしかし——アレクはまだ旅を続けている。\n\n世界の至る所に、まだ謎が残されている。\n新たな伝説が、幕を開けようとしていた。\n\n【クリア後コンテンツ一覧】\n🏔️ 神々の塔 ── 10フロアの最強ダンジョン\n🏺 砂漠の隠し部屋 ── 古の魔神バアル\n⬛ 虚無の地 ── 全属性無効の番人ヴォイド\n♾️ 無限の試練 ── どこまで進めるか挑戦！`,
    choices: [
      { text: '🏔️ 神々の塔へ向かう', next: 'gods_tower_hub', needFlag: 'demonKingDefeated' },
      { text: '🏺 砂漠の隠し部屋へ', next: 'desert_hidden',  needFlag: 'demonKingDefeated' },
      { text: '⬛ 虚無の地へ',       next: 'void_map',       needFlag: 'demonKingDefeated' },
      { text: '♾️ 無限の試練へ',      next: 'endless_trial_hub', needFlag: 'demonKingDefeated' },
      { text: '📜 エピローグを見る',  next: 'epilogue',       needFlag: 'demonKingDefeated' },
      { text: '🚁 飛行船商人に会う', next: 'airship_dealer', needFlag: 'demonKingDefeated' },
      { text: '☁️ 天空の浮遊島へ',   next: 'sky_island_hub', needFlag: 'vehicleAirship' },
      { text: '🏘️ 村へ戻る',         next: 'village' },
    ]
  },

  gods_tower_hub: {
    emoji: '🏔️', title: '神々の塔 入口', location: '神々の塔',
    text: `空高くそびえる白亜の塔——「神々の塔」。\n\n魔王を倒したことで、この塔への封印が解けた。\n\n全10フロアで構成され、各フロアには神に仕える\n最強の守護者たちが待ち受けている。\n\n頂上（10F）には伝説の神龍「ゴッドドラゴン」が眠るという。\n倒せば最強の武器「神龍の剣」が手に入る！\n\n各フロア攻略後は無料で全回復できる。\n恐れるな——行くぞ！`,
    choices: [
      { text: '⚔️ 塔に挑む', action: 'enter_gods_tower' },
      { text: '↩️ 戻る',     next: 'post_clear_hub' },
    ]
  },

  desert_hidden: {
    emoji: '🏺', title: '砂漠の秘密の遺跡', location: '砂漠・秘密の遺跡',
    text: `砂漠の奥深く——古代の遺跡の中に隠された部屋を発見した。\n\n壁の至る所に禁忌の魔法陣が刻まれ、\n不気味な力が部屋中に充満している。\n\n「——貴様...ここまで来たか。\n魔王すら倒した勇者か。面白い。\n俺に挑む気があるか？」\n\n声の主——古の魔神「バアル」が姿を現した。\n闇属性を吸収し、光属性が弱点の強大な存在だ。\n\n覚悟はいいか？`,
    choices: [
      { text: '⚔️ バアルに挑戦する！', action: 'fight_ancient_baal' },
      { text: '↩️ 戻る',               next: 'post_clear_hub' },
    ]
  },

  void_map: {
    emoji: '⬛', title: '虚無の地・最深部', location: '虚無の地',
    text: `何もない空間が広がる——「虚無の地」。\n\nここは現実と異界の狭間に存在する場所だ。\n\n遠くに巨大な黒い影が見える。\n「虚無の番人ヴォイド」——この地を守護する存在だ。\n\n警告: 全ての属性魔法が無効化される！\n物理攻撃と属性無視スキルのみ有効！\n\n最強の番人を倒せば「虚無の鎧」を手に入れられる。`,
    choices: [
      { text: '⚔️ ヴォイドに挑戦する！', action: 'fight_void_warden' },
      { text: '↩️ 戻る',                 next: 'post_clear_hub' },
    ]
  },

  endless_trial_hub: {
    emoji: '♾️', title: '無限の試練', location: '無限の試練場',
    text: 'どこまでも続く——無限の戦いの場。\n\n波状攻撃で敵が無限に押し寄せる。\n10波ごとに強力なボスが出現する！\n\n報酬は波数に応じて増加していく。\nどこまで進めるか挑戦しよう！',
    onEnter: 'endless_trial_hub_refresh',
    choices: [
      { text: '⚔️ 試練に挑む（Wave 1から）', action: 'start_endless_trial' },
      { text: '↩️ 戻る',                      next: 'post_clear_hub' },
    ]
  },

  epilogue: {
    emoji: '🌅', title: 'エピローグ 〜それぞれの明日〜', location: '',
    text: `長い冒険が、終わった。\n\n【アリア】\n魔王討伐後、アリアは王国へ戻り剣の訓練所を開いた。\n「アレクに教わったことを、次の世代に伝えたい」\n今日も若き剣士たちが彼女の元で学んでいる。\n\n【ガイアス】\nガイアスは故郷の国境警備隊長となった。\n「俺たちが守ったこの平和を、絶対に守り続ける」\n鋼の意志は変わらず、英雄として語られる。\n\n【ルナ】\nルナは各地を旅する吟遊詩人となった。\n「この冒険の物語を、世界中に伝えるの」\n彼女の詩は人々に平和と希望をもたらしている。\n\n【ソラ】\nソラはルナと共に旅を続けている。\n「二人で一緒に、世界を見て回ろう」\n双子の星は今日も輝き続けている。\n\n【セラフィナ】\nセラフィナは聖女として王都の神殿に仕えている。\n「みんなの健康を守ることが私の使命」\n彼女の癒しの力は今も多くの人を救っている。\n\n【ゼフィロス】\nゼフィロスは魔法学校を創設した。\n「若い才能を育て、次の世代の賢者を生み出す」\n彼の教えは次の時代の礎となっていく。\n\n【アレク】\nそして、アレク。\n彼は今日も世界のどこかを旅している。\n平和を守るために、新たな冒険へ——\n\n「俺の冒険は、まだ終わっていない」\n\n────────────────────────\n🌟 真の勇者の伝説は、こうして続いていく。`,
    choices: [
      { text: '→ 冒険を続ける', next: 'post_clear_hub' },
    ]
  },

  ending_router: {
    emoji: '✨', title: '...', location: '',
    text: '',
    onEnter: 'route_ending',
    choices: []
  },

  // ── TRUE ENDING ──
  ending_true: {
    emoji: '🌟', title: 'TRUE ENDING 〜父の遺志、受け継がれて〜', location: '',
    text: `魔王ダークロスを倒した！！\n\n城全体が揺れ、黒い炎が次々と消えていく。\n\n「な...なぜだ...まさか私が...負けるとは...」\n\n魔王の体が光の粒子となり、空へ溶けていった。\n\n次の瞬間——眩い光の柱が天を貫いた。\n\nアレクの胸に、温かく懐かしい光が宿る。\n——これは...父の魔力だ。\n\n光の中に、一人の男の影が浮かんだ。\n若き勇者——父・アロンだ。\n\n「よくやった、アレク。\nお前は成し遂げた——俺の果たせなかった夢を」\n\n影は静かに微笑み、光に包まれて消えていった。\n\n黒雲が晴れ、眩しいほどの青空が広がる。\n世界中に光が溢れていく。\n\n王国の民が歓喜の声を上げ、鐘が鳴り響く。\n雪山の人々も、砂漠の民も、老いた船乗りも——\n皆が空を見上げ、遠い勝利を感じ取った。\n\n「ありがとう...父さん」\n\nアレクは剣を地に突き立て、空に向かってつぶやいた。\n涙が、頬を伝った。\n\n\n━━━━━━━━━━━━━━━━━━━━━━━\n✨ TRUE ENDING クリアおめでとう！ ✨\n〜 父の遺志、受け継がれて 〜\n━━━━━━━━━━━━━━━━━━━━━━━`,
    choices: [
      { text: '★ 冒険を続ける（クリア後コンテンツへ）', next: 'post_clear_hub' },
      { text: '🔄 最初からプレイする', action: 'restart' },
    ]
  },

  // ── RUSH ENDING ──
  ending_rush: {
    emoji: '🌙', title: 'ENDING 〜孤独な勝利〜', location: '',
    text: `魔王ダークロスを倒した！！\n\n城全体が揺れ、黒い炎が消えていく。\n\n「な...なぜだ...私が...」\n\n魔王の体が光の粒子となって消えた。\n\n力を使い果たしたアレクはその場に膝をついた。\n\n...外の世界はまだ傷ついている。\n各地に魔物の残党がいるはずだ。\n雪山も、砂漠も、深海も——\nまだ闇の影響が残っているかもしれない。\n\n「でも...魔王は倒した」\n\nそれだけは確かだ。\nやがて世界は自力で回復していくだろう。\n\nアレクは重い体を引きずりながら、城を後にした。\n——長い、長い帰り道が始まった。\n\n真のエンディングを見るには...\n雪山・砂漠・海底神殿を探索し、長老の話を聞いてみよう。\n\n\n━━━━━━━━━━━━━━━━━━━\n🌙 ENDING 〜孤独な勝利〜\nクリアおめでとうございます！\n━━━━━━━━━━━━━━━━━━━`,
    choices: [
      { text: '★ 冒険を続ける（クリア後コンテンツへ）', next: 'post_clear_hub' },
      { text: '🔄 最初からプレイする', action: 'restart' },
    ]
  },

  // ── NORMAL GOOD ENDING ──
  ending_good: {
    emoji: '🌅', title: 'ENDING 〜光の勝利〜', location: '',
    text: `魔王ダークロスを倒した！！\n\n城全体が揺れ、黒い炎が次々と消えていく。\n\n「な...なぜだ...私が...負けるとは...」\n\n魔王の体が光の粒子となり、\nゆっくりと空に溶けていった。\n\n—— 空に穿たれた黒雲が晴れ、\n久しぶりの青空が広がった。\n\n「...終わった。やっと、終わったんだ」\n\nアレクは剣を鞘に収め、眩しそうに空を見上げた。\n\n王国の人々は歓喜し、祝福の鐘が鳴り響く。\n勇者アレクの名は、永遠に語り継がれることになった。\n\n真のエンディングを見るには...\n雪山・砂漠・海底神殿を全て攻略し、長老の話も聞いてみよう。\n\n\n━━━━━━━━━━━━━━━━━━━\n🎉 クリアおめでとうございます！ 🎉\n━━━━━━━━━━━━━━━━━━━`,
    choices: [
      { text: '★ 冒険を続ける（クリア後コンテンツへ）', next: 'post_clear_hub' },
      { text: '🔄 最初からプレイする', action: 'restart' },
    ]
  },

};

// ============================================================
//  ゲーム状態
// ============================================================

function createInitialState() {
  return {
    player: {
      name: '勇者アレク',
      hp: 100, maxHp: 100,
      mp: 30,  maxMp: 30,
      level: 1,
      exp: 0,
      gold: 100,
      baseAtk: 15,
      baseDef: 5,
      baseMatk: 20,
      equipment: { weapon: null, head: null, body: null, acc1: null, acc2: null },
      enhancements: {},
      items: [{ id: 'herb', count: 3 }],
    },
    currentScene: 'village',
    flags: { vis_village: true },
    inBattle: false,
    enemy: null,
    postBattleScene: null,
    battleTurn: 'player',
    enemyPhase2: false,
    playerStatus: null,
    enemyStatus: null,
    playerGuard: false,
    ironWallTurns: 0,
    partyShieldActive: false,
    reflectActive: false,
    berserkTurns: 0,
    hiddenEnemyPending: null,
    levelingClears: {},
    levelingMode: null,
    companion: null,
    companions: { gaius: null, luna: null, sola: null, serafina: null, zephiros: null },
    buffs: {
      gaiusTauntTurns: 0, gaiusIronStance: false, gaiusVanguard: false,
      lunaStarGuardTurns: 0, lunaMoonBuffTurns: 0,
      solaDebuffTurns: 0, solaStunned: false,
      serafinaSanctuaryTurns: 0,
      zephirosMatkDoubleTurns: 0, zephirosMagicBarrierTurns: 0,
    },
    companionTurnQueue: [],
    companionTurnIdx: 0,
    quests: {},
    monsterBook: {},
    bondExp: {},
    bondLevel: {},
    formation: 'balanced',
    titles: {},
    totalBattles: 0,
    usedSkills: {},
    discoveredRecipes: {},
    enchants: {},
    comboAtkBuff: 0,
    comboSanctuary: 0,
    comboStatBuff: 0,
    comboUsedThisBattle: false,
    godsTowerMode: null,
    towerProgress: 0,
    endlessTrialMode: null,
    endlessTrialMaxWave: 0,
    adminMult: { eHp: 1, eAtk: 1, eDef: 1, exp: 1, gold: 1, shop: 1 },
    townDev: { village: 0, desert: 0, snow: 0 },
    vehicles: { horse: false, ship: false, airship: false },
    season: 'spring',
    seasonBattleCount: 0,
    gacha: { pityCount: 0, totalPulls: 0, history: [] },
  };
}

let gs = createInitialState();

// ============================================================
//  ユーティリティ
// ============================================================

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }

const EQUIP_SLOTS = ['weapon', 'head', 'body', 'acc1', 'acc2'];

function getEquipBonus(target, stat) {
  return EQUIP_SLOTS.reduce((sum, s) => {
    const id = target.equipment[s];
    if (!id || !ITEM_DATA[id]) return sum;
    const base = ITEM_DATA[id][stat] || 0;
    const enhLv = gs.player.enhancements[id] || 0;
    const enh = enhLv > 0 && base > 0 ? enhLv * Math.max(1, Math.floor(base * 0.15)) : 0;
    return sum + base + enh;
  }, 0);
}

function getEnchantBonus(stat) {
  let bonus = 0;
  const enchants = gs.enchants || {};
  Object.entries(enchants).forEach(([equipId, enchantId]) => {
    const ench = ENCHANT_DATA[enchantId];
    if (ench?.bonus?.[stat]) bonus += ench.bonus[stat];
  });
  return bonus;
}

function getSeasonData() { return SEASON_DATA[gs.season || 'spring'] || SEASON_DATA.spring; }

function getAtk()  {
  const base = gs.player.baseAtk  + getEquipBonus(gs.player, 'atk') + getEnchantBonus('atk');
  const luna = gs.buffs?.lunaStarGuardTurns > 0 ? Math.floor(base * 1.5) : base;
  const berserk = gs.berserkTurns > 0 ? Math.floor(luna * 2) : luna;
  const combo = gs.comboAtkBuff > 0 ? Math.floor(berserk * 1.5) : berserk;
  const stat  = gs.comboStatBuff > 0 ? Math.floor(combo * 1.2) : combo;
  return Math.floor(stat * getFormationMult('atk') * getBondStatMult('atk') * getSeasonData().atkMult);
}
function getDef()  {
  const base = gs.player.baseDef  + getEquipBonus(gs.player, 'def') + getEnchantBonus('def');
  const luna = gs.buffs?.lunaMoonBuffTurns > 0 ? Math.floor(base * 1.3) : base;
  const berserk = gs.berserkTurns > 0 ? Math.max(1, Math.floor(luna * 0.5)) : luna;
  const stat  = gs.comboStatBuff > 0 ? Math.floor(berserk * 1.2) : berserk;
  return Math.floor(stat * getFormationMult('def') * getBondStatMult('def') * getSeasonData().defMult);
}
function getMatk() {
  const base = gs.player.baseMatk + getEquipBonus(gs.player, 'matk') + getEnchantBonus('matk');
  const luna = gs.buffs?.lunaStarGuardTurns > 0 ? Math.floor(base * 1.5) : base;
  const stat  = gs.comboStatBuff > 0 ? Math.floor(luna * 1.2) : luna;
  return Math.floor(stat * getFormationMult('matk') * getBondStatMult('matk') * getSeasonData().matkMult);
}

function getCompanionById(id) {
  if (id === 'aria') return gs.companion;
  return gs.companions?.[id] || null;
}
function getCompanionAtk(id)  {
  const c = getCompanionById(id);
  const base = c ? c.baseAtk  + getEquipBonus(c, 'atk')  : 0;
  return gs.buffs?.lunaStarGuardTurns > 0 ? Math.floor(base * 1.5) : base;
}
function getCompanionDef(id)  {
  const c = getCompanionById(id);
  const base = c ? c.baseDef  + getEquipBonus(c, 'def')  : 0;
  return gs.buffs?.lunaMoonBuffTurns > 0 ? Math.floor(base * 1.3) : base;
}
function getCompanionMatk(id) {
  const c = getCompanionById(id);
  let base = c ? c.baseMatk + getEquipBonus(c, 'matk') : 0;
  if (gs.buffs?.lunaStarGuardTurns > 0) base = Math.floor(base * 1.5);
  if (id === 'zephiros' && gs.buffs?.zephirosMatkDoubleTurns > 0) base = Math.floor(base * 2);
  return base;
}

function hasItem(id) {
  return gs.player.items.some(i => i.id === id && i.count > 0);
}
function addItem(id, count = 1) {
  const existing = gs.player.items.find(i => i.id === id);
  if (existing) existing.count += count;
  else gs.player.items.push({ id, count });
}
function removeItem(id, count = 1) {
  const item = gs.player.items.find(i => i.id === id);
  if (item) {
    item.count -= count;
    if (item.count <= 0) gs.player.items = gs.player.items.filter(i => i.id !== id);
  }
}

function makeEnemy(id) {
  const e = JSON.parse(JSON.stringify(ENEMY_DATA[id]));
  e._id = id;
  return e;
}

function getRandomEnemy(area) {
  const pool = AREA_ENEMIES[area] || ['slime'];
  const id = pool[Math.floor(Math.random() * pool.length)];
  const enemy = makeEnemy(id);
  return scaleEnemyToPlayerLevel(enemy);
}

function scaleEnemyToPlayerLevel(enemy) {
  const lv = gs.player.level;
  if (lv <= 10) return enemy;
  const scale = lv / 10;
  enemy.maxHp   = Math.round(enemy.maxHp   * scale);
  enemy.hp      = enemy.maxHp;
  enemy.attack  = Math.round(enemy.attack  * scale);
  enemy.defense = Math.round(enemy.defense * scale);
  enemy.exp     = Math.round(enemy.exp     * scale);
  enemy.gold    = Math.round(enemy.gold    * scale);
  if (enemy.skill?.damage) enemy.skill.damage = Math.round(enemy.skill.damage * scale);
  return enemy;
}

// ============================================================
//  画面更新
// ============================================================

function fmtNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 10_000)    return Math.floor(n / 1000) + 'K';
  return String(n);
}

function updateStatus() {
  updateSeasonDisplay();
  const p = gs.player;
  const isMaxLv = p.level >= 999;
  document.getElementById('player-level-display').textContent = isMaxLv ? 'Lv. 999 MAX' : `Lv. ${p.level}`;
  document.getElementById('hp-text').textContent  = `${fmtNum(p.hp)}/${fmtNum(p.maxHp)}`;
  document.getElementById('mp-text').textContent  = `${fmtNum(p.mp)}/${fmtNum(p.maxMp)}`;
  document.getElementById('exp-text').textContent = isMaxLv ? 'MAX' : `${fmtNum(p.exp)}/${fmtNum(EXP_TABLE[p.level])}`;

  document.getElementById('hp-bar').style.width  = `${clamp(p.hp / p.maxHp * 100, 0, 100)}%`;
  document.getElementById('mp-bar').style.width  = `${clamp(p.mp / p.maxMp * 100, 0, 100)}%`;
  const expPct = isMaxLv ? 100 : (p.exp / EXP_TABLE[p.level] * 100);
  document.getElementById('exp-bar').style.width = `${clamp(expPct, 0, 100)}%`;

  document.getElementById('stat-atk').textContent  = getAtk();
  document.getElementById('stat-def').textContent  = getDef();
  document.getElementById('stat-matk').textContent = getMatk();
  document.getElementById('stat-gold').textContent = p.gold;

  // Equipment display
  const eq = p.equipment;
  const enhSuffix = id => {
    const lv = gs.player.enhancements[id] || 0;
    const ench = gs.enchants?.[id] ? ' ' + (ENCHANT_DATA[gs.enchants[id]]?.emoji || '✨') : '';
    return (lv > 0 ? ` +${lv}` : '') + ench;
  };
  [
    ['weapon', '武器', '鉄の剣'],
    ['head',   '頭',   'なし'],
    ['body',   '体',   '布の服'],
  ].forEach(([slot, label, def]) => {
    const id = eq[slot];
    const el = document.getElementById(`equip-${slot}`);
    if (!el) return;
    el.textContent = `${label}: ${id ? ITEM_DATA[id].emoji + ' ' + ITEM_DATA[id].name + enhSuffix(id) : def}`;
    el.className = id ? 'equip-highlight' : '';
  });
  const accEl = document.getElementById('equip-acc');
  if (accEl) {
    const a1 = eq.acc1 ? ITEM_DATA[eq.acc1].emoji + ' ' + ITEM_DATA[eq.acc1].name + enhSuffix(eq.acc1) : 'なし';
    const a2 = eq.acc2 ? ITEM_DATA[eq.acc2].emoji + ' ' + ITEM_DATA[eq.acc2].name + enhSuffix(eq.acc2) : 'なし';
    accEl.textContent = `アクセ: ${a1} / ${a2}`;
    accEl.className = (eq.acc1 || eq.acc2) ? 'equip-highlight' : '';
  }

  // Inventory
  const invEl = document.getElementById('inventory-list');
  if (p.items.length === 0) {
    invEl.innerHTML = '<span class="inv-empty">（なし）</span>';
  } else {
    invEl.innerHTML = p.items.map(i => {
      const d = ITEM_DATA[i.id];
      if (!d) return '';
      const isKey = d.type === 'key' || d.type === 'special';
      const isMat = d.type === 'material';
      return `<div class="inv-item-row${isKey ? ' key-item' : isMat ? ' mat-item' : ''}">
        <span class="inv-item-name">${d.emoji} ${d.name}</span>
        <span class="inv-item-count">${i.count > 1 ? `x${i.count}` : ''}</span>
      </div>`;
    }).join('');
  }

  updateAriaStatus();
  ['gaius','luna','sola','serafina','zephiros'].forEach(id => updateCompanionStatusBox(id));
}

function showToast(msg, duration = 2200) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), duration);
}

// ============================================================
//  シーン管理
// ============================================================

function gotoScene(sceneId) {
  if (!SCENES[sceneId]) { console.warn('Unknown scene:', sceneId); return; }

  // 鍵のチェック
  const scene = SCENES[sceneId];
  if (scene.requires?.item && !hasItem(scene.requires.item)) {
    gotoScene(scene.requires.failScene);
    return;
  }

  gs.currentScene = sceneId;

  if (typeof SoundEngine !== 'undefined') SoundEngine.updateBGMForScene(sceneId);

  // 訪問クエスト進捗・称号チェック
  updateQuestProgress('visit', { scene: sceneId });
  checkTitles();

  // ワープ訪問フラグ
  const _wdest = WARP_DESTINATIONS.find(d => d.sceneId === sceneId);
  if (_wdest) gs.flags[_wdest.flag] = true;

  renderScene(scene);

  // onEnterイベント
  if (scene.onEnter) handleSceneEvent(scene.onEnter);
}

function renderScene(scene) {
  // バトルUI を隠す
  document.getElementById('battle-area').classList.add('hidden');
  document.getElementById('warp-area').classList.add('hidden');
  document.getElementById('choices-area').classList.remove('hidden');
  document.getElementById('shop-area').classList.add('hidden');
  document.getElementById('smith-area').classList.add('hidden');
  document.getElementById('equip-change-area').classList.add('hidden');
  document.getElementById('quest-board-area').classList.add('hidden');
  document.getElementById('monster-book-area').classList.add('hidden');
  document.getElementById('bond-area').classList.add('hidden');
  document.getElementById('formation-area').classList.add('hidden');
  document.getElementById('title-list-area').classList.add('hidden');
  document.getElementById('alchemy-area').classList.add('hidden');
  document.getElementById('story-text-area').classList.remove('hidden');

  // シーンヘッダー
  document.getElementById('scene-emoji-display').textContent = scene.emoji || '❓';
  document.getElementById('scene-title-display').textContent = scene.title || '';

  // テキスト
  document.getElementById('story-text').textContent = scene.text || '';

  // 現在地
  if (scene.location !== undefined) {
    document.getElementById('location-display').textContent = scene.location || '———';
  }

  // ショップ
  if (scene.type === 'shop') {
    renderShop(scene);
    return;
  }

  // 鍛冶屋
  if (scene.type === 'smith') {
    renderSmith(scene);
    return;
  }

  // 錬金術師
  if (scene.type === 'alchemy') {
    renderAlchemy(scene);
    return;
  }

  // 選択肢
  renderChoices(scene.choices || []);
}

function renderChoices(choices) {
  const area = document.getElementById('choices-area');
  area.innerHTML = '';

  // 常時表示の装備ボタン
  const equipBtn = document.createElement('button');
  equipBtn.className = 'choice-btn equip-quick-btn';
  equipBtn.textContent = '🗡️ 装備を変える';
  equipBtn.onclick = openEquipScreen;
  area.appendChild(equipBtn);

  // ワープボタン（Lv10習得後）
  if (gs.flags.warpLearned) {
    const warpBtn = document.createElement('button');
    warpBtn.className = 'choice-btn warp-quick-btn';
    warpBtn.textContent = '🔮 ワープ魔法';
    warpBtn.onclick = openWarpScreen;
    area.appendChild(warpBtn);
  }

  // クエスト掲示板ボタン
  const questBtn = document.createElement('button');
  questBtn.className = 'choice-btn quest-quick-btn';
  questBtn.textContent = '📋 クエスト掲示板';
  questBtn.onclick = openQuestBoard;
  area.appendChild(questBtn);

  // 称号ボタン
  const titleBtn = document.createElement('button');
  titleBtn.className = 'choice-btn title-quick-btn';
  const obtainedCount = TITLE_DATA.filter(t => gs.titles?.[t.id]?.obtained).length;
  titleBtn.textContent = `🏆 称号 (${obtainedCount}/${TITLE_DATA.length})`;
  titleBtn.onclick = openTitleList;
  area.appendChild(titleBtn);

  // モンスター図鑑ボタン（初回撃破後）
  if (gs.monsterBook && Object.keys(gs.monsterBook).length > 0) {
    const bookBtn = document.createElement('button');
    bookBtn.className = 'choice-btn book-quick-btn';
    bookBtn.textContent = '📖 モンスター図鑑';
    bookBtn.onclick = openMonsterBook;
    area.appendChild(bookBtn);
  }

  // 乗り物ボタン（乗り物を所持している場合）
  const veh = gs.vehicles || {};
  if (veh.horse || veh.ship || veh.airship) {
    const vBtn = document.createElement('button');
    vBtn.className = 'choice-btn';
    const icons = [veh.airship ? '🚁' : '', veh.ship ? '⛵' : '', veh.horse ? '🐴' : ''].filter(Boolean).join('');
    vBtn.textContent = `${icons} 乗り物一覧`;
    vBtn.onclick = openVehicleScreen;
    area.appendChild(vBtn);
  }

  // 仲間との絆ボタン（仲間がいる場合）
  const hasAnyCompanion = (gs.companion && gs.companion.joined) ||
    Object.values(gs.companions || {}).some(c => c && c.joined);
  if (hasAnyCompanion) {
    const bondBtn = document.createElement('button');
    bondBtn.className = 'choice-btn bond-quick-btn';
    bondBtn.textContent = '💞 仲間との絆';
    bondBtn.onclick = openBondScreen;
    area.appendChild(bondBtn);

    const formBtn = document.createElement('button');
    formBtn.className = 'choice-btn form-quick-btn';
    const fName = FORMATION_DATA[gs.formation || 'balanced'].name;
    formBtn.textContent = `⚔️ 陣形：${fName}`;
    formBtn.onclick = openFormationScreen;
    area.appendChild(formBtn);
  }

  // 隠し宝箱・隠し部屋ボタン
  const ht = HIDDEN_TREASURES[gs.currentScene];
  if (ht) {
    const htBtn = document.createElement('button');
    htBtn.className = 'choice-btn explore-btn';
    const found = gs.flags[ht.flag];
    htBtn.textContent = found ? `🔍 調べた（${ht.title}）` : '🔍 周囲を調べる';
    htBtn.disabled = !!found;
    htBtn.onclick = () => investigateScene();
    area.appendChild(htBtn);
  }

  choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = c.text;

    // 条件チェック
    if (c.needItem && !hasItem(c.needItem)) {
      btn.disabled = true;
      btn.textContent += ' （アイテム不足）';
    }
    if (c.needLevel && gs.player.level < c.needLevel) {
      btn.disabled = true;
      btn.textContent += ` （Lv${c.needLevel}以上）`;
    }
    if (c.needFlag) {
      const negate = c.needFlag.startsWith('!');
      const flag = negate ? c.needFlag.slice(1) : c.needFlag;
      if (negate ? !!gs.flags[flag] : !gs.flags[flag]) btn.style.display = 'none';
    }
    if (c.needFlag2) {
      const negate = c.needFlag2.startsWith('!');
      const flag = negate ? c.needFlag2.slice(1) : c.needFlag2;
      if (negate ? !!gs.flags[flag] : !gs.flags[flag]) btn.style.display = 'none';
    }

    btn.onclick = () => handleChoice(c);
    area.appendChild(btn);
  });
}

function handleChoice(choice) {
  if (gs.inBattle) return;

  // ランダムエンカウント
  if (choice.encounterArea) {
    let rate = choice.encounterRate || 0.5;
    const v = gs.vehicles || {};
    if (v.airship) rate *= 0.3;
    else if (v.ship && choice.encounterArea === 'sea') rate *= 0.6;
    else if (v.horse && ['forest','cave','desert','snow','grasslands'].includes(choice.encounterArea)) rate *= 0.5;
    if (Math.random() < rate) {
      gs.postBattleScene = choice.next;
      const enemy = getRandomEnemy(choice.encounterArea);
      startBattle(enemy);
      return;
    }
  }

  if (choice.action) {
    executeAction(choice.action, choice);
    // バトルを開始しなかった場合のみ次のシーンへ遷移する
    if (!gs.inBattle && choice.next) {
      gotoScene(choice.next);
    }
    return;
  }
  if (choice.next) {
    gotoScene(choice.next);
  }
}

function executeAction(action, choice = {}) {
  switch (action) {
    // 装備
    case 'equip_staff':         equipItem('oldStaff');     break;
    case 'equip_hero_sword':    equipItem('heroSword');    break;
    case 'equip_ice_blade':
      if (!hasItem('iceBlade')) addItem('iceBlade');
      equipItem('iceBlade');
      break;
    case 'equip_thunder_staff':
      if (!hasItem('thunderStaff')) addItem('thunderStaff');
      equipItem('thunderStaff');
      break;
    case 'equip_ancient_blade': equipItem('ancientBlade'); break;
    case 'equip_spirit_armor':  equipItem('spiritArmor');  break;
    case 'equip_sea_armor':     equipItem('seaArmor');     break;

    // ボス戦
    case 'fight_boss_golem':
      gs.postBattleScene = 'cave_boss_defeated';
      startBattle(makeEnemy('stoneGolem'));
      break;
    case 'fight_boss_ice_queen':
      gs.postBattleScene = 'snow_boss_defeated';
      gs.enemyPhase2 = false;
      startBattle(makeEnemy('iceQueen'));
      break;
    case 'fight_boss_pharaoh':
      gs.postBattleScene = 'desert_boss_defeated';
      gs.enemyPhase2 = false;
      startBattle(makeEnemy('sandPharaoh'));
      break;
    case 'fight_boss_leviathan':
      gs.postBattleScene = 'sea_boss_defeated';
      gs.enemyPhase2 = false;
      startBattle(makeEnemy('leviathan'));
      break;
    case 'fight_boss_demon_lord':
      gs.postBattleScene = 'demon_castle_left_cleared';
      gs.enemyPhase2 = false;
      startBattle(makeEnemy('demonLord'));
      break;
    case 'fight_demon_king':
      gs.postBattleScene = 'ending_router';
      gs.enemyPhase2 = false;
      startBattle(makeEnemy('demonKing'));
      break;

    case 'start_leveling_deep_forest':  startLevelingBattle('deep_forest');   break;
    case 'start_leveling_ancient_ruins': startLevelingBattle('ancient_ruins'); break;
    case 'start_leveling_arena':         startArenaRun();                      break;
    case 'recover_forest': recoverAtSpot('🌊', '清らかな泉の水が全ての傷を癒す...'); break;
    case 'recover_ruins':  recoverAtSpot('🕯️', '古代の祭壇が放つ光が体を包んだ！'); break;
    case 'recover_arena':  recoverAtSpot('✨', '魔法陣の力が全身に満ち渡っていく！'); break;

    case 'inn_rest_village': innRest(100, '🏨', '赤い月亭'); break;
    case 'inn_rest_snow':    innRest(200, '🏨', '雪山の宿'); break;
    case 'inn_rest_sea':     innRest(300, '⚓', '港の宿屋'); break;

    case 'restart':
      restartGame();
      break;

    // ── クリア後コンテンツ ──
    case 'enter_gods_tower':
      startGodsTower();
      break;

    case 'fight_ancient_baal':
      gs.postBattleScene = 'desert_hidden';
      gs.hiddenEnemyPending = {
        flag: 'baalDefeated',
        reward: { items: ['demonGodRing'] },
        rewardText: '「魔神の指輪」を手に入れた！\n（全ステータス+50 アクセサリー）',
      };
      startBattle(makeEnemy('ancientBaal'));
      break;

    case 'fight_void_warden':
      gs.postBattleScene = 'void_map';
      gs.hiddenEnemyPending = {
        flag: 'voidWardenDefeated',
        reward: { items: ['voidArmor'] },
        rewardText: '「虚無の鎧」を手に入れた！\n（DEF+80・全ダメージ30%軽減 体防具）',
      };
      startBattle(makeEnemy('voidWarden'));
      break;

    case 'start_endless_trial':
      startEndlessTrial();
      break;

    case 'buy_horse':
      if (gs.vehicles?.horse) { showToast('馬はすでに持っています！'); return; }
      if (gs.player.gold < 3000) { showToast('ゴールドが足りません！（3000G必要）'); return; }
      gs.player.gold -= 3000;
      gs.vehicles.horse = true;
      gs.flags.vehicleHorse = true;
      updateStatus();
      saveGame();
      showLevelingPanel('🐴', '馬を購入！', '「これがあんたの馬だ！大切にしてくれよな」\n\nブライトンが手綱を手渡してくれた。\n\n🐴 馬を入手した！\n\n✦ 陸エリアのエンカウント率-50%\n✦ 大草原へのアクセス解放！');
      addLevelingBtn('🌾 大草原へ行く', '', () => gotoScene('grasslands_spot'));
      addLevelingBtn('↩️ 厩舎に戻る', '', () => gotoScene('village_stable'));
      break;

    case 'buy_airship':
      if (gs.vehicles?.airship) { showToast('飛行船はすでに持っています！'); return; }
      if (gs.player.gold < 1000000) { showToast('ゴールドが足りません！（1000000G必要）'); return; }
      gs.player.gold -= 1000000;
      gs.vehicles.airship = true;
      gs.flags.vehicleAirship = true;
      gs.flags.vis_sky_island = true;
      updateStatus();
      saveGame();
      showLevelingPanel('🚁', '飛行船を購入！', '「毎度あり！これが飛行船の鍵だ！」\n\n商人が満面の笑みで鍵を手渡した。\n\n🚁 飛行船を入手した！\n\n✦ 全エリアのエンカウント率-70%\n✦ ワープ魔法で未訪問の地にも移動可能\n✦ 天空の浮遊島へのアクセス解放！');
      addLevelingBtn('☁️ 天空の浮遊島へ', '', () => gotoScene('sky_island_hub'));
      addLevelingBtn('↩️ クリア後の世界へ戻る', '', () => gotoScene('post_clear_hub'));
      break;

    case 'start_leveling_grasslands':
      startLevelingBattle('grasslands');
      break;
    case 'start_leveling_south_island':
      startLevelingBattle('south_island');
      break;
    case 'start_leveling_sky_island':
      startLevelingBattle('sky_island');
      break;

    case 'recover_grasslands':
      gs.flags.grasslandsSpringUsed = true;
      gs.player.hp = gs.player.maxHp;
      gs.player.mp = gs.player.maxMp;
      if (gs.companion && gs.companion.joined) { gs.companion.hp = gs.companion.maxHp; gs.companion.mp = gs.companion.maxMp; }
      Object.values(gs.companions || {}).forEach(c => { if (c && c.joined) { c.hp = c.maxHp; c.mp = c.maxMp; } });
      updateStatus();
      updateAllCompanionsStatus();
      showToast('🌊 草原の泉で全回復した！');
      break;

    case 'open_gacha':
      openGachaScreen();
      break;

    case 'inn_free_village':
      gs.player.hp = gs.player.maxHp;
      gs.player.mp = gs.player.maxMp;
      if (gs.companion && gs.companion.joined) { gs.companion.hp = gs.companion.maxHp; gs.companion.mp = gs.companion.maxMp; }
      Object.values(gs.companions || {}).forEach(c => { if (c && c.joined) { c.hp = c.maxHp; c.mp = c.maxMp; } });
      updateStatus();
      updateAllCompanionsStatus();
      showLevelingPanel('🏨', '英雄の間', '「英雄よ、ゆっくり休んでいけ」\n\n宿の主人が微笑んだ。\n\nHP・MPが完全に回復した！');
      addLevelingBtn('↩️ 村に戻る', '', () => gotoScene('village'));
      break;

    case 'fight_desert_warden':
      gs.postBattleScene = 'desert_secret_dungeon';
      gs.hiddenEnemyPending = {
        flag: 'desertWardenDefeated',
        reward: { gold: 50000 },
        rewardText: '砂漠の番人を倒した！\n50000Gの財宝を手に入れた！',
      };
      startBattle(makeEnemy('desertWarden'));
      break;

    case 'fight_ice_warden':
      gs.postBattleScene = 'snow_ice_dungeon';
      gs.hiddenEnemyPending = {
        flag: 'iceWardenDefeated',
        reward: { gold: 50000 },
        rewardText: '氷の番人を倒した！\n50000Gの財宝を手に入れた！',
      };
      startBattle(makeEnemy('iceWarden'));
      break;

    case 'start_desert_arena_expert':
      startLevelingBattle('desert_arena_expert');
      break;
  }
}

// ============================================================
//  ショップ
// ============================================================

function renderShop(scene) {
  document.getElementById('choices-area').classList.add('hidden');
  document.getElementById('shop-area').classList.remove('hidden');

  let items = [...(SHOP_INVENTORY[scene.shopId] || [])];
  const dev = gs.townDev || {};
  if (scene.shopId === 'village_shop' && (dev.village || 0) >= 1)
    items = [...new Set([...items, ...SHOP_INVENTORY.village_shop_ext])];
  if (scene.shopId === 'desert_shop' && (dev.desert || 0) >= 1)
    items = [...new Set([...items, ...SHOP_INVENTORY.desert_shop_ext])];
  if (scene.shopId === 'snow_shop' && (dev.snow || 0) >= 2)
    items = [...new Set([...items, ...SHOP_INVENTORY.snow_shop_ext])];
  const listEl = document.getElementById('shop-items-list');
  listEl.innerHTML = '';

  items.forEach(id => {
    const d = ITEM_DATA[id];
    if (!d) return;
    const adjPrice = Math.max(1, Math.floor(d.price * (gs.adminMult?.shop || 1)));
    const canAfford = gs.player.gold >= adjPrice;
    const own = gs.player.items.find(i => i.id === id);
    const ownCount = own ? own.count : 0;

    const row = document.createElement('div');
    row.className = 'shop-item-row';
    const priceLabel = (gs.adminMult?.shop && gs.adminMult.shop !== 1)
      ? `<span style="text-decoration:line-through;color:#888;font-size:11px">${d.price}G</span> ${adjPrice}G`
      : `${adjPrice}G`;
    row.innerHTML = `
      <div class="shop-item-info">
        <div class="shop-item-name">${d.emoji} ${d.name} <span style="color:#888;font-size:11px">（所持: ${ownCount}）</span></div>
        <div class="shop-item-desc">${d.desc}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="shop-item-price">${priceLabel}</span>
        <button class="shop-buy-btn" ${canAfford ? '' : 'disabled'} onclick="buyItem('${id}')">購入</button>
      </div>`;
    listEl.appendChild(row);
  });

  document.getElementById('shop-back-btn').onclick = () => gotoScene(scene.backScene || 'village');
}

function buyItem(id) {
  const d = ITEM_DATA[id];
  if (!d) return;
  const adjPrice = Math.max(1, Math.floor(d.price * (gs.adminMult?.shop || 1)));
  if (gs.player.gold < adjPrice) return;
  gs.player.gold -= adjPrice;
  addItem(id);
  showToast(`${d.emoji} ${d.name} を購入しました！`);
  updateStatus();
  // 現在のシーン再描画（所持数更新のため）
  renderShop(SCENES[gs.currentScene]);
}

// ============================================================
//  鍛冶屋
// ============================================================

const SMITH_SUCCESS_RATES = [1.00, 0.95, 0.90, 0.80, 0.70, 0.60, 0.50, 0.40, 0.30, 0.20];

function smithyCost(id, currentLevel) {
  const d = ITEM_DATA[id];
  const base = d ? Math.max(50, Math.floor((d.price || 100) * 0.3)) : 100;
  return base * (currentLevel + 1);
}

function renderSmith(scene) {
  document.getElementById('choices-area').classList.add('hidden');
  document.getElementById('smith-area').classList.remove('hidden');

  const listEl = document.getElementById('smith-items-list');
  listEl.innerHTML = '';

  const eq = gs.player.equipment;
  const slots = [
    ['weapon', '武器'],
    ['head',   '頭防具'],
    ['body',   '体防具'],
    ['acc1',   'アクセ1'],
    ['acc2',   'アクセ2'],
  ];

  let hasAny = false;
  slots.forEach(([slot, label]) => {
    const id = eq[slot];
    if (!id || !ITEM_DATA[id]) return;
    const d = ITEM_DATA[id];
    if (d.type !== 'equipment') return;
    hasAny = true;

    const lv = gs.player.enhancements[id] || 0;
    const cost = smithyCost(id, lv);
    const maxLv = (gs.townDev?.village >= 3) ? 15 : 10;
    const rate = lv < maxLv ? Math.round(SMITH_SUCCESS_RATES[Math.min(lv, SMITH_SUCCESS_RATES.length - 1)] * 100) : 0;
    const canAfford = gs.player.gold >= cost;
    const maxed = lv >= maxLv;

    const row = document.createElement('div');
    row.className = 'smith-item-row';
    const lvLabel = lv > 0 ? `<span class="smith-enh-lv">+${lv}</span>` : '';
    row.innerHTML = `
      <div class="smith-item-info">
        <div class="smith-item-name">${d.emoji} ${d.name} ${lvLabel}<span style="color:#888;font-size:11px">（${label}）</span></div>
        <div class="smith-item-desc">${maxed ? '最大強化済み' : `強化費用: ${cost}G　成功率: ${rate}%`}</div>
      </div>
      <button class="smith-btn" ${maxed || !canAfford ? 'disabled' : ''} onclick="smithyEnhance('${id}')">
        ${maxed ? '完成' : `⚒️ 強化（${cost}G）`}
      </button>`;
    listEl.appendChild(row);
  });

  if (!hasAny) {
    listEl.innerHTML = '<div style="color:#888;padding:8px">装備中のアイテムがありません</div>';
  }

  // 特殊強化リスト
  renderEnchantList(scene);

  document.getElementById('smith-back-btn').onclick = () => closeSmithScreen(scene.backScene || 'village');
}

function renderEnchantList(scene) {
  const listEl = document.getElementById('smith-enchant-list');
  listEl.innerHTML = '';

  // 所持素材の表示
  const matIds = ['slimeGel','wolfFang','iceCrystal','sandCore','deepSeaScale','demonHorn'];
  const matLine = matIds.map(id => {
    const count = getItemCount(id);
    if (count <= 0) return null;
    const m = ITEM_DATA[id];
    return `${m.emoji}${m.name}×${count}`;
  }).filter(Boolean).join('  ');
  if (matLine) {
    const matEl = document.createElement('div');
    matEl.className = 'smith-mat-display';
    matEl.textContent = '所持素材: ' + matLine;
    listEl.appendChild(matEl);
  }

  Object.entries(ENCHANT_DATA).forEach(([enchantId, ench]) => {
    const matCount = getItemCount(ench.material);
    const mat = ITEM_DATA[ench.material];
    const canApply = gs.player.gold >= ench.cost && matCount >= ench.matCount;

    // どの装備に付与できるか
    let targetLabel = '';
    let targetEquipId = null;
    const eq = gs.player.equipment;
    if (ench.slot === 'weapon') {
      targetEquipId = eq.weapon;
      targetLabel = eq.weapon ? ITEM_DATA[eq.weapon]?.name || eq.weapon : '（武器未装備）';
    } else if (ench.slot === 'armor') {
      targetEquipId = eq.body || eq.head;
      const id = eq.body || eq.head;
      targetLabel = id ? ITEM_DATA[id]?.name || id : '（防具未装備）';
    } else {
      const id = eq.weapon || eq.body || eq.head || eq.acc1 || eq.acc2;
      targetEquipId = id;
      targetLabel = id ? ITEM_DATA[id]?.name || id : '（装備なし）';
    }

    const alreadyApplied = targetEquipId && gs.enchants?.[targetEquipId];

    const row = document.createElement('div');
    row.className = 'smith-enchant-row';
    row.innerHTML = `
      <div class="smith-enchant-hdr">
        <span class="se-emoji">${ench.emoji}</span>
        <span class="se-name">${ench.name}</span>
        ${alreadyApplied ? `<span class="se-applied">付与済: ${ENCHANT_DATA[alreadyApplied]?.name || '?'}</span>` : ''}
      </div>
      <div class="se-desc">${ench.desc}</div>
      <div class="se-cost">${mat.emoji}${mat.name}×${ench.matCount} + ${ench.cost}G（所持: ${matCount}個 / ${gs.player.gold}G）</div>
      <div class="se-target">対象: ${targetLabel}</div>
    `;

    const btn = document.createElement('button');
    btn.className = 'se-btn';
    const blocked = !canApply || !targetEquipId;
    btn.disabled = blocked;
    btn.textContent = blocked ? (targetEquipId ? '材料/G不足' : '対象装備なし') : `✨ 付与する`;
    btn.onclick = () => applyEnchant(enchantId, scene);
    row.appendChild(btn);
    listEl.appendChild(row);
  });
}

function applyEnchant(enchantId, scene) {
  const ench = ENCHANT_DATA[enchantId];
  if (!ench) return;

  if (gs.player.gold < ench.cost) { showToast('ゴールドが足りない！'); return; }
  if (getItemCount(ench.material) < ench.matCount) { showToast('素材が足りない！'); return; }

  const eq = gs.player.equipment;
  let targetEquipId = null;
  if (ench.slot === 'weapon') targetEquipId = eq.weapon;
  else if (ench.slot === 'armor') targetEquipId = eq.body || eq.head;
  else targetEquipId = eq.weapon || eq.body || eq.head || eq.acc1 || eq.acc2;

  if (!targetEquipId) { showToast('付与できる装備がない！'); return; }

  gs.player.gold -= ench.cost;
  for (let i = 0; i < ench.matCount; i++) removeItem(ench.material);

  gs.enchants[targetEquipId] = enchantId;
  const targetName = ITEM_DATA[targetEquipId]?.name || targetEquipId;
  showToast(`✨ 「${targetName}」に「${ench.name}」を付与した！`);
  updateStatus();
  renderSmith(scene);
}

function smithyEnhance(id) {
  const d = ITEM_DATA[id];
  if (!d) return;
  const lv = gs.player.enhancements[id] || 0;
  if (lv >= 10) return;
  const cost = smithyCost(id, lv);
  if (gs.player.gold < cost) { showToast('ゴールドが足りない！'); return; }
  gs.player.gold -= cost;

  const rate = SMITH_SUCCESS_RATES[lv];
  if (Math.random() < rate) {
    gs.player.enhancements[id] = lv + 1;
    showToast(`⚒️ ${d.name} が +${lv + 1} に強化された！`);
  } else {
    if (lv > 0) {
      gs.player.enhancements[id] = lv - 1;
      showToast(`💥 強化に失敗... ${d.name} が +${lv - 1} に戻った`);
    } else {
      showToast(`💥 強化に失敗... ${d.name} は変化なし`);
    }
  }
  updateStatus();
  checkTitles();
  renderSmith(SCENES[gs.currentScene]);
}

function closeSmithScreen(backScene) {
  document.getElementById('smith-area').classList.add('hidden');
  document.getElementById('choices-area').classList.remove('hidden');
  gotoScene(backScene || 'village');
}

// ============================================================
//  アイテム使用 / 装備
// ============================================================

function equipItem(id, inBattle = false) {
  const d = ITEM_DATA[id];
  if (!d || d.type !== 'equipment') return;
  equipItemTarget(id, d.slot || 'weapon', gs.player, 'player', inBattle);
}

function useItemInBattle(id) {
  const d = ITEM_DATA[id];
  if (!d || !hasItem(id)) return;
  const p = gs.player;

  document.getElementById('item-select').classList.add('hidden');
  document.getElementById('battle-buttons').classList.remove('hidden');

  if (d.effect === 'hp') {
    const healed = Math.min(d.value, p.maxHp - p.hp);
    p.hp = clamp(p.hp + d.value, 0, p.maxHp);
    removeItem(id);
    addBattleLog(`${d.emoji} ${d.name}を使った！ HPが${healed}回復した！`, 'log-heal');
    if (typeof SoundEngine !== 'undefined') SoundEngine.playSFX('heal');
  } else if (d.effect === 'mp') {
    const restored = Math.min(d.value, p.maxMp - p.mp);
    p.mp = clamp(p.mp + d.value, 0, p.maxMp);
    removeItem(id);
    addBattleLog(`${d.emoji} ${d.name}を使った！ MPが${restored}回復した！`, 'log-heal');
    if (typeof SoundEngine !== 'undefined') SoundEngine.playSFX('heal');
  } else if (d.effect === 'full') {
    p.hp = p.maxHp;
    p.mp = p.maxMp;
    removeItem(id);
    addBattleLog(`${d.emoji} ${d.name}を使った！ HPとMPが完全回復した！`, 'log-heal');
    if (typeof SoundEngine !== 'undefined') SoundEngine.playSFX('heal');
  } else if (d.effect === 'cure_status') {
    if (!gs.playerStatus) {
      addBattleLog('🧪 状態異常にはかかっていない。', 'log-info');
      setBattleButtons(true);
      return;
    }
    const label = getStatusLabel(gs.playerStatus.type);
    gs.playerStatus = null;
    removeItem(id);
    addBattleLog(`${d.emoji} ${d.name}を使った！ ${label}が回復した！`, 'log-heal');
    updateStatusDisplay();
  } else if (d.effect === 'revive_companion') {
    const dead = getAllDeadCompanions();
    if (dead.length === 0) {
      addBattleLog('🪶 戦闘不能の仲間がいない。', 'log-info');
      setBattleButtons(true);
      return;
    }
    showReviveTargetSelect(id, dead);
    return;
  } else if (d.effect === 'full_revive') {
    p.hp = p.maxHp;
    p.mp = p.maxMp;
    gs.playerStatus = null;
    if (gs.companion && gs.companion.hp <= 0) gs.companion.hp = gs.companion.maxHp;
    ['gaius','luna','sola','serafina','zephiros'].forEach(cid => {
      const c = gs.companions?.[cid];
      if (c && c.joined && c.hp <= 0) c.hp = c.maxHp;
    });
    removeItem(id);
    addBattleLog(`🌟 奇跡の薬を使った！ HP/MPが完全回復し、全員が蘇った！`, 'log-heal');
    updateStatusDisplay();
  } else if (d.type === 'special' && id === 'gemstone') {
    // 魔法の宝石: 魔王に80ダメージ
    const dmg = 80;
    gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
    removeItem(id);
    addBattleLog(`💎 魔法の宝石を使った！ 聖なる光が炸裂！`, 'log-system');
    addBattleLog(`${gs.enemy.name}に ${dmg} の聖ダメージ！！`, 'log-damage');
    updateBattleDisplay();
  } else {
    addBattleLog('このアイテムはここでは使えない。', 'log-info');
    return;
  }

  updateStatus();
  updateBattleDisplay();

  // 宝石使用後は敵が死んでいるかチェック
  if (gs.enemy && gs.enemy.hp <= 0) {
    setTimeout(() => endBattle(true), 600);
    return;
  }

  // 敵ターン（アリアが生きていれば先にアリア行動）
  afterPlayerTurn(700);
}

// ============================================================
//  戦闘アニメーション
// ============================================================

function showDamageNum(amount, variant) {
  const area = document.getElementById('damage-popup-area');
  if (!area) return;
  const el = document.createElement('div');
  el.className = 'damage-popup' + (variant === 'crit' ? ' crit' : variant === 'heal' ? ' heal' : '');
  el.textContent = variant === 'heal' ? `+${amount}` : `${amount}`;
  el.style.left = (22 + Math.random() * 56) + '%';
  el.style.top  = (30 + Math.random() * 30) + '%';
  area.appendChild(el);
  setTimeout(() => el.remove(), 1020);
}

function triggerBattleEffect(type) {
  const el = document.getElementById('battle-anim-overlay');
  if (!el) return;
  el.className = '';
  void el.offsetWidth;
  el.className = 'anim-' + type;
  setTimeout(() => { if (el.className === 'anim-' + type) el.className = ''; }, 560);
}

function flashEnemyHit() {
  const el = document.getElementById('enemy-display');
  if (!el) return;
  el.classList.remove('enemy-hit-flash');
  void el.offsetWidth;
  el.classList.add('enemy-hit-flash');
  setTimeout(() => el.classList.remove('enemy-hit-flash'), 560);
}

function flashPlayerHit() {
  const pb = document.getElementById('player-box');
  if (!pb) return;
  pb.classList.remove('player-hit-flash');
  void pb.offsetWidth;
  pb.classList.add('player-hit-flash');
  setTimeout(() => pb.classList.remove('player-hit-flash'), 500);
}

// ============================================================
//  バトルシステム
// ============================================================

function startBattle(enemy) {
  gs.inBattle = true;
  gs.enemy = enemy;
  gs.enemy.hp = gs.enemy.maxHp;
  // 管理者バランス倍率を適用
  if (gs.adminMult) {
    if (gs.adminMult.eHp !== 1) {
      gs.enemy.maxHp = Math.max(1, Math.floor(gs.enemy.maxHp * gs.adminMult.eHp));
      gs.enemy.hp = gs.enemy.maxHp;
    }
    if (gs.adminMult.eAtk !== 1)
      gs.enemy.attack = Math.max(1, Math.floor((gs.enemy.attack || 0) * gs.adminMult.eAtk));
    if (gs.adminMult.eDef !== 1)
      gs.enemy.defense = Math.max(0, Math.floor((gs.enemy.defense || 0) * gs.adminMult.eDef));
  }
  gs.battleTurn = 'player';
  gs.enemyPhase2 = false;
  gs.playerStatus = null;
  gs.enemyStatus = null;
  gs.playerGuard = false;
  gs.ironWallTurns = 0;
  gs.partyShieldActive = false;
  gs.companionTurnQueue = [];
  gs.companionTurnIdx = 0;
  gs.buffs = {
    gaiusTauntTurns: 0, gaiusIronStance: false, gaiusVanguard: false,
    lunaStarGuardTurns: 0, lunaMoonBuffTurns: 0,
    solaDebuffTurns: 0, solaStunned: false,
    serafinaSanctuaryTurns: 0,
    zephirosMatkDoubleTurns: 0, zephirosMagicBarrierTurns: 0,
  };
  gs.battleKillCount = 0;
  gs.comboAtkBuff = 0;
  gs.comboSanctuary = 0;
  gs.comboStatBuff = 0;
  gs.comboUsedThisBattle = false;
  // 仲間のスキルCDリセット
  if (gs.companion) gs.companion.shinkenCooldown = 0;
  Object.values(gs.companions || {}).forEach(c => { if (c) c.skillCooldowns = {}; });

  // UIの切り替え
  document.getElementById('story-text-area').classList.add('hidden');
  document.getElementById('choices-area').classList.add('hidden');
  document.getElementById('warp-area').classList.add('hidden');
  document.getElementById('shop-area').classList.add('hidden');
  document.getElementById('smith-area').classList.add('hidden');
  document.getElementById('equip-change-area').classList.add('hidden');
  document.getElementById('battle-area').classList.remove('hidden');

  document.getElementById('battle-log').innerHTML = '';
  document.getElementById('item-select').classList.add('hidden');
  document.getElementById('battle-equip-select').classList.add('hidden');
  document.getElementById('combo-select').classList.add('hidden');
  document.getElementById('battle-buttons').classList.remove('hidden');

  // コンボボタン: 仲間がいる場合のみ表示
  const hasComp = (gs.companion && gs.companion.joined) ||
    Object.values(gs.companions || {}).some(c => c && c.joined);
  const comboBtnWrap = document.getElementById('combo-btn-wrap');
  if (comboBtnWrap) comboBtnWrap.style.display = hasComp ? 'block' : 'none';

  updateBattleDisplay();
  updateAllCompanionsBattleStatus();
  setBattleButtons(true);

  const isBoss = enemy.isBoss ? '⚡ ボス戦！！ ' : '';
  addBattleLog(`${isBoss}${enemy.emoji} ${enemy.name} が現れた！`, 'log-system');

  const isFinalBoss = !!(enemy.isFinalBoss) || enemy._id === 'demonKing' || enemy.name?.includes('魔王ダークロス');
  if (typeof SoundEngine !== 'undefined') SoundEngine.startBattleBGM(enemy.isBoss, isFinalBoss);

  updateStatus();
}

function updateBattleDisplay() {
  const e = gs.enemy;
  if (!e) return;
  const pct = clamp(e.hp / e.maxHp * 100, 0, 100);
  document.getElementById('enemy-emoji-large').textContent = e.emoji || '👹';
  document.getElementById('enemy-name-display').textContent = e.name || '???';
  document.getElementById('enemy-hp-bar').style.width = `${pct}%`;
  document.getElementById('enemy-hp-bar').style.background =
    pct > 50 ? 'linear-gradient(90deg, #c02020, #e05050)' :
    pct > 25 ? 'linear-gradient(90deg, #a04000, #e08000)' :
               'linear-gradient(90deg, #800000, #c00000)';
  document.getElementById('enemy-hp-nums').textContent = `${e.hp}/${e.maxHp}`;
  const ed = document.getElementById('enemy-status-display');
  if (ed) { ed.textContent = gs.enemyStatus ? getStatusLabel(gs.enemyStatus.type) : ''; }
}

function setBattleButtons(enabled) {
  ['btn-attack', 'btn-magic', 'btn-item', 'btn-equip', 'btn-run'].forEach(id => {
    document.getElementById(id).disabled = !enabled;
  });
}

function addBattleLog(msg, cls = '') {
  const log = document.getElementById('battle-log');
  const line = document.createElement('p');
  line.textContent = msg;
  if (cls) line.className = cls;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

function calcDamage(atk, def) {
  const base = Math.max(1, atk - def + rand(-3, 3));
  const crit = Math.random() < 0.1;
  return { dmg: crit ? Math.floor(base * 1.5) : base, crit };
}

function battleAction(type) {
  if (!gs.inBattle || gs.battleTurn !== 'player') return;
  setBattleButtons(false);

  if (!processPlayerTurnStart()) return;

  if (type === 'attack')  playerAttack();
  else if (type === 'magic') playerMagic();
  else if (type === 'item')  playerOpenItemMenu();
  else if (type === 'equip') playerOpenBattleEquipMenu();
  else if (type === 'run')   playerRun();
}

function getWeaponEnchantEffect() {
  const weaponId = gs.player.equipment?.weapon;
  if (!weaponId) return null;
  const enchantId = gs.enchants?.[weaponId];
  return enchantId ? ENCHANT_DATA[enchantId]?.effect || null : null;
}

function playerAttack() {
  if (gs.enemyStatus?.type === 'sleep') {
    gs.enemyStatus = null;
    addBattleLog('💥 攻撃で眠りが覚めた！', 'log-system');
    updateStatusDisplay();
  }

  const weaponEffect = getWeaponEnchantEffect();
  let atkVal = getAtk();
  let extraCrit = false;
  if (weaponEffect === 'crit_bonus' && Math.random() < 0.20) {
    atkVal = Math.floor(atkVal * 1.8);
    extraCrit = true;
  }

  const { dmg, crit } = calcDamage(atkVal, gs.enemy.defense);
  gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
  const critTxt = (crit || extraCrit) ? '【会心の一撃！】 ' : '';
  addBattleLog(`⚔️ 攻撃した！ ${critTxt}${gs.enemy.name}に ${dmg} ダメージ！`, 'log-player');
  if (typeof SoundEngine !== 'undefined') SoundEngine.playSFX('attack');
  triggerBattleEffect('slash');
  showDamageNum(dmg, (crit || extraCrit) ? 'crit' : 'dmg');
  flashEnemyHit();

  if (weaponEffect === 'poison_atk' && Math.random() < 0.25 && !gs.enemyStatus) {
    gs.enemyStatus = { type: 'poison', turns: 4 };
    addBattleLog('☠️ 毒付与の刻印が発動！ 敵が毒状態に！', 'log-system');
    updateStatusDisplay();
  }

  updateBattleDisplay();

  // フェーズ2チェック
  checkDemonKingPhase2();

  if (gs.enemy.hp <= 0) {
    setTimeout(() => endBattle(true), 600);
    return;
  }
  afterPlayerTurn(700);
}

function playerMagic() {
  playerOpenSkillMenu();
}

// ── スキルメニュー ──────────────────────────────────────────
function playerOpenSkillMenu() {
  document.getElementById('battle-buttons').classList.add('hidden');
  const listEl = document.getElementById('skill-select-list');
  listEl.innerHTML = '';

  const skills = [
    { id: 'magic',      label: '✨ 魔法攻撃',    desc: 'MP10・魔法ダメージ',                mp: 10  },
    { id: 'guard',      label: '🛡️ ガード',      desc: 'MP不要・防御力2倍で受ける',         mp: 0   },
    { id: 'ironwall',   label: '🔒 鉄壁',        desc: 'MP15・3ターン被ダメ半減',           mp: 15  },
    { id: 'palpunte',   label: '🎲 パルプンテ',   desc: 'MP5・ランダム効果（何が起きるか…）',mp: 5   },
    { id: 'meteor',     label: '☄️🔥 メテオ',     desc: 'MP30・魔法力×2.5 [🔥火属性]',      mp: 30  },
    { id: 'timestop',   label: '⏱️ タイムストップ',desc: 'MP25・敵を3ターン完全停止',        mp: 25  },
    { id: 'reflect',    label: '🪞 リフレク',     desc: 'MP20・次の敵攻撃を反射',            mp: 20  },
    { id: 'drain',      label: '🩸 ドレイン',     desc: 'MP15・ダメージの60%をHP吸収',       mp: 15  },
    { id: 'teleport',   label: '🌀 テレポート',   desc: 'MP10・戦闘から必ず脱出',            mp: 10  },
    { id: 'ultima',     label: '💥☀️ アルテマ',   desc: 'MP50・魔法力×4 [☀️光属性]',        mp: 50  },
    { id: 'berserk',    label: '⚔️ バーサク',     desc: 'MP10・3ターン攻撃力2倍（防御半減）',mp: 10  },
    { id: 'confuse',    label: '🌀 コンフュ',     desc: 'MP18・敵を混乱させる',              mp: 18  },
    { id: 'bigbang',    label: '🌌🌑 ビッグバン', desc: 'MP60・敵現HPの40% [🌑闇属性]',     mp: 60  },
  ];
  if (gs.companion && gs.companion.hp > 0) {
    skills.push({ id: 'ariaShield', label: '🌟 聖なる盾', desc: 'アリア・1ターンパーティ被ダメ35%軽減', mp: 0, isAria: true });
  }

  skills.forEach(sk => {
    const btn = document.createElement('button');
    btn.className = 'equip-item-btn';
    const mpLabel = sk.mp > 0 ? ` (MP ${gs.player.mp}/${sk.mp})` : '';
    btn.disabled = sk.mp > 0 && gs.player.mp < sk.mp;
    btn.textContent = `${sk.label}  [${sk.desc}${mpLabel}]`;
    btn.onclick = () => {
      document.getElementById('skill-select').classList.add('hidden');
      document.getElementById('battle-buttons').classList.remove('hidden');
      if (!gs.usedSkills) gs.usedSkills = {};
      gs.usedSkills[sk.id] = true;
      if      (sk.id === 'magic')      playerMagicAttack();
      else if (sk.id === 'guard')      playerGuardSkill();
      else if (sk.id === 'ironwall')   playerIronWallSkill();
      else if (sk.id === 'ariaShield') playerAriaShieldSkill();
      else if (sk.id === 'palpunte')   playerPalpunte();
      else if (sk.id === 'meteor')     playerMeteor();
      else if (sk.id === 'timestop')   playerTimeStop();
      else if (sk.id === 'reflect')    playerReflect();
      else if (sk.id === 'drain')      playerDrain();
      else if (sk.id === 'teleport')   playerTeleport();
      else if (sk.id === 'ultima')     playerUltima();
      else if (sk.id === 'berserk')    playerBerserk();
      else if (sk.id === 'confuse')    playerConfuse();
      else if (sk.id === 'bigbang')    playerBigBang();
    };
    listEl.appendChild(btn);
  });
  document.getElementById('skill-select').classList.remove('hidden');
}

function cancelSkillSelect() {
  document.getElementById('skill-select').classList.add('hidden');
  document.getElementById('battle-buttons').classList.remove('hidden');
  setBattleButtons(true);
}

function playerMagicAttack() {
  if (gs.enemyStatus?.type === 'sleep') {
    gs.enemyStatus = null;
    addBattleLog('✨ 魔法で眠りが覚めた！', 'log-system');
    updateStatusDisplay();
  }
  const cost = 10;
  if (gs.player.mp < cost) {
    addBattleLog('✨ MPが足りない！', 'log-info');
    setBattleButtons(true);
    return;
  }
  gs.player.mp -= cost;
  const isWeak = gs.enemy.weakMagic || (gs.enemy.name && gs.enemy.name.includes('魔王'));
  const base = Math.max(5, getMatk() + rand(-5, 5));
  const dmg  = isWeak ? Math.floor(base * 1.5) : base;
  gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
  const weakTxt = isWeak ? '【弱点攻撃！】 ' : '';
  addBattleLog(`✨ 魔法を放った！ ${weakTxt}${gs.enemy.name}に ${dmg} ダメージ！`, 'log-player');
  if (typeof SoundEngine !== 'undefined') SoundEngine.playSFX('magic_light');
  triggerBattleEffect('light');
  showDamageNum(dmg, 'dmg');
  flashEnemyHit();
  updateBattleDisplay();
  updateStatus();
  checkDemonKingPhase2();
  if (gs.enemy.hp <= 0) { setTimeout(() => endBattle(true), 600); return; }
  afterPlayerTurn(700);
}

function playerGuardSkill() {
  gs.playerGuard = true;
  addBattleLog('🛡️ ガード！ 次の攻撃を防御力2倍で受ける！', 'log-player');
  updateStatusDisplay();
  afterPlayerTurn(500);
}

function playerIronWallSkill() {
  const cost = 15;
  if (gs.player.mp < cost) { addBattleLog('MP不足！', 'log-info'); setBattleButtons(true); return; }
  gs.player.mp -= cost;
  gs.ironWallTurns = 3;
  addBattleLog('🔒 鉄壁！ 3ターン間ダメージを半減する！', 'log-player');
  updateStatus();
  updateStatusDisplay();
  afterPlayerTurn(500);
}

function playerAriaShieldSkill() {
  gs.partyShieldActive = true;
  addBattleLog('🌟 アリア「聖なる盾」！ パーティのダメージが軽減される！', 'log-aria');
  updateStatusDisplay();
  afterPlayerTurn(500);
}

// ── 追加魔法 ──────────────────────────────────────────────────

function playerPalpunte() {
  const cost = 5;
  if (gs.player.mp < cost) { addBattleLog('MP不足！', 'log-info'); setBattleButtons(true); return; }
  gs.player.mp -= cost;
  const roll = Math.random();
  if (roll < 0.15) {
    // 即死
    gs.enemy.hp = 0;
    addBattleLog('🎲 パルプンテ！ 天運が降り注いだ！ 敵が消滅した！！', 'log-player');
    updateBattleDisplay(); updateStatus();
    setTimeout(() => endBattle(true), 600); return;
  } else if (roll < 0.35) {
    // 全回復
    gs.player.hp = gs.player.maxHp; gs.player.mp = gs.player.maxMp;
    addBattleLog('🎲 パルプンテ！ 神秘の力が溢れた！ HPとMPが全回復！', 'log-heal');
  } else if (roll < 0.55) {
    // 大ダメージ
    const dmg = Math.max(30, Math.floor(getMatk() * 3));
    gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
    addBattleLog(`🎲 パルプンテ！ 巨大な魔法弾が炸裂！ ${gs.enemy.name}に ${dmg} ダメージ！`, 'log-player');
    updateBattleDisplay();
    if (gs.enemy.hp <= 0) { updateStatus(); setTimeout(() => endBattle(true), 600); return; }
  } else if (roll < 0.65) {
    // MP全回復
    gs.player.mp = gs.player.maxMp;
    addBattleLog('🎲 パルプンテ！ 魔力の泉が湧いた！ MPが全回復！', 'log-heal');
  } else if (roll < 0.75) {
    // 自分にダメージ
    const dmg = Math.max(10, Math.floor(gs.player.maxHp * 0.2));
    gs.player.hp = clamp(gs.player.hp - dmg, 1, gs.player.maxHp);
    addBattleLog(`🎲 パルプンテ！ 魔法が暴発した！ アレクに ${dmg} ダメージ！`, 'log-enemy');
  } else if (roll < 0.85) {
    // 毒付与
    applyEnemyStatus('poison');
    addBattleLog(`🎲 パルプンテ！ 毒の霧が発生した！`, 'log-player');
  } else if (roll < 0.92) {
    // 敵強化（悪い）
    gs.enemy.attack = Math.floor(gs.enemy.attack * 1.5);
    addBattleLog('🎲 パルプンテ！ なぜか敵が強くなった！！', 'log-system');
  } else {
    // 眠り
    applyEnemyStatus('sleep');
    addBattleLog('🎲 パルプンテ！ 不思議な眠気が漂った！', 'log-player');
  }
  updateStatus(); updateStatusDisplay();
  afterPlayerTurn(700);
}

function playerMeteor() {
  const cost = 30;
  if (gs.player.mp < cost) { addBattleLog('MP不足！', 'log-info'); setBattleButtons(true); return; }
  gs.player.mp -= cost;
  if (typeof SoundEngine !== 'undefined') SoundEngine.playSFX('magic_fire');
  const base = Math.max(20, Math.floor(getMatk() * 2.5 + rand(-10, 10)));
  const { finalDmg, logMsg, absorbed } = applyElementMod(base, 'fire');
  if (absorbed) {
    addBattleLog(`☄️🔥 メテオ！ しかし${gs.enemy.name}が炎を吸収した！ ${logMsg}`, 'log-system');
  } else if (finalDmg === 0) {
    addBattleLog(`☄️🔥 メテオ！ ${logMsg}${gs.enemy.name}はダメージを受けない！`, 'log-system');
  } else {
    gs.enemy.hp = clamp(gs.enemy.hp - finalDmg, 0, gs.enemy.maxHp);
    addBattleLog(`☄️🔥 メテオ！ 巨大な隕石が降り注いだ！ ${logMsg}${gs.enemy.name}に ${finalDmg} ダメージ！`, 'log-player');
    triggerBattleEffect('fire'); showDamageNum(finalDmg, 'dmg'); flashEnemyHit();
  }
  updateBattleDisplay(); updateStatus(); checkDemonKingPhase2();
  if (gs.enemy.hp <= 0) { setTimeout(() => endBattle(true), 600); return; }
  afterPlayerTurn(700);
}

function playerTimeStop() {
  const cost = 25;
  if (gs.player.mp < cost) { addBattleLog('MP不足！', 'log-info'); setBattleButtons(true); return; }
  gs.player.mp -= cost;
  if (gs.enemyStatus) {
    addBattleLog(`⏱️ タイムストップ！ しかし${gs.enemy.name}はすでに状態異常だ！`, 'log-info');
  } else {
    gs.enemyStatus = { type: 'stop', turns: 3 };
    addBattleLog(`⏱️ タイムストップ！ ${gs.enemy.name}の時間が止まった！ 3ターン行動不能！`, 'log-player');
    updateStatusDisplay();
  }
  updateStatus();
  afterPlayerTurn(600);
}

function playerReflect() {
  const cost = 20;
  if (gs.player.mp < cost) { addBattleLog('MP不足！', 'log-info'); setBattleButtons(true); return; }
  gs.player.mp -= cost;
  gs.reflectActive = true;
  addBattleLog('🪞 リフレク！ 魔法の鏡を展開した！ 次の敵攻撃を反射する！', 'log-player');
  updateStatus(); updateStatusDisplay();
  afterPlayerTurn(500);
}

function playerDrain() {
  const cost = 15;
  if (gs.player.mp < cost) { addBattleLog('MP不足！', 'log-info'); setBattleButtons(true); return; }
  gs.player.mp -= cost;
  if (typeof SoundEngine !== 'undefined') SoundEngine.playSFX('magic_dark');
  const base = Math.max(10, Math.floor(getMatk() * 1.2 + rand(-5, 5)));
  const isWeak = gs.enemy.weakMagic || (gs.enemy.name && gs.enemy.name.includes('魔王'));
  const dmg = isWeak ? Math.floor(base * 1.5) : base;
  gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
  const absorb = Math.floor(dmg * 0.6);
  gs.player.hp = clamp(gs.player.hp + absorb, 0, gs.player.maxHp);
  addBattleLog(`🩸 ドレイン！ ${gs.enemy.name}から生命力を奪った！ ${dmg} ダメージ・HP +${absorb} 回復！`, 'log-player');
  triggerBattleEffect('dark'); showDamageNum(dmg, 'dmg'); flashEnemyHit();
  showDamageNum(absorb, 'heal');
  updateBattleDisplay(); updateStatus(); checkDemonKingPhase2();
  if (gs.enemy.hp <= 0) { setTimeout(() => endBattle(true), 600); return; }
  afterPlayerTurn(700);
}

function playerTeleport() {
  const cost = 10;
  if (gs.player.mp < cost) { addBattleLog('MP不足！', 'log-info'); setBattleButtons(true); return; }
  gs.player.mp -= cost;
  addBattleLog('🌀 テレポート！ 瞬時に戦闘から脱出した！', 'log-system');
  updateStatus();
  setTimeout(() => endBattle(false, true), 700);
}

function playerUltima() {
  const cost = 50;
  if (gs.player.mp < cost) { addBattleLog('MP不足！', 'log-info'); setBattleButtons(true); return; }
  gs.player.mp -= cost;
  if (typeof SoundEngine !== 'undefined') SoundEngine.playSFX('magic_light');
  const base = Math.max(50, Math.floor(getMatk() * 4 + rand(-15, 15)));
  const { finalDmg, logMsg, absorbed } = applyElementMod(base, 'light');
  if (absorbed) {
    addBattleLog(`💥☀️ アルテマ！！ しかし${gs.enemy.name}が光を吸収した！ ${logMsg}`, 'log-system');
  } else if (finalDmg === 0) {
    addBattleLog(`💥☀️ アルテマ！！ ${logMsg}${gs.enemy.name}はダメージを受けない！`, 'log-system');
  } else {
    gs.enemy.hp = clamp(gs.enemy.hp - finalDmg, 0, gs.enemy.maxHp);
    addBattleLog(`💥☀️ アルテマ！！ 究極魔法が炸裂した！ ${logMsg}${gs.enemy.name}に ${finalDmg} ダメージ！！`, 'log-player');
    triggerBattleEffect('light'); showDamageNum(finalDmg, 'crit'); flashEnemyHit();
  }
  updateBattleDisplay(); updateStatus(); checkDemonKingPhase2();
  if (gs.enemy.hp <= 0) { setTimeout(() => endBattle(true), 600); return; }
  afterPlayerTurn(700);
}

function playerBerserk() {
  const cost = 10;
  if (gs.player.mp < cost) { addBattleLog('MP不足！', 'log-info'); setBattleButtons(true); return; }
  gs.player.mp -= cost;
  gs.berserkTurns = 3;
  addBattleLog('⚔️ バーサク！ 戦闘狂気に陥った！ 攻撃力2倍・防御力半減・3ターン持続！', 'log-player');
  updateStatus(); updateStatusDisplay();
  afterPlayerTurn(500);
}

function playerConfuse() {
  const cost = 18;
  if (gs.player.mp < cost) { addBattleLog('MP不足！', 'log-info'); setBattleButtons(true); return; }
  gs.player.mp -= cost;
  if (gs.enemyStatus) {
    addBattleLog(`🌀 コンフュ！ しかし${gs.enemy.name}はすでに状態異常だ！`, 'log-info');
  } else {
    gs.enemyStatus = { type: 'confuse', turns: rand(2, 4) };
    addBattleLog(`🌀 コンフュ！ ${gs.enemy.name}を混乱させた！`, 'log-player');
    updateStatusDisplay();
  }
  updateStatus();
  afterPlayerTurn(600);
}

function playerBigBang() {
  const cost = 60;
  if (gs.player.mp < cost) { addBattleLog('MP不足！', 'log-info'); setBattleButtons(true); return; }
  gs.player.mp -= cost;
  const base = Math.max(80, Math.floor(gs.enemy.hp * 0.4));
  const { finalDmg, logMsg, absorbed } = applyElementMod(base, 'dark');
  if (absorbed) {
    addBattleLog(`🌌🌑 ビッグバン！！ しかし${gs.enemy.name}が闇を吸収した！ ${logMsg}`, 'log-system');
  } else if (finalDmg === 0) {
    addBattleLog(`🌌🌑 ビッグバン！！ ${logMsg}${gs.enemy.name}はダメージを受けない！`, 'log-system');
  } else {
    gs.enemy.hp = clamp(gs.enemy.hp - finalDmg, 0, gs.enemy.maxHp);
    addBattleLog(`🌌🌑 ビッグバン！！ 時空を超えた爆発が炸裂！ ${logMsg}${gs.enemy.name}に ${finalDmg} ダメージ！！`, 'log-player');
    triggerBattleEffect('dark'); showDamageNum(finalDmg, 'crit'); flashEnemyHit();
  }
  updateBattleDisplay(); updateStatus(); checkDemonKingPhase2();
  if (gs.enemy.hp <= 0) { setTimeout(() => endBattle(true), 600); return; }
  afterPlayerTurn(700);
}

function applyPlayerDmgDefenses(dmg, isSkill) {
  if (gs.playerGuard && !isSkill) dmg = Math.max(1, Math.floor(dmg / 2));
  ['body', 'acc1', 'acc2'].forEach(s => {
    const id = gs.player.equipment[s];
    if (id && ITEM_DATA[id]?.dmgReduce) dmg = Math.max(1, Math.ceil(dmg * (1 - ITEM_DATA[id].dmgReduce)));
  });
  if (gs.ironWallTurns > 0) dmg = Math.max(1, Math.ceil(dmg * 0.5));
  if (gs.partyShieldActive) dmg = Math.max(1, Math.ceil(dmg * 0.65));
  if (gs.comboSanctuary > 0) dmg = Math.max(1, Math.ceil(dmg * 0.5));
  return dmg;
}

function applyAriaDmgDefenses(dmg) {
  if (gs.partyShieldActive) dmg = Math.max(1, Math.ceil(dmg * 0.65));
  if (gs.comboSanctuary > 0) dmg = Math.max(1, Math.ceil(dmg * 0.5));
  return dmg;
}

function getPlayerElemBonus(element) {
  let bonus = 0;
  ['weapon', 'acc1', 'acc2'].forEach(slot => {
    const id = gs.player.equipment[slot];
    if (!id) return;
    const item = ITEM_DATA[id];
    if (item?.elemBonus?.[element]) bonus += item.elemBonus[element];
    if (item?.allElemBonus) bonus += item.allElemBonus;
  });
  bonus += getSeasonData().elemBonus?.[element] || 0;
  return bonus;
}

function applyElementMod(rawDmg, element) {
  if (element === 'none') return { finalDmg: rawDmg, logMsg: '', absorbed: false };
  const e = gs.enemy;
  const elemInfo = ELEMENT_DATA[element];
  const icon = elemInfo ? elemInfo.emoji : '';

  // demonKing 第二形態は光が3倍、他全耐性、闇吸収
  if (gs.enemyPhase2 && e._id === 'demonKing') {
    if (element === 'dark') {
      const heal = Math.max(1, Math.floor(rawDmg * 0.5));
      e.hp = clamp(e.hp + heal, 0, e.maxHp);
      return { finalDmg: 0, logMsg: `${icon}【闇吸収！敵HP+${heal}回復！】 `, absorbed: true };
    }
    if (element === 'light') {
      const bonus = getPlayerElemBonus(element);
      const finalDmg = Math.floor(rawDmg * 3.0 * (1 + bonus));
      return { finalDmg, logMsg: `${icon}【超弱点！3倍ダメージ！】 `, absorbed: false };
    }
    const bonus = getPlayerElemBonus(element);
    const finalDmg = Math.max(1, Math.floor(rawDmg * 0.5 * (1 + bonus)));
    return { finalDmg, logMsg: `${icon}【耐性・ダメージ半減】 `, absorbed: false };
  }

  const absorb  = e.absorb   || [];
  const nullArr = e.nullElem || [];
  const weak    = e.weak     || [];
  const resist  = e.resist   || [];

  if (absorb.includes(element)) {
    const heal = Math.max(1, Math.floor(rawDmg * 0.5));
    e.hp = clamp(e.hp + heal, 0, e.maxHp);
    return { finalDmg: 0, logMsg: `${icon}【吸収！敵HP+${heal}回復！】 `, absorbed: true };
  }
  if (nullArr.includes(element)) {
    return { finalDmg: 0, logMsg: `${icon}【無効】 `, absorbed: false };
  }

  let mult = 1.0;
  let msgPart = '';
  if (weak.includes(element)) {
    mult = 1.5;
    msgPart = '【弱点！1.5倍！】 ';
  } else if (resist.includes(element)) {
    mult = 0.5;
    msgPart = '【耐性・半減】 ';
  }

  const bonus = getPlayerElemBonus(element);
  const finalDmg = Math.max(1, Math.floor(rawDmg * mult * (1 + bonus)));
  return { finalDmg, logMsg: `${icon}${msgPart}`, absorbed: false };
}

function tickPlayerBuffs() {
  gs.playerGuard = false;
  if (gs.ironWallTurns > 0) {
    gs.ironWallTurns--;
    if (gs.ironWallTurns === 0) addBattleLog('🔒 鉄壁の効果が切れた。', 'log-system');
    else addBattleLog(`🔒 鉄壁 残り${gs.ironWallTurns}ターン`, 'log-system');
  }
  gs.partyShieldActive = false;
  gs.reflectActive = false;
  if (gs.berserkTurns > 0) {
    gs.berserkTurns--;
    if (gs.berserkTurns === 0) addBattleLog('⚔️ バーサクの効果が切れた。', 'log-system');
    else addBattleLog(`⚔️ バーサク 残り${gs.berserkTurns}ターン`, 'log-system');
  }
  if (gs.comboAtkBuff > 0) {
    gs.comboAtkBuff--;
    if (gs.comboAtkBuff === 0) addBattleLog('⚔️ コンボ攻撃強化の効果が切れた。', 'log-system');
    else addBattleLog(`⚔️ 攻撃力1.5倍 残り${gs.comboAtkBuff}ターン`, 'log-system');
  }
  if (gs.comboStatBuff > 0) {
    gs.comboStatBuff--;
    if (gs.comboStatBuff === 0) addBattleLog('🌙 全能力強化の効果が切れた。', 'log-system');
    else addBattleLog(`🌙 全能力強化 残り${gs.comboStatBuff}ターン`, 'log-system');
  }
  if (gs.comboSanctuary > 0) {
    const regen = Math.floor(gs.player.maxHp * 0.06);
    gs.player.hp = clamp(gs.player.hp + regen, 0, gs.player.maxHp);
    if (gs.companion && gs.companion.hp > 0) gs.companion.hp = clamp(gs.companion.hp + regen, 0, gs.companion.maxHp);
    ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
      const c = gs.companions?.[id];
      if (c && c.joined && c.hp > 0) c.hp = clamp(c.hp + regen, 0, c.maxHp);
    });
    addBattleLog(`🏰 鋼鉄の聖域！ 全員HP+${regen}回復・被ダメ50%軽減（残り${gs.comboSanctuary}T）`, 'log-heal');
    gs.comboSanctuary--;
    if (gs.comboSanctuary === 0) addBattleLog('🏰 鋼鉄の聖域の効果が切れた。', 'log-system');
  }

  // 仲間バフのターン経過
  const b = gs.buffs;
  if (b) {
    if (b.gaiusTauntTurns > 0)         { b.gaiusTauntTurns--;         if (!b.gaiusTauntTurns)         addBattleLog('🛡️ 挑発の効果が切れた。', 'log-system'); }
    if (b.lunaStarGuardTurns > 0)       { b.lunaStarGuardTurns--;       if (!b.lunaStarGuardTurns)       addBattleLog('🌟 星の加護の効果が切れた。', 'log-system'); }
    if (b.lunaMoonBuffTurns > 0)         { b.lunaMoonBuffTurns--;         if (!b.lunaMoonBuffTurns)         addBattleLog('🌙 月光の歌の効果が切れた。', 'log-system'); }
    if (b.solaDebuffTurns > 0)           { b.solaDebuffTurns--;           if (!b.solaDebuffTurns)           addBattleLog('⛓️ 敵への弱体効果が切れた。', 'log-system'); }
    if (b.zephirosMatkDoubleTurns > 0)   { b.zephirosMatkDoubleTurns--;   if (!b.zephirosMatkDoubleTurns)   addBattleLog('⚡ 魔力解放の効果が切れた。', 'log-system'); }
    if (b.zephirosMagicBarrierTurns > 0) { b.zephirosMagicBarrierTurns--; if (!b.zephirosMagicBarrierTurns) addBattleLog('🔮 魔法障壁の効果が切れた。', 'log-system'); }
    // 聖域 HP回復
    if (b.serafinaSanctuaryTurns > 0) {
      b.serafinaSanctuaryTurns--;
      const regen = 15;
      gs.player.hp = clamp(gs.player.hp + regen, 0, gs.player.maxHp);
      if (gs.companion && gs.companion.hp > 0) gs.companion.hp = clamp(gs.companion.hp + regen, 0, gs.companion.maxHp);
      ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
        const c = gs.companions?.[id];
        if (c && c.joined && c.hp > 0) c.hp = clamp(c.hp + regen, 0, c.maxHp);
      });
      addBattleLog(`✨ 聖域の加護！ 全員のHPが${regen}回復！`, 'log-heal');
      if (!b.serafinaSanctuaryTurns) addBattleLog('✨ 聖域の効果が切れた。', 'log-system');
    }
    // 仲間スキルCDを1ずつ減らす
    ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
      const c = gs.companions?.[id];
      if (c && c.skillCooldowns) {
        Object.keys(c.skillCooldowns).forEach(k => {
          if (c.skillCooldowns[k] > 0) c.skillCooldowns[k]--;
          if (c.skillCooldowns[k] <= 0) delete c.skillCooldowns[k];
        });
      }
    });
  }

  updateStatusDisplay();
  updateStatus();
  updateAllCompanionsBattleStatus();
  setBattleButtons(true);
}

function playerOpenItemMenu() {
  const usable = gs.player.items.filter(i => {
    const d = ITEM_DATA[i.id];
    return d && (d.type === 'consumable' || d.type === 'special');
  });
  if (usable.length === 0) {
    addBattleLog('🎒 使えるアイテムがない。', 'log-info');
    setBattleButtons(true);
    return;
  }

  document.getElementById('battle-buttons').classList.add('hidden');
  const listEl = document.getElementById('item-select-list');
  listEl.innerHTML = '';
  usable.forEach(i => {
    const d = ITEM_DATA[i.id];
    const btn = document.createElement('button');
    btn.className = 'item-use-btn';
    btn.textContent = `${d.emoji} ${d.name}${i.count > 1 ? ` x${i.count}` : ''} ——${d.desc}`;
    btn.onclick = () => useItemInBattle(i.id);
    listEl.appendChild(btn);
  });
  document.getElementById('item-select').classList.remove('hidden');
}

function cancelItemSelect() {
  document.getElementById('item-select').classList.add('hidden');
  document.getElementById('battle-buttons').classList.remove('hidden');
  setBattleButtons(true);
}

function showReviveTargetSelect(itemId, deadList) {
  const listEl = document.getElementById('item-select-list');
  listEl.innerHTML = '<div style="color:#f0c040;padding:4px 0;font-size:13px">🪶 誰を復活させますか？</div>';
  deadList.forEach(targetId => {
    const c = getCompanionById(targetId);
    if (!c) return;
    const btn = document.createElement('button');
    btn.className = 'item-use-btn';
    btn.textContent = `${c.emoji} ${c.name} を復活させる`;
    btn.onclick = () => applyPhoenixFeather(itemId, targetId);
    listEl.appendChild(btn);
  });
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'item-use-btn';
  cancelBtn.style.color = '#888';
  cancelBtn.textContent = '↩️ キャンセル';
  cancelBtn.onclick = cancelItemSelect;
  listEl.appendChild(cancelBtn);
}

function applyPhoenixFeather(itemId, targetId) {
  document.getElementById('item-select').classList.add('hidden');
  document.getElementById('battle-buttons').classList.remove('hidden');
  const c = getCompanionById(targetId);
  if (!c || c.hp > 0) {
    addBattleLog('対象が無効です。', 'log-info');
    setBattleButtons(true);
    return;
  }
  removeItem(itemId);
  c.hp = Math.floor(c.maxHp * 0.5);
  addBattleLog(`🪶 フェニックスの羽を使った！ ${c.emoji} ${c.name}が復活！ HP${c.hp}で立ち上がった！`, 'log-heal');
  updateAriaStatus();
  updateAllCompanionsStatus();
  updateAllCompanionsBattleStatus();
  updateStatus();
  afterPlayerTurn(700);
}

// ============================================================
//  装備変更システム
// ============================================================

function getEquippableItems() {
  return gs.player.items.filter(i => {
    const d = ITEM_DATA[i.id];
    return d && d.type === 'equipment';
  });
}

// ストーリー画面からの装備変更
function openEquipScreen() {
  document.getElementById('choices-area').classList.add('hidden');
  document.getElementById('equip-change-area').classList.remove('hidden');
  renderEquipList(document.getElementById('equip-change-list'), false);
}

function closeEquipScreen() {
  document.getElementById('equip-change-area').classList.add('hidden');
  document.getElementById('choices-area').classList.remove('hidden');
}

// 戦闘中の装備変更
function playerOpenBattleEquipMenu() {
  const equippable = getEquippableItems();
  if (equippable.length === 0) {
    addBattleLog('🗡️ 変更できる装備がない。', 'log-info');
    setBattleButtons(true);
    return;
  }
  document.getElementById('battle-buttons').classList.add('hidden');
  renderEquipList(document.getElementById('battle-equip-list'), true);
  document.getElementById('battle-equip-select').classList.remove('hidden');
}

function cancelBattleEquip() {
  document.getElementById('battle-equip-select').classList.add('hidden');
  document.getElementById('battle-buttons').classList.remove('hidden');
  setBattleButtons(true);
}

function renderEquipList(containerEl, inBattle) {
  containerEl.innerHTML = '';
  renderEquipSection(containerEl, gs.player, 'player', inBattle);
  const allComps = [
    ['aria', gs.companion, '👱‍♀️ アリア'],
    ...Object.entries(gs.companions || {}).map(([id, c]) => [id, c, `${COMPANION_DEFS[id]?.emoji} ${COMPANION_DEFS[id]?.name}`]),
  ];
  allComps.forEach(([id, c, label]) => {
    if (!c || !c.joined) return;
    const divider = document.createElement('div');
    divider.className = 'equip-section-label';
    divider.textContent = label;
    containerEl.appendChild(divider);
    renderEquipSection(containerEl, c, id, inBattle);
  });
}

function renderEquipSection(containerEl, target, targetId, inBattle) {
  const isAria = targetId === 'aria';
  const slotDefs = [
    { slot: 'weapon', itemSlot: 'weapon',    label: '⚔️ 武器'        },
    { slot: 'head',   itemSlot: 'head',      label: '🪖 頭防具'      },
    { slot: 'body',   itemSlot: 'body',      label: '🧥 体防具'      },
    { slot: 'acc1',   itemSlot: 'accessory', label: '💍 アクセサリー①' },
    { slot: 'acc2',   itemSlot: 'accessory', label: '💍 アクセサリー②' },
  ];

  slotDefs.forEach(({ slot, itemSlot, label }) => {
    const current = target.equipment[slot];
    const header = document.createElement('div');
    header.className = 'equip-slot-header';
    const curEnh = current ? (gs.player.enhancements[current] || 0) : 0;
    const curName = current ? `${ITEM_DATA[current].emoji} ${ITEM_DATA[current].name}${curEnh > 0 ? ' +' + curEnh : ''}` : '（なし）';
    header.textContent = `${label}: ${curName}`;
    containerEl.appendChild(header);

    const otherAccId = slot === 'acc1' ? target.equipment.acc2 : (slot === 'acc2' ? target.equipment.acc1 : null);

    const items = gs.player.items.filter(i => {
      const d = ITEM_DATA[i.id];
      if (!d || d.type !== 'equipment' || d.slot !== itemSlot) return false;
      if (d.forAria && targetId !== 'aria') return false;
      if (!d.forAria && targetId === 'aria' && itemSlot !== 'accessory') return false;
      if (d.forCompanion && d.forCompanion !== targetId) return false;
      if (itemSlot === 'accessory' && i.id === otherAccId) return false;
      return true;
    });

    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'equip-no-items';
      empty.textContent = '変更できる装備がありません';
      containerEl.appendChild(empty);
    } else {
      items.forEach(({ id }) => {
        const d = ITEM_DATA[id];
        const isEquipped = current === id;
        const btn = document.createElement('button');
        btn.className = 'equip-item-btn' + (isEquipped ? ' equip-active' : '');
        const parts = [];
        if (d.atk)  parts.push(`⚔️+${d.atk}`);
        if (d.matk) parts.push(`✨+${d.matk}`);
        if (d.def)  parts.push(`🛡️+${d.def}`);
        if (d.hp)   parts.push(`❤️+${d.hp}`);
        if (d.mp)   parts.push(`💧+${d.mp}`);
        if (d.expBonus) parts.push(`🍀EXP×${d.expBonus}`);
        if (d.speed) parts.push(`💨+${d.speed}`);
        if (d.healAfterBattle) parts.push(`💚回復`);
        const enh = gs.player.enhancements[id] || 0;
        const enhStr = enh > 0 ? ` +${enh}` : '';
        const statStr = parts.length ? `  [${parts.join(' ')}]` : '';
        btn.textContent = `${d.emoji} ${d.name}${enhStr}${statStr}${isEquipped ? ' ✓' : ''}`;
        if (isEquipped) {
          btn.onclick = () => { unequipItemTarget(slot, target, targetId, inBattle); renderEquipList(containerEl, inBattle); };
        } else {
          btn.onclick = () => { equipItemTarget(id, slot, target, targetId, inBattle); renderEquipList(containerEl, inBattle); };
        }
        containerEl.appendChild(btn);
      });
    }
    if (current) {
      const unBtn = document.createElement('button');
      unBtn.className = 'equip-item-btn equip-unequip-btn';
      unBtn.textContent = `❌ ${label.replace(/^.+?\s/, '')}を外す`;
      unBtn.onclick = () => { unequipItemTarget(slot, target, targetId, inBattle); renderEquipList(containerEl, inBattle); };
      containerEl.appendChild(unBtn);
    }
  });
}

function applyEquipHpMp(target, d, sign) {
  if (d.hp) { target.maxHp += d.hp * sign; target.hp = clamp(target.hp + d.hp * sign, 1, target.maxHp); }
  if (d.mp) { target.maxMp += d.mp * sign; target.mp = clamp(target.mp + d.mp * sign, 0, target.maxMp); }
}

function equipItemTarget(id, slot, target, targetId, inBattle) {
  const d = ITEM_DATA[id];
  if (!d) return;
  // 旧装備のHP/MPボーナスを除去
  const prev = target.equipment[slot];
  if (prev && ITEM_DATA[prev]) applyEquipHpMp(target, ITEM_DATA[prev], -1);
  target.equipment[slot] = id;
  // 新装備のHP/MPボーナスを付与
  applyEquipHpMp(target, d, +1);
  updateStatus();
  if (inBattle) {
    const who = targetId === 'aria' ? '👱‍♀️ アリア' : 'アレク';
    addBattleLog(`🗡️ ${who}: ${d.emoji} ${d.name} を装備した！（ターン消費）`, 'log-player');
    finishBattleEquip();
  } else {
    showToast(`${d.emoji} ${d.name} を装備した！`);
  }
}

function unequipItemTarget(slot, target, targetId, inBattle) {
  const prev = target.equipment[slot];
  if (!prev) return;
  const d = ITEM_DATA[prev];
  applyEquipHpMp(target, d, -1);
  target.equipment[slot] = null;
  updateStatus();
  if (inBattle) {
    const who = targetId === 'aria' ? '👱‍♀️ アリア' : 'アレク';
    addBattleLog(`🗡️ ${who}: ${d.emoji} ${d.name} を外した。（ターン消費）`, 'log-player');
    finishBattleEquip();
  } else {
    showToast(`${d.emoji} ${d.name} を外した`);
  }
}

function unequipItem(slot, inBattle = false) {
  unequipItemTarget(slot, gs.player, 'player', inBattle);
}

function finishBattleEquip() {
  document.getElementById('battle-equip-select').classList.add('hidden');
  document.getElementById('battle-buttons').classList.remove('hidden');
  afterPlayerTurn(700);
}

function playerRun() {
  const speedBonus = getEquipBonus(gs.player, 'speed') * 0.005;
  const formEsc = (FORMATION_DATA[gs.formation || 'balanced']?.bonuses?.escBonus || 0);
  const chance = 0.5 + (gs.player.level > (gs.enemy.level || 1) ? 0.15 : 0) + speedBonus + formEsc;
  if (Math.random() < chance) {
    addBattleLog('💨 逃げ出した！', 'log-system');
    setTimeout(() => endBattle(false, true), 700);
  } else {
    addBattleLog('💨 逃げようとしたが、失敗した！', 'log-info');
    afterPlayerTurn(700);
  }
}

function getRandomEnemyTarget() {
  if (gs.buffs?.gaiusTauntTurns > 0 || gs.buffs?.gaiusVanguard) {
    const g = gs.companions?.gaius;
    if (g && g.joined && g.hp > 0) return 'gaius';
  }
  const members = ['player'];
  if (gs.companion && gs.companion.hp > 0) members.push('aria');
  ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
    const c = gs.companions?.[id];
    if (c && c.joined && c.hp > 0) members.push(id);
  });
  return members[Math.floor(Math.random() * members.length)];
}

function dealDamageToTarget(targetId, rawDmg) {
  if (targetId === 'player') {
    const dmg = applyPlayerDmgDefenses(rawDmg, false);
    gs.player.hp = clamp(gs.player.hp - dmg, 0, gs.player.maxHp);
    updateStatus();
    if (typeof SoundEngine !== 'undefined') SoundEngine.playSFX('damage');
    flashPlayerHit();
    const bar = document.getElementById('hp-bar');
    bar?.classList.add('shake');
    setTimeout(() => bar?.classList.remove('shake'), 500);
    return { name: 'アレク', emoji: '⚔️', dmg, dead: gs.player.hp <= 0 };
  }
  const c = getCompanionById(targetId);
  if (!c) return { name: '?', emoji: '?', dmg: 0, dead: false };
  let dmg = rawDmg;
  // 鉄壁の構え（ガイアス）
  if (gs.buffs?.gaiusIronStance && targetId === 'gaius') {
    dmg = Math.max(1, Math.ceil(dmg * 0.1));
    gs.buffs.gaiusIronStance = false;
  }
  // 仁王立ち → ガイアスへリダイレクト（ガイアス以外が対象の場合）
  if (gs.buffs?.gaiusVanguard && targetId !== 'gaius') {
    const g = gs.companions?.gaius;
    if (g && g.joined && g.hp > 0) {
      dmg = Math.max(1, Math.ceil(dmg * 0.8));
      g.hp = clamp(g.hp - dmg, 0, g.maxHp);
      gs.buffs.gaiusVanguard = false;
      updateAllCompanionsBattleStatus();
      return { name: `ガイアス（仁王立ち！）`, emoji: '🛡️', dmg, dead: g.hp <= 0 };
    }
  }
  // 魔法障壁（ゼフィロス）はスキル攻撃で処理
  if (targetId === 'aria') dmg = applyAriaDmgDefenses(dmg);
  else if (gs.comboSanctuary > 0) dmg = Math.max(1, Math.ceil(dmg * 0.5));
  c.hp = clamp(c.hp - dmg, 0, c.maxHp);
  updateAllCompanionsBattleStatus();
  if (c.hp <= 0) {
    updateAriaStatus(); updateAllCompanionsStatus();
  }
  return { name: c.name, emoji: c.emoji, dmg, dead: c.hp <= 0 };
}

function enemyTurn() {
  if (!gs.inBattle || !gs.enemy) return;
  const e = gs.enemy;

  if (!processEnemyTurnStart()) return;

  // リフレク: 敵の次の攻撃を反射
  if (gs.reflectActive) {
    gs.reflectActive = false;
    const refDmg = Math.max(10, Math.floor(e.attack * 1.5));
    e.hp = clamp(e.hp - refDmg, 0, e.maxHp);
    addBattleLog(`🪞 リフレク！ ${e.name}の攻撃が反射された！ ${refDmg} ダメージ！`, 'log-player');
    updateBattleDisplay();
    updateStatusDisplay();
    if (e.hp <= 0) { setTimeout(() => endBattle(true), 600); return; }
    tickPlayerBuffs(); return;
  }

  // 束縛の鎖でスタン
  if (gs.buffs?.solaStunned) {
    gs.buffs.solaStunned = false;
    addBattleLog(`⛓️ ${e.name}は束縛されて行動できない！`, 'log-system');
    tickPlayerBuffs(); return;
  }

  const eAtk = getEnemyEffectiveAtk();
  let dmg = 0;

  // スキル判定
  if (e.skill && Math.random() < e.skill.chance) {
    // 魔法障壁が有効なら無効化
    if (gs.buffs?.zephirosMagicBarrierTurns > 0) {
      gs.buffs.zephirosMagicBarrierTurns--;
      addBattleLog(`🔮 魔法障壁が${e.skill.name}を無効化した！！`, 'log-system');
      tickPlayerBuffs(); return;
    }
    dmg = e.skill.damage;
    addBattleLog(e.skill.msg || `${e.emoji} ${e.name}の ${e.skill.name}！`, 'log-enemy');
    if (e.enemyPhase2 && e.phase2) dmg = Math.floor(dmg * 1.2);
    const tgt = getRandomEnemyTarget();
    const res = dealDamageToTarget(tgt, applyPlayerDmgDefenses(dmg, true));
    if (!res || res.dead) {
      if (tgt === 'player') {
        addBattleLog('💀 アレクのHPが0になった...', 'log-system');
        setTimeout(() => endBattle(false), 800); return;
      } else {
        addBattleLog(`💔 ${res.name}が戦闘不能になった！`, 'log-system');
        if (tgt === 'aria') updateAriaStatus();
        if (e.skill.inflict && Math.random() < 0.5) applyPlayerStatus(e.skill.inflict);
      }
    }
    tickPlayerBuffs(); return;
  }

  // 通常攻撃：ランダムターゲット
  const tgt = getRandomEnemyTarget();
  const eDef = tgt === 'player' ? getDef() : getCompanionDef(tgt);
  const result = calcDamage(eAtk, eDef);
  dmg = result.dmg;
  const critTxt = result.crit ? '【会心！】 ' : '';
  if (gs.enemyPhase2 && e.phase2) dmg = Math.floor(dmg * 1.2);
  const res = dealDamageToTarget(tgt, dmg);
  addBattleLog(`${e.emoji} ${e.name}の攻撃！ ${critTxt}${res.emoji} ${res.name}に ${res.dmg} ダメージ！`, 'log-enemy');
  if (res.dead) {
    if (tgt === 'player') {
      addBattleLog('💀 アレクのHPが0になった...', 'log-system');
      setTimeout(() => endBattle(false), 800); return;
    } else {
      addBattleLog(`💔 ${res.name}が戦闘不能になった！`, 'log-system');
    }
  }
  tickPlayerBuffs();
}

function checkDemonKingPhase2() {
  const e = gs.enemy;
  if (!e || !e.phase2Threshold || gs.enemyPhase2) return;
  if (e.hp <= e.phase2Threshold && e.hp > 0) {
    gs.enemyPhase2 = true;
    const p2 = e.phase2;
    e.name   = p2.name;
    e.emoji  = p2.emoji;
    e.attack += p2.attackBonus;
    addBattleLog(`🔴 魔王が変身した！！【第二形態】になった！！`, 'log-system');
    addBattleLog(`⚡ 攻撃力が大幅に上昇！ 魔法を使え！！`, 'log-system');
    updateBattleDisplay();
  }
}

// ============================================================
//  状態異常システム
// ============================================================

function getStatusLabel(type) {
  if (type === 'poison')    return '☠️ 毒';
  if (type === 'paralysis') return '⚡ 麻痺';
  if (type === 'sleep')     return '💤 眠り';
  if (type === 'stop')      return '⏱️ 停止';
  if (type === 'confuse')   return '🌀 混乱';
  return '';
}

function updateStatusDisplay() {
  const ps = gs.playerStatus;
  const pd = document.getElementById('player-status-display');
  if (pd) {
    const parts = [];
    if (ps) parts.push(`${getStatusLabel(ps.type)}（残り${ps.turns}T）`);
    if (gs.playerGuard) parts.push('🛡️ ガード中');
    if (gs.ironWallTurns > 0) parts.push(`🔒 鉄壁（残り${gs.ironWallTurns}T）`);
    if (gs.partyShieldActive) parts.push('🌟 聖なる盾');
    if (gs.reflectActive)     parts.push('🪞 リフレク');
    if (gs.berserkTurns > 0)  parts.push(`⚔️ バーサク（残り${gs.berserkTurns}T）`);
    if (gs.comboAtkBuff > 0)  parts.push(`⚡ 攻撃力1.5倍（残り${gs.comboAtkBuff}T）`);
    if (gs.comboStatBuff > 0) parts.push(`🌙 全能力強化（残り${gs.comboStatBuff}T）`);
    if (gs.comboSanctuary > 0)parts.push(`🏰 鋼鉄の聖域（残り${gs.comboSanctuary}T）`);
    if (parts.length) { pd.textContent = parts.join(' '); pd.style.display = 'block'; }
    else              { pd.textContent = ''; pd.style.display = 'none'; }
  }
  const es = gs.enemyStatus;
  const ed = document.getElementById('enemy-status-display');
  if (ed) { ed.textContent = es ? getStatusLabel(es.type) : ''; }
}

function applyPlayerStatus(type) {
  if (gs.playerStatus) return;
  gs.playerStatus = { type, turns: rand(2, 4) };
  addBattleLog(`アレクは${getStatusLabel(type)}状態になった！`, 'log-system');
  updateStatusDisplay();
  updateStatus();
}

function applyEnemyStatus(type) {
  if (gs.enemyStatus) return;
  gs.enemyStatus = { type, turns: rand(2, 4) };
  addBattleLog(`${gs.enemy.name}は${getStatusLabel(type)}状態になった！`, 'log-system');
  updateStatusDisplay();
}

function processPlayerTurnStart() {
  const s = gs.playerStatus;
  if (!s) return true;

  if (s.type === 'sleep') {
    s.turns--;
    updateStatusDisplay();
    if (s.turns <= 0) {
      gs.playerStatus = null;
      addBattleLog('💤 眠りから目覚めた！', 'log-system');
      updateStatusDisplay();
      return true;
    }
    addBattleLog('💤 アレクは深く眠っている...行動できない！', 'log-system');
    afterPlayerTurn(700);
    return false;
  }

  if (s.type === 'paralysis') {
    s.turns--;
    if (s.turns <= 0) gs.playerStatus = null;
    updateStatusDisplay();
    if (Math.random() < 0.5) {
      addBattleLog('⚡ 麻痺で体が動かない！', 'log-system');
      afterPlayerTurn(700);
      return false;
    }
    addBattleLog('⚡ 気力で麻痺を振り切った！', 'log-system');
    return true;
  }

  if (s.type === 'poison') {
    const dmg = Math.max(3, Math.floor(gs.player.maxHp * 0.05));
    gs.player.hp = clamp(gs.player.hp - dmg, 0, gs.player.maxHp);
    addBattleLog(`☠️ 毒が蝕む... アレクに ${dmg} ダメージ！`, 'log-enemy');
    s.turns--;
    if (s.turns <= 0) {
      gs.playerStatus = null;
      addBattleLog('💊 毒が自然に抜けた！', 'log-system');
    }
    updateStatusDisplay();
    updateStatus();
    if (gs.player.hp <= 0) {
      addBattleLog('💀 アレクのHPが0になった...', 'log-system');
      setTimeout(() => endBattle(false), 800);
      return false;
    }
    return true;
  }

  return true;
}

function processEnemyTurnStart() {
  const s = gs.enemyStatus;
  if (!s) return true;
  const e = gs.enemy;

  if (s.type === 'sleep') {
    s.turns--;
    if (s.turns <= 0) {
      gs.enemyStatus = null;
      addBattleLog(`💤 ${e.name}は眠りから覚めた！`, 'log-system');
      updateStatusDisplay();
      return true;
    }
    addBattleLog(`💤 ${e.name}は眠ったまま動かない！`, 'log-system');
    updateStatusDisplay();
    setBattleButtons(true);
    return false;
  }

  if (s.type === 'paralysis') {
    s.turns--;
    if (s.turns <= 0) gs.enemyStatus = null;
    updateStatusDisplay();
    if (Math.random() < 0.5) {
      addBattleLog(`⚡ ${e.name}は麻痺で動けない！`, 'log-system');
      setBattleButtons(true);
      return false;
    }
    addBattleLog(`⚡ ${e.name}は麻痺を振り切って攻撃した！`, 'log-system');
    return true;
  }

  if (s.type === 'poison') {
    const dmg = Math.max(5, Math.floor(e.maxHp * 0.05));
    e.hp = clamp(e.hp - dmg, 0, e.maxHp);
    addBattleLog(`☠️ 毒が${e.name}を蝕む！ ${dmg} ダメージ！`, 'log-player');
    s.turns--;
    if (s.turns <= 0) {
      gs.enemyStatus = null;
      addBattleLog(`${e.name}の毒が回復した。`, 'log-system');
    }
    updateStatusDisplay();
    updateBattleDisplay();
    if (e.hp <= 0) {
      setTimeout(() => endBattle(true), 600);
      return false;
    }
    return true;
  }

  if (s.type === 'stop') {
    s.turns--;
    if (s.turns <= 0) {
      gs.enemyStatus = null;
      addBattleLog(`⏱️ ${e.name}への時間停止が解けた！`, 'log-system');
      updateStatusDisplay();
      return true;
    }
    addBattleLog(`⏱️ ${e.name}は時間が止まって動けない！`, 'log-system');
    updateStatusDisplay();
    setBattleButtons(true);
    return false;
  }

  if (s.type === 'confuse') {
    s.turns--;
    if (s.turns <= 0) {
      gs.enemyStatus = null;
      addBattleLog(`🌀 ${e.name}の混乱が解けた！`, 'log-system');
      updateStatusDisplay();
    }
    if (Math.random() < 0.5) {
      const selfDmg = Math.max(5, Math.floor(e.attack * 1.2));
      e.hp = clamp(e.hp - selfDmg, 0, e.maxHp);
      addBattleLog(`🌀 ${e.name}は混乱して自分を攻撃した！ ${selfDmg} ダメージ！`, 'log-player');
      updateBattleDisplay();
      if (e.hp <= 0) { setTimeout(() => endBattle(true), 600); return false; }
    } else {
      addBattleLog(`🌀 ${e.name}は混乱しているが攻撃してきた！`, 'log-system');
    }
    updateStatusDisplay();
    return true;
  }

  return true;
}

// ============================================================
//  レベリングスポットシステム
// ============================================================

function makeLevelingEnemy(id, spotMult, extraScale) {
  const base = JSON.parse(JSON.stringify(ENEMY_DATA[id]));
  base._id = id;
  const scale = spotMult * extraScale;
  base.maxHp   = Math.round(base.maxHp   * scale);
  base.hp      = base.maxHp;
  base.attack  = Math.round(base.attack  * scale);
  base.defense = Math.round(base.defense * scale);
  if (base.skill?.damage) base.skill.damage = Math.round(base.skill.damage * scale);
  return base;
}

function startLevelingBattle(spotId) {
  const spot = LEVELING_SPOTS[spotId];
  const clears = gs.levelingClears[spotId] || 0;
  gs.levelingMode = { spotId, clearCount: clears };

  const spotScale = 1 + clears * 0.15;
  const pool = spot.enemyPool;
  const id = pool[Math.floor(Math.random() * pool.length)];
  const enemy = makeLevelingEnemy(id, spotScale, 1);
  const totalMult = Math.min(spot.expMult * spotScale, 4.0);
  enemy.exp  = Math.round(enemy.exp  * totalMult);
  enemy.gold = Math.round(enemy.gold * totalMult);

  startBattle(enemy);
}

function startArenaRun() {
  const clears = gs.levelingClears.arena || 0;
  gs.levelingMode = { spotId: 'arena', clearCount: clears, wave: 1 };
  startArenaWave();
}

function startArenaWave() {
  const lm = gs.levelingMode;
  const spot = LEVELING_SPOTS.arena;
  const id = spot.waveEnemies[lm.wave - 1] || 'gladiator';
  const spotScale = 1 + lm.clearCount * 0.15;
  const waveScale = 1 + (lm.wave - 1) * 0.12;
  const enemy = makeLevelingEnemy(id, spotScale, waveScale);
  const totalMult = Math.min(spot.expMult * spotScale * waveScale, 5.0);
  enemy.exp  = Math.round(enemy.exp  * totalMult);
  enemy.gold = Math.round(enemy.gold * totalMult);
  startBattle(enemy);
}

function handleLevelingVictory(gainedExp, gainedGold) {
  const lm = gs.levelingMode;
  const spot = LEVELING_SPOTS[lm.spotId];

  const dropChance = Math.min(0.05 + lm.clearCount * 0.03, 0.5);
  let droppedItem = null;
  if (Math.random() < dropChance) {
    droppedItem = spot.rareDropPool[Math.floor(Math.random() * spot.rareDropPool.length)];
    addItem(droppedItem);
  }

  if (lm.spotId === 'arena') {
    if (lm.wave >= spot.waves) {
      gs.levelingClears.arena = (gs.levelingClears.arena || 0) + 1;
      lm.clearCount = gs.levelingClears.arena;
      showArenaFinale(gainedExp, gainedGold, droppedItem);
    } else {
      lm.wave++;
      showArenaWaveResult(gainedExp, gainedGold, droppedItem);
    }
  } else {
    gs.levelingClears[lm.spotId] = (gs.levelingClears[lm.spotId] || 0) + 1;
    lm.clearCount = gs.levelingClears[lm.spotId];
    showLevelingResult(gainedExp, gainedGold, droppedItem);
  }
}

function showLevelingPanel(emoji, title, bodyText) {
  document.getElementById('battle-area').classList.add('hidden');
  document.getElementById('story-text-area').classList.remove('hidden');
  document.getElementById('choices-area').classList.remove('hidden');
  document.getElementById('scene-emoji-display').textContent = emoji;
  document.getElementById('scene-title-display').textContent = title;
  document.getElementById('story-text').textContent = bodyText;
  document.getElementById('choices-area').innerHTML = '';
}

function addLevelingBtn(text, className, onClick) {
  const btn = document.createElement('button');
  btn.className = 'choice-btn' + (className ? ' ' + className : '');
  btn.textContent = text;
  btn.onclick = onClick;
  document.getElementById('choices-area').appendChild(btn);
}

function showLevelingResult(gainedExp, gainedGold, droppedItem) {
  const lm = gs.levelingMode;
  const spot = LEVELING_SPOTS[lm.spotId];
  const nextScale = Math.round((1 + lm.clearCount * 0.15) * 100);
  let txt = `⚔️ 勝利！\n\nEXP +${gainedExp}　💰 +${gainedGold}G`;
  if (droppedItem) txt += `\n✨ レアドロップ！ ${ITEM_DATA[droppedItem].emoji} ${ITEM_DATA[droppedItem].name} を入手！`;
  txt += `\n\n周回数: ${lm.clearCount}回\n次回の敵の強さ: ${nextScale}%`;
  showLevelingPanel(spot.emoji, `${spot.name} 撃破！`, txt);
  addLevelingBtn('🔄 もう一度戦う', '', () => startLevelingBattle(lm.spotId));
  addLevelingBtn('↩️ スポット一覧へ', 'back-btn', () => { gs.levelingMode = null; gotoScene(spot.sceneId); });
}

function showArenaWaveResult(gainedExp, gainedGold, droppedItem) {
  const lm = gs.levelingMode;
  const spot = LEVELING_SPOTS.arena;
  const prevWave = lm.wave - 1;
  const remaining = spot.waves - prevWave;
  let txt = `第${prevWave}戦 突破！\n\nEXP +${gainedExp}　💰 +${gainedGold}G\n残り ${remaining} 体`;
  if (droppedItem) txt += `\n✨ レアドロップ！ ${ITEM_DATA[droppedItem].emoji} ${ITEM_DATA[droppedItem].name}！`;
  showLevelingPanel('🏟️', `第${prevWave}戦 クリア！`, txt);
  addLevelingBtn(`⚔️ 第${lm.wave}戦へ進む`, '', () => startArenaWave());
  addLevelingBtn('🏳️ リタイアする', 'back-btn', () => { gs.levelingMode = null; gotoScene('arena_spot'); });
}

function showArenaFinale(gainedExp, gainedGold, droppedItem) {
  const lm = gs.levelingMode;
  const spot = LEVELING_SPOTS.arena;
  gs.player.gold += spot.bonusGold;
  addItem(spot.bonusItem);
  updateStatus();
  const bonusD = ITEM_DATA[spot.bonusItem];
  let txt = `🏆 全5体撃破！ 闘技場を制した！\n\nEXP +${gainedExp}　💰 +${gainedGold}G\n\n【ボーナス報酬】\n💰 +${spot.bonusGold}G\n${bonusD.emoji} ${bonusD.name} を入手！`;
  if (droppedItem) txt += `\n✨ レアドロップ！ ${ITEM_DATA[droppedItem].emoji} ${ITEM_DATA[droppedItem].name}！`;
  txt += `\n\n闘技場クリア回数: ${lm.clearCount}回`;
  showLevelingPanel('🏆', '闘技場 完全制覇！', txt);
  addLevelingBtn('🔄 もう一度挑む', '', () => startArenaRun());
  addLevelingBtn('↩️ スポット一覧へ', 'back-btn', () => { gs.levelingMode = null; gotoScene('arena_spot'); });
}

// ============================================================
//  神々の塔システム
// ============================================================

function startGodsTower() {
  const nextFloor = (gs.towerProgress || 0) + 1;
  if (nextFloor > 10) {
    showLevelingPanel('🏆', '神々の塔 制覇済み！',
      `すでに神々の塔の全10フロアを制覇している！\n\n神龍ゴッドドラゴンはあなたの力を認め、\n静かな眠りについている。\n\n再挑戦することもできる（1Fから）。`);
    addLevelingBtn('🔄 1Fから再挑戦', '', () => {
      gs.towerProgress = 0;
      startGodsTower();
    });
    addLevelingBtn('↩️ 戻る', 'back-btn', () => { gotoScene('gods_tower_hub'); });
    return;
  }
  startTowerFloor(nextFloor);
}

function startTowerFloor(floor) {
  const floorData = GODS_TOWER_FLOORS[floor - 1];
  gs.godsTowerMode = { floor };
  const base = JSON.parse(JSON.stringify(ENEMY_DATA[floorData.enemy]));
  base._id = floorData.enemy;
  const enemy = base;
  enemy.hp = enemy.maxHp;
  startBattle(enemy);
}

function handleTowerVictory(gainedExp, gainedGold) {
  const floor = gs.godsTowerMode.floor;
  const floorData = GODS_TOWER_FLOORS[floor - 1];
  gs.towerProgress = Math.max(gs.towerProgress || 0, floor);
  gs.godsTowerMode = null;
  checkTitles();
  saveGame();

  if (floorData.isBossFloor) {
    // 神龍撃破！報酬付与
    addItem('godDragonSword');
    addItem('divineArmor');
    addItem('godDragonShield');
    addItem('divineRing');
    updateStatus();
    showLevelingPanel('🌟', '神龍ゴッドドラゴン 討伐！！',
      `━━━━━━━━━━━━━━━━\n🐉 神龍ゴッドドラゴンを倒した！！\n━━━━━━━━━━━━━━━━\n\n神龍は最後の炎を吐き出し、静かに消えていった。\n\n「——見事だ。勇者よ。\n お前こそ真の勇者に相応しい」\n\n EXP +${gainedExp}　💰 +${gainedGold}G\n\n【神器シリーズ 全4種を獲得！】\n🐉 神龍の剣（ATK+200・全属性+50%）\n✨ 神聖の鎧（DEF+150・HP+500）\n🐲 神龍の盾（全ダメージ40%軽減）\n💫 神器の指輪（全ステータス+100）`);
    addLevelingBtn('↩️ 塔の入口へ戻る', 'back-btn', () => { gotoScene('gods_tower_hub'); });
    return;
  }

  // 通常フロアクリア
  const nextFloor = floor + 1;
  const nextData  = GODS_TOWER_FLOORS[nextFloor - 1];
  showLevelingPanel(floorData.emoji, `${floorData.name} 突破！`,
    `⚔️ 勝利！\n\n EXP +${gainedExp}　💰 +${gainedGold}G\n\n【無料回復済み】HP・MPが全回復した！\n\n次のフロア: ${nextData.name}\n敵: ${ENEMY_DATA[nextData.enemy]?.name || '???'}`);
  // 無料回復
  gs.player.hp = gs.player.maxHp;
  gs.player.mp = gs.player.maxMp;
  if (gs.companion?.joined) { gs.companion.hp = gs.companion.maxHp; gs.companion.mp = gs.companion.maxMp; }
  Object.values(gs.companions || {}).forEach(c => { if (c?.joined) { c.hp = c.maxHp; c.mp = c.maxMp; } });
  updateStatus();
  updateAllCompanionsStatus();
  addLevelingBtn(`⚔️ ${nextData.name}へ進む`, '', () => startTowerFloor(nextFloor));
  addLevelingBtn('🚶 塔を降りる（セーブ済み）', 'back-btn', () => { gs.godsTowerMode = null; gotoScene('gods_tower_hub'); });
}

// ============================================================
//  無限の試練システム
// ============================================================

function startEndlessTrial() {
  gs.endlessTrialMode = { wave: 1 };
  startEndlessWave();
}

function startEndlessWave() {
  const wave = gs.endlessTrialMode.wave;
  // ボス波（10の倍数）
  const isBossWave = wave % 10 === 0;
  let enemyId, scale;
  if (isBossWave) {
    const bossPool = ['demonLord', 'demonKing', 'leviathan', 'sandPharaoh', 'iceQueen', 'stoneGolem'];
    enemyId = bossPool[Math.floor(wave / 10 - 1) % bossPool.length] || 'demonKing';
    scale = 1 + (wave / 10) * 0.8;
  } else {
    const normalPool = wave <= 20
      ? ['gladiator', 'championKnight', 'arenaLegend']
      : wave <= 40
        ? ['darkKnight', 'cursedSoul', 'towerGuard1']
        : ['towerGuard2', 'towerArchangel', 'towerDemon'];
    enemyId = normalPool[Math.floor(Math.random() * normalPool.length)];
    scale = 1 + (wave - 1) * 0.15;
  }
  const base = JSON.parse(JSON.stringify(ENEMY_DATA[enemyId]));
  base._id = enemyId;
  base.maxHp   = Math.round(base.maxHp   * scale);
  base.hp      = base.maxHp;
  base.attack  = Math.round(base.attack  * scale);
  base.defense = Math.round(base.defense * scale);
  base.exp     = Math.round(base.exp     * scale * 1.5);
  base.gold    = Math.round(base.gold    * scale * 1.5);
  if (base.skill?.damage) base.skill.damage = Math.round(base.skill.damage * scale);
  if (isBossWave) {
    base.isBoss = true;
    base.name   = `【Wave${wave}】` + base.name;
  }
  startBattle(base);
}

function handleEndlessVictory(gainedExp, gainedGold) {
  const wave = gs.endlessTrialMode.wave;
  gs.endlessTrialMaxWave = Math.max(gs.endlessTrialMaxWave || 0, wave);
  gs.endlessTrialMode.wave++;
  checkTitles();

  // 波数報酬
  const bonusGold = wave * 500;
  gs.player.gold += bonusGold;
  updateStatus();

  // 10波ごとにレアアイテム
  let rareDrop = null;
  if (wave % 10 === 0) {
    const rarePool = ['elixir', 'elixir', 'phoenixFeather', 'heroCirclet', 'heroShield', 'heroArmor'];
    rareDrop = rarePool[Math.floor(wave / 10 - 1) % rarePool.length] || 'elixir';
    addItem(rareDrop);
  } else if (wave % 5 === 0) {
    const midPool = ['highHerb', 'highMpPotion', 'elixir', 'antidote'];
    rareDrop = midPool[Math.floor(Math.random() * midPool.length)];
    addItem(rareDrop);
  }
  updateStatus();
  saveGame();

  const nextWave = gs.endlessTrialMode.wave;
  let txt = `Wave ${wave} 突破！\n\n EXP +${gainedExp}　💰 +${gainedGold}G\n💰 波数ボーナス +${bonusGold}G\n\n最高記録: ${gs.endlessTrialMaxWave}波`;
  if (rareDrop) txt += `\n✨ ${ITEM_DATA[rareDrop].emoji}「${ITEM_DATA[rareDrop].name}」を入手！`;
  if (nextWave % 10 === 0) txt += `\n\n⚠️ 次はボス波！！`;
  showLevelingPanel('♾️', `Wave ${wave} クリア！`, txt);
  addLevelingBtn(`⚔️ Wave ${nextWave}へ挑む`, '', () => startEndlessWave());
  addLevelingBtn('🏳️ 試練を終える', 'back-btn', () => { gs.endlessTrialMode = null; gotoScene('endless_trial_hub'); });
}

function endBattle(victory, escaped = false) {
  gs.inBattle = false;

  if (escaped) {
    // 逃走成功: returnSceneへ
    document.getElementById('battle-area').classList.add('hidden');
    document.getElementById('story-text-area').classList.remove('hidden');
    document.getElementById('choices-area').classList.remove('hidden');
    gotoScene(gs.currentScene);
    gs.postBattleScene = null;
    return;
  }

  if (victory) {
    gs.battleKillCount = (gs.battleKillCount || 0) + 1;
    const e = gs.enemy;
    // expCharm 倍率計算
    const expMult = ['acc1','acc2'].reduce((m, s) => {
      const id = gs.player.equipment[s];
      return m * (id && ITEM_DATA[id]?.expBonus ? ITEM_DATA[id].expBonus : 1);
    }, 1);
    const seasonD = getSeasonData();
    const gainedExp  = Math.floor(e.exp * expMult * (gs.adminMult?.exp || 1) * (seasonD.expMult || 1));
    const gainedGold = Math.floor(e.gold * (gs.adminMult?.gold || 1) * (seasonD.goldMult || 1));
    gs.player.exp  += gainedExp;
    gs.player.gold += gainedGold;

    addBattleLog(`🎉 ${e.name} を倒した！`, 'log-system');
    if (typeof SoundEngine !== 'undefined') SoundEngine.playVictory();
    const expStr = expMult > 1 ? `EXP +${gainedExp}（🍀×${expMult}）` : `EXP +${gainedExp}`;
    const seasonSuffix = seasonD.expMult > 1 ? `（${getSeasonData().emoji}×${seasonD.expMult}）` : '';
    if (gainedGold > 0) addBattleLog(`💰 ${gainedGold}G を手に入れた！ ${expStr}${seasonSuffix}`, 'log-system');
    else                addBattleLog(`✨ ${expStr}${seasonSuffix}`, 'log-system');

    // モンスター図鑑
    if (e._id) recordEnemyKill(e._id);

    // 素材ドロップ
    if (e._id && MATERIAL_DROPS[e._id]) {
      const drop = MATERIAL_DROPS[e._id];
      if (Math.random() < drop.rate) {
        addItem(drop.material);
        const mat = ITEM_DATA[drop.material];
        addBattleLog(`✨ ${mat.emoji}「${mat.name}」を手に入れた！`, 'log-system');
      }
    }

    // クエスト進捗（撃破系）
    initQuests();
    updateQuestProgress('kill_any', {});
    if (e._id) {
      updateQuestProgress('kill_type', { enemy: e._id });
      if (e.isBoss) updateQuestProgress('kill_boss', { enemy: e._id });
    }

    // 絆EXP獲得
    const bondGain = e.isBoss ? 30 : 10;
    gainBondExp(bondGain);

    // 戦闘回数・称号チェック
    gs.totalBattles = (gs.totalBattles || 0) + 1;
    checkTitles();

    // healRing 戦闘後回復
    let healPct = ['acc1','acc2'].reduce((sum, s) => {
      const id = gs.player.equipment[s];
      return sum + (id && ITEM_DATA[id]?.healAfterBattle ? ITEM_DATA[id].healAfterBattle : 0);
    }, 0);
    if (healPct > 0) {
      const healed = Math.min(Math.floor(gs.player.maxHp * healPct), gs.player.maxHp - gs.player.hp);
      if (healed > 0) {
        gs.player.hp += healed;
        addBattleLog(`💚 回復の指輪 HP +${healed} 回復！`, 'log-heal');
      }
    }

    // 春の恵み: 戦闘後HP回復
    const _sd = getSeasonData();
    if (_sd.healAfterBattle > 0 && gs.player.hp < gs.player.maxHp) {
      const springHeal = Math.min(Math.floor(gs.player.maxHp * _sd.healAfterBattle), gs.player.maxHp - gs.player.hp);
      if (springHeal > 0) {
        gs.player.hp += springHeal;
        addBattleLog(`🌸 春の恵み HP +${springHeal} 回復！`, 'log-heal');
      }
    }

    // 季節進行チェック
    advanceSeason();

    updateStatus();
    checkLevelUp();
    gs.enemy = null;

    // 戦闘不能だった仲間をHP1で復活
    if (gs.companion && gs.companion.hp <= 0) {
      gs.companion.hp = 1;
      addBattleLog(`💫 👱‍♀️ アリアが立ち上がった！（HP1）`, 'log-aria');
      updateAriaStatus();
    }
    Object.values(gs.companions || {}).forEach(c => {
      if (c && c.joined && c.hp <= 0) {
        c.hp = 1;
        addBattleLog(`💫 ${c.emoji} ${c.name}が立ち上がった！（HP1）`, 'log-companion');
      }
    });
    updateAllCompanionsStatus();

    if (gs.levelingMode) {
      gs.postBattleScene = null;
      setTimeout(() => handleLevelingVictory(gainedExp, gainedGold), 1000);
      return;
    }

    if (gs.godsTowerMode) {
      gs.postBattleScene = null;
      setTimeout(() => handleTowerVictory(gainedExp, gainedGold), 1000);
      return;
    }

    if (gs.endlessTrialMode) {
      gs.postBattleScene = null;
      setTimeout(() => handleEndlessVictory(gainedExp, gainedGold), 1000);
      return;
    }

    // 隠し番人撃破報酬
    if (gs.hiddenEnemyPending) {
      const htReward = gs.hiddenEnemyPending;
      gs.hiddenEnemyPending = null;
      gs.flags[htReward.flag] = true;
      if (htReward.reward.gold) gs.player.gold += htReward.reward.gold;
      if (htReward.reward.items) htReward.reward.items.forEach(id => addItem(id));
      updateStatus();
      const nextScene2 = gs.postBattleScene || gs.currentScene;
      gs.postBattleScene = null;
      setTimeout(() => {
        document.getElementById('battle-area').classList.add('hidden');
        document.getElementById('story-text-area').classList.remove('hidden');
        document.getElementById('choices-area').classList.remove('hidden');
        gotoScene(nextScene2);
        openHiddenTreasurePopup('🏆', '隠し部屋クリア！', htReward.rewardText, [
          { label: '✨ 素晴らしい！', close: true },
        ]);
      }, 1400);
      return;
    }

    const nextScene = gs.postBattleScene || gs.currentScene;
    gs.postBattleScene = null;

    setTimeout(() => {
      document.getElementById('battle-area').classList.add('hidden');
      document.getElementById('story-text-area').classList.remove('hidden');
      document.getElementById('choices-area').classList.remove('hidden');
      gotoScene(nextScene);
    }, 1400);

  } else {
    // 敗北
    gs.enemy = null;
    gs.postBattleScene = null;
    if (typeof SoundEngine !== 'undefined') SoundEngine.playGameover();
    document.getElementById('gameover-overlay').classList.remove('hidden');
  }
}

// ============================================================
//  レベルアップ
// ============================================================

// ============================================================
//  アリア（仲間キャラクター）システム
// ============================================================

function createAriaCompanion(playerLevel) {
  const lv = Math.max(1, playerLevel);
  return {
    name: 'アリア',
    emoji: '👱‍♀️',
    hp:     80 + (lv - 1) * 12,
    maxHp:  80 + (lv - 1) * 12,
    mp:     25 + (lv - 1) * 3,
    maxMp:  25 + (lv - 1) * 3,
    level:  lv,
    baseAtk:  18 + (lv - 1) * 5,
    baseDef:  4  + (lv - 1) * 2,
    baseMatk: 8  + (lv - 1) * 3,
    equipment: { weapon: null, head: null, body: null, acc1: null, acc2: null },
    shinkenCooldown: 0,
  };
}

function getAriaAtk()  { return getCompanionAtk('aria');  }
function getAriaDef()  { return getCompanionDef('aria');  }
function getAriaMatk() { return getCompanionMatk('aria'); }

function updateAriaStatus() {
  const a = gs.companion;
  const box = document.getElementById('aria-box');
  if (!box) return;
  box.style.display = a ? '' : 'none';
  if (!a) return;

  document.getElementById('aria-level-display').textContent = `Lv. ${a.level}`;
  document.getElementById('aria-hp-text').textContent  = `${fmtNum(a.hp)}/${fmtNum(a.maxHp)}`;
  document.getElementById('aria-mp-text').textContent  = `${fmtNum(a.mp)}/${fmtNum(a.maxMp)}`;
  document.getElementById('aria-hp-bar').style.width   = `${clamp(a.hp / a.maxHp * 100, 0, 100)}%`;
  document.getElementById('aria-mp-bar').style.width   = `${clamp(a.mp / a.maxMp * 100, 0, 100)}%`;
  document.getElementById('aria-stat-atk').textContent  = getAriaAtk();
  document.getElementById('aria-stat-def').textContent  = getAriaDef();
  document.getElementById('aria-stat-matk').textContent = getAriaMatk();

  const aw = a.equipment.weapon;
  const ab = a.equipment.body;
  const ah = a.equipment.head;
  const wn = aw ? ITEM_DATA[aw].emoji : '🗡️';
  const bn = ab ? ITEM_DATA[ab].emoji : '👕';
  const ed = document.getElementById('aria-equip-display');
  if (ed) {
    const parts = [
      `${wn}${aw ? ITEM_DATA[aw].name.slice(0,4) : '素手'}`,
      ah ? `${ITEM_DATA[ah].emoji}${ITEM_DATA[ah].name.slice(0,4)}` : null,
      `${bn}${ab ? ITEM_DATA[ab].name.slice(0,4) : '軽装'}`,
    ].filter(Boolean);
    ed.textContent = parts.join(' ');
  }
}

function updateAriaBattleStatus() {
  updateAllCompanionsBattleStatus();
}

function updateAllCompanionsStatus() {
  updateAriaStatus();
  ['gaius','luna','sola','serafina','zephiros'].forEach(id => updateCompanionStatusBox(id));
}

function updateCompanionStatusBox(id) {
  const c = gs.companions?.[id];
  const box = document.getElementById(`${id}-box`);
  if (!box) return;
  box.style.display = (c && c.joined) ? '' : 'none';
  if (!c || !c.joined) return;
  const def = COMPANION_DEFS[id];
  document.getElementById(`${id}-level-display`).textContent = `Lv. ${c.level}`;
  document.getElementById(`${id}-hp-text`).textContent  = `${fmtNum(c.hp)}/${fmtNum(c.maxHp)}`;
  document.getElementById(`${id}-mp-text`).textContent  = `${fmtNum(c.mp)}/${fmtNum(c.maxMp)}`;
  document.getElementById(`${id}-hp-bar`).style.width   = `${clamp(c.hp / c.maxHp * 100, 0, 100)}%`;
  document.getElementById(`${id}-mp-bar`).style.width   = `${clamp(c.mp / c.maxMp * 100, 0, 100)}%`;
}

function updateAllCompanionsBattleStatus() {
  const container = document.getElementById('companions-battle-status');
  if (!container) return;
  container.innerHTML = '';

  const allComps = [
    ['aria', gs.companion],
    ...Object.entries(gs.companions || {}).map(([id, c]) => [id, c]),
  ];
  let anyVisible = false;
  allComps.forEach(([id, c]) => {
    if (!c || !c.joined) return;
    anyVisible = true;
    const isDead = c.hp <= 0;
    const hpPct = clamp(c.hp / c.maxHp * 100, 0, 100);
    const row = document.createElement('div');
    row.className = 'companion-battle-row' + (isDead ? ' companion-dead-row' : '');
    row.innerHTML = `
      <span class="comp-battle-label">${c.emoji} ${c.name}</span>
      <span class="comp-battle-hp ${isDead ? 'comp-dead' : ''}">${isDead ? '💀 戦闘不能' : fmtNum(c.hp)+'/'+fmtNum(c.maxHp)}</span>
      <div class="bar-track comp-hp-track"><div class="bar hp-bar-fill" style="width:${hpPct}%"></div></div>`;
    container.appendChild(row);
  });
  container.style.display = anyVisible ? '' : 'none';
}

// 回復スポット
const RECOVER_MSGS = [
  'HPとMPが完全に回復した！',
  '不思議な力が傷を癒していく...',
  '体中に活力が満ち溢れた！',
  '疲れが嘘のように消えていく...',
];
function recoverAtSpot(emoji, msg) {
  const p = gs.player;
  p.hp = p.maxHp;
  p.mp = p.maxMp;
  const bonus = RECOVER_MSGS[Math.floor(Math.random() * RECOVER_MSGS.length)];
  if (gs.companion && gs.companion.joined) {
    gs.companion.hp = gs.companion.maxHp;
    gs.companion.mp = gs.companion.maxMp;
  }
  Object.values(gs.companions || {}).forEach(c => {
    if (c && c.joined) { c.hp = c.maxHp; c.mp = c.maxMp; }
  });
  updateStatus();
  updateAllCompanionsStatus();
  showToast(`${emoji} ${msg} ${bonus}`);
}

function innRest(cost, emoji, innName) {
  if (gs.player.gold < cost) {
    showToast(`💸 ゴールドが足りない！（${cost}G必要）`);
    return;
  }
  gs.player.gold -= cost;
  gs.player.hp = gs.player.maxHp;
  gs.player.mp = gs.player.maxMp;
  if (gs.companion && gs.companion.joined) {
    gs.companion.hp = gs.companion.maxHp;
    gs.companion.mp = gs.companion.maxMp;
  }
  Object.values(gs.companions || {}).forEach(c => {
    if (c && c.joined) { c.hp = c.maxHp; c.mp = c.maxMp; }
  });
  updateStatus();
  updateAllCompanionsStatus();
  showToast(`${emoji} ${innName}で一夜を過ごした。全員のHPとMPが全回復！`);
}

// アリアの自動行動
function afterPlayerTurn(delay = 700) {
  gs.companionTurnQueue = getAllAliveCompanions();
  gs.companionTurnIdx = 0;
  if (gs.companionTurnQueue.length > 0) setTimeout(runNextCompanionTurn, delay);
  else setTimeout(enemyTurn, delay);
}

function getAllAliveCompanions() {
  const result = [];
  if (gs.companion && gs.companion.hp > 0) result.push('aria');
  ['gaius', 'luna', 'sola', 'serafina', 'zephiros'].forEach(id => {
    const c = gs.companions?.[id];
    if (c && c.joined && c.hp > 0) result.push(id);
  });
  return result;
}

function runNextCompanionTurn() {
  if (!gs.inBattle || !gs.enemy || gs.enemy.hp <= 0) return;
  if (gs.companionTurnIdx >= gs.companionTurnQueue.length) { enemyTurn(); return; }
  const id = gs.companionTurnQueue[gs.companionTurnIdx++];
  if (id === 'aria')     ariaAutoTurn();
  else if (id === 'gaius')    gaiusAutoTurn();
  else if (id === 'luna')     lunaAutoTurn();
  else if (id === 'sola')     solaAutoTurn();
  else if (id === 'serafina') serafinaAutoTurn();
  else if (id === 'zephiros') zephirosAutoTurn();
  else runNextCompanionTurn();
}

function ariaAutoTurn() {
  const a = gs.companion;
  if (!a || a.hp <= 0 || !gs.inBattle) { runNextCompanionTurn(); return; }

  const playerHpPct = gs.player.hp / gs.player.maxHp;
  const ariaHpPct   = a.hp / a.maxHp;

  // 優先順位: 1.HP危機→加護 2.渾身（CD0かつMP足りる）3.疾風斬り
  if ((playerHpPct < 0.35 || ariaHpPct < 0.35) && a.mp >= 15) {
    ariaHeal();
  } else if (a.shinkenCooldown === 0 && a.mp >= 25 && Math.random() < 0.35) {
    ariaShinken();
  } else {
    ariaDash();
  }
  // クールダウン減算（渾身を使っていない場合のみ）
  if (a.shinkenCooldown > 0 && a.shinkenCooldown < 3) a.shinkenCooldown--;
}

function ariaDash() {
  if (!gs.enemy || gs.enemy.hp <= 0) { runNextCompanionTurn(); return; }
  const a = gs.companion;
  const eDef = getEnemyEffectiveDef();
  const hit1 = Math.max(1, getAriaAtk() - eDef + rand(-3, 3));
  const hit2 = Math.max(1, getAriaAtk() - eDef + rand(-3, 3));
  gs.enemy.hp = clamp(gs.enemy.hp - hit1 - hit2, 0, gs.enemy.maxHp);
  addBattleLog(`⚡ 👱‍♀️ アリアの「疾風斬り」！ ${gs.enemy.name}に ${hit1}+${hit2} ダメージ！`, 'log-aria');
  updateBattleDisplay();
  if (gs.enemy.hp <= 0) { setTimeout(() => endBattle(true), 600); return; }
  setTimeout(runNextCompanionTurn, 700);
}

function ariaHeal() {
  const a = gs.companion;
  const cost = 15;
  a.mp = Math.max(0, a.mp - cost);
  const healP = Math.max(20, Math.floor(getAriaMatk() * 1.5));
  const healA = Math.max(15, Math.floor(getAriaMatk() * 1.2));
  gs.player.hp   = clamp(gs.player.hp   + healP, 0, gs.player.maxHp);
  a.hp            = clamp(a.hp           + healA, 0, a.maxHp);
  addBattleLog(`✨ 👱‍♀️ アリアの「聖なる加護」！ アレクのHPが${healP}回復！ アリアも${healA}回復！`, 'log-aria');
  updateStatus();
  updateAllCompanionsBattleStatus();
  if (!gs.enemy || gs.enemy.hp <= 0) return;
  setTimeout(runNextCompanionTurn, 700);
}

function ariaShinken() {
  if (!gs.enemy || gs.enemy.hp <= 0) { enemyTurn(); return; }
  const a = gs.companion;
  const cost = 25;
  a.mp = Math.max(0, a.mp - cost);
  a.shinkenCooldown = 3;
  const dmg = Math.max(10, Math.floor(getAriaAtk() * 2.8) + rand(-10, 10));
  gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
  addBattleLog(`💥 👱‍♀️ アリアの「渾身の一撃」！！ ${gs.enemy.name}に ${dmg} 大ダメージ！`, 'log-aria');
  updateBattleDisplay();
  updateAllCompanionsBattleStatus();
  if (gs.enemy.hp <= 0) { setTimeout(() => endBattle(true), 600); return; }
  setTimeout(runNextCompanionTurn, 700);
}

// ============================================================
//  仲間AI・スキル
// ============================================================

function getEnemyEffectiveDef() {
  const base = gs.enemy?.defense || 0;
  return gs.buffs?.solaDebuffTurns > 0 ? Math.floor(base * 0.6) : base;
}
function getEnemyEffectiveAtk() {
  const base = gs.enemy?.attack || 0;
  return gs.buffs?.solaDebuffTurns > 0 ? Math.floor(base * 0.6) : base;
}

// ガイアス
function gaiusAutoTurn() {
  const c = gs.companions?.gaius;
  if (!c || c.hp <= 0 || !gs.inBattle) { runNextCompanionTurn(); return; }
  const playerHpPct   = gs.player.hp / gs.player.maxHp;
  const gaiusHpPct    = c.hp / c.maxHp;
  const cd = c.skillCooldowns;

  if (gaiusHpPct < 0.3 && !cd.ironStance) {
    gaiusIronStanceSkill(c);
  } else if (playerHpPct < 0.25 && !cd.vanguard) {
    gaiusVanguardSkill(c);
  } else if (!gs.buffs.gaiusTauntTurns && !cd.taunt) {
    gaiusTauntSkill(c);
  } else {
    // 通常攻撃
    const eDef = getEnemyEffectiveDef();
    const dmg = Math.max(1, getCompanionAtk('gaius') - eDef + rand(-3, 3));
    gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
    addBattleLog(`⚔️ 🛡️ ガイアスの攻撃！ ${gs.enemy.name}に ${dmg} ダメージ！`, 'log-companion');
    updateBattleDisplay();
    if (gs.enemy.hp <= 0) { setTimeout(() => endBattle(true), 600); return; }
  }
  if (!gs.enemy || gs.enemy.hp <= 0) return;
  setTimeout(runNextCompanionTurn, 700);
}
function gaiusTauntSkill(c) {
  gs.buffs.gaiusTauntTurns = 3;
  c.skillCooldowns.taunt = 5;
  addBattleLog(`🛡️ ガイアスの「挑発」！ 敵の攻撃が3ターン、ガイアスに集中する！`, 'log-companion');
}
function gaiusIronStanceSkill(c) {
  gs.buffs.gaiusIronStance = true;
  c.skillCooldowns.ironStance = 4;
  addBattleLog(`🔒 ガイアスの「鉄壁の構え」！ 次の被ダメージを90%軽減！`, 'log-companion');
}
function gaiusVanguardSkill(c) {
  gs.buffs.gaiusVanguard = true;
  c.skillCooldowns.vanguard = 5;
  addBattleLog(`🛡️ ガイアスの「仁王立ち」！ 次のターン、仲間へのダメージをガイアスが肩代わりする！`, 'log-companion');
}

// ルナ
function lunaAutoTurn() {
  const c = gs.companions?.luna;
  if (!c || c.hp <= 0 || !gs.inBattle) { runNextCompanionTurn(); return; }
  const cd = c.skillCooldowns;
  const lowMp = getAllAliveCompanions().some(id => {
    const t = getCompanionById(id);
    return t && t.mp < t.maxMp * 0.3;
  });

  if (!gs.buffs.lunaStarGuardTurns && !cd.starGuard && c.mp >= 20) {
    lunaStarGuardSkill(c);
  } else if (!gs.buffs.lunaMoonBuffTurns && !cd.moonBuff && c.mp >= 15) {
    lunaMoonBuffSkill(c);
  } else if (lowMp && !cd.miracle && c.mp >= 25) {
    lunaMiracleSkill(c);
  } else {
    // 魔法攻撃
    const eDef = getEnemyEffectiveDef();
    const dmg = Math.max(1, getCompanionMatk('luna') - eDef + rand(-5, 5));
    gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
    addBattleLog(`🌙 ルナの魔法！ ${gs.enemy.name}に ${dmg} ダメージ！`, 'log-companion');
    updateBattleDisplay();
    if (gs.enemy.hp <= 0) { setTimeout(() => endBattle(true), 600); return; }
  }
  if (!gs.enemy || gs.enemy.hp <= 0) return;
  setTimeout(runNextCompanionTurn, 700);
}
function lunaStarGuardSkill(c) {
  c.mp -= 20; gs.buffs.lunaStarGuardTurns = 3; c.skillCooldowns.starGuard = 5;
  addBattleLog(`🌟 ルナの「星の加護」！ パーティの攻撃力・魔法力が3ターン1.5倍に！`, 'log-companion');
  updateAllCompanionsBattleStatus();
}
function lunaMoonBuffSkill(c) {
  c.mp -= 15; gs.buffs.lunaMoonBuffTurns = 3; c.skillCooldowns.moonBuff = 4;
  addBattleLog(`🌙 ルナの「月光の歌」！ パーティの防御力が3ターン上昇！`, 'log-companion');
}
function lunaMiracleSkill(c) {
  c.mp -= 25; c.skillCooldowns.miracle = 6;
  const mpRecov = 20;
  gs.player.mp = clamp(gs.player.mp + mpRecov, 0, gs.player.maxMp);
  if (gs.companion) gs.companion.mp = clamp(gs.companion.mp + mpRecov, 0, gs.companion.maxMp);
  ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
    const t = gs.companions?.[id];
    if (t && t.joined && t.hp > 0) t.mp = clamp(t.mp + mpRecov, 0, t.maxMp);
  });
  addBattleLog(`✨ ルナの「奇跡の祈り」！ パーティ全員のMPが${mpRecov}回復！`, 'log-companion');
  updateStatus(); updateAllCompanionsBattleStatus();
}

// ソラ
function solaAutoTurn() {
  const c = gs.companions?.sola;
  if (!c || c.hp <= 0 || !gs.inBattle) { runNextCompanionTurn(); return; }
  const cd = c.skillCooldowns;

  if (!gs.buffs.solaDebuffTurns && !cd.debuff && c.mp >= 20) {
    solaDebuffSkill(c);
  } else if (!gs.buffs.solaStunned && !cd.stun && c.mp >= 25) {
    solaStunSkill(c);
  } else if (!cd.weaken && c.mp >= 30 && Math.random() < 0.3) {
    solaWeakenSkill(c);
  } else {
    // 魔法攻撃
    const eDef = getEnemyEffectiveDef();
    const dmg = Math.max(1, getCompanionMatk('sola') - eDef + rand(-5, 5));
    gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
    addBattleLog(`⭐ ソラの魔法！ ${gs.enemy.name}に ${dmg} ダメージ！`, 'log-companion');
    updateBattleDisplay();
    if (gs.enemy.hp <= 0) { setTimeout(() => endBattle(true), 600); return; }
  }
  if (!gs.enemy || gs.enemy.hp <= 0) return;
  setTimeout(runNextCompanionTurn, 700);
}
function solaDebuffSkill(c) {
  c.mp -= 20; gs.buffs.solaDebuffTurns = 3; c.skillCooldowns.debuff = 5;
  addBattleLog(`🌑 ソラの「闇の呪縛」！ 敵の攻撃力・防御力が3ターン大幅ダウン！`, 'log-companion');
  updateStatusDisplay();
}
function solaStunSkill(c) {
  c.mp -= 25; gs.buffs.solaStunned = true; c.skillCooldowns.stun = 4;
  addBattleLog(`⛓️ ソラの「束縛の鎖」！ 敵を1ターン行動不能に！`, 'log-companion');
}
function solaWeakenSkill(c) {
  c.mp -= 30; gs.buffs.solaDebuffTurns = Math.max(gs.buffs.solaDebuffTurns, 4); c.skillCooldowns.weaken = 6;
  addBattleLog(`💀 ソラの「弱体の烙印」！ 敵の全ステータスが4ターン低下！`, 'log-companion');
  updateStatusDisplay();
}

// セラフィナ
function serafinaAutoTurn() {
  const c = gs.companions?.serafina;
  if (!c || c.hp <= 0 || !gs.inBattle) { runNextCompanionTurn(); return; }
  const cd = c.skillCooldowns;

  // 戦闘不能の仲間がいれば蘇生優先
  const deadComp = getAllDeadCompanions();
  if (deadComp.length > 0 && !cd.revive && c.mp >= 30) {
    serafinaReviveSkill(c, deadComp[0]);
    setTimeout(runNextCompanionTurn, 700); return;
  }
  // 状態異常があれば浄化
  const hasStatus = gs.playerStatus || ['gaius','luna','sola','serafina','zephiros'].some(id => {
    const t = gs.companions?.[id]; return t && t.status;
  });
  if (hasStatus && !cd.purify && c.mp >= 15) {
    serafinaPurifySkill(c);
    setTimeout(runNextCompanionTurn, 700); return;
  }
  // HPが危険なメンバーを回復
  const critMember = findCriticalHpMember();
  if (critMember && !cd.heal && c.mp >= 20) {
    serafinaHealSkill(c, critMember);
    setTimeout(runNextCompanionTurn, 700); return;
  }
  // 聖域が切れていれば使用
  if (!gs.buffs.serafinaSanctuaryTurns && !cd.sanctuary && c.mp >= 35) {
    serafinaSanctuarySkill(c);
    setTimeout(runNextCompanionTurn, 700); return;
  }
  // 全体回復（HPが低めのメンバー複数いる場合）
  if (!cd.partyHeal && c.mp >= 25) {
    const lowHpCount = countLowHpPartyMembers(0.6);
    if (lowHpCount >= 2) {
      serafinaPartyHealSkill(c);
      setTimeout(runNextCompanionTurn, 700); return;
    }
  }
  // MP大幅不足（複数）ならマナの泉
  if (!cd.manaSpring && c.mp >= 35) {
    const lowMpCount = countLowMpPartyMembers(0.35);
    if (lowMpCount >= 2) {
      serafinaManaSpring(c);
      setTimeout(runNextCompanionTurn, 700); return;
    }
  }
  // マナ還元（敵にダメージが入っていて、MP不足のメンバーがいる）
  if (!cd.manaReturn && gs.enemy && (gs.enemy.maxHp - gs.enemy.hp) > gs.enemy.maxHp * 0.15) {
    const needMp = countLowMpPartyMembers(0.5) > 0;
    if (needMp) {
      serafinaManaReturn(c);
      setTimeout(runNextCompanionTurn, 700); return;
    }
  }
  // 単体MP回復（1人が低い）
  if (!cd.manaBlessing && c.mp >= 20) {
    const lowMpMember = findLowMpMember(0.30);
    if (lowMpMember) {
      serafinaManaBlessing(c, lowMpMember);
      setTimeout(runNextCompanionTurn, 700); return;
    }
  }
  // 単体通常攻撃（後は攻撃のみ）
  const eDef = getEnemyEffectiveDef();
  const dmg = Math.max(1, getCompanionMatk('serafina') - eDef + rand(-5, 5));
  gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
  addBattleLog(`✨ セラフィナの光の矢！ ${gs.enemy.name}に ${dmg} ダメージ！`, 'log-companion');
  updateBattleDisplay();
  if (gs.enemy.hp <= 0) { setTimeout(() => endBattle(true), 600); return; }
  setTimeout(runNextCompanionTurn, 700);
}
function serafinaHealSkill(c, targetId) {
  c.mp -= 20; c.skillCooldowns.heal = 2;
  const target = getCompanionById(targetId);
  const heal = Math.max(30, Math.floor(getCompanionMatk('serafina') * 2.0));
  if (target) {
    target.hp = clamp(target.hp + heal, 0, target.maxHp);
    const tname = targetId === 'player' ? 'アレク' : target.name;
    addBattleLog(`✨ セラフィナの「聖なる癒し」！ ${tname}のHPが${heal}回復！`, 'log-heal');
  }
  updateStatus(); updateAllCompanionsBattleStatus();
}
function serafinaPartyHealSkill(c) {
  c.mp -= 25; c.skillCooldowns.partyHeal = 3;
  const heal = Math.max(20, Math.floor(getCompanionMatk('serafina') * 1.2));
  gs.player.hp = clamp(gs.player.hp + heal, 0, gs.player.maxHp);
  if (gs.companion) gs.companion.hp = clamp(gs.companion.hp + heal, 0, gs.companion.maxHp);
  ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
    const t = gs.companions?.[id];
    if (t && t.joined && t.hp > 0) t.hp = clamp(t.hp + heal, 0, t.maxHp);
  });
  addBattleLog(`🌿 セラフィナの「全体回復」！ 全員のHPが${heal}回復！`, 'log-heal');
  updateStatus(); updateAllCompanionsBattleStatus();
}
function serafinaReviveSkill(c, targetId) {
  c.mp -= 30; c.skillCooldowns.revive = 5;
  const target = getCompanionById(targetId);
  if (target && target.hp <= 0) {
    target.hp = Math.floor(target.maxHp * 0.5);
    const tname = target.name;
    addBattleLog(`💫 セラフィナの「蘇生」！ ${tname}が復活！ HP${target.hp}で立ち上がった！`, 'log-heal');
    updateAriaStatus(); updateAllCompanionsStatus();
  }
  updateAllCompanionsBattleStatus();
}
function serafinaPurifySkill(c) {
  c.mp -= 15; c.skillCooldowns.purify = 3;
  gs.playerStatus = null;
  ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
    const t = gs.companions?.[id]; if (t) t.status = null;
  });
  addBattleLog(`🌿 セラフィナの「浄化」！ パーティ全員の状態異常を回復！`, 'log-heal');
  updateStatusDisplay();
}
function serafinaSanctuarySkill(c) {
  c.mp -= 35; gs.buffs.serafinaSanctuaryTurns = 3; c.skillCooldowns.sanctuary = 6;
  addBattleLog(`🌟 セラフィナの「聖域」！ 3ターン間、毎ターンパーティのHPが回復！`, 'log-heal');
}

function serafinaManaBlessing(c, targetId) {
  c.mp -= 20; c.skillCooldowns.manaBlessing = 3;
  const restore = Math.max(15, Math.floor(getCompanionMatk('serafina') * 0.6));
  const target = targetId === 'player' ? gs.player : getCompanionById(targetId);
  if (!target) return;
  const actual = Math.min(restore, target.maxMp - target.mp);
  target.mp = clamp(target.mp + restore, 0, target.maxMp);
  const tname = targetId === 'player' ? 'アレク' : target.name;
  if (actual <= 0) {
    addBattleLog(`💫 セラフィナの「マナの祝福」！ ${tname}のMPはすでに満タンだ！`, 'log-heal');
  } else {
    addBattleLog(`💫 セラフィナの「マナの祝福」！ ${tname}のMPが${actual}回復！`, 'log-heal');
  }
  updateStatus(); updateAllCompanionsBattleStatus();
}

function serafinaManaSpring(c) {
  c.mp -= 35; c.skillCooldowns.manaSpring = 5;
  const restore = Math.max(10, Math.floor(getCompanionMatk('serafina') * 0.4));
  const targets = [];
  const pActual = Math.min(restore, gs.player.maxMp - gs.player.mp);
  gs.player.mp = clamp(gs.player.mp + restore, 0, gs.player.maxMp);
  if (pActual > 0) targets.push(`アレク(+${pActual})`);
  if (gs.companion && gs.companion.hp > 0) {
    const aActual = Math.min(restore, gs.companion.maxMp - gs.companion.mp);
    gs.companion.mp = clamp(gs.companion.mp + restore, 0, gs.companion.maxMp);
    if (aActual > 0) targets.push(`${gs.companion.name}(+${aActual})`);
  }
  ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
    const t = gs.companions?.[id];
    if (t && t.joined && t.hp > 0) {
      const actual = Math.min(restore, t.maxMp - t.mp);
      t.mp = clamp(t.mp + restore, 0, t.maxMp);
      if (actual > 0) targets.push(`${t.name}(+${actual})`);
    }
  });
  const msg = targets.length > 0 ? targets.join('・') : '（全員MP満タン）';
  addBattleLog(`🌊 セラフィナの「マナの泉」！ パーティのMPを回復！ ${msg}`, 'log-heal');
  updateStatus(); updateAllCompanionsBattleStatus();
}

function serafinaManaReturn(c) {
  c.skillCooldowns.manaReturn = 4;
  const kills = gs.battleKillCount || 0;
  const enemyDmgDone = gs.enemy ? gs.enemy.maxHp - gs.enemy.hp : 0;
  const restore = Math.max(8, Math.floor(getCompanionMatk('serafina') * 0.25)
    + Math.floor(enemyDmgDone * 0.1)
    + kills * Math.floor(getCompanionMatk('serafina') * 0.15));
  const targets = [];
  const pActual = Math.min(restore, gs.player.maxMp - gs.player.mp);
  gs.player.mp = clamp(gs.player.mp + restore, 0, gs.player.maxMp);
  if (pActual > 0) targets.push(`アレク(+${pActual})`);
  if (gs.companion && gs.companion.hp > 0) {
    const aActual = Math.min(restore, gs.companion.maxMp - gs.companion.mp);
    gs.companion.mp = clamp(gs.companion.mp + restore, 0, gs.companion.maxMp);
    if (aActual > 0) targets.push(`${gs.companion.name}(+${aActual})`);
  }
  ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
    const t = gs.companions?.[id];
    if (t && t.joined && t.hp > 0) {
      const actual = Math.min(restore, t.maxMp - t.mp);
      t.mp = clamp(t.mp + restore, 0, t.maxMp);
      if (actual > 0) targets.push(`${t.name}(+${actual})`);
    }
  });
  const msg = targets.length > 0 ? targets.join('・') : '（全員MP満タン）';
  addBattleLog(`🔮 セラフィナの「マナ還元」！ 敵の魔力を吸収してパーティに分配！ ${msg}`, 'log-heal');
  updateStatus(); updateAllCompanionsBattleStatus();
}

function getAllDeadCompanions() {
  const result = [];
  if (gs.companion && gs.companion.hp <= 0) result.push('aria');
  ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
    const c = gs.companions?.[id];
    if (c && c.joined && c.hp <= 0) result.push(id);
  });
  return result;
}
function findCriticalHpMember() {
  if (gs.player.hp / gs.player.maxHp < 0.35) return 'player';
  if (gs.companion && gs.companion.hp > 0 && gs.companion.hp / gs.companion.maxHp < 0.35) return 'aria';
  for (const id of ['gaius','luna','sola','serafina','zephiros']) {
    const c = gs.companions?.[id];
    if (c && c.joined && c.hp > 0 && c.hp / c.maxHp < 0.35) return id;
  }
  return null;
}
function countLowHpPartyMembers(threshold) {
  let count = 0;
  if (gs.player.hp / gs.player.maxHp < threshold) count++;
  if (gs.companion && gs.companion.hp > 0 && gs.companion.hp / gs.companion.maxHp < threshold) count++;
  ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
    const c = gs.companions?.[id];
    if (c && c.joined && c.hp > 0 && c.hp / c.maxHp < threshold) count++;
  });
  return count;
}

function findLowMpMember(threshold) {
  let worstId = null, worstRatio = 1;
  const pRatio = gs.player.mp / gs.player.maxMp;
  if (pRatio < threshold && pRatio < worstRatio) { worstRatio = pRatio; worstId = 'player'; }
  if (gs.companion && gs.companion.hp > 0) {
    const r = gs.companion.mp / gs.companion.maxMp;
    if (r < threshold && r < worstRatio) { worstRatio = r; worstId = 'aria'; }
  }
  ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
    const c = gs.companions?.[id];
    if (c && c.joined && c.hp > 0) {
      const r = c.mp / c.maxMp;
      if (r < threshold && r < worstRatio) { worstRatio = r; worstId = id; }
    }
  });
  return worstId;
}

function countLowMpPartyMembers(threshold) {
  let count = 0;
  if (gs.player.mp / gs.player.maxMp < threshold) count++;
  if (gs.companion && gs.companion.hp > 0 && gs.companion.mp / gs.companion.maxMp < threshold) count++;
  ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
    const c = gs.companions?.[id];
    if (c && c.joined && c.hp > 0 && c.mp / c.maxMp < threshold) count++;
  });
  return count;
}

// ゼフィロス
function zephirosAutoTurn() {
  const c = gs.companions?.zephiros;
  if (!c || c.hp <= 0 || !gs.inBattle) { runNextCompanionTurn(); return; }
  const cd = c.skillCooldowns;

  // 魔力解放が未使用かつMPあり → 優先使用
  if (!gs.buffs.zephirosMatkDoubleTurns && !cd.matkRelease && c.mp >= 40 && c.hp > c.maxHp * 0.4) {
    zephirosMatkReleaseSkill(c);
    setTimeout(runNextCompanionTurn, 700); return;
  }
  // 魔法障壁（被ダメが大きいボス戦で使用）
  if (gs.enemy?.isBoss && !gs.buffs.zephirosMagicBarrierTurns && !cd.barrier && c.mp >= 30) {
    zephirosMagicBarrierSkill(c);
    setTimeout(runNextCompanionTurn, 700); return;
  }
  // 超魔法ローテーション
  const spells = [
    { id: 'inferno',  name: '超魔法「インフェルノ」', emoji: '🔥', cost: 35, cdKey: 'inferno',  mult: 3.0 },
    { id: 'blizzard', name: '超魔法「ブリザード」',   emoji: '❄️', cost: 35, cdKey: 'blizzard', mult: 2.8 },
    { id: 'thunder',  name: '超魔法「サンダーボルト」', emoji: '⚡', cost: 35, cdKey: 'thunder', mult: 3.2 },
  ];
  const available = spells.filter(s => !cd[s.cdKey] && c.mp >= s.cost);
  if (available.length > 0) {
    const spell = available[Math.floor(Math.random() * available.length)];
    zephirosSuperSpell(c, spell);
    setTimeout(runNextCompanionTurn, 700); return;
  }
  // 通常魔法攻撃
  const eDef = getEnemyEffectiveDef();
  const dmg = Math.max(1, getCompanionMatk('zephiros') - eDef + rand(-8, 8));
  gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
  addBattleLog(`🔮 ゼフィロスの魔法！ ${gs.enemy.name}に ${dmg} ダメージ！`, 'log-companion');
  updateBattleDisplay();
  if (gs.enemy.hp <= 0) { setTimeout(() => endBattle(true), 600); return; }
  setTimeout(runNextCompanionTurn, 700);
}
function zephirosSuperSpell(c, spell) {
  c.mp -= spell.cost; c.skillCooldowns[spell.cdKey] = 4;
  const eDef = getEnemyEffectiveDef();
  const base = Math.max(1, Math.floor(getCompanionMatk('zephiros') * spell.mult) + rand(-15, 15) - eDef);
  const elemMap = { inferno: 'fire', blizzard: 'ice', thunder: 'thunder' };
  const element = elemMap[spell.id] || 'none';
  const { finalDmg, logMsg, absorbed } = applyElementMod(base, element);
  if (absorbed) {
    addBattleLog(`${spell.emoji} ゼフィロスの${spell.name}！！ しかし${gs.enemy.name}が吸収した！ ${logMsg}`, 'log-companion');
  } else if (finalDmg === 0) {
    addBattleLog(`${spell.emoji} ゼフィロスの${spell.name}！！ ${logMsg}${gs.enemy.name}はダメージを受けない！`, 'log-companion');
  } else {
    gs.enemy.hp = clamp(gs.enemy.hp - finalDmg, 0, gs.enemy.maxHp);
    addBattleLog(`${spell.emoji} ゼフィロスの${spell.name}！！ ${logMsg}${gs.enemy.name}に ${finalDmg} 大ダメージ！！`, 'log-companion');
    triggerBattleEffect(element === 'fire' ? 'fire' : element === 'ice' ? 'ice' : 'thunder');
    showDamageNum(finalDmg, 'dmg'); flashEnemyHit();
  }
  updateBattleDisplay();
  if (gs.enemy.hp <= 0) setTimeout(() => endBattle(true), 600);
}
function zephirosMatkReleaseSkill(c) {
  c.mp -= 40; gs.buffs.zephirosMatkDoubleTurns = 3; c.skillCooldowns.matkRelease = 6;
  const hpCost = Math.floor(c.maxHp * 0.15);
  c.hp = clamp(c.hp - hpCost, 1, c.maxHp);
  addBattleLog(`⚡ ゼフィロスの「魔力解放」！ 3ターン魔法力2倍！（HP${hpCost}消費）`, 'log-companion');
  updateAllCompanionsBattleStatus();
}
function zephirosMagicBarrierSkill(c) {
  c.mp -= 30; gs.buffs.zephirosMagicBarrierTurns = 1; c.skillCooldowns.barrier = 5;
  addBattleLog(`🔮 ゼフィロスの「魔法障壁」！ 次のターン、パーティへの魔法攻撃を無効化！`, 'log-companion');
}

// ============================================================
//  レベルアップ（アリア込み）
// ============================================================

const LEVEL_UP_CHOICES = {
  atk: { label: '⚔️ 攻撃重視', atk: 8, def: 1, matk: 2, hp: 10, mp: 3 },
  def: { label: '🛡️ 防御重視', atk: 2, def: 6, matk: 1, hp: 25, mp: 3 },
  mag: { label: '✨ 魔法重視', atk: 1, def: 1, matk: 8, hp: 10, mp: 10 },
  bal: { label: '⚖️ バランス', atk: 4, def: 3, matk: 4, hp: 15, mp: 5 },
};

function checkLevelUp() {
  const p = gs.player;
  if (p.level < 999 && p.exp >= EXP_TABLE[p.level]) {
    const oldLv = p.level;
    p.level++;

    // ワープ魔法習得（Lv10）
    if (p.level === 10 && !gs.flags.warpLearned) {
      gs.flags.warpLearned = true;
      setTimeout(() => showToast('🔮 ワープ魔法を習得した！ストーリー画面のボタンから使えます'), 2500);
    }

    // レベルクエスト進捗
    updateQuestProgress('reach_level', { level: p.level });
    checkTitles();

    // アリアも同時に成長
    const a = gs.companion;
    if (a) {
      a.level = p.level;
      a.maxHp += 12; a.maxMp += 3;
      a.hp = a.maxHp; a.mp = a.maxMp;
      a.baseAtk  += 5; a.baseDef += 2; a.baseMatk += 3;
    }
    // 新仲間の成長（個性に応じた成長傾向）
    const compGrowth = {
      gaius:    { hp: 20, mp: 2, atk: 4, def: 5, matk: 1 },
      luna:     { hp: 8,  mp: 7, atk: 3, def: 2, matk: 5 },
      sola:     { hp: 8,  mp: 7, atk: 3, def: 2, matk: 5 },
      serafina: { hp: 9,  mp: 8, atk: 2, def: 2, matk: 7 },
      zephiros: { hp: 6,  mp: 9, atk: 2, def: 1, matk: 9 },
    };
    Object.entries(gs.companions || {}).forEach(([id, c]) => {
      if (!c || !c.joined) return;
      const g = compGrowth[id];
      if (!g) return;
      c.level = p.level;
      c.maxHp += g.hp; c.maxMp += g.mp;
      c.hp = c.maxHp; c.mp = c.maxMp;
      c.baseAtk  += g.atk;
      c.baseDef  += g.def;
      c.baseMatk += g.matk;
    });

    addBattleLog(`⬆️ レベルアップ！Lv.${p.level}になった！HPとMPが全回復した！`, 'log-heal');
    if (typeof SoundEngine !== 'undefined') SoundEngine.playSFX('levelUp');
    showLevelUpChoice(oldLv);
    updateStatus();
  }
}

function showLevelUpChoice(oldLv) {
  const overlay = document.getElementById('levelup-overlay');
  document.getElementById('levelup-details').innerHTML =
    `Lv. ${oldLv} → <strong style="color:#f0c040">Lv. ${gs.player.level}</strong><br>` +
    `<span style="color:#aaa;font-size:13px">成長タイプを選んでください</span>`;

  const choicesEl = document.getElementById('levelup-choices');
  choicesEl.innerHTML = '';
  Object.entries(LEVEL_UP_CHOICES).forEach(([type, c]) => {
    const btn = document.createElement('button');
    btn.className = 'levelup-choice-btn';
    btn.innerHTML = `${c.label}<br><span style="font-size:11px;color:#aaa">HP+${c.hp} MP+${c.mp} ATK+${c.atk} DEF+${c.def} MAT+${c.matk}</span>`;
    btn.onclick = () => applyLevelUpChoice(type, oldLv);
    choicesEl.appendChild(btn);
  });

  document.getElementById('levelup-continue-btn').style.display = 'none';
  overlay.classList.remove('hidden');
}

function applyLevelUpChoice(type, oldLv) {
  const c = LEVEL_UP_CHOICES[type];
  const p = gs.player;
  p.maxHp    += c.hp;
  p.maxMp    += c.mp;
  p.baseAtk  += c.atk;
  p.baseDef  += c.def;
  p.baseMatk += c.matk;
  p.hp = p.maxHp;
  p.mp = p.maxMp;

  document.getElementById('levelup-details').innerHTML =
    `Lv. ${oldLv} → <strong style="color:#f0c040">Lv. ${p.level}</strong><br><br>` +
    `${c.label} を選択！<br>` +
    `❤️ 最大HP +${c.hp}　💙 最大MP +${c.mp}<br>` +
    `⚔️ 攻撃力 +${c.atk}　🛡️ 防御力 +${c.def}　✨ 魔法力 +${c.matk}<br><br>` +
    `<span style="color:#60e060">レベルアップ！HPとMPが全回復した！</span>`;
  document.getElementById('levelup-choices').innerHTML = '';
  document.getElementById('levelup-continue-btn').style.display = '';
  updateStatus();
}

function closeLevelUp() {
  document.getElementById('levelup-overlay').classList.add('hidden');
  // 連続レベルアップを処理
  const p = gs.player;
  if (p.level < 999 && p.exp >= EXP_TABLE[p.level]) {
    checkLevelUp();
  }
}

// ============================================================
//  ワープシステム
// ============================================================

const ARIA_WARP_OPEN = [
  '「どこに行くの？」',
  '「準備はいい？」',
  '「どこでも行けるって便利だよね〜」',
  '「気をつけてよ？」',
  '「一緒に頑張ろうね！」',
];

const ARIA_WARP_ARRIVE = [
  '「着いたね！」',
  '「また戻ってきたね！」',
  '「懐かしい場所だね」',
  '「さあ、行こう！」',
  '「ここって覚えてる？」',
];

// ============================================================
//  隠し宝箱・隠し部屋 システム
// ============================================================

function investigateScene() {
  const ht = HIDDEN_TREASURES[gs.currentScene];
  if (!ht || gs.flags[ht.flag]) return;

  if (ht.type === 'chest') {
    gs.flags[ht.flag] = true;
    if (ht.reward.gold) gs.player.gold += ht.reward.gold;
    if (ht.reward.items) ht.reward.items.forEach(id => addItem(id));
    updateStatus();
    openHiddenTreasurePopup(ht.emoji, ht.title, ht.findText, [
      { label: '✨ 素晴らしい！', close: true },
    ]);
  } else if (ht.type === 'enemy') {
    openHiddenTreasurePopup(ht.emoji, ht.title, ht.findText, [
      {
        label: '⚔️ 戦う！！', cls: 'enemy-fight-btn', close: true,
        action: () => {
          gs.hiddenEnemyPending = ht;
          gs.postBattleScene = gs.currentScene;
          startBattle({ ...ht.enemy, hp: ht.enemy.maxHp });
        },
      },
      { label: '↩️ やめておく', close: true },
    ]);
  }
}

function openHiddenTreasurePopup(emoji, title, text, buttons) {
  document.getElementById('hidden-treasure-emoji').textContent = emoji;
  document.getElementById('hidden-treasure-title').textContent = title;
  document.getElementById('hidden-treasure-text').textContent = text;
  const btnsEl = document.getElementById('hidden-treasure-buttons');
  btnsEl.innerHTML = '';
  (buttons || []).forEach(b => {
    const btn = document.createElement('button');
    if (b.cls) btn.classList.add(b.cls);
    btn.textContent = b.label;
    btn.onclick = () => {
      if (b.close) closeHiddenTreasurePopup();
      if (b.action) b.action();
    };
    btnsEl.appendChild(btn);
  });
  document.getElementById('hidden-treasure-overlay').classList.remove('hidden');
}

function closeHiddenTreasurePopup() {
  document.getElementById('hidden-treasure-overlay').classList.add('hidden');
  // 調べるボタンの状態を更新（再レンダリング）
  const scene = SCENES[gs.currentScene];
  if (scene) renderChoices(scene.choices || []);
}

function openWarpScreen() {
  if (gs.inBattle) return;

  document.getElementById('choices-area').classList.add('hidden');
  document.getElementById('equip-change-area').classList.add('hidden');
  document.getElementById('shop-area').classList.add('hidden');
  document.getElementById('smith-area').classList.add('hidden');
  document.getElementById('warp-area').classList.remove('hidden');

  // アリアのひとこと
  const comment = gs.companion
    ? ARIA_WARP_OPEN[Math.floor(Math.random() * ARIA_WARP_OPEN.length)]
    : '';
  document.getElementById('aria-warp-comment').textContent =
    comment ? `👱‍♀️ アリア ${comment}` : '';

  // ワープ先リスト描画
  const list = document.getElementById('warp-list');
  list.innerHTML = '';
  const hasAirship = !!gs.vehicles?.airship;
  WARP_DESTINATIONS.forEach(dest => {
    const visited = !!gs.flags[dest.flag] || hasAirship;
    const btn = document.createElement('button');
    btn.className = 'warp-dest-btn';
    btn.disabled = !visited;
    btn.innerHTML =
      `<span class="warp-emoji">${dest.emoji}</span>` +
      `<span class="warp-dest-name">${dest.name}</span>` +
      (!visited ? '<span class="warp-dest-unvisited">未訪問</span>' : '');
    if (visited) btn.onclick = () => executeWarp(dest);
    list.appendChild(btn);
  });
  if (hasAirship) {
    const note = document.createElement('div');
    note.style.cssText = 'color:#80c0ff;font-size:11px;margin-top:6px;text-align:center';
    note.textContent = '🚁 飛行船搭乗中 — 全ての行き先に移動可能';
    list.appendChild(note);
  }
}

function closeWarpScreen() {
  document.getElementById('warp-area').classList.add('hidden');
  document.getElementById('choices-area').classList.remove('hidden');
}

function executeWarp(dest) {
  // 魔法陣フラッシュ演出
  const panel = document.getElementById('story-panel');
  panel.classList.add('warp-flash');
  panel.addEventListener('animationend', () => panel.classList.remove('warp-flash'), { once: true });

  document.getElementById('warp-area').classList.add('hidden');

  if (gs.companion) {
    const msg = ARIA_WARP_ARRIVE[Math.floor(Math.random() * ARIA_WARP_ARRIVE.length)];
    showToast(`👱‍♀️ アリア ${msg}`);
  } else {
    showToast(`🔮 ${dest.name} へワープした！`);
  }

  setTimeout(() => gotoScene(dest.sceneId), 450);
}

// ============================================================
//  エンディング判定
// ============================================================

function getEndingScene() {
  const f = gs.flags;
  const allAreas = f.snowCleared && f.desertCleared && f.seaCleared;
  if (allAreas && f.elderBlessingDone) return 'ending_true';
  if (!f.snowCleared && !f.desertCleared) return 'ending_rush';
  return 'ending_good';
}

// ============================================================
//  シーンイベント処理
// ============================================================

function handleSceneEvent(event) {
  switch (event) {
    case 'healing_spring':
      gs.player.hp = gs.player.maxHp;
      gs.player.mp = gs.player.maxMp;
      if (gs.companion && gs.companion.joined) { gs.companion.hp = gs.companion.maxHp; gs.companion.mp = gs.companion.maxMp; }
      Object.values(gs.companions || {}).forEach(c => { if (c && c.joined) { c.hp = c.maxHp; c.mp = c.maxMp; } });
      updateStatus();
      updateAllCompanionsStatus();
      break;
    case 'give_staff':
      if (!gs.flags.gotStaff) {
        gs.flags.gotStaff = true;
        addItem('oldStaff');
        updateStatus();
      }
      break;
    case 'give_gemstone':
      if (!gs.flags.gotGemstone) {
        gs.flags.gotGemstone = true;
        addItem('gemstone');
        updateStatus();
      }
      break;
    case 'cave_trap_damage':
      if (!gs.flags.caveLeftVisited) {
        gs.flags.caveLeftVisited = true;
        gs.player.hp = clamp(gs.player.hp - 15, 1, gs.player.maxHp);
        updateStatus();
      }
      break;
    case 'give_castle_key':
      if (!gs.flags.gotCastleKey) {
        gs.flags.gotCastleKey = true;
        addItem('castleKey');
        updateStatus();
      }
      break;
    case 'give_hero_sword':
      if (!gs.flags.gotHeroSword) {
        gs.flags.gotHeroSword = true;
        addItem('heroSword');
        updateStatus();
      }
      break;
    case 'road_event':
      if (!gs.flags.roadEventDone) {
        gs.flags.roadEventDone = true;
        if (hasItem('herb')) removeItem('herb');
        updateStatus();
      }
      break;

    // 雪山イベント
    case 'snow_cliff_treasure':
      if (!gs.flags.snowCliffDone) {
        gs.flags.snowCliffDone = true;
        addItem('highHerb', 3);
        updateStatus();
      }
      break;
    case 'snow_hidden_treasure':
      if (!gs.flags.snowHiddenDone) {
        gs.flags.snowHiddenDone = true;
        addItem('spiritArmor');
        gs.player.hp = gs.player.maxHp;
        gs.player.mp = gs.player.maxMp;
        updateStatus();
      }
      break;
    case 'snow_cleared':
      if (!gs.flags.snowCleared) {
        gs.flags.snowCleared = true;
        addItem('ariaHelm');
        updateStatus();
      }
      break;

    // 砂漠イベント
    case 'desert_oasis_heal':
      if (!gs.flags.desertOasisUsed) {
        gs.flags.desertOasisUsed = true;
        gs.player.hp = clamp(gs.player.hp + Math.floor(gs.player.maxHp / 2), 0, gs.player.maxHp);
        updateStatus();
      } {
        const lv = gs.townDev?.desert || 0;
        if (lv > 0) {
          const el = document.getElementById('story-text');
          if (el) el.textContent = TOWN_DEV_DATA.desert.descs[lv];
        }
      }
      break;
    case 'desert_cleared':
      if (!gs.flags.desertCleared) {
        gs.flags.desertCleared = true;
        addItem('ancientBlade');
        updateStatus();
      }
      break;

    // 海底神殿イベント
    case 'route_ending':
      if (!gs.flags.demonKingDefeated) {
        gs.flags.demonKingDefeated = true;
        gs.flags.vis_gods_tower    = true;
        gs.flags.vis_void_map      = true;
        gs.flags.vis_desert_hidden = true;
        gs.flags.vis_endless_trial = true;
        // クリアフラグを確実に保存
        try { localStorage.setItem('rpg_save', JSON.stringify(gs)); } catch {}
      }
      gotoScene(getEndingScene());
      break;

    case 'endless_trial_hub_refresh': {
      const maxW = gs.endlessTrialMaxWave || 0;
      const storyEl = document.getElementById('story-text');
      if (storyEl) {
        const record = maxW > 0 ? `現在の最高記録: ${maxW}波` : '現在の最高記録: なし';
        storyEl.textContent = `どこまでも続く——無限の戦いの場。\n\n波状攻撃で敵が無限に押し寄せる。\n10波ごとに強力なボスが出現する！\n\n${record}\n\n報酬は波数に応じて増加していく。\nどこまで進めるか挑戦しよう！`;
      }
      break;
    }

    case 'elder_blessing':
      if (!gs.flags.elderBlessingDone) {
        gs.flags.elderBlessingDone = true;
        gs.player.maxMp += 10;
        gs.player.mp = Math.min(gs.player.mp + 10, gs.player.maxMp);
        updateStatus();
      }
      break;

    case 'dungeon_sage_meeting':
      if (!gs.flags.dungeonSageMet) {
        gs.flags.dungeonSageMet = true;
        gs.player.baseMatk += 10;
        updateStatus();
      }
      break;

    case 'pre_final_heal':
      if (!gs.flags.preFinalHealDone) {
        gs.flags.preFinalHealDone = true;
        gs.player.hp = gs.player.maxHp;
        gs.player.mp = gs.player.maxMp;
        if (gs.companion && gs.companion.joined) { gs.companion.hp = gs.companion.maxHp; gs.companion.mp = gs.companion.maxMp; }
        Object.values(gs.companions || {}).forEach(c => { if (c && c.joined) { c.hp = c.maxHp; c.mp = c.maxMp; } });
        updateStatus();
        updateAllCompanionsStatus();
      }
      break;

    case 'give_ancient_map':
      if (!gs.flags.gotAncientMap) {
        gs.flags.gotAncientMap = true;
        addItem('ancientMap');
        updateStatus();
      }
      break;

    case 'sea_cleared':
      if (!gs.flags.seaCleared) {
        gs.flags.seaCleared = true;
        addItem('seaOrb');
        addItem('seaArmor');
        addItem('ariaRobe');
        updateStatus();
      }
      break;

    case 'aria_join':
      if (!gs.flags.ariaJoined) {
        gs.flags.ariaJoined = true;
        gs.companion = createAriaCompanion(gs.player.level);
        addItem('ariaSword');
        addItem('ariaArmor');
        addItem('ariaHelm');
        updateStatus();
        showToast('👱‍♀️ アリアがパーティに加わった！');
        updateQuestProgress('flag', { flag: 'ariaJoined' });
      }
      break;

    case 'gaius_join':
      if (!gs.flags.gaiusJoined) {
        gs.flags.gaiusJoined = true;
        gs.companions.gaius = createCompanionState('gaius', gs.player.level);
        addItem('gaiusSword');
        addItem('gaiusArmor');
        updateStatus();
        showToast('🛡️ ガイアスがパーティに加わった！');
      }
      break;

    case 'luna_sola_join':
      if (!gs.flags.lunaJoined) {
        gs.flags.lunaJoined = true;
        gs.companions.luna = createCompanionState('luna', gs.player.level);
        gs.companions.sola = createCompanionState('sola', gs.player.level);
        addItem('lunaWand');
        addItem('solaWand');
        updateStatus();
        showToast('🌙 ルナ＆ソラがパーティに加わった！');
      }
      break;

    case 'serafina_join':
      if (!gs.flags.serafinaJoined) {
        gs.flags.serafinaJoined = true;
        gs.companions.serafina = createCompanionState('serafina', gs.player.level);
        addItem('serafinaStaff');
        addItem('serafinaDress');
        updateStatus();
        showToast('✨ セラフィナがパーティに加わった！');
      }
      break;

    case 'zephiros_join':
      if (!gs.flags.zephirosJoined) {
        gs.flags.zephirosJoined = true;
        gs.companions.zephiros = createCompanionState('zephiros', gs.player.level);
        addItem('zephirosStaff');
        addItem('zephirosRobe');
        updateStatus();
        showToast('🔮 ゼフィロスがパーティに加わった！');
      }
      break;

    case 'gaius_talk_1_done':
      gs.flags.gaiusTalk1Done = true; break;
    case 'luna_sola_talk_1_done':
      gs.flags.lunaSolaTalk1Done = true; break;
    case 'serafina_talk_1_done':
      gs.flags.serafinaTalk1Done = true; break;
    case 'zephiros_talk_1_done':
      gs.flags.zephirosTalk1Done = true; break;

    case 'town_desc_village': {
      const lv = gs.townDev?.village || 0;
      if (lv > 0) {
        const el = document.getElementById('story-text');
        if (el) el.textContent = TOWN_DEV_DATA.village.descs[lv];
      }
      break;
    }

    case 'town_desc_snow': {
      const lv = gs.townDev?.snow || 0;
      if (lv > 0) {
        const el = document.getElementById('story-text');
        if (el) el.textContent = TOWN_DEV_DATA.snow.descs[lv];
      }
      break;
    }

    case 'give_ship':
      if (!gs.vehicles) gs.vehicles = { horse: false, ship: false, airship: false };
      if (!gs.vehicles.ship) {
        gs.vehicles.ship = true;
        gs.flags.vehicleShip = true;
        updateStatus();
        showToast('⛵ 船を手に入れた！南海の孤島へ行けるようになった！');
      }
      break;

    case 'grasslands_enter':
      if (!gs.flags.vis_grasslands) {
        gs.flags.vis_grasslands = true;
        updateStatus();
      }
      break;

    case 'open_town_invest_village':
      _openTownInvest('village');
      break;
    case 'open_town_invest_desert':
      _openTownInvest('desert');
      break;
    case 'open_town_invest_snow':
      _openTownInvest('snow');
      break;

    case 'open_skill_forge':
      _openSkillForge();
      break;
  }
}

// ============================================================
//  セーブ / ロード
// ============================================================

function saveGame() {
  try {
    localStorage.setItem('rpg_save', JSON.stringify(gs));
    showToast('💾 ゲームをセーブしました！');
  } catch (e) {
    showToast('セーブに失敗しました。');
  }
}

function loadGame() {
  try {
    const data = localStorage.getItem('rpg_save');
    if (!data) { showToast('セーブデータがありません。'); return; }
    gs = JSON.parse(data);
    // 旧セーブデータの equipment.armor → body へ移行
    [gs.player, gs.companion].forEach(t => {
      if (!t || !t.equipment) return;
      if (!('body' in t.equipment)) { t.equipment.body = t.equipment.armor ?? null; delete t.equipment.armor; }
      if (!('head' in t.equipment)) t.equipment.head = null;
      if (!('acc1' in t.equipment)) t.equipment.acc1 = null;
      if (!('acc2' in t.equipment)) t.equipment.acc2 = null;
    });
    if (!gs.player.enhancements) gs.player.enhancements = {};
    if (gs.playerGuard === undefined)       gs.playerGuard = false;
    if (gs.ironWallTurns === undefined)     gs.ironWallTurns = 0;
    if (gs.partyShieldActive === undefined) gs.partyShieldActive = false;
    if (!gs.companions) gs.companions = { gaius: null, luna: null, sola: null, serafina: null, zephiros: null };
    ['gaius','luna','sola','serafina','zephiros'].forEach(id => {
      if (!(id in gs.companions)) gs.companions[id] = null;
      const c = gs.companions[id];
      if (c && !c.skillCooldowns) c.skillCooldowns = {};
    });
    if (!gs.buffs) gs.buffs = {
      gaiusTauntTurns: 0, gaiusIronStance: false, gaiusVanguard: false,
      lunaStarGuardTurns: 0, lunaMoonBuffTurns: 0,
      solaDebuffTurns: 0, solaStunned: false,
      serafinaSanctuaryTurns: 0,
      zephirosMatkDoubleTurns: 0, zephirosMagicBarrierTurns: 0,
    };
    // バトル中にセーブされていた場合でも正常にストーリーから再開できるようリセット
    gs.inBattle = false;
    gs.enemy = null;
    gs.postBattleScene = null;
    gs.levelingMode = null;
    if (!gs.levelingClears) gs.levelingClears = {};
    if (!gs.flags.vis_village) gs.flags.vis_village = true;
    if (!gs.quests)        gs.quests = {};
    if (!gs.monsterBook)   gs.monsterBook = {};
    if (!gs.bondExp)       gs.bondExp = {};
    if (!gs.bondLevel)     gs.bondLevel = {};
    if (!gs.formation)     gs.formation = 'balanced';
    if (!gs.titles)             gs.titles = {};
    if (!gs.totalBattles)       gs.totalBattles = 0;
    if (!gs.usedSkills)         gs.usedSkills = {};
    if (!gs.discoveredRecipes)       gs.discoveredRecipes = {};
    if (!gs.enchants)                gs.enchants = {};
    if (!gs.comboAtkBuff)            gs.comboAtkBuff = 0;
    if (!gs.comboSanctuary)          gs.comboSanctuary = 0;
    if (!gs.comboStatBuff)           gs.comboStatBuff = 0;
    if (gs.comboUsedThisBattle === undefined) gs.comboUsedThisBattle = false;
    if (!gs.godsTowerMode)           gs.godsTowerMode = null;
    if (gs.towerProgress === undefined) gs.towerProgress = 0;
    if (!gs.endlessTrialMode)        gs.endlessTrialMode = null;
    if (gs.endlessTrialMaxWave === undefined) gs.endlessTrialMaxWave = 0;
    if (!gs.adminMult) gs.adminMult = { eHp: 1, eAtk: 1, eDef: 1, exp: 1, gold: 1, shop: 1 };
    if (!gs.townDev) gs.townDev = { village: 0, desert: 0, snow: 0 };
    if (!('village' in gs.townDev)) gs.townDev.village = 0;
    if (!('desert'  in gs.townDev)) gs.townDev.desert  = 0;
    if (!('snow'    in gs.townDev)) gs.townDev.snow     = 0;
    if (!gs.vehicles) gs.vehicles = { horse: false, ship: false, airship: false };
    if (!('horse'   in gs.vehicles)) gs.vehicles.horse   = false;
    if (!('ship'    in gs.vehicles)) gs.vehicles.ship    = false;
    if (!('airship' in gs.vehicles)) gs.vehicles.airship = false;
    if (!gs.season || !SEASON_DATA[gs.season]) gs.season = 'spring';
    if (gs.seasonBattleCount === undefined) gs.seasonBattleCount = 0;
    if (!gs.gacha) gs.gacha = { pityCount: 0, totalPulls: 0, history: [] };
    if (!gs.gacha.history) gs.gacha.history = [];
    // 既クリアデータにワープ先フラグが欠けている場合の補完
    if (gs.flags.demonKingDefeated) {
      gs.flags.vis_gods_tower    = true;
      gs.flags.vis_void_map      = true;
      gs.flags.vis_desert_hidden = true;
      gs.flags.vis_endless_trial = true;
    }
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    gotoScene(gs.currentScene || 'village');
    updateStatus();
    showToast('📖 セーブデータを読み込みました！');
  } catch (e) {
    showToast('ロードに失敗しました。');
  }
}

function hasSaveData() {
  return !!localStorage.getItem('rpg_save');
}

// ============================================================
//  ゲーム開始 / リセット
// ============================================================

function startNewGame() {
  gs = createInitialState();
  document.getElementById('title-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  gotoScene('intro');
  updateStatus();
}

function restartGame() {
  document.getElementById('gameover-overlay').classList.add('hidden');
  document.getElementById('levelup-overlay').classList.add('hidden');
  gs = createInitialState();
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('title-screen').classList.remove('hidden');
  updateTitleButtons();
}

function continueFromVillage() {
  document.getElementById('gameover-overlay').classList.add('hidden');
  gs.player.hp = gs.player.maxHp;
  gs.player.mp = gs.player.maxMp;
  gs.inBattle = false;
  gs.enemy = null;
  gs.postBattleScene = null;
  gs.levelingMode = null;
  gs.godsTowerMode = null;
  gs.endlessTrialMode = null;
  document.getElementById('battle-area').classList.add('hidden');
  document.getElementById('story-text-area').classList.remove('hidden');
  document.getElementById('choices-area').classList.remove('hidden');
  gotoScene('village');
  updateStatus();
}

function showTitleScreen() {
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('title-screen').classList.remove('hidden');
  updateTitleButtons();
  if (typeof SoundEngine !== 'undefined') SoundEngine.playBGM('title');
}

// ============================================================
//  ガチャシステム
// ============================================================

function _rollGacha() {
  if (!gs.gacha) gs.gacha = { pityCount: 0, totalPulls: 0, history: [] };
  const g = gs.gacha;
  g.pityCount   = (g.pityCount   || 0) + 1;
  g.totalPulls  = (g.totalPulls  || 0) + 1;

  let rarity;
  if (g.pityCount >= GACHA_TABLE.pityLimit) {
    rarity = 5;
    g.pityCount = 0;
  } else {
    const r = Math.random();
    const { rates } = GACHA_TABLE;
    const cum4 = rates[5] + rates[4];
    const cum3 = cum4 + rates[3];
    const cum2 = cum3 + rates[2];
    if      (r < rates[5]) { rarity = 5; g.pityCount = 0; }
    else if (r < cum4)     rarity = 4;
    else if (r < cum3)     rarity = 3;
    else if (r < cum2)     rarity = 2;
    else                   rarity = 1;
  }

  const pool = GACHA_TABLE.pool[rarity];
  const template = pool[Math.floor(Math.random() * pool.length)];
  const item = { ...template, rarity, qty: template.qty || 1 };

  addItem(item.id, item.qty);

  if (!g.history) g.history = [];
  g.history.unshift({ rarity: item.rarity, name: item.name, emoji: item.emoji });
  if (g.history.length > 30) g.history.pop();

  return item;
}

function openGachaScreen() {
  if (!gs.gacha) gs.gacha = { pityCount: 0, totalPulls: 0, history: [] };
  _updateGachaUI();
  document.getElementById('gacha-overlay').classList.remove('hidden');
}

function closeGachaScreen() {
  document.getElementById('gacha-overlay').classList.add('hidden');
}

function _updateGachaUI() {
  const g = gs.gacha;
  const pityLeft = GACHA_TABLE.pityLimit - (g.pityCount || 0);
  const fillPct  = ((g.pityCount || 0) / GACHA_TABLE.pityLimit * 100);
  document.getElementById('gacha-gold-num').textContent   = gs.player.gold;
  document.getElementById('gacha-pity-left').textContent  = pityLeft;
  document.getElementById('gacha-total-pulls').textContent = g.totalPulls || 0;
  document.getElementById('gacha-pity-fill').style.width  = fillPct + '%';
  document.getElementById('gacha-btn-single').disabled = gs.player.gold < 500;
  document.getElementById('gacha-btn-ten').disabled    = gs.player.gold < 5000;

  const histEl = document.getElementById('gacha-history-list');
  histEl.innerHTML = '';
  (g.history || []).slice(0, 20).forEach(h => {
    const el = document.createElement('span');
    el.className = `gacha-hist-item gh-r${h.rarity}`;
    el.textContent = `${h.emoji} ${h.name}`;
    histEl.appendChild(el);
  });
}

function doGachaPull(count) {
  if (!gs.gacha) gs.gacha = { pityCount: 0, totalPulls: 0, history: [] };
  const cost = count === 1 ? 500 : 5000;
  if (gs.player.gold < cost) {
    showToast('💰 ゴールドが足りません！');
    return;
  }
  gs.player.gold -= cost;
  updateStatus();

  const results = [];
  for (let i = 0; i < count; i++) results.push(_rollGacha());

  saveGame();
  _updateGachaUI();
  _showGachaResults(results);
}

function _showGachaResults(results) {
  const grid = document.getElementById('gacha-result-grid');
  grid.innerHTML = '';
  const starsMap = { 5: '★★★★★', 4: '★★★★☆', 3: '★★★☆☆', 2: '★★☆☆☆', 1: '★☆☆☆☆' };

  results.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = `gacha-card gc-r${item.rarity}`;
    card.style.animationDelay = (i * 0.07) + 's';
    card.innerHTML =
      `<div class="gc-emoji">${item.emoji}</div>` +
      `<div class="gc-name">${item.name}</div>` +
      `<div class="gc-stars gc-stars-${item.rarity}">${starsMap[item.rarity]}</div>`;
    grid.appendChild(card);
  });

  const maxRarity = Math.max(...results.map(r => r.rarity));
  const titleEl = document.getElementById('gacha-result-title');
  if (maxRarity === 5)      titleEl.textContent = '🌟 伝説の輝き！！';
  else if (maxRarity >= 4)  titleEl.textContent = '✨ 素晴らしい！';
  else if (maxRarity >= 3)  titleEl.textContent = '🎲 ガチャ結果！';
  else                      titleEl.textContent = '🎲 ガチャ結果';

  document.getElementById('gacha-result-overlay').classList.remove('hidden');

  if (typeof SoundEngine !== 'undefined') {
    if (maxRarity === 5)     SoundEngine.playSFX('titleGet');
    else if (maxRarity >= 4) SoundEngine.playSFX('levelUp');
    else                     SoundEngine.playSFX('itemGet');
  }
}

function closeGachaResult() {
  document.getElementById('gacha-result-overlay').classList.add('hidden');
}

function toggleGachaRates() {
  const panel = document.getElementById('gacha-rates-panel');
  panel.classList.toggle('hidden');
  document.getElementById('gacha-rate-btn').textContent =
    panel.classList.contains('hidden') ? '📊 排出率を確認' : '📊 排出率を閉じる';
}

function updateTitleButtons() {
  const loadBtn = document.getElementById('btn-load-game');
  const hasSave = hasSaveData();
  loadBtn.style.display = hasSave ? 'block' : 'none';

  let clearBadge = document.getElementById('title-clear-badge');
  if (hasSave) {
    try {
      const saved = JSON.parse(localStorage.getItem('rpg_save') || '{}');
      if (saved.flags?.demonKingDefeated) {
        if (!clearBadge) {
          clearBadge = document.createElement('div');
          clearBadge.id = 'title-clear-badge';
          clearBadge.style.cssText = 'text-align:center;color:#ffd700;font-size:18px;font-weight:bold;letter-spacing:2px;margin-top:8px;text-shadow:0 0 8px #ffd700;';
          const titleButtons = document.getElementById('title-buttons');
          if (titleButtons && titleButtons.parentNode) titleButtons.parentNode.insertBefore(clearBadge, titleButtons.nextSibling);
          else {
            const tc = document.getElementById('title-content');
            if (tc) tc.appendChild(clearBadge);
          }
        }
        clearBadge.textContent = '★ GAME CLEARED ★';
      } else if (clearBadge) {
        clearBadge.remove();
      }
    } catch { /* ignore */ }
  } else if (clearBadge) {
    clearBadge.remove();
  }
}

// ============================================================
//  称号システム
// ============================================================

const _titleQueue = [];

function checkTitles() {
  if (!gs.titles) gs.titles = {};
  TITLE_DATA.forEach(t => {
    if (gs.titles[t.id]?.obtained) return;
    try { if (!t.check()) return; } catch { return; }
    gs.titles[t.id] = { obtained: true };
    // ボーナス適用
    const p = gs.player;
    if (t.bonus.gold)  p.gold     += t.bonus.gold;
    if (t.bonus.atk)   p.baseAtk  += t.bonus.atk;
    if (t.bonus.def)   p.baseDef  += t.bonus.def;
    if (t.bonus.matk)  p.baseMatk += t.bonus.matk;
    updateStatus();
    _titleQueue.push(t);
    if (_titleQueue.length === 1) _showNextTitlePopup();
  });
}

function _showNextTitlePopup() {
  if (!_titleQueue.length) return;
  const t = _titleQueue[0];
  document.getElementById('title-notif-emoji').textContent = t.emoji;
  document.getElementById('title-notif-name').textContent  = `「${t.name}」`;
  document.getElementById('title-notif-desc').textContent  = t.desc;
  document.getElementById('title-notif-bonus').textContent = `ボーナス: ${t.bonusDesc}`;
  document.getElementById('title-notif-overlay').classList.remove('hidden');
  if (typeof SoundEngine !== 'undefined') SoundEngine.playSFX('titleGet');
}

function closeTitleNotif() {
  _titleQueue.shift();
  document.getElementById('title-notif-overlay').classList.add('hidden');
  if (_titleQueue.length) setTimeout(_showNextTitlePopup, 250);
}

function openTitleList() {
  hideAllPanels();
  document.getElementById('title-list-area').classList.remove('hidden');
  renderTitleList();
}

function closeTitleList() {
  document.getElementById('title-list-area').classList.add('hidden');
  document.getElementById('story-text-area').classList.remove('hidden');
  document.getElementById('choices-area').classList.remove('hidden');
}

function renderTitleList() {
  const listEl = document.getElementById('title-list-content');
  listEl.innerHTML = '';
  const obtained = TITLE_DATA.filter(t => gs.titles?.[t.id]?.obtained).length;
  const summary = document.createElement('div');
  summary.className = 'title-summary';
  summary.textContent = `獲得: ${obtained} / ${TITLE_DATA.length}`;
  listEl.appendChild(summary);
  TITLE_DATA.forEach(t => {
    const has = !!(gs.titles?.[t.id]?.obtained);
    const row = document.createElement('div');
    row.className = `title-row ${has ? 'title-obtained' : 'title-locked'}`;
    row.innerHTML = `
      <div class="title-row-hdr">
        <span class="title-emoji">${has ? t.emoji : '🔒'}</span>
        <span class="title-name">${has ? t.name : '???'}</span>
        ${has ? '<span class="title-got-badge">✅取得済み</span>' : ''}
      </div>
      <div class="title-desc">${has ? t.desc : '条件を達成すると解放されます'}</div>
      ${has ? `<div class="title-bonus">🎁 ${t.bonusDesc}</div>` : ''}
    `;
    listEl.appendChild(row);
  });
}

// ============================================================
//  陣形・絆 計算ヘルパー
// ============================================================

function getFormationMult(stat) {
  const f = FORMATION_DATA[gs.formation || 'balanced'];
  if (!f || !f.bonuses) return 1;
  if (stat === 'atk')  return f.bonuses.atkMult  || 1;
  if (stat === 'def')  return f.bonuses.defMult  || 1;
  if (stat === 'matk') return f.bonuses.matkMult || 1;
  return 1;
}

function getBondLevel(cid) {
  const exp = (gs.bondExp || {})[cid] || 0;
  let level = 0;
  for (let i = BOND_LEVELS.length - 1; i >= 0; i--) {
    if (exp >= BOND_LEVELS[i].threshold) { level = i; break; }
  }
  return level;
}

function getBondStatMult(stat) {
  let mult = 1.0;
  const aliveComps = [];
  if (gs.companion && gs.companion.joined && gs.companion.hp > 0) aliveComps.push('aria');
  Object.entries(gs.companions || {}).forEach(([id, c]) => {
    if (c && c.joined && c.hp > 0) aliveComps.push(id);
  });
  aliveComps.forEach(cid => {
    const lv = getBondLevel(cid);
    const lvData = BOND_LEVELS[lv];
    if (!lvData) return;
    if (stat === 'atk')  mult += lvData.atkB;
    if (stat === 'def')  mult += lvData.defB;
    if (stat === 'matk') mult += lvData.matkB;
  });
  return mult;
}

function gainBondExp(amount) {
  if (!gs.bondExp) gs.bondExp = {};
  if (!gs.bondLevel) gs.bondLevel = {};
  const toGain = [];
  if (gs.companion && gs.companion.joined && gs.companion.hp > 0) toGain.push('aria');
  Object.entries(gs.companions || {}).forEach(([id, c]) => {
    if (c && c.joined && c.hp > 0) toGain.push(id);
  });
  toGain.forEach(cid => {
    gs.bondExp[cid] = (gs.bondExp[cid] || 0) + amount;
    const newLv = getBondLevel(cid);
    const oldLv = gs.bondLevel[cid] || 0;
    if (newLv > oldLv) {
      gs.bondLevel[cid] = newLv;
      const comp = cid === 'aria' ? gs.companion : gs.companions?.[cid];
      const cname = comp?.name || cid;
      showToast(`💞 ${cname}との絆Lv${newLv}「${BOND_LEVELS[newLv].name}」！`);
    }
  });
}

// ============================================================
//  クエストシステム
// ============================================================

function initQuests() {
  if (!gs.quests) gs.quests = {};
  QUEST_DATA.forEach(q => {
    if (!gs.quests[q.id]) gs.quests[q.id] = { status: 'active', progress: 0 };
  });
}

function updateQuestProgress(type, data) {
  initQuests();
  QUEST_DATA.forEach(q => {
    const state = gs.quests[q.id];
    if (!state || state.status !== 'active') return;
    let complete = false;
    if (type === 'kill_any' && q.type === 'kill_any') {
      state.progress++;
      if (state.progress >= q.count) complete = true;
    } else if (type === 'kill_type' && q.type === 'kill_type' && data.enemy === q.enemy) {
      state.progress++;
      if (state.progress >= q.count) complete = true;
    } else if (type === 'kill_boss' && q.type === 'kill_boss' && data.enemy === q.enemy) {
      state.progress = 1; complete = true;
    } else if (type === 'visit' && q.type === 'visit' && data.scene === q.scene) {
      state.progress = 1; complete = true;
    } else if (type === 'reach_level' && q.type === 'reach_level' && data.level >= q.level) {
      state.progress = data.level; complete = true;
    } else if (type === 'flag' && q.type === 'flag' && data.flag === q.flag) {
      state.progress = 1; complete = true;
    }
    if (complete) {
      state.status = 'complete';
      showToast(`📋 クエスト達成！「${q.name}」→ 掲示板で報酬を受け取ろう`);
    }
  });
}

function claimQuest(questId) {
  const q = QUEST_DATA.find(d => d.id === questId);
  const state = gs.quests && gs.quests[questId];
  if (!q || !state || state.status !== 'complete') return;
  state.status = 'claimed';
  if (q.reward.gold)  gs.player.gold += q.reward.gold;
  if (q.reward.items) q.reward.items.forEach(id => addItem(id));
  updateStatus();
  const parts = [
    q.reward.gold ? `💰 ${q.reward.gold}G` : '',
    ...(q.reward.items || []).map(id => `${ITEM_DATA[id]?.emoji || ''}${ITEM_DATA[id]?.name || id}`),
  ].filter(Boolean).join('、');
  showToast(`🎁 報酬受取：${parts}`);
  checkTitles();
  renderQuestBoard();
}

function openQuestBoard() {
  initQuests();
  hideAllPanels();
  document.getElementById('quest-board-area').classList.remove('hidden');
  renderQuestBoard();
}

function closeQuestBoard() {
  document.getElementById('quest-board-area').classList.add('hidden');
  document.getElementById('story-text-area').classList.remove('hidden');
  document.getElementById('choices-area').classList.remove('hidden');
}

function renderQuestBoard() {
  const listEl = document.getElementById('quest-board-list');
  listEl.innerHTML = '';
  const active = [], complete = [], claimed = [];
  QUEST_DATA.forEach(q => {
    const state = gs.quests[q.id] || { status: 'active', progress: 0 };
    if (state.status === 'claimed') claimed.push({ q, state });
    else if (state.status === 'complete') complete.push({ q, state });
    else active.push({ q, state });
  });

  function addSection(titleText, items) {
    if (!items.length) return;
    const hdr = document.createElement('div');
    hdr.className = 'quest-section-hdr';
    hdr.textContent = titleText;
    listEl.appendChild(hdr);
    items.forEach(({ q, state }) => {
      const row = document.createElement('div');
      row.className = `quest-row quest-${state.status}`;
      let prog = '';
      if (q.type === 'kill_any' || q.type === 'kill_type')
        prog = `（${Math.min(state.progress, q.count)}/${q.count}）`;
      else if (q.type === 'reach_level' && state.status === 'active')
        prog = `（現在Lv${gs.player.level}/${q.level}）`;
      const rewardParts = [
        q.reward.gold ? `💰${q.reward.gold}G` : '',
        ...(q.reward.items || []).map(id => `${ITEM_DATA[id]?.emoji || ''}${ITEM_DATA[id]?.name || id}`),
      ].filter(Boolean).join(' ');
      row.innerHTML = `
        <div class="quest-row-hdr">
          <span>${q.emoji} <strong>${q.name}</strong>${prog}</span>
          ${state.status === 'claimed' ? '<span class="quest-badge quest-claimed-badge">✅受取済</span>' : ''}
          ${state.status === 'complete' ? '<span class="quest-badge quest-done-badge">🎉達成！</span>' : ''}
        </div>
        <div class="quest-desc-txt">${q.desc}</div>
        <div class="quest-reward-txt">報酬: ${rewardParts}</div>
      `;
      if (state.status === 'complete') {
        const btn = document.createElement('button');
        btn.className = 'quest-claim-btn';
        btn.textContent = '🎁 報酬を受け取る';
        btn.onclick = () => claimQuest(q.id);
        row.appendChild(btn);
      }
      listEl.appendChild(row);
    });
  }

  addSection('📬 達成済み（受取可能）', complete);
  addSection('📋 受注中', active);
  addSection('✅ 受取済み', claimed);
}

// ============================================================
//  モンスター図鑑
// ============================================================

function recordEnemyKill(enemyId) {
  if (!enemyId) return;
  if (!gs.monsterBook) gs.monsterBook = {};
  if (!gs.monsterBook[enemyId]) gs.monsterBook[enemyId] = { kills: 0 };
  gs.monsterBook[enemyId].kills++;
}

function openMonsterBook() {
  hideAllPanels();
  document.getElementById('monster-book-area').classList.remove('hidden');
  renderMonsterBook();
}

function closeMonsterBook() {
  document.getElementById('monster-book-area').classList.add('hidden');
  document.getElementById('story-text-area').classList.remove('hidden');
  document.getElementById('choices-area').classList.remove('hidden');
}

function renderMonsterBook() {
  const listEl = document.getElementById('monster-book-list');
  listEl.innerHTML = '';
  const book = gs.monsterBook || {};
  const known = Object.keys(book).length;
  const total = Object.keys(ENEMY_DATA).length;
  const summary = document.createElement('div');
  summary.className = 'book-summary';
  summary.textContent = `発見: ${known} / ${total} 体`;
  listEl.appendChild(summary);

  Object.entries(ENEMY_DATA).forEach(([id, d]) => {
    const rec = book[id];
    const card = document.createElement('div');
    card.className = `monster-card ${rec ? 'monster-known' : 'monster-unknown'}`;
    if (rec) {
      card.innerHTML = `
        <div class="monster-card-hdr">
          <span class="mc-emoji">${d.emoji}</span>
          <div class="mc-info">
            <div class="mc-name">${d.name}${d.isBoss ? ' <span class="mc-boss">BOSS</span>' : ''}</div>
            <div class="mc-kills">撃破 ${rec.kills}体</div>
          </div>
        </div>
        <div class="mc-stats">HP:${d.maxHp} ATK:${d.attack} DEF:${d.defense} EXP:${d.exp}${d.weakMagic ? ' <span class="mc-weak">⚡魔法弱点</span>' : ''}</div>
        ${(() => {
          const parts = [];
          if (d.weak?.length)    parts.push(`<span class="mc-elem-weak">弱点: ${d.weak.map(e => ELEMENT_DATA[e]?.emoji || e).join('')}</span>`);
          if (d.resist?.length)  parts.push(`<span class="mc-elem-resist">耐性: ${d.resist.map(e => ELEMENT_DATA[e]?.emoji || e).join('')}</span>`);
          if (d.nullElem?.length)parts.push(`<span class="mc-elem-null">無効: ${d.nullElem.map(e => ELEMENT_DATA[e]?.emoji || e).join('')}</span>`);
          if (d.absorb?.length)  parts.push(`<span class="mc-elem-absorb">吸収: ${d.absorb.map(e => ELEMENT_DATA[e]?.emoji || e).join('')}</span>`);
          return parts.length ? `<div class="mc-elem">${parts.join(' ')}</div>` : '';
        })()}
        ${d.skill ? `<div class="mc-skill">特技: ${d.skill.name}（発動率${Math.round((d.skill.chance || 0)*100)}%）</div>` : ''}
      `;
    } else {
      card.innerHTML = `
        <div class="monster-card-hdr">
          <span class="mc-emoji">❓</span>
          <div class="mc-info"><div class="mc-name" style="color:#555">???</div><div class="mc-kills" style="color:#444">未発見</div></div>
        </div>
      `;
    }
    listEl.appendChild(card);
  });
}

// ============================================================
//  仲間との絆
// ============================================================

function openBondScreen() {
  hideAllPanels();
  document.getElementById('bond-area').classList.remove('hidden');
  renderBondScreen();
}

function closeBondScreen() {
  document.getElementById('bond-area').classList.add('hidden');
  document.getElementById('story-text-area').classList.remove('hidden');
  document.getElementById('choices-area').classList.remove('hidden');
}

function renderBondScreen() {
  const listEl = document.getElementById('bond-list');
  listEl.innerHTML = '';
  const comps = [];
  if (gs.companion && gs.companion.joined) comps.push({ id: 'aria', data: gs.companion });
  Object.entries(gs.companions || {}).forEach(([id, c]) => {
    if (c && c.joined) comps.push({ id, data: c });
  });
  if (!comps.length) {
    listEl.innerHTML = '<div style="text-align:center;color:#888;padding:20px">まだ仲間がいない...</div>';
    return;
  }
  comps.forEach(({ id, data }) => {
    const exp = (gs.bondExp || {})[id] || 0;
    const lv  = getBondLevel(id);
    const cur = BOND_LEVELS[lv];
    const nxt = BOND_LEVELS[lv + 1];
    const pct = nxt ? Math.min(100, Math.floor((exp - cur.threshold) / (nxt.threshold - cur.threshold) * 100)) : 100;
    const bonus = getBondBonusText(lv);
    const card = document.createElement('div');
    card.className = 'bond-card';
    card.innerHTML = `
      <div class="bond-card-hdr">
        <span class="bond-emoji">${data.emoji}</span>
        <div class="bond-info">
          <div class="bond-name">${data.name}</div>
          <div class="bond-lv">絆Lv${lv}「${cur.name}」</div>
        </div>
        <div class="bond-exp">${exp} EXP</div>
      </div>
      <div class="bond-bar-wrap"><div class="bond-bar" style="width:${pct}%"></div></div>
      <div class="bond-next-txt">${nxt ? `次のLvまで: ${nxt.threshold - exp} EXP` : '✨ 最大レベル達成！'}</div>
      ${bonus ? `<div class="bond-bonus-txt">🎁 ボーナス: ${bonus}</div>` : ''}
    `;
    listEl.appendChild(card);
  });
}

function getBondBonusText(lv) {
  const parts = [];
  if (lv >= 1) parts.push('攻撃力+5%');
  if (lv >= 2) parts.push('防御力+5%');
  if (lv >= 3) parts.push('魔法力+5%');
  if (lv >= 4) parts.push('全戦闘ステータス+8%');
  if (lv >= 5) parts.push('全戦闘ステータス+12%');
  return parts.join('、');
}

// ============================================================
//  陣形システム
// ============================================================

function openFormationScreen() {
  hideAllPanels();
  document.getElementById('formation-area').classList.remove('hidden');
  renderFormationScreen();
}

function closeFormationScreen() {
  document.getElementById('formation-area').classList.add('hidden');
  document.getElementById('story-text-area').classList.remove('hidden');
  document.getElementById('choices-area').classList.remove('hidden');
}

function setFormation(id) {
  if (!FORMATION_DATA[id]) return;
  const f = FORMATION_DATA[id];
  if (f.reqCompanion) {
    const hasComp = (gs.companion && gs.companion.joined) ||
      Object.values(gs.companions || {}).some(c => c && c.joined);
    if (!hasComp) { showToast('仲間がいないと陣形を組めない！'); return; }
  }
  gs.formation = id;
  showToast(`⚔️ 陣形を「${f.name}」に変更！`);
  renderFormationScreen();
  renderChoices(SCENES[gs.currentScene]?.choices || []);
}

function renderFormationScreen() {
  const listEl = document.getElementById('formation-list');
  listEl.innerHTML = '';
  const hasComp = (gs.companion && gs.companion.joined) ||
    Object.values(gs.companions || {}).some(c => c && c.joined);
  Object.entries(FORMATION_DATA).forEach(([id, f]) => {
    const isCur = (gs.formation || 'balanced') === id;
    const canUse = !f.reqCompanion || hasComp;
    const row = document.createElement('div');
    row.className = `formation-row ${isCur ? 'formation-active' : ''} ${!canUse ? 'formation-locked' : ''}`;
    row.innerHTML = `
      <div class="formation-row-hdr">
        <span class="form-emoji">${f.emoji}</span>
        <span class="form-name">${f.name}</span>
        ${isCur ? '<span class="form-badge">選択中</span>' : ''}
        ${!canUse ? '<span class="form-locked">🔒仲間が必要</span>' : ''}
      </div>
      <div class="form-desc">${f.desc}</div>
    `;
    if (!isCur && canUse) {
      row.style.cursor = 'pointer';
      row.onclick = () => setFormation(id);
    }
    listEl.appendChild(row);
  });
}

// ============================================================
//  コンボ必殺技システム
// ============================================================

function openComboMenu() {
  document.getElementById('battle-buttons').classList.add('hidden');
  document.getElementById('combo-select').classList.remove('hidden');
  renderComboMenu();
}

function closeComboMenu() {
  document.getElementById('combo-select').classList.add('hidden');
  document.getElementById('battle-buttons').classList.remove('hidden');
}

function renderComboMenu() {
  const listEl = document.getElementById('combo-select-list');
  listEl.innerHTML = '';
  COMBO_DATA.forEach(combo => {
    const res = combo.check();
    const btn = document.createElement('button');
    btn.className = `combo-item-btn ${res.ok ? '' : 'combo-locked'}`;
    btn.innerHTML = `
      <span class="combo-btn-emoji">${combo.emoji}</span>
      <span class="combo-btn-info">
        <span class="combo-btn-name">${combo.name}</span>
        <span class="combo-btn-members">${combo.members}</span>
        <span class="combo-btn-desc">${res.ok ? combo.desc : '🔒 ' + res.reason}</span>
        <span class="combo-btn-mp">${combo.mpCost}</span>
      </span>`;
    btn.disabled = !res.ok;
    if (res.ok) btn.onclick = () => executeCombo(combo.id);
    listEl.appendChild(btn);
  });
}

function executeCombo(id) {
  document.getElementById('combo-select').classList.add('hidden');
  document.getElementById('battle-buttons').classList.remove('hidden');

  const combo = COMBO_DATA.find(c => c.id === id);
  if (!combo) return;
  const res = combo.check();
  if (!res.ok) { showToast('コンボの条件が満たせない！'); return; }

  addBattleLog(`⚡⚡ コンボ必殺技発動！！`, 'log-system');
  addBattleLog(`✨ 【${combo.name}】`, 'log-system');
  addBattleLog(`${combo.emoji} ${combo.performance}`, 'log-system');

  if (id === 'hero_aria')      _execHeroAria();
  else if (id === 'hero_zephiros')  _execHeroZephiros();
  else if (id === 'aria_serafina')  _execAriaSerafina();
  else if (id === 'gaius_serafina') _execGaiusSerafina();
  else if (id === 'luna_sola')      _execLunaSola();
  else if (id === 'all_ultimate')   _execAllUltimate();

  gainBondExp(30);
  updateStatusDisplay();
  updateStatus();
  updateBattleDisplay();

  if (gs.enemy && gs.enemy.hp <= 0) {
    setTimeout(() => endBattle(true), 800);
    return;
  }
  afterPlayerTurn(900);
}

function _execHeroAria() {
  const p = gs.player;
  const a = gs.companion;
  p.mp -= 30; a.mp -= 30;
  const d1 = Math.max(1, Math.floor(getAtk() * 2.5 - gs.enemy.defense * 0.3));
  const d2 = Math.max(1, Math.floor(getCompanionAtk('aria') * 2.5 - gs.enemy.defense * 0.3));
  gs.enemy.hp = clamp(gs.enemy.hp - d1 - d2, 0, gs.enemy.maxHp);
  addBattleLog(`⚔️ アレクの一撃！ ${d1} ダメージ！`, 'log-player');
  addBattleLog(`🗡️ アリアの一撃！ ${d2} ダメージ！ 合計 ${d1+d2} ダメージ！！`, 'log-aria');
  gs.comboAtkBuff = 3;
  addBattleLog('💪 3ターン攻撃力1.5倍！', 'log-system');
}

function _execHeroZephiros() {
  const z = gs.companions.zephiros;
  gs.player.mp -= 20; z.mp -= 50;
  const dmg = Math.floor(getAtk() * 5);
  gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
  addBattleLog(`💥 魔力剣が炸裂！！ ${dmg} の大ダメージ！（防御無視）`, 'log-player');
}

function _execAriaSerafina() {
  const a = gs.companion;
  const s = gs.companions.serafina;
  a.mp -= 25; s.mp -= 25;
  const dmg = Math.max(1, Math.floor(getCompanionAtk('aria') * 3.0));
  gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
  addBattleLog(`🗡️ アリアの聖剣が輝く！ ${dmg} ダメージ！！`, 'log-aria');
  const heal = 80;
  gs.player.hp = clamp(gs.player.hp + heal, 0, gs.player.maxHp);
  a.hp = clamp(a.hp + heal, 0, a.maxHp);
  ['gaius','luna','sola','serafina','zephiros'].forEach(cid => {
    const c = gs.companions?.[cid];
    if (c && c.joined && c.hp > 0) c.hp = clamp(c.hp + heal, 0, c.maxHp);
  });
  addBattleLog(`💚 セラフィナの光が全員を癒した！ 全員HP+${heal}！`, 'log-heal');
}

function _execGaiusSerafina() {
  const g = gs.companions.gaius;
  const s = gs.companions.serafina;
  g.mp -= 30; s.mp -= 30;
  gs.comboSanctuary = 5;
  addBattleLog('🏰 5ターン間全被ダメ50%軽減＋毎ターンHP回復！', 'log-system');
}

function _execLunaSola() {
  const l = gs.companions.luna;
  const so = gs.companions.sola;
  l.mp -= 40; so.mp -= 40;
  const dmg = Math.max(1, Math.floor((getCompanionMatk('luna') + getCompanionMatk('sola')) * 3.5));
  gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
  addBattleLog(`🌟 星爆が炸裂！ ${dmg} の超大ダメージ！！`, 'log-player');
  gs.buffs.solaDebuffTurns = Math.max(gs.buffs.solaDebuffTurns, 3);
  addBattleLog('⬇️ 敵の全ステータスが3ターン低下！', 'log-system');
  gs.comboStatBuff = 3;
  addBattleLog('⬆️ パーティ全能力が3ターン強化！（ATK・DEF・MATK+20%）', 'log-system');
}

function _execAllUltimate() {
  gs.player.mp = Math.max(0, gs.player.mp - 50);
  if (gs.companion) gs.companion.mp = Math.max(0, gs.companion.mp - 50);
  ['gaius','luna','sola','serafina','zephiros'].forEach(cid => {
    const c = gs.companions?.[cid];
    if (c && c.joined) c.mp = Math.max(0, c.mp - 50);
  });
  const atkSum = getAtk() + getCompanionAtk('aria');
  const matkSum = getMatk() + getCompanionMatk('luna') + getCompanionMatk('sola') + getCompanionMatk('serafina') + getCompanionMatk('zephiros');
  const defSum = getCompanionAtk('gaius');
  const dmg = Math.floor((atkSum + matkSum + defSum) * 4.5);
  gs.enemy.hp = clamp(gs.enemy.hp - dmg, 0, gs.enemy.maxHp);
  addBattleLog(`💥💥 伝説の究極奥義！！ ${dmg} の超大ダメージ！！！`, 'log-player');
  gs.player.hp = gs.player.maxHp; gs.player.mp = gs.player.maxMp;
  if (gs.companion) { gs.companion.hp = gs.companion.maxHp; gs.companion.mp = gs.companion.maxMp; }
  ['gaius','luna','sola','serafina','zephiros'].forEach(cid => {
    const c = gs.companions?.[cid];
    if (c && c.joined) { c.hp = c.maxHp; c.mp = c.maxMp; }
  });
  addBattleLog('✨ パーティ全員のHP・MPが完全回復した！！', 'log-heal');
  gs.comboUsedThisBattle = true;
}

// ============================================================
//  錬金術システム
// ============================================================

function renderAlchemy(scene) {
  document.getElementById('shop-area').classList.add('hidden');
  document.getElementById('smith-area').classList.add('hidden');
  document.getElementById('story-text-area').classList.remove('hidden');
  document.getElementById('choices-area').classList.remove('hidden');
  document.getElementById('alchemy-area').classList.remove('hidden');

  // 未知レシピの発見チェック
  ALCHEMY_RECIPES.forEach(r => {
    if (!r.known && !gs.discoveredRecipes[r.id]) {
      const canReveal = Object.entries(r.ingredients).every(([itemId, need]) => getItemCount(itemId) >= need);
      if (canReveal) {
        gs.discoveredRecipes[r.id] = true;
        showToast(`✨ 新しいレシピを発見！「${r.name}」`);
      }
    }
  });

  const listEl = document.getElementById('alchemy-list');
  listEl.innerHTML = '';

  ALCHEMY_RECIPES.forEach(r => {
    const isKnown = r.known || gs.discoveredRecipes[r.id];
    const row = document.createElement('div');
    row.className = 'alchemy-row';

    if (!isKnown) {
      row.innerHTML = `
        <div class="alchemy-row-hdr">
          <span class="alch-emoji">❓</span>
          <span class="alch-name">??? 謎のレシピ</span>
        </div>
        <div class="alch-desc">材料を揃えると発見できるかもしれない...</div>
      `;
      listEl.appendChild(row);
      return;
    }

    const resultItem = ITEM_DATA[r.result];
    const canCraft = Object.entries(r.ingredients).every(([itemId, need]) => getItemCount(itemId) >= need);

    let ingHtml = Object.entries(r.ingredients).map(([itemId, need]) => {
      const itm = ITEM_DATA[itemId];
      const have = getItemCount(itemId);
      const ok = have >= need;
      return `<span class="alch-ing ${ok ? 'alch-ing-ok' : 'alch-ing-ng'}">${itm ? itm.emoji + itm.name : itemId} ×${need} (所持:${have})</span>`;
    }).join(' + ');

    row.innerHTML = `
      <div class="alchemy-row-hdr">
        <span class="alch-emoji">${resultItem ? resultItem.emoji : '?'}</span>
        <span class="alch-name">${r.name}</span>
      </div>
      <div class="alch-desc">${r.desc}</div>
      <div class="alch-ingredients">${ingHtml}</div>
      <div class="alch-result-line">→ ${resultItem ? resultItem.emoji + resultItem.name : r.result}${r.resultCount > 1 ? ' ×' + r.resultCount : ''}</div>
    `;

    const craftBtn = document.createElement('button');
    craftBtn.className = 'alch-craft-btn';
    craftBtn.textContent = canCraft ? '⚗️ 合成する' : '材料不足';
    craftBtn.disabled = !canCraft;
    craftBtn.onclick = () => craftRecipe(r.id, scene);
    row.appendChild(craftBtn);

    listEl.appendChild(row);
  });

  const backBtn = document.getElementById('alchemy-back-btn');
  if (backBtn) backBtn.onclick = () => gotoScene(scene.backScene || 'village');

  renderChoices([]);
}

function getItemCount(itemId) {
  const slot = gs.player.items.find(i => i.id === itemId);
  return slot ? slot.count : 0;
}

function craftRecipe(recipeId, scene) {
  const r = ALCHEMY_RECIPES.find(x => x.id === recipeId);
  if (!r) return;

  for (const [itemId, need] of Object.entries(r.ingredients)) {
    if (getItemCount(itemId) < need) {
      showToast('材料が足りない！');
      return;
    }
  }

  for (const [itemId, need] of Object.entries(r.ingredients)) {
    for (let i = 0; i < need; i++) removeItem(itemId);
  }

  const resultItem = ITEM_DATA[r.result];
  for (let i = 0; i < r.resultCount; i++) addItem(r.result);

  const resultName = resultItem ? resultItem.emoji + resultItem.name : r.result;
  showToast(`⚗️ 合成成功！ ${resultName}${r.resultCount > 1 ? ' ×' + r.resultCount : ''}を手に入れた！`);
  saveGame();
  renderAlchemy(scene);
}

// ============================================================
//  共通パネル切り替えヘルパー
// ============================================================

function hideAllPanels() {
  ['story-text-area','choices-area','warp-area','shop-area','smith-area',
   'equip-change-area','quest-board-area','monster-book-area','bond-area','formation-area','title-list-area','alchemy-area'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

// ============================================================
//  初期化
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
  updateTitleButtons();
  updateStatus();
  updateSeasonDisplay();
  _adminInit();

  // サウンドUI の初期化（localStorage から設定を復元）
  if (typeof SoundEngine !== 'undefined') {
    const btn = document.getElementById('sound-toggle-btn');
    const slider = document.getElementById('sound-volume');
    if (btn)    btn.textContent = SoundEngine.isMuted() ? '🔇' : '🔊';
    if (slider) slider.value   = SoundEngine.getVolume();
    SoundEngine.playBGM('title');
  }
});

// ============================================================
//  季節システム UI
// ============================================================

function updateSeasonDisplay() {
  const el = document.getElementById('season-display');
  if (!el) return;
  const sd = getSeasonData();
  el.textContent = `${sd.emoji} ${sd.name}`;
  el.style.color = sd.color;
  el.style.borderColor = sd.color + '80';
}

function advanceSeason() {
  gs.seasonBattleCount = (gs.seasonBattleCount || 0) + 1;
  if (gs.seasonBattleCount >= SEASON_CYCLE_BATTLES) {
    gs.seasonBattleCount = 0;
    const idx = SEASON_ORDER.indexOf(gs.season || 'spring');
    gs.season = SEASON_ORDER[(idx + 1) % SEASON_ORDER.length];
    const sd = SEASON_DATA[gs.season];
    updateSeasonDisplay();
    showToast(`🌀 季節が変わった！ ${sd.emoji} ${sd.name} になった！`, 3500);
  }
}

function openSeasonInfo() {
  if (gs.inBattle) return;
  const sd = getSeasonData();
  const remaining = SEASON_CYCLE_BATTLES - (gs.seasonBattleCount || 0);
  const effects = [];
  if (sd.atkMult > 1)  effects.push(`⚔️ 攻撃力 ×${sd.atkMult}`);
  if (sd.defMult > 1)  effects.push(`🛡️ 防御力 ×${sd.defMult}`);
  if (sd.matkMult > 1) effects.push(`🔮 魔法力 ×${sd.matkMult}`);
  if (sd.expMult > 1)  effects.push(`✨ EXP ×${sd.expMult}`);
  if (sd.goldMult > 1) effects.push(`💰 ゴールド ×${sd.goldMult}`);
  Object.entries(sd.elemBonus || {}).forEach(([elem, val]) => {
    const ei = ELEMENT_DATA[elem];
    effects.push(`${ei?.emoji || ''} ${ei?.name || elem}属性ダメージ +${Math.round(val * 100)}%`);
  });
  if (sd.healAfterBattle > 0) effects.push(`💚 戦闘後HP回復 +${Math.round(sd.healAfterBattle * 100)}%`);

  const allSeasons = SEASON_ORDER.map((key, i) => {
    const s = SEASON_DATA[key];
    return `${key === (gs.season || 'spring') ? '▶' : '　'} ${s.emoji} ${s.name}`;
  }).join('\n');

  const txt = `現在の季節: ${sd.emoji} ${sd.name}\n${sd.desc}\n\n【効果】\n${effects.join('\n') || 'なし'}\n\n次の季節まで: あと${remaining}戦\n\n【季節の順序】\n${allSeasons}\n※ ${SEASON_CYCLE_BATTLES}戦ごとに次の季節へ進む`;
  showLevelingPanel(sd.emoji, `現在の季節: ${sd.name}`, txt);
  addLevelingBtn('↩️ 閉じる', '', () => gotoScene(gs.currentScene));
}

// ============================================================
//  乗り物システム UI
// ============================================================

function openVehicleScreen() {
  const v = gs.vehicles || {};
  const list = [
    {
      id: 'horse', emoji: '🐴', name: '馬', owned: v.horse,
      effect: '陸エリアのエンカウント率-50%\n大草原へのアクセス',
      how: '村の厩舎で3000Gで購入',
    },
    {
      id: 'ship', emoji: '⛵', name: '船', owned: v.ship,
      effect: '海エリアのエンカウント率-40%\n南海の孤島へのアクセス',
      how: '海底神殿クリア後に老漁師から入手',
    },
    {
      id: 'airship', emoji: '🚁', name: '飛行船', owned: v.airship,
      effect: '全エリアのエンカウント率-70%\nワープで未訪問地も移動可能\n天空の浮遊島へのアクセス',
      how: 'クリア後コンテンツで1000000Gで購入',
    },
  ];
  const txt = list.map(item =>
    `${item.owned ? '✅' : '❌'} ${item.emoji} ${item.name}\n  効果: ${item.effect}\n  入手: ${item.how}`
  ).join('\n\n');
  showLevelingPanel('🚗', '乗り物一覧', txt);
  if (v.horse) addLevelingBtn('🐴 厩舎へ', '', () => gotoScene('village_stable'));
  if (v.ship)  addLevelingBtn('🏝️ 南海の孤島へ', '', () => gotoScene('south_island_spot'));
  if (v.airship) addLevelingBtn('☁️ 天空の浮遊島へ', '', () => gotoScene('sky_island_hub'));
  addLevelingBtn('↩️ 閉じる', '', () => gotoScene(gs.currentScene));
}

// ============================================================
//  町の発展 UI
// ============================================================

function _openTownInvest(townId) {
  const data = TOWN_DEV_DATA[townId];
  if (!data) return;
  const lv = gs.townDev[townId] || 0;
  const maxLv = TOWN_DEV_COSTS.length;

  const header = `${data.emoji} ${data.name}`;
  let bodyText;
  if (lv >= maxLv) {
    bodyText = `現在の発展レベル: ★ 最大（Lv${maxLv}）\n\n${data.descs[lv]}\n\n全ての施設が解放されています！`;
  } else {
    const cost = TOWN_DEV_COSTS[lv];
    const nextInfo = data.levels[lv];
    bodyText = `現在の発展レベル: Lv${lv}\n\n【次のレベルアップ: ${nextInfo.name}】\n${nextInfo.unlock}\n\n投資コスト: ${cost.toLocaleString()}G\n所持ゴールド: ${gs.player.gold.toLocaleString()}G`;
  }

  showLevelingPanel(data.emoji, `${data.name} - 投資`, bodyText);

  if (lv < maxLv) {
    const cost = TOWN_DEV_COSTS[lv];
    const canAfford = gs.player.gold >= cost;
    addLevelingBtn(
      `💰 投資する（${cost.toLocaleString()}G）`,
      canAfford ? 'adm-ok' : '',
      () => {
        if (gs.player.gold < cost) { showToast('ゴールドが足りません！'); return; }
        gs.player.gold -= cost;
        gs.townDev[townId] = lv + 1;
        const newLv = lv + 1;
        // 発展フラグを設定
        const key = 'townDev' + townId.charAt(0).toUpperCase() + townId.slice(1) + newLv;
        gs.flags[key] = true;
        updateStatus();
        saveGame();
        const info = data.levels[lv];
        showLevelingPanel(data.emoji, `Lv${newLv} 発展完了！`, `${data.name}がLv${newLv}になった！\n\n【解放】${info.unlock}\n\n${data.descs[newLv]}`);
        addLevelingBtn('↩️ 戻る', '', () => gotoScene(data.scene));
      }
    );
    if (!canAfford) {
      const btn = document.querySelector('#choices-area .choice-btn:last-child');
      if (btn) btn.disabled = true;
    }
  }

  addLevelingBtn('↩️ 戻る', '', () => gotoScene(data.scene));
}

const SKILL_FORGE_OPTIONS = [
  { label: '⚔️ 攻撃力 +5',  cost: 5000,  apply: () => { gs.player.baseAtk  += 5; } },
  { label: '🛡️ 防御力 +5',  cost: 5000,  apply: () => { gs.player.baseDef  += 5; } },
  { label: '🔮 魔法力 +5',  cost: 5000,  apply: () => { gs.player.baseMatk += 5; } },
  { label: '❤️ 最大HP +50', cost: 3000,  apply: () => { gs.player.maxHp += 50; gs.player.hp = Math.min(gs.player.hp + 50, gs.player.maxHp); } },
  { label: '💧 最大MP +25', cost: 3000,  apply: () => { gs.player.maxMp += 25; gs.player.mp = Math.min(gs.player.mp + 25, gs.player.maxMp); } },
  { label: '⚡ 速さ +10',   cost: 4000,  apply: () => { gs.player.baseSpeed = (gs.player.baseSpeed || 0) + 10; } },
];

function _openSkillForge() {
  const renderForge = () => {
    const lines = SKILL_FORGE_OPTIONS.map(o => `${o.label}  ：${o.cost.toLocaleString()}G`).join('\n');
    showLevelingPanel('🗡️', 'スキル鍛錬所', `「修行を積めば基礎能力が上がるぞ」\n\n所持ゴールド: ${gs.player.gold.toLocaleString()}G\n\n【鍛錬メニュー】\n${lines}`);
    SKILL_FORGE_OPTIONS.forEach(o => {
      const canAfford = gs.player.gold >= o.cost;
      addLevelingBtn(`${o.label}（${o.cost.toLocaleString()}G）`, canAfford ? '' : '', () => {
        if (gs.player.gold < o.cost) { showToast('ゴールドが足りません！'); return; }
        gs.player.gold -= o.cost;
        o.apply();
        updateStatus();
        showToast(`${o.label} 鍛錬完了！`);
        renderForge();
      });
    });
    addLevelingBtn('↩️ 集落に戻る', '', () => gotoScene('snow_village'));
  };
  renderForge();
}

// ============================================================
//  管理者パネル
// ============================================================

const _ADMIN_PW = 'admin1234';
let _adminAuthed = false;
let _adminTab = 0;

function _adminInit() {
  const btn = document.createElement('button');
  btn.id = 'admin-btn';
  btn.title = '管理者パネル';
  btn.textContent = '🔧';
  btn.onclick = _adminAuth;
  document.body.appendChild(btn);

  const ov = document.createElement('div');
  ov.id = 'admin-overlay';
  ov.onclick = e => { if (e.target === ov) _adminClose(); };
  document.body.appendChild(ov);
}

function _adminAuth() {
  if (_adminAuthed) { _adminOpenPanel(); return; }
  const ov = document.getElementById('admin-overlay');
  ov.innerHTML =
    '<div id="admin-auth-box">' +
    '<div style="font-size:36px;margin-bottom:10px">🔧</div>' +
    '<div style="color:#aaaaff;font-size:15px;font-weight:bold;margin-bottom:20px">管理者認証</div>' +
    '<input type="password" id="adm-pw" placeholder="パスワード" ' +
    'onkeydown="if(event.key===\'Enter\')_adminCheckPw()" ' +
    'style="width:180px;background:#0d1117;border:1px solid #555;border-radius:4px;color:#eee;padding:8px;font-size:13px;text-align:center;outline:none">' +
    '<div id="adm-pw-err" style="color:#ff6060;font-size:12px;height:18px;margin-top:6px"></div>' +
    '<div style="margin-top:14px;display:flex;gap:10px;justify-content:center">' +
    '<button class="adm-btn adm-ok" onclick="_adminCheckPw()">✓ 認証</button>' +
    '<button class="adm-btn" onclick="_adminClose()">キャンセル</button>' +
    '</div></div>';
  ov.style.display = 'flex';
  setTimeout(() => document.getElementById('adm-pw')?.focus(), 80);
}

function _adminCheckPw() {
  const pw = document.getElementById('adm-pw')?.value || '';
  if (pw === _ADMIN_PW) {
    _adminAuthed = true;
    _adminOpenPanel();
  } else {
    document.getElementById('adm-pw-err').textContent = '❌ パスワードが違います';
    if (document.getElementById('adm-pw')) document.getElementById('adm-pw').value = '';
  }
}

function _adminClose() {
  const ov = document.getElementById('admin-overlay');
  if (ov) ov.style.display = 'none';
}

const _ADMIN_TABS = ['① プレイヤー', '② アイテム', '③ 進行', '④ バランス', '⑤ デバッグ'];

function _adminOpenPanel() {
  const ov = document.getElementById('admin-overlay');
  const tabHtml = _ADMIN_TABS.map((t, i) =>
    '<button class="adm-tab' + (i === _adminTab ? ' adm-tab-act' : '') +
    '" onclick="_adminSwTab(' + i + ')">' + t + '</button>'
  ).join('');
  ov.innerHTML =
    '<div id="adm-panel">' +
    '<div id="adm-hdr"><span style="color:#aaaaff;font-weight:bold;font-size:14px">🔧 管理者パネル</span>' +
    '<button class="adm-btn adm-danger" onclick="_adminClose()">✕ 閉じる</button></div>' +
    '<div id="adm-tabs">' + tabHtml + '</div>' +
    '<div id="adm-body"></div>' +
    '</div>';
  ov.style.display = 'flex';
  _adminSwTab(_adminTab);
}

function _adminSwTab(i) {
  _adminTab = i;
  document.querySelectorAll('.adm-tab').forEach((b, idx) => b.classList.toggle('adm-tab-act', idx === i));
  const body = document.getElementById('adm-body');
  if (!body) return;
  switch (i) {
    case 0: body.innerHTML = _admTabPlayer();   break;
    case 1: body.innerHTML = _admTabItems();    break;
    case 2: body.innerHTML = _admTabProgress(); break;
    case 3: body.innerHTML = _admTabBalance();  break;
    case 4: body.innerHTML = _admTabDebug();    break;
  }
}

// ── Tab 1: プレイヤー ──
function _admTabPlayer() {
  const p = gs.player;
  let h = '<div class="adm-sec"><div class="adm-sh">👑 プレイヤー基本情報</div>';
  [['level','レベル',p.level],['exp','経験値',p.exp],['gold','所持金',p.gold],
   ['hp','HP',p.hp],['maxHp','最大HP',p.maxHp],['mp','MP',p.mp],['maxMp','最大MP',p.maxMp]
  ].forEach(([k,l,v]) => {
    h += '<div class="adm-row"><span class="adm-lbl">' + l + '</span>' +
         '<input type="number" class="adm-inp" id="ap_' + k + '" value="' + v + '"></div>';
  });
  h += '<div class="adm-sh" style="margin-top:12px">⚔️ 基本ステータス</div>';
  [['baseAtk','攻撃力',p.baseAtk||0],['baseDef','防御力',p.baseDef||0],
   ['baseMatk','魔法力',p.baseMatk||0],['baseSpd','速さ',p.baseSpd||0]
  ].forEach(([k,l,v]) => {
    h += '<div class="adm-row"><span class="adm-lbl">' + l + '(base)</span>' +
         '<input type="number" class="adm-inp" id="ap_' + k + '" value="' + v + '"></div>';
  });
  h += '<div class="adm-row"><button class="adm-btn adm-ok" onclick="_admApplyPlayer()">✓ 適用</button></div></div>';

  h += '<div class="adm-sec"><div class="adm-sh">👥 仲間データ</div>';
  if (gs.companion?.joined) {
    const c = gs.companion;
    h += '<div class="adm-cn">👱‍♀️ アリア</div>' +
         '<div class="adm-row"><span class="adm-lbl">HP</span><input type="number" class="adm-inp" id="cmp_aria_hp" value="' + c.hp + '">' +
         '<span class="adm-lbl">最大HP</span><input type="number" class="adm-inp" id="cmp_aria_maxHp" value="' + c.maxHp + '"></div>' +
         '<div class="adm-row"><span class="adm-lbl">MP</span><input type="number" class="adm-inp" id="cmp_aria_mp" value="' + c.mp + '">' +
         '<span class="adm-lbl">最大MP</span><input type="number" class="adm-inp" id="cmp_aria_maxMp" value="' + c.maxMp + '"></div>' +
         '<div class="adm-row"><span class="adm-lbl">レベル</span><input type="number" class="adm-inp" id="cmp_aria_lv" value="' + (c.level||1) + '"></div>' +
         '<div class="adm-row"><button class="adm-btn adm-ok" onclick="_admApplyComp(\'aria\')">✓ 適用</button></div>';
  }
  const _cn = { gaius:'ガイアス', luna:'ルナ', sola:'ソラ', serafina:'セラフィナ', zephiros:'ゼフィロス' };
  Object.entries(gs.companions || {}).forEach(([id, c]) => {
    if (!c?.joined) return;
    h += '<div class="adm-cn">' + (c.emoji||'') + ' ' + (_cn[id]||id) + '</div>' +
         '<div class="adm-row"><span class="adm-lbl">HP</span><input type="number" class="adm-inp" id="cmp_' + id + '_hp" value="' + c.hp + '">' +
         '<span class="adm-lbl">最大HP</span><input type="number" class="adm-inp" id="cmp_' + id + '_maxHp" value="' + c.maxHp + '"></div>' +
         '<div class="adm-row"><span class="adm-lbl">MP</span><input type="number" class="adm-inp" id="cmp_' + id + '_mp" value="' + c.mp + '">' +
         '<span class="adm-lbl">最大MP</span><input type="number" class="adm-inp" id="cmp_' + id + '_maxMp" value="' + c.maxMp + '"></div>' +
         '<div class="adm-row"><span class="adm-lbl">レベル</span><input type="number" class="adm-inp" id="cmp_' + id + '_lv" value="' + (c.level||1) + '">' +
         '<span class="adm-lbl">絆Lv</span><input type="number" class="adm-inp" id="cmp_' + id + '_bnd" value="' + (gs.bondLevel?.[id]||0) + '"></div>' +
         '<div class="adm-row"><button class="adm-btn adm-ok" onclick="_admApplyComp(\'' + id + '\')">✓ 適用</button></div>';
  });
  h += '</div>';
  return h;
}

function _admApplyPlayer() {
  const p = gs.player;
  const g = id => { const el = document.getElementById(id); return el ? Number(el.value) : null; };
  if (g('ap_level') !== null) p.level = Math.max(1, g('ap_level'));
  if (g('ap_exp')   !== null) p.exp   = Math.max(0, g('ap_exp'));
  if (g('ap_gold')  !== null) p.gold  = Math.max(0, g('ap_gold'));
  if (g('ap_hp')    !== null) p.hp    = Math.max(0, g('ap_hp'));
  if (g('ap_maxHp') !== null) p.maxHp = Math.max(1, g('ap_maxHp'));
  if (g('ap_mp')    !== null) p.mp    = Math.max(0, g('ap_mp'));
  if (g('ap_maxMp') !== null) p.maxMp = Math.max(0, g('ap_maxMp'));
  if (g('ap_baseAtk')  !== null) p.baseAtk  = Math.max(0, g('ap_baseAtk'));
  if (g('ap_baseDef')  !== null) p.baseDef  = Math.max(0, g('ap_baseDef'));
  if (g('ap_baseMatk') !== null) p.baseMatk = Math.max(0, g('ap_baseMatk'));
  if (g('ap_baseSpd')  !== null) p.baseSpd  = Math.max(0, g('ap_baseSpd'));
  updateStatus();
  showToast('✓ プレイヤーデータを更新しました');
}

function _admApplyComp(id) {
  const c = id === 'aria' ? gs.companion : gs.companions?.[id];
  if (!c) return;
  const g = k => { const el = document.getElementById('cmp_' + id + '_' + k); return el ? Number(el.value) : null; };
  if (g('hp')    !== null) c.hp    = Math.max(0, g('hp'));
  if (g('maxHp') !== null) c.maxHp = Math.max(1, g('maxHp'));
  if (g('mp')    !== null) c.mp    = Math.max(0, g('mp'));
  if (g('maxMp') !== null) c.maxMp = Math.max(0, g('maxMp'));
  if (g('lv')    !== null) c.level = Math.max(1, g('lv'));
  if (id !== 'aria' && g('bnd') !== null) {
    if (!gs.bondLevel) gs.bondLevel = {};
    gs.bondLevel[id] = Math.max(0, g('bnd'));
  }
  updateAllCompanionsStatus();
  showToast('✓ ' + id + 'のデータを更新しました');
}

// ── Tab 2: アイテム ──
function _admTabItems() {
  const items = gs.player.items || [];
  let h = '<div class="adm-sec"><div class="adm-sh">🎒 所持アイテム</div><div class="adm-sbox">';
  if (!items.length) {
    h += '<div style="color:#666;font-size:12px;padding:4px">アイテムなし</div>';
  } else {
    items.forEach(({id, count}) => {
      const item = ITEM_DATA[id];
      if (!item) return;
      h += '<div class="adm-row" style="margin-bottom:4px"><span style="font-size:12px;flex:1">' +
           (item.emoji||'') + ' ' + item.name + ' × ' + count + '</span>' +
           '<button class="adm-btn adm-danger" onclick="_admRemItem(\'' + id + '\')">削除</button></div>';
    });
  }
  h += '</div></div>';

  h += '<div class="adm-sec"><div class="adm-sh">➕ アイテム追加</div>' +
       '<div class="adm-row"><select id="adm-ai" class="adm-sel" style="flex:1;max-width:260px">';
  Object.entries(ITEM_DATA).forEach(([id, item]) => {
    h += '<option value="' + id + '">' + (item.emoji||'') + ' ' + item.name + ' [' + id + ']</option>';
  });
  h += '</select><input type="number" id="adm-ac" class="adm-inp" value="1" min="1" style="width:60px">' +
       '<button class="adm-btn adm-ok" onclick="_admAddItem()">追加</button></div></div>';

  h += '<div class="adm-sec"><div class="adm-sh">⚔️ 装備変更</div>';
  const slots = [['weapon','武器'],['head','頭'],['body','体'],['acc1','アクセ1'],['acc2','アクセ2']];
  slots.forEach(([slot, label]) => {
    const cur = gs.player.equipment[slot];
    h += '<div class="adm-row"><span class="adm-lbl">' + label + '</span><select id="eq_' + slot +
         '" class="adm-sel" style="flex:1;max-width:280px"><option value="">なし</option>';
    Object.entries(ITEM_DATA).forEach(([id, item]) => {
      if (item.type !== 'equipment') return;
      const ok = item.slot === slot || ((slot === 'acc1' || slot === 'acc2') && item.slot === 'accessory');
      if (!ok) return;
      h += '<option value="' + id + '"' + (cur === id ? ' selected' : '') + '>' + (item.emoji||'') + ' ' + item.name + '</option>';
    });
    h += '</select><button class="adm-btn" onclick="_admApplyEquip(\'' + slot + '\')">装備</button></div>';
  });
  h += '</div>';

  h += '<div class="adm-sec"><div class="adm-sh">🧪 素材追加</div>' +
       '<div class="adm-row"><select id="adm-am" class="adm-sel" style="flex:1;max-width:260px">';
  Object.entries(ITEM_DATA).filter(([,item]) => item.type === 'material').forEach(([id, item]) => {
    h += '<option value="' + id + '">' + (item.emoji||'') + ' ' + item.name + '</option>';
  });
  h += '</select><input type="number" id="adm-amc" class="adm-inp" value="5" min="1" style="width:60px">' +
       '<button class="adm-btn adm-ok" onclick="_admAddMaterial()">追加</button></div></div>';
  return h;
}

function _admRemItem(id) {
  gs.player.items = gs.player.items.filter(i => i.id !== id);
  updateStatus(); _adminSwTab(1);
}
function _admAddItem() {
  const id = document.getElementById('adm-ai')?.value;
  const cnt = Math.max(1, parseInt(document.getElementById('adm-ac')?.value) || 1);
  if (!id || !ITEM_DATA[id]) return;
  for (let i = 0; i < cnt; i++) addItem(id);
  updateStatus(); showToast('✓ ' + ITEM_DATA[id].name + ' ×' + cnt + ' 追加');
}
function _admAddMaterial() {
  const id = document.getElementById('adm-am')?.value;
  const cnt = Math.max(1, parseInt(document.getElementById('adm-amc')?.value) || 1);
  if (!id || !ITEM_DATA[id]) return;
  for (let i = 0; i < cnt; i++) addItem(id);
  updateStatus(); showToast('✓ ' + ITEM_DATA[id].name + ' ×' + cnt + ' 追加');
}
function _admApplyEquip(slot) {
  const id = document.getElementById('eq_' + slot)?.value || null;
  gs.player.equipment[slot] = id || null;
  updateStatus(); showToast('✓ 装備変更: ' + slot);
}

// ── Tab 3: 進行 ──
function _admTabProgress() {
  const scenes = Object.keys(SCENES);
  let h = '<div class="adm-sec"><div class="adm-sh">🗺️ シーン移動</div>' +
          '<div class="adm-row"><span class="adm-lbl">シーン</span>' +
          '<select id="adm-scene" class="adm-sel" style="flex:1;max-width:300px">';
  scenes.forEach(id => {
    h += '<option value="' + id + '"' + (id === gs.currentScene ? ' selected' : '') + '>' + id + '</option>';
  });
  h += '</select><button class="adm-btn adm-ok" onclick="_admGotoScene()">移動</button></div>' +
       '<div style="font-size:11px;color:#888;margin-top:4px">現在: ' + gs.currentScene + '</div></div>';

  const knownFlags = [
    'demonKingDefeated','vis_gods_tower','vis_void_map','vis_desert_hidden','vis_endless_trial',
    'snowCleared','desertCleared','seaCleared','elderBlessingDone','warpLearned',
    'ariaJoined','gaiusJoined','lunaJoined','serafinaJoined','zephirosJoined',
    'gotCastleKey','ariaTalk1Done','ariaTalk2Done','baalDefeated','voidWardenDefeated',
    'vis_village','vis_forest_entrance','vis_deep_forest','vis_cave_entrance',
    'vis_snow_entrance','vis_desert_entrance','vis_sea_harbor','vis_demon_castle','vis_arena',
  ];
  const allFlags = [...new Set([...knownFlags, ...Object.keys(gs.flags || {})])].sort();

  h += '<div class="adm-sec"><div class="adm-sh">🏴 フラグ編集</div>' +
       '<div class="adm-row" style="margin-bottom:8px">' +
       '<input type="text" id="adm-fn" class="adm-inp" placeholder="新規フラグ名" style="flex:1;min-width:140px">' +
       '<button class="adm-btn adm-ok" onclick="_admAddFlag()">+ 追加</button></div>' +
       '<div class="adm-fg">';
  allFlags.forEach(k => {
    const ck = gs.flags?.[k] ? ' checked' : '';
    h += '<div class="adm-fi"><input type="checkbox" id="fl_' + k + '"' + ck +
         ' onchange="_admSetFlag(\'' + k + '\',this.checked)">' +
         '<label for="fl_' + k + '" title="' + k + '">' + k + '</label></div>';
  });
  h += '</div></div>';

  h += '<div class="adm-sec"><div class="adm-sh">📋 クエスト状態</div><div class="adm-sbox">';
  QUEST_DATA.forEach(q => {
    const qs = gs.quests?.[q.id] || {};
    const sel = qs.completed ? 'completed' : qs.active ? 'active' : 'none';
    h += '<div class="adm-row" style="margin-bottom:4px"><span style="font-size:11px;flex:1">' +
         (q.emoji||'') + ' ' + (q.name||q.id) + '</span>' +
         '<select class="adm-sel" onchange="_admSetQuest(\'' + q.id + '\',this.value)">' +
         '<option value="none"' + (sel==='none'?' selected':'') + '>未受注</option>' +
         '<option value="active"' + (sel==='active'?' selected':'') + '>進行中</option>' +
         '<option value="completed"' + (sel==='completed'?' selected':'') + '>完了</option>' +
         '</select></div>';
  });
  h += '</div></div>';
  return h;
}

function _admGotoScene() {
  const id = document.getElementById('adm-scene')?.value;
  if (!id || !SCENES[id]) { showToast('❌ 不明なシーン'); return; }
  _adminClose();
  gotoScene(id);
}
function _admSetFlag(k, v) {
  if (!gs.flags) gs.flags = {};
  gs.flags[k] = v;
  if (k === 'demonKingDefeated' && v) {
    gs.flags.vis_gods_tower = gs.flags.vis_void_map = gs.flags.vis_desert_hidden = gs.flags.vis_endless_trial = true;
  }
}
function _admAddFlag() {
  const k = (document.getElementById('adm-fn')?.value || '').trim();
  if (!k) return;
  if (!gs.flags) gs.flags = {};
  gs.flags[k] = true;
  showToast('✓ フラグ追加: ' + k);
  _adminSwTab(2);
}
function _admSetQuest(id, state) {
  if (!gs.quests) gs.quests = {};
  if (state === 'none')      { delete gs.quests[id]; }
  else if (state === 'active')    { gs.quests[id] = { active: true, completed: false, progress: 0 }; }
  else if (state === 'completed') { gs.quests[id] = { active: true, completed: true, progress: 999 }; }
}

// ── Tab 4: バランス ──
function _admTabBalance() {
  if (!gs.adminMult) gs.adminMult = { eHp:1, eAtk:1, eDef:1, exp:1, gold:1, shop:1 };
  const m = gs.adminMult;
  let h = '<div class="adm-sec"><div class="adm-sh">⚖️ 敵ステータス倍率</div>' +
          '<div style="color:#888;font-size:11px;margin-bottom:8px">1.0=標準　0.5=半分　2.0=2倍（次回戦闘から適用）</div>';
  [['eHp','敵HP倍率',m.eHp],['eAtk','敵ATK倍率',m.eAtk],['eDef','敵DEF倍率',m.eDef]].forEach(([k,l,v]) => {
    h += '<div class="adm-row"><span class="adm-lbl">' + l + '</span>' +
         '<input type="number" class="adm-inp" id="bal_' + k + '" value="' + v + '" step="0.1" min="0.1" max="20" style="width:80px">' +
         '<input type="range" min="0.1" max="5" step="0.1" value="' + v +
         '" style="flex:1;margin:0 4px" oninput="document.getElementById(\'bal_' + k + '\').value=this.value"></div>';
  });
  h += '</div><div class="adm-sec"><div class="adm-sh">💰 報酬・価格倍率</div>';
  [['exp','EXP倍率',m.exp],['gold','ゴールド倍率',m.gold],['shop','ショップ価格倍率',m.shop]].forEach(([k,l,v]) => {
    h += '<div class="adm-row"><span class="adm-lbl">' + l + '</span>' +
         '<input type="number" class="adm-inp" id="bal_' + k + '" value="' + v + '" step="0.1" min="0.1" max="20" style="width:80px">' +
         '<input type="range" min="0.1" max="5" step="0.1" value="' + v +
         '" style="flex:1;margin:0 4px" oninput="document.getElementById(\'bal_' + k + '\').value=this.value"></div>';
  });
  h += '<div class="adm-row" style="margin-top:10px">' +
       '<button class="adm-btn adm-ok" onclick="_admApplyBalance()">✓ 適用</button>' +
       '<button class="adm-btn" onclick="_admResetBalance()">↩ リセット(×1.0)</button></div></div>';
  return h;
}
function _admApplyBalance() {
  if (!gs.adminMult) gs.adminMult = {};
  ['eHp','eAtk','eDef','exp','gold','shop'].forEach(k => {
    const v = parseFloat(document.getElementById('bal_' + k)?.value);
    if (!isNaN(v) && v > 0) gs.adminMult[k] = v;
  });
  showToast('✓ バランス倍率を適用（次回戦闘から反映）');
}
function _admResetBalance() {
  gs.adminMult = { eHp:1, eAtk:1, eDef:1, exp:1, gold:1, shop:1 };
  _adminSwTab(3);
  showToast('↩ バランスをリセット');
}

// ── Tab 5: デバッグ ──
function _admTabDebug() {
  let h = '<div class="adm-sec"><div class="adm-sh">🛠️ クイックアクション</div>' +
          '<div class="adm-row" style="flex-wrap:wrap;gap:8px">' +
          '<button class="adm-btn adm-ok" onclick="_admGiveAll()">📦 全アイテム取得</button>' +
          '<button class="adm-btn adm-ok" onclick="_admUnlockTitles()">🏆 全称号解放</button>' +
          '<button class="adm-btn adm-ok" onclick="_admUnlockBook()">📖 図鑑全解放</button>' +
          '<button class="adm-btn adm-ok" onclick="_admMaxPlayer()">⬆️ Lv99最大化</button>' +
          '<button class="adm-btn" onclick="_admFullRecover()">💊 全回復</button>' +
          '</div></div>';

  h += '<div class="adm-sec"><div class="adm-sh">🏆 称号管理</div><div class="adm-sbox">';
  TITLE_DATA.forEach(t => {
    const has = !!gs.titles?.[t.id]?.obtained;
    h += '<div class="adm-row" style="margin-bottom:4px"><span style="font-size:11px;flex:1">' +
         (t.emoji||'🏆') + ' ' + t.name +
         ' <span style="color:' + (has ? '#66ff66' : '#666') + '">' + (has ? '✓取得済' : '未取得') + '</span></span>' +
         '<button class="adm-btn ' + (has ? 'adm-danger' : 'adm-ok') + '" onclick="_admToggleTitle(\'' + t.id + '\')">' +
         (has ? '削除' : '付与') + '</button></div>';
  });
  h += '</div></div>';

  const jsonStr = JSON.stringify(gs, null, 2).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  h += '<div class="adm-sec"><div class="adm-sh">📄 ゲーム状態 JSON</div>' +
       '<div class="adm-row"><button class="adm-btn" onclick="_admRefreshJson()">🔄 JSON更新</button>' +
       '<button class="adm-btn adm-ok" onclick="_admApplyJson()">✓ JSON適用</button>' +
       '<button class="adm-btn" onclick="_admExportJson()">💾 エクスポート</button></div>' +
       '<textarea id="adm-json" class="adm-ta">' + jsonStr + '</textarea></div>';
  return h;
}

function _admGiveAll() {
  Object.keys(ITEM_DATA).forEach(id => addItem(id));
  updateStatus(); showToast('📦 全アイテムを追加しました');
}
function _admUnlockTitles() {
  if (!gs.titles) gs.titles = {};
  TITLE_DATA.forEach(t => { gs.titles[t.id] = { obtained: true }; });
  showToast('🏆 全称号を解放しました');
  _adminSwTab(4);
}
function _admUnlockBook() {
  if (!gs.monsterBook) gs.monsterBook = {};
  Object.keys(ENEMY_DATA).forEach(id => {
    if (!gs.monsterBook[id]) gs.monsterBook[id] = { kills: 1 };
  });
  showToast('📖 モンスター図鑑を全解放しました');
}
function _admMaxPlayer() {
  const p = gs.player;
  p.level = 99; p.maxHp = 9999; p.hp = 9999; p.maxMp = 999; p.mp = 999;
  p.baseAtk = 999; p.baseDef = 999; p.baseMatk = 999; p.baseSpd = 50;
  p.exp = EXP_TABLE[99] || 9999999; p.gold = 9999999;
  updateStatus(); showToast('⬆️ プレイヤーをLv99最大化しました');
  _adminSwTab(0);
}
function _admFullRecover() {
  const p = gs.player;
  p.hp = p.maxHp; p.mp = p.maxMp;
  if (gs.companion?.joined) { gs.companion.hp = gs.companion.maxHp; gs.companion.mp = gs.companion.maxMp; }
  Object.values(gs.companions||{}).forEach(c => { if (c?.joined) { c.hp = c.maxHp; c.mp = c.maxMp; } });
  updateStatus(); updateAllCompanionsStatus(); showToast('💊 全回復しました');
}
function _admToggleTitle(id) {
  if (!gs.titles) gs.titles = {};
  if (gs.titles[id]?.obtained) { gs.titles[id] = {}; } else { gs.titles[id] = { obtained: true }; }
  _adminSwTab(4);
}
function _admRefreshJson() {
  const ta = document.getElementById('adm-json');
  if (ta) ta.value = JSON.stringify(gs, null, 2);
}
function _admApplyJson() {
  try {
    const ta = document.getElementById('adm-json');
    if (!ta) return;
    gs = JSON.parse(ta.value);
    updateStatus(); updateAllCompanionsStatus();
    _adminClose();
    gotoScene(gs.currentScene || 'village');
    showToast('✓ JSONを適用しました');
  } catch (e) {
    showToast('❌ JSONパースエラー: ' + e.message);
  }
}
function _admExportJson() {
  try {
    const blob = new Blob([JSON.stringify(gs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'rpg_save_export.json'; a.click();
    URL.revokeObjectURL(url);
  } catch (e) { showToast('エクスポート失敗: ' + e.message); }
}
