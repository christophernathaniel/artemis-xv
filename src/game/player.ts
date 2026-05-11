import type { Player } from './types';
import type { InputState } from './input';
import { createPulseTimer } from './../components/helpers/createPulseTimer';
import { createSprite } from '../components/helpers/createSprite';

import shipImageUrl from './player/assets/ship.svg';
import flamesImageUrl from './player/assets/flames.svg';
import afterburnerImageUrl from './player/assets/afterburner.svg';
import leftburnerupImageUrl from './player/assets/leftburner_up.svg';
import rightburnerupImageUrl from './player/assets/rightburner_up.svg';
import leftburnerdownImageUrl from './player/assets/leftburner_down.svg';
import rightburnerdownImageUrl from './player/assets/rightburner_down.svg';
import thrusterImageUrl from './player/sprites/afterburner.svg';
import shieldSpriteImageUrl from './player/sprites/shield.svg';
import shieldImageUrl from './player/assets/shield.svg';
import shieldEmergencyImageUrl from './player/sprites/shieldEmergency.svg';
import ship_damange1 from './player/assets/ship_damage1.svg';

const shipImage: HTMLImageElement = new Image();
shipImage.src = shipImageUrl;

const flamesImage: HTMLImageElement = new Image();
flamesImage.src = flamesImageUrl;

const afterburnerImage: HTMLImageElement = new Image();
afterburnerImage.src = afterburnerImageUrl;

const leftburnerupImage: HTMLImageElement = new Image();
leftburnerupImage.src = leftburnerupImageUrl;

const rightburnerupImage: HTMLImageElement = new Image();
rightburnerupImage.src = rightburnerupImageUrl;

const leftburnerdownImage: HTMLImageElement = new Image();
leftburnerdownImage.src = leftburnerdownImageUrl;

const rightburnerdownImage: HTMLImageElement = new Image();
rightburnerdownImage.src = rightburnerdownImageUrl;

const afterburnerSprite: HTMLImageElement = new Image();
afterburnerSprite.src = thrusterImageUrl;

const shieldSpriteImage: HTMLImageElement = new Image();
shieldSpriteImage.src = shieldSpriteImageUrl;

const shieldImage: HTMLImageElement = new Image();
shieldImage.src = shieldImageUrl;

const shipDamage1Image: HTMLImageElement = new Image();
shipDamage1Image.src = ship_damange1;

const shieldEmergencyImage: HTMLImageElement = new Image();
shieldEmergencyImage.src = shieldEmergencyImageUrl;

const oxygenBurnerMap: { [key: string]: { [key: string]: HTMLImageElement } } = {
    'up': {
        'left': leftburnerupImage,
        'right': rightburnerupImage
    },
    'down': {
        'left': leftburnerdownImage,
        'right': rightburnerdownImage
    }

}

let prevFrameAngle: number = 0;

const oxygenBurnerPulse = createPulseTimer(200, 200);
const oxygenBurnerPulse2 = createPulseTimer(100, 400);
const afterburnerPulse = createPulseTimer(20, 1000);

const thrusterSprite = createSprite({
    image: afterburnerSprite,
    frameWidth: 465,
    frameHeight: 465,
    frameCount: 3,
    frameDurationMs: 80,
});

const shieldSprite = createSprite({
    image: shieldSpriteImage,
    frameWidth: 675,
    frameHeight: 675,
    frameCount: 6,
    frameDurationMs: 40,
});

const shieldEmergencySprite = createSprite({
    image: shieldEmergencyImage,
    frameWidth: 675,
    frameHeight: 675,
    frameCount: 6,
    frameDurationMs: 40,
});





import {
    PLAYER_RADIUS,
    PLAYER_MAX_HEALTH,
    PLAYER_MAX_SHIELD,
    PLAYER_START_LIVES,
    PLAYER_DODGE_CHARGES,
    WORLD_WIDTH,
    WORLD_HEIGHT,
    PLAYER_SPEED,
    PLAYER_DODGE_SPEED,
    PLAYER_DODGE_DURATION,
    PLAYER_DODGE_RECHARGE,
    PLAYER_SHIELD_REGEN,
    PLAYER_INVINCIBILITY_DURATION,
    BOUNDARY_PADDING,
    SHIELD_REGEN_COOLDOWN
} from './constants';


