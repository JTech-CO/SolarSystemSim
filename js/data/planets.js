export const PLANETS = [
    {
        name: "Mercury", type: "Planet", color: ["#a5a5a5", "#5a5a5a"], size: 0.38, orbit: 0.4, speed: 4.7,
        desc: "The closest planet to the Sun. It has almost no atmosphere.", moons: []
    },
    {
        name: "Venus", type: "Planet", color: ["#e3bb76", "#d1a863"], size: 0.95, orbit: 0.7, speed: 3.5,
        desc: "The hottest planet covered by thick carbon dioxide atmosphere.", moons: []
    },
    {
        name: "Earth", type: "Planet", color: ["#2255cc", "#113344"], size: 1, orbit: 1, speed: 3,
        desc: "The only planet with known life.",
        moons: [{ name: "Moon", size: 0.27, orbit: 2.5, speed: 2, color: ["#ccc", "#999"] }]
    },
    {
        name: "Mars", type: "Planet", color: ["#da4e3c", "#8c2a1d"], size: 0.53, orbit: 1.5, speed: 2.4,
        desc: "The red planet with iron oxide surface.",
        moons: [
            { name: "Phobos", size: 0.08, orbit: 1.2, speed: 4, color: ["#777", "#555"] },
            { name: "Deimos", size: 0.05, orbit: 1.8, speed: 3, color: ["#888", "#666"] }
        ]
    },
    {
        name: "Jupiter", type: "Planet", color: ["#d8ca9d", "#a59186"], size: 11.2, orbit: 5.2, speed: 1.3,
        desc: "The largest gas giant in the solar system.",
        moons: [
            { name: "Io", size: 0.28, orbit: 13, speed: 2.5, color: ["#ddcc55", "#aa8833"] },
            { name: "Europa", size: 0.25, orbit: 16, speed: 2.0, color: ["#ddeecc", "#bbccdd"] },
            { name: "Ganymede", size: 0.41, orbit: 20, speed: 1.5, color: ["#998877", "#665544"] },
            { name: "Callisto", size: 0.38, orbit: 26, speed: 1.0, color: ["#665555", "#443333"] }
        ]
    },
    {
        name: "Saturn", type: "Planet", color: ["#ead6b8", "#ceb8b8"], size: 9.4, orbit: 9.5, speed: 0.9, hasRing: true,
        desc: "The planet with beautiful rings.",
        moons: [{ name: "Titan", size: 0.4, orbit: 18, speed: 1.2, color: ["#ccaa33", "#997722"] }]
    },
    {
        name: "Uranus", type: "Planet", color: ["#d1e7e7", "#aaddff"], size: 4, orbit: 19.2, speed: 0.68,
        desc: "An ice giant with a tilted rotation axis.", moons: []
    },
    {
        name: "Neptune", type: "Planet", color: ["#5b5ddf", "#3333aa"], size: 3.9, orbit: 30, speed: 0.54,
        desc: "The blue planet with strong storms.",
        moons: [{ name: "Triton", size: 0.21, orbit: 5, speed: -1.5, color: ["#ddd", "#bbb"] }]
    }
];

