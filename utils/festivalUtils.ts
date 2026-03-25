import festivalsData from '../data/festivals.json';

export type FestivalType = 'lunar' | 'solar';

export interface Festival {
    name: string;
    type: FestivalType;
    date: 'dynamic' | string; // 'dynamic' for lunar, or 'MM-DD' for fixed
    month?: number;
    day?: number;
    accent: string;
    pastelAccent: string; // For Light Mode background
    darkAccent: string; // For Light Mode text contrast
    backgroundOverlay: string;
    priority: number; // 1: Global, 2: National, 3: State
    message: string;
    isHoli?: boolean;
}

export const FESTIVAL_CONFIG: Record<string, any> = {
    India: {
        National: [
            { name: "Republic Day", type: "solar", date: "01-26", accent: "#FF9933", pastelAccent: "#ffcc99", darkAccent: "#c2410c", backgroundOverlay: "linear-gradient(135deg, rgba(255,153,51,0.1), rgba(18,18,18,0))", priority: 2, message: "HAPPY REPUBLIC DAY" },
            { name: "Independence Day", type: "solar", date: "08-15", accent: "#138808", pastelAccent: "#a8e6cf", darkAccent: "#138808", backgroundOverlay: "linear-gradient(135deg, rgba(19,136,8,0.1), rgba(18,18,18,0))", priority: 2, message: "HAPPY INDEPENDENCE DAY" },
            { name: "Gandhi Jayanti", type: "solar", date: "10-02", accent: "#FFFFFF", pastelAccent: "#e2e8f0", darkAccent: "#475569", backgroundOverlay: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(18,18,18,0))", priority: 2, message: "GANDHI JAYANTI" }
        ],
        Kerala: [
            { name: "Onam", type: "lunar", date: "dynamic", accent: "#FFD700", pastelAccent: "#fef3c7", darkAccent: "#b45309", backgroundOverlay: "radial-gradient(circle at top, rgba(255,215,0,0.1), transparent)", priority: 3, message: "HAPPY ONAM" }
        ],
        "Tamil Nadu": [
            { name: "Pongal", type: "solar", date: "01-14", accent: "#FFA500", pastelAccent: "#ffedd5", darkAccent: "#c2410c", backgroundOverlay: "radial-gradient(circle at top, rgba(255,165,0,0.1), transparent)", priority: 3, message: "HAPPY PONGAL" }
        ],
        Karnataka: [
            { name: "Ugadi", type: "lunar", date: "dynamic", accent: "#ADFF2F", pastelAccent: "#f0fdf4", darkAccent: "#15803d", backgroundOverlay: "radial-gradient(circle at top, rgba(173,255,47,0.1), transparent)", priority: 3, message: "HAPPY UGADI" }
        ],
        Telangana: [
            { name: "Ugadi", type: "lunar", date: "dynamic", accent: "#ADFF2F", pastelAccent: "#f0fdf4", darkAccent: "#15803d", backgroundOverlay: "radial-gradient(circle at top, rgba(173,255,47,0.1), transparent)", priority: 3, message: "HAPPY UGADI" }
        ],
        Maharashtra: [
            { name: "Gudi Padwa", type: "lunar", date: "dynamic", accent: "#FF8C00", pastelAccent: "#fff7ed", darkAccent: "#c2410c", backgroundOverlay: "radial-gradient(circle at top, rgba(255,140,0,0.1), transparent)", priority: 3, message: "HAPPY GUDI PADWA" }
        ]
    },
    USA: {
        National: [
            { name: "Independence Day", type: "solar", date: "07-04", accent: "#B22234", pastelAccent: "#fee2e2", darkAccent: "#991b1b", backgroundOverlay: "linear-gradient(135deg, rgba(178,34,52,0.1), rgba(18,18,18,0))", priority: 2, message: "HAPPY INDEPENDENCE DAY" }
        ]
    },
    Global: [
        { name: "New Year", type: "solar", date: "01-01", accent: "#00E6FF", pastelAccent: "#e0f2fe", darkAccent: "#0369a1", backgroundOverlay: "radial-gradient(circle at center, rgba(0,230,255,0.1), transparent)", priority: 1, message: "HAPPY NEW YEAR" },
        { name: "Holi", type: "lunar", date: "dynamic", accent: "#FF4D6D", pastelAccent: "#fff1f2", darkAccent: "#be123c", backgroundOverlay: "radial-gradient(circle at top, rgba(255,77,109,0.15), transparent)", priority: 1, message: "HAPPY HOLI", isHoli: true },
        { name: "Diwali", type: "lunar", date: "dynamic", accent: "#FFD700", pastelAccent: "#fef3c7", darkAccent: "#b45309", backgroundOverlay: "radial-gradient(circle at center, rgba(255,215,0,0.15), transparent)", priority: 1, message: "HAPPY DIWALI" },
        { name: "Christmas", type: "solar", date: "12-25", accent: "#F5F7FA", pastelAccent: "#f8fafc", darkAccent: "#475569", backgroundOverlay: "radial-gradient(circle at top, rgba(255,255,255,0.1), transparent)", priority: 1, message: "MERRY CHRISTMAS" }
    ]
};

export const getActiveFestival = (country: string, state: string | null): Festival | null => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const monthDay = `${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

    const eligibleFestivals: Festival[] = [];

    // 1. Helper for Islamic Lunar (Intl API)
    const getIslamicFestival = (): Festival | null => {
        try {
            const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', { day: 'numeric', month: 'numeric' });
            const parts = hijriFormatter.formatToParts(now);
            const hDay = parts.find(p => p.type === 'day')?.value || '';
            const hMonth = parts.find(p => p.type === 'month')?.value || '';

            if (hMonth === '9') return { name: "Ramadan", type: "lunar", date: "dynamic", accent: "#7C3AED", pastelAccent: "#f5f3ff", darkAccent: "#5b21b6", backgroundOverlay: "radial-gradient(circle at center, rgba(124,58,237,0.1), transparent)", priority: 1, message: "RAMADAN KAREEM" };
            if (hMonth === '10' && (hDay === '1' || hDay === '2')) return { name: "Eid al-Fitr", type: "lunar", date: "dynamic", accent: "#00E6FF", pastelAccent: "#e0f2fe", darkAccent: "#0369a1", backgroundOverlay: "radial-gradient(circle at center, rgba(0,230,255,0.1), transparent)", priority: 1, message: "EID MUBARAK" };
            return null;
        } catch (e) { return null; }
    };

    const islamicFest = getIslamicFestival();
    if (islamicFest) eligibleFestivals.push(islamicFest);

    // 2. Load Global, National, State festivals and check dates
    const checkConfig = (list: Festival[]) => {
        list.forEach(fest => {
            if (fest.type === 'solar' && fest.date === monthDay) {
                eligibleFestivals.push(fest);
            } else if (fest.type === 'lunar') {
                const yearDatas = (festivalsData.festivals as any)[year];
                if (yearDatas && yearDatas[fest.name] === monthDay) {
                    eligibleFestivals.push(fest);
                }
            }
        });
    };

    checkConfig(FESTIVAL_CONFIG.Global);

    const countryConfig = FESTIVAL_CONFIG[country];
    if (countryConfig) {
        if (countryConfig.National) checkConfig(countryConfig.National);
        if (state && countryConfig[state]) checkConfig(countryConfig[state]);
    }

    if (eligibleFestivals.length === 0) return null;

    // 3. Return highest priority festival
    return eligibleFestivals.sort((a, b) => b.priority - a.priority)[0];
};
