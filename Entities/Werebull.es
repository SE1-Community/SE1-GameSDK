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

307
%{
#include "StdH.h"
#include "Models/Enemies/Werebull/Werebull.h"
%}

uses "Entities/EnemyBase";
uses "Entities/EnemyRunInto";

enum BullChar {
  0 BUC_SUMMER "Summer",
  1 BUC_WINTER "Winter",
};

%{
// Info structure
static EntityInfo eiWerebull = {
  EIBT_FLESH, 500.0f,
  0.0f, 3.0f, 0.0f, // source (eyes)
  0.0f, 1.5f, 0.0f, // target (body)
};

#define HIT_DISTANCE 5.0f
%}

class CWerebull : CEnemyRunInto {
name      "Werebull";
thumbnail "Thumbnails\\Werebull.tbn";

properties:
  1 BOOL m_bRunAttack = FALSE,       // run attack (attack local)
  2 BOOL m_bHornHit = FALSE,         // close attack local
  3 CEntityPointer m_penLastTouched, // last touched
  4 CSoundObject m_soFeet,           // for running sound
  5 BOOL m_bRunSoundPlaying = FALSE,
  //6 enum BullChar m_bcChar "Character" 'C' = BUC_SUMMER, // character
  
components:
  0 class   CLASS_BASE     "Classes\\EnemyRunInto.ecl",
  1 model   MODEL_WEREBULL "Models\\Enemies\\Werebull\\Werebull.mdl",
  2 texture TEXTURE_WEREBULL_SUMMER "Models\\Enemies\\Werebull\\Werebull.tex",
  //3 texture TEXTURE_WEREBULL_WINTER "Models\\Enemies\\Werebull\\Werebull2.tex",

// ************** SOUNDS **************
 50 sound SOUND_IDLE     "Models\\Enemies\\Werebull\\Sounds\\Idle.wav",
 51 sound SOUND_SIGHT    "Models\\Enemies\\Werebull\\Sounds\\Sight.wav",
 53 sound SOUND_KICKHORN "Models\\Enemies\\Werebull\\Sounds\\KickHorn.wav",
 54 sound SOUND_IMPACT   "Models\\Enemies\\Werebull\\Sounds\\Impact.wav",
 55 sound SOUND_DEATH    "Models\\Enemies\\Werebull\\Sounds\\Death.wav",
 56 sound SOUND_RUN      "Models\\Enemies\\Werebull\\Sounds\\Run.wav",

functions:
  // Describe how this enemy killed player
  virtual CTString GetPlayerKillDescription(const CTString &strPlayerName, const EDeath &eDeath) {
    CTString str;
    str.PrintF(TRANS("Sirian werebull sent %s flying"), strPlayerName);

    return str;
  }

  void Precache(void) {
    CEnemyBase::Precache();

    PrecacheSound(SOUND_IDLE);
    PrecacheSound(SOUND_SIGHT);
    PrecacheSound(SOUND_KICKHORN);
    PrecacheSound(SOUND_IMPACT);
    PrecacheSound(SOUND_DEATH);
    PrecacheSound(SOUND_RUN);
  };

  // Entity info
  void *GetEntityInfo(void) {
    return &eiWerebull;
  };

  FLOAT GetCrushHealth(void) {
    return 60.0f;
  }

  virtual const CTFileName &GetComputerMessageName(void) const {
    static DECLARE_CTFILENAME(fnm, "Data\\Messages\\Enemies\\Bull.txt");
    return fnm;
  };

  // Render particles
  void RenderParticles(void) {
    Particles_RunningDust(this);

    CEnemyBase::RenderParticles();
  }

  // Receive damage
  void ReceiveDamage(CEntity *penInflictor, INDEX dmtType, FLOAT fDamage, const FLOAT3D &vHitPoint, const FLOAT3D &vDirection) {
    // werebull can't harm werebull
    if (!IsOfClass(penInflictor, "Werebull")) {
      CEnemyBase::ReceiveDamage(penInflictor, dmtType, fDamage, vHitPoint, vDirection);
    }
  };

  void AdjustDifficulty(void) {
    // bull must not change its speed at different difficulties
  }

