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
  VERSION_CHANGED=$(git diff "$BRANCH".."$REMOTE" -G '"version":' -- $REPO_ROOT/package.json | wc -l)
  if [ "$VERSION_CHANGED" -gt "0" ]; then
    echo "Version was updated!  Continuing..."
  else
    echo "Version was not updated :( Aborting push."
    exit 1
  fi
fi