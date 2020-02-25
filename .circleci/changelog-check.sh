#!/bin/bash
set -o nounset
set -o errexit
REPO_ROOT=$(git rev-parse --show-toplevel)
echo "Git repo is at $REPO_ROOT"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
REMOTE="origin/master"
SITE_CHANGES=$(git diff "$BRANCH".."$REMOTE" | wc -l)
echo "Detected $SITE_CHANGES changes"
if [ "$SITE_CHANGES" -gt "0" ]; then
  echo "Checking to make sure package version was updated..."
  HISTORY_CHANGED=$(git diff "$BRANCH".."$REMOTE" -- $REPO_ROOT/HISTORY.md | wc -l)
  if [ "$HISTORY_CHANGED" -gt "0" ]; then
    echo "History was updated!  Continuing..."
  else
    echo "History was not updated :( Aborting push."
    exit 1
  fi
fi