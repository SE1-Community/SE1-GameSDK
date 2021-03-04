/* Copyright (c) 2002-2012 Croteam Ltd.
This program is free software; you can redistribute it and/or modify
it under the terms of version 2 of the GNU General Public License as published by
the Free Software Foundation


This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA. */

0
%{
#include "StdH.h"
%}

// Don't instantiate this class

// Stop actions
event EStop {};

// Start actions       
event EStart {
  CEntityPointer penCaused, // who caused the trigger (transitive)
};

// Activate class
event EActivate {};

// Deactivate class
event EDeactivate {};

// Activate environment classes
event EEnvironmentStart {};

// Deactivate environment classes
event EEnvironmentStop {};

// General purpose end of procedure event
event EEnd {};

// Trigger some action
event ETrigger {
  CEntityPointer penCaused,   // who caused the trigger (transitive)
};

// Teleport moving brush
event ETeleportMovingBrush {};

// Reminder event
event EReminder {
  INDEX iValue, // value for return
};

// Start attacking (obsolete)
event EStartAttack {};

// Stop attacking (obsolete)
event EStopAttack {};

// Make enemy not blind anymore
event EStopBlindness {};

// Make enemy not deaf anymore
event EStopDeafness {};

// Send score to a player
event EReceiveScore {
  INDEX iPoints
};

// Enemy is killed
event EKilledEnemy {};

// Found secret
event ESecretFound {};

// [Cecil] 2021-02-28: Moved from the engine
enum EDamageType {
   0 DMT_NONE         "No damage",   // internal
   1 DMT_EXPLOSION    "Explosion",   // caused by dynamites, rockets and other ordinary explosives
   2 DMT_PROJECTILE   "Projectile",  // caused by projectile (non exploding)
   3 DMT_CLOSERANGE   "Close range", // caused by close range weapon (chainsaw, head-saw, ...)
   4 DMT_BULLET       "Bullets",     // caused by ordinary bullets from pistols, rifles etc.
   5 DMT_DROWNING     "Drowning",    // caused by being without air for too long
   6 DMT_IMPACT       "Impact",      // caused by impact with some object at high relative velocity
   7 DMT_BRUSH        "Brush",       // caused by moving brush
   8 DMT_BURNING      "Burning",     // caused by being burned by fire or lava
   9 DMT_ACID         "Acid",        // caused by being burned by acid
  10 DMT_TELEPORT     "Teleport",    // applied to entities in teleport destination
  11 DMT_FREEZING     "Freezing",    // caused by freezing in cold water
  12 DMT_CANNONBALL   "Cannon ball", // caused by cannon ball
  13 DMT_CB_EXPLOSION "Cannon ball explosion", // when cannonball explodes
  14 DMT_SPIKESTAB    "Spike stab",  // stabbed by spikes (usually content type)
  15 DMT_ABYSS        "Abyss",       // when someone falls off a high ledge into the void
  16 DMT_HEAT         "Heat",        // walking under open sun too long
  17 DMT_DAMAGER      "Damager",     // caused by damager
  18 DMT_CHAINSAW     "Chainsaw",    // caused by chainsaw
};

// Boolean property values
enum BoolEType {
  0 BET_TRUE   "True",   // true
  1 BET_FALSE  "False",  // false
  2 BET_IGNORE "Ignore", // ignore
};

// Trigger event type
enum EEventType {
  0 EET_START            "Start event",             // start event
  1 EET_STOP             "Stop event",              // stop event
  2 EET_TRIGGER          "Trigger event",           // trigger event
  3 EET_IGNORE           "Don't send event",        // don't send event (ignore)
  4 EET_ACTIVATE         "Activate event",          // activate event
  5 EET_DEACTIVATE       "Deactivate event",        // deactivate event
  6 EET_ENVIRONMENTSTART "Start environment event", // start environment event
  7 EET_ENVIRONMENTSTOP  "Stop environment event",  // stop environment event
  8 EET_STARTATTACK      "[obsolete] Start attack event", // start attack enemy
  9 EET_STOPATTACK       "[obsolete] Stop attack event",  // stop attack enemy
 10 EET_STOPBLINDNESS    "Stop blindness event",  // enemy stop being blind
 11 EET_STOPDEAFNESS     "Stop deafness event",   // enemy stop being deaf
 12 EET_TELEPORTMB       "Teleport moving brush", // moving brush teleporting event
};

// Entity info structure enums
enum EntityInfoBodyType {
  1 EIBT_FLESH  "Flesh",
  2 EIBT_WATER  "Water",
  3 EIBT_ROCK   "Rock",
  4 EIBT_FIRE   "Fire",
  5 EIBT_AIR    "Air",
  6 EIBT_BONES  "Bones",
  7 EIBT_WOOD   "Wood",
  8 EIBT_METAL  "Metal",
  9 EIBT_ROBOT  "Robot",
 10 EIBT_ICE    "Ice",
};

// Center message sound
enum MessageSound {
  0 MSS_NONE "None", // no sound
  1 MSS_INFO "Info", // just simple info
};

// Particles texture
enum ParticleTexture {
   1 PT_STAR01    "Star01",
   2 PT_STAR02    "Star02",
   3 PT_STAR03    "Star03",
   4 PT_STAR04    "Star04",
   5 PT_STAR05    "Star05",
   6 PT_STAR06    "Star06",
   7 PT_STAR07    "Star07",
   8 PT_STAR08    "Star08",
   9 PT_BOUBBLE01 "Boubble01",
  10 PT_BOUBBLE02 "Boubble02",
  11 PT_WATER01   "Water01",
  12 PT_WATER02   "Water02",
  13 PT_SANDFLOW  "Sand flow",
  14 PT_WATERFLOW "Water flow",
  15 PT_LAVAFLOW  "Lava flow",
};

