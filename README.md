# Boxel Demo
Boxel has a lot of dependencies under the hood of it. This repo will help
you get everything you need to start streaming video to minecraft.

# Setup
First lets get our streaming client up and running. 

## Web Client

```bash
cd web
npm install && bower install
gulp build
gulp serve:dist
```

A web browser should open up with a login page.

But how do we login?
We are going to need [docker-machine](https://github.com/docker/machine) to do this and a Docker host.

## Boxel

Before we build up boxel's dependencies lets build the boxel container first.
Clone [boxel]() and build the container:

```bash
docker build -t boxel .
docker images # should display boxel under REPOSITORY column
```

Once we built the boxel container let's build it's dependencies.

## Crossbar
Boxel uses [Crossbar](http://crossbar.io/) for device discovery, 
communication between the web app to the minecraft server, and to serve the web app we just saw. 
It is built in the web container in the docker-compose.yml.

## Redis
Boxel uses [Redis](https://github.com/antirez/redis) to push codec data into a pub/sub for Minecraft to use.

## PhantomJS
Boxel uses [PhantomJS](https://github.com/ariya/phantomjs) for headless browsing to get images of websites to boxelize.

# Installation 
All of these dependencies can be built and packaged up into containers using [docker-compose]()
```bash
# At the root of the project
docker-machine ip <dev>
# keep track of this url and edit in the boxel service command
# in the docker-compose.yml
command: "boxel -W 50 -C palettes/5bit.yml video -R docker -U ws://[docker-machine ip]/ws"
docker-compose up -d
# sometimes boxel links with crossbar too soon 
docker-compose restart boxel
```

Now if you got to the web containers ip (http://[docker-machine ip]:8080). 
Login using the docker-machine ip ([docker-machine ip]:8080) and boxel as the room. 

You should see yourself in realtime boxelized and sending to redis it's palletized code 
ready to be drawn using Minecraft blocks.
