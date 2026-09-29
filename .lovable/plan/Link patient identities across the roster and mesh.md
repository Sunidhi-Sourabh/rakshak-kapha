# Link patient identities across the roster and mesh

## Changes
- Add a prominent `LOCKET ID` column beside each roster node, using deterministic UIDs such as `L-01 → RK26-EF9801`.
- Use one shared wearer record shape for UID, ABHA reference, battery, triage, sector, and live vitals.
- Replace the current roster detail drawer with a compact Hardware Binding slide-over showing those identity and telemetry fields.
- Make wearable nodes on the BLE Mesh map keyboard- and pointer-selectable, opening the same slide-over for the selected locket.
- Keep relay nodes non-interactive and preserve the existing dark tactical styling.

## Technical details
- Lift selected-wearer state to the dashboard so roster rows and map nodes share one panel.
- Pass the current live telemetry into the selected wearer where appropriate; derive stable sample telemetry for other roster nodes from the existing roster generator.
- Add accessible dialog semantics, close control, backdrop dismissal, and Escape-key dismissal.

## Verification
- Check roster UID mappings, row selection, mesh-node selection, panel contents, keyboard access, and desktop/mobile layout.