// Sound notification type
enum SoundType {
  0 SNDT_NONE      "None",         // internal
  1 SNDT_SHOUT     "Enemy notify", // enemy shout when see player
  2 SNDT_YELL      "Enemy yell",   // enemy is wounded (or death)
  3 SNDT_EXPLOSION "Explosion",    // explosion of rocket or grenade (or similar)
  4 SNDT_PLAYER    "Player sound", // sound from player weapon or player is wounded
};

// Bullet hits
enum BulletHitType {
  0 BHT_NONE              "None",       // none
  1 BHT_FLESH             "Flesh",      // flesh
  2 BHT_BRUSH_STONE       "Stone",      // brush stone
  3 BHT_BRUSH_SAND        "Sand",       // brush sand
  4 BHT_BRUSH_WATER       "Water",      // brush water
  5 BHT_BRUSH_UNDER_WATER "Underwater", // brush under water
  6 BHT_ACID              "Acid",       // acid
  7 BHT_BRUSH_RED_SAND    "Red sand",   // brush red sand
  8 BHT_BRUSH_GRASS       "Grass",      // brush grass
  9 BHT_BRUSH_WOOD        "Wood",       // brush wood
 10 BHT_BRUSH_SNOW        "Snow",       // brush snow
};

// Effect particles
enum EffectParticlesType {
  0 EPT_NONE               "None",       // no partcicles
  1 EPT_BULLET_STONE       "Stone",      // bullet particles on stone
  2 EPT_BULLET_SAND        "Sand",       // bullet particles on sand
  3 EPT_BULLET_WATER       "Water",      // bullet particles on water
  4 EPT_BULLET_UNDER_WATER "Underwater", // bullet particles underwater
  5 EPT_BULLET_RED_SAND    "Red sand",   // bullet particles on red sand
  6 EPT_BULLET_GRASS       "Grass",      // bullet particles on sand
  7 EPT_BULLET_WOOD        "Wood",       // bullet particles on sand
  8 EPT_BULLET_SNOW        "Snow",       // bullet particles on snow
};

// Spray particles
enum SprayParticlesType {
  0 SPT_NONE         "None",              // no particles
  1 SPT_BLOOD        "Blood",             // blood
  2 SPT_BONES        "Bones",             // bones
  3 SPT_FEATHER      "Feather",           // feather
  4 SPT_STONES       "Stones",            // stones
  5 SPT_WOOD         "Wood",              // wood
  6 SPT_SLIME        "Slime",             // gizmo/beast slime
  7 SPT_LAVA         "Lava Stones",       // lava stones
  8 SPT_SPARKS_BLOOD "Sparks w/ blood",   // electricity sparks with blood
  9 SPT_BEAST_BALL   "Beast projectile",  // beast projectile explosion sparks
 10 SPT_SMALL_LAVA   "Small Lava Stones", // small lava stones
 11 SPT_AIRSPOUTS    "Air",               // air
 12 SPT_SPARKS       "Sparks",            // no blood electricity
 13 SPT_PLASMA       "Plasma",            // plasma
 14 SPT_GOO          "Goo",               // yellow bloodlike substance
 15 SPT_TREE01       "Tree 01",           // tree 01
 16 SPT_COLOREDSTONE "Colored stone",     // colored stone
};

// Clasification bits
enum ClasificationBits {
 16 CB_00 "Bit 16",
 17 CB_01 "Bit 17",
 18 CB_02 "Bit 18",
 19 CB_03 "Bit 19",
 20 CB_04 "Bit 20",
 21 CB_05 "Bit 21",
 22 CB_06 "Bit 22",
 23 CB_07 "Bit 23",
 24 CB_08 "Bit 24",
 25 CB_09 "Bit 25",
 26 CB_10 "Bit 26",
 27 CB_11 "Bit 27",
 28 CB_12 "Bit 28",
 29 CB_13 "Bit 29",
 30 CB_14 "Bit 30",
 31 CB_15 "Bit 31",
};

// Visibility bits
enum VisibilityBits {
  0 VB_00 "Bit 00",
  1 VB_01 "Bit 01",
  2 VB_02 "Bit 02",
  3 VB_03 "Bit 03",
  4 VB_04 "Bit 04",
  5 VB_05 "Bit 05",
  6 VB_06 "Bit 06",
  7 VB_07 "Bit 07",
  8 VB_08 "Bit 08",
  9 VB_09 "Bit 09",
 10 VB_10 "Bit 10",
 11 VB_11 "Bit 11",
 12 VB_12 "Bit 12",
 13 VB_13 "Bit 13",
 14 VB_14 "Bit 14",
 15 VB_15 "Bit 15",
};

event ESound {
  enum SoundType EsndtSound,
  CEntityPointer penTarget,
};

event EScroll {
  BOOL bStart,
  CEntityPointer penSender,
};

event ETextFX {
  BOOL bStart,
  CEntityPointer penSender,
};

event EHudPicFX {
  BOOL bStart,
  CEntityPointer penSender,
};

event ECredits {
  BOOL bStart,
  CEntityPointer penSender,
};

// Event for printing centered message
event ECenterMessage {
  CTString strMessage, // the message
  TIME tmLength, // how long to keep it
  enum MessageSound mssSound, // sound to play
};

// Event for sending computer message to a player
event EComputerMessage {
  CTFileName fnmMessage, // the message file
};

// Event for voice message to a player
event EVoiceMessage {
  CTFileName fnmMessage, // the message file
};

event EHitBySpaceShipBeam {};

class CGlobal : CEntity {
name      "";
thumbnail "";

properties:

components:

functions:

procedures:
  // Entry point
  Main() {
    ASSERTALWAYS("DON'T INSTANTIATE THIS CLASS");
  }
};