// this will create a new player with the default values
export function createPlayer(): Player {
    return {
        pos: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 }, // start player in center
        vel: { x: 0, y: 0 }, // start player with no velocity
        angle: -Math.PI / 2, // starts pointing upward (-90 degrees)
        health: PLAYER_MAX_HEALTH,
        shield: PLAYER_MAX_SHIELD,
        lives: PLAYER_START_LIVES,
        score: 0,
        dodgeCharges: PLAYER_DODGE_CHARGES,
        dodgeCooldown: 0,
        isDodging: false,
        dodgeTimer: 0,
        invincibleTimer: 0,
        isAlive: true,
        radius: PLAYER_RADIUS,
        shieldRegenCooldown: SHIELD_REGEN_COOLDOWN,
        previousShield: PLAYER_MAX_SHIELD,
    }
}

// update player will be called each frame (live movement, dodge ect)
export function updatePlayer(
    player: Player,
    input: InputState,
    dt: number): void {

    // invincibility
    if (player.invincibleTimer > 0) {
        player.invincibleTimer -= dt;
    }

    // START DODGE LOGIC ------------------------------
    if (player.isDodging) {
        player.dodgeTimer -= dt;
        if (player.dodgeTimer <= 0) {
            player.isDodging = false; // end dodge
        }
    }

    // trigger a new dodge
    if (input.dodge && !player.isDodging && player.dodgeCharges > 0) {
        player.isDodging = true;
        player.dodgeTimer = PLAYER_DODGE_DURATION;
        player.dodgeCharges -= 1;
        player.dodgeCooldown = PLAYER_DODGE_RECHARGE; // start recharge timer
    }


    // recharge dodge over time
    if (player.dodgeCharges < 3) {
        player.dodgeCooldown -= dt;

        if (player.dodgeCooldown <= 0) {
            player.dodgeCharges = Math.min(player.dodgeCharges + 1, 3); // recharge a dodge charge
            player.dodgeCooldown = player.dodgeCharges < 3 ? PLAYER_DODGE_RECHARGE : 0; // if we still need to recharge, reset cooldown
        }
    }
    // END DODGE LOGIC ------------------------------



    // START MOVEMENT LOGIC ------------------------------
    // const speed = player.isDodging ? PLAYER_DODGE_SPEED : PLAYER_SPEED;
    const acceleration: number = player.isDodging ? 1400 : 150;
    const maxSpeed: number = player.isDodging ? PLAYER_DODGE_SPEED : PLAYER_SPEED;
    const drag: number = 0.998;

    let dx: number = 0;
    let dy: number = 0;
    if (input.up) dy -= 0.5;
    if (input.down) dy += 0.5;
    if (input.left) dx -= 0.5;
    if (input.right) dx += 0.5;




    // Normalise diagonal movement so you don't go faster diagonally
    // Without normalisation: moving at 45° would be sqrt(2) ≈ 1.41x faster
    if (dx !== 0 && dy !== 0) {
        dx *= 0.7071; // 1/sqrt(2)
        dy *= 0.7071;
    }

    // player.vel.x = dx * speed;
    // player.vel.y = dy * speed;





    // update angle
    if (dx !== 0 || dy !== 0) {
        // player.angle = Math.atan2(dy, dx);  // atan2 gives angle from direction vector
        player.vel.x += dx * acceleration * dt;
        player.vel.y += dy * acceleration * dt;

        player.angle = Math.atan2(player.vel.y, player.vel.x) + Math.PI * 2; // point ship in direction of movement
    }

    // MAX SPEED LOGIC
    // const speed = Math.sqrt(player.vel.x * player.vel.x + player.vel.y * player.vel.y);
    // if (speed > maxSpeed) {
    //     player.vel.x = (player.vel.x / speed) * maxSpeed;
    //     player.vel.y = (player.vel.y / speed) * maxSpeed;
    // }
    // END MAX SPEED LOGIC

    // Apply velocity
    player.pos.x += player.vel.x * dt;
    player.pos.y += player.vel.y * dt;

    // END MOVEMENT LOGIC ------------------------------


    // START SHEILD REGEN LOGIC ------------------------------=
    if (player.shield < player.previousShield) {
        player.shieldRegenCooldown = SHIELD_REGEN_COOLDOWN; // reset cooldown on taking damage
    }

    if (player.shieldRegenCooldown > 0) {
        player.shieldRegenCooldown -= dt;
    }

    if (player.shieldRegenCooldown <= 0 && player.shield < PLAYER_MAX_SHIELD) {
        player.shield = Math.min(player.shield + PLAYER_SHIELD_REGEN * dt, PLAYER_MAX_SHIELD);
    }

    if (player.shield >= PLAYER_MAX_SHIELD) {
        player.shieldRegenCooldown = SHIELD_REGEN_COOLDOWN; // fully regenerated, no cooldown
    }

    player.previousShield = player.shield;
    // END SHEILD REGEN LOGIC ------------------------------


}



