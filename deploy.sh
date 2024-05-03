#!/bin/bash

set -euo pipefail

USER="deploy:$(op read "op://Private/stxx523yesdlbgnhdzdhddafk4/deployment password")"
REPOSITORY="ilkkahanninen/wallclock-ts"

git push
curl -u "$USER" "https://ci.farjanverse.party/deploy/$REPOSITORY"