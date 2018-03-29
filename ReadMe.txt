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

-- Create new page/url django design:
    Add processing logic to new def function in view.py
	    • Function must return an html file
		    ○ Render
		    ○ Redirect - to another url which uses another view
	    • Use decorator if needed. Ex: @login_required
    Add new view to the url.py (in same app)
	    • Better give a name to the new url
    Create html file which will be used
________________________________________________________________________