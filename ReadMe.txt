----------==========##########    INST    ##########==========----------
--  Libs used:
    pip install django_crispy_strips

--  Other:
    Bootstraps
________________________________________________________________________
----------==========##########    VENV    ##########==========----------
--  Create new virtual environment
    python -m venv venv-name

--  Activate venv
    venv-name\Scripts\activate.bat

--  Install django(on activated venv)
    pip install django

--  Create project
    django-admin startproject project-name

--  Move to created project directory
    cd project-name
________________________________________________________________________
----------==========########## Migrations ##########==========----------
--  To check migrations:
    manage.py showmigrations

--  Generate migration scrips
    python manage.py makemigrations

--  Run migrations
    python manage.py migrate
________________________________________________________________________
----------==========##########   Admin   ##########==========----------
--  Create new super user:
    python manage.py createsuperuser
________________________________________________________________________
----------==========##########    Dev    ##########==========----------
--  Create new super user:
    python manage.py createsuperuser

--  Start new app in project:
    python manage.py startapp appname
    Add appname to settings.py -> INSTALLED_APPS = []

--  Add/Update model:
    Write new class in app/models.py
    Class uses models.Model
    Make migration
________________________________________________________________________