export function drawPlayer(
    ctx: CanvasRenderingContext2D,
    player: Player,
    screenX: number,
    screenY: number,
    zoom: number,
    input: InputState,
    dt: number
): void {
    ctx.save(); // save current transformation state

    // move screen to players position
    ctx.translate(screenX, screenY);

    // Rotate to match players angle (our 'nose' points up, so we add 90 degrees or PI/2 radians)
    ctx.rotate(player.angle + Math.PI / 2);



    // END SHIELD EFFECT ------------------------------

    // when something should suppress it temporarily

    // START INVINCIBILITY FLASH ------------------------------
    // const isVisible = player.invincibleTimer <= 0 || Math.floor(player.invincibleTimer * 8) % 2 === 0; // flash 8 times per second

    // if (isVisible) {
    //     ctx.restore(); // restore to before rotation so we can draw the ship upright
    //     return; // skip redrawing
    // }
    // END INVINCIBILITY FLASH ------------------------------

    const size: number = player.radius * 2.7 * zoom; // SHIP Size


    // moving velocity
    const isMoving: boolean =
        player.vel.x < -20 || player.vel.x > 20 ||
        player.vel.y > 20 || player.vel.y < -20;

    // reducing velocity (whilst keys are pressed)
    const isBraking: boolean =
        (input.up && player.vel.y > 20) ||
        (input.down && player.vel.y < -20) ||
        (input.left && player.vel.x > 20) ||
        (input.right && player.vel.x < -20);


    // if moving via input keys
    const isUserMoving: boolean = input.up || input.down || input.left || input.right;

    //const angleDiff = player.angle - prevFrameAngle;
    // angle diff but need to include dt to avoid frame rate issues (if frame rate drops, angle diff will be larger and could mess up the burner flames)
    const angleDiff: number = (player.angle - prevFrameAngle) / dt;

    const rotateComplex: { [key: string]: boolean } = {
        'right': angleDiff < -0.3,
        'left': angleDiff > 0.3
    }

    prevFrameAngle = player.angle;


    // if user is moving
    if (isUserMoving && !player.isDodging) {
        if (afterburnerPulse.isOn() && !isBraking) {
            thrusterSprite.draw(ctx, -size / 2, -size / 2.5, size, size);
        }

        ['left', 'right'].forEach((side: string) => {
            if (rotateComplex[side]) {
                if (oxygenBurnerPulse.isOn()) {
                    ctx.drawImage(oxygenBurnerMap['up'][side], -size / 2, -size / 2.5, size, size);
                }

                if (oxygenBurnerPulse2.isOn()) {
                    ctx.drawImage(oxygenBurnerMap['down'][side], -size / 2, -size / 2.5, size, size);
                }
            }
        });
    }

    if (isUserMoving && player.isDodging) {
        ctx.drawImage(afterburnerImage, -size / 2, -size / 2.5, size, size);

    }

    // START SHIP BODY ------------------------------
    if (player.health < 99) {
        ctx.drawImage(shipDamage1Image, -size / 2, -size / 2.5, size, size);
    }

    if (player.health > 99) {
        ctx.drawImage(shipImage, -size / 2, -size / 2.5, size, size);
    }

    ctx.restore();

    ctx.translate(screenX, screenY);

    if (player.shield > 1 && player.shield < 37) {
        shieldEmergencySprite.draw(ctx, -size / 1.5, -size / 1.5, size * 1.3, size * 1.3);
    }

    if (player.shield > 37 && player.shield < 99) {
        shieldSprite.draw(ctx, -size / 1.5, -size / 1.5, size * 1.3, size * 1.3);
    }

    if (player.shield >= 99) {
        ctx.drawImage(shieldImage, -size / 1.5, -size / 1.5, size * 1.3, size * 1.3);
    }

    ctx.restore();

    // END SHIP BODY ------------------------------
}


// check boundary
// loose life and respawn in center

export function checkBoundary(player: Player): boolean {
    const hitEdge: boolean =
        player.pos.x < BOUNDARY_PADDING ||
        player.pos.x > WORLD_WIDTH - BOUNDARY_PADDING ||
        player.pos.y < BOUNDARY_PADDING ||
        player.pos.y > WORLD_HEIGHT - BOUNDARY_PADDING;

    if (hitEdge) {
        loseLife(player);
        return true;
    }
    return false;
}

export function loseLife(player: Player): void {
    player.lives -= 1;

    // respawn at center
    player.pos.x = WORLD_WIDTH / 2;
    player.pos.y = WORLD_HEIGHT / 2;
    player.vel.x = 0;
    player.vel.y = 0;
    player.shield = 50;
    player.invincibleTimer = PLAYER_INVINCIBILITY_DURATION;

    if (player.lives <= 0) {
        player.isAlive = false;
    }
}