  // Death
  INDEX AnimForDeath(void) {
    INDEX iAnim;

    if (en_vCurrentTranslationAbsolute.Length() > 5.0f) {
      iAnim = WEREBULL_ANIM_DEATHRUN;
    } else {
      iAnim = WEREBULL_ANIM_DEATH;
    }

    StartModelAnim(iAnim, 0);
    DeactivateRunningSound();

    return iAnim;
  };

  FLOAT WaitForDust(FLOAT3D &vStretch) {
    if (GetModelObject()->GetAnim() == WEREBULL_ANIM_DEATHRUN) {
      vStretch = FLOAT3D(1, 1, 2) * 2.0f;
      return 0.6f;

    } else if (GetModelObject()->GetAnim() == WEREBULL_ANIM_DEATH) {
      vStretch = FLOAT3D(1, 1, 2) * 2.0f;
      return 0.7f;
    }

    return -1.0f;
  };

  void DeathNotify() {
    ChangeCollisionBoxIndexWhenPossible(WEREBULL_COLLISION_BOX_DEATH);
    SetCollisionFlags(ECF_MODEL);
  };

  // Virtual anim functions
  void StandingAnim(void) {
    StartModelAnim(WEREBULL_ANIM_IDLE, AOF_LOOPING | AOF_NORESTART);
    DeactivateRunningSound();
  };

  void WalkingAnim(void) {
    StartModelAnim(WEREBULL_ANIM_WALK, AOF_LOOPING | AOF_NORESTART);
    DeactivateRunningSound();
  };

  void RunningAnim(void) {
    StartModelAnim(WEREBULL_ANIM_RUN, AOF_LOOPING | AOF_NORESTART);
    ActivateRunningSound();
  };

  void RotatingAnim(void) {
    StartModelAnim(WEREBULL_ANIM_RUN, AOF_LOOPING | AOF_NORESTART);
    //DeactivateRunningSound();
    ActivateRunningSound();
  };

  // Virtual sound functions
  void IdleSound(void) {
    PlaySound(m_soSound, SOUND_IDLE, SOF_3D);
  };

  void SightSound(void) {
    PlaySound(m_soSound, SOUND_SIGHT, SOF_3D);
  };

  void WoundSound(void) {};

  void DeathSound(void) {
    PlaySound(m_soSound, SOUND_DEATH, SOF_3D);
  };

  // Running sounds
  void ActivateRunningSound(void) {
    if (!m_bRunSoundPlaying) {
      PlaySound(m_soFeet, SOUND_RUN, SOF_3D | SOF_LOOP);
      m_bRunSoundPlaying = TRUE;
    }
  }

  void DeactivateRunningSound(void) {
    m_soFeet.Stop();
    m_bRunSoundPlaying = FALSE;
  }

  // Attack functions

  // Touched another live entity
  void LiveEntityTouched(ETouch etouch) {
    if (m_penLastTouched != etouch.penOther || _pTimer->CurrentTick() >= m_fLastTouchedTime + 0.25f) {
      // hit angle
      FLOAT3D vDirection = en_vCurrentTranslationAbsolute;
      vDirection.Normalize();

      ANGLE aHitAngle = FLOAT3D(etouch.plCollision) % vDirection;

      // only hit target in front of you
      if (aHitAngle < 0.0f) {
        // increase mass - only if not another bull
        if (!IsOfSameClass(this, etouch.penOther)) {
          IncreaseKickedMass(etouch.penOther);
        }

        PlaySound(m_soSound, SOUND_IMPACT, SOF_3D);

        // store last touched
        m_penLastTouched = etouch.penOther;
        m_fLastTouchedTime = _pTimer->CurrentTick();

        // damage
        FLOAT3D vDirection = m_penEnemy->GetPlacement().pl_PositionVector - GetPlacement().pl_PositionVector;
        vDirection.Normalize();

        InflictDirectDamage(etouch.penOther, this, DMT_CLOSERANGE, -aHitAngle * 40.0f, FLOAT3D(0.0f, 0.0f, 0.0f), vDirection);

        // kick touched entity
        FLOAT3D vSpeed = -FLOAT3D(etouch.plCollision);
        vSpeed = vSpeed * 10.0f;

        const FLOATmatrix3D &m = GetRotationMatrix();
        FLOAT3D vSpeedRel = vSpeed * !m;

        if (vSpeedRel(1) < -0.1f) {
          vSpeedRel(1) -= 15.0f;
        } else {
          vSpeedRel(1) += 15.0f;
        }

        vSpeedRel(2) = 15.0f;

        vSpeed = vSpeedRel * m;
        KickEntity(etouch.penOther, vSpeed);
      }
    }
  };

