echo "Opening VSCodium"
codium /home/phantom/myStuff/pocketbase
echo "Starting Dev Server of Next.js"
cd /home/phantom/myStuff/pocketbase/client
xfce4-terminal --tab -T "yarn dev" -x yarn dev
echo "Started Dev Server of Next.js"
echo "Staring Dev Server of Nest.js"
cd /home/phantom/myStuff/pocketbase/server
xfce4-terminal --tab -T "yarn start:dev" -x yarn start:dev
echo "Started Dev Server of Nest.js"

