// All variables will be listed here and imported


// The world dimensions / variables
export const WORLD_WIDTH = 4000;
export const WORLD_HEIGHT = 4000;



// the player variables ---------------------------------------------
export const PLAYER_SPEED = 80; // pixels per second
export const PLAYER_RADIUS = 16; // for collisions
export const PLAYER_MAX_HEALTH = 100;
export const PLAYER_MAX_SHIELD = 100;

export const PLAYER_SHIELD_REGEN = 15; // # of sheild per second
export const SHIELD_REGEN_COOLDOWN = 5.5; // seconds after taking damage before regen starts
export const PLAYER_START_LIVES = 5;

export const PLAYER_INVINCIBILITY_DURATION = 2.5; // seconds of invincibility

// Dodge variables
export const PLAYER_DODGE_SPEED = 280; // pixels per second
export const PLAYER_DODGE_DURATION = 2; // seconds
export const PLAYER_DODGE_CHARGES = 3; // total amount of charges
export const PLAYER_DODGE_RECHARGE = 30; // seconds to charge dodge

// END player variables ---------------------------------------------



// projectiles variables ---------------------------------------------
export const PROJECTILE_SPEED = 400;
export const PROJECTILE_RADIUS = 4;
export const PROJECTILE_LIFETIME = 1.8;
export const SHOOT_COOLDOWN = 0.25;
export const SHOOT_COOLDOWN_RAPID = 0.08;
// END projectiles variables ---------------------------------------------


// debris variables ---------------------------------------------
export const DEBRIS_COUNT = 120;
export const DEBRIS_MIN_RADIUS = 8;
export const DEBRIS_MAX_RADIUS = 28;
export const DEBRIS_MIN_SPEED = 15;
export const DEBRIS_MAX_SPEED = 55;
// END debris variables ---------------------------------------------


// antimatter variables ---------------------------------------------
export const ANTIMATTER_COUNT = 200;
export const ANTIMATTER_MIN_RADIUS = 14;
export const ANTIMATTER_MAX_RADIUS = 36;
export const ANTIMATTER_MIN_SPEED = 20;
export const ANTIMATTER_MAX_SPEED = 65;
export const ANTIMATTER_DAMAGE = 35;
// END antimatter variables ---------------------------------------------


// black hole variables ---------------------------------------------
export const BLACK_HOLE_COUNT = 8;
export const BLACK_HOLE_RADIUS = 40;
export const BLACK_HOLE_PULL_RADIUS = 500;
export const BLACK_HOLE_PULL_STRENGTH = 300;
// END black hole variables ---------------------------------------------

// collectables variables ---------------------------------------------
export const HELIUM3_COUNT = 25;
export const SOLAR_COUNT = 15;
export const COLLECTIBLE_RADIUS = 12;

// collectalbes points
export const HELIUM3_POINTS = 10;
export const SOLAR_POINTS = 25;
// END collectables variables ---------------------------------------------


// Powerups variables ---------------------------------------------
export const POWERUP_COUNT = 8;
export const POWERUP_RADIUS = 14;
export const RAPID_FIRE_DURATION = 8;
export const INVINCIBILITY_DURATION = 5;
// END Powerups variables ---------------------------------------------


// RENDER
export const STAR_COUNT = 2000; // stars for background to add depth
export const TARGET_FPS = 60;

// Boundaries 
export const BOUNDARY_PADDING = 30; // death near boundary in px


// Zoom
export const ZOOM_SPEED = 1.5;
export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 2.5;
// END Zoom