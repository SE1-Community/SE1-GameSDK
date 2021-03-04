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

808
%{
#include "StdH.h"
#include "Models/Items/ItemHolder/ItemHolder.h"
%}

uses "Entities/Item";
uses "Entities/Player";

// Power Up Type 
enum PowerUpItemType {
  0 PUIT_INVISIB  "Invisibility",
  1 PUIT_INVULNER "Invulnerability",
  2 PUIT_DAMAGE   "SeriousDamage",
  3 PUIT_SPEED    "SeriousSpeed",
  4 PUIT_BOMB     "SeriousBomb",
};

// Event for sending through receive item
event EPowerUp {
  enum PowerUpItemType puitType,
};

class CPowerUpItem : CItem {
name      "PowerUp Item";
thumbnail "Thumbnails\\PowerUpItem.tbn";

properties:
  1 enum PowerUpItemType m_puitType "Type" 'Y' = PUIT_INVULNER,

components:
  0 class CLASS_BASE "Classes\\Item.ecl",

// ********* INVISIBILITY *********
  1 model   MODEL_INVISIB  "ModelsMP\\Items\\PowerUps\\Invisibility\\Invisibility.mdl",

// ********* INVULNERABILITY *********
 10 model   MODEL_INVULNER "ModelsMP\\Items\\PowerUps\\Invulnerability\\Invulnerability.mdl",

// ********* SERIOUS DAMAGE *********
 20 model   MODEL_DAMAGE   "ModelsMP\\Items\\PowerUps\\SeriousDamage\\SeriousDamage.mdl",
 21 texture TEXTURE_DAMAGE "ModelsMP\\Items\\PowerUps\\SeriousDamage\\SeriousDamage.tex",

// ********* SERIOUS SPEED *********
 30 model   MODEL_SPEED   "ModelsMP\\Items\\PowerUps\\SeriousSpeed\\SeriousSpeed.mdl",
 31 texture TEXTURE_SPEED "ModelsMP\\Items\\PowerUps\\SeriousSpeed\\SeriousSpeed.tex",

// ********* SERIOUS BOMB *********
 40 model   MODEL_BOMB   "ModelsMP\\Items\\PowerUps\\SeriousBomb\\SeriousBomb.mdl",
 41 texture TEXTURE_BOMB "ModelsMP\\Items\\PowerUps\\SeriousBomb\\SeriousBomb.tex",

 // ********* MISC *********
 50 texture TEXTURE_SPECULAR_STRONG  "ModelsMP\\SpecularTextures\\Strong.tex",
 51 texture TEXTURE_SPECULAR_MEDIUM  "ModelsMP\\SpecularTextures\\Medium.tex",
 52 texture TEXTURE_REFLECTION_METAL "ModelsMP\\ReflectionTextures\\LightMetal01.tex",
 53 texture TEXTURE_REFLECTION_GOLD  "ModelsMP\\ReflectionTextures\\Gold01.tex",
 54 texture TEXTURE_REFLECTION_PUPLE "ModelsMP\\ReflectionTextures\\Purple01.tex",
 55 texture TEXTURE_FLARE "Models\\Items\\Flares\\Flare.tex",
 56 model   MODEL_FLARE   "Models\\Items\\Flares\\Flare.mdl",

// ************** SOUNDS **************
301 sound   SOUND_PICKUP   "SoundsMP\\Items\\PowerUp.wav",
305 sound   SOUND_BOMB     "SoundsMP\\Items\\SeriousBomb.wav",

functions:
  void Precache(void) {
    switch (m_puitType) {
      case PUIT_INVISIB:
      case PUIT_INVULNER:
      case PUIT_DAMAGE:
      case PUIT_SPEED:
        PrecacheSound(SOUND_PICKUP);
        break;

      case PUIT_BOMB:
        PrecacheSound(SOUND_BOMB);
        break;
    }
  }

  // Fill in entity statistics - for AI purposes only
  BOOL FillEntityStatistics(EntityStats *pes) {
    pes->es_strName = "PowerUp";
    pes->es_ctCount = 1;
    pes->es_ctAmmount = 1;
    pes->es_fValue = 0;
    pes->es_iScore = 0;

    switch (m_puitType) {
      case PUIT_INVISIB:  pes->es_strName += " invisibility"; break;
      case PUIT_INVULNER: pes->es_strName += " invulnerability"; break;
      case PUIT_DAMAGE:   pes->es_strName += " serious damage"; break;
      case PUIT_SPEED:    pes->es_strName += " serious speed"; break;
      case PUIT_BOMB:     pes->es_strName = "Serious Bomb!"; break;
    }

    return TRUE;
  }

  // Render particles
  void RenderParticles(void) {
    // no particles when not existing or in DM modes
    if (!CanRenderParticles()) {
      return;
    }

    switch (m_puitType) {
      case PUIT_INVISIB:  Particles_Stardust(this, 2.0f * 0.75f, 1.00f * 0.75f, PT_STAR08, 320); break;
      case PUIT_INVULNER: Particles_Stardust(this, 2.0f * 0.75f, 1.00f * 0.75f, PT_STAR08, 192); break;
      case PUIT_DAMAGE:   Particles_Stardust(this, 1.0f * 0.75f, 0.75f * 0.75f, PT_STAR08, 128); break;
      case PUIT_SPEED:    Particles_Stardust(this, 1.0f * 0.75f, 0.75f * 0.75f, PT_STAR08, 128); break;
      case PUIT_BOMB:     Particles_Atomic(this, 2.0f * 0.75f, 2.0f * 0.95f, PT_STAR05, 12); break;
    }
  }

