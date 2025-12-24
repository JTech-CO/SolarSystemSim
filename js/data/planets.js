export const PLANETS = [
    {
        name: "Mercury", type: "Planet", color: ["#a5a5a5", "#5a5a5a"], size: 0.38, orbit: 0.4, speed: 4.7,
        desc: "The closest planet to the Sun. It has almost no atmosphere.",
        mass: 3.3011e23, // kg
        radius: 2439.7, // km
        orbitalPeriod: 87.97, // days
        rotationPeriod: 1407.6, // hours
        surfaceGravity: 3.7, // m/s²
        moons: []
    },
    {
        name: "Venus", type: "Planet", color: ["#e3bb76", "#d1a863"], size: 0.95, orbit: 0.7, speed: 3.5,
        desc: "The hottest planet covered by thick carbon dioxide atmosphere.",
        mass: 4.8675e24, // kg
        radius: 6051.8, // km
        orbitalPeriod: 224.7, // days
        rotationPeriod: -5832.5, // hours (retrograde, negative)
        surfaceGravity: 8.87, // m/s²
        moons: []
    },
    {
        name: "Earth", type: "Planet", color: ["#2255cc", "#113344"], size: 1, orbit: 1, speed: 3,
        desc: "The only planet with known life.",
        mass: 5.97237e24, // kg
        radius: 6371.0, // km
        orbitalPeriod: 365.256, // days
        rotationPeriod: 23.934, // hours
        surfaceGravity: 9.82, // m/s²
        moons: [{ name: "Moon", size: 0.27, orbit: 2.5, speed: 2, color: ["#ccc", "#999"] }]
    },
    {
        name: "Mars", type: "Planet", color: ["#da4e3c", "#8c2a1d"], size: 0.53, orbit: 1.5, speed: 2.4,
        desc: "The red planet with iron oxide surface.",
        mass: 6.4171e23, // kg
        radius: 3389.5, // km
        orbitalPeriod: 686.98, // days
        rotationPeriod: 24.6229, // hours
        surfaceGravity: 3.71, // m/s²
        moons: [
            { name: "Phobos", size: 0.08, orbit: 1.2, speed: 4, color: ["#777", "#555"] },
            { name: "Deimos", size: 0.05, orbit: 1.8, speed: 3, color: ["#888", "#666"] }
        ]
    },
    {
        name: "Jupiter", type: "Planet", color: ["#d8ca9d", "#a59186"], size: 11.2, orbit: 5.2, speed: 1.3,
        desc: "The largest gas giant in the solar system.",
        mass: 1.8982e27, // kg
        radius: 69911, // km
        orbitalPeriod: 4332.59, // days
        rotationPeriod: 9.925, // hours
        surfaceGravity: 24.79, // m/s² (at cloud tops)
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
        mass: 5.6834e26, // kg
        radius: 58232, // km
        orbitalPeriod: 10759.22, // days
        rotationPeriod: 10.656, // hours
        surfaceGravity: 10.44, // m/s² (at cloud tops)
        moons: [{ name: "Titan", size: 0.4, orbit: 18, speed: 1.2, color: ["#ccaa33", "#997722"] }]
    },
    {
        name: "Uranus", type: "Planet", color: ["#d1e7e7", "#aaddff"], size: 4, orbit: 19.2, speed: 0.68,
        desc: "An ice giant with a tilted rotation axis.",
        mass: 8.6810e25, // kg
        radius: 25362, // km
        orbitalPeriod: 30688.5, // days
        rotationPeriod: -17.24, // hours (retrograde, negative)
        surfaceGravity: 8.69, // m/s² (at cloud tops)
        moons: []
    },
    {
        name: "Neptune", type: "Planet", color: ["#5b5ddf", "#3333aa"], size: 3.9, orbit: 30, speed: 0.54,
        desc: "The blue planet with strong storms.",
        mass: 1.02413e26, // kg
        radius: 24622, // km
        orbitalPeriod: 60182, // days
        rotationPeriod: 16.11, // hours
        surfaceGravity: 11.15, // m/s² (at cloud tops)
        moons: [{ name: "Triton", size: 0.21, orbit: 5, speed: -1.5, color: ["#ddd", "#bbb"] }]
    }
];

