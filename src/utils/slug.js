const MAP = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',
  и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',
  с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',
  щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
};

export function toSlug(str) {
  return String(str)
    .toLowerCase()
    .replace(/[а-яё]/g, c => MAP[c] ?? c)
    .replace(/[\s—–()/]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function nameFromSlug(slug, names) {
  return names.find(n => toSlug(n) === slug) ?? null;
}
