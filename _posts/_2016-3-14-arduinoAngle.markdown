---
layout: post
title:  "Flickerstrip combines the ESP8266 and a neopixel strip to make a graphical interface for building LED patterns."
description: Flickerstrip.com is live, subscribe to keep tabs on our progress!
author: julian
categories: news
---

When I discovered the ESP8266, I was ecstatic that I finally had a cheap way of connecting my Arduino to the internet. I started to work immediately hacking together a library to communicate with it over it's serial pins.

6 months later, the [arduino/esp8266](https://github.com/esp8266/Arduino) project cut out the middle man after I managed to upload my first Arduino sketch directly to the ESP8266. My initial excitement redoubled as I realized that the module had plenty of resources to run both the WiFi stack and a sketch of reasonable complexity. In fact, it's fair to say that the ESP8266 combined with the arduino/esp8266 project is one of the best Arduino's I've ever worked with.

A flurry of testing, programming, and tinkering followed this realization and I soon ended up with some basic sketches that implemented the various functionality that I would eventually need in the project. The primary features I managed to get working at that time included the webserver, driving a neopixel strip, and storing state in non-volatile memory.

From there, I started to assemble the pieces. What follows is a module by module description of Flickerstrip in a way that is hopefully useful to anyone working on a project that uses similar behavior.

Connecting to the home network
---------------------

For as basic and common a problem is, it's surprisingly difficult to nail down. Once the device has the WiFi credentials, it's of course no problem to connect to the WiFi network, but this device (like most IoT devices) doesn't have a keyboard (or alternative physical IO) that is suitable for configuring a WiFi network.

![A comparison of the four different configuration methods including requirements, pros, and cons of each](/resources/images/arduinoAngle/configurationComparison.png "Ultimately, configuring via WiFi made the most sense to us")

I considered a variety of approaches from configuring the credentials: via USB, via Bluetooth, and even via a "blinking" procedure that transmits the credentials from a smartphone or desktop screen using a phototransistor on the device. I liked the simplicity of programming via USB, but eventually decided to remove USB from our device to cut down the size, price, and complexity of the units. I pursued the idea of using a visual spectrum phototransistor to receive the configuration information from a smartphone or desktop computer but after tinkering with it a bit and considering alternatives, I ultimately abandoned it in favor of configuration via WiFi access point.

![A diagram showing the smartphone connecting to Flickerstrip and configuring it before both connect to the home network](/resources/images/arduinoAngle/wificonfiguration.png "Most of this process happens quickly and seamlessly without much user intervention")

One of the great features of the ESP8266 is the ability to create a WiFi network in "AP" (Access Point) mode. You can name your access point and communicate with devices that connect to it. The current implementation of the Flickerstrip firmware does just this. When an unconfigured Flickerstrip is powerd up, it creates the network "Flickerstrip" and waits for clients. The user connects to this network using their smartphone or desktop computer and accesses a web server running on the ESP8266 by connecting to 192.168.1.1. Accessing this address in a web browser presents a form to fill in your SSID and password.

![The WiFi configuration dialog has a field for SSID and password and the option to show the password](/resources/images/arduinoAngle/configureFlickerstrip.png "The dialog that's displayed when you connect to 192.168.1.1 on the Flickerstrip")

Once the credentials are submitted, the Flickerstrip takes down the access point and connects using the provided credentials.

The current implementation of this has a few outstanding improvements that I hope to make. The first is automating the actual configuration through an app. Right now, the user has to launch a web browser and manually type in the IP address. The final version will detect in the app whether you are connected to a Flickerstrip network and will automatically perform the configuration in a way that is seamless and convenient for the user.

Another improvement is how multiple unconfigured Flickerstrips behave. Currently, I actually have no idea what's going on when two Flickerstrips each attempt to create an access point. At the very best, you wouldn't really know which one you're communicating with. My plan to improve this is to make the Flickerstrip check for existing networks named "Flickerstrip" and connect to them. Once connected, they'll register themselves with the "master" so that when someone connects to this network to configure Flickerstrip, the master at the known address will be aware of the other Flickerstrips waiting to be configured and be able to both notify the user and propagate the credentials to all Flickerstrips that need to be configured.

Finally, a minor improvement I plan on making is to have each Flickerstrip remember multiple recently configured SSIDs so that a Flickerstrip can easily be brought back and forth between two or more locations and automatically configure itself based on the visible networks.

Discovering Flickerstrips
---------------------

Before I realized that there were already solutions to this problem, I rolled my own discovery protocol using UDP. It was a great experience and not too difficult and I highly recommend trying it at some point. I ultimately decided to use SSDP (Simple Service Discovery Protocol), however. Using an existing protocol has the advantage of making it easy for power users to discover their devices using scripts or applications and makes it significantly easier for other devices to integrate with Flickerstrip.

![A diagram showing the SSDP disovery process which consists of a probe, a probe match, a resolve, a resolve match and an HTTP status request and response](/resources/images/arduinoAngle/discovery.png "This discovery handshake is mostly taken care of by the SSDP library")

Setting up SSDP discovery was surprisingly easy. There was an existing Arduino library that worked perfectly out of the box with the ESP8266. Implementing it was a simple matter of filling out a few fields describing and naming the device. Once the device was set up, discovering it was an equally simple matter of dropping in some NodeJS code from the node-ssdp documentation.

The only disadvantage of using SSDP is that it provides no way of discovering your device without the use of a companion app of some sort. If you need users to be able to discover devices using their web browser, you may consider instead using mDNS (Multicast DNS) which makes is possible to give your device a user-friendly name on the network. e.g. http://flickerstrip.local

Controlling Flickerstrip
---------------------

On the client side (the smartphone or computer), discovery essentially returns a list of IP addresses where Flickerstrips have been found. This information eventually makes it to the UI as a list of "connected" strips. Now that we know where these strips are, we need to know more about them. After abandoning an initial implementation that involved opening up a TCP socket with each strip and maintaining it while the device is connected, I changed my implementation to run a minimal HTTP server on the Flickerstrip. Fortunately, the arduino/esp8266 project makes this extremely easy to do. Because Flickerstrip was going to be communicating primarily with NodeJS clients, I elected to use JSON as the primary transport mechanism.

![The main desktop interface shows the list of connected Flickerstrips to the left and the currently loaded patterns to the right](/resources/images/arduinoAngle/mainInterface.png "The Flickerstrip UI lets users control each strip and upload lightworks")

The first thing that the client does upon discovering a new strip is to make a request via GET to /status, an endpoint that responds with all the details of the strip's configuration and state including the mac address (used as a unique ID), and loaded pattern information. On the Flickerstrip, this response is generated using the ArduinoJSON library (which I highly recommend as being very high quality, easy to use, and stable) and sent to the client. The client parses this and populates the appropriate models and updates the interface.

There are a number of similar HTTP endpoints that perform various tasks. I've tried to keep a relatively consistent REST-like API although at this point I'm sure a REST purist would find my implementation somewhat lacking in particular in the verb department. I definitely plan on refining this API before launching.

The most interesting endpoints are the ones that handle pattern upload and management. The simple ones allow you to select and delete a pattern that is loaded onto the 4Mb auxiliary flash chip. A pattern consists of a name, an FPS and a block of pixel data that represents the value of each pixel in the strip for each frame in the pattern.

Instead of transmitting this pixel data as JSON, this data is uploaded as a binary chunk in order to save some time during pattern upload.

The lightwork designer interface
---------------------

When I was initially developing Flickerstrip, I wasn't sure exactly how I wanted to store patterns. I had considered briefly a domain specific language that could be executed on the device, but eventually decided that the simplicity gained by storing the raw pixel data outweighed the additional functionality and storage economy that may have been possible otherwise.

Storing pixel data eventually made me realize that this had the potential of opening up a new potential method of programming Flickerstrip. Because the stored pixel data is essentially a bitmap RGB image, it's easy to imagine editing it as you would an image. The lightwork designer is just that: a pixel editor that's oriented toward creating LED animations for display on a strip. In addition to offering the basic functionality you might expect in a graphical pixel editor, the lightwork designer allows import and export of lightworks as image files. These files can easily be edited in a different program and then reimported and uploaded to the strip as a pattern.

![The lightwork designer consists of a preview of the pattern toward the top of the interface and a pixel editor below](/resources/images/arduinoAngle/LightworkEditor.png "The lightwork editor allows users to easily create and edit animated patterns in a graphical interface")

The power of the lightwork designer is that it brings the world of LED art to a non-technical crowd. Anyone reading this is likely to have some basic programming skills and would have no problem describing a lightstrip pattern as a couple of lines of code, but many artistic people don't have that ability. The lightwork designer makes it easy for anyone to create lightworks using an intuitive graphical interface.

The lightwork repository
---------------------

![The lightwork repository interface shows a list of lightworks made by others on the left and a preview of the selected lightwork on the right](/resources/images/arduinoAngle/downloadLightworks.png "The lightwork repository provides discovery of light art created by others and an inspiration for future works")

The lightwork repository is probably the most currently underdeveloped aspect of Flickerstrip, but it's also one of the elements that provides the most potential. After building a lightwork using the interface, you can choose to share that lightwork with others by uploading it to the repository. Once uploaded, other users can download the lightworks, try them out on their strip and rate them. The hope is that this repository will help high quality lightworks bubble to the top and let users find them. The user-contributed variety will also provide inspiration for individuals who are looking to create their own lightworks.




Learn more about Flickerstrip by heading over to the [Kickstarter page](https://www.kickstarter.com/projects/hohmbody/1703842508?token=c141b3ff).
