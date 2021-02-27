#!/bin/bash

# Probably use environment variables for this bit
pkill -f srb2kart
/home/bob/Kart-Public/bin/Linux64/Release/lsdl2srb2kart -dedicated -room -33 -file /home/bob/srb2kart-webadmin/public/addons/* -server -resetdata -debug