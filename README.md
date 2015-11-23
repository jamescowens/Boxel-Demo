# Boxel Demo
Boxel has a fair number of dependencies under the hood. 
This example will help you get everything you need up and running for streaming video to a Minecraft plugin.

# Setup
First, let's get a web client started. 

## Web Client

```bash
cd web
npm install && bower install
gulp build
gulp serve:dist
```
A web browser should open up with a login page. 

This is the front-end for your boxel app.

Video captured here can be "boxelized" and streamed to clients -- including Minecraft servers.
In order to boxelize and stream the video you'll need to set up the rest of the Boxel stack.

We'll use [docker-machine](https://github.com/docker/machine) and create a [Docker](https://github.com/docker/docker) 
host where we can run Boxel and its dependencies.

Install docker-machine and create a host by following the instructions [here](https://github.com/docker/machine).

## Boxel

Before we build Boxel's dependencies, let's build the Boxel container.
Clone [boxel](https://github.com/VerizonCraft/Boxel) and build it:

```bash
docker build -t boxel .
docker images # should display boxel under REPOSITORY column
```

Boxel has three major dependencies -- we've provided docker containers to get them all running with a few commands.

## Crossbar
Boxel uses [Crossbar](http://crossbar.io/) for device discovery, 
communication between the web app to the minecraft server, and to serve the web app we just saw.


## Redis
Boxel uses [Redis](https://github.com/antirez/redis) to push codec data into a pub/sub for Minecraft to use.

## PhantomJS
Boxel uses [PhantomJS](https://github.com/ariya/phantomjs) for headless browsing to get images of websites to boxelize.

# Installation 
All of these dependencies can be built and packaged into Docker containers using [docker-compose](https://github.com/docker/compose)

First, get the IP address of your docker host:
```bash
# At the root of the project
docker-machine ip your-docker-machine-name
```

Then edit docker-compose.yml so the command points at the correct host:
```
# keep track of this IP and edit in the boxel service command
# in the docker-compose.yml
command: "boxel -W 50 -C palettes/5bit.yml video -R docker -U ws://[docker-machine IP]/ws"
```

Now you should be able to start Boxel and its dependencies like so:
```
docker-compose up -d
# sometimes boxel starts before crossbar, if so you'll need to restart
docker-compose restart boxel
```

If you got to the web container's address (something like http://<your docker-machine IP>:8080).
You can login using your docker-machine IP (<docker-machine ip>:8080) and "boxel" as the room name. 

You should see your boxelized face in your browser window.  
These frames are being published on the Redis PUB/SUB channel "boxel" and can be drawn by subscribed clients on a Minecraft server.

# License
This repository and its code are made available under a BSD 3-Clause license, which can be found [here](https://github.com/VerizonCraft/Boxel-demo/blob/master/LICENSE)