  // Touched entity with higher mass
  BOOL HigherMass(void) {
    return (m_fMassKicked > 500.0f);
  };

  // Adjust sound and watcher parameters here if needed
  void EnemyPostInit(void) {
    // set sound default parameters
    m_soFeet.Set3DParameters(500.0f, 50.0f, 1.0f, 1.0f);
    m_bRunSoundPlaying = FALSE;
    m_soSound.Set3DParameters(160.0f, 50.0f, 1.0f, 1.0f);
  };

procedures:
  // Hit enemy
  Hit(EVoid) : CEnemyBase::Hit {
    if (CalcDist(m_penEnemy) < HIT_DISTANCE) {
      // attack with horns
      StartModelAnim(WEREBULL_ANIM_ATTACKHORNS, 0);
      DeactivateRunningSound();
      m_bHornHit = FALSE;

      autowait(0.4f);

      PlaySound(m_soSound, SOUND_KICKHORN, SOF_3D);

      if (CalcDist(m_penEnemy) < HIT_DISTANCE) {
        m_bHornHit = TRUE;
      }

      autowait(0.1f);

      if (CalcDist(m_penEnemy) < HIT_DISTANCE) {
        m_bHornHit = TRUE;
      }

      autowait(0.1f);

      if (CalcDist(m_penEnemy) < HIT_DISTANCE) {
        m_bHornHit = TRUE;
      }

      if (m_bHornHit) {
        FLOAT3D vDirection = m_penEnemy->GetPlacement().pl_PositionVector-GetPlacement().pl_PositionVector;
        vDirection.Normalize();

        InflictDirectDamage(m_penEnemy, this, DMT_CLOSERANGE, 20.0f, FLOAT3D(0.0f, 0.0f, 0.0f), vDirection);

        FLOAT3D vSpeed;
        GetPitchDirection(90.0f, vSpeed);

        vSpeed = vSpeed * 10.0f;
        KickEntity(m_penEnemy, vSpeed);
      }
    }

    // run to enemy
    m_fShootTime = _pTimer->CurrentTick() + 0.5f;

    return EReturn();
  };

  // Entry point
  Main() {
    // declare yourself as a model
    InitAsModel();
    SetPhysicsFlags(EPF_MODEL_WALKING);
    SetCollisionFlags(ECF_MODEL);
    SetFlags(GetFlags() | ENF_ALIVE);

    SetHealth(250.0f);
    m_fMaxHealth = 250.0f;

    en_fDensity = 2000.0f;

    // set your appearance
    SetModel(MODEL_WEREBULL);

    //if (m_bcChar == BUC_SUMMER) {
      SetModelMainTexture(TEXTURE_WEREBULL_SUMMER);
    /*} else {
      SetModelMainTexture(TEXTURE_WEREBULL_WINTER);
    }*/

    StandingAnim();

    // setup moving speed
    m_fWalkSpeed = FRnd() + 2.5f;
    m_aWalkRotateSpeed = FRnd() * 25.0f + 45.0f;
    m_fAttackRunSpeed = FRnd() * 5.0f + 22.5f;
    m_fAttackRotateRunInto = FRnd() * 60.0f + 100.0f;
    m_aAttackRotateSpeed = m_fAttackRotateRunInto;
    m_fCloseRunSpeed = FRnd() * 5.0f + 15.0f;
    m_aCloseRotateSpeed = FRnd() * 50.0f + 500.0f;

    // setup attack distances
    m_fAttackDistance = 100.0f;
    m_fCloseDistance = 7.0f;
    m_fStopDistance = 0.0f;
    m_fAttackFireTime = 0.05f;
    m_fCloseFireTime = 1.0f;
    m_fIgnoreRange = 250.0f;

    // damage/explode properties
    m_fBlowUpAmount = 1E10f;
    m_iBodyParts = 12;
    m_fDamageWounded = 100000.0f;
    m_iScore = 2000;

    if (m_fStepHeight == -1) {
      m_fStepHeight = 4.0f;
    }

    Particles_RunningDust_Prepare(this);

    // continue behavior in base class
    jump CEnemyRunInto::MainLoop();
  };
};
