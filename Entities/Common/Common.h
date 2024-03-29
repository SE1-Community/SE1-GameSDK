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

// Brush surface types
#define SURFACE_SAND           9
#define SURFACE_WATER          12
#define SURFACE_RED_SAND       13
#define SURFACE_GRASS          17
#define SURFACE_GRASS_SLIDING  19
#define SURFACE_GRASS_NOIMPACT 20
#define SURFACE_WOOD           18
#define SURFACE_SNOW           21

// Max ammo
#define MAX_BULLETS     INDEX(500)
#define MAX_SHELLS      INDEX(100)
#define MAX_ROCKETS     INDEX(50)
#define MAX_GRENADES    INDEX(50)
#define MAX_NAPALM      INDEX(500)
#define MAX_ELECTRICITY INDEX(400)
#define MAX_IRONBALLS   INDEX(30)
//#define MAX_NUKEBALLS INDEX(3)
#define MAX_SNIPERBULLETS INDEX(50)

// Bit shifters for ammo
#define AMMO_BULLETS     0
#define AMMO_SHELLS      1
#define AMMO_ROCKETS     2
#define AMMO_GRENADES    3
#define AMMO_NAPALM      4
#define AMMO_ELECTRICITY 5
//#define AMMO_NUKEBALLS   6
#define AMMO_IRONBALLS     7
#define AMMO_SNIPERBULLETS 8

#define BLOOD_SPILL_RED   RGBAToColor(250, 20, 20, 255)
#define BLOOD_SPILL_GREEN RGBAToColor(0, 250, 0, 255)

// Ammo mana Value
#define AV_SHELLS      INDEX(70)
#define AV_BULLETS     INDEX(10)
#define AV_ROCKETS     INDEX(150)
#define AV_GRENADES    INDEX(150)
#define AV_ELECTRICITY INDEX(250)
#define AV_IRONBALLS   INDEX(700)
//#define AV_NUKEBALLS      INDEX(1800)
#define AV_NAPALM        INDEX(200)
#define AV_SNIPERBULLETS INDEX(200)

// used for invisibility powerup
#define INVISIBILITY_ALPHA_LOCAL  0x55
#define INVISIBILITY_ALPHA_REMOTE 0x11

enum EmptyShellType {
  ESL_BULLET = 0,
  ESL_SHOTGUN = 1,
  ESL_BUBBLE = 2,
  ESL_BULLET_SMOKE = 3,
  ESL_SHOTGUN_SMOKE = 4,
  ESL_COLT_SMOKE = 5,
};

// Empty shell launch info
#define MAX_FLYING_SHELLS 32
struct ShellLaunchData {
  FLOAT sld_fSize; // size multiplier
  FLOAT3D sld_vPos; // launch position
  FLOAT3D sld_vSpeed; // launch speed
  FLOAT3D sld_vUp; // up vector in moment of launch
  FLOAT sld_tmLaunch; // time of launch
  EmptyShellType sld_estType; // shell type
};

#define ShellLaunchData_array m_asldData[MAX_FLYING_SHELLS]

// Player bullet spray fx list
#define MAX_BULLET_SPRAYS 32
struct BulletSprayLaunchData {
  INDEX bsld_iRndBase; // random base
  FLOAT3D bsld_vPos; // launch position
  FLOAT3D bsld_vG; // gravity vector
  EffectParticlesType bsld_eptType; // type
  FLOAT bsld_tmLaunch; // time of launch
  FLOAT3D bsld_vStretch; // stretch
};

#define BulletSprayLaunchData_array m_absldData[MAX_BULLET_SPRAYS]

#define MAX_GORE_SPRAYS 32
struct GoreSprayLaunchData {
  FLOAT3D gsld_vPos; // launch position
  FLOAT3D gsld_v3rdPos; // launch position for 3rd perspective
  FLOAT3D gsld_vG; // gravity vector
  FLOAT gsld_fGA; // gravity strength
  SprayParticlesType gsld_sptType; // type
  FLOATaabbox3D gsld_boxHitted; // box of hitted object
  FLOAT3D gsld_vSpilDirection; // spill direction
  FLOAT gsld_fDamagePower; // damage power
  FLOAT gsld_tmLaunch; // time of launch
  COLOR gsld_colParticles; // color of particles
};

#define GoreSprayLaunchData_array m_agsldData[MAX_GORE_SPRAYS]

// World change
struct WorldChange {
  CTString strGroup; // group name
  CPlacement3D plLink; // link placement for relative change
  INDEX iType; // change type
};

