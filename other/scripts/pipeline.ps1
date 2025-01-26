npm install --legacy-peer-deps
npm run build
npm run prisma:localpush
npm run create_user

# after changing the "output" config of next.config.js we can't "run npm run start" anymore
node .next/standalone/server.js

#docker
docker build -t nextjs-docker -f ./docker/Dockerfile .    
docker run -p 3000:3000 nextjs-docker

docker compose -f other/supabase-docker/docker-compose.yaml -f -f docker/compose.yml up -d