#!/bin/bash

set -euo pipefail

USER="deploy:$(op read "op://Private/stxx523yesdlbgnhdzdhddafk4/deployment password")"
REPOSITORY="ilkkahanninen/wallclock-ts"

make build-frontend
git add src/backend/static
git commit -am "Build: $(date)" || true
git push || true
curl -u "$USER" "https://ci.farjanverse.party/deploy/$REPOSITORY"
