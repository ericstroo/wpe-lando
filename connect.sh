#!/bin/bash

if [ $2 = '--env=PRD' ]; then
  HOSTNAME='site@site.ssh.wpengine.net'
  DIR='sites/site'
fi

if [ $2 = '--env=STG' ]; then
  HOSTNAME='sitestg@sitestg.ssh.wpengine.net'
  DIR='sites/sitestg'
fi

if [ $2 = '--env=DEV' ]; then
  HOSTNAME='sitedev@sitedev.ssh.wpengine.net'
  DIR='sites/sitedev'
fi

if [ $1 = '--mode=DB' ]; then
  echo 'Backing up the database'
  ssh -t $HOSTNAME "cd ${DIR} && wp db export db.sql"
  echo 'Downloading the database'
  scp $HOSTNAME:$DIR/db.sql db.sql
  echo 'Cleaning up our messes'
  ssh -t $HOSTNAME "cd ${DIR} && rm db.sql"
  APP=$LANDO_APP_NAME
  DOMAIN=$LANDO_DOMAIN
  url=https://$APP.$DOMAIN
  echo 'Import the database'
  wp db import db.sql
  old=$(wp option get siteurl) && echo $old
  wp search-replace $old $url
fi

if [ $1 = '--mode=FS' ]; then
  echo 'RSYNC'
  rsync -avz $HOSTNAME:$DIR/wp-content/uploads wp-contentc
  
fi
