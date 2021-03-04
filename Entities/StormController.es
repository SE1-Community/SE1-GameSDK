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

606
%{
#include "StdH.h"
#include "Entities/BackgroundViewer.h"
#include "Entities/WorldSettingsController.h"
#include "Entities/Lightning.h"
%}

class CStormController : CRationalEntity {
name      "Storm controller";
thumbnail "Thumbnails\\StormController.tbn";
features  "IsTargetable", "HasName";

properties:
  1 CEntityPointer m_penwsc, // ptr to world settings controller
  2 CTString m_strName "Name" 'N' = "Storm controller", // class name
  3 FLOAT m_fNextLightningDelay = 0.0f,
  4 BOOL m_bStormOn = FALSE,
  5 FLOAT m_fNextLightningStrike = 0.0f,

  10 CEntityPointer m_penLightning00 "Lightning 1" 'T' COLOR(C_MAGENTA|0xFF),
  11 CEntityPointer m_penLightning01 "Lightning 2" 'Y' COLOR(C_MAGENTA|0xFF),
  12 CEntityPointer m_penLightning02 "Lightning 3" 'U' COLOR(C_MAGENTA|0xFF),
  13 CEntityPointer m_penLightning03 "Lightning 4" 'I' COLOR(C_MAGENTA|0xFF),
  14 CEntityPointer m_penLightning04 "Lightning 5" 'O' COLOR(C_MAGENTA|0xFF),
  15 CEntityPointer m_penLightning05 "Lightning 6" 'P' COLOR(C_MAGENTA|0xFF),
  16 CEntityPointer m_penLightning06 "Lightning 7"     COLOR(C_MAGENTA|0xFF),
  17 CEntityPointer m_penLightning07 "Lightning 8"     COLOR(C_MAGENTA|0xFF),
  18 CEntityPointer m_penLightning08 "Lightning 9"     COLOR(C_MAGENTA|0xFF),
  19 CEntityPointer m_penLightning09 "Lightning 10"    COLOR(C_MAGENTA|0xFF),
  20 CEntityPointer m_penLightning10 "Lightning 11"    COLOR(C_MAGENTA|0xFF),
  21 CEntityPointer m_penLightning11 "Lightning 12"    COLOR(C_MAGENTA|0xFF),
  22 CEntityPointer m_penLightning12 "Lightning 13"    COLOR(C_MAGENTA|0xFF),
  23 CEntityPointer m_penLightning13 "Lightning 14"    COLOR(C_MAGENTA|0xFF),
  24 CEntityPointer m_penLightning14 "Lightning 15"    COLOR(C_MAGENTA|0xFF),
  25 CEntityPointer m_penLightning15 "Lightning 16"    COLOR(C_MAGENTA|0xFF),
  26 CEntityPointer m_penLightning16 "Lightning 17"    COLOR(C_MAGENTA|0xFF),
  27 CEntityPointer m_penLightning17 "Lightning 18"    COLOR(C_MAGENTA|0xFF),
  28 CEntityPointer m_penLightning18 "Lightning 19"    COLOR(C_MAGENTA|0xFF),
  29 CEntityPointer m_penLightning19 "Lightning 20"    COLOR(C_MAGENTA|0xFF),

  40 FLOAT m_tmStormAppearTime "Storm appear time" = 10.0f,
  41 FLOAT m_tmStormDisappearTime "Storm disappear time" = 10.0f,
  42 FLOAT m_fFirstLightningDelay "First lightning delay" = 10.0f,
  43 FLOAT m_fMaxLightningPeriod "Max lightning period" = 10.0f,
  44 FLOAT m_fMinLightningPeriod "Min lightning period" = 1.0f,
  45 FLOAT m_fMaxStormPowerTime "Max storm power time" = 120.0f,

  50 COLOR m_colBlendStart "Color blend start" 'B' = COLOR(C_WHITE|CT_TRANSPARENT),
  51 COLOR m_colBlendStop "Color blend stop" = COLOR(C_WHITE|CT_OPAQUE),
  52 COLOR m_colShadeStart "Color shade start" 'S' = COLOR(C_WHITE|CT_OPAQUE),
  53 COLOR m_colShadeStop "Color shade stop" = COLOR(C_GRAY|CT_OPAQUE),

components:
  1 model   MODEL_STORM_CONTROLLER   "Models\\Editor\\StormController.mdl",
  2 texture TEXTURE_STORM_CONTROLLER "Models\\Editor\\StormController.tex"

functions:
  // Check if one lightning target is valid 
  void CheckOneLightningTarget(CEntityPointer &pen) {
    if (pen != NULL && !IsOfClass(pen, "Lightning")) {
      WarningMessage("Target '%s' is not of class Lightning!", pen->GetName());
      pen = NULL;
    }
  }

  // Get number of lightnings set by user
  INDEX GetLightningsCount(void) const {
    // [Cecil] 2021-03-04: Replaced individual checks with a loop
    for (INDEX iLightning = 0; iLightning < 20; iLightning++) {
      // NOTE: only first N that are no NULL are used
      if ((&m_penLightning00)[iLightning] == NULL) {
        return iLightning;
      }
    }

    return 20;
  }

procedures:
  Storm() {
    // wait before first lightning
    autowait(10.0f);

    m_fNextLightningStrike = m_tmStormAppearTime + m_fFirstLightningDelay;
    jump StormInternal();
  }

