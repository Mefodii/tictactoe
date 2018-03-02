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