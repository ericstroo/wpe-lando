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

if [ $1 = '--mode=plDB' ]; then
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

if [ $1 = '--mode=puDB' ]; then
  echo 'Backing up the database'
  wp db export db.sql
  echo 'Uploading the database'
  scp db.sql $HOSTNAME:$DIR/db.sql
  echo 'Cleaning up our messes'
  rm db.sql
  APP=$LANDO_APP_NAME
  DOMAIN=$LANDO_DOMAIN
  url=https://$APP.$DOMAIN
  echo 'Import the database'
  ssh -t $HOSTNAME "cd ${DIR} && wp db import db.sql"
  old=$(wp option get siteurl) && echo $old
  wp search-replace $url $old
  ssh -t $HOSTNAME "cd ${DIR} && rm db.sql"
fi

if [ $1 = '--mode=plFS' ]; then
  echo 'RSYNC DOWN'
  rsync -avz $HOSTNAME:$DIR/wp-content/uploads/ wp-content/

fi

if [ $1 = '--mode=puFS' ]; then
  echo 'RSYNC UP'
  rsync -avz wp-content/uploads/ $HOSTNAME:$DIR/wp-content/uploads/
  # echo 'Import the database'
fi
