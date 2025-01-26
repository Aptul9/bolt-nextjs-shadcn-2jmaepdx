npm install --legacy-peer-deps
npm run build
npm run prisma:localpush
npm run create_user

# after changing the "output" config of next.config.js we can't "run npm run start" anymore
node .next/standalone/server.js

#docker
docker build -t nextjs-docker .    
docker run -p 3000:3000 nextjs-docker