extern struct WorldChange _SwcWorldChange;

// Entity info
struct EntityInfo {
  EntityInfoBodyType Eeibt; // body type
  FLOAT fMass; // mass (in kg)
  FLOAT vSourceCenter[3]; // body point (offset from handle) when entity look another entity
  FLOAT vTargetCenter[3]; // body point (offset from handle) when entity is target of look
};

// Entity info
struct EntityStats {
  CTString es_strName;
  INDEX es_ctCount;
  INDEX es_ctAmount;
  FLOAT es_fValue;
  INDEX es_iScore;
};

// Statistics data for player stats management
struct DECL_DLL PlayerStats {
  INDEX ps_iScore;
  INDEX ps_iKills;
  INDEX ps_iDeaths;
  INDEX ps_iSecrets;
  TIME ps_tmTime;

  PlayerStats(void) {
    ps_iScore = 0;
    ps_iKills = 0;
    ps_iDeaths = 0;
    ps_iSecrets = 0;
    ps_tmTime = 0.0f;
  }
};

// Get info position for entity
DECL_DLL void GetEntityInfoPosition(CEntity *pen, FLOAT *pf, FLOAT3D &vPos);

// Get source and target positions for ray cast
DECL_DLL void GetPositionCastRay(CEntity *penSource, CEntity *penTarget, FLOAT3D &vSource, FLOAT3D &vTarget);

// Set bool from bool enum type
DECL_DLL void SetBoolFromBoolEType(BOOL &bSet, BoolEType bet);

// Send event to target
DECL_DLL void SendToTarget(CEntity *penSendEvent, EEventType eetEventType, CEntity *penCaused = NULL);

// Send event in range
DECL_DLL void SendInRange(CEntity *penSource, EEventType eetEventType, const FLOATaabbox3D &boxRange);

// Spawn reminder
DECL_DLL CEntityPointer SpawnReminder(CEntity *penOwner, FLOAT fWaitTime, INDEX iValue);

// Spawn flame
DECL_DLL CEntityPointer SpawnFlame(CEntity *penOwner, CEntity *penAttach, const FLOAT3D &vSource);

// Set components
DECL_DLL void SetComponents(CEntity *pen, CModelObject &mo, ULONG ulIDModel, ULONG ulIDTexture, ULONG ulIDReflectionTexture,
                            ULONG ulIDSpecularTexture, ULONG ulIDBumpTexture);
// Add attachment to model
DECL_DLL void AddAttachmentToModel(CEntity *pen, CModelObject &mo, INDEX iAttachment, ULONG ulIDModel, ULONG ulIDTexture,
                                   ULONG ulIDReflectionTexture, ULONG ulIDSpecularTexture, ULONG ulIDBumpTexture);
// Remove attachment from model
DECL_DLL void RemoveAttachmentFromModel(CModelObject &mo, INDEX iAttachment);

// Kick entity
DECL_DLL void KickEntity(CEntity *penTarget, FLOAT3D vSpeed);

// Lens flare variables
extern CLensFlareType _lftStandard;
extern CLensFlareType _lftStandardReflections;
extern CLensFlareType _lftYellowStarRedRing;
extern CLensFlareType _lftYellowStarRedRingFar;
extern CLensFlareType _lftWhiteGlowStarRedRing;
extern CLensFlareType _lftWhiteGlowStar;
extern CLensFlareType _lftWhiteGlowStarNG;
extern CLensFlareType _lftWhiteStarRedRingStreaks;
extern CLensFlareType _lftWhiteStarRedReflections;
extern CLensFlareType _lftBlueStarBlueReflections;
extern CLensFlareType _lftProjectileStarGlow;
extern CLensFlareType _lftProjectileWhiteBubbleGlow;
extern CLensFlareType _lftProjectileYellowBubbleGlow;
extern CLensFlareType _lftPVSpaceShipWindowFlare;
extern CLensFlareType _lftCatmanFireGlow;
extern CLensFlareType _lftWhiteGlowFar;

// Init lens flare effects
void InitLensFlares(void);

// Close lens flares effects
void CloseLensFlares(void);

DECL_DLL BOOL SetPlayerAppearanceCfunc(void *pArgs);
DECL_DLL BOOL SetPlayerAppearance(CModelObject *mo, CPlayerCharacter *ppc, CTString &strName, BOOL bPreview);

// Debugging functions
DECL_DLL const char *PrintConsole(void);
DECL_DLL const char *PrintStack(CEntity *pen);

