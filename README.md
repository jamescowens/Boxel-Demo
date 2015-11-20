# Boxel Demo
Boxel has a lot of dependencies under the hood of it. This repo will help
you get everything you need to start streaming video to minecraft.

# Setup
## Web Client
First lets get our streaming client up and running. 

```bash
cd web
npm install && bower install
gulp build
gulp serve:dist
```

A web browser should open up and look like this:

But how do we login?
We are going to need [docker-machine](https://github.com/docker/machine) to do this.

Before we build up boxel's dependencies lets build the boxel container first.
Clone [boxel]() and build the container:

```bash
docker build -t boxel .
docker images # should display boxel under REPOSITORY column
```

Once we built the boxel container let's build it's dependencies:

## Crossbar
Boxel uses [Crossbar](http://crossbar.io/) for device discovery, 
communication between the web app to the minecraft server, and to serve the web app we just saw.

## Redis
Boxel uses [Redis](https://github.com/antirez/redis) to push codec data into a pub/sub for Minecraft to use.

## PhantomJS
Boxel uses [PhantomJS](https://github.com/ariya/phantomjs) for headless browsing to get images of websites to boxelize.

```bash
# At the root of the project
docker-machine ip <dev>
# keep track of this url and add it to the boxel service
# in the docker-compose.yml
command: "boxel -W 50 -C palettes/5bit.yml video -R docker -U ws://[docker-machine ip]/ws"
docker-compose up
# sometimes boxel links with crossbar too soon 
docker-compose restart boxel
```

Now if you got to the browser using the docker-machine ip(example: http://http://192.168.99.100:8080/). 
Login using the docker-machine ip (192.168.99.100:8080) and boxel as the room. You should see yourself in
realtime boxelized and sending to redis it's palletized code ready to drawn using Minecraft blocks.
