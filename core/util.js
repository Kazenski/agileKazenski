// util.js

// --- CONSTANTES ---
const DEFAULT_ROLES_BASE = ["PM", "Agilista", "Time", "Geral"];

const RATING_MAP = { 
    0: "N/A", 1: "1 - Não", 2: "2 - Raro", 3: "3 - Vezes", 4: "4 - Freq", 5: "5 - Cult!" 
};

const MATURITY_LEVELS = [
    { min: 0, max: 1.5, label: "Incipiente", color: "text-red-400", bg: "bg-red-900/20", border: "border-red-800" },
    { min: 1.5, max: 2.5, label: "Emergente", color: "text-orange-400", bg: "bg-orange-900/20", border: "border-orange-800" },
    { min: 2.5, max: 3.5, label: "Praticante", color: "text-yellow-400", bg: "bg-yellow-900/20", border: "border-yellow-800" },
    { min: 3.5, max: 4.5, label: "Avançado", color: "text-cyan-400", bg: "bg-cyan-900/20", border: "border-cyan-800" },
    { min: 4.5, max: 5.1, label: "Excelência", color: "text-blue-400", bg: "bg-blue-900/20", border: "border-blue-800" }
];

// --- UTILS ---
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

const getClassification = (score) => MATURITY_LEVELS.find(l => score >= l.min && score < l.max) || MATURITY_LEVELS[0];

const moveInArray = (arr, index, direction) => {
    const res = [...arr];
    const target = index + direction;
    if (target < 0 || target >= res.length) return arr;
    [res[index], res[target]] = [res[target], res[index]];
    return res;
};

const sanitizeRoles = (rolesData) => {
    if (!Array.isArray(rolesData)) return DEFAULT_ROLES_BASE.map(r => ({ id: generateId(), nome: r, hidden: false }));
    return rolesData.map(r => (typeof r === 'string' ? { id: generateId(), nome: r, hidden: false } : { ...r, id: r.id || generateId() }));
};