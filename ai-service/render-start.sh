#!/bin/bash
# Render start command: bash render-start.sh
exec gunicorn app:app --bind "0.0.0.0:${PORT:-5001}" --timeout 120 --workers 1
