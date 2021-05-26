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

405
%{
#include "StdH.h"

#define EPF_MODEL_SHELL (EPF_ONBLOCK_BOUNCE | EPF_TRANSLATEDBYGRAVITY | EPF_MOVABLE)
#define ECF_MODEL_SHELL (((ECBI_BRUSH | ECBI_MODEL_HOLDER) << ECB_TEST) | ((ECBI_CORPSE) << ECB_IS))
%}

uses "Entities/Player";

enum WeaponEffectType {
  0 WET_SHOTGUNSHELL    "Shotgun",    // shotgun shell
  1 WET_MACHINEGUNSHELL "Machinegun", // machinegun shell
};

// Input parameter for weapon effect
event EWeaponEffectInit {
  CEntityPointer penOwner, // who owns it
  enum WeaponEffectType EwetEffect, // effect type
};

%{
void CPlayerWeaponsEffects_Precache(void) {
  CDLLEntityClass *pdec = &CPlayerWeaponsEffects_DLLClass;

  pdec->PrecacheModel(MODEL_SG_SHELL);
  pdec->PrecacheTexture(TEXTURE_SG_SHELL);
  pdec->PrecacheModel(MODEL_MG_SHELL);
  pdec->PrecacheTexture(TEXTURE_MG_SHELL);
}
%}

// [Cecil] NOTE: Obsolete class
class CPlayerWeaponsEffects : CMovableEntity {
name      "Player Weapons Effects";
thumbnail "";
features  "CanBePredictable";

properties:
  1 CEntityPointer m_penOwner, // class which owns it
  2 enum WeaponEffectType m_EwetEffect = WET_SHOTGUNSHELL, // weapon effect type

components:
  1 model   MODEL_SG_SHELL   "Models\\Weapons\\SingleShotgun\\Shell\\Shell.mdl",
  2 texture TEXTURE_SG_SHELL "Models\\Weapons\\SingleShotgun\\Shell\\Shell.tex",

  3 model   MODEL_MG_SHELL   "Models\\Weapons\\Minigun\\Shell\\Shell.mdl",
  4 texture TEXTURE_MG_SHELL "Models\\Weapons\\Minigun\\Shell\\Shell.tex",

functions:

procedures:
  ShotgunShell(EVoid) {
    // set appearance
    SetModel(MODEL_SG_SHELL);
    SetModelMainTexture(TEXTURE_SG_SHELL);

    GetModelObject()->StretchModel(FLOAT3D(0.5f, 0.5f, 0.5f));
    ModelChangeNotify();

    // speed
    LaunchAsFreeProjectile(FLOAT3D(FRnd() + 2.0f, FRnd() + 5.0f, -FRnd() - 2.0f), (CMovableEntity*)&*m_penOwner);

    // wait a while
    autowait(1.5f);

    return EEnd();
  };

  MachinegunShell(EVoid) {
    // set appearance
    SetModel(MODEL_MG_SHELL);
    SetModelMainTexture(TEXTURE_MG_SHELL);

    GetModelObject()->StretchModel(FLOAT3D(0.5f, 0.5f, 0.5f));
    ModelChangeNotify();

    // speed
    LaunchAsFreeProjectile(FLOAT3D(FRnd() + 2.0f, FRnd() + 5.0f, -FRnd() - 2.0f), (CMovableEntity*)&*m_penOwner);

    // wait a while
    autowait(0.5f);

    return EEnd();
  };

  // Entry point
  Main(EWeaponEffectInit eInit) {
    ASSERT(eInit.penOwner != NULL);
    
    // remember the initial parameters
    m_penOwner = eInit.penOwner;
    m_EwetEffect = eInit.EwetEffect;

    SetFlags(GetFlags() | ENF_SEETHROUGH);
    SetPredictable(TRUE);

    // init as model
    InitAsModel();
    SetPhysicsFlags(EPF_MODEL_SHELL);
    SetCollisionFlags(ECF_MODEL_SHELL);

    if (m_EwetEffect == WET_SHOTGUNSHELL) {
      autocall ShotgunShell() EEnd;

    } else if (m_EwetEffect == WET_MACHINEGUNSHELL) {
      autocall MachinegunShell() EEnd;

    } else {
      ASSERTALWAYS("Uknown weapon effect type");
    }

    // cease to exist
    Destroy();

    return;
  };
};