// Debris spawning
DECL_DLL void Debris_Begin(EntityInfoBodyType Eeibt, enum DebrisParticlesType dptParticles, enum BasicEffectType betStain,
                           FLOAT fEntitySize, // entity size in meters
                           const FLOAT3D &vSpeed,
                           const FLOAT3D &vSpawnerSpeed, // how fast was the entity moving
                           const FLOAT fConeSize, // size multiplier for debris cone
                           const FLOAT fSpeedUp, // size multiplier for debris catapulting up (0-no multiply)
                           const COLOR colDebris = C_WHITE // multiply color
);

DECL_DLL CEntityPointer Debris_Spawn(CEntity *penSpawner, CEntity *penComponents, SLONG idModelComponent,
                                     SLONG idTextureComponent, SLONG idReflectionTextureComponent,
                                     SLONG idSpecularTextureComponent, SLONG idBumpTextureComponent, INDEX iModelAnim,
                                     FLOAT fSize, // size relative to entity size (or 0 for absolute stretch of 1)
                                     const FLOAT3D &vPosRatio);

DECL_DLL CEntityPointer Debris_Spawn_Independent(CEntity *penSpawner, CEntity *penComponents, SLONG idModelComponent,
                                                 SLONG idTextureComponent, SLONG idReflectionTextureComponent,
                                                 SLONG idSpecularTextureComponent, SLONG idBumpTextureComponent, INDEX iModelAnim,
                                                 FLOAT fSize, CPlacement3D plAbsolutePlacement, FLOAT3D vTranslation,
                                                 ANGLE3D aRotation);

DECL_DLL CEntityPointer Debris_Spawn_Template(EntityInfoBodyType eibt, enum DebrisParticlesType dptParticles,
                                              enum BasicEffectType betStain, class CModelHolder2 *penmhDestroyed,
                                              CEntity *penComponents, class CModelHolder2 *penmh2, FLOAT3D vStretch, FLOAT fSize,
                                              CPlacement3D plAbsolutePlacement, FLOAT3D vLaunchSpeed, ANGLE3D aRotSpeed,
                                              BOOL bDebrisImmaterialASAP, FLOAT fDustStretch, COLOR colBurning);

// Get default entity info for given body type
DECL_DLL EntityInfo *GetStdEntityInfo(EntityInfoBodyType eibt);

// Damage control functions
DECL_DLL FLOAT DamageStrength(EntityInfoBodyType eibtBody, INDEX dtDamage);

// Print center screen message
DECL_DLL void PrintCenterMessage(CEntity *penThis, CEntity *penTarget, const CTString &strMessage, TIME tmLength,
                                 enum MessageSound mssSound);

// Get name of a key item
DECL_DLL const char *GetKeyName(enum KeyItemType kit);

// Get session properties
DECL_DLL inline const CSessionProperties *GetSP(void) {
  return (const CSessionProperties *)_pNetwork->GetSessionProperties();
}

// Weapon sound when firing or exploding
DECL_DLL void SpawnRangeSound(CEntity *penPlayer, CEntity *penPos, enum SoundType st, FLOAT fRange);

// Get some player for trigger source if any is existing
DECL_DLL CEntity *FixupCausedToPlayer(CEntity *penThis, CEntity *penCaused, BOOL bWarning = TRUE);

// Precisely lerp between two placement using quaternions
DECL_DLL CPlacement3D LerpPlacementsPrecise(const CPlacement3D &pl0, const CPlacement3D &pl1, FLOAT fRatio);

// Obtain game extra damage per enemy and per player
DECL_DLL FLOAT GetGameDamageMultiplier(void);

// Get entity's serious damage multiplier
DECL_DLL FLOAT GetSeriousDamageMultiplier(CEntity *pen);

// Get current world settings controller
DECL_DLL class CWorldSettingsController *GetWSC(CEntity *pen);

// Helper functions

// Distance between two entities
DECL_DLL inline FLOAT DistanceTo(CEntity *penE1, CEntity *penE2) {
  return (penE1->GetPlacement().pl_PositionVector - penE2->GetPlacement().pl_PositionVector).Length();
}

BulletHitType GetBulletHitTypeForSurface(INDEX iSurfaceType);
EffectParticlesType GetParticleEffectTypeForSurface(INDEX iSurfaceType);

// Spawn effect from hit type
void SpawnHitTypeEffect(CEntity *pen, enum BulletHitType bhtType, BOOL bSound, FLOAT3D vHitNormal, FLOAT3D vHitPoint,
                        FLOAT3D vIncommingBulletDir, FLOAT3D vDistance);

#define FRndIn(a, b) (a + FRnd() * (b - a))
