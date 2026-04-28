@echo off
echo Adding changes to git...
git add .
echo Committing changes...
git commit -m "Update API endpoints for Vercel deployment"
echo Pushing to GitHub...
git push origin main
echo.
echo Push complete! If your Vercel projects are already set up and linked to this repository, Vercel will now automatically trigger a new deployment.
pause