  StormInternal() {
    while (m_bStormOn && _pTimer->CurrentTick()
        < ((CWorldSettingsController *)&*m_penwsc)->m_tmStormEnd + m_tmStormDisappearTime) {
      while (_pTimer->CurrentTick() < m_fNextLightningStrike
          && _pTimer->CurrentTick() < ((CWorldSettingsController *)&*m_penwsc)->m_tmStormEnd + m_tmStormDisappearTime
          && m_bStormOn) {
        // wait until next lightning
        wait (_pTimer->TickQuantum) {
          on (EBegin) : {
            resume;
          }

          on (EEnvironmentStop) : {
            m_fNextLightningStrike += 1.0f;
            resume;
          }

          on (ETimer) : {
            stop;
          }
        }
      }

      autowait(_pTimer->TickQuantum);

      // calculate next lightning strike time
      FLOAT fLightningStart = ((CWorldSettingsController *)&*m_penwsc)->m_tmStormStart + m_fFirstLightningDelay;
      FLOAT fLightningMax = fLightningStart + m_fMaxStormPowerTime;
      FLOAT fRatio;

      // if storm is finished
      if (_pTimer->CurrentTick() > ((CWorldSettingsController *)&*m_penwsc)->m_tmStormEnd - m_tmStormDisappearTime) {
        m_bStormOn = FALSE;

      } else {
        // fade in
        if (_pTimer->CurrentTick() < fLightningMax) {
          fRatio=CalculateRatio(_pTimer->CurrentTick(), fLightningStart, fLightningMax, 1.0f, 0.0f);

        // max storm power
        } else {
          fRatio = 1;
        }

        FLOAT tmPeriod = (m_fMaxLightningPeriod - m_fMinLightningPeriod) * (1.0f - fRatio);
        FLOAT fNextLighting = m_fMinLightningPeriod + tmPeriod * (1.0f + (FRnd() - 0.5f) * 0.25f);
        m_fNextLightningStrike = _pTimer->CurrentTick() + fNextLighting;

        // choose random lightning
        INDEX ctLightnings = GetLightningsCount();

        // if there are some lightnings
        if (ctLightnings != 0) {
          // choose by random
          CLightning *penLightning = (CLightning *) &*(&m_penLightning00)[IRnd() % ctLightnings];
          SendToTarget(penLightning, EET_TRIGGER);
        }
      }
    }

    m_bStormOn = FALSE;
    return EReturn();
  }

  // Entry point
  Main() {
    // check lightning targets
    for (INDEX iLightning = 0; iLightning < 20; iLightning++) {
      CheckOneLightningTarget((&m_penLightning00)[iLightning]);
    }

    // set appearance
    InitAsEditorModel();
    SetPhysicsFlags(EPF_MODEL_IMMATERIAL);
    SetCollisionFlags(ECF_IMMATERIAL);

    // set appearance
    SetModel(MODEL_STORM_CONTROLLER);
    SetModelMainTexture(TEXTURE_STORM_CONTROLLER);
    
    // spawn in world editor
    autowait(0.1f);

    // obtain bcg viewer entity
    CBackgroundViewer *penBcgViewer = (CBackgroundViewer *) GetWorld()->GetBackgroundViewer();

    if (penBcgViewer == NULL) {
      // don't do anything
      return;
    }

    // obtain world settings controller 
    m_penwsc = penBcgViewer->m_penWorldSettingsController;

    if (m_penwsc == NULL) {
      // don't do anything
      return;
    }
    
    // must be world settings controller entity
    if (!IsOfClass(m_penwsc, "WorldSettingsController")) {
      // don't do anything
      return;
    }

    CWorldSettingsController *pwsc = (CWorldSettingsController *)&*m_penwsc;

    pwsc->m_colBlendStart = m_colBlendStart;
    pwsc->m_colBlendStop = m_colBlendStop;
    pwsc->m_colShadeStart = m_colShadeStart;
    pwsc->m_colShadeStop = m_colShadeStop;
    pwsc->m_tmStormAppearTime = m_tmStormAppearTime;
    pwsc->m_tmStormDisappearTime = m_tmStormDisappearTime;

    m_bStormOn = FALSE;

    while (TRUE) {
      wait() {
        // immediate storm now
        on (EEnvironmentStart eEnvironmentStart) : {
          TIME tmNow = _pTimer->CurrentTick();

          ((CWorldSettingsController *)&*m_penwsc)->m_tmStormStart = tmNow - m_tmStormAppearTime;
          ((CWorldSettingsController *)&*m_penwsc)->m_tmStormEnd = 1e6;

          m_bStormOn = TRUE;
          m_fNextLightningStrike = _pTimer->CurrentTick() + 2.0f;

          call StormInternal();
          resume;
        }

        on (EStart eStart) : {
          if (!m_bStormOn) {
            TIME tmNow = _pTimer->CurrentTick();
            ((CWorldSettingsController *)&*m_penwsc)->m_tmStormStart = tmNow;
            ((CWorldSettingsController *)&*m_penwsc)->m_tmStormEnd = 1e6;

            m_bStormOn = TRUE;
            call Storm();
          }
          resume;
        }

        on (EStop eStop) : {
          if (m_bStormOn) {
            TIME tmNow = _pTimer->CurrentTick();
            ((CWorldSettingsController *)&*m_penwsc)->m_tmStormEnd = tmNow;
          }
          resume;
        }

        otherwise() : {
          resume;
        }
      }
    }
  }
};
