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

242
%{
#include "StdH.h"
#include "Entities/WorldSettingsController.h"
%}

uses "Entities/ModelDestruction";
uses "Entities/AnimationChanger";
uses "Entities/BloodSpray";

enum SkaCustomShadingType {
  0 SCST_NONE             "Automatic shading",
  1 SCST_CONSTANT_SHADING "Constant shading",
  2 SCST_FULL_CUSTOMIZED  "Customized shading"
};

enum SkaShadowType {
  0 SST_NONE      "None",
  1 SST_CLUSTER   "Cluster shadows",
  2 SST_POLYGONAL "Polygonal" 
};

class CModelHolder3 : CRationalEntity {
name      "ModelHolder3";
thumbnail "Thumbnails\\ModelHolder3.tbn";
features "HasName", "HasDescription";

properties:
  1 CTFileName m_fnModel "Model file (.smc)" 'M' = CTFILENAME(""),
  3 FLOAT m_fStretchAll "StretchAll" 'S' = 1.0f,
  4 ANGLE3D m_vStretchXYZ "StretchXYZ" 'X' = FLOAT3D(1.0f, 1.0f, 1.0f),
  7 CTString m_strName "Name" 'N' ="",
 12 CTString m_strDescription = "",
  8 BOOL m_bColliding "Collision" 'L' = FALSE, // set if model is not immatierial
 11 enum SkaShadowType m_stClusterShadows "Shadows" 'W' = SST_CLUSTER, // set if model uses cluster shadows
 13 BOOL m_bBackground "Background" 'B' = FALSE, // set if model is rendered in background
 21 BOOL m_bTargetable "Targetable" = FALSE, // set if model should be targetable

 // parameters for custom shading of a model (overrides automatic shading calculation)
 14 enum SkaCustomShadingType m_cstCustomShading "Shading mode" 'H' = SCST_NONE,
 15 ANGLE3D m_aShadingDirection "Shade. Light direction" 'D' = ANGLE3D(45.0f, 45.0f, 45.0f),
 16 COLOR m_colLight            "Shade. Light color" 'O' = C_WHITE,
 17 COLOR m_colAmbient          "Shade. Ambient color" 'A' = C_BLACK,
 26 BOOL m_bActive "Active" = TRUE,

 70 FLOAT m_fClassificationStretch "Classification stretch" = 1.0f, // classification box multiplier
100 FLOAT m_fMaxTessellationLevel "Max tessellation level" = 0.0f,

components:

functions:
  // Fill in entity statistics - for AI purposes only
  BOOL FillEntityStatistics(EntityStats *pes) {
    pes->es_strName = m_fnModel.FileName();

    pes->es_ctCount = 1;
    pes->es_ctAmmount = 1;
    pes->es_fValue = 0;
    pes->es_iScore = 0;

    return TRUE;
  }

  // Classification box multiplier
  FLOAT3D GetClassificationBoxStretch(void) {
    return FLOAT3D(m_fClassificationStretch, m_fClassificationStretch, m_fClassificationStretch);
  }

  // Maximum allowed tessellation level for this model (for Truform/N-Patches support)
  FLOAT GetMaxTessellationLevel(void) {
    return m_fMaxTessellationLevel;
  }

  // Receive damage
  void ReceiveDamage(CEntity *penInflictor, INDEX dmtType, FLOAT fDamageAmmount, const FLOAT3D &vHitPoint, const FLOAT3D &vDirection) {
  };

  BOOL IsTargetable(void) const {
    return m_bTargetable;
  }

  // Adjust model shading parameters if needed.
  BOOL AdjustShadingParameters(FLOAT3D &vLightDirection, COLOR &colLight, COLOR &colAmbient) {
    switch (m_cstCustomShading) {
      case SCST_FULL_CUSTOMIZED: {
        colLight = m_colLight;
        colAmbient = m_colAmbient;

        AnglesToDirectionVector(m_aShadingDirection, vLightDirection);
        vLightDirection = -vLightDirection;
      } break;

      case SCST_CONSTANT_SHADING: {
        // combine colors with clamp
        UBYTE lR, lG, lB, aR, aG, aB, rR, rG, rB;
        ColorToRGB(colLight, lR, lG, lB);
        ColorToRGB(colAmbient, aR, aG, aB);

        colLight = 0;

        rR = (UBYTE)Clamp((ULONG)lR + aR, (ULONG)0, (ULONG)255);
        rG = (UBYTE)Clamp((ULONG)lG + aG, (ULONG)0, (ULONG)255);
        rB = (UBYTE)Clamp((ULONG)lB + aB, (ULONG)0, (ULONG)255);

        colAmbient = RGBToColor(rR, rG, rB);
      } break;

      case SCST_NONE: {
        // do nothing
      } break;
    }

    return m_stClusterShadows != SST_NONE;
  };

