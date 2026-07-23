@echo off
echo Setting up environment variables for Strapi connection...
echo.
echo Creating .env.local file...
(
echo NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
echo NEXT_PUBLIC_AUTH_REGISTER_URL=http://localhost:3000/api/auth/register
echo NEXT_PUBLIC_SOCKET_URL=http://localhost:1337
) > .env.local
echo.
echo .env.local file created successfully!
echo.
echo Please restart your Next.js development server for the changes to take effect.