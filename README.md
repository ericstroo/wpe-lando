# The WordPress Engine Lando Build
One of the many joys and great pains of working in a modern agency is that we do not always get to pick where our clients host their sites. Sometimes it's Pantheon, other times it's WordPress Engine, and even other times it's Uncle Eddie's Website Emporium&trade;.

One of the greatest hardships of this world is that tooling an environment that works is a lot of work. Recently, however, Lando took the idea of `docker compose` and gave the user the ability to modify the configuration in some YAML goodness. 

Lando works out of the box with Pantheon and termnius. It's dead simple. WordPress Engine, on the other hand, bought Local by Flywheel. Local is a great tool, but it's a bit of black box and is very opinionated. It makes it easy to do work on WordPress Engine, but I find it gets in the way a little too much for taste. Thankfully, they do have an SSH Gateway which we can use for things like wp-cli commands, scp, and rsync. Basically, we can do the entire workflow in a shell if only someone scripted it. So we did.

This has the advantage of being flexible enough that a light config change or two could make it work for any site that has an SSH gateway and wp-cli access.

## Getting a build
From 0 to runtime, it should be straight forward:

 1. Clone this repo wherever you want to begin a WPE project
 2. Change the `.lando.yml` file to meet your project needs (at least the name field, though you might want to change some of the services and tooling if Composer and Gulp aren't your thing).
 3. Edit the `connect.sh` with your site environment variables. They should be findable in your WordPress Engine control panel. 
 4. `lando start` will get you a working website. It'll attempt to create the wp-config files and also create a dummy install of wordpress. (Note: the dummy install step doesn't always work for #reasons I don't know about you).
 5. `lando download:db` and Lando will connect to WPE over SSH, perform some wp-cli commands, scp the exported database, import it, delete the exported database, and perform a search and replace to match the lando site domain.
 6. `lando download:media` will grab the uploads directory and rsync it down.

There are also upload versions of those same scripts. The system assumes that plugins and themes are under some form of dependent control and/or version control. The system wants you to push code up over git and pull down database and uploads over scp/rsync. 

## Other Things
I like gulp so I tooled it up to be my frontend build system. Play around with the gulpfile.js if you want to wire that up to do things like sass and JS builds. Still early days there. I also like composer so plugins are managed using wp-packagist. You can add env files to .lando.yml if you want to source env files that get used for things like premium plugins.

Credits:
* [Lando](https://github.com/lando/), for being awesome.
* Rubidiot for giving me the idea of shell scripting with his (much better written and very clever full-on Docker answer) https://github.com/rubidot/WPUtil/
* The [ComputerCourage](www.computercourage.com) dev team who helped prove the concept with me.