  // Apply mirror and stretch to the entity
  void MirrorAndStretch(FLOAT fStretch, BOOL bMirrorX) {
    m_fStretchAll *= fStretch;

    if (bMirrorX) {
      m_vStretchXYZ(1) = -m_vStretchXYZ(1);
    }
  }

  // Stretch model
  void StretchModel(void) {
    // stretch factors must not have extreme values
    if (Abs(m_vStretchXYZ(1)) < 0.01f) {
      m_vStretchXYZ(1) = 0.01f;
    }

    if (Abs(m_vStretchXYZ(2)) < 0.01f) {
      m_vStretchXYZ(2) = 0.01f;
    }

    if (Abs(m_vStretchXYZ(3)) < 0.01f) {
      m_vStretchXYZ(3) = 0.01f;
    }

    if (m_fStretchAll < 0.01f) {
      m_fStretchAll = 0.01f;
    }

    if (Abs(m_vStretchXYZ(1)) > 1000.0f) {
      m_vStretchXYZ(1) = 1000.0f * Sgn(m_vStretchXYZ(1));
    }

    if (Abs(m_vStretchXYZ(2)) > 1000.0f) {
      m_vStretchXYZ(2) = 1000.0f * Sgn(m_vStretchXYZ(2));
    }

    if (Abs(m_vStretchXYZ(3)) > 1000.0f) {
      m_vStretchXYZ(3) = 1000.0f * Sgn(m_vStretchXYZ(3));
    }

    if (m_fStretchAll > 1000.0f) {
      m_fStretchAll = 1000.0f;
    }

    GetModelInstance()->StretchModel(m_vStretchXYZ * m_fStretchAll);
    ModelChangeNotify();
  };

  // Init model holder
  void InitModelHolder(void) {
    // must not crash when model is removed
    if (m_fnModel == "") {
      m_fnModel = CTFILENAME("Models\\Editor\\Ska\\Axis.smc");
    }

    if (m_bActive) {
      InitAsSkaModel();
    } else {
      InitAsSkaEditorModel();
    }

    BOOL bLoadOK = TRUE;

    // try to load the model
    try {
      SetSkaModel_t(m_fnModel);

    // if failed
    } catch (char *strError) {
      WarningMessage(TRANS("Cannot load ska model '%s':\n%s"), (CTString &)m_fnModel, strError);
      bLoadOK = FALSE;
    }

    if (!bLoadOK) {
      SetSkaModel(CTFILENAME("Models\\Editor\\Ska\\Axis.smc"));
    }

    // set model stretch
    StretchModel();
    ModelChangeNotify();

    if (m_bColliding && m_bActive) {
      SetPhysicsFlags(EPF_MODEL_FIXED);
      SetCollisionFlags(ECF_MODEL_HOLDER);

    } else {
      SetPhysicsFlags(EPF_MODEL_IMMATERIAL);
      SetCollisionFlags(ECF_IMMATERIAL);
    }

    switch (m_stClusterShadows) {
      case SST_NONE: {
        SetFlags(GetFlags() & ~ENF_CLUSTERSHADOWS);
      } break;

      case SST_CLUSTER: {
        SetFlags(GetFlags() | ENF_CLUSTERSHADOWS);
      } break;

      case SST_POLYGONAL: {
        SetFlags(GetFlags() & ~ENF_CLUSTERSHADOWS);
      } break;
    }

    if (m_bBackground) {
      SetFlags(GetFlags() | ENF_BACKGROUND);
    } else {
      SetFlags(GetFlags() & ~ENF_BACKGROUND);
    }

    m_strDescription.PrintF("%s", (CTString &)m_fnModel.FileName());

    return;
  };

procedures:
  // Entry point
  Main() {
    // initialize the model
    InitModelHolder();

    // wait forever
    wait() {
      on (EBegin) : {
        resume;
      }

      // activate/deactivate shows/hides model
      on (EActivate): {
        SwitchToModel();
        m_bActive = TRUE;

        if (m_bColliding) {
          SetPhysicsFlags(EPF_MODEL_FIXED);
          SetCollisionFlags(ECF_MODEL_HOLDER);
        }
        resume;
      }

      on (EDeactivate): {
        SwitchToEditorModel();
        SetPhysicsFlags(EPF_MODEL_IMMATERIAL);
        SetCollisionFlags(ECF_IMMATERIAL);

        m_bActive = FALSE;

        SetPhysicsFlags(EPF_MODEL_IMMATERIAL);
        SetCollisionFlags(ECF_IMMATERIAL);
        resume;
      }

      // when your parent is destroyed
      on (ERangeModelDestruction) : {
        // for each child of this entity
        {FOREACHINLIST(CEntity, en_lnInParent, en_lhChildren, itenChild) {
          // send it destruction event
          itenChild->SendEvent(ERangeModelDestruction());
        }}

        // destroy yourself
        Destroy();
        resume;
      }

      // when dead
      on (EDeath) : {
        resume;
      }

      otherwise() : {
        resume;
      }
    }
  }
};
