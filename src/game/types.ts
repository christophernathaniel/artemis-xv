// Ok, so i want to list all of the types or objects in the game
// then i can use them in the game logic

// Object blueprints -------------------------------------------------------------------

// Every game object x,y position
// and velocity vx and vy
export interface Vec2 {
    x: number;
    y: number;
}


// Player state
export interface Player {
    pos: Vec2; // plater position
    vel: Vec2; // player veolicity
    angle: number; // the angle of the ship
    health: number; // how much health
    shield: number; // how much shield
    lives: number; // how many lives
    score: number; // the current score

    // dodging
    dodgeCharges: number; // this is how many dodge charges
    dodgeCooldown: number; // this is if the dodge is on cooldown
    isDodging: boolean; // this is if the player is in the middle of a dodge
    dodgeTimer: number; // ok so the dodge needs to last a certain time

    // invincibility
    invincibleTimer: number; // so we can be invincible for a certain time (like after respawning)

    isAlive: boolean; // true = alive, false = dead
    radius: number; // Collision radius

    shieldRegenCooldown: number;

    previousShield: number; // for tracking when shield takes damage
}

//


// Projectiles
export interface Projectile {
    id: number;
    pos: Vec2;
    vel: Vec2;
    radius: number;
    lifetime: number; // how long the projectile has been alive (in seconds)
}

// Debris
export interface Debris {
    id: number;
    pos: Vec2;
    vel: Vec2;
    radius: number;
    rotation: number; //  debris projectiles can rotate
    rotationSpeed: number; //  debris projectiles can rotate
    sides: number; // number of sites (like 3,4,5,6,7)
}

// Antimatter
export interface Antimatter {
    id: number;
    pos: Vec2;
    vel: Vec2;
    radius: number;
    rotation: number; //  debris projectiles can rotate
    rotationSpeed: number; //  debris projectiles can rotate
    jaggedness: number[]; // how to make it look dangerous
}

// Black holes
export interface BlackHole {
    id: number;
    pos: Vec2;
    radius: number;
    pullRadius: number;
    pullStrength: number;
    spinAngle: number
}


// Collectables
export type CollectableType = 'helium3' | 'solar';

export interface Collectable {
    id: number;
    type: CollectableType;
    pos: Vec2;
    radius: number;
    bobOffset: number; // bob up and down
    rotation: number; // collectables can rotate
}

// Power ups
export type PowerUpType = 'shield_restore' | 'rapid_fire' | 'invincibility';

export interface PowerUp {
    id: number;
    type: PowerUpType;
    pos: Vec2;
    radius: number;
    pulsePhase: number; // collectables pulse in an dout.
}

// Score
// When we get points we have a little popup animation!
export interface ScorePopup {
    id: number;
    value: number;
    pos: Vec2;
    lifetime: number; // set apperance time
    maxLifetime: number;
}


// Camera
export interface Camera {
    x: number;
    y: number;
    z: number;
    // zoom later??
}



// Gamestate which can have multiple [] of each but a single player
export interface GameState {
    player: Player;
    camera: Camera;

    // object multiples
    projectiles: Projectile[];
    debris: Debris[];
    antimatter: Antimatter[];
    blackHoles: BlackHole[];
    collectibles: Collectable[];
    powerUps: PowerUp[];
    scorePopups: ScorePopup[];
    // end object multiples


    elapsedTime: number; // how long has the game bee going for
    isGameOver: boolean;
    isPaused: boolean;

    nextId: number; // the next id is given to spawning of new object multiples

    // power ups
    rapidFireTimer: number; // time rapid fire
    invincibilityTimer: number; // time invincib

    shootCooldown: number; // limit how fast player can shoot

}


// Everything for the HUD
export interface HUDData {
    health: number;
    shield: number;
    score: number;
    lives: number;
    dodgeCharges: number;
    dodgeCooldown: number;
    elapsedTime: number;
    isGameOver: boolean;
    rapidFireActive: boolean;
    invincibilityActive: boolean;
}
// END HUD

// Everything for the game state logic
export interface HUDState {
    elapsedTime: number;
    isPaused: boolean;
}