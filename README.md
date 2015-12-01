# Boxel Demo
Boxel has a fair number of dependencies under the hood, so to help you get up
and running as quickly as possible we built a small demo. This guide will help
you get everything you need to stream video to a Minecraft plugin up and running
in a few minutes.

# Setup
Before you do anything, you'll need the repository:

```bash
git clone https://github.com/VerizonCraft/Boxel-demo.git
```

Once that's cloned, we'll get the front-end for your boxel app started:

## Web Client

```bash
$ cd web
$ npm install && bower install
$ gulp build
$ gulp serve:dist
```

You should see a web browser open up to a login page.

Video captured in this front end application can be "boxelized" and streamed to
clients -- including Minecraft servers.

In order to boxelize and stream the video you'll need to set up the rest of the
Boxel stack.

## Docker Machine
*We'll use [docker-machine](https://github.com/docker/machine) and create a [Docker](https://github.com/docker/docker) 
host where we can run Boxel and its dependencies.*

Install docker-machine and create a host by following the instructions [here](https://github.com/docker/machine).

## Boxel

Before we build Boxel's dependencies, let's build the Boxel container.
Clone [boxel](https://github.com/VerizonCraft/Boxel) and build it:

```bash
$ docker build -t boxel .
$ docker images # should display boxel under REPOSITORY column
```

##Boxel Dependencies
Boxel has three major dependencies:

* [Crossbar](http://crossbar.io/): Used for device discovery, communication
  between the web application and the Minecraft server, and to serve the web
  application we built above.
* [Redis](https://github.com/antirez/redis): Used to push data into a PUB/SUB
  channel that Minecraft servers can subscribe to.
* [PhantomJS](https://github.com/ariya/phantomjs): Used for headless browsing to
  capture images of websites.

Installing these can be a pain, so we've created a
[docker-compose](https://github.com/docker/compose) YAML file that
will handle building and packaing these dependencies into Docker containers.

With just a few lines in your terminal, you should be able to start Boxel and
its dependencies up. Let's take a look:

```bash
# using the name of the Docker machine you created above, get the host IP
$ IP=$(docker-machine ip [your-machine-name])
# next, update the docker-compose YAML file with the host IP
$ cat docker-compose.yml | sed -e #<<IP>>#${IP}#g > docker-compose.yml.tmp
# now replace the old YAML file
$ mv docker-compose.yml.tmp docker-compose.yml
# finally, start up Boxel and its dependent containers
$ docker-compose up -d
# sometimes Boxel starts before Crossbar, so we recommend restarting Boxel
$ docker-compose restart boxel
```

---

**That's it!** Let's take a closer look and break all that down:

####Obtaining the IP of your Docker machine
First, you will need the IP address of your docker host. We can get that by
getting into the root directory of your project, then running the docker-machine
command to get an IP address:

```bash
# using the name of the Docker machine you created above, get the host IP
$ IP=$(docker-machine ip [your-machine-name])
```

####Updating docker-compose.yml
Next, we need to update `docker-compose.yml`, so that it knows which Docker
machine to target. You can either use your favorite text editor to replace
`<<IP>>` with the IP address you got in the first step, or you can use `cat` and
`sed`, copying directly from this README:

```bash
$ IP=$(docker-machine ip `your-docker-machine-name`)
$ cat docker-compose.yml | sed -e #<<IP>>#${IP}#g > docker-compose.yml.tmp
# now replace the old YAML file
$ mv docker-compose.yml.tmp docker-compose.yml
```

####Building Boxel and dependent containers
Lastly, all we have to do is start up Boxel. On occasion, the Boxel container
will fire up *before* the Crossbar container, so we like to give Boxel a nudge
after starting everything up by restarting it.
```
# finally, start up Boxel and its dependent containers
$ docker-compose up -d
# sometimes Boxel starts before Crossbar, so we recommend restarting Boxel
$ docker-compose restart boxel
```


##Boxelizing your face
Great. Now for the homestretch: Boxelizing your face.

Open up a new browser window and navigate to your Boxel container's web page,
which should just be served on `port 8080` on your docker machine.

Once you've got this page up, you can log in to the docker machine using its IP
as a user and "boxel" as the room name.

The web client you built all those README lines ago, should be streaming your
boxelized face into your browser window (*these frames are being published on
the Redis PUB/SUB channel "boxel" and can be drawn by subscribed clients on a Minecraft server*).

# License
This repository and its code are made available under a BSD 3-Clause license, which can be found [here](https://github.com/VerizonCraft/Boxel-demo/blob/master/LICENSE).