  // Set properties depending on power up type
  void SetProperties(void) {
    StartModelAnim(ITEMHOLDER_ANIM_SMALLOSCILATION, AOF_LOOPING | AOF_NORESTART);
    ForceCollisionBoxIndexChange(ITEMHOLDER_COLLISION_BOX_BIG);

    switch (m_puitType) {
      case PUIT_INVISIB:
        SetRespawnTime(40.0f);
        m_strDescription.PrintF("Invisibility");

        AddItem(MODEL_INVISIB, TEXTURE_REFLECTION_METAL, 0, TEXTURE_SPECULAR_STRONG, 0); // set appearance
        AddFlare(MODEL_FLARE, TEXTURE_FLARE, FLOAT3D(0.0f, 0.2f, 0.0f), FLOAT3D(1.0f, 1.0f, 0.3f));  // add flare
        StretchItem(FLOAT3D(0.75f, 0.75f, 0.75));
        break;

      case PUIT_INVULNER:
        SetRespawnTime(60.0f);
        m_strDescription.PrintF("Invulnerability");

        AddItem(MODEL_INVULNER, TEXTURE_REFLECTION_GOLD, TEXTURE_REFLECTION_METAL, TEXTURE_SPECULAR_MEDIUM, 0); // set appearance
        AddFlare(MODEL_FLARE, TEXTURE_FLARE, FLOAT3D(0.0f, 0.2f, 0.0f), FLOAT3D(1.0f, 1.0f, 0.3f)); // add flare
        StretchItem(FLOAT3D(0.75f, 0.75f, 0.75));
        break;

      case PUIT_DAMAGE:
        SetRespawnTime(40.0f);
        m_strDescription.PrintF("SeriousDamage");

        AddItem(MODEL_DAMAGE, TEXTURE_DAMAGE, 0, TEXTURE_SPECULAR_STRONG, 0);           // set appearance
        AddFlare(MODEL_FLARE, TEXTURE_FLARE, FLOAT3D(0.0f, 0.2f, 0.0f), FLOAT3D(1.0f, 1.0f, 0.3f)); // add flare
        StretchItem(FLOAT3D(0.75f, 0.75f, 0.75));
        break;

      case PUIT_SPEED:
        SetRespawnTime(40.0f);
        m_strDescription.PrintF("SeriousSpeed");

        AddItem(MODEL_SPEED, TEXTURE_SPEED, 0, 0, 0); // set appearance
        AddFlare(MODEL_FLARE, TEXTURE_FLARE, FLOAT3D(0.0f, 0.2f, 0.0f), FLOAT3D(1.0f, 1.0f, 0.3f)); // add flare
        StretchItem(FLOAT3D(0.75f, 0.75f, 0.75));
        break;

      case PUIT_BOMB:
        SetRespawnTime(40.0f);
        m_strDescription.PrintF("Serious Bomb!");

        AddItem(MODEL_BOMB, TEXTURE_BOMB, 0, 0, 0); // set appearance
        AddFlare(MODEL_FLARE, TEXTURE_FLARE, FLOAT3D(0.0f, 0.2f, 0.0f), FLOAT3D(1.0f, 1.0f, 0.3f)); // add flare
        StretchItem(FLOAT3D(3.0f, 3.0f, 3.0));
        break;
    }
  };

procedures:
  ItemCollected(EPass epass) : CItem::ItemCollected {
    ASSERT(epass.penOther != NULL);
 
    // don't pick up more bombs then you can carry
    if (m_puitType == PUIT_BOMB) {
      if (IsOfClass(epass.penOther, "Player")) {
        if (((CPlayer &)*epass.penOther).m_iSeriousBombCount >= 3) {
          return;
        }
      }
    }

    BOOL bOnce = (m_bPickupOnce || m_bRespawn);

    if (!bOnce) {
      // if already picked by this player
      BOOL bWasPicked = MarkPickedBy(epass.penOther);

      if (bWasPicked) {
        // don't pick again
        return;
      }
    }

    // send powerup to entity
    EPowerUp ePowerUp;
    ePowerUp.puitType = m_puitType;

    // if powerup is received
    if (epass.penOther->ReceiveItem(ePowerUp)) {
      if (_pNetwork->IsPlayerLocal(epass.penOther)) {
        switch (m_puitType) {
          case PUIT_INVISIB:  IFeel_PlayEffect("PU_Invulnerability"); break;
          case PUIT_INVULNER: IFeel_PlayEffect("PU_Invulnerability"); break;
          case PUIT_DAMAGE:   IFeel_PlayEffect("PU_Invulnerability"); break;
          case PUIT_SPEED:    IFeel_PlayEffect("PU_FastShoes"); break; 
          case PUIT_BOMB:     IFeel_PlayEffect("PU_SeriousBomb"); break; 
        }
      }
      
      // play the pickup sound
      m_soPick.Set3DParameters( 50.0f, 1.0f, 2.0f, 1.0f);

      if (m_puitType == PUIT_BOMB) {
        PlaySound(m_soPick, SOUND_BOMB, SOF_3D);
        m_fPickSoundLen = GetSoundLength(SOUND_BOMB);

      } else if (TRUE) {
        PlaySound(m_soPick, SOUND_PICKUP, SOF_3D);
        m_fPickSoundLen = GetSoundLength(SOUND_PICKUP);
      }

      if (bOnce) {
        jump CItem::ItemReceived();
      }
    }

    return;
  };

  // Entry point
  Main() {
    Initialize(); // initialize base class
    SetProperties(); // set properties

    jump CItem::ItemLoop();
  };
};
