---
layout: legacy
title: Flickerstrip
description: Take control of your lights. Flickerstrip lets you set the mood, create your own light show, or 
navigation:
    exclude: true
author: Julian Hartline
header: min
---

<h1>Press Kit</h1>

<h2>About</h2>
<div class="media attribution">
	<a href="resources/images/mediakit/julian.jpg" class="img">
		<img src="resources/images/mediakit/julian.jpg" alt="me" width="300px" />
	</a>

	<div class="bd">
		<p>
			Born in Hawaii, Julian Hartline earned his degree in Computer Science in Chicago before moving to the technology oasis of Silicon Valley. Working a software job for 5 years, he eventually left his company to co-create Reflowster, a Kickstarter-funded and maker-oriented reflow soldering oven. After making 150% of its $10k funding goal, the Reflowster team delivered in only 8 months, preempting their predicted delivery date. Following successful delivery, Julian oversaw Reflowster's continued manufacturing and sales including engaging a manufacturer to assemble Reflowsters and starting up the Reflowster web store.
		</p>
		
		<p>
			With Reflowster running smoothly, Julian turned his attentions to Flickerstrip. Born out of a passion for smarthome gadgets and inspired by the next generation of neopixel art, Flickerstrip is the first pattern-capable LED strip available to the consumer market. Flickerstrip aims to make the LED art accessible to everyone and no longer limited to programmers and tinkerers. With Flickerstrip, anyone can bring their creativity to light.
		</p>
	</div>
</div>

<h2>Press Releases and Articles</h2>
<div class="press_releases">
    {% directory path: press exclude: smaller %}
        {% capture path %}press/{{ file.name }}/name.txt{% endcapture %}
        <div class="release">
            <h4>{% include_relative {{path}} %}</h4>
            <ul class='smalllinks'>
                <li>
                    <a href='press/{{ file.name }}/web.html'>web</a>
                </li>
                <li>
                    <a href='press/{{ file.name }}/{{ file.name }}.pdf'>pdf</a>
                </li>
                <li>
                    <a href='press/{{ file.name }}/{{ file.name }}.markdown'>markdown</a>
                </li>
            </ul>
        </div>
    {% enddirectory %}
</div>


<h2>Logo</h2>
<div class="textcentered">
	<div class="logobg">
		<img src="resources/images/mediakit/logo.png" />
	</div>
	<div class="logobg">
		<img src="resources/images/mediakit/f.png" />
	</div>
	
	<br/>
	<br/>
	
	<div class="narrow centered">
		Logo on the left should be used on both light and dark backgrounds. Logo on the right is for use only for certain monochrome media. (eg. engraving, PCB silk screen, or etching)
		<br/>
		<br/>
		<a href='resources/images/mediakit/logos.zip' class="btn">Download Logo Bundle</a>
	</div>
</div>

<h2>Photos</h2>
<div class="photogallery">
    {% directory path: resources/images/mediakit/photos exclude: smaller %}
        <a href='/resources/images/mediakit/photos/{{ file.name }}'><img src='/resources/images/mediakit/photos/smaller/{{ file.name }}' /></a>
    {% enddirectory %}
</div>

<br/>

<div class="textcentered">
	<a href='resources/images/mediakit/photos.zip' class="btn">Download Image Bundle</a>
</div>

